import React, { useState, useEffect } from 'react';
import IconSearch from '../Icon/IconSearch';
import IconX from '../Icon/IconX';
import IconFilter from '../Icon/IconFilter';
import IconFile from '../Icon/IconFile';

interface Technician {
    id: string;
    name: string;
}

interface FilterValues {
    search: string;
    status: string[];
    priority: string;
    technician: string;
    fromDate: string;
    toDate: string;
    today: boolean;
}

interface InsideJobsFilterProps {
    filters: FilterValues;
    onFilterChange: (filters: FilterValues) => void;
    technicians: Technician[];
    statusCounts?: Record<string, number>;
    loading?: boolean;
    onExportPdf?: () => void;
    onExportExcel?: () => void;
}

const STATUS_OPTIONS = [
    { value: 'pending_inspection', label: 'Pending Inspection', color: 'bg-blue-100 text-blue-800' },
    { value: 'inspected', label: 'Inspected', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'quoted', label: 'Quoted', color: 'bg-purple-100 text-purple-800' },
    { value: 'approved_for_repair', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'in_repair', label: 'In Repair', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
    { value: 'quote_rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

const PRIORITY_OPTIONS = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

const InsideJobsFilter: React.FC<InsideJobsFilterProps> = ({
    filters,
    onFilterChange,
    technicians,
    statusCounts = {},
    loading = false,
    onExportPdf,
    onExportExcel,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [localSearch, setLocalSearch] = useState(filters.search);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== filters.search) {
                onFilterChange({ ...filters, search: localSearch });
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch]);

    const handleStatusToggle = (status: string) => {
        const newStatuses = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        onFilterChange({ ...filters, status: newStatuses });
    };

    const handleClearFilters = () => {
        setLocalSearch('');
        onFilterChange({
            search: '',
            status: [],
            priority: '',
            technician: '',
            fromDate: '',
            toDate: '',
            today: false,
        });
    };

    const hasActiveFilters = filters.search || filters.status.length > 0 ||
        filters.priority || filters.technician || filters.fromDate ||
        filters.toDate || filters.today;

    const totalJobs = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total: {totalJobs}
                </div>
                {STATUS_OPTIONS.slice(0, 5).map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => handleStatusToggle(opt.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                            filters.status.includes(opt.value)
                                ? opt.color + ' ring-2 ring-offset-1 ring-blue-500'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                    >
                        {opt.label}: {statusCounts[opt.value] || 0}
                    </button>
                ))}
            </div>

            {/* Search and Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[250px]">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search job #, customer, serial..."
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {localSearch && (
                        <button
                            onClick={() => setLocalSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <IconX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Today Filter */}
                <button
                    onClick={() => onFilterChange({ ...filters, today: !filters.today, fromDate: '', toDate: '' })}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                        filters.today
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    Today
                </button>

                {/* Priority Filter */}
                <select
                    value={filters.priority}
                    onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light text-sm min-w-[140px]"
                >
                    {PRIORITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Technician Filter */}
                <select
                    value={filters.technician}
                    onChange={(e) => onFilterChange({ ...filters, technician: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light text-sm min-w-[160px]"
                >
                    <option value="">All Technicians</option>
                    {technicians.map(tech => (
                        <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                </select>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        showAdvanced
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    <IconFilter className="w-4 h-4" />
                    More
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        Clear All
                    </button>
                )}

                {/* Export Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                    {onExportPdf && (
                        <button
                            onClick={onExportPdf}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                            title="Export to PDF"
                        >
                            <IconFile className="w-4 h-4" />
                            PDF
                        </button>
                    )}
                    {onExportExcel && (
                        <button
                            onClick={onExportExcel}
                            disabled={loading}
                            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                            title="Export to Excel"
                        >
                            <IconFile className="w-4 h-4" />
                            Excel
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">From Date</label>
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value, today: false })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">To Date</label>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value, today: false })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light text-sm"
                            />
                        </div>

                        {/* Status Multi-Select */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status Filter</label>
                            <div className="flex flex-wrap gap-1">
                                {STATUS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleStatusToggle(opt.value)}
                                        className={`px-2 py-1 rounded text-xs font-medium transition ${
                                            filters.status.includes(opt.value)
                                                ? opt.color
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Active:</span>
                    {filters.search && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                            Search: "{filters.search}"
                        </span>
                    )}
                    {filters.today && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                            Today Only
                        </span>
                    )}
                    {filters.status.length > 0 && (
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                            {filters.status.length} status(es)
                        </span>
                    )}
                    {filters.priority && (
                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                            Priority: {filters.priority}
                        </span>
                    )}
                    {filters.technician && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                            Technician assigned
                        </span>
                    )}
                    {(filters.fromDate || filters.toDate) && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 rounded">
                            Date range
                        </span>
                    )}
                </div>
            )}

            {loading && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-blue-500"></div>
                    Loading...
                </div>
            )}
        </div>
    );
};

export default InsideJobsFilter;
