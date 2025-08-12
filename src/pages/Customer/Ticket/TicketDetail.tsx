import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserLayout from '../../../components/Layouts/userLayout';
import { useAlert } from '../../../components/Alert/Alert';
import ticketService from '../../../services/ticketService';
import type { Ticket } from '../../../types/ticket.types';

function TicketDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert, AlertContainer } = useAlert();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadTicket(id);
        }
    }, [id]);

    const loadTicket = async (ticketId: string) => {
        try {
            setLoading(true);
            const response = await ticketService.getTicketById(ticketId);
            if (response.success && response.data) {
                setTicket(response.data);
            } else {
                throw new Error(response.message || 'Failed to load ticket');
            }
        } catch (error: any) {
            console.error('Error loading ticket:', error);
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to load ticket details. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <UserLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading ticket details...</p>
                    </div>
                </div>
            </UserLayout>
        );
    }

    if (!ticket) {
        return (
            <UserLayout>
                <AlertContainer />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-4 inline-block">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ticket not found</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
                        <button onClick={() => navigate('/customer/ticket/all-tickets')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            Back to All Tickets
                        </button>
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
                {/* Back Button */}
                <div className="mb-6">
                    <button onClick={() => navigate('/customer/ticket/all-tickets')} className="flex items-center text-primary hover:text-primary-dark font-medium transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to All Tickets
                    </button>
                </div>

                {/* Ticket Detail Card */}
                <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-primary/20 dark:border-primary/30 overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-white p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{ticket.title}</h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)} bg-white/20 text-white`}>
                                        {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)} bg-white/20 text-white`}>
                                        {ticket.priority.replace(/\b\w/g, (l) => l.toUpperCase())} Priority
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0 text-sm text-white/80">
                                <div>Ticket ID: {ticket.id}</div>
                                <div>Created: {formatDate(ticket.created_at)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                            <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </div>

                        {/* Photos */}
                        {ticket.photo_paths && ticket.photo_paths.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Attachments</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {ticket.photo_paths.map((photo, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={`/storage/${photo}`}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 group-hover:shadow-lg transition-shadow cursor-pointer"
                                                onClick={() => window.open(`/storage/${photo}`, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ticket Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ticket Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                        {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </span>
                                </div>

                                <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created</div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(ticket.created_at)}</div>
                                </div>
                                <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(ticket.updated_at)}</div>
                                </div>
                                {ticket.assigned_to && (
                                    <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Assigned To</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{ticket.assigned_to}</div>
                                    </div>
                                )}
                                {ticket.accepted_at && (
                                    <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accepted At</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(ticket.accepted_at)}</div>
                                    </div>
                                )}
                                {ticket.completed_at && (
                                    <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-lg p-4">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed At</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(ticket.completed_at)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default TicketDetail;
