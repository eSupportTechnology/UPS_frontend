import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import UserLayout from '../../components/Layouts/userLayout';
import ticketService from '../../services/ticketService';
import { Ticket } from '../../types/ticket.types';
import TicketDetailModal from '../Customer/Ticket/TicketDetail';

function Dashboard() {
    const { user } = useSelector((state: IRootState) => state.auth);
    const navigate = useNavigate();
    const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadRecentTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ticketService.getRecentTickets();
            if (response.success && response.data) {
                setRecentTickets(response.data.tickets || []);
            } else {
                setError(response.message || 'Failed to load tickets');
            }
        } catch (error: any) {
            console.error('Failed to load recent tickets:', error);
            setError('Unable to load tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRecentTickets();
    }, [loadRecentTickets]);

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    const formatCustomerSince = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }, []);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in-progress':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    }, []);

    const handleTicketClick = useCallback((ticketId: string) => {
        setSelectedTicketId(ticketId);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedTicketId(null);
    }, []);

    const handleWhatsAppClick = useCallback(() => {
        window.open('https://wa.me/your-whatsapp-number', '_blank', 'noopener,noreferrer');
    }, []);

    const getGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);
    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                {/* Quick Actions - Improved with proper touch targets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <button
                        onClick={() => navigate('/customer/ticket/all-tickets')}
                        aria-label="View all tickets"
                        className="group relative bg-white dark:bg-gray-800 border-2 border-primary dark:border-primary-light rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 min-h-[60px]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">View All Tickets</span>
                            </div>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary dark:text-primary-light group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/customer/ticket/create-ticket')}
                        aria-label="Create a new support ticket"
                        className="group relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/30 min-h-[60px]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-sm sm:text-base">Create New Ticket</span>
                            </div>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Two Column Layout for Tickets and WhatsApp */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Recent Tickets - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-1.5 bg-white/20 rounded-lg">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-base sm:text-lg font-semibold text-white">Recent Tickets</h2>
                                </div>
                                <button
                                    onClick={loadRecentTickets}
                                    aria-label="Refresh tickets"
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                                    disabled={loading}
                                >
                                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-3 sm:p-4">
                                {loading ? (
                                    <div role="status" aria-label="Loading tickets" className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                                                </div>
                                                <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-12" role="alert" aria-live="polite">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Failed to load tickets</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                                        <button
                                            onClick={loadRecentTickets}
                                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-4 focus:ring-primary/20"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Try Again
                                        </button>
                                    </div>
                                ) : recentTickets.length > 0 ? (
                                    <div className="space-y-2">
                                        {recentTickets.map((ticket) => (
                                            <button
                                                key={ticket.id}
                                                onClick={() => handleTicketClick(ticket.id)}
                                                aria-label={`View ticket: ${ticket.title}, Status: ${ticket.status}, Created: ${formatDate(ticket.created_at)}`}
                                                className="group w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                                            >
                                                <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                                                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{ticket.title}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formatDate(ticket.created_at)}</p>
                                                </div>
                                                <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                                        {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </span>
                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mb-4">
                                            <svg className="w-10 h-10 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Ready to get support?</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">Create your first ticket and our team will assist you right away</p>
                                        <button
                                            onClick={() => navigate('/customer/create-ticket')}
                                            className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/20"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Create Your First Ticket
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Section - Takes 1 column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                        </svg>
                                    </div>
                                    <h2 className="text-sm sm:text-base font-semibold text-white">WhatsApp Support</h2>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 flex flex-col items-center flex-1 justify-center">
                                <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
                                    <img
                                        src="/assets/images/qr.png"
                                        alt="Scan this QR code to join our WhatsApp support group"
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 text-center">Get Instant Support</h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-4 px-2">
                                    Join our WhatsApp group for real-time updates, quick responses, and direct support from our team
                                </p>
                                <button
                                    onClick={handleWhatsAppClick}
                                    aria-label="Join WhatsApp support group"
                                    className="w-full flex items-center justify-center px-4 py-2.5 bg-green-500 text-white font-medium text-sm rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-500/30 min-h-[44px]"
                                >
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                    </svg>
                                    <span>Join WhatsApp Group</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Detail Modal */}
            {showModal && <TicketDetailModal ticketId={selectedTicketId} onClose={handleCloseModal} />}
        </UserLayout>
    );
}

export default Dashboard;
