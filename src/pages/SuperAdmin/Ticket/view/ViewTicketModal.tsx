import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

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
            setSelectedImage(null);
            setSelectedImageIndex(0);
            setImageErrors({});
        }
    }, [open, ticket]);

    const displayTicket = fullTicketData || ticket;

    const getImageUrl = useCallback((photoPath: string): string => {
        if (!photoPath) return '';

        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath;
        }

        if (photoPath.includes('storage/')) {
            const baseUrl = import.meta.env.VITE_CDN_URL || import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';
            return `${baseUrl}/${photoPath}`;
        } else {
            const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';
            return `${baseUrl}/storage/${photoPath}`;
        }

        const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';
        return `${baseUrl}/storage/${photoPath}`;
    }, []);

    const validPhotos = useMemo(() => {
        if (!displayTicket?.photo_paths) return [];

        let photos: string[] = [];

        if (typeof displayTicket.photo_paths === 'string') {
            try {
                const parsed = JSON.parse(displayTicket.photo_paths);
                photos = Array.isArray(parsed) ? parsed : [displayTicket.photo_paths];
            } catch {
                photos = [displayTicket.photo_paths];
            }
        } else if (Array.isArray(displayTicket.photo_paths)) {
            photos = displayTicket.photo_paths;
        }

        return photos
            .filter((photo) => photo && photo.trim() !== '')
            .filter((photo) => {
                const ext = photo.split('.').pop()?.toLowerCase();
                return ext && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
            })
            .map((photo) => getImageUrl(photo));
    }, [displayTicket?.photo_paths, getImageUrl]);

    const handleImageError = useCallback((index: number) => {
        setImageErrors((prev) => ({ ...prev, [index]: true }));
    }, []);

    const ImageFallback = useCallback(
        ({ index }: { index: number }) => (
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                <div className="text-center text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-xs">Image {index + 1}</p>
                    <p className="text-xs">Not Available</p>
                </div>
            </div>
        ),
        [],
    );

    const openImageModal = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl);
        setSelectedImageIndex(index);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
    };

    const navigateImage = (direction: 'prev' | 'next', photos: string[]) => {
        let newIndex;
        if (direction === 'prev') {
            newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : photos.length - 1;
        } else {
            newIndex = selectedImageIndex < photos.length - 1 ? selectedImageIndex + 1 : 0;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(photos[newIndex]);
    };

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

                                            {/* Location Information */}
                                            {(displayTicket.district || displayTicket.city || displayTicket.gramsewa_division) && (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {displayTicket.district && (
                                                            <div>
                                                                <strong className="text-gray-700">District:</strong>
                                                                <p className="mt-1 text-gray-900">{displayTicket.district}</p>
                                                            </div>
                                                        )}
                                                        {displayTicket.city && (
                                                            <div>
                                                                <strong className="text-gray-700">City:</strong>
                                                                <p className="mt-1 text-gray-900">{displayTicket.city}</p>
                                                            </div>
                                                        )}
                                                        {displayTicket.gramsewa_division && (
                                                            <div>
                                                                <strong className="text-gray-700">Grama Niladhari Division:</strong>
                                                                <p className="mt-1 text-gray-900">{displayTicket.gramsewa_division}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {validPhotos.length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Ticket Images</h3>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                                                        {validPhotos.map((photo, index) => {
                                                            const hasError = imageErrors[index];

                                                            return (
                                                                <div key={index} className="relative group cursor-pointer" onClick={() => !hasError && openImageModal(photo, index)}>
                                                                    {hasError ? (
                                                                        <ImageFallback index={index} />
                                                                    ) : (
                                                                        <img
                                                                            src={photo}
                                                                            alt={`Ticket Image ${index + 1}`}
                                                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-primary transition-colors"
                                                                            onError={() => handleImageError(index)}
                                                                            loading="lazy"
                                                                        />
                                                                    )}

                                                                    {!hasError && (
                                                                        <>
                                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center rounded-lg">
                                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                                                                                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            strokeWidth={2}
                                                                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>

                                                                            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">{index + 1}</div>
                                                                        </>
                                                                    )}

                                                                    {!hasError && (
                                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-lg">
                                                                            <p className="text-white text-xs font-medium text-center">Click to view full size</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <p className="text-xs font-medium text-blue-700">
                                                                {validPhotos.length} image{validPhotos.length !== 1 ? 's' : ''} attached • Click any image to view in full size
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedImage && (
                                                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={closeImageModal}>
                                                            <div className="relative max-w-7xl max-h-full flex items-center justify-center">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        closeImageModal();
                                                                    }}
                                                                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                                                                >
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>

                                                                {validPhotos.length > 1 && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigateImage('prev', validPhotos);
                                                                        }}
                                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                                                                    >
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                        </svg>
                                                                    </button>
                                                                )}

                                                                {validPhotos.length > 1 && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            navigateImage('next', validPhotos);
                                                                        }}
                                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200"
                                                                    >
                                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                )}

                                                                {validPhotos.length > 1 && (
                                                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                                                        {selectedImageIndex + 1} / {validPhotos.length}
                                                                    </div>
                                                                )}

                                                                <img
                                                                    src={selectedImage}
                                                                    alt={`Full size view - Attachment ${selectedImageIndex + 1}`}
                                                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

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
