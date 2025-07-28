import React from 'react';
import { PaginationProps } from '../../types/pagination.types';

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange, loading = false, showInfo = true, className = '' }) => {
    const { current_page, last_page, total, from, to, per_page } = meta;

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (last_page <= maxVisiblePages) {
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            if (current_page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(last_page);
            } else if (current_page >= last_page - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = last_page - 3; i <= last_page; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current_page - 1; i <= current_page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(last_page);
            }
        }

        return pages;
    };

    if (last_page <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {showInfo && (
                <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span> results
                </div>
            )}

            <div className="flex items-center space-x-1">
                <button
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page === 1 || loading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {generatePageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {typeof page === 'number' ? (
                            <button
                                onClick={() => onPageChange(page)}
                                disabled={loading}
                                className={`px-3 py-2 text-sm font-medium border transition-colors ${
                                    current_page === page ? 'bg-primary text-white border-primary' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300">{page}</span>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page === last_page || loading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
