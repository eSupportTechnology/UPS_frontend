import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Ticket } from '../../../types/ticket.types';
import ticketService from '../../../services/ticketService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';
import technicianService from '../../../services/technicianService';
import { generateTicketPDF, generateTicketCSV, generateDetailedTicketCSV } from '../../../utils/downloadUtils';

const TicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState<string>('');
    const [assigningLoading, setAssigningLoading] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Ticket Details'));
        if (id) {
            fetchTicketDetails(id);
        }
        loadTechnicians();
    }, [id, dispatch]);

    const loadTechnicians = async () => {
        try {
            const response = await technicianService.getTechniciansByType('outside');
            if (response.success && Array.isArray(response.data)) {
                setTechnicians(response.data);
            }
        } catch (error) {
            console.error('Failed to load technicians:', error);
        }
    };

    const handleAssignTechnician = async () => {
        if (!selectedTechnician) {
            toast.error('Please select a technician');
            return;
        }

        if (!id) return;

        setAssigningLoading(true);
        try {
            const response = await ticketService.assignTicket(id, selectedTechnician);
            if (response.success) {
                toast.success('Technician assigned successfully');
                setShowAssignModal(false);
                setSelectedTechnician('');
                // Refresh ticket details
                await fetchTicketDetails(id);
            } else {
                toast.error(response.message || 'Failed to assign technician');
            }
        } catch (error) {
            toast.error('Error assigning technician');
            console.error('Assignment error:', error);
        } finally {
            setAssigningLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!ticket) return;
        try {
            await generateTicketPDF({ ticket });
            toast.success('PDF downloaded successfully');
            setShowDownloadMenu(false);
        } catch (error) {
            toast.error('Failed to generate PDF');
            console.error('PDF generation error:', error);
        }
    };

    const handleDownloadCSV = () => {
        if (!ticket) return;
        try {
            generateTicketCSV(ticket);
            toast.success('CSV downloaded successfully');
            setShowDownloadMenu(false);
        } catch (error) {
            toast.error('Failed to generate CSV');
            console.error('CSV generation error:', error);
        }
    };

    const handleDownloadDetailedCSV = () => {
        if (!ticket) return;
        try {
            generateDetailedTicketCSV(ticket);
            toast.success('Detailed CSV downloaded successfully');
            setShowDownloadMenu(false);
        } catch (error) {
            toast.error('Failed to generate detailed CSV');
            console.error('Detailed CSV generation error:', error);
        }
    };

    const fetchTicketDetails = async (ticketId: string) => {
        setLoading(true);
        try {
            const response = await ticketService.getTicketById(ticketId);
            if (response.success && response.data) {
                setTicket(response.data);
            } else {
                toast.error(response.message || 'Failed to load ticket details');
                navigate('/super-admin/all-outside-jobs');
            }
        } catch (error) {
            toast.error('Error fetching ticket details');
            navigate('/super-admin/all-outside-jobs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-gray-500">Ticket not found</p>
                    <button
                        onClick={() => navigate('/super-admin/all-outside-jobs')}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'assigned':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'accepted':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
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
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <Link to="/super-admin/all-outside-jobs" className="text-primary hover:underline transition-colors">
                            Outside Jobs
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Ticket Details</span>
                    </li>
                </ul>
            </div>

            {/* Back Button and Download Menu */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary hover:underline transition-colors"
                >
                    ← Back
                </button>

                {/* Download Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>

                    {/* Dropdown Menu */}
                    {showDownloadMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-200 dark:border-gray-700"
                            >
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 16.5a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H3zM15 7H5"></path>
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">PDF Document</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Professional formatted PDF</p>
                                </div>
                            </button>

                            <button
                                onClick={handleDownloadCSV}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 border-b border-gray-200 dark:border-gray-700"
                            >
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">CSV (Compact)</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Single row CSV format</p>
                                </div>
                            </button>

                            <button
                                onClick={handleDownloadDetailedCSV}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                            >
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">CSV (Detailed)</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Multi-row CSV format</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Ticket Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.title}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {ticket.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`text-sm font-medium rounded-full px-3 py-1 capitalize ${getStatusColor(ticket.status || '')}`}>
                                    {ticket.status || 'Open'}
                                </span>
                                <span className={`text-sm font-medium rounded-full px-3 py-1 capitalize ${getPriorityColor(ticket.priority || '')}`}>
                                    {ticket.priority || 'Medium'}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{ticket.description}</p>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                <p className="text-gray-900 dark:text-white font-medium">{ticket.customer_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="text-gray-900 dark:text-white font-medium">{ticket.customer_email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-gray-900 dark:text-white font-medium">{ticket.customer_phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                                <span className={`text-sm font-medium rounded px-2 py-1 capitalize inline-block ${
                                    ticket.customer_type === 'company'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}>
                                    {ticket.customer_type || '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Address/Branch Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Information</h2>
                        {ticket.customer_type === 'personal' ? (
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                <p className="text-gray-900 dark:text-white font-medium">{ticket.address || '-'}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ticket.branch_name && (
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Branch Location</p>
                                            <p className="text-gray-900 dark:text-white font-medium">{ticket.branch_name}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded font-semibold whitespace-nowrap ml-2 ${
                                            ticket.is_primary
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {ticket.is_primary ? 'Headquarters' : 'Branch'}
                                        </span>
                                    </div>
                                )}
                                {ticket.address && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Site Address</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{ticket.address}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Photos */}
                    {ticket.photo_paths && ticket.photo_paths.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Photos</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {Array.isArray(ticket.photo_paths) ? (
                                    ticket.photo_paths.map((photo, index) => {
                                        // Handle both direct paths and nested JSON
                                        let photoPath = '';

                                        if (typeof photo === 'string') {
                                            photoPath = photo;
                                        } else if (typeof photo === 'object' && photo?.path) {
                                            photoPath = photo.path;
                                        }

                                        if (!photoPath || photoPath.trim() === '') return null;

                                        // Build the correct image URL
                                        let imageUrl = '';
                                        if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
                                            imageUrl = photoPath;
                                        } else if (photoPath.startsWith('storage/')) {
                                            imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${photoPath}`;
                                        } else {
                                            imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${photoPath}`;
                                        }


                                        return (
                                            <div
                                                key={index}
                                                className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square cursor-pointer group"
                                                onClick={() => setFullscreenImageIndex(index)}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`Ticket photo ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 20v-4m0 4h4m-4-4l5-5m11 5v4m0-4h-4m4 0l-5-5" />
                                                    </svg>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-3 text-center text-gray-500">No photos available</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Quick Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Ticket ID</p>
                                <p className="text-gray-900 dark:text-white font-mono text-xs break-all">{ticket.id}</p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-500 dark:text-gray-400">Status</p>
                                <p className="text-gray-900 dark:text-white font-medium capitalize">{ticket.status || '-'}</p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-500 dark:text-gray-400">Priority</p>
                                <p className="text-gray-900 dark:text-white font-medium capitalize">{ticket.priority || '-'}</p>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-500 dark:text-gray-400 mb-2">Assigned Technician</p>
                                {ticket.technician_name ? (
                                    <>
                                        <p className="text-gray-900 dark:text-white font-medium">{ticket.technician_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.technician_email}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Not assigned yet</p>
                                        <button
                                            onClick={() => setShowAssignModal(true)}
                                            className="w-full px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/80 transition-colors"
                                        >
                                            Assign Technician
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-gray-500 dark:text-gray-400">Created</p>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}
                                </p>
                            </div>

                            {ticket.completed_at && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <p className="text-gray-500 dark:text-gray-400">Completed</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {new Date(ticket.completed_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Technician Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Assign Technician
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Select Technician
                            </label>
                            <select
                                value={selectedTechnician}
                                onChange={(e) => setSelectedTechnician(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">-- Choose a technician --</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={String(tech.id)}>
                                        {tech.name} ({tech.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedTechnician('');
                                }}
                                disabled={assigningLoading}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignTechnician}
                                disabled={assigningLoading || !selectedTechnician}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                            >
                                {assigningLoading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen Image Modal */}
            {fullscreenImageIndex !== null && ticket?.photo_paths && ticket.photo_paths.length > 0 && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <button
                        onClick={() => setFullscreenImageIndex(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => setFullscreenImageIndex((prev) => (prev === 0 ? (ticket?.photo_paths?.length || 1) - 1 : (prev || 0) - 1))}
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setFullscreenImageIndex((prev) => (prev === (ticket?.photo_paths?.length || 1) - 1 ? 0 : (prev || 0) + 1))}
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div className="max-w-4xl max-h-[90vh] flex items-center justify-center">
                        {(() => {
                            const photo = ticket?.photo_paths?.[fullscreenImageIndex];
                            const photoPath = typeof photo === 'string' ? photo : (typeof photo === 'object' ? (photo as any)?.path : '');

                            if (!photoPath) return null;

                            const imageUrl = photoPath.startsWith('http://') || photoPath.startsWith('https://')
                                ? photoPath
                                : photoPath.startsWith('storage/')
                                ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/${photoPath}`
                                : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${photoPath}`;

                            return (
                                <img
                                    src={imageUrl}
                                    alt={`Full view photo ${fullscreenImageIndex + 1}`}
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                />
                            );
                        })()}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
                        {fullscreenImageIndex + 1} / {ticket?.photo_paths?.length || 0}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketDetail;
