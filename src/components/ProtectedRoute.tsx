import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthService } from '../services/authService';
import { USER_ROLES } from '../types/auth.types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: USER_ROLES;
    requiredRoles?: USER_ROLES[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requiredRoles }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && !AuthService.hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredRoles && !AuthService.hasAnyRole(requiredRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
