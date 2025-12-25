import api from '../config/api.config';

interface CreateTechnicianData {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    technician_type: 'inside' | 'outside';
    employment_type?: 'part_time' | 'full_time';
    profile_image?: File;
    specialization?: string;
}

interface TechnicianResponse {
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
}

interface UpdateTechnicianData extends Partial<CreateTechnicianData> {
    password?: string;
}

class TechnicianService {
    async getTechnician(id: string) {
        try {
            const response = await api.get(`/technician/${id}`);
            return {
                success: true,
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Get technician error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch technician',
                errors: error.response?.data?.errors,
            };
        }
    }

    async createTechnician(data: CreateTechnicianData) {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.address) formData.append('address', data.address);
            formData.append('technician_type', data.technician_type);
            if (data.employment_type) formData.append('employment_type', data.employment_type);
            if (data.profile_image) formData.append('profile_image', data.profile_image);
            if (data.specialization) formData.append('specialization', data.specialization);

            const response = await api.post('/create-technician', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                message: response.data.message || 'Technician created successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Create technician error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create technician',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getAllTechnicians(page: number = 1, perPage: number = 15) {
        try {
            const response = await api.get('/all-technician-users', {
                params: { page, per_page: perPage },
            });

            // Extract users from response - API returns { success, data: { users: [...] } }
            const users = response.data.data?.users || response.data.users || response.data.data || [];

            return {
                success: true,
                data: users,
            };
        } catch (error: any) {
            console.error('Get technicians error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch technicians',
                errors: error.response?.data?.errors,
            };
        }
    }

    async getTechniciansByType(type: 'inside' | 'outside') {
        try {
            const response = await api.get('/all-technician-users', {
                params: { technician_type: type },
            });

            // Extract users from response - API returns { success, data: { users: [...] } }
            const users = response.data.data?.users || response.data.users || response.data.data || [];

            return {
                success: true,
                data: users,
            };
        } catch (error: any) {
            console.error('Get technicians by type error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch technicians',
                errors: error.response?.data?.errors,
            };
        }
    }

    async updateTechnician(id: string, data: UpdateTechnicianData) {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.email) formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.address) formData.append('address', data.address);
            if (data.technician_type) formData.append('technician_type', data.technician_type);
            if (data.employment_type) formData.append('employment_type', data.employment_type);
            if (data.profile_image) formData.append('profile_image', data.profile_image);
            if (data.specialization) formData.append('specialization', data.specialization);
            if (data.password) formData.append('password', data.password);

            const response = await api.put(`/technician/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                message: response.data.message || 'Technician updated successfully',
                data: response.data.data,
            };
        } catch (error: any) {
            console.error('Update technician error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update technician',
                errors: error.response?.data?.errors,
            };
        }
    }

    async deleteTechnician(id: string) {
        try {
            const response = await api.delete(`/technician/${id}`);

            return {
                success: true,
                message: response.data.message || 'Technician deleted successfully',
            };
        } catch (error: any) {
            console.error('Delete technician error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete technician',
                errors: error.response?.data?.errors,
            };
        }
    }
}

export default new TechnicianService();
