export interface TechnicianLocation {
    id: number;
    technician_id: number;
    technician_name: string;
    email: string;
    phone?: string;
    latitude: number;
    longitude: number;
    last_updated: string;
    is_online: boolean;
    status: 'active' | 'idle' | 'offline';
    current_ticket_id?: number;
    current_ticket_title?: string;
    current_ticket_priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TechnicianTrackResponse {
    success: boolean;
    message: string;
    data: {
        technicians: TechnicianLocation[];
        total_count: number;
        online_count: number;
        active_count: number;
        last_updated: string;
    };
    errors?: any;
}

export interface TechnicianTrackFilters {
    status?: 'all' | 'online' | 'offline' | 'active' | 'idle';
    search?: string;
}

export interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface MapMarker {
    id: number;
    position: {
        lat: number;
        lng: number;
    };
    technician: TechnicianLocation;
    icon?: string;
    popup?: string;
}