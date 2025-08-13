import { Fragment, useEffect, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { Ticket } from '../../../../types/ticket.types';
import { TicketService } from '../../../../services/ticketService';

interface ViewTicketModalProps {
    open: boolean;
    onClose: () => void;
    ticket: Ticket | null;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ open, onClose, ticket }) => {
    const [fullTicketData, setFullTicketData] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (open && ticket?.id) {
                setLoading(true);
                try {
                    const response = await TicketService.getTicketById(ticket.id);
                    if (response.success && response.data) {
                        setFullTicketData(response.data);
                    } else {
                        setFullTicketData(ticket);
                    }
                } catch (error) {
                    console.error('Error fetching ticket details:', error);
                    setFullTicketData(ticket);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (open) {
            fetchTicketDetails();
        } else {
            setFullTicketData(null);
            setLoading(false);
        }
    }, [open, ticket]);

    const displayTicket = fullTicketData || ticket;

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleString();
        } catch (error) {
            return '-';
        }
    };

    const getStatusColor = (status: string) => {
        if (!status) return 'bg-gray-100 text-gray-800 border-gray-300';
        switch (status.toLowerCase()) {
            case 'open':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'assigned':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'accepted':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        if (!priority) return 'bg-gray-100 text-gray-800 border-gray-300';
        switch (priority.toLowerCase()) {
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'high':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={onClose} className="relative z-[51]">
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl text-black dark:text-white-dark">
                                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none z-10">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                    {displayTicket ? `Ticket Details: ${displayTicket.title}` : 'View Ticket'}
                                </div>
                                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                                    {loading && (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <span className="ml-3 text-gray-600">Loading ticket details...</span>
                                        </div>
                                    )}

                                    {!loading && displayTicket && (
                                        <>
                                            {/* Basic Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ticket Information</h3>
                                                    <div>
                                                        <strong className="text-gray-700">Ticket ID:</strong>
                                                        <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">{displayTicket.id}</span>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Title:</strong>
                                                        <span className="ml-2 text-gray-900">{displayTicket.title}</span>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Status:</strong>
                                                        <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(displayTicket.status || 'open')} capitalize`}>
                                                            {displayTicket.status || 'Open'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Priority:</strong>
                                                        <span className={`ml-2 px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(displayTicket.priority || 'medium')} capitalize`}>
                                                            {displayTicket.priority || 'Medium'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Customer Information</h3>
                                                    <div>
                                                        <strong className="text-gray-700">Customer Name:</strong>
                                                        <p className="mt-1 text-gray-900">{displayTicket.customer_name || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Email:</strong>
                                                        <p className="mt-1 text-gray-900">{displayTicket.customer_email || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Phone:</strong>
                                                        <p className="mt-1 text-gray-900">{displayTicket.customer_phone || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Address:</strong>
                                                        <p className="mt-1 text-gray-900">{displayTicket.customer_address || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-gray-900 whitespace-pre-wrap">{displayTicket.description}</p>
                                                </div>
                                            </div>

                                            {/* Technician Information */}
                                            {(displayTicket.assigned_to || displayTicket.technician_name) && (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Assigned Technician</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <strong className="text-gray-700">Name:</strong>
                                                            <p className="mt-1 text-gray-900">{displayTicket.technician_name || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <strong className="text-gray-700">Email:</strong>
                                                            <p className="mt-1 text-gray-900">{displayTicket.technician_email || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <strong className="text-gray-700">Phone:</strong>
                                                            <p className="mt-1 text-gray-900">{displayTicket.technician_phone || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timeline */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Timeline</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <strong className="text-gray-700">Created At:</strong>
                                                        <p className="mt-1 text-gray-900">{formatDate(displayTicket.created_at)}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Accepted At:</strong>
                                                        <p className="mt-1 text-gray-900">{formatDate(displayTicket.accepted_at)}</p>
                                                    </div>
                                                    <div>
                                                        <strong className="text-gray-700">Completed At:</strong>
                                                        <p className="mt-1 text-gray-900">{formatDate(displayTicket.completed_at)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Photos */}
                                            {displayTicket.photo_paths && Array.isArray(displayTicket.photo_paths) && displayTicket.photo_paths.length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Attachments</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {displayTicket.photo_paths.map((photoPath, index) => (
                                                            <div key={index} className="relative group">
                                                                <img
                                                                    src={photoPath}
                                                                    alt={`Attachment ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                                    onClick={() => window.open(photoPath, '_blank')}
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Click to view</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-end mt-6 pt-4 border-t">
                                        <button
                                            type="button"
                                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary transition-colors"
                                            onClick={onClose}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ViewTicketModal;
