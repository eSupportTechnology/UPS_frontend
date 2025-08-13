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
}

export interface CreateTicketData {
    customer_id: number;
    title: string;
    description: string;
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
        tickets?: Ticket[];
        data?: Ticket[];
        pagination?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
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