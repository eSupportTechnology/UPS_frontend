import api from '../config/api.config';
import { LoginFormData, AuthResponse, User, USER_ROLES, ROLE_LABELS } from '../types/auth.types';

export class AuthService {
    static async login(credentials: LoginFormData): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/login', {
                email: credentials.email,
                password: credentials.password,
            });

            if (response.data.status === 'success' && response.data.data) {
                localStorage.setItem('auth_token', response.data.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }

            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                throw error.response.data;
            }
            throw {
                status: 'error',
                message: 'Network error. Please try again.',
                error: error.message,
            };
        }
    }

    static async logout(): Promise<{ status: string; message: string }> {
        try {
            const response = await api.post('/auth/logout');

            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            return response.data;
        } catch (error: any) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');

            if (error.response?.data) {
                throw error.response.data;
            }
            throw {
                status: 'error',
                message: 'Logout failed',
                error: error.message,
            };
        }
    }

    static getCurrentUser(): User | null {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    static getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    static isAuthenticated(): boolean {
        return !!this.getToken() && !!this.getCurrentUser();
    }

    static hasRole(requiredRole: USER_ROLES): boolean {
        const user = this.getCurrentUser();
        return user ? user.role_as === requiredRole : false;
    }

    static hasAnyRole(requiredRoles: USER_ROLES[]): boolean {
        const user = this.getCurrentUser();
        return user ? requiredRoles.includes(user.role_as) : false;
    }

    static getRoleName(role: USER_ROLES): string {
        return ROLE_LABELS[role] || 'Unknown';
    }

    static getRedirectPath(role: USER_ROLES): string {
        switch (role) {
            case USER_ROLES.SUPER_ADMIN:
                return '/super-admin';
            case USER_ROLES.ADMIN:
                return '/admin';
            case USER_ROLES.OPERATOR:
                return '/operator';
            case USER_ROLES.TECHNICIAN:
                return '/technician';
            case USER_ROLES.CUSTOMER:
                return '/customer';
            default:
                return '/';
        }
    }

    static canAccessRoute(userRole: USER_ROLES, routeRole: USER_ROLES): boolean {
        if (userRole === USER_ROLES.SUPER_ADMIN) return true;
        return userRole === routeRole;
    }
}
