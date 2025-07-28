import api from '../config/api.config';
import { InventoryFormData, CreateInventoryResponse, Inventory } from '../types/inventory.types';
import { PaginationData } from '../types/pagination.types';

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

    static async getInventories(page: number = 1, filters: Record<string, any> = {}): Promise<PaginationData<Inventory>> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: (filters.per_page || 10).toString(),
            });

            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.created_by) params.append('created_by', filters.created_by);
            if (filters.min_quantity !== undefined && filters.min_quantity !== '') params.append('min_quantity', filters.min_quantity);
            if (filters.max_quantity !== undefined && filters.max_quantity !== '') params.append('max_quantity', filters.max_quantity);
            if (filters.min_price !== undefined && filters.min_price !== '') params.append('min_price', filters.min_price);
            if (filters.max_price !== undefined && filters.max_price !== '') params.append('max_price', filters.max_price);
            if (filters.purchase_date_from) params.append('purchase_date_from', filters.purchase_date_from);
            if (filters.purchase_date_to) params.append('purchase_date_to', filters.purchase_date_to);
            if (filters.sort_by) params.append('sort_by', filters.sort_by);
            if (filters.sort_direction) params.append('sort_direction', filters.sort_direction);

            const response = await api.get(`/all-shopInventories?${params}`);
            // Assuming backend returns { status, inventories: PaginationData<Inventory> }
            return response.data.inventories;
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
