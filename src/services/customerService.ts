import api from '../config/api.config';
import { Customer } from '../types/amcContract.types';

export class CustomerService {
    static async getActiveCustomers(): Promise<Customer[]> {
        try {
            const response = await api.get('/active-customers');
            return response.data.customers;
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
