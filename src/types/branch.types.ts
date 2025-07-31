export interface BranchFormData {
    name: string;
    branch_code: string;
    type?: string;
    country?: string;
    state?: string;
    city?: string;
    address_line1?: string;
    address_line2?: string;
    postal_code?: string;
    contact_person?: string;
    contact_number?: string;
    email?: string;
    operating_hours?: string;
    is_active?: boolean;
}

export interface Branch {
    id: string; 
    name: string;
    branch_code: string;
    type: string;
    country?: string;
    state?: string;
    city?: string;
    address_line1?: string;
    address_line2?: string;
    postal_code?: string;
    contact_person?: string;
    contact_number?: string;
    email?: string;
    operating_hours?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateBranchResponse {
    status: 'success' | 'error';
    message: string;
    data?: Branch;
    error?: string;
}
