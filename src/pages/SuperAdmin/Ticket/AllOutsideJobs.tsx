import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Ticket } from '../../../types/ticket.types';
import { TicketService } from '../../../services/ticketService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { DataTable } from '../../../components/UI/DataTable';
import toast from 'react-hot-toast';
import { downloadService } from '../../../services/downloadService';

const AllOutsideJobs: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const [allTickets, setAllTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdvancedReport, setShowAdvancedReport] = useState(false);
    const [reportFilters, setReportFilters] = useState({
        reportType: 'bulk', // bulk, dateRange, type, status, priority
        fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        customerType: 'personal' as 'personal' | 'company',
        status: 'open',
        priority: 'medium',
    });

    // Get customer type from URL query parameter
    const customerType = (searchParams.get('type') as 'personal' | 'company' | null) || null;

    useEffect(() => {
        const pageTitle = customerType === 'personal' ? 'Personal Outside Jobs' : customerType === 'company' ? 'Company Outside Jobs' : 'Outside Jobs';
        dispatch(setPageTitle(pageTitle));
        fetchAllTickets();
    }, [dispatch, customerType]);

    const fetchAllTickets = async () => {
        setLoading(true);
        try {
            const response = await TicketService.getAllTickets({ per_page: 100 });
            if (response.success && response.data) {
                const tickets = response.data.tickets || [];
                setAllTickets(Array.isArray(tickets) ? tickets : []);
            } else {
                toast.error(response.message || 'Failed to load tickets');
                setAllTickets([]);
            }
        } catch (error) {
            toast.error('Error fetching tickets');
            setAllTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewTicket = (ticket: Ticket) => {
        navigate(`/super-admin/ticket/${ticket.id}`);
    };

    const handleGenerateReport = async (format: 'pdf' | 'csv') => {
        try {
            if (reportFilters.reportType === 'bulk') {
                if (format === 'pdf') {
                    await downloadService.downloadBulkPdf();
                } else {
                    await downloadService.downloadBulkCsv();
                }
            } else if (reportFilters.reportType === 'dateRange') {
                await downloadService.downloadDateRangeCsv(reportFilters.fromDate, reportFilters.toDate);
            } else if (reportFilters.reportType === 'type') {
                await downloadService.downloadTypeWiseCsv(reportFilters.customerType);
            } else if (reportFilters.reportType === 'status') {
                await downloadService.downloadStatusWiseCsv(reportFilters.status);
            } else if (reportFilters.reportType === 'priority') {
                await downloadService.downloadPriorityWiseCsv(reportFilters.priority);
            }
            toast.success(`Report downloaded in ${format.toUpperCase()} format!`);
            setShowAdvancedReport(false);
        } catch (error) {
            toast.error('Failed to generate report');
        }
    };

    // Filter tickets by customer type if specified
    const filteredTickets = useMemo(() => {
        if (!customerType) return allTickets;
        return allTickets.filter(t => t.customer_type === customerType);
    }, [allTickets, customerType]);

    // Calculate statistics
    const statistics = useMemo(() => {
        return {
            total: filteredTickets.length,
            pending: filteredTickets.filter(t => !t.status || t.status === 'open').length,
            assigned: filteredTickets.filter(t => t.status === 'assigned').length,
            in_progress: filteredTickets.filter(t => t.status === 'in_progress' || t.status === 'accepted').length,
            completed: filteredTickets.filter(t => t.status === 'completed').length,
            high_priority: filteredTickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
        };
    }, [filteredTickets]);

    // DataTable column configuration
    const columns = useMemo(() => [
        {
            key: 'customer_info',
            label: 'Customer',
            render: (ticket: Ticket) => {
                const isCompany = ticket.customer_type === 'company';
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{ticket.customer_name || '-'}</span>
                            {isCompany ? (
                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded font-medium">
                                    Company
                                </span>
                            ) : (
                                <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded font-medium">
                                    Personal
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.customer_email || '-'}</span>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'branch_info',
            label: 'Location',
            render: (ticket: Ticket) => {
                const isCompany = ticket.customer_type === 'company';
                return (
                    <div className="flex flex-col gap-1 text-sm">
                        {isCompany ? (
                            <span className="text-gray-900 dark:text-white font-medium">
                                {ticket.branch_name || ticket.address || 'Branch'}
                            </span>
                        ) : (
                            <span className="text-gray-900 dark:text-white">
                                {ticket.address || '-'}
                            </span>
                        )}
                    </div>
                );
            },
            sortable: false,
        },
        {
            key: 'title',
            label: 'Title',
            render: (ticket: Ticket) => (
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900 dark:text-white">{ticket.title || '-'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{ticket.description?.substring(0, 50) || '-'}</span>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            render: (ticket: Ticket) => {
                const getStatusColor = (status: string) => {
                    if (!status) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                    switch (status.toLowerCase()) {
                        case 'open':
                            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                        case 'assigned':
                            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
                        case 'accepted':
                            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
                        case 'in_progress':
                            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
                        case 'completed':
                            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                        case 'cancelled':
                            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                        default:
                            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    }
                };

                return (
                    <span className={`text-sm font-medium rounded-full px-3 py-1 capitalize ${getStatusColor(ticket.status || 'open')}`}>
                        {ticket.status || 'Open'}
                    </span>
                );
            },
            sortable: true,
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (ticket: Ticket) => {
                const getPriorityColor = (priority: string) => {
                    if (!priority) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    switch (priority.toLowerCase()) {
                        case 'low':
                            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                        case 'medium':
                            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
                        case 'high':
                            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
                        case 'urgent':
                            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
                        default:
                            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    }
                };

                return (
                    <span className={`text-sm font-medium rounded-full px-3 py-1 capitalize ${getPriorityColor(ticket.priority || 'medium')}`}>
                        {ticket.priority || 'Medium'}
                    </span>
                );
            },
            sortable: true,
        },
        {
            key: 'customer_phone',
            label: 'Contact',
            render: (ticket: Ticket) => {
                const isCompany = ticket.customer_type === 'company';
                return (
                    <div className="flex flex-col gap-1 text-sm">
                        <span className="text-gray-900 dark:text-white">{ticket.customer_phone || '-'}</span>
                        {!isCompany && ticket.address && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">{ticket.address.substring(0, 30)}</span>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'created_at',
            label: 'Created',
            render: (ticket: Ticket) => (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}
                </div>
            ),
            sortable: true,
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (ticket: Ticket) => (
                <button
                    onClick={() => handleViewTicket(ticket)}
                    className="px-3 py-1 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                    View
                </button>
            ),
        },
    ], []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Outside Jobs</span>
                    </li>
                </ul>
            </div>

            {/* Advanced Report Button */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setShowAdvancedReport(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Advanced Reports
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.total}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.pending}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-yellow-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Assigned</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.assigned}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.in_progress}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.completed}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.high_priority}</p>
                </div>
            </div>

            {/* DataTable with Built-in Filtering, Sorting, and Pagination */}
            <DataTable
                data={filteredTickets}
                columns={columns}
                loading={loading}
                emptyMessage="No outside jobs found"
                searchFields={['customer_name', 'title', 'description', 'customer_email'] as (keyof Ticket)[]}
                filterConfig={{
                    status: {
                        label: 'Status',
                        options: [
                            { label: 'Open', value: 'open' },
                            { label: 'Assigned', value: 'assigned' },
                            { label: 'Accepted', value: 'accepted' },
                            { label: 'In Progress', value: 'in_progress' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Cancelled', value: 'cancelled' },
                        ],
                    },
                    priority: {
                        label: 'Priority',
                        options: [
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High', value: 'high' },
                            { label: 'Urgent', value: 'urgent' },
                        ],
                    },
                }}
            />

            {/* Advanced Report Modal */}
            {showAdvancedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Reports</h2>
                            <button
                                onClick={() => setShowAdvancedReport(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Report Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Report Type
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="bulk"
                                            checked={reportFilters.reportType === 'bulk'}
                                            onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as any })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">All Tickets (Bulk Export)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="dateRange"
                                            checked={reportFilters.reportType === 'dateRange'}
                                            onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as any })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">Date Range Filter</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="type"
                                            checked={reportFilters.reportType === 'type'}
                                            onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as any })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">By Customer Type</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="status"
                                            checked={reportFilters.reportType === 'status'}
                                            onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as any })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">By Status</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="priority"
                                            checked={reportFilters.reportType === 'priority'}
                                            onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value as any })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">By Priority</span>
                                    </label>
                                </div>
                            </div>

                            {/* Date Range Filters */}
                            {reportFilters.reportType === 'dateRange' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            From Date
                                        </label>
                                        <input
                                            type="date"
                                            value={reportFilters.fromDate}
                                            onChange={(e) => setReportFilters({ ...reportFilters, fromDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            To Date
                                        </label>
                                        <input
                                            type="date"
                                            value={reportFilters.toDate}
                                            onChange={(e) => setReportFilters({ ...reportFilters, toDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Customer Type Filter */}
                            {reportFilters.reportType === 'type' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Select Customer Type
                                    </label>
                                    <select
                                        value={reportFilters.customerType}
                                        onChange={(e) => setReportFilters({ ...reportFilters, customerType: e.target.value as 'personal' | 'company' })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="personal">Personal Customers</option>
                                        <option value="company">Company Customers</option>
                                    </select>
                                </div>
                            )}

                            {/* Status Filter */}
                            {reportFilters.reportType === 'status' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Select Status
                                    </label>
                                    <select
                                        value={reportFilters.status}
                                        onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="open">Open</option>
                                        <option value="assigned">Assigned</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}

                            {/* Priority Filter */}
                            {reportFilters.reportType === 'priority' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Select Priority
                                    </label>
                                    <select
                                        value={reportFilters.priority}
                                        onChange={(e) => setReportFilters({ ...reportFilters, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            )}

                            {/* Export Format Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Export Format
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleGenerateReport('pdf')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                        </svg>
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => handleGenerateReport('csv')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm11-4a1 1 0 10-2 0v6a1 1 0 102 0V6z" />
                                        </svg>
                                        Download CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOutsideJobs;
