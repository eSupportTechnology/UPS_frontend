import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/authSlice';
import { useAlert } from '../Alert/Alert';

interface LogoutButtonProps {
    className?: string;
    showText?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className = '', showText = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { isLoading } = useSelector((state: any) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any).unwrap();

            showAlert({
                type: 'success',
                title: 'Logged Out',
                message: 'You have been successfully logged out.',
                duration: 3000,
            });

            navigate('/login', { replace: true });
        } catch (error: any) {
            showAlert({
                type: 'error',
                title: 'Logout Error',
                message: error || 'An error occurred during logout',
                duration: 5000,
            });
            navigate('/login', { replace: true });
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            )}
            {showText && <span>{isLoading ? 'Logging out...' : 'Logout'}</span>}
        </button>
    );
};

export default LogoutButton;
