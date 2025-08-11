export interface CreateTicketData {
    customer_id: string;
    title: string;
    description: string;
    photos?: File[];
}

export interface Ticket {
    id: string;
    customer_id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    photo_paths?: string[];
    assigned_to?: string;
    accepted_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
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

export interface TicketStats {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
}

export interface TicketStatsResponse {
    success: boolean;
    message: string;
    data?: TicketStats;
    errors?: any;
}

export interface TicketComment {
    id: string;
    ticket_id: string;
    user_id: string;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface TicketFilters {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    per_page?: number;
}
