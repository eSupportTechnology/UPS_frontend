export interface MaintenanceData {
    id?: string;
    amc_contract_id?: string;
    scheduled_date: string;
    note: string;
    status: 'pending' | 'completed' | 'missed';
    created_at?: string;
    updated_at?: string;
}

export interface AMCContractFormData {
    branch_id: string;
    customer_id: string;
    contract_type: string;
    purchase_date: string;
    warranty_end_date: string;
    contract_amount: string;
    notes: string;
    is_active: boolean;
    maintenances: MaintenanceData[];
}

export interface AMCContract {
    id: string;
    branch_id: string;
    customer_id: string;
    contract_type: string;
    purchase_date: string;
    warranty_end_date: string | null;
    contract_amount: number | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    branch?: {
        id: string;
        name: string;
        branch_code: string;
    };
    customer?: {
        id: string;
        name: string;
        email: string;
    };
    maintenances?: MaintenanceData[];
}

export interface CreateContractResponse {
    status: string;
    message: string;
    data?: AMCContract;
}

export interface ContractListResponse {
    status: string;
    message: string;
    contracts: {
        data: AMCContract[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
}

export interface ContractFilters {
    search?: string;
    branch_id?: string;
    customer_id?: string;
    contract_type?: string;
    is_active?: boolean;
    per_page?: number;
}

export interface Branch {
    id: string;
    name: string;
    branch_code: string;
    type: string;
    country: string;
    state: string;
    city: string;
    is_active: boolean;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    is_active: boolean;
}

export interface AMCContractFormData {
    branch_id: string;
    customer_id: string;
    contract_type: string;
    purchase_date: string;
    warranty_end_date: string;
    contract_amount: string;
    notes: string;
    is_active: boolean;
    maintenances: MaintenanceData[];
}

export interface CreateContractResponse {
    status: string;
    message: string;
    data?: AMCContract;
}
