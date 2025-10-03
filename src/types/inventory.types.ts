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

export interface InventoryUsageItem {
    inventory_id: string;
    quantity: number;
    description?: string;
}

export interface InventoryUsageData {
    reference_id: string;
    usage_type: 'maintenance' | 'contract';
    usages: InventoryUsageItem[];
    usage_date: string;
    notes?: string;
}

export interface InventoryReturnData {
    reference_id: string;
    usage_type: 'maintenance' | 'contract';
    usages: InventoryUsageItem[];
    return_date: string;
    notes?: string;
}

export interface RawInventoryItem {
    id: string;
    product_name: string;
    brand?: string;
    model?: string;
    serial_number: string;
    category: string;
    quantity: number;
    warranty: string;
}

export interface InventoryUsageResponse {
    success: boolean;
    message: string;
    data?: any;
}
