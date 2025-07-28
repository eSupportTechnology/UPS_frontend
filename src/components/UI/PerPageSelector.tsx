import React from 'react';

interface PerPageSelectorProps {
    value: number;
    onChange: (perPage: number) => void;
    options?: number[];
    loading?: boolean;
}

export const PerPageSelector: React.FC<PerPageSelectorProps> = ({ value, onChange, options = [10, 25, 50, 100], loading = false }) => {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="per-page" className="text-sm font-medium text-gray-700">
                Show:
            </label>
            <select
                id="per-page"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                disabled={loading}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
        </div>
    );
};
