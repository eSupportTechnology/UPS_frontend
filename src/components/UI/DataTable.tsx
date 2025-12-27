import React, { useState, useMemo, useCallback } from 'react';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { PerPageSelector } from './PerPageSelector';
import toast from 'react-hot-toast';

interface Column<T> {
    key: string | keyof T;
    label: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
    sortable?: boolean;
    filterable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
    searchFields?: (keyof T)[];
    filterConfig?: {
        [key: string]: {
            label: string;
            options: { label: string; value: string }[];
        };
    };
    onFilterChange?: (filters: any) => void;
}

export function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data available',
    className = '',
    searchFields = [],
    filterConfig = {},
    onFilterChange,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortBy, setSortBy] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Search functionality
    const filteredBySearch = useMemo(() => {
        if (!searchQuery.trim()) return data;

        const query = searchQuery.toLowerCase();
        return data.filter((row) => {
            if (searchFields.length === 0) return true;
            return searchFields.some((field) => {
                const value = (row[field] as any)?.toString().toLowerCase() || '';
                return value.includes(query);
            });
        });
    }, [data, searchQuery, searchFields]);

    // Filter functionality
    const filteredByFilters = useMemo(() => {
        return filteredBySearch.filter((row) => {
            for (const [filterKey, filterValue] of Object.entries(filters)) {
                if (!filterValue) continue;
                const rowValue = (row as any)[filterKey]?.toString().toLowerCase();
                if (rowValue !== filterValue.toLowerCase()) {
                    return false;
                }
            }
            return true;
        });
    }, [filteredBySearch, filters]);

    // Sorting functionality
    const sortedData = useMemo(() => {
        if (!sortBy) return filteredByFilters;

        const sorted = [...filteredByFilters].sort((a, b) => {
            const aVal = (a as any)[sortBy];
            const bVal = (b as any)[sortBy];

            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (typeof aVal === 'string') {
                return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            if (typeof aVal === 'number') {
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }

            return 0;
        });

        return sorted;
    }, [filteredByFilters, sortBy, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / perPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * perPage;
        return sortedData.slice(startIndex, startIndex + perPage);
    }, [sortedData, currentPage, perPage]);

    const handleSort = useCallback((column: Column<T>) => {
        if (!column.sortable) return;

        if (sortBy === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column.key as keyof T);
            setSortDirection('asc');
        }
    }, [sortBy, sortDirection]);

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            const newFilters = { ...filters, [key]: value };
            setFilters(newFilters);
            setCurrentPage(1);
            onFilterChange?.(newFilters);
        },
        [filters, onFilterChange]
    );

    const handleSearch = useCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, []);

    const handlePerPageChange = useCallback((value: number) => {
        setPerPage(value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const tableColumns = columns.map((col) => ({
        ...col,
        render: (row: T) => {
            if (col.render) {
                return col.render(row);
            }
            return (row as any)[col.key];
        },
    }));

    const hasFilters = Object.keys(filterConfig).length > 0 || searchFields.length > 0;

    return (
        <div className={className}>
            {/* Filters */}
            {hasFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        {searchFields.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        )}

                        {/* Dynamic Filters */}
                        {Object.entries(filterConfig).map(([key, config]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {config.label}
                                </label>
                                <select
                                    value={filters[key] || ''}
                                    onChange={(e) => handleFilterChange(key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">All {config.label}</option>
                                    {config.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        {/* Per Page */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Per Page
                            </label>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Info */}
            {!loading && paginatedData.length > 0 && (
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Showing {(currentPage - 1) * perPage + 1} to{' '}
                    {Math.min(currentPage * perPage, sortedData.length)} of {sortedData.length} results
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : paginatedData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    {tableColumns.map((column, index) => (
                                        <th
                                            key={index}
                                            onClick={() => handleSort(column)}
                                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                                                column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                                            } ${column.className || ''}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {column.label}
                                                {column.sortable && sortBy === column.key && (
                                                    <span className="text-primary">
                                                        {sortDirection === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        {tableColumns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`px-6 py-4 text-sm text-gray-900 dark:text-white ${
                                                    column.className || ''
                                                }`}
                                            >
                                                {column.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <PerPageSelector value={perPage} onChange={handlePerPageChange} />
                    <Pagination
                        meta={{
                            current_page: currentPage,
                            last_page: totalPages,
                            total: sortedData.length,
                            from: (currentPage - 1) * perPage + 1,
                            to: Math.min(currentPage * perPage, sortedData.length),
                            per_page: perPage,
                        }}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
