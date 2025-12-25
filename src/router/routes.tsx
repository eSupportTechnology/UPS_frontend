import { lazy, ReactElement } from 'react';
import InventoryCreate from '../pages/SuperAdmin/inventory/InventoryCreate';
import Login from '../pages/Auth/Login';
import UserList from '../pages/SuperAdmin/AllUser/UserList';
import AllInventory from '../pages/SuperAdmin/inventory/AllInventory';
import CreateAMCContract from '../pages/SuperAdmin/AMC/CreateAMCContract';
import AllAMCContracts from '../pages/SuperAdmin/AMC/AllAMCContracts';
import CreateBranch from '../pages/SuperAdmin/Branch/CreateBranch';
import AllBranches from '../pages/SuperAdmin/Branch/AllBranches';
import SuperAdminAllTickets from '../pages/SuperAdmin/Ticket/AllTickets';
import JobSelector from '../pages/SuperAdmin/TechnicianTrack/JobSelector';

const UserCreate = lazy(() => import('../pages/SuperAdmin/UserCreate'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const SuperAdminDashboard = lazy(() => import('../pages/SuperAdmin/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const OperatorDashboard = lazy(() => import('../pages/Operator/Dashboard'));
const TechnicianDashboard = lazy(() => import('../pages/Technician/Dashboard'));
const CustomerDashboard = lazy(() => import('../pages/Customer/Dashboard'));
const CreateTicket = lazy(() => import('../pages/Customer/Ticket/CreateTicket'));
const AllTickets = lazy(() => import('../pages/Customer/Ticket/AllTickets'));
const TicketDetail = lazy(() => import('../pages/Customer/Ticket/TicketDetail'));
const TechnicianAssignedTickets = lazy(() => import('../pages/Technician/Ticket/AssignedTickets'));
const CreateOutsideJob = lazy(() => import('../pages/SuperAdmin/Ticket/CreateOutsideJob'));
const InsideJobsList = lazy(() => import('../pages/SuperAdmin/InsideJobs/InsideJobsList'));
const CreateInsideJob = lazy(() => import('../pages/SuperAdmin/InsideJobs/CreateInsideJob'));
const WorkshopDashboard = lazy(() => import('../pages/Technician/InsideJobs/WorkshopDashboard'));
const CreateTechnician = lazy(() => import('../pages/SuperAdmin/Technician/CreateTechnician'));
const TechnicianList = lazy(() => import('../pages/SuperAdmin/Technician/TechnicianList'));

interface RouteType {
    path: string;
    element: ReactElement;
    layout?: 'blank' | 'default';
}

export const routes: RouteType[] = [
    {
        path: '/',
        element: <Login />,
        layout: 'blank',
    },
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
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <SuperAdminDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/user-create',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <UserCreate />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-user',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <UserList />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/create-contract',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <CreateAMCContract />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-contracts',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <AllAMCContracts />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/admin',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/operator',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.OPERATOR]}>
                <OperatorDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/technician',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN]}>
                <TechnicianDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/technician/dashboard',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN]}>
                <TechnicianDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/technician/assigned-tickets',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN]}>
                <TechnicianAssignedTickets />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/technician/workshop-dashboard',
        element: (
            // <ProtectedRoute requiredRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TECHNICIAN]}>
                <WorkshopDashboard />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/inventory-create',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <InventoryCreate />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-inventory',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <AllInventory />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/create-branch',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <CreateBranch />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-branches',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <AllBranches />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-tickets',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
            <SuperAdminAllTickets />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/create-outside-job',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
            <CreateOutsideJob />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/technician-track',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <JobSelector />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/inside-jobs',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <InsideJobsList />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/create-inside-job',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <CreateInsideJob />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/create-technician',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <CreateTechnician />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/super-admin/all-technicians',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.SUPER_ADMIN}>
                <TechnicianList />
            // </ProtectedRoute>
        ),
        layout: 'default',
    },

    {
        path: '/customer',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <CustomerDashboard />
            // </ProtectedRoute>
        ),
        layout: 'blank',
    },
    {
        path: '/customer/dashboard',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <CustomerDashboard />
            // </ProtectedRoute>
        ),
        layout: 'blank',
    },
    {
        path: '/customer/ticket/create-ticket',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <CreateTicket />
            // </ProtectedRoute>
        ),
        layout: 'blank',
    },
    {
        path: '/customer/ticket/all-tickets',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <AllTickets />
            // </ProtectedRoute>
        ),
        layout: 'blank',
    },
    {
        path: '/customer/ticket/:id',
        element: (
            // <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
                <TicketDetail ticketId="" onClose={() => {}} />
            // </ProtectedRoute>
        ),
        layout: 'blank',
    },
];
