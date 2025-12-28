import api from '../config/api.config';
import type {
    ConvertToInsideJobData,
    InspectionData,
    QuoteData,
    ApprovalData,
    StartRepairData,
    CompleteInsideJobData,
    InsideJobTicket,
} from '../types/ticket.types';

interface CreateInsideJobDirectData {
    customer_id?: string;
    customer_name?: string;
    customer_phone?: string;
    title: string;
    description: string;
    ups_serial_number: string;
    ups_model: string;
    ups_brand: string;
    priority?: string;
    assigned_to?: string;
    district?: string;
    city?: string;
    gramsewa_division?: string;
}

class InsideJobService {
    async convertToInsideJob(data: ConvertToInsideJobData) {
        try {
            const response = await api.post('/tickets/convert-to-inside-job', data);
            return {
                success: true,
                message: response.data.message || 'Inside job created successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Convert to inside job error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to convert to inside job',
                errors: error.response?.data?.errors,
            };
        }
    }

    async createInsideJobDirect(data: CreateInsideJobDirectData) {
        try {
            const response = await api.post('/inside-jobs/create-direct', data);
            return {
                success: true,
                message: response.data.message || 'Inside job created successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Create inside job direct error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create inside job',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getInsideJobs(page: number = 1, perPage: number = 15) {
        try {
            const response = await api.get('/inside-jobs', {
                params: { page, per_page: perPage },
            });
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Get inside jobs error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch inside jobs',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getJobCard(ticketId: string) {
        try {
            const response = await api.get(`/inside-jobs/${ticketId}/job-card`);
            return {
                success: true,
                data: response.data.data as InsideJobTicket,
            };
        } catch (error: any) {
            console.error('Get job card error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch job card',
                errors: error.response?.data?.errors,
            };
        }
    }

    async inspect(data: InspectionData) {
        try {
            const response = await api.post('/inside-jobs/inspect', data);
            return {
                success: true,
                message: response.data.message || 'Inspection recorded successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Inspect inside job error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to record inspection',
                errors: error.response?.data?.errors,
            };
        }
    }

    async createQuote(data: QuoteData) {
        try {
            const response = await api.post('/inside-jobs/create-quote', data);
            return {
                success: true,
                message: response.data.message || 'Quote created successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Create quote error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create quote',
                errors: error.response?.data?.errors,
            };
        }
    }

    async approveQuote(data: ApprovalData) {
        try {
            const response = await api.post('/inside-jobs/approve-quote', data);
            return {
                success: true,
                message: response.data.message || 'Quote approval processed successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Approve quote error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to process approval',
                errors: error.response?.data?.errors,
            };
        }
    }

    async startRepair(data: StartRepairData) {
        try {
            const response = await api.post('/inside-jobs/start-repair', data);
            return {
                success: true,
                message: response.data.message || 'Repair started successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Start repair error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to start repair',
                errors: error.response?.data?.errors,
            };
        }
    }

    async completeInsideJob(data: CompleteInsideJobData) {
        try {
            const response = await api.post('/inside-jobs/complete', data);
            return {
                success: true,
                message: response.data.message || 'Inside job completed successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Complete inside job error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to complete inside job',
                errors: error.response?.data?.errors,
            };
        }
    }

    /**
     * Unified method to update job status via Kanban drag-and-drop
     * Maps status transitions to appropriate API endpoints
     */
    async updateJobStatus(
        ticketId: string,
        oldStatus: string,
        newStatus: string
    ): Promise<{ success: boolean; message?: string; data?: any; errors?: any }> {
        try {
            // Allow any transition between statuses
            // Primary flow
            if (newStatus === 'in_repair') {
                return this.startRepair({
                    ticket_id: ticketId,
                });
            }

            if (newStatus === 'completed') {
                return this.completeInsideJob({
                    ticket_id: ticketId,
                    repair_notes: 'Job status updated from Kanban board',
                });
            }

            if (newStatus === 'quote_rejected') {
                return this.approveQuote({
                    ticket_id: ticketId,
                    approved: false,
                    notes: 'Quote rejected from Kanban board',
                });
            }

            if (newStatus === 'pending_inspection') {
                // Generic status update for moving back to pending inspection
                return await api.post('/inside-jobs/update-status', {
                    ticket_id: ticketId,
                    status: 'pending_inspection',
                });
            }

            return {
                success: false,
                message: `Invalid status: ${newStatus}`,
            };
        } catch (error: any) {
            console.error('Update job status error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update job status',
                errors: error.response?.data?.errors,
            };
        }
    }
}

export default new InsideJobService();
