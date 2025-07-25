import api from '../config/api.config';
import { CreateUserFormData, CreateUserResponse } from '../types/user.types';

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
