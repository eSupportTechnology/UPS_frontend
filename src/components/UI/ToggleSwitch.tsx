import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
    id?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, loading = false, size = 'md', className = '', label, id }) => {
    const sizeClasses = {
        sm: {
            switch: 'w-8 h-4',
            thumb: 'w-3 h-3',
            translate: 'translate-x-4',
        },
        md: {
            switch: 'w-11 h-6',
            thumb: 'w-5 h-5',
            translate: 'translate-x-5',
        },
        lg: {
            switch: 'w-14 h-7',
            thumb: 'w-6 h-6',
            translate: 'translate-x-7',
        },
    };

    const currentSize = sizeClasses[size];

    const handleToggle = () => {
        if (!disabled && !loading) {
            onChange(!checked);
        }
    };

    return (
        <div className={`flex items-center ${className}`}>
            {label && (
                <label htmlFor={id} className={`mr-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} cursor-pointer`}>
                    {label}
                </label>
            )}
            <button
                type="button"
                id={id}
                role="switch"
                aria-checked={checked}
                disabled={disabled || loading}
                onClick={handleToggle}
                className={`
                    relative inline-flex items-center ${currentSize.switch} rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${checked ? 'bg-secondary' : 'bg-danger'}
                    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <span className="sr-only">{checked ? 'Deactivate' : 'Activate'}</span>
                <span
                    className={`
                        ${currentSize.thumb} inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
                        ${checked ? currentSize.translate : 'translate-x-0'}
                        ${loading ? 'animate-pulse' : ''}
                    `}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </button>
        </div>
    );
};
