import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import insideJobService from '../../../services/insideJobService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { InsideJobTicket } from '../../../types/ticket.types';
import toast from 'react-hot-toast';

const InsideJobsList = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState<InsideJobTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const statusFilter = searchParams.get('status');

    useEffect(() => {
        dispatch(setPageTitle('Inside Jobs'));
    }, [dispatch]);

    useEffect(() => {
        fetchInsideJobs(currentPage);
    }, [currentPage, statusFilter]);

    const fetchInsideJobs = async (page: number) => {
        setLoading(true);
        const result = await insideJobService.getInsideJobs(page, 15);

        if (result.success && result.data) {
            let filteredJobs = result.data.data || [];

            // Filter by status if provided
            if (statusFilter) {
                filteredJobs = filteredJobs.filter((job: InsideJobTicket) => job.status === statusFilter);
            }

            setJobs(filteredJobs);
            setTotalPages(result.data.last_page || 1);
        } else {
            toast.error('Failed to fetch inside jobs');
        }
        setLoading(false);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
            pending_inspection: { color: 'bg-blue-100 text-blue-800', label: 'Pending Inspection' },
            inspected: { color: 'bg-yellow-100 text-yellow-800', label: 'Inspected' },
            quoted: { color: 'bg-purple-100 text-purple-800', label: 'Quoted' },
            approved_for_repair: { color: 'bg-green-100 text-green-800', label: 'Approved' },
            in_repair: { color: 'bg-orange-100 text-orange-800', label: 'In Repair' },
            quote_rejected: { color: 'bg-red-100 text-red-800', label: 'Quote Rejected' },
            completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
        };

        const status_info = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status_info.color}`}>
                {status_info.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Inside Jobs Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {statusFilter ? `Showing ${statusFilter.replace('_', ' ')} jobs` : 'All inside jobs'}
                </p>
            </div>

            {jobs.length === 0 ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No inside jobs found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job: InsideJobTicket) => (
                        <div key={job.id} className="bg-white dark:bg-black rounded-lg shadow-sm p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white-light">{job.job_number || job.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.title}</p>
                                </div>
                                {getStatusBadge(job.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">Customer</p>
                                    <p className="font-medium text-gray-800 dark:text-white-light">{job.customer_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400">UPS Details</p>
                                    <p className="font-medium text-gray-800 dark:text-white-light">
                                        {job.ups_brand || 'N/A'} {job.ups_model || ''}
                                    </p>
                                </div>
                                {job.quote_total && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Quote Amount</p>
                                        <p className="font-medium text-gray-800 dark:text-white-light">Rs. {job.quote_total?.toFixed(2)}</p>
                                    </div>
                                )}
                                {job.quoted_at && (
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Quoted On</p>
                                        <p className="font-medium text-gray-800 dark:text-white-light">
                                            {new Date(job.quoted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded ${
                                currentPage === page
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white-light'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InsideJobsList;
