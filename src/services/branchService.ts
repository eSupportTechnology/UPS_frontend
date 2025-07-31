import api from '../config/api.config';
import { BranchFormData, CreateBranchResponse } from '../types/branch.types';
import { Branch } from '../types/branch.types';
import { PaginationData } from '../types/pagination.types';

export class BranchService {
    static async createBranch(data: BranchFormData): Promise<CreateBranchResponse> {
        try {
            const response = await api.post<CreateBranchResponse>('/create-branch', data);
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

    static async getBranches(page: number = 1, filters: Record<string, any> = {}): Promise<PaginationData<Branch>> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: (filters.per_page || 10).toString(),
            });
            if (filters.search) params.append('search', filters.search);
            if (filters.country) params.append('country', filters.country);
            if (filters.state) params.append('state', filters.state);
            if (filters.city) params.append('city', filters.city);
            if (filters.type) params.append('type', filters.type);
            
            const response = await api.get(`/all-branches?${params}`);
        
            return response.data.branches;
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

    static async updateBranch(id: string, data: Partial<Branch>): Promise<any> {
        try {
            const response = await api.put(`/update-branch/${id}`, data);
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

    static async deleteBranch(id: string): Promise<any> {
        try {
            const response = await api.delete(`/delete-branch/${id}`);
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
}
