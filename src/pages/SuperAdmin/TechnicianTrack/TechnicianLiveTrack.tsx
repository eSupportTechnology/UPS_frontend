import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useAlert } from '../../../components/Alert/Alert';
import technicianTrackService from '../../../services/technicianTrackService';
import type { TechnicianLocation, TechnicianTrackFilters } from '../../../types/technicianTrack.types';
import IconMapPin from '../../../components/Icon/IconMapPin';
import IconUser from '../../../components/Icon/IconUser';
import IconSearch from '../../../components/Icon/IconSearch';
import IconRefresh from '../../../components/Icon/IconRefresh';
import GoogleMap from '../../../components/Maps/GoogleMap';

const TechnicianLiveTrack: React.FC = () => {
    const dispatch = useDispatch();
    const { showAlert, AlertContainer } = useAlert();

    const [technicians, setTechnicians] = useState<TechnicianLocation[]>([]);
    const [allTechnicians, setAllTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [onlineCount, setOnlineCount] = useState(0);
    const [activeCount, setActiveCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState<TechnicianTrackFilters>({
        status: 'all',
        search: '',
    });

    const [selectedTechnician, setSelectedTechnician] = useState<TechnicianLocation | null>(null);

    const fetchAllTechnicians = useCallback(async () => {
        try {
            const response = await technicianTrackService.getAllTechnicians();
            if (response.success) {
                setAllTechnicians(response.data || []);
            } else {
                // If API fails, try to show technicians from filtered data
                setAllTechnicians([]);
            }
        } catch (error) {
            // Silently handle error - dropdown will show only filtered technicians if API fails
            setAllTechnicians([]);
        }
    }, []);

    useEffect(() => {
        dispatch(setPageTitle('Technician Live Tracking'));
        fetchAllTechnicians();
    }, [dispatch, fetchAllTechnicians]);

    const fetchTechnicianLocations = useCallback(async () => {
        setLoading(true);
        try {
            const response = await technicianTrackService.getLiveTechnicianLocations(filters);

            if (response.success) {
                setTechnicians(response.data.technicians);
                setTotalCount(response.data.total_count);
                setOnlineCount(response.data.online_count);
                setActiveCount(response.data.active_count);
                setLastUpdated(response.data.last_updated);
            } else {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: response.message || 'Failed to fetch technician locations',
                });
            }
        } catch (error: any) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred while fetching technician locations',
            });
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchTechnicianLocations();
    }, []);

    // Trigger refetch when filters change
    useEffect(() => {
        fetchTechnicianLocations();
    }, [filters.status, filters.search]);

    const handleStatusFilter = useCallback((status: string) => {
        setFilters(prev => ({ ...prev, status: status as any }));
    }, []);

    const handleSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    const handleRefresh = useCallback(() => {
        fetchTechnicianLocations();
    }, []);

    const handleTechnicianSelect = useCallback((technician: TechnicianLocation) => {
        setSelectedTechnician(technician);
    }, []);

    const handleTechnicianClick = useCallback((technician: TechnicianLocation) => {
        setSelectedTechnician(technician);
    }, []);

    const getStatusColor = (status: string, isOnline: boolean) => {
        if (!isOnline) return 'bg-gray-500';
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string, isOnline: boolean) => {
        if (!isOnline) return 'Offline';
        switch (status) {
            case 'active': return 'Active';
            case 'idle': return 'Idle';
            default: return 'Unknown';
        }
    };

    const formatLastUpdated = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    const filteredTechnicians = useMemo(() => {
        return technicians.filter(tech => {
            if (filters.status !== 'all') {
                if (filters.status === 'online' && !tech.is_online) return false;
                if (filters.status === 'offline' && tech.is_online) return false;
                if (filters.status === 'active' && tech.status !== 'active') return false;
                if (filters.status === 'idle' && tech.status !== 'idle') return false;
            }

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return tech.technician_name.toLowerCase().includes(searchLower) ||
                       tech.email.toLowerCase().includes(searchLower) ||
                       (tech.current_ticket_title && tech.current_ticket_title.toLowerCase().includes(searchLower));
            }

            return true;
        });
    }, [technicians, filters.status, filters.search]);

    return (
        <div>
            <AlertContainer />

            {/* Breadcrumb */}
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Technician Live Tracking</span>
                    </li>
                </ul>
            </div>

            {/* Page Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technician Live Tracking</h1>
                    <p className="text-gray-600 dark:text-gray-400">Monitor real-time locations and status of field technicians</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        <IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>



            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search technicians..."
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <select
                            value={selectedTechnician?.id || ''}
                            onChange={(e) => {
                                const technicianId = parseInt(e.target.value);
                                const technician = filteredTechnicians.find(t => t.id === technicianId);
                                setSelectedTechnician(technician || null);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Select technician to focus</option>
                            {allTechnicians.length > 0 ? (
                                allTechnicians.map((technician) => {
                                    const liveData = filteredTechnicians.find(t => t.technician_id === technician.id);
                                    return (
                                        <option key={technician.id} value={liveData?.id || technician.id}>
                                            {technician.name} - {liveData ? (liveData.is_online ? (liveData.status === 'active' ? 'Active' : 'Idle') : 'Offline') : 'No location data'}
                                        </option>
                                    );
                                })
                            ) : (
                                filteredTechnicians.map((technician) => (
                                    <option key={technician.id} value={technician.id}>
                                        {technician.technician_name} - {technician.is_online ? (technician.status === 'active' ? 'Active' : 'Idle') : 'Offline'}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="flex space-x-2 flex-wrap">
                        {['all', 'online', 'offline', 'active'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filters.status === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Technician Map View */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Technician Live Map ({filteredTechnicians.length} technicians)
                    </h3>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading technician locations...</span>
                    </div>
                ) : filteredTechnicians.length === 0 ? (
                    <div className="text-center py-12">
                        <IconMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No technicians found matching your criteria</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <GoogleMap
                            technicians={filteredTechnicians}
                            selectedTechnician={selectedTechnician}
                            onTechnicianClick={handleTechnicianClick}
                            height="600px"
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianLiveTrack;
