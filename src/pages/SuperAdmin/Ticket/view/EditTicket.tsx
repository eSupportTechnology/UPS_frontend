import React, { useState } from 'react';
import { Ticket } from '../../../../types/ticket.types';
import { TicketService } from '../../../../services/ticketService';
import { useAlert } from '../../../../components/Alert/Alert';

interface EditTicketProps {
    ticket: Ticket;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const EditTicket: React.FC<EditTicketProps> = ({ ticket, isOpen, onClose, onUpdate }) => {
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await TicketService.updateTicket(ticket.id, formData);
            if (response.success) {
                showAlert({ type: 'success', title: 'Success', message: 'Ticket updated successfully' });
                onUpdate();
                onClose();
            } else {
                showAlert({ type: 'error', title: 'Error', message: response.message || 'Failed to update ticket' });
            }
        } catch (error: any) {
            console.error('Error updating ticket:', error);
            showAlert({ type: 'error', title: 'Error', message: 'Failed to update ticket' });
        } finally {
            setIsLoading(false);
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
                                            Edit Ticket
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
                                        {/* Ticket ID (Read-only) */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Ticket ID
                                            </label>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                                                {ticket.id}
                                            </p>
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        {/* Status and Priority */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Status
                                                </label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="open">Open</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Priority
                                                </label>
                                                <select
                                                    id="priority"
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={4}
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
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

export default EditTicket;
