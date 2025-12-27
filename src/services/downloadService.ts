import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const downloadService = {
    /**
     * Download bulk tickets PDF report
     */
    downloadBulkPdf: async (): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/bulk-pdf`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, 'tickets-bulk-export.pdf');
        } catch (error) {
            console.error('Error downloading bulk PDF:', error);
            throw new Error('Failed to download PDF');
        }
    },

    /**
     * Download bulk tickets CSV report
     */
    downloadBulkCsv: async (): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/bulk-csv`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, 'tickets-bulk-export.csv');
        } catch (error) {
            console.error('Error downloading bulk CSV:', error);
            throw new Error('Failed to download CSV');
        }
    },

    /**
     * Download date range filtered CSV report
     */
    downloadDateRangeCsv: async (fromDate: string, toDate: string): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/date-range-csv`, {
                params: {
                    from_date: fromDate,
                    to_date: toDate
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, `tickets-range-${fromDate}-to-${toDate}.csv`);
        } catch (error) {
            console.error('Error downloading date range CSV:', error);
            throw new Error('Failed to download date range report');
        }
    },

    /**
     * Download type-wise filtered CSV report
     */
    downloadTypeWiseCsv: async (type: 'personal' | 'company'): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/type-wise-csv`, {
                params: {
                    type
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, `tickets-${type}.csv`);
        } catch (error) {
            console.error('Error downloading type-wise CSV:', error);
            throw new Error('Failed to download type-wise report');
        }
    },

    /**
     * Download status-wise filtered CSV report
     */
    downloadStatusWiseCsv: async (status: string): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/status-wise-csv`, {
                params: {
                    status
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, `tickets-${status}.csv`);
        } catch (error) {
            console.error('Error downloading status-wise CSV:', error);
            throw new Error('Failed to download status-wise report');
        }
    },

    /**
     * Download priority-wise filtered CSV report
     */
    downloadPriorityWiseCsv: async (priority: string): Promise<void> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tickets/export/priority-wise-csv`, {
                params: {
                    priority
                },
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            triggerDownload(response.data, `tickets-${priority}.csv`);
        } catch (error) {
            console.error('Error downloading priority-wise CSV:', error);
            throw new Error('Failed to download priority-wise report');
        }
    }
};

/**
 * Helper function to trigger file download
 */
function triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
