import api from '../config/api.config';

interface MaterialsFilters {
    search?: string;
    category?: string;
    brand?: string;
    jobId?: string;
    status?: string[];
    fromDate?: string;
    toDate?: string;
    today?: boolean;
}

class MaterialsService {
    getExportUrl(type: 'pdf' | 'excel', filters?: MaterialsFilters): string {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const endpoint = type === 'pdf' ? '/materials/export/pdf' : '/materials/export/excel';

        const params = new URLSearchParams();

        if (filters) {
            if (filters.search) params.append('search', filters.search);
            if (filters.category) params.append('category', filters.category);
            if (filters.brand) params.append('brand', filters.brand);
            if (filters.jobId) params.append('job_id', filters.jobId);
            if (filters.status && filters.status.length > 0) params.append('status', filters.status.join(','));
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.today) params.append('today', 'true');
        }

        const queryString = params.toString();
        return `${baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
    }

    async exportPdf(filters?: MaterialsFilters): Promise<void> {
        const url = this.getExportUrl('pdf', filters);
        window.open(url, '_blank');
    }

    async exportExcel(filters?: MaterialsFilters): Promise<void> {
        const url = this.getExportUrl('excel', filters);
        window.open(url, '_blank');
    }

    async getCategoriesAndBrands(): Promise<{ categories: string[]; brands: string[] }> {
        try {
            const response = await api.get('/shop-inventories/categories-brands');
            if (response.data?.success) {
                return {
                    categories: response.data.data.categories || [],
                    brands: response.data.data.brands || [],
                };
            }
            return { categories: [], brands: [] };
        } catch (error) {
            console.error('Failed to fetch categories and brands:', error);
            return { categories: [], brands: [] };
        }
    }
}

export default new MaterialsService();
