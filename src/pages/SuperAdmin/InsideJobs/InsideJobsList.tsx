import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import insideJobService from '../../../services/insideJobService';
import api from '../../../config/api.config';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { InsideJobTicket } from '../../../types/ticket.types';
import { InsideJobStatus } from '../../../types/kanban.types';
import toast from 'react-hot-toast';
import { KanbanBoard, ViewToggle } from '../../../components/Kanban';

interface Technician {
    id: string;
    name: string;
}

const InsideJobsList = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState<InsideJobTicket[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState(true);
    const [techniciansLoading, setTechniciansLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const statusFilter = searchParams.get('status');

    useEffect(() => {
        dispatch(setPageTitle('Inside Jobs'));
    }, [dispatch]);

    useEffect(() => {
        console.log('InsideJobsList mounted, fetching technicians...');
        fetchTechnicians();
    }, []);

    useEffect(() => {
        fetchInsideJobs(currentPage);
    }, [currentPage, statusFilter]);

    useEffect(() => {
        console.log('Technicians state updated:', technicians);
    }, [technicians]);

    const fetchTechnicians = async () => {
        setTechniciansLoading(true);
        try {
            const response = await api.get('/inside-jobs/technicians');
            if (response.data.success && response.data.data) {
                const techList = Array.isArray(response.data.data) ? response.data.data : [];
                const formattedTechs = techList.map((tech: any) => ({
                    id: tech.id,
                    name: tech.name,
                }));
                setTechnicians(formattedTechs);
                console.log('Inside Job Technicians loaded:', formattedTechs);
            } else {
                setTechnicians([]);
                console.warn('No technicians data received from API');
            }
        } catch (error) {
            console.error('Failed to fetch inside job technicians:', error);
            setTechnicians([]);
        } finally {
            setTechniciansLoading(false);
            console.log('Technician fetch completed, technicians loading state set to false');
        }
    };

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

    const handleStatusChange = async (
        jobId: string,
        newStatus: InsideJobStatus,
        oldStatus: InsideJobStatus
    ) => {
        // Optimistic update - update UI immediately
        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === jobId ? { ...job, status: newStatus } : job
            )
        );

        try {
            const response = await insideJobService.updateJobStatus(jobId, oldStatus, newStatus);
            if (!response.success) {
                // Rollback on error
                setJobs((prevJobs) =>
                    prevJobs.map((job) =>
                        job.id === jobId ? { ...job, status: oldStatus } : job
                    )
                );
                throw new Error(response.message || 'Failed to update job status');
            }
        } catch (error) {
            // Rollback on error
            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === jobId ? { ...job, status: oldStatus } : job
                )
            );
            throw error;
        }
    };

    const handleAssignTechnician = async (jobId: string, technicianId: string, oldTechnicianId?: string | number) => {
        // Optimistic update
        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === jobId ? { ...job, assigned_to: technicianId as any } : job
            )
        );

        try {
            const response = await api.post('/assign-ticket', {
                ticket_id: jobId,
                assigned_to: technicianId,
            });
            if (!response.data.success) {
                // Rollback on error
                setJobs((prevJobs) =>
                    prevJobs.map((job) =>
                        job.id === jobId ? { ...job, assigned_to: oldTechnicianId as any } : job
                    )
                );
                toast.error(response.data.message || 'Failed to assign technician');
            } else {
                toast.success('Technician assigned successfully');
            }
        } catch (error: any) {
            // Rollback on error
            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === jobId ? { ...job, assigned_to: oldTechnicianId as any } : job
                )
            );
            toast.error(error.response?.data?.message || 'Failed to assign technician');
        }
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
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Inside Jobs Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {statusFilter ? `Showing ${statusFilter.replace('_', ' ')} jobs` : 'All inside jobs'}
                    </p>
                </div>
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' ? (
                <KanbanBoard
                    jobs={jobs}
                    loading={loading}
                    onStatusChange={handleStatusChange}
                    onRefresh={() => fetchInsideJobs(currentPage)}
                    technicians={technicians}
                    onAssignTechnician={handleAssignTechnician}
                />
            ) : (
                // List View with Data Table
                <>
                    {jobs.length === 0 ? (
                        <div className="bg-white dark:bg-black rounded-lg shadow-sm p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No inside jobs found</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Job #</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">UPS Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Technician</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.map((job: InsideJobTicket) => (
                                            <tr key={job.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white-light">{job.job_number || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-400">{job.title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-400">{job.customer_name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-400">
                                                    {job.ups_brand && job.ups_model ? `${job.ups_brand} ${job.ups_model}` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">{getStatusBadge(job.status)}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <select
                                                        value={job.assigned_to || ''}
                                                        onChange={(e) => {
                                                            const newTechnicianId = e.target.value;
                                                            if (!newTechnicianId) return;
                                                            handleAssignTechnician(job.id, newTechnicianId, job.assigned_to);
                                                        }}
                                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white-light text-xs w-full"
                                                    >
                                                        <option value="">-- Select Technician --</option>
                                                        {technicians.map((tech) => (
                                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <select
                                                        value=""
                                                        onChange={async (e) => {
                                                            if (!e.target.value) return;
                                                            try {
                                                                await handleStatusChange(job.id, e.target.value as InsideJobStatus, job.status as InsideJobStatus);
                                                                toast.success('Job status updated');
                                                            } catch (error: any) {
                                                                toast.error(error.message || 'Failed to update status');
                                                            }
                                                        }}
                                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white-light text-xs"
                                                    >
                                                        <option value="">-- Select Action --</option>
                                                        <option value="in_repair">Move to In Repair</option>
                                                        <option value="completed">Mark Completed</option>
                                                        <option value="quote_rejected">Reject Quote</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-400">
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                </>
            )}
        </div>
    );
};

export default InsideJobsList;
