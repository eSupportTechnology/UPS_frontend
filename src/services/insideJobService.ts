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

    async getInsideJobs(
        page: number = 1,
        perPage: number = 15,
        filters?: {
            search?: string;
            status?: string[];
            priority?: string;
            technician?: string;
            fromDate?: string;
            toDate?: string;
            today?: boolean;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        }
    ) {
        try {
            const params: Record<string, any> = { page, per_page: perPage };

            if (filters) {
                if (filters.search) params.search = filters.search;
                if (filters.status && filters.status.length > 0) params.status = filters.status.join(',');
                if (filters.priority) params.priority = filters.priority;
                if (filters.technician) params.technician = filters.technician;
                if (filters.fromDate) params.from_date = filters.fromDate;
                if (filters.toDate) params.to_date = filters.toDate;
                if (filters.today) params.today = 'true';
                if (filters.sortBy) params.sort_by = filters.sortBy;
                if (filters.sortOrder) params.sort_order = filters.sortOrder;
            }

            const response = await api.get('/inside-jobs', { params });
            return {
                success: true,
                data: response.data.data,
                statusCounts: response.data.status_counts || {},
                filtersApplied: response.data.filters_applied || {},
            };
        } catch (error: any) {
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

    async addPlannedMaterial(data: {
        ticket_id: string;
        inventory_id: string;
        product_name: string;
        brand?: string;
        category?: string;
        quantity: number;
    }) {
        try {
            const response = await api.post('/inside-jobs/add-material', data);
            return {
                success: true,
                message: response.data.message || 'Material added successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Add material error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add material',
                errors: error.response?.data?.errors,
            };
        }
    }

    async removePlannedMaterial(materialId: string) {
        try {
            const response = await api.post('/inside-jobs/remove-material', {
                material_id: materialId,
            });
            return {
                success: true,
                message: response.data.message || 'Material removed successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Remove material error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove material',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getPlannedMaterials(ticketId: string) {
        try {
            const response = await api.get(`/inside-jobs/${ticketId}/materials`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Get materials error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to get materials',
                data: [],
            };
        }
    }

    async updateMaterialQuantity(materialId: string, quantity: number) {
        try {
            const response = await api.post('/inside-jobs/update-material-quantity', {
                material_id: materialId,
                quantity: quantity,
            });
            return {
                success: true,
                message: response.data.message || 'Quantity updated successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update quantity',
                errors: error.response?.data?.errors,
            };
        }
    }

    async rejectJob(ticketId: string, reason: string, rollbackMaterialIds: string[]) {
        try {
            const response = await api.post('/inside-jobs/reject', {
                ticket_id: ticketId,
                reason: reason,
                rollback_material_ids: rollbackMaterialIds,
            });
            return {
                success: true,
                message: response.data.message || 'Job rejected successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reject job',
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
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update job status',
                errors: error.response?.data?.errors,
            };
        }
    }

    // Export methods
    getExportUrl(
        type: 'pdf' | 'excel',
        filters?: {
            search?: string;
            status?: string[];
            priority?: string;
            technician?: string;
            fromDate?: string;
            toDate?: string;
            today?: boolean;
        }
    ): string {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const endpoint = type === 'pdf' ? '/inside-jobs/export/pdf' : '/inside-jobs/export/excel';

        const params = new URLSearchParams();

        if (filters) {
            if (filters.search) params.append('search', filters.search);
            if (filters.status && filters.status.length > 0) params.append('status', filters.status.join(','));
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.technician) params.append('technician', filters.technician);
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.today) params.append('today', 'true');
        }

        const queryString = params.toString();
        return `${baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
    }

    async exportPdf(filters?: {
        search?: string;
        status?: string[];
        priority?: string;
        technician?: string;
        fromDate?: string;
        toDate?: string;
        today?: boolean;
    }): Promise<void> {
        const url = this.getExportUrl('pdf', filters);
        window.open(url, '_blank');
    }

    async exportExcel(filters?: {
        search?: string;
        status?: string[];
        priority?: string;
        technician?: string;
        fromDate?: string;
        toDate?: string;
        today?: boolean;
    }): Promise<void> {
        const url = this.getExportUrl('excel', filters);
        window.open(url, '_blank');
    }
}

export default new InsideJobService();
