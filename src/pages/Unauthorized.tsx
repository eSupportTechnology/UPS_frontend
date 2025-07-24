import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthService } from '../services/authService';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.auth);

    const handleGoToDashboard = () => {
        if (user) {
            const redirectPath = AuthService.getRedirectPath(user.role_as);
            navigate(redirectPath, { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <svg className="mx-auto h-24 w-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h2>
                    <p className="mt-2 text-sm text-gray-600">You don't have permission to access this page.</p>
                    {user && <p className="mt-1 text-xs text-gray-500">Current role: {AuthService.getRoleName(user.role_as)}</p>}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoToDashboard}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        Go to Dashboard
                    </button>

                    <Link
                        to="/login"
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
