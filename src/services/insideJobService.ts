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
    customer_id: string;
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
}

export default new InsideJobService();
