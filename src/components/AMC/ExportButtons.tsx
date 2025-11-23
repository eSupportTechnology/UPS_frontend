import React, { useState } from 'react';

interface ExportButtonsProps {
    onExportExcel: () => Promise<void>;
    onExportPdf: () => Promise<void>;
    disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ onExportExcel, onExportPdf, disabled = false }) => {
    const [exportingExcel, setExportingExcel] = useState(false);
    const [exportingPdf, setExportingPdf] = useState(false);

    const handleExportExcel = async () => {
        setExportingExcel(true);
        try {
            await onExportExcel();
        } finally {
            setExportingExcel(false);
        }
    };

    const handleExportPdf = async () => {
        setExportingPdf(true);
        try {
            await onExportPdf();
        } finally {
            setExportingPdf(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={handleExportExcel}
                disabled={disabled || exportingExcel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {exportingExcel ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                    </>
                ) : (
                    <>
                        <svg className="-ml-1 mr-2 h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Excel
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={handleExportPdf}
                disabled={disabled || exportingPdf}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {exportingPdf ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                    </>
                ) : (
                    <>
                        <svg className="-ml-1 mr-2 h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export PDF
                    </>
                )}
            </button>
        </div>
    );
};

export default ExportButtons;
