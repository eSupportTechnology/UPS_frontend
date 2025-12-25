export interface Ticket {
    id: string;
    customer_id: number;
    title: string;
    description: string;
    photo_paths?: string[];
    status: string;
    priority: string;
    assigned_to?: number;
    accepted_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    customer_address?: string;
    technician_name?: string;
    technician_email?: string;
    technician_phone?: string;
    district?: string;
    city?: string;
    gramsewa_division?: string;
}

export interface CreateTicketData {
    customer_id: number;
    title: string;
    description: string;
    district?: string;
    city?: string;
    gn_division?: string;
    photos?: File[];
}

export interface TicketFilters {
    search?: string;
    status?: string;
    priority?: string;
    assigned_to?: number;
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

export interface TicketResponse {
    success: boolean;
    message: string;
    data?: Ticket;
    errors?: any;
}

export interface TicketsListResponse {
    success: boolean;
    message: string;
    data?: {
        tickets: Ticket[];
        pagination?: {
            current_page: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    };
    errors?: any;
}

export interface TicketStatsResponse {
    success: boolean;
    message: string;
    data?: {
        total: number;
        open: number;
        in_progress: number;
        resolved: number;
        closed: number;
    };
    errors?: any;
}

export interface AssignTicketData {
    ticket_id: string;
    assigned_to: number;
}

export interface GNDivisionModule {
    getDistricts: () => string[];
    getCities: (districtName: string) => string[];
    getDNDivisions: (districtName: string, cityName: string) => string[];
}

// Inside Job Types
export type JobType = 'outside' | 'inside';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type QuoteItemType = 'part' | 'labor' | 'other';

export interface QuoteLineItem {
    id: string;
    ticket_id: string;
    item_type: QuoteItemType;
    inventory_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    is_approved: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface InsideJobTicket extends Ticket {
    job_type: JobType;
    job_number?: string;
    parent_ticket_id?: string;
    ups_serial_number?: string;
    ups_model?: string;
    ups_brand?: string;
    inspection_notes?: string;
    inspected_at?: string;
    inspected_by?: string;
    inspector_name?: string;
    quote_data?: QuoteLineItem[];
    quote_total?: number;
    quoted_at?: string;
    quoted_by?: string;
    quoter_name?: string;
    approval_status?: ApprovalStatus;
    approval_decision_at?: string;
    approval_notes?: string;
    in_repair_at?: string;
    repair_notes?: string;
    actual_parts_used?: any;
    parent_ticket?: Ticket;
    inside_jobs?: InsideJobTicket[];
    quote_line_items?: QuoteLineItem[];
}

export interface ConvertToInsideJobData {
    outside_ticket_id: string;
    title?: string;
    description?: string;
    ups_serial_number?: string;
    ups_model?: string;
    ups_brand?: string;
    assigned_to?: string;
    priority?: string;
}

export interface InspectionData {
    ticket_id: string;
    inspection_notes: string;
    inspected_by: string;
}

export interface QuoteData {
    ticket_id: string;
    quoted_by: string;
    line_items: {
        item_type: QuoteItemType;
        inventory_id?: string;
        description: string;
        quantity: number;
        unit_price: number;
    }[];
}

export interface ApprovalData {
    ticket_id: string;
    approved: boolean;
    notes?: string;
}

export interface StartRepairData {
    ticket_id: string;
}

export interface CompleteInsideJobData {
    ticket_id: string;
    repair_notes?: string;
    actual_parts_used?: any;
}
