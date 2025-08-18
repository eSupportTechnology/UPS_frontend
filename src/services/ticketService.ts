import api from '../config/api.config';
import type { CreateTicketData, Ticket, TicketResponse, TicketsListResponse, TicketStatsResponse, TicketFilters } from '../types/ticket.types';

class TicketService {
    async createTicket(ticketData: CreateTicketData): Promise<TicketResponse> {
        try {
            const formData = new FormData();

            formData.append('customer_id', ticketData.customer_id.toString());
            formData.append('title', ticketData.title);
            formData.append('description', ticketData.description);

            if (ticketData.photos && ticketData.photos.length > 0) {
                const maxSize = 5 * 1024 * 1024;
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const validFiles: File[] = [];

                for (const photo of ticketData.photos) {
                    if (!allowedTypes.includes(photo.type)) {
                        throw new Error(`File "${photo.name}" is not a valid image type. Only JPEG, JPG, and PNG are allowed.`);
                    }

                    if (photo.size > maxSize) {
                        throw new Error(`File "${photo.name}" is too large. Maximum size is 5MB.`);
                    }

                    validFiles.push(photo);
                }

                validFiles.forEach((photo, index) => {
                    formData.append(`photos[${index}]`, photo);
                });
            }

            const response = await api.post('/create-ticket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                message: response.data.message || 'Ticket created successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Create ticket error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to create ticket',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: error.code === 'ECONNABORTED' ? 'Request timed out. Please check if the server is running and try again.' : 'Network error. Please check your connection and try again.',
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.',
                };
            }
        }
    }

    async getCustomerTickets(customerId?: number, filters?: TicketFilters): Promise<TicketsListResponse> {
        try {
            const params = new URLSearchParams();

            let endpoint = '';
            if (customerId) {
                endpoint = `/tickets-customer/${customerId}`;
            } else {
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        if (!user || !user.id) {
                            throw new Error('Invalid user data');
                        }
                        endpoint = `/tickets-customer/${parseInt(user.id)}`;
                    } catch (parseError) {
                        throw new Error('Invalid user data format');
                    }
                } else {
                    throw new Error('User not authenticated');
                }
            }

            if (filters) {
                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
                }
                if (filters.priority && filters.priority !== 'all') {
                    params.append('priority', filters.priority);
                }
                if (filters.search) {
                    params.append('search', filters.search);
                }
                if (filters.page) {
                    params.append('page', filters.page.toString());
                }
                if (filters.per_page) {
                    params.append('per_page', filters.per_page.toString());
                }
            }

            const queryString = params.toString();
            const url = queryString ? `${endpoint}?${queryString}` : endpoint;

            const response = await api.get(url);
            console.log('Raw API response:', response);
            console.log('Raw response data:', response.data);

            let tickets = [];
            let pagination = null;

            if (response.data.data?.tickets) {
                tickets = response.data.data.tickets;
                pagination = response.data.data.pagination || response.data.pagination;
            } else if (response.data.tickets) {
                if (response.data.tickets.data) {
                    tickets = response.data.tickets.data;
                    pagination = {
                        current_page: response.data.tickets.current_page,
                        per_page: response.data.tickets.per_page,
                        total: response.data.tickets.total,
                        last_page: response.data.tickets.last_page,
                    };
                } else if (Array.isArray(response.data.tickets)) {
                    tickets = response.data.tickets;
                    pagination = response.data.pagination;
                }
            } else if (Array.isArray(response.data.data)) {
                tickets = response.data.data;
                pagination = response.data.pagination;
            } else if (Array.isArray(response.data)) {
                tickets = response.data;
            }

            console.log('Parsed tickets:', tickets);
            console.log('Parsed pagination:', pagination);

            return {
                success: true,
                message: 'Tickets retrieved successfully',
                data: {
                    tickets,
                    pagination,
                },
            };
        } catch (error: any) {
            console.error('Get tickets error:', error);
            console.log('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
            });

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || `API Error ${error.response.status}: Failed to retrieve tickets`,
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: error.code === 'ECONNABORTED' ? 'Request timed out. Please check if the server is running and try again.' : 'Network error. Please check your connection and try again.',
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.',
                };
            }
        }
    }

    async getTicketById(ticketId: string | number): Promise<TicketResponse> {
        try {
            const targetTicketId = typeof ticketId === 'string' ? parseInt(ticketId) : ticketId;

            const customerTicketsResponse = await this.getCustomerTickets();

            if (customerTicketsResponse.success && customerTicketsResponse.data && customerTicketsResponse.data.tickets) {
                const tickets = Array.isArray(customerTicketsResponse.data.tickets) ? customerTicketsResponse.data.tickets : [];

                const foundTicket = tickets.find((ticket) => {
                    const ticketIdNum = typeof ticket.id === 'string' ? parseInt(ticket.id) : ticket.id;
                    return ticketIdNum === targetTicketId;
                });

                if (foundTicket) {
                    return {
                        success: true,
                        message: 'Ticket retrieved successfully',
                        data: foundTicket,
                    };
                } else {
                    return {
                        success: false,
                        message: 'Ticket not found or you do not have access to this ticket',
                    };
                }
            } else {
                return {
                    success: false,
                    message: customerTicketsResponse.message || 'Failed to retrieve customer tickets',
                };
            }
        } catch (error: any) {
            console.error('Get ticket error:', error);
            console.log('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status,
            });

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || `API Error ${error.response.status}: Failed to retrieve ticket`,
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: error.code === 'ECONNABORTED' ? 'Request timed out. Please check if the server is running and try again.' : 'Network error. Please check your connection and try again.',
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.',
                };
            }
        }
    }

    async getRecentTickets(customerId?: string): Promise<TicketsListResponse> {
        try {
            let endpoint = '';
            if (customerId) {
                endpoint = `/tickets-customer/${customerId}`;
            } else {
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        if (!user || !user.id) {
                            throw new Error('Invalid user data');
                        }
                        endpoint = `/tickets-customer/${parseInt(user.id)}`;
                    } catch (parseError) {
                        throw new Error('Invalid user data format');
                    }
                } else {
                    throw new Error('User not authenticated');
                }
            }

            const response = await api.get(`${endpoint}?per_page=5&page=1`);

            let tickets = [];
            let pagination = null;

            if (response.data.data?.tickets) {
                tickets = response.data.data.tickets;
                pagination = response.data.data.pagination || response.data.pagination;
            } else if (response.data.tickets) {
                if (response.data.tickets.data) {
                    tickets = response.data.tickets.data;
                    pagination = {
                        current_page: response.data.tickets.current_page,
                        per_page: response.data.tickets.per_page,
                        total: response.data.tickets.total,
                        last_page: response.data.tickets.last_page,
                    };
                } else if (Array.isArray(response.data.tickets)) {
                    tickets = response.data.tickets;
                    pagination = response.data.pagination;
                }
            } else if (Array.isArray(response.data.data)) {
                tickets = response.data.data;
                pagination = response.data.pagination;
            } else if (Array.isArray(response.data)) {
                tickets = response.data;
            }

            return {
                success: true,
                message: 'Recent tickets retrieved successfully',
                data: {
                    tickets,
                    pagination,
                },
            };
        } catch (error: any) {
            console.error('Get recent tickets error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve recent tickets',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: error.code === 'ECONNABORTED' ? 'Request timed out. Please check if the server is running and try again.' : 'Network error. Please check your connection and try again.',
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.',
                };
            }
        }
    }

   
}
export const ticketService = new TicketService();
export default ticketService;
