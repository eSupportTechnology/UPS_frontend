import api from '../config/api.config';
import { AMCContractFormData, CreateContractResponse, ContractListResponse, AMCContract } from '../types/amcContract.types';

export class AMCContractService {
    static async getContracts(page: number, filters: any): Promise<{ data: AMCContract[]; total: number; current_page: number; last_page: number; per_page: number; from: number; to: number }> {
        try {
            const params: any = { page };
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined && value !== null) {
                    params[key] = value;
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
            const response = await api.put(`/amc-contract/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to update contract' };
        }
    }

    static async deleteContract(id: string): Promise<{ message: string }> {
        try {
            const response = await api.delete(`/amc-contract/${id}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to delete contract' };
        }
    }
}
