import api from '../config/api.config';
import { AMCContractFormData, CreateContractResponse, ContractListResponse, AMCContract } from '../types/amcContract.types';

export class AMCContractService {
    static async getContracts(page: number, filters: any): Promise<{ data: AMCContract[]; total: number; current_page: number; last_page: number; per_page: number; from: number; to: number }> {
        try {
            const params: any = { page };

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    if (key === 'status') {
                        params['is_active'] = value;
                    } else {
                        params[key] = value;
                    }
                }
            });

            if (params.per_page === '' || params.per_page === undefined || params.per_page === null) {
                delete params.per_page;
            }

            const response = await api.get<ContractListResponse>('/all-contract', { params });

            const contracts = response.data.contracts;
            return {
                data: contracts.data,
                total: contracts.total,
                current_page: contracts.current_page,
                last_page: contracts.last_page,
                per_page: contracts.per_page,
                from: contracts.from,
                to: contracts.to,
            };
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch contracts' };
        }
    }

    static async createContract(data: AMCContractFormData): Promise<CreateContractResponse> {
        try {
            const response = await api.post<CreateContractResponse>('/create-contract', data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw {
                status: 'error',
                message: 'Network error. Please try again.',
                error: error.message,
            };
        }
    }

    static async updateContract(id: string, data: Partial<AMCContract>): Promise<{ message: string }> {
        try {
            const cleanData: any = {};

            const allowedFields = ['contract_type', 'branch_id', 'customer_id', 'purchase_date', 'warranty_end_date', 'contract_amount', 'notes', 'is_active', 'maintenances'];

            allowedFields.forEach((field) => {
                if (data[field as keyof AMCContract] !== undefined) {
                    cleanData[field] = data[field as keyof AMCContract];
                }
            });

            const response = await api.put(`/update-amc-contract/${id}`, cleanData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update contract' };
        }
    }

    static async deleteContract(id: string): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/delete-amc-contract/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete contract' };
        }
    }

    static async activateContract(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>(`/amc-contracts-activate/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to activate contract' };
        }
    }

    static async deactivateContract(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>(`/amc-contracts-deactivate/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to deactivate contract' };
        }
    }

    static async updateMaintenanceStatus(contractId: string, maintenanceId: string, status: 'pending' | 'completed' | 'missed'): Promise<{ status: string; message: string }> {
        try {
            const response = await api.put<{ status: string; message: string }>(`/amc-contract/${contractId}/maintenance/${maintenanceId}/status`, { status });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update maintenance status' };
        }
    }

    static async addMaintenance(contractId: string, maintenance: { scheduled_date: string; note: string; status: 'pending' | 'completed' | 'missed' }): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>(`/amc-contract/${contractId}/maintenance`, maintenance);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to add maintenance' };
        }
    }

    static async deleteMaintenance(contractId: string, maintenanceId: string): Promise<{ status: string; message: string }> {
        try {
            const response = await api.delete<{ status: string; message: string }>(`/amc-contract/${contractId}/maintenance/${maintenanceId}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete maintenance' };
        }
    }

    static async assignTechnicianToMaintenance(maintenanceId: string, technicianId: string): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>('/assign-maintenance', {
                maintenance_id: maintenanceId,
                assigned_to: technicianId
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to assign technician to maintenance' };
        }
    }

    static async getMaintenanceDetails(contractId: string): Promise<any> {
        try {

            const response = await api.get(`/amc-contract/${contractId}/maintenances`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to get maintenance details' };
        }
    }
}
