import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UserLayout from '../../../components/Layouts/userLayout';
import { Ticket } from '../../../types/ticket.types';

// Dummy data for tickets
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
            {/* Page Header - Full Screen Width */}
            <div className="relative mb-6 sm:mb-8">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-screen">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-800/20 dark:via-purple-800/20 dark:to-indigo-800/20 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 border-y border-white/30 dark:border-gray-700/30"></div>

                    {/* Decorative Elements - Hidden on mobile for cleaner look */}
                    <div className="hidden sm:block absolute top-4 left-4 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                    <div className="hidden sm:block absolute bottom-4 right-4 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl"></div>

                    <div className="relative text-center py-6 sm:py-8 px-4 sm:px-8">
                        <div className="mb-4">
                            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">All Tickets</h1>
                            <div className="w-16 sm:w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                        </div>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                            Manage and track all your support tickets in one place.
                        </p>
                    </div>
                </div>
                {/* Spacer to maintain layout height */}
                <div className="h-32 sm:h-40 lg:h-48"></div>
            </div>

            {/* Content Area with Contained Width */}
            <div className="w-full max-w-none space-y-4 sm:space-y-6">
                {/* Search */}
                <div className="mb-4 sm:mb-6 max-w-sm">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Tickets
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title, description, or ticket ID..."
                            className="w-full px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="group relative">
                            {/* Card Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl sm:rounded-2xl backdrop-blur-sm group-hover:from-blue-500/15 group-hover:via-purple-500/15 group-hover:to-indigo-500/15 transition-all duration-300"></div>
                            <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-xl sm:rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl group-hover:scale-[1.02] sm:group-hover:scale-105 transition-all duration-300 backdrop-blur-sm"></div>

                            {/* Card Content */}
                            <div className="relative p-4 sm:p-6 h-full flex flex-col">
                                {/* Header */}
                                <div className="mb-3 sm:mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                        {ticket.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">#{ticket.id}</p>
                                </div>

                                {/* Description */}
                                <div className="flex-1 mb-3 sm:mb-4">
                                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-3">{ticket.description}</p>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-3 sm:pt-4">
                                    <div className="text-center">
                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTickets.length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full backdrop-blur-sm"></div>
                            <div className="relative bg-white/60 dark:bg-gray-800/60 rounded-full p-6 sm:p-8 shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm">
                                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m-4 8l4-4 4 4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-gray-900 dark:text-white">No tickets found</h3>
                        <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">{searchTerm ? 'Try adjusting your search criteria.' : "You haven't created any tickets yet."}</p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default AllTickets;
