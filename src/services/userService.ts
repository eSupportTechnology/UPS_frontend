import api from '../config/api.config';
import { CreateUserFormData, CreateUserResponse, GetUsersResponse, UsersFilters } from '../types/user.types';

export class UserService {
    static async createUser(userData: CreateUserFormData): Promise<CreateUserResponse> {
        try {
            const response = await api.post<CreateUserResponse>('/create-user', userData);
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

    static async getUsers(page: number = 1, filters: UsersFilters = {}): Promise<GetUsersResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: (filters.per_page || 10).toString(),
            });

            if (filters.search) {
                params.append('search', filters.search);
            }
            if (filters.role !== undefined && filters.role !== '') {
                params.append('role', filters.role.toString());
            }
            if (filters.is_active !== undefined && filters.is_active !== '') {
                params.append('is_active', filters.is_active.toString());
            }

            const response = await api.get<GetUsersResponse>(`/all-users?${params}`);
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
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidPhone(phone: string): boolean {
        if (!phone) return true;
        const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    static async updateUser(id: number, userData: Partial<CreateUserFormData>): Promise<CreateUserResponse> {
        try {
            const payload: Partial<CreateUserFormData> = {
                name: userData.name,
                email: userData.email,
                role_as: userData.role_as,
                phone: userData.phone,
                address: userData.address,
            };
            const response = await api.put<CreateUserResponse>(`/update-users/${id}`, payload);
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

    static async deleteUser(id: number): Promise<{ status: string; message: string }> {
        try {
            const response = await api.delete<{ status: string; message: string }>(`/delete-users/${id}`);
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

    static async activateUser(id: number): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>(`/users-activate/${id}`);
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

    static async deactivateUser(id: number): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post<{ status: string; message: string }>(`/users-deactivate/${id}`);
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

    static async toggleUserStatus(id: number, isActive: boolean): Promise<{ status: string; message: string }> {
        return isActive ? this.deactivateUser(id) : this.activateUser(id);
    }

    static async getAllTechnicianUsers(): Promise<{ success: boolean; message: string; data?: any[] }> {
        try {
            const response = await api.get('/all-technician-users');

            if (response.data && response.data.users) {
                return {
                    success: true,
                    message: 'Technicians retrieved successfully',
                    data: response.data.users,
                };
            } else {
                console.warn('Unexpected response format:', response.data);
                return {
                    success: false,
                    message: 'Invalid response format',
                };
            }
        } catch (error: any) {
            console.error('Error fetching technicians:', error);
            if (error.response?.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve technicians',
                };
            }
            return {
                success: false,
                message: 'Network error. Please try again.',
            };
        }
    }
}
