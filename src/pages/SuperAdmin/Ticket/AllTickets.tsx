import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, TicketFilters } from '../../../types/ticket.types';
import { PaginationData } from '../../../types/pagination.types';
import { TicketService } from '../../../services/ticketService';
import { UserService } from '../../../services/userService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';
import ViewTicketModal from './view/ViewTicketModal';
import ExportButtons from '../../../components/Ticket/ExportButtons';

const AllTickets: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [tickets, setTickets] = useState<PaginationData<Ticket> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<TicketFilters>({
        search: '',
        status: '',
        priority: '',
        per_page: 10,
    });

    const [users, setUsers] = useState<any[]>([]);
    const [assigningTickets, setAssigningTickets] = useState<Set<string>>(new Set());
    const [updatingTickets, setUpdatingTickets] = useState<Set<string>>(new Set());

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await UserService.getAllTechnicianUsers();
            if (response.success && response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.warn('Invalid response for technicians:', response);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    }, []);

    const handleAssignTicket = useCallback(
        async (ticketId: string, userId: string) => {
            if (!userId) return;

            setAssigningTickets((prev) => new Set(prev).add(ticketId));

            try {
                const response = await TicketService.assignTicket(ticketId, userId);
                if (response.success) {
                    showAlert({
                        type: 'success',
                        title: 'Success',
                        message: 'Ticket assigned successfully',
                    });

                    fetchTickets(currentPage);
                } else {
                    showAlert({
                        type: 'error',
                        title: 'Error',
                        message: response.message || 'Failed to assign ticket',
                    });
                }
            } catch (error: any) {
                console.error('Error assigning ticket:', error);
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to assign ticket',
                });
            } finally {
                setAssigningTickets((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(ticketId);
                    return newSet;
                });
            }
        },
        [showAlert, currentPage],
    );

    const handlePriorityUpdate = useCallback(
        async (ticketId: string, newPriority: string) => {
            if (!newPriority) return;

            setUpdatingTickets((prev) => new Set(prev).add(ticketId));

            try {
                const currentAssignedTo = tickets?.data.find((t) => t.id === ticketId)?.assigned_to || null;
                const response = await TicketService.updateTicketPriority(ticketId, newPriority, currentAssignedTo);

                if (response.success) {
                    showAlert({
                        type: 'success',
                        title: 'Success',
                        message: 'Ticket priority updated successfully',
                    });

                    fetchTickets(currentPage);
                } else {
                    showAlert({
                        type: 'error',
                        title: 'Error',
                        message: response.message || 'Failed to update ticket priority',
                    });
                }
            } catch (error: any) {
                console.error('Error updating ticket priority:', error);
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to update ticket priority',
                });
            } finally {
                setUpdatingTickets((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(ticketId);
                    return newSet;
                });
            }
        },
        [showAlert, tickets, currentPage],
    );

    // Export handlers
    const handleExportExcel = async () => {
        try {
            const exportFilters = {
                search: filters.search,
                status: filters.status,
                priority: filters.priority,
            };

            const blob = await TicketService.exportExcel(exportFilters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tickets_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showAlert({
                type: 'success',
                title: 'Success',
                message: 'Excel file downloaded successfully',
            });
        } catch (error: any) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to export Excel file',
            });
        }
    };

    const handleExportPdf = async () => {
        try {
            const exportFilters = {
                search: filters.search,
                status: filters.status,
                priority: filters.priority,
            };

            const blob = await TicketService.exportPdf(exportFilters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tickets_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showAlert({
                type: 'success',
                title: 'Success',
                message: 'PDF file downloaded successfully',
            });
        } catch (error: any) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to export PDF file',
            });
        }
    };

    const handleViewTicket = useCallback((ticket: Ticket) => {
        setSelectedTicket(ticket);
        setViewModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setViewModalOpen(false);
        setSelectedTicket(null);
    }, []);

    const fetchTickets = useCallback(
        async (page: number = currentPage) => {
            setLoading(true);
            try {
                const params = {
                    search: filters.search,
                    status: filters.status,
                    priority: filters.priority,
                    per_page: filters.per_page,
                    page: page,
                };

                const response = await TicketService.getAllTickets(params);
                if (response.success && response.data) {
                    const ticketsData = response.data.tickets || [];
                    const pagination = response.data.pagination;

                    if (Array.isArray(ticketsData)) {
                        const paginationData: PaginationData<Ticket> = {
                            data: ticketsData,
                            current_page: pagination?.current_page || page,
                            last_page: pagination?.last_page || 1,
                            total: pagination?.total || ticketsData.length,
                            per_page: pagination?.per_page || 10,
                            first_page_url: '',
                            from: pagination ? (pagination.current_page - 1) * pagination.per_page + 1 : 1,
                            last_page_url: '',
                            next_page_url: pagination && pagination.current_page < pagination.last_page ? `?page=${pagination.current_page + 1}` : null,
                            path: '',
                            prev_page_url: pagination && pagination.current_page > 1 ? `?page=${pagination.current_page - 1}` : null,
                            to: pagination ? Math.min(pagination.current_page * pagination.per_page, pagination.total) : ticketsData.length,
                            links: [],
                        };
                        setTickets(paginationData);
                        setCurrentPage(page);
                    } else {
                        setTickets({
                            data: [],
                            current_page: 1,
                            last_page: 1,
                            total: 0,
                            per_page: 10,
                            first_page_url: '',
                            from: 0,
                            last_page_url: '',
                            next_page_url: null,
                            path: '',
                            prev_page_url: null,
                            to: 0,
                            links: [],
                        });
                    }
                } else {
                    showAlert({ type: 'error', title: 'Error', message: response.message || 'Failed to fetch tickets' });
                    setTickets({
                        data: [],
                        current_page: 1,
                        last_page: 1,
                        total: 0,
                        per_page: 10,
                        first_page_url: '',
                        from: 0,
                        last_page_url: '',
                        next_page_url: null,
                        path: '',
                        prev_page_url: null,
                        to: 0,
                        links: [],
                    });
                }
            } catch (error: any) {
                console.error('Error fetching tickets:', error);
                showAlert({ type: 'error', title: 'Error', message: 'Failed to fetch tickets' });
                setTickets({
                    data: [],
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                    per_page: 10,
                    first_page_url: '',
                    from: 0,
                    last_page_url: '',
                    next_page_url: null,
                    path: '',
                    prev_page_url: null,
                    to: 0,
                    links: [],
                });
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filters, showAlert],
    );

    useEffect(() => {
        fetchTickets(1);
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchTickets(page);
        },
        [fetchTickets],
    );

    const handleFilterChange = useCallback((key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const handlePerPageChange = useCallback((perPage: number) => {
        setFilters((prev) => ({
            ...prev,
            per_page: perPage,
        }));
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            fetchTickets(1);
        },
        [fetchTickets],
    );

    const columns = useMemo(
        () => [
            {
                key: 'title',
                label: 'Title',
                sortable: true,
                render: (value: string, ticket: Ticket) => <div className="font-medium text-gray-900">{value}</div>,
            },
            {
                key: 'customer_name',
                label: 'Customer Name',
                render: (value: string, ticket: Ticket) => <div className="text-sm text-gray-900">{value || 'N/A'}</div>,
            },
            {
                key: 'status',
                label: 'Status',
                render: (value: string, ticket: Ticket) => {
                    const displayStatus = value || 'open';
                    return (
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            displayStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                displayStatus === 'in_progress' || displayStatus === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                    displayStatus === 'assigned' ? 'bg-purple-100 text-purple-800' :
                                        'bg-yellow-100 text-yellow-800'
                        }`}>
                            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).replace('_', ' ')}
                        </span>
                    );
                },
            },
            {
                key: 'priority',
                label: 'Priority',
                render: (value: string, ticket: Ticket) => {
                    return (
                        <select
                            value={value}
                            onChange={(e) => handlePriorityUpdate(ticket.id, e.target.value)}
                            disabled={updatingTickets.has(ticket.id)}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                                value === 'urgent' ? 'border-red-300 text-red-700' :
                                    value === 'high' ? 'border-orange-300 text-orange-700' :
                                        value === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                            'border-green-300 text-green-700'
                            }`}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    );
                },
            },
            {
                key: 'assign_to',
                label: 'Assign To',
                render: (_: any, ticket: Ticket) => {
                    const currentTechnician = ticket.assigned_to ? users.find((user) => user.id === ticket.assigned_to) : null;

                    return (
                        <div className="flex flex-col space-y-1">
                            <select
                                value={ticket.assigned_to || ''}
                                onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                                disabled={assigningTickets.has(ticket.id)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                <option value="">
                                    {assigningTickets.has(ticket.id) ? 'Assigning...' : 'Select Technician'}
                                </option>
                                {Array.isArray(users) &&
                                    users.map((user: any) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                            </select>
                            {currentTechnician && (
                                <div className="text-xs text-green-600 font-medium">✓ {currentTechnician.name}</div>
                            )}
                        </div>
                    );
                },
            },
            {
                key: 'actions',
                label: 'Actions',
                render: (_: any, ticket: Ticket) => (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            onClick={() => handleViewTicket(ticket)}
                        >
                            View
                        </button>
                    </div>
                ),
            },
        ],
        [users, assigningTickets, updatingTickets, handleAssignTicket, handlePriorityUpdate, handleViewTicket],
    );

    const paginationMeta = useMemo(() => {
        if (!tickets) return null;
        return {
            current_page: tickets.current_page,
            last_page: tickets.last_page,
            per_page: tickets.per_page,
            total: tickets.total,
            from: tickets.from,
            to: tickets.to,
        };
    }, [tickets]);

    const tableData = useMemo(() => tickets?.data || [], [tickets]);

    // Calculate statistics
    const statistics = useMemo(() => {
        if (!tickets?.data) return null;
        return {
            total: tickets.data.length,
            pending: tickets.data.filter(t => !t.status || t.status === 'pending').length,
            assigned: tickets.data.filter(t => t.status === 'assigned').length,
            in_progress: tickets.data.filter(t => t.status === 'in_progress' || t.status === 'accepted').length,
            completed: tickets.data.filter(t => t.status === 'completed').length,
            high_priority: tickets.data.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
        };
    }, [tickets]);

    return (
        <div>
            <AlertContainer />

            <ViewTicketModal open={viewModalOpen} onClose={handleCloseModal} ticket={selectedTicket} />

            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Tickets</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tickets</h1>
                    <p className="text-gray-600">Manage and view all customer support tickets</p>
                </div>
                <ExportButtons onExportExcel={handleExportExcel} onExportPdf={handleExportPdf} disabled={loading} />
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-2xl font-bold text-gray-900">{tickets?.total || 0}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                        <div className="text-sm text-gray-600">Assigned</div>
                        <div className="text-2xl font-bold text-purple-600">{statistics.assigned}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="text-2xl font-bold text-blue-600">{statistics.in_progress}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                        <div className="text-sm text-gray-600">High Priority</div>
                        <div className="text-2xl font-bold text-red-600">{statistics.high_priority}</div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
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
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="accepted">Accepted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    <div className="flex items-end">
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
                <PerPageSelector value={filters.per_page || 10} onChange={handlePerPageChange} loading={loading} />
                {tickets && <div className="text-sm text-gray-600">Total: {tickets.total} tickets</div>}
            </div>

            <Table data={tableData} columns={columns} loading={loading} emptyMessage="No tickets found" className="mb-6" />

            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}
        </div>
    );
};

export default AllTickets;
