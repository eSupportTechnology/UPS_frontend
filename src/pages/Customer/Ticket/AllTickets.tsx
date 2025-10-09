import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../../components/Layouts/userLayout';
import { Ticket } from '../../../types/ticket.types';
import ticketService from '../../../services/ticketService';
import { useAlert } from '../../../components/Alert/Alert';
import TicketDetailModal from './TicketDetail';

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
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const response = await ticketService.getCustomerTickets(undefined, {
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
    }, [currentPage]);

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

    const filteredTickets = Array.isArray(tickets)
        ? tickets.filter((ticket) => {
              if (searchTerm.trim()) {
                  const searchLower = searchTerm.toLowerCase();
                  const matchesSearch = ticket.title?.toLowerCase().includes(searchLower) || ticket.description?.toLowerCase().includes(searchLower) || ticket.id?.toString().includes(searchLower);

                  if (!matchesSearch) return false;
              }

              if (statusFilter !== 'all' && ticket.status !== statusFilter) {
                  return false;
              }

              return true;
          })
        : [];

    const totalFilteredTickets = filteredTickets.length;
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalFilteredTickets / perPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleSearch = () => {
        if (currentPage === 1) {
            loadTickets();
        } else {
            setCurrentPage(1);
        }
    };

    const handleViewDetails = (ticketId: string) => {
        if (!ticketId || ticketId.trim() === '') {
            return;
        }
        setSelectedTicketId(ticketId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTicketId(null);
    };

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
                                            {Array.isArray(filteredTickets) ? filteredTickets.filter((ticket) => ticket.status === 'open').length : 0}
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
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Search */}
                                    <div className="md:col-span-2">
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

                                    {/* Search Button */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action</label>
                                        <button
                                            onClick={handleSearch}
                                            className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span className="text-sm font-medium">Search</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tickets List - Desktop Table */}
                                <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <table className="w-full divide-y divide-gray-200/50 dark:divide-gray-600/50">
                                        <thead className="bg-gray-50/80 dark:bg-gray-700/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ticket</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200/50 dark:divide-gray-600/50">
                                            {paginatedTickets.map((ticket) => (
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
                                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="max-w-xs truncate" title={ticket.description}>
                                                            {ticket.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewDetails(ticket.id)}
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

                                {/* Tickets List - Mobile Cards */}
                                <div className="md:hidden space-y-4">
                                    {paginatedTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50 p-4 hover:shadow-md transition-all duration-200"
                                        >
                                            {/* Ticket Title */}
                                            <div className="mb-3">
                                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{ticket.title}</h3>
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ticket.description}</p>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => handleViewDetails(ticket.id)}
                                                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                                            >
                                                <span>View Details</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {paginatedTickets.length === 0 && !loading && (
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
                                {totalFilteredTickets > perPage && (
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing {Math.min(startIndex + 1, totalFilteredTickets)} to {Math.min(endIndex, totalFilteredTickets)} of {totalFilteredTickets} results
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
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage >= totalPages || loading}
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

            {/* Ticket Detail Modal */}
            {showModal && selectedTicketId && <TicketDetailModal ticketId={selectedTicketId} onClose={handleCloseModal} />}
        </UserLayout>
    );
};

export default AllTickets;
