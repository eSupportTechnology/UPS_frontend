import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import technicianService from '../../../services/technicianService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';
import EditTechnicianModal from './EditTechnicianModal';
import ViewTechnicianModal from './ViewTechnicianModal';
import { getImageUrl } from '../../../utils/imageUrl';

interface Technician {
    id: string;
    name: string;
    email: string;
    phone?: string;
    technician_type: 'inside' | 'outside';
    employment_type?: 'part_time' | 'full_time';
    profile_image?: string;
    specialization?: string;
    is_active: boolean;
}

const TechnicianList: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'inside' | 'outside'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

    useEffect(() => {
        dispatch(setPageTitle('Manage Technicians'));
        loadTechnicians();
    }, [dispatch]);

    useEffect(() => {
        filterTechnicians();
    }, [technicians, filterType, searchTerm]);

    const loadTechnicians = async () => {
        setLoading(true);
        try {
            const response = await technicianService.getAllTechnicians();
            if (response.success) {
                const techList = Array.isArray(response.data) ? response.data : response.data?.data || [];
                setTechnicians(techList);
            } else {
                toast.error(response.message || 'Failed to load technicians');
            }
        } catch (error) {
            console.error('Error loading technicians:', error);
            toast.error('An error occurred while loading technicians');
        } finally {
            setLoading(false);
        }
    };

    const filterTechnicians = () => {
        let filtered = technicians;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter((t) => t.technician_type === filterType);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (t) =>
                    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTechnicians(filtered);
    };

    const getTechnicianTypeColor = (type: string) => {
        return type === 'inside' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
    };

    const getTechnicianTypeLabel = (type: string) => {
        return type === 'inside' ? 'Inside (Workshop)' : 'Outside (Field Service)';
    };

    const getEmploymentTypeLabel = (type?: string) => {
        return type === 'full_time' ? 'Full Time' : type === 'part_time' ? 'Part Time' : 'N/A';
    };

    const handleOpenView = (id: string) => {
        setSelectedTechnicianId(id);
        setViewModalOpen(true);
    };

    const handleCloseView = () => {
        setViewModalOpen(false);
        setSelectedTechnicianId('');
    };

    const handleOpenEdit = (id: string) => {
        setSelectedTechnicianId(id);
        setEditModalOpen(true);
    };

    const handleCloseEdit = () => {
        setEditModalOpen(false);
        setSelectedTechnicianId('');
    };

    const handleEditSuccess = () => {
        loadTechnicians();
    };

    const handleDelete = async (id: string, name: string) => {
        Swal.fire({
            title: 'Delete Technician?',
            html: `Are you sure you want to delete <strong>${name}</strong>?<br><br><span style="color: #dc2626;">This action cannot be undone.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await technicianService.deleteTechnician(id);
                    if (response.success) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: response.message || 'Technician deleted successfully',
                            icon: 'success',
                            confirmButtonColor: '#10b981',
                        });
                        loadTechnicians();
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: response.message || 'Failed to delete technician',
                            icon: 'error',
                            confirmButtonColor: '#ef4444',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting technician:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An error occurred while deleting the technician',
                        icon: 'error',
                        confirmButtonColor: '#ef4444',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Manage Technicians</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/super-admin/create-technician')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                >
                    + Add Technician
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Name, email, or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Technician Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        >
                            <option value="all">All Types</option>
                            <option value="inside">Inside (Workshop)</option>
                            <option value="outside">Outside (Field Service)</option>
                        </select>
                    </div>

                    {/* Refresh */}
                    <div className="flex items-end">
                        <button
                            onClick={loadTechnicians}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Technicians Table */}
            {loading ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">Loading technicians...</p>
                </div>
            ) : filteredTechnicians.length === 0 ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No technicians found</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Technician
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Employment
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Specialization
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredTechnicians.map((technician) => (
                                    <tr key={technician.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        {/* Technician Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {technician.profile_image && !brokenImages.has(technician.id) ? (
                                                    <img
                                                        src={getImageUrl(technician.profile_image)}
                                                        alt={technician.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        onError={() => {
                                                            setBrokenImages(prev => new Set([...prev, technician.id]));
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                            {technician.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {technician.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{technician.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getTechnicianTypeColor(
                                                    technician.technician_type
                                                )}`}
                                            >
                                                {getTechnicianTypeLabel(technician.technician_type)}
                                            </span>
                                        </td>

                                        {/* Employment Type */}
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {getEmploymentTypeLabel(technician.employment_type)}
                                        </td>

                                        {/* Specialization */}
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {technician.specialization || '-'}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    technician.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {technician.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    onClick={() => handleOpenView(technician.id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium transition"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEdit(technician.id)}
                                                    className="text-primary hover:text-primary/80 font-medium transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(technician.id, technician.name)}
                                                    className="text-red-500 hover:text-red-700 font-medium transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Modal */}
            <ViewTechnicianModal
                isOpen={viewModalOpen}
                technicianId={selectedTechnicianId}
                onClose={handleCloseView}
            />

            {/* Edit Modal */}
            <EditTechnicianModal
                isOpen={editModalOpen}
                technicianId={selectedTechnicianId}
                onClose={handleCloseEdit}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
};

export default TechnicianList;
