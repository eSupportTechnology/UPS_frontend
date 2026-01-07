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
import IconSettings from '../../../components/Icon/IconSettings';
import IconCircleCheck from '../../../components/Icon/IconCircleCheck';
import IconXCircle from '../../../components/Icon/IconXCircle';
import IconArchive from '../../../components/Icon/IconArchive';
import IconEye from '../../../components/Icon/IconEye';
import IconX from '../../../components/Icon/IconX';
import InventoryUsageModal from '../../../components/InsideJobs/InventoryUsageModal';
import MaterialsManagementCard from '../../../components/InsideJobs/MaterialsManagementCard';
import { InventoryService } from '../../../services/inventoryService';
import { InventoryUsageItem } from '../../../types/inventory.types';

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
    const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
    const [jobForInventory, setJobForInventory] = useState<InsideJobTicket | null>(null);
    const [materialsCardOpen, setMaterialsCardOpen] = useState(false);
    const [jobForMaterials, setJobForMaterials] = useState<InsideJobTicket | null>(null);
    const [viewMaterialsOpen, setViewMaterialsOpen] = useState(false);
    const [jobForView, setJobForView] = useState<InsideJobTicket | null>(null);

    const statusFilter = searchParams.get('status');

    useEffect(() => {
        dispatch(setPageTitle('Inside Jobs'));
    }, [dispatch]);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    useEffect(() => {
        fetchInsideJobs(currentPage);
    }, [currentPage, statusFilter]);

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
            } else {
                setTechnicians([]);
            }
        } catch (error) {
            setTechnicians([]);
        } finally {
            setTechniciansLoading(false);
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

    const handleCompleteClick = (job: InsideJobTicket) => {
        setJobForInventory(job);
        setInventoryModalOpen(true);
    };

    const handleMaterialsClick = (job: InsideJobTicket) => {
        setJobForMaterials(job);
        setMaterialsCardOpen(true);
    };

    const handleMaterialsSave = (materials: any[]) => {
        // Refresh the jobs list after saving materials
        fetchInsideJobs(currentPage);
        setMaterialsCardOpen(false);
        setJobForMaterials(null);
    };

    const handleViewMaterials = (job: InsideJobTicket) => {
        setJobForView(job);
        setViewMaterialsOpen(true);
    };

    const handleInventorySubmit = async (usages: InventoryUsageItem[], notes: string) => {
        if (!jobForInventory) return;

        try {
            // Record inventory usage if materials were selected
            if (usages.length > 0) {
                await InventoryService.createInventoryUsage({
                    reference_id: jobForInventory.id,
                    usage_type: 'maintenance',
                    usages: usages,
                    usage_date: new Date().toISOString().split('T')[0],
                    notes: notes,
                });
            }

            // Complete the job
            await handleStatusChange(jobForInventory.id, 'completed' as InsideJobStatus, jobForInventory.status as InsideJobStatus);
            toast.success('Job completed with materials recorded');
            setInventoryModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to complete job');
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
                    onManageMaterials={handleMaterialsClick}
                    onViewMaterials={handleViewMaterials}
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Materials Used</th>
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
                                                    <div className="text-gray-700 dark:text-gray-400">
                                                        {(job as any).planned_materials && Array.isArray((job as any).planned_materials) && (job as any).planned_materials.length > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="space-y-1 flex-1">
                                                                    {(job as any).planned_materials.slice(0, 2).map((part: any, idx: number) => (
                                                                        <div key={idx} className="text-xs">
                                                                            {part.product_name || part.name} {part.quantity && `(${part.quantity})`}
                                                                        </div>
                                                                    ))}
                                                                    {(job as any).planned_materials.length > 2 && (
                                                                        <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                                                                            +{(job as any).planned_materials.length - 2} more
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleViewMaterials(job)}
                                                                    className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                                    title="View Materials"
                                                                >
                                                                    <IconEye className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 dark:text-gray-500 text-xs">No materials</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await handleStatusChange(job.id, 'in_repair' as InsideJobStatus, job.status as InsideJobStatus);
                                                                    toast.success('Moved to In Repair');
                                                                } catch (error: any) {
                                                                    toast.error(error.message || 'Failed to update status');
                                                                }
                                                            }}
                                                            className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                            title="Move to In Repair"
                                                        >
                                                            <IconSettings className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleMaterialsClick(job)}
                                                            className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                            title="Manage Materials"
                                                        >
                                                            <IconArchive className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await handleStatusChange(job.id, 'completed' as InsideJobStatus, job.status as InsideJobStatus);
                                                                    toast.success('Job Completed');
                                                                } catch (error: any) {
                                                                    toast.error(error.message || 'Failed to complete job');
                                                                }
                                                            }}
                                                            className="p-2 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition"
                                                            title="Mark Completed"
                                                        >
                                                            <IconCircleCheck className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await handleStatusChange(job.id, 'quote_rejected' as InsideJobStatus, job.status as InsideJobStatus);
                                                                    toast.success('Quote Rejected');
                                                                } catch (error: any) {
                                                                    toast.error(error.message || 'Failed to update status');
                                                                }
                                                            }}
                                                            className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                                            title="Reject Quote"
                                                        >
                                                            <IconXCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
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

            {/* Inventory Usage Modal */}
            {jobForInventory && (
                <InventoryUsageModal
                    open={inventoryModalOpen}
                    onClose={() => {
                        setInventoryModalOpen(false);
                        setJobForInventory(null);
                    }}
                    onSubmit={handleInventorySubmit}
                    jobId={jobForInventory.job_number || jobForInventory.id}
                />
            )}

            {/* Materials Management Card */}
            {materialsCardOpen && jobForMaterials && (
                <MaterialsManagementCard
                    jobId={jobForMaterials.id}
                    jobNumber={jobForMaterials.job_number || jobForMaterials.id}
                    onClose={() => {
                        setMaterialsCardOpen(false);
                        setJobForMaterials(null);
                    }}
                    onSave={handleMaterialsSave}
                />
            )}

            {/* View Materials Modal */}
            {viewMaterialsOpen && jobForView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold">Planned Materials</h2>
                                <p className="text-blue-100 text-sm">Job: {jobForView.job_number || jobForView.id}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setViewMaterialsOpen(false);
                                    setJobForView(null);
                                }}
                                className="p-2 hover:bg-blue-800 rounded-full transition"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {(jobForView as any).planned_materials && (jobForView as any).planned_materials.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            Total Items: {(jobForView as any).planned_materials.length}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            Total Quantity: {(jobForView as any).planned_materials.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)}
                                        </span>
                                    </div>
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">#</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Product Name</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Brand</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Category</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(jobForView as any).planned_materials.map((material: any, idx: number) => (
                                                <tr key={material.id || idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{idx + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{material.product_name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{material.brand || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{material.category || '-'}</td>
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full font-semibold">
                                                            {material.quantity}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No materials planned for this job
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setViewMaterialsOpen(false);
                                    setJobForView(null);
                                }}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsideJobsList;
