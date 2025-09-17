import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket } from '../../../types/ticket.types';
import ticketService from '../../../services/ticketService';
import { useAlert } from '../../../components/Alert/Alert';
import TechnicianTicketModal from './view/TechnicianTicketModal';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PaginationData } from '../../../types/pagination.types';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

const AssignedTickets = () => {
    const navigate = useNavigate();
    const { showAlert, AlertContainer } = useAlert();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTickets, setTotalTickets] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [initialLoading, setInitialLoading] = useState(true);

    const loadAssignedTickets = async () => {
        try {
            setLoading(true);
            // Get current user from localStorage
            const userData = localStorage.getItem('user');
            if (!userData) {
                throw new Error('User not authenticated');
            }

            const user = JSON.parse(userData);
            const response = await ticketService.getTicketsByAssignedTo(user.id, {
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
                throw new Error(response.message || 'Failed to load assigned tickets');
            }
        } catch (error: any) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to load assigned tickets. Please try again.',
            });
            setTickets([]);
            setTotalTickets(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssignedTickets();
    }, [currentPage]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'assigned':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'accepted':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'completed':
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
                  const matchesSearch =
                      ticket.title?.toLowerCase().includes(searchLower) ||
                      ticket.description?.toLowerCase().includes(searchLower) ||
                      ticket.customer_name?.toLowerCase().includes(searchLower) ||
                      ticket.customer_phone?.toLowerCase().includes(searchLower);

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
            loadAssignedTickets();
        } else {
            setCurrentPage(1);
        }
    };

    const handleViewDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const handleAcceptTicket = async (ticket: Ticket) => {
        try {
            setLoading(true);
            const response = await ticketService.acceptTicket(ticket.id);

            if (response.success) {
                // Refresh the tickets list
                await loadAssignedTickets();
                // Show success message (you can add alert here if needed)
            }
        } catch (error) {
            console.error('Error accepting ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTicket = async (ticket: Ticket) => {
        try {
            setLoading(true);
            const response = await ticketService.completeTicket(ticket.id);

            if (response.success) {
                // Refresh the tickets list
                await loadAssignedTickets();
                // Show success message (you can add alert here if needed)
            }
        } catch (error) {
            console.error('Error completing ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTicket(null);
        // Reload tickets to get updated status
        loadAssignedTickets();
    };

    // Table columns configuration
    const columns = useMemo(
        () => [
            {
                accessor: 'title',
                Header: 'Ticket',
                Cell: ({ value }: any) => (
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                ),
            },
            {
                accessor: 'customer_name',
                Header: 'Customer',
                Cell: ({ value }: any) => (
                    <div className="text-sm text-gray-900">{value || 'Unknown Customer'}</div>
                ),
            },
            {
                accessor: 'customer_phone',
                Header: 'Phone',
                Cell: ({ value }: any) => (
                    <div className="text-sm text-gray-900">{value || 'N/A'}</div>
                ),
            },
            {
                accessor: 'status',
                Header: 'Status',
                Cell: ({ value }: any) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
                        {value.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                ),
            },
            {
                accessor: 'priority',
                Header: 'Priority',
                Cell: ({ value }: any) => (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}>
                        {value.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                ),
            },
            {
                accessor: 'actions',
                Header: 'Actions',
                disableSortBy: true,
                Cell: ({ row }: any) => {
                    const ticket = row.original;
                    return (
                        <div className="flex items-center justify-end space-x-2">
                            <button
                                onClick={() => handleViewDetails(ticket)}
                                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                View
                            </button>
                            {ticket.status === 'assigned' && (
                                <button
                                    onClick={() => handleAcceptTicket(ticket)}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Accept
                                </button>
                            )}
                            {(ticket.status === 'accepted' || ticket.status === 'in-progress') && (
                                <button
                                    onClick={() => handleCompleteTicket(ticket)}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    // Prepare table data
    const tableData = filteredTickets;

    // Prepare pagination data
    const paginationMeta: PaginationData | null = totalTickets > 0 ? {
        current_page: currentPage,
        last_page: totalPages,
        per_page: perPage,
        total: totalTickets,
        first_page_url: '',
        from: (currentPage - 1) * perPage + 1,
        last_page_url: '',
        next_page_url: currentPage < totalPages ? '' : null,
        path: '',
        prev_page_url: currentPage > 1 ? '' : null,
        to: Math.min(currentPage * perPage, totalTickets),
        links: [],
    } : null;

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        loadAssignedTickets();
    }, []);

    const handlePerPageChange = useCallback((newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
        loadAssignedTickets();
    }, []);


    useEffect(() => {
        if (loading && tickets.length === 0) {
            setInitialLoading(true);
        } else {
            setInitialLoading(false);
        }
    }, [loading, tickets]);

    if (initialLoading && tickets.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading assigned tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AlertContainer />

            {/* Loading Overlay */}
            {loading && tickets.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="text-gray-700">Updating tickets...</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/technician" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Assigned Tickets</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assigned Tickets</h1>
                    <p className="text-gray-600">Manage tickets assigned to you</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tickets..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="assigned">Assigned</option>
                            <option value="accepted">Accepted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <PerPageSelector value={perPage || 10} onChange={handlePerPageChange} loading={loading} />

                <div className="text-sm text-gray-600">Total: {totalFilteredTickets} tickets</div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((ticket: any) => (
                            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ticket.customer_name || 'Unknown Customer'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ticket.customer_phone || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(ticket)}
                                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md w-24"
                                        >
                                            View
                                        </button>
                                        {ticket.status === 'assigned' && (
                                            <button
                                                onClick={() => handleAcceptTicket(ticket)}
                                                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md w-24"
                                            >
                                                Accept
                                            </button>
                                        )}
                                        {(ticket.status === 'accepted' || ticket.status === 'in-progress') && (
                                            <button
                                                onClick={() => handleCompleteTicket(ticket)}
                                                className="px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md w-24"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {paginatedTickets.length === 0 && !loading && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m-4 8l4-4 4 4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                    <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria.' : "You don't have any assigned tickets yet."}
                    </p>
                </div>
            )}

            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}

            {/* Ticket Detail Modal */}
            {showModal && selectedTicket && (
                <TechnicianTicketModal
                    ticket={selectedTicket}
                    open={showModal}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AssignedTickets;