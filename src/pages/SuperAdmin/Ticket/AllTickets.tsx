import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, TicketFilters } from '../../../types/ticket.types';
import { PaginationData } from '../../../types/pagination.types';
import { TicketService } from '../../../services/ticketService';
import { UserService } from '../../../services/userService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

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

    // Add ref to prevent multiple simultaneous requests
    const loadingRef = useRef(false);
    const initialLoadRef = useRef(false);
    
    // Refs to store current values without causing re-renders
    const filtersRef = useRef(filters);
    const currentPageRef = useRef(currentPage);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Update refs whenever state changes
    filtersRef.current = filters;
    currentPageRef.current = currentPage;

    // Fetch users for assignment dropdown
    const fetchUsers = useCallback(async () => {
        try {
            const response = await UserService.getUsers(1, {
                role: 4, // TECHNICIAN role
                is_active: true // Active users only
            });
            if (response.users?.data) {
                setUsers(response.users.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    // Handle ticket assignment
    const handleAssignTicket = useCallback(async (ticketId: string, userId: string) => {
        if (!userId) return;

        setAssigningTickets(prev => new Set(prev).add(ticketId));
        
        try {
            const response = await TicketService.assignTicket(ticketId, userId);
            if (response.success) {
                showAlert({ 
                    type: 'success', 
                    title: 'Success', 
                    message: 'Ticket assigned successfully' 
                });
                // Refresh tickets
                fetchTickets();
            } else {
                showAlert({ 
                    type: 'error', 
                    title: 'Error', 
                    message: response.message || 'Failed to assign ticket' 
                });
            }
        } catch (error: any) {
            console.error('Error assigning ticket:', error);
            showAlert({ 
                type: 'error', 
                title: 'Error', 
                message: 'Failed to assign ticket' 
            });
        } finally {
            setAssigningTickets(prev => {
                const newSet = new Set(prev);
                newSet.delete(ticketId);
                return newSet;
            });
        }
    }, [showAlert]);

    // Stable fetch tickets function using refs - NO DEPENDENCIES
    const fetchTickets = useCallback(async () => {
        // Prevent multiple simultaneous requests
        if (loadingRef.current) {
            return;
        }

        loadingRef.current = true;
        setLoading(true);
        
        try {
            const params = {
                search: filtersRef.current.search,
                status: filtersRef.current.status,
                priority: filtersRef.current.priority,
                per_page: filtersRef.current.per_page,
                page: currentPageRef.current,
            };

            const response = await TicketService.getAllTickets(params);
            if (response.success && response.data) {
                // Transform the response to match PaginationData structure
                const ticketsData = response.data.tickets || [];
                const pagination = response.data.pagination || {
                    current_page: 1,
                    per_page: 10,
                    total: ticketsData.length,
                    last_page: 1
                };

                const paginationData: PaginationData<Ticket> = {
                    data: Array.isArray(ticketsData) ? ticketsData : [],
                    current_page: pagination.current_page,
                    last_page: pagination.last_page,
                    total: pagination.total,
                    per_page: pagination.per_page,
                    first_page_url: '',
                    from: ((pagination.current_page - 1) * pagination.per_page) + 1,
                    last_page_url: '',
                    next_page_url: pagination.current_page < pagination.last_page ? '' : null,
                    path: '',
                    prev_page_url: pagination.current_page > 1 ? '' : null,
                    to: Math.min(pagination.current_page * pagination.per_page, pagination.total),
                    links: []
                };
                
                setTickets(paginationData);
            } else {
                showAlert({ type: 'error', title: 'Error', message: response.message || 'Failed to fetch tickets' });
                // Set empty data to prevent map error
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
                    links: []
                });
            }
        } catch (error: any) {
            console.error('Error fetching tickets:', error);
            showAlert({ type: 'error', title: 'Error', message: 'Failed to fetch tickets' });
            // Set empty data to prevent map error
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
                links: []
            });
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, []); // EMPTY dependencies - function never recreates

    // Initial load only - SINGLE useEffect with stable function
    useEffect(() => {
        if (!initialLoadRef.current) {
            initialLoadRef.current = true;
            fetchTickets();
            fetchUsers(); // Fetch users for assignment dropdown
        }
        
        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []); // EMPTY dependency array

    // Remove the problematic useEffect that was causing continuous loading
    // Handle filter and page changes with debounce - ONLY when values actually change from user interaction
    // useEffect(() => {
    //     // Skip if initial load hasn't happened yet
    //     if (!initialLoadRef.current) {
    //         return;
    //     }

    //     const timeoutId = setTimeout(() => {
    //         if (!loadingRef.current) {
    //             fetchTickets();
    //         }
    //     }, 500);

    //     return () => clearTimeout(timeoutId);
    // }, [currentPage]);

    // Stable event handlers using useCallback with NO dependencies
    const handleSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
        }));
        setCurrentPage(1);
        
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Debounced fetch for search
        timeoutRef.current = setTimeout(() => {
            if (!loadingRef.current && initialLoadRef.current) {
                fetchTickets();
            }
        }, 500);
    }, []); // NO dependencies

    const handleFilterChange = useCallback((filterName: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value,
        }));
        setCurrentPage(1);
        
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Immediate fetch for filter changes
        timeoutRef.current = setTimeout(() => {
            if (!loadingRef.current && initialLoadRef.current) {
                fetchTickets();
            }
        }, 100);
    }, []); // NO dependencies

    const handlePerPageChange = useCallback((perPage: number) => {
        setFilters(prev => ({
            ...prev,
            per_page: perPage,
        }));
        setCurrentPage(1);
        
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Immediate fetch for per page changes
        timeoutRef.current = setTimeout(() => {
            if (!loadingRef.current && initialLoadRef.current) {
                fetchTickets();
            }
        }, 100);
    }, []); // NO dependencies

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Immediate fetch for page changes
        timeoutRef.current = setTimeout(() => {
            if (!loadingRef.current && initialLoadRef.current) {
                fetchTickets();
            }
        }, 100);
    }, []); // NO dependencies

    // Status badge component
    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'open':
                    return 'bg-blue-100 text-blue-800';
                case 'in-progress':
                    return 'bg-yellow-100 text-yellow-800';
                case 'resolved':
                    return 'bg-green-100 text-green-800';
                case 'closed':
                    return 'bg-gray-100 text-gray-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)} capitalize`}>
                {status.replace('-', ' ')}
            </span>
        );
    };

    // Priority badge component
    const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
        const getPriorityColor = (priority: string) => {
            switch (priority.toLowerCase()) {
                case 'low':
                    return 'bg-green-100 text-green-800';
                case 'medium':
                    return 'bg-yellow-100 text-yellow-800';
                case 'high':
                    return 'bg-orange-100 text-orange-800';
                case 'urgent':
                    return 'bg-red-100 text-red-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)} capitalize`}>
                {priority}
            </span>
        );
    };

    // Table columns
    const columns = useMemo(() => [
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            render: (value: string, ticket: Ticket) => (
                <div className="font-medium text-gray-900">
                    {value}
                </div>
            ),
        },
        {
            key: 'customer_id',
            label: 'Customer ID',
            render: (value: number) => (
                <div className="text-sm text-gray-600">
                    #{value}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => <StatusBadge status={value} />,
        },
        {
            key: 'priority',
            label: 'Priority',
            render: (value: string) => <PriorityBadge priority={value} />,
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            render: (value: string) => (
                <div className="text-sm text-gray-600">
                    {new Date(value).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            ),
        },
        {
            key: 'actions',
            label: 'Assign To',
            render: (_: any, ticket: Ticket) => (
                <div className="flex items-center space-x-2">
                    <select
                        value=""
                        onChange={(e) => handleAssignTicket(ticket.id, e.target.value)}
                        disabled={assigningTickets.has(ticket.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {assigningTickets.has(ticket.id) ? 'Assigning...' : 'Select Technician'}
                        </option>
                        {users.map((user: any) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
            ),
        },
    ], [users, assigningTickets, handleAssignTicket]);

    return (
        <div>
            <AlertContainer />

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
                
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={(e) => { e.preventDefault(); fetchTickets(); }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
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
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
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
                <PerPageSelector 
                    value={filters.per_page || 10} 
                    onChange={handlePerPageChange} 
                    loading={loading} 
                />

                {tickets && (
                    <div className="text-sm text-gray-600">
                        Total: {tickets.total} tickets
                    </div>
                )}
            </div>

            <Table 
                data={Array.isArray(tickets?.data) ? tickets.data : []} 
                columns={columns} 
                loading={loading} 
                emptyMessage="No tickets found" 
                className="mb-6" 
            />

            {tickets && tickets.total > 0 && (
                <Pagination
                    meta={{
                        current_page: tickets.current_page,
                        last_page: tickets.last_page,
                        per_page: tickets.per_page,
                        total: tickets.total,
                        from: tickets.from,
                        to: tickets.to
                    }}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default AllTickets;