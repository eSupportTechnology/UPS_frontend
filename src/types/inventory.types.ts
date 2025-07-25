export interface InventoryFormData {
    created_by: string;
    product_name: string;
    brand?: string;
    model?: string;
    serial_number?: string;
    category: string;
    description?: string;
    quantity: number;
    unit_price: number;
    purchase_date?: string;
    warranty?: string;
}

export interface Inventory {
    id: number;
    created_by: string;
    product_name: string;
    brand?: string;
    model?: string;
    serial_number?: string;
    category: string;
    description?: string;
    quantity: number;
    unit_price: number;
    purchase_date?: string;
    warranty?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateInventoryResponse {
    status: 'success' | 'error';
    message: string;
    data?: Inventory;
    error?: string;
}
