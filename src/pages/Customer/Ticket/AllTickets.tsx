import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../../components/Layouts/userLayout';
import { Ticket } from '../../../types/ticket.types';
import ticketService from '../../../services/ticketService';
import { useAlert } from '../../../components/Alert/Alert';

const AllTickets = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showAlert, AlertContainer } = useAlert();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTickets, setTotalTickets] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load tickets from API
    const loadTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketService.getCustomerTickets(undefined, {
                search: searchTerm.trim() || undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
                page: currentPage,
                per_page: perPage,
            });

            if (response.success && response.data) {
                const ticketsData = response.data.tickets;
                setTickets(Array.isArray(ticketsData) ? ticketsData : []);
                if (response.data.pagination) {
                    setTotalTickets(response.data.pagination.total || 0);
                }
            } else {
                throw new Error(response.message || 'Failed to load tickets');
            }
        } catch (error: any) {
            console.error('Error loading tickets:', error);

            if (error.message?.includes('422') || error.message?.includes('validation')) {
                showAlert({
                    type: 'warning',
                    title: 'Backend Configuration Issue',
                    message: 'There is a backend validation issue. Please contact the system administrator to fix the user ID validation.',
                });
            } else {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Failed to load tickets. Please try again.',
                });
            }
            setTickets([]);
            setTotalTickets(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (currentPage === 1) {
                loadTickets();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            case 'medium':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'urgent':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredTickets = Array.isArray(tickets) ? tickets : [];

    const handleSearch = () => {
        if (currentPage === 1) {
            loadTickets();
        } else {
            setCurrentPage(1);
        }
    };

    const openTicketModal = async (ticketId: number) => {
        try {
            const response = await ticketService.getTicketById(ticketId);
            if (response.success && response.data) {
                setSelectedTicket(response.data);
                setIsModalOpen(true);
            } else {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: response.message || 'Failed to load ticket details',
                });
            }
        } catch (error: any) {
            console.error('Error loading ticket details:', error);
            showAlert({
                type: 'error',
                title: 'Error',
                message: 'Failed to load ticket details. Please try again.',
            });
        }
    };

    const closeTicketModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                closeTicketModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    if (loading) {
        return (
            <UserLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading tickets...</p>
                    </div>
                </div>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <AlertContainer />
            {/* Content Area */}
            <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Side - Ticket Statistics */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Ticket Counts Section */}
                        <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-primary/20 dark:border-primary/30 overflow-hidden">
                            <div className="bg-primary text-white p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    Ticket Statistics
                                </h3>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                {/* Open Tickets Only */}
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Open Tickets</h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">Currently active</p>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {Array.isArray(tickets) ? tickets.filter((ticket) => ticket.status === 'open').length : 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Search and Tickets List */}
                    <div className="lg:col-span-9">
                        <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-primary/20 dark:border-primary/30 overflow-hidden">
                            {/* Header */}
                            <div className="bg-primary text-white p-4 sm:p-6 lg:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">My Support Tickets</h2>
                                <p className="text-sm text-white/80">View and manage all your support tickets</p>
                            </div>

                            <div className="p-4 sm:p-6 lg:p-8">
                                {/* Search and Filters */}
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Search */}
                                    <div className="md:col-span-1">
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Search Tickets
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSearch();
                                                    }
                                                }}
                                                placeholder="Search by title, description, or ticket ID..."
                                                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 dark:text-white transition-all duration-200"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 dark:text-white transition-all duration-200"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="open">Open</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tickets List */}
                                <div className="overflow-hidden rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <table className="w-full divide-y divide-gray-200/50 dark:divide-gray-600/50">
                                        <thead className="bg-gray-50/80 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/50 dark:divide-gray-600/50">
                                            {filteredTickets.map((ticket) => (
                                                <tr key={ticket.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                            {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(ticket.created_at)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => openTicketModal(ticket.id)}
                                                            className="px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200 border border-primary/30 dark:border-primary/40 hover:border-primary/50 dark:hover:border-primary/60"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {filteredTickets.length === 0 && !loading && (
                                    <div className="text-center py-12">
                                        <div className="relative inline-block">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full backdrop-blur-sm"></div>
                                            <div className="relative bg-white/60 dark:bg-gray-800/60 rounded-full p-8 shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm">
                                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1}
                                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m-4 8l4-4 4 4"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">No tickets found</h3>
                                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 px-4">
                                            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria.' : "You haven't created any tickets yet."}
                                        </p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalTickets > perPage && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing {Math.min((currentPage - 1) * perPage + 1, totalTickets)} to {Math.min(currentPage * perPage, totalTickets)} of {totalTickets} results
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1 || loading}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                            >
                                                Previous
                                            </button>
                                            <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Page {currentPage} of {Math.ceil(totalTickets / perPage)}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(Math.min(Math.ceil(totalTickets / perPage), currentPage + 1))}
                                                disabled={currentPage >= Math.ceil(totalTickets / perPage) || loading}
                                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Details Modal */}
            {isModalOpen && selectedTicket && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" aria-hidden="true">
                            <div className="absolute inset-0" onClick={closeTicketModal}></div>
                        </div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-blue-100 dark:border-blue-900">
                            {/* Modal Header with Blue Gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 sm:px-8 sm:py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Support Ticket Details</h3>
                                            <p className="text-blue-100 text-sm mt-1">Created {formatDate(selectedTicket.created_at)}</p>
                                        </div>
                                    </div>
                                    <button onClick={closeTicketModal} className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Status Badge in Header */}
                                <div className="mt-4 flex items-center space-x-3">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-white bg-opacity-20 text-white border border-white border-opacity-30`}>
                                        <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {selectedTicket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                    {selectedTicket.updated_at && selectedTicket.updated_at !== selectedTicket.created_at && (
                                        <span className="text-blue-100 text-sm">
                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                />
                                            </svg>
                                            Updated {formatDate(selectedTicket.updated_at)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-4 sm:px-8 sm:py-6 bg-blue-50 dark:bg-blue-900/20">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Main Content - Left Side */}
                                    <div className="lg:col-span-2 space-y-4">
                                        {/* Ticket Title Card */}
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Issue Title</h4>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">{selectedTicket.title}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description Card */}
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3">Description</h4>
                                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedTicket.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Information Grid */}
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Ticket Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Status</div>
                                                    <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                                                        {selectedTicket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">Created Date</div>
                                                    <div className="text-sm text-gray-900 dark:text-white font-medium">{formatDate(selectedTicket.created_at)}</div>
                                                </div>
                                                {selectedTicket.updated_at && selectedTicket.updated_at !== selectedTicket.created_at && (
                                                    <div className="space-y-1 md:col-span-2">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
                                                        <div className="text-sm text-gray-900 dark:text-white font-medium">{formatDate(selectedTicket.updated_at)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attachments Sidebar - Right Side */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sticky top-6">
                                            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Attachments ({selectedTicket.photo_paths?.length || 0})
                                            </h4>

                                            {selectedTicket.photo_paths && selectedTicket.photo_paths.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedTicket.photo_paths.map((photo, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-w-16 aspect-h-12">
                                                                <img
                                                                    src={`${import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000'}/storage/${photo}`}
                                                                    alt={`Attachment ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group-hover:shadow-lg"
                                                                    onClick={() => window.open(`${import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000'}/storage/${photo}`, '_blank')}
                                                                />
                                                            </div>
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black bg-opacity-40 rounded-lg">
                                                                <div className="bg-white bg-opacity-90 rounded-full p-3">
                                                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 text-center">
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Attachment {index + 1}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                                                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Click images to view full size
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No attachments</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This ticket has no uploaded files</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="bg-white dark:bg-gray-900 px-6 py-3 sm:px-8 sm:py-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        Your ticket is secure and private
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            onClick={closeTicketModal}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default AllTickets;
