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
}
