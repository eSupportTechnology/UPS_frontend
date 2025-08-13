import api from '../config/api.config';
import type { CreateTicketData, Ticket, TicketResponse, TicketsListResponse, TicketStatsResponse, TicketFilters } from '../types/ticket.types';

class TicketService {
    /**
     * Create a new ticket
     */
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

    /**
     * Get all tickets for a customer
     */
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

            // Standardize response structure - try different API response formats
            let tickets = [];
            let pagination = null;

            if (response.data.data?.tickets) {
                // Format: { data: { tickets: [...], pagination: {...} } }
                tickets = response.data.data.tickets;
                pagination = response.data.data.pagination || response.data.pagination;
            } else if (response.data.tickets) {
                // Check if it's a Laravel paginated object
                if (response.data.tickets.data) {
                    // Format: { tickets: { data: [...], current_page: ..., etc } }
                    tickets = response.data.tickets.data;
                    pagination = {
                        current_page: response.data.tickets.current_page,
                        per_page: response.data.tickets.per_page,
                        total: response.data.tickets.total,
                        last_page: response.data.tickets.last_page,
                    };
                } else if (Array.isArray(response.data.tickets)) {
                    // Format: { tickets: [...], pagination: {...} }
                    tickets = response.data.tickets;
                    pagination = response.data.pagination;
                }
            } else if (Array.isArray(response.data.data)) {
                // Format: { data: [...] }
                tickets = response.data.data;
                pagination = response.data.pagination;
            } else if (Array.isArray(response.data)) {
                // Format: [...]
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

    /**
     * Get a specific ticket by ID
     */
    async getTicketById(ticketId: string | number): Promise<TicketResponse> {
        try {
            const response = await api.get(`/tickets/${ticketId}`);

            return {
                success: true,
                message: 'Ticket retrieved successfully',
                data: response.data.data?.ticket || response.data.ticket || response.data.data,
            };
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

    /**
     * Update ticket status
     */
    async updateTicketStatus(ticketId: string, status: string): Promise<TicketResponse> {
        try {
            const response = await api.patch(`/tickets/${ticketId}/status`, {
                status: status,
            });

            return {
                success: true,
                message: response.data.message || 'Ticket status updated successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Update ticket status error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to update ticket status',
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

    /**
     * Add a comment to a ticket
     */
    async addTicketComment(ticketId: string, comment: string): Promise<TicketResponse> {
        try {
            const response = await api.post(`/tickets/${ticketId}/comments`, {
                comment: comment,
            });

            return {
                success: true,
                message: response.data.message || 'Comment added successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Add comment error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to add comment',
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

    /**
     * Delete a ticket
     */
    async deleteTicket(ticketId: string): Promise<TicketResponse> {
        try {
            const response = await api.delete(`/tickets/${ticketId}`);

            return {
                success: true,
                message: response.data.message || 'Ticket deleted successfully',
            };
        } catch (error: any) {
            console.error('Delete ticket error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to delete ticket',
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

    /**
     * Upload additional files to an existing ticket
     */
    async uploadTicketFiles(ticketId: string, files: File[]): Promise<TicketResponse> {
        try {
            const formData = new FormData();

            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });

            const response = await api.post(`/tickets/${ticketId}/files`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                message: response.data.message || 'Files uploaded successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Upload files error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to upload files',
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

    /**
     * Get recent tickets for sidebar (last 5)
     */
    async getRecentTickets(customerId?: string): Promise<TicketsListResponse> {
        try {
            let endpoint = '';
            if (customerId) {
                endpoint = `/tickets-customer/${customerId}`;
            } else {
                // Get user from localStorage
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
                // Format: { data: { tickets: [...], pagination: {...} } }
                tickets = response.data.data.tickets;
                pagination = response.data.data.pagination || response.data.pagination;
            } else if (response.data.tickets) {
                // Check if it's a Laravel paginated object
                if (response.data.tickets.data) {
                    // Format: { tickets: { data: [...], current_page: ..., etc } }
                    tickets = response.data.tickets.data;
                    pagination = {
                        current_page: response.data.tickets.current_page,
                        per_page: response.data.tickets.per_page,
                        total: response.data.tickets.total,
                        last_page: response.data.tickets.last_page,
                    };
                } else if (Array.isArray(response.data.tickets)) {
                    // Format: { tickets: [...], pagination: {...} }
                    tickets = response.data.tickets;
                    pagination = response.data.pagination;
                }
            } else if (Array.isArray(response.data.data)) {
                // Format: { data: [...] }
                tickets = response.data.data;
                pagination = response.data.pagination;
            } else if (Array.isArray(response.data)) {
                // Format: [...]
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

    /**
     * Get ticket statistics for dashboard
     */
    async getTicketStats(customerId?: number): Promise<TicketStatsResponse> {
        try {
            const params = customerId ? `?customer_id=${customerId}` : '';
            const response = await api.get(`/tickets/stats${params}`);

            return {
                success: true,
                message: 'Statistics retrieved successfully',
                data: response.data.stats || response.data.data,
            };
        } catch (error: any) {
            console.error('Get ticket stats error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve statistics',
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
