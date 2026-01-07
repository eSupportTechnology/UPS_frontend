import React, { useState, useEffect } from 'react';
import IconX from '../Icon/IconX';
import IconFile from '../Icon/IconFile';
import IconSearch from '../Icon/IconSearch';
import materialsService from '../../services/materialsService';

interface MaterialsReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FilterValues {
    search: string;
    category: string;
    brand: string;
    status: string[];
    fromDate: string;
    toDate: string;
    today: boolean;
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

const MaterialsReportModal: React.FC<MaterialsReportModalProps> = ({ isOpen, onClose }) => {
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        category: '',
        brand: '',
        status: [],
        fromDate: '',
        toDate: '',
        today: false,
    });

    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadOptions();
        }
    }, [isOpen]);

    const loadOptions = async () => {
        setLoading(true);
        try {
            const { categories: cats, brands: brds } = await materialsService.getCategoriesAndBrands();
            setCategories(cats);
            setBrands(brds);
        } catch (error) {
            console.error('Failed to load options:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = (status: string) => {
        const newStatuses = filters.status.includes(status)
            ? filters.status.filter(s => s !== status)
            : [...filters.status, status];
        setFilters({ ...filters, status: newStatuses });
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            category: '',
            brand: '',
            status: [],
            fromDate: '',
            toDate: '',
            today: false,
        });
    };

    const handleExportPdf = () => {
        materialsService.exportPdf(filters);
    };

    const handleExportExcel = () => {
        materialsService.exportExcel(filters);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-emerald-600 rounded-t-lg">
                    <h2 className="text-lg font-semibold text-white">Materials Usage Report</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
                    >
                        <IconX className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                placeholder="Search by product name, job number, customer..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category and Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Brand
                            </label>
                            <select
                                value={filters.brand}
                                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value, today: false })}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters({ ...filters, toDate: e.target.value, today: false })}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({ ...filters, today: !filters.today, fromDate: '', toDate: '' })}
                                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                    filters.today
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                Today Only
                            </button>
                        </div>
                    </div>

                    {/* Job Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Filter by Job Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusToggle(opt.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                                        filters.status.includes(opt.value)
                                            ? opt.color + ' ring-2 ring-offset-1 ring-emerald-500'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(filters.search || filters.category || filters.brand || filters.status.length > 0 || filters.fromDate || filters.toDate || filters.today) && (
                        <div className="flex flex-wrap gap-2 items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Active Filters:</span>
                            {filters.search && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    Search: "{filters.search}"
                                </span>
                            )}
                            {filters.category && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    Category: {filters.category}
                                </span>
                            )}
                            {filters.brand && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    Brand: {filters.brand}
                                </span>
                            )}
                            {filters.today && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    Today Only
                                </span>
                            )}
                            {filters.status.length > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    {filters.status.length} status(es)
                                </span>
                            )}
                            {(filters.fromDate || filters.toDate) && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                                    Date Range
                                </span>
                            )}
                            <button
                                onClick={handleClearFilters}
                                className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPdf}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <IconFile className="w-4 h-4" />
                            Export PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={loading}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            <IconFile className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialsReportModal;
