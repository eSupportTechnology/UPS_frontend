import { lazy, ReactElement } from 'react';
import InventoryCreate from '../pages/SuperAdmin/inventory/InventoryCreate';
import ProtectedRoute from '../components/ProtectedRoute';
import { USER_ROLES } from '../types/auth.types';
import Login from '../pages/Auth/Login';
import UserList from '../pages/SuperAdmin/AllUser/UserList';
import AllInventory from '../pages/SuperAdmin/inventory/AllInventory';
const Index = lazy(() => import('../pages/Index'));
const UserCreate = lazy(() => import('../pages/SuperAdmin/UserCreate'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const OperatorDashboard = lazy(() => import('../pages/Operator/Dashboard'));
const TechnicianDashboard = lazy(() => import('../pages/Technician/Dashboard'));
const CustomerDashboard = lazy(() => import('../pages/Customer/Dashboard'));

interface RouteType {
    path: string;
    element: ReactElement;
    layout?: 'blank' | 'default';
}

export const routes: RouteType[] = [
    {
        path: '/login',
        element: <Login />,
        layout: 'blank',
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />,
        layout: 'blank',
    },

    {
        path: '/super-admin',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <SuperAdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/user-create',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <UserCreate />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-user',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <UserList />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/admin',
        element: (
            <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
                <AdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/operator',
        element: (
            <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OPERATOR]}>
                <OperatorDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/technician',
        element: (
            <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN]}>
                <TechnicianDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/inventory-create',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
            <InventoryCreate />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-inventory',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
            <AllInventory />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/customer',
        element: (
            <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <CustomerDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/',
        element: <Index />,
        layout: 'blank',
    },
];
