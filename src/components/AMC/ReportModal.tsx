import React, { useState } from 'react';
import { AMCContractService } from '../../services/amcContractService';

interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    onShowAlert: (type: 'success' | 'error', message: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ open, onClose, onShowAlert }) => {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        branch_id: '',
        customer_id: '',
        is_active: '',
        contract_type: '',
    });
    const [exporting, setExporting] = useState(false);

    if (!open) return null;

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        setExporting(true);
        try {
            let blob: Blob;
            if (format === 'excel') {
                blob = await AMCContractService.exportExcel(filters);
            } else {
                blob = await AMCContractService.exportPdf(filters);
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `amc_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            onShowAlert('success', `${format.toUpperCase()} report downloaded successfully`);
            onClose();
        } catch (error: any) {
            onShowAlert('error', error.message || `Failed to export ${format.toUpperCase()}`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                    Generate AMC Contract Report
                                </h3>
                                <div className="mt-4 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={filters.start_date}
                                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={filters.end_date}
                                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                                        <input
                                            type="text"
                                            value={filters.contract_type}
                                            onChange={(e) => handleFilterChange('contract_type', e.target.value)}
                                            placeholder="Enter contract type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={filters.is_active}
                                            onChange={(e) => handleFilterChange('is_active', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">All Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button
                            type="button"
                            onClick={() => handleExport('excel')}
                            disabled={exporting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? 'Exporting...' : 'Export Excel'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleExport('pdf')}
                            disabled={exporting}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {exporting ? 'Exporting...' : 'Export PDF'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={exporting}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
