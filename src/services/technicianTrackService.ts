import api from '../config/api.config';
import type { TechnicianTrackResponse, TechnicianTrackFilters } from '../types/technicianTrack.types';

class TechnicianTrackService {
    async getLiveTechnicianLocations(filters: TechnicianTrackFilters = {}): Promise<TechnicianTrackResponse> {
        try {
            const params = new URLSearchParams();

            if (filters.status && filters.status !== 'all') {
                params.append('status', filters.status);
            }
            if (filters.search) {
                params.append('search', filters.search);
            }

            const queryString = params.toString();
            const url = queryString ? `/technician-locations?${queryString}` : '/technician-locations';

            const response = await api.get(url, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Connection': 'keep-alive'
                }
            });

            // Handle different response structures
            if (response.data) {
                if (response.data.technicians) {
                    return {
                        success: true,
                        message: 'Technician locations retrieved successfully',
                        data: {
                            technicians: response.data.technicians || [],
                            total_count: response.data.total_count || 0,
                            online_count: response.data.online_count || 0,
                            active_count: response.data.active_count || 0,
                            last_updated: response.data.last_updated || new Date().toISOString(),
                        }
                    };
                } else if (Array.isArray(response.data)) {
                    // Direct array response
                    const technicians = response.data;
                    return {
                        success: true,
                        message: 'Technician locations retrieved successfully',
                        data: {
                            technicians,
                            total_count: technicians.length,
                            online_count: technicians.filter(t => t.is_online).length,
                            active_count: technicians.filter(t => t.status === 'active').length,
                            last_updated: new Date().toISOString(),
                        }
                    };
                }
            }

            return {
                success: false,
                message: 'Invalid response format',
                data: {
                    technicians: [],
                    total_count: 0,
                    online_count: 0,
                    active_count: 0,
                    last_updated: new Date().toISOString(),
                }
            };

        } catch (error: any) {
            // Handle HTTP/2 protocol errors specifically
            if (error.message?.includes('ERR_HTTP2_PROTOCOL_ERROR') ||
                error.code === 'ERR_HTTP2_PROTOCOL_ERROR') {
                return {
                    success: false,
                    message: 'Server connection error. The technician tracking service may be temporarily unavailable.',
                    data: {
                        technicians: [],
                        total_count: 0,
                        online_count: 0,
                        active_count: 0,
                        last_updated: new Date().toISOString(),
                    }
                };
            }

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve technician locations',
                    errors: error.response.data.errors || error.response.data,
                    data: {
                        technicians: [],
                        total_count: 0,
                        online_count: 0,
                        active_count: 0,
                        last_updated: new Date().toISOString(),
                    }
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: error.code === 'ECONNABORTED' ? 'Request timed out. Please check if the server is running and try again.' : 'Network error. Please check your connection and try again.',
                    data: {
                        technicians: [],
                        total_count: 0,
                        online_count: 0,
                        active_count: 0,
                        last_updated: new Date().toISOString(),
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'An unexpected error occurred. Please try again.',
                    data: {
                        technicians: [],
                        total_count: 0,
                        online_count: 0,
                        active_count: 0,
                        last_updated: new Date().toISOString(),
                    }
                };
            }
        }
    }

    async getTechnicianById(technicianId: number): Promise<any> {
        try {
            const response = await api.get(`/technician-locations/${technicianId}`);
            return {
                success: true,
                message: 'Technician location retrieved successfully',
                data: response.data,
            };
        } catch (error: any) {

            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve technician location',
                    errors: error.response.data.errors || error.response.data,
                };
            }

            return {
                success: false,
                message: 'An unexpected error occurred. Please try again.',
            };
        }
    }

    async getAllTechnicians(): Promise<any> {
        try {
            const response = await api.get('/all-technician-users');

            if (response.data && response.data.users) {
                return {
                    success: true,
                    message: 'Technicians retrieved successfully',
                    data: response.data.users,
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid response format',
                    data: [],
                };
            }
        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to retrieve technicians',
                    errors: error.response.data.errors || error.response.data,
                    data: [],
                };
            }

            return {
                success: false,
                message: 'An unexpected error occurred. Please try again.',
                data: [],
            };
        }
    }
}

const technicianTrackService = new TechnicianTrackService();
export default technicianTrackService;