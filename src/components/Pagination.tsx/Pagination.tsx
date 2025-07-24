import React from 'react';


interface PaginationProps {
    users: any[];
    page: number;
    setPage: (page: number) => void;
    usersPerPage?: number;
    className?: string;
    renderUsers: (users: any[]) => React.ReactNode;
}


const Pagination: React.FC<PaginationProps> = ({ users = [], page, setPage, usersPerPage = 50, className = '', renderUsers }) => {
    const safeUsers = Array.isArray(users) ? users : [];
    const totalPages = Math.ceil(safeUsers.length / usersPerPage);
    const paginatedUsers = safeUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

    return (
        <>
            {renderUsers(paginatedUsers)}
            {totalPages > 1 && (
                <div className={`flex justify-end items-center mt-6 gap-2 ${className}`}>
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => setPage(idx + 1)}
                                className={`px-3 py-1 border rounded transition-colors duration-150 ${page === idx + 1 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default Pagination;
