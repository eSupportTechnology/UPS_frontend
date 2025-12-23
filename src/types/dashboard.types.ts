export interface DashboardResponse<T> {
    success: boolean;
    data: T;
}

export interface UserStats {
    total: number;
    super_admins: number;
    admins: number;
    operators: number;
    technicians: number;
    customers: number;
    active_users: number;
    inactive_users: number;
}

export interface BranchStats {
    total: number;
    active: number;
    inactive: number;
    by_type: Array<{ type: string; count: number }>;
}

export interface TicketStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    by_priority: Array<{ priority: string; count: number }>;
    this_month: number;
    today: number;
    this_week?: number;
    unassigned?: number;
    high_priority?: number;
}

export interface AMCContractStats {
    total: number;
    active: number;
    inactive: number;
    by_type: Array<{ contract_type: string; count: number }>;
    expiring_soon: number;
    total_value: number | null;
}

export interface AMCMaintenanceStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    scheduled_today: number;
    scheduled_this_week: number;
    overdue: number;
    unassigned?: number;
}

export interface InventoryStats {
    total_items: number;
    total_quantity: number;
    total_value: number | null;
    low_stock: number;
    out_of_stock: number;
    by_category: Array<{ category: string; count: number }>;
    total_usage_this_month: number;
    total_returns_this_month: number;
    low_stock_items?: any[];
}

export interface TrackingStats {
    active_tracks: number;
    total_tracks_today: number;
    total_tracks_this_month: number;
    active_technicians: number;
}

export interface RecentActivities {
    recent_tickets: any[];
    recent_maintenances: any[];
}

export interface MonthlyTrends {
    tickets: Array<{ month: string; count: number }>;
    maintenances: Array<{ month: string; count: number }>;
}

export interface SuperAdminDashboardData {
    users: UserStats;
    branches: BranchStats;
    tickets: TicketStats;
    amc_contracts: AMCContractStats;
    amc_maintenances: AMCMaintenanceStats;
    inventory: InventoryStats;
    tracking: TrackingStats;
    recent_activities: RecentActivities;
    monthly_trends: MonthlyTrends;
}

export interface AdminDashboardData {
    users: Partial<UserStats>;
    tickets: TicketStats;
    amc_contracts: AMCContractStats;
    amc_maintenances: AMCMaintenanceStats;
    inventory: Pick<InventoryStats, 'total_items' | 'low_stock' | 'out_of_stock' | 'total_value'>;
    technician_performance: {
        active_technicians: number;
        top_technicians: any[];
    };
    recent_activities: {
        pending_tickets: any[];
        upcoming_maintenances: any[];
    };
    weekly_trends: {
        tickets: Array<{ date: string; count: number }>;
        maintenances_completed?: Array<{ date: string; count: number }>;
    };
}

export interface OperatorDashboardData {
    tickets: TicketStats;
    amc_maintenances: AMCMaintenanceStats;
    technicians: {
        total: number;
        on_duty: number;
        available: number;
    };
    customers: {
        total: number;
        active: number;
    };
    inventory: {
        low_stock: number;
        out_of_stock: number;
        low_stock_items: any[];
    };
    recent_tickets: any[];
    upcoming_maintenances: any[];
    alerts: {
        unassigned_tickets: number;
        overdue_maintenances: number;
        high_priority_tickets: number;
    };
    daily_stats: {
        tickets_created: number;
        tickets_completed: number;
        maintenances_scheduled: number;
        maintenances_completed: number;
    };
}

export interface TechnicianDashboardData {
    my_tickets: {
        total: number;
        pending: number;
        in_progress: number;
        completed_today: number;
        completed_this_week: number;
        completed_this_month: number;
    };
    my_maintenances: {
        total: number;
        pending: number;
        in_progress: number;
        scheduled_today: number;
        scheduled_this_week: number;
        overdue: number;
    };
    my_tracking: {
        active_track: any | null;
        tracks_today: number;
        total_distance_today: number;
        tracks_this_week: number;
    };
    today_tickets: any[];
    today_maintenances: any[];
    upcoming_maintenances: any[];
    performance: {
        completion_rate: number;
        average_completion_time: number;
        total_completed_tickets: number;
        total_completed_maintenances: number;
    };
    weekly_activity: {
        tickets: Array<{ date: string; count: number }>;
        maintenances: Array<{ date: string; count: number }>;
    };
}
