export interface LoginFormData {
    email: string;
    password: string;
    remember?: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role_as: UserRole;
    phone?: string;
    address?: string;
    is_active: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        user: User;
        access_token: string;
        token_type: string;
        expires_in: string;
    };
    error?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export enum USER_ROLES {
    SUPER_ADMIN = 1,
    ADMIN = 2,
    OPERATOR = 3,
    TECHNICIAN = 4,
    CUSTOMER = 5,
}

export const ROLE_LABELS = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.OPERATOR]: 'Operator',
    [USER_ROLES.TECHNICIAN]: 'Technician',
    [USER_ROLES.CUSTOMER]: 'Customer',
};

export type UserRole = USER_ROLES;

export interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}
