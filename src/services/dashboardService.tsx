import api from '../config/api.config';
import {
    SuperAdminDashboardData,
    AdminDashboardData,
    OperatorDashboardData,
    TechnicianDashboardData,
    DashboardResponse
} from '../types/dashboard.types';

export class DashboardService {
    static async getSuperAdminDashboard(): Promise<SuperAdminDashboardData> {
        try {
            const response = await api.get<DashboardResponse<SuperAdminDashboardData>>('/dashboard/super-admin');
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch super admin dashboard data' };
        }
    }

    static async getAdminDashboard(): Promise<AdminDashboardData> {
        try {
            const response = await api.get<DashboardResponse<AdminDashboardData>>('/dashboard/admin');
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch admin dashboard data' };
        }
    }

    static async getOperatorDashboard(): Promise<OperatorDashboardData> {
        try {
            const response = await api.get<DashboardResponse<OperatorDashboardData>>('/dashboard/operator');
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch operator dashboard data' };
        }
    }

    static async getTechnicianDashboard(): Promise<TechnicianDashboardData> {
        try {
            const response = await api.get<DashboardResponse<TechnicianDashboardData>>('/dashboard/technician');
            return response.data.data;
        } catch (error: any) {
            throw error.response?.data || { message: 'Failed to fetch technician dashboard data' };
        }
    }
}
