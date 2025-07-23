import { lazy, ReactElement } from 'react';
import UserCreate from '../pages/SuperAdmin/UserCreate';
import AllUser from '../pages/SuperAdmin/AllUsers';
const Index = lazy(() => import('../pages/Index'));

interface RouteType {
    path: string;
    element: ReactElement;
    layout?: 'blank' | 'default';
}

export const routes: RouteType[] = [
    {
        path: '/super-admin',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/super-admin/user-create',
        element: <UserCreate />,
        layout: 'default',
    },
     {
        path: '/super-admin/all-user',
        element: <AllUser />,
        layout: 'default',
    },
];
