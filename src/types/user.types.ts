export const USER_ROLES = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    OPERATOR: 3,
    TECHNICIAN: 4,
    CUSTOMER: 5,
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.ADMIN]: 'Admin',
    [USER_ROLES.OPERATOR]: 'Operator',
    [USER_ROLES.TECHNICIAN]: 'Technician',
    [USER_ROLES.CUSTOMER]: 'Customer',
};

export interface CreateUserFormData {
    name: string;
    email: string;
    role_as: UserRole;
    phone?: string;
    address?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role_as: UserRole;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    error?: string;
}

export interface CreateUserResponse extends ApiResponse<User> {
    data: User;
}

export interface FormErrors {
    name?: string;
    email?: string;
    role_as?: string;
    phone?: string;
    address?: string;
}
