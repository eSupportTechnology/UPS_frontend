import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAlert } from '../../../components/Alert/Alert';
import ticketService from '../../../services/ticketService';
import type { Ticket } from '../../../types/ticket.types';

interface TicketDetailModalProps {
    ticketId: string | null;
    onClose: () => void;
}

function TicketDetailModal({ ticketId, onClose }: TicketDetailModalProps) {
    const { showAlert, AlertContainer } = useAlert();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    useEffect(() => {
        if (ticketId) {
            loadTicket(ticketId);
        }
    }, [ticketId]);

    const getImageUrl = useCallback((photoPath: string): string => {
        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
            return photoPath;
        }

        // Use the hosted backend URL with storage path
        const baseUrl = 'https://ups.moratumullamethodistchurch.com';

        if (photoPath.startsWith('cdn/') || photoPath.startsWith('uploads/')) {
            return `${baseUrl}/${photoPath}`;
        }

        if (photoPath.startsWith('storage/')) {
            return `${baseUrl}/${photoPath}`;
        }

        return `${baseUrl}/storage/${photoPath}`;
    }, []);

    const validPhotos = useMemo(() => {
        if (!ticket?.photo_paths) return [];

        let photos: string[] = [];
        try {
            if (typeof ticket.photo_paths === 'string') {
                try {
                    const parsed = JSON.parse(ticket.photo_paths);
                    if (Array.isArray(parsed)) {
                        photos = parsed;
                    } else if (typeof parsed === 'string') {
                        photos = [parsed];
                    }
                } catch {
                    photos = [ticket.photo_paths];
                }
            } else if (Array.isArray(ticket.photo_paths)) {
                photos = ticket.photo_paths;
            } else {
                return [];
            }

            return photos
                .filter((photo) => photo && typeof photo === 'string' && photo.trim() !== '')
                .filter((photo) => {
                    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
                    const lowerPath = photo.toLowerCase();
                    return validExtensions.some((ext) => lowerPath.includes(ext)) || photo.startsWith('http');
                })
                .slice(0, 20);
        } catch (error) {
            return [];
        }
    }, [ticket?.photo_paths]);

    const handleImageError = useCallback((index: number) => {
        setImageErrors((prev) => new Set([...prev, index]));
    }, []);

    const ImageFallback = useCallback(
        () => (
            <div className="flex items-center justify-center h-full bg-gray-200">
                <div className="text-center p-4">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <p className="text-xs text-gray-500">Failed to load</p>
                </div>
            </div>
        ),
        [],
    );

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

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString || dateString === 'null' || dateString === 'undefined') {
            return 'Not Available';
        }

        try {
            let parsedDate: Date;

            if (dateString.includes('T') && dateString.includes('Z')) {
                parsedDate = new Date(dateString);
            } else if (dateString.includes(' ') && dateString.includes('-')) {
                parsedDate = new Date(dateString.replace(' ', 'T') + 'Z');
            } else if (dateString.includes('-') && !dateString.includes(' ')) {
                parsedDate = new Date(dateString + 'T00:00:00Z');
            } else {
                parsedDate = new Date(dateString);
            }

            if (isNaN(parsedDate.getTime())) {
                return 'Invalid Date';
            }
            return parsedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (error) {
            return 'Date unavailable';
        }
    };

    const openImageModal = useCallback((imageUrl: string, index: number) => {
        setSelectedImage(imageUrl);
        setSelectedImageIndex(index);
    }, []);

    const closeImageModal = useCallback(() => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
    }, []);

    const navigateImage = useCallback(
        (direction: 'prev' | 'next', validPhotos: string[]) => {
            if (!validPhotos.length) return;

            let newIndex = selectedImageIndex;
            if (direction === 'prev') {
                newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : validPhotos.length - 1;
            } else {
                newIndex = selectedImageIndex < validPhotos.length - 1 ? selectedImageIndex + 1 : 0;
            }

            setSelectedImageIndex(newIndex);
            setSelectedImage(getImageUrl(validPhotos[newIndex]));
        },
        [selectedImageIndex, getImageUrl],
    );

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-600">Loading ticket details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md">
                    <div className="text-center">
                        <div className="bg-red-100 rounded-full p-4 mb-4 inline-block">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Ticket not found</h3>
                        <p className="mt-2 text-sm text-gray-500">The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
                        <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Ticket Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-primary text-white p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{ticket.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-white/20 text-white border border-white/30">
                                            {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                                </div>
                            </div>

                            {validPhotos.length > 0 && (
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Attachments ({validPhotos.length})
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {validPhotos.map((photo, index) => {
                                            const imageUrl = getImageUrl(photo);
                                            const hasError = imageErrors.has(index);

                                            return (
                                                <div
                                                    key={index}
                                                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                                                    onClick={() => openImageModal(imageUrl, index)}
                                                >
                                                    <div className="aspect-square bg-gray-100 relative">
                                                        {hasError ? (
                                                            <ImageFallback />
                                                        ) : (
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Attachment ${index + 1} - ${ticket.title}`}
                                                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                onError={() => handleImageError(index)}
                                                                loading="lazy"
                                                            />
                                                        )}

                                                        {!hasError && (
                                                            <>
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                                                                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">{index + 1}</div>
                                                            </>
                                                        )}
                                                    </div>

                                                    {!hasError && (
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
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
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2">Ticket Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Ticket ID</div>
                                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1">Status</div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                    </div>

                                    {(ticket.technician_name || ticket.assigned_to) && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">Technician</div>
                                            <div className="text-sm font-medium text-gray-900">{ticket.technician_name || `Technician ID: ${ticket.assigned_to}`}</div>
                                        </div>
                                    )}

                                    {ticket.accepted_at && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">Accepted At</div>
                                            <div className="text-sm font-medium text-gray-900">{formatDate(ticket.accepted_at)}</div>
                                        </div>
                                    )}

                                    {ticket.completed_at && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-xs text-gray-500 mb-1">Completed At</div>
                                            <div className="text-sm font-medium text-gray-900">{formatDate(ticket.completed_at)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketDetailModal;
