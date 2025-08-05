import api from '../config/api.config';
import type { CreateTicketData, Ticket, TicketResponse, TicketsListResponse, TicketStatsResponse, TicketFilters } from '../types/ticket.types';

class TicketService {
    /**
     * Create a new ticket
     */
    async createTicket(ticketData: CreateTicketData): Promise<TicketResponse> {
        try {
            const formData = new FormData();

            // Create FormData for multipart/form-data request
            const formData = new FormData();

            // Append basic ticket data
            formData.append('customer_id', ticketData.customer_id.toString());
            formData.append('title', ticketData.title);
            formData.append('description', ticketData.description);

            // Append photos if provided
            if (ticketData.photos && ticketData.photos.length > 0) {
                ticketData.photos.forEach((photo, index) => {
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
                // Server responded with error status
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to create ticket',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                // Request was made but no response received
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
                };
            } else {
                // Something else happened
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

            if (customerId) {
                params.append('customer_id', customerId.toString());
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
            const url = queryString ? `/tickets?${queryString}` : '/tickets';

            const response = await api.get(url);

            return {
                success: true,
                message: 'Tickets retrieved successfully',
                data: {
                    tickets: response.data.tickets || response.data.data || [],
                    pagination: response.data.pagination,
                },
            };
        } catch (error: any) {
            console.error('Get tickets error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve tickets',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
    async getTicketById(ticketId: string): Promise<TicketResponse> {
        try {
            const response = await api.get(`/tickets/${ticketId}`);

            return {
                success: true,
                message: 'Ticket retrieved successfully',
                data: response.data.ticket || response.data.data,
            };
        } catch (error: any) {
            console.error('Get ticket error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve ticket',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
                    message: 'Network error. Please check your connection and try again.',
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
                    message: 'Network error. Please check your connection and try again.',
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
                    message: 'Network error. Please check your connection and try again.',
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
                    message: 'Network error. Please check your connection and try again.',
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
     * Get all tickets (Super Admin)
     */
    async getAllTickets(filters: TicketFilters = {}): Promise<TicketsListResponse> {
        try {
            const params = new URLSearchParams();

            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.per_page) params.append('per_page', filters.per_page.toString());

            const response = await api.get(`/all-tickets?${params.toString()}`);

            if (response.data && response.data.tickets) {
                return {
                    success: true,
                    message: 'Tickets retrieved successfully',
                    data: {
                        tickets: response.data.tickets.data || [],
                        data: response.data.tickets.data || [],
                        pagination: {
                            current_page: response.data.tickets.current_page || 1,
                            last_page: response.data.tickets.last_page || 1,
                            per_page: response.data.tickets.per_page || 10,
                            total: response.data.tickets.total || 0,
                        },
                    },
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid response format',
                };
            }
        } catch (error: any) {
            console.error('Get all tickets error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve tickets',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
     * Update a ticket (Super Admin)
     */
    async updateTicket(ticketId: string, ticketData: any): Promise<TicketResponse> {
        try {
            const response = await api.put(`/update-ticket/${ticketId}`, ticketData);

            return {
                success: true,
                message: 'Ticket updated successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Update ticket error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to update ticket',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
     * Assign a ticket to a technician (Super Admin)
     */
    async assignTicket(ticketId: string, technicianId: string): Promise<TicketResponse> {
        try {
            const response = await api.post('/assign-ticket', {
                ticket_id: ticketId,
                assigned_to: technicianId,
            });

            return {
                success: true,
                message: 'Ticket assigned successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Assign ticket error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to assign ticket',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
     * Update ticket priority using assign endpoint (Super Admin)
     */
    async updateTicketPriority(ticketId: string, priority: string, currentAssignedTo?: number | null): Promise<TicketResponse> {
        try {
            const response = await api.post('/assign-ticket', {
                ticket_id: ticketId,
                assigned_to: currentAssignedTo || null,
                priority: priority,
            });

            return {
                success: true,
                message: 'Ticket priority updated successfully',
                data: response.data.ticket,
            };
        } catch (error: any) {
            console.error('Update ticket priority error:', error);

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to update ticket priority',
                    errors: error.response.data.errors || error.response.data,
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: 'Network error. Please check your connection and try again.',
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
                    message: 'Network error. Please check your connection and try again.',
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

const ticketServiceInstance = new TicketService();
export { ticketServiceInstance as TicketService };
export default ticketServiceInstance;
