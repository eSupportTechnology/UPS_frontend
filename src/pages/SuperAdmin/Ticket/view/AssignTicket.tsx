import React, { useState, useEffect } from 'react';
import { Ticket } from '../../../../types/ticket.types';
import { User } from '../../../../types/user.types';
import { TicketService } from '../../../../services/ticketService';
import { UserService } from '../../../../services/userService';
import { useAlert } from '../../../../components/Alert/Alert';

interface AssignTicketProps {
    ticket: Ticket;
    isOpen: boolean;
    onClose: () => void;
    onAssign: () => void;
}

const AssignTicket: React.FC<AssignTicketProps> = ({ ticket, isOpen, onClose, onAssign }) => {
    const { showAlert } = useAlert();
    const [assignedTo, setAssignedTo] = useState<string>('');
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTechnicians, setLoadingTechnicians] = useState(false);

    if (!isOpen) return null;

    // Fetch technicians when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchTechnicians();
        }
    }, [isOpen]);

    const fetchTechnicians = async () => {
        setLoadingTechnicians(true);
        try {
            const response = await UserService.getUsers(1, { 
                role: 4, // USER_ROLES.TECHNICIAN 
                is_active: true
            });
            if (response.users && response.users.data) {
                setTechnicians(response.users.data);
            } else {
                showAlert({ type: 'error', title: 'Error', message: 'Failed to load technicians' });
            }
        } catch (error: any) {
            console.error('Error fetching technicians:', error);
            showAlert({ type: 'error', title: 'Error', message: 'Failed to load technicians' });
        } finally {
            setLoadingTechnicians(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!assignedTo) {
            showAlert({ type: 'error', title: 'Error', message: 'Please select a technician' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await TicketService.assignTicket(ticket.id, assignedTo);
            if (response.success) {
                showAlert({ type: 'success', title: 'Success', message: 'Ticket assigned successfully' });
                onAssign();
                onClose();
            } else {
                showAlert({ type: 'error', title: 'Error', message: response.message || 'Failed to assign ticket' });
            }
        } catch (error: any) {
            console.error('Error assigning ticket:', error);
            showAlert({ type: 'error', title: 'Error', message: 'Failed to assign ticket' });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Assign Ticket
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Ticket Info */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ticket Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Title:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ticket.title}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Customer ID:</span>
                                                    <span className="text-sm text-gray-900 dark:text-white">#{ticket.customer_id}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                                                        {ticket.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assign To */}
                                        <div>
                                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Assign to Technician <span className="text-red-500">*</span>
                                            </label>
                                            {loadingTechnicians ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading technicians...</span>
                                                </div>
                                            ) : (
                                                <select
                                                    id="assignedTo"
                                                    name="assignedTo"
                                                    value={assignedTo}
                                                    onChange={(e) => setAssignedTo(e.target.value)}
                                                    required
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Select a technician</option>
                                                    {technicians.map((tech) => (
                                                        <option key={tech.id} value={tech.id}>
                                                            {tech.name} ({tech.email})
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {/* Description (Read-only) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600">
                                                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                                    {ticket.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={isLoading || loadingTechnicians || !assignedTo}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Assigning...
                                    </>
                                ) : (
                                    'Assign Ticket'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignTicket;
