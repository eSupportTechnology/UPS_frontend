import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import insideJobService from '../../../services/insideJobService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { InsideJobTicket } from '../../../types/ticket.types';
import toast from 'react-hot-toast';

const WorkshopDashboard = () => {
    const dispatch = useDispatch();
    const [jobs, setJobs] = useState<InsideJobTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('pending_inspection');

    useEffect(() => {
        dispatch(setPageTitle('Workshop Dashboard'));
    }, [dispatch]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        const result = await insideJobService.getInsideJobs(1, 100);

        if (result.success && result.data) {
            setJobs(result.data.data || []);
        } else {
            toast.error('Failed to fetch workshop jobs');
        }
        setLoading(false);
    };

    const getJobsByStatus = (status: string) => {
        return jobs.filter((job) => job.status === status);
    };

    const statusTabs = [
        { id: 'pending_inspection', label: 'Pending Inspection', count: getJobsByStatus('pending_inspection').length },
        { id: 'inspected', label: 'Inspected', count: getJobsByStatus('inspected').length },
        { id: 'quoted', label: 'Quoted', count: getJobsByStatus('quoted').length },
        { id: 'approved_for_repair', label: 'Approved', count: getJobsByStatus('approved_for_repair').length },
        { id: 'in_repair', label: 'In Repair', count: getJobsByStatus('in_repair').length },
        { id: 'completed', label: 'Completed', count: getJobsByStatus('completed').length },
    ];

    const currentJobs = getJobsByStatus(activeTab);

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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Workshop Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage UPS repair jobs in the workshop</p>
            </div>

            {/* Status Overview Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-6">
                {statusTabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`p-4 rounded-lg cursor-pointer transition ${
                            activeTab === tab.id
                                ? 'bg-primary text-white'
                                : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">
                            {tab.label}
                        </div>
                        <div className={`text-2xl font-bold ${activeTab === tab.id ? 'text-white' : 'text-primary'}`}>
                            {tab.count}
                        </div>
                    </div>
                ))}
            </div>

            {/* Jobs List */}
            {currentJobs.length === 0 ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No jobs in this status</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentJobs.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-black rounded-lg shadow-sm p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-800 dark:text-white-light">
                                            {job.job_number}
                                        </h3>
                                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                            {job.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{job.title}</p>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Customer</p>
                                            <p className="font-medium text-gray-800 dark:text-white-light">{job.customer_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">UPS</p>
                                            <p className="font-medium text-gray-800 dark:text-white-light">
                                                {job.ups_brand} {job.ups_model}
                                            </p>
                                        </div>
                                        {job.quote_total && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Quote</p>
                                                <p className="font-medium text-gray-800 dark:text-white-light">
                                                    Rs. {job.quote_total.toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">Created</p>
                                            <p className="font-medium text-gray-800 dark:text-white-light">
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <button className="px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary/80 transition">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkshopDashboard;
