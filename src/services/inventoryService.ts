import api from '../config/api.config';
import { InventoryFormData, CreateInventoryResponse } from '../types/inventory.types';

export class InventoryService {
    static async createInventory(data: InventoryFormData): Promise<CreateInventoryResponse> {
        try {
            const response = await api.post<CreateInventoryResponse>('/create-shopInventories', data);
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
