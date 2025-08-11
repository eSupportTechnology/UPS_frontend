import React, { useState } from 'react';
import { Ticket } from '../../../../types/ticket.types';
import { TicketService } from '../../../../services/ticketService';
import { useAlert } from '../../../../components/Alert/Alert';

interface DeleteTicketModalProps {
    ticket: Ticket;
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteTicketModal: React.FC<DeleteTicketModalProps> = ({ ticket, isOpen, onClose, onDelete }) => {
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            const response = await TicketService.deleteTicket(ticket.id);
            if (response.success) {
                showAlert({ type: 'success', title: 'Success', message: 'Ticket deleted successfully' });
                onDelete();
                onClose();
            } else {
                showAlert({ type: 'error', title: 'Error', message: response.message || 'Failed to delete ticket' });
            }
        } catch (error: any) {
            console.error('Error deleting ticket:', error);
            showAlert({ type: 'error', title: 'Error', message: 'Failed to delete ticket' });
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

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                    Delete Ticket
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Are you sure you want to delete this ticket? This action cannot be undone.
                                    </p>
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {ticket.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            ID: {ticket.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteTicketModal;
