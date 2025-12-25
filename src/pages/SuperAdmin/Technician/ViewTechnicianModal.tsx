import React, { useState, useEffect } from 'react';
import technicianService from '../../../services/technicianService';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../utils/imageUrl';

interface ViewTechnicianModalProps {
    isOpen: boolean;
    technicianId: string;
    onClose: () => void;
}

interface Technician {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    technician_type: 'inside' | 'outside';
    employment_type?: 'part_time' | 'full_time';
    profile_image?: string;
    specialization?: string;
    is_active: boolean;
    created_at?: string;
}

const ViewTechnicianModal: React.FC<ViewTechnicianModalProps> = ({
    isOpen,
    technicianId,
    onClose,
}) => {
    const [loading, setLoading] = useState(true);
    const [technician, setTechnician] = useState<Technician | null>(null);
    const [brokenImage, setBrokenImage] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTechnician();
        }
    }, [isOpen, technicianId]);

    const loadTechnician = async () => {
        setLoading(true);
        try {
            const response = await technicianService.getTechnician(technicianId);
            if (response.success && response.data) {
                setTechnician(response.data);
                setBrokenImage(false);
            }
        } catch (error) {
            console.error('Error loading technician:', error);
            toast.error('Failed to load technician details');
        } finally {
            setLoading(false);
        }
    };

    const getTechnicianTypeLabel = (type: string) => {
        return type === 'inside' ? 'Inside (Workshop)' : 'Outside (Field Service)';
    };

    const getEmploymentTypeLabel = (type?: string) => {
        return type === 'full_time' ? 'Full Time' : type === 'part_time' ? 'Part Time' : 'N/A';
    };

    const getTechnicianTypeColor = (type: string) => {
        return type === 'inside' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Technician Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">Loading technician details...</p>
                    </div>
                ) : technician ? (
                    <div className="p-6 space-y-6">
                        {/* Profile Image & Basic Info */}
                        <div className="flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0">
                                {technician.profile_image && !brokenImage ? (
                                    <img
                                        src={getImageUrl(technician.profile_image)}
                                        alt={technician.name}
                                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
                                        onError={() => setBrokenImage(true)}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-400">
                                            {technician.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {technician.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {technician.email}
                                </p>

                                <div className="flex gap-3 flex-wrap">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getTechnicianTypeColor(
                                            technician.technician_type
                                        )}`}
                                    >
                                        {getTechnicianTypeLabel(technician.technician_type)}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            technician.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {technician.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Email
                                    </p>
                                    <p className="text-gray-900 dark:text-white mt-1">{technician.email}</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Phone
                                    </p>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {technician.phone || '-'}
                                    </p>
                                </div>

                                {/* Technician Type */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Technician Type
                                    </p>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {getTechnicianTypeLabel(technician.technician_type)}
                                    </p>
                                </div>

                                {/* Employment Type */}
                                {technician.technician_type === 'inside' && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            Employment Type
                                        </p>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {getEmploymentTypeLabel(technician.employment_type)}
                                        </p>
                                    </div>
                                )}

                                {/* Specialization */}
                                {technician.specialization && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            Specialization
                                        </p>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {technician.specialization}
                                        </p>
                                    </div>
                                )}

                                {/* Address */}
                                {technician.address && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            Address
                                        </p>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {technician.address}
                                        </p>
                                    </div>
                                )}

                                {/* Created Date */}
                                {technician.created_at && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            Created
                                        </p>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {new Date(technician.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">Failed to load technician details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTechnicianModal;
