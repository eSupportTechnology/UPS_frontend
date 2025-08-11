import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '../../../components/Layouts/userLayout';
import { Ticket } from '../../../types/ticket.types';

const dummyTickets: Ticket[] = [
    {
        id: 'TK001',
        customer_id: 1,
        title: 'Login Issue with Mobile App',
        description: 'Unable to login to the mobile application. Getting authentication error.',
        status: 'open',
        priority: 'high',
        created_at: '2025-01-15T10:30:00Z',
        updated_at: '2025-01-16T14:20:00Z',
    },
    {
        id: 'TK002',
        customer_id: 1,
        title: 'Payment Gateway Error',
        description: 'Transaction failed during checkout process. Need immediate assistance.',
        status: 'in-progress',
        priority: 'urgent',
        created_at: '2025-01-14T09:15:00Z',
        updated_at: '2025-01-16T11:45:00Z',
    },
    {
        id: 'TK003',
        customer_id: 1,
        title: 'Account Information Update',
        description: 'Request to update account information and contact details.',
        status: 'resolved',
        priority: 'medium',
        created_at: '2025-01-13T16:45:00Z',
        updated_at: '2025-01-15T09:30:00Z',
    },
    {
        id: 'TK004',
        customer_id: 1,
        title: 'Feature Request - Dark Mode',
        description: 'Would like to request a dark mode option for the dashboard interface.',
        status: 'open',
        priority: 'low',
        created_at: '2025-01-12T14:20:00Z',
        updated_at: '2025-01-14T16:10:00Z',
    },
    {
        id: 'TK005',
        customer_id: 1,
        title: 'Data Export Functionality',
        description: 'Need assistance with exporting account data and transaction history.',
        status: 'closed',
        priority: 'medium',
        created_at: '2025-01-11T11:30:00Z',
        updated_at: '2025-01-13T15:45:00Z',
    },
];

const AllTickets = () => {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setTickets(dummyTickets);
            setLoading(false);
        }, 1000);
    }, []);

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

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

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
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tickets.filter((ticket) => ticket.status === 'open').length}</div>
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
                                {/* Search */}
                                <div className="mb-6">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Tickets
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by title, description, or ticket ID..."
                                            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:text-white transition-all duration-200"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
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
                                                        <button className="px-3 py-1.5 text-xs font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200 border border-primary/30 dark:border-primary/40 hover:border-primary/50 dark:hover:border-primary/60">
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Empty State */}
                                {filteredTickets.length === 0 && (
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
                                            {searchTerm ? 'Try adjusting your search criteria.' : "You haven't created any tickets yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default AllTickets;
