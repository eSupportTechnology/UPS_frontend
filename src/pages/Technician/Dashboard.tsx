import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { TechnicianDashboardData } from '../../types/dashboard.types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { DashboardService } from '../../services/dashboardService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const TechnicianDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState<TechnicianDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Technician Dashboard'));
        fetchDashboardData();
    }, [dispatch]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await DashboardService.getTechnicianDashboard();
            setDashboardData(data);
            setError(null);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load dashboard data';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            toast.loading('Refreshing dashboard...', { id: 'refresh' });
            await fetchDashboardData();
            toast.success('Dashboard refreshed successfully!', { id: 'refresh' });
        } catch (error) {
            toast.error('Failed to refresh dashboard', { id: 'refresh' });
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <ErrorScreen error={error} onRetry={fetchDashboardData} />;
    }

    if (!dashboardData) {
        return null;
    }

    // Prepare Chart Data
    const myTicketsChartData = {
        labels: ['Pending', 'In Progress', 'Completed Today'],
        datasets: [
            {
                data: [dashboardData.my_tickets.pending, dashboardData.my_tickets.in_progress, dashboardData.my_tickets.completed_today],
                backgroundColor: ['rgba(255, 167, 38, 0.8)', 'rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)'],
                borderColor: ['rgba(255, 167, 38, 1)', 'rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const myMaintenancesChartData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                label: 'Maintenances',
                data: [dashboardData.my_maintenances.pending, dashboardData.my_maintenances.in_progress, dashboardData.my_maintenances.scheduled_today],
                backgroundColor: ['rgba(255, 167, 38, 0.8)', 'rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)'],
                borderColor: ['rgba(255, 167, 38, 1)', 'rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const weeklyActivityChartData = {
        labels: dashboardData.weekly_activity.tickets.map((item) => format(new Date(item.date), 'EEE')),
        datasets: [
            {
                label: 'Tickets Completed',
                data: dashboardData.weekly_activity.tickets.map((item) => item.count),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Maintenances Completed',
                data: dashboardData.weekly_activity.maintenances.map((item) => item.count),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const performanceChartData = {
        labels: ['Completion Rate', 'Remaining'],
        datasets: [
            {
                data: [dashboardData.performance.completion_rate, 100 - dashboardData.performance.completion_rate],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(229, 231, 235, 0.8)'],
                borderColor: ['rgba(16, 185, 129, 1)', 'rgba(229, 231, 235, 1)'],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track your assignments and manage your daily tasks.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Last updated: {format(new Date(), 'PPpp')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={handleRefresh} disabled={refreshing} className="btn btn-primary flex items-center gap-2">
                            <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Active Track Alert */}
            {dashboardData.my_tracking.active_track && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <LocationIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Active Tracking Session</h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                <p>
                                    You have an active tracking session for{' '}
                                    {dashboardData.my_tracking.active_track.type === 'ticket'
                                        ? `Ticket #${dashboardData.my_tracking.active_track.trackable?.title?.substring(0, 30)}`
                                        : 'Maintenance Task'}
                                </p>
                                <p className="mt-1">Started: {format(new Date(dashboardData.my_tracking.active_track.started_at), 'MMM dd, HH:mm')}</p>
                            </div>
                        </div>
                        <Link to="/technician/tracking" className="ml-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details →
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Overdue Tasks Alert */}
            {dashboardData.my_maintenances.overdue > 0 && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Overdue Tasks!</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                                <p>You have {dashboardData.my_maintenances.overdue} overdue maintenance tasks that require immediate attention.</p>
                            </div>
                        </div>
                        <Link to="/technician/maintenances?filter=overdue" className="ml-3 text-red-600 hover:text-red-800 text-sm font-medium">
                            View Tasks →
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="My Active Tasks"
                    value={dashboardData.my_tickets.pending + dashboardData.my_tickets.in_progress}
                    subtitle={`${dashboardData.my_tickets.pending} pending`}
                    icon={<TaskIcon />}
                    color="blue"
                    link="/technician/tickets"
                />
                <StatCard
                    title="Completed Today"
                    value={dashboardData.my_tickets.completed_today}
                    subtitle={`${dashboardData.my_tickets.completed_this_week} this week`}
                    icon={<CheckCircleIcon />}
                    color="green"
                />
                <StatCard
                    title="In Progress"
                    value={dashboardData.my_tickets.in_progress}
                    subtitle={`${dashboardData.my_maintenances.in_progress} maintenances`}
                    icon={<ClockIcon />}
                    color="yellow"
                />
                <StatCard
                    title="Scheduled Today"
                    value={dashboardData.my_maintenances.scheduled_today}
                    subtitle="Maintenances"
                    icon={<CalendarIcon />}
                    color="purple"
                />
            </div>

            {/* My Performance */}
            <SectionHeader title="My Performance" icon={<TrophyIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PerformanceCard
                    title="Completion Rate"
                    value={`${dashboardData.performance.completion_rate}%`}
                    icon={<TrophyIcon />}
                    color="green"
                />
                <PerformanceCard
                    title="Avg. Completion Time"
                    value={`${Math.round(dashboardData.performance.average_completion_time / 60)}h`}
                    subtitle="hours"
                    icon={<ClockIcon />}
                    color="blue"
                />
                <PerformanceCard
                    title="Total Tickets"
                    value={dashboardData.performance.total_completed_tickets}
                    subtitle="completed"
                    icon={<TicketIcon />}
                    color="purple"
                />
                <PerformanceCard
                    title="Total Maintenances"
                    value={dashboardData.performance.total_completed_maintenances}
                    subtitle="completed"
                    icon={<ToolIcon />}
                    color="indigo"
                />
            </div>

            {/* My Tracking */}
            <SectionHeader title="My Tracking" icon={<LocationIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title="Tracks Today" value={dashboardData.my_tracking.tracks_today} color="blue" />
                <MiniStatCard title="Distance Today" value={`${dashboardData.my_tracking.total_distance_today} km`} color="green" />
                <MiniStatCard title="This Week" value={dashboardData.my_tracking.tracks_this_week} color="purple" />
                <MiniStatCard
                    title="Active Status"
                    value={dashboardData.my_tracking.active_track ? 'Tracking' : 'Not Active'}
                    color={dashboardData.my_tracking.active_track ? 'green' : 'yellow'}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="My Tickets Overview" subtitle="Current status distribution">
                    <Doughnut
                        data={myTicketsChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                    },
                                },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="My Maintenances" subtitle="Maintenance status">
                    <Bar
                        data={myMaintenancesChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Weekly Activity" subtitle="Last 7 days performance">
                    <Line
                        data={weeklyActivityChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="My Completion Rate" subtitle="Overall performance">
                    <Doughnut
                        data={performanceChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                    },
                                },
                            },
                        }}
                    />
                </ChartCard>
            </div>

            {/* Today's Tasks and Upcoming Maintenances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Tickets */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TicketIcon />
                            Today's Tickets
                        </h3>
                        <Link to="/technician/tickets" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {dashboardData.today_tickets.length > 0 ? (
                            dashboardData.today_tickets.map((ticket: any, index: number) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ticket.title}</h4>
                                        <PriorityBadge priority={ticket.priority} />
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{ticket.description}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <LocationIcon className="w-4 h-4" />
                                            <span>
                                                {ticket.city}, {ticket.district}
                                            </span>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                    {ticket.customer_name && (
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>Customer: {ticket.customer_name}</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <TicketIcon className="mx-auto mb-2 opacity-50" />
                                <p>No tickets for today</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Today's Maintenances */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon />
                            Today's Maintenances
                        </h3>
                        <Link to="/technician/maintenances" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {dashboardData.today_maintenances.length > 0 ? (
                            dashboardData.today_maintenances.map((maintenance: any, index: number) => (
                                <motion.div
                                    key={maintenance.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Maintenance #{maintenance.id?.substring(0, 8)}</h4>
                                            {maintenance.note && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{maintenance.note}</p>}
                                        </div>
                                        <StatusBadge status={maintenance.status} />
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                        <p>
                                            <span className="font-medium">Customer:</span> {maintenance.amc_contract?.customer?.name || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Branch:</span> {maintenance.amc_contract?.branch?.name || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Scheduled:</span> {format(new Date(maintenance.scheduled_date), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <CalendarIcon className="mx-auto mb-2 opacity-50" />
                                <p>No maintenances scheduled for today</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Maintenances */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon />
                        Upcoming Maintenances (Next 7 Days)
                    </h3>
                    <Link to="/technician/maintenances" className="text-primary hover:text-primary-dark text-sm font-medium">
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.upcoming_maintenances.length > 0 ? (
                        dashboardData.upcoming_maintenances.slice(0, 6).map((maintenance: any, index: number) => (
                            <motion.div
                                key={maintenance.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">Maintenance #{maintenance.id?.substring(0, 8)}</p>
                                        {maintenance.note && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{maintenance.note}</p>}
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                                    <p className="flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3" />
                                        {format(new Date(maintenance.scheduled_date), 'MMM dd, yyyy')}
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <LocationIcon className="w-3 h-3" />
                                        {maintenance.amc_contract?.branch?.city || 'N/A'}
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <StatusBadge status={maintenance.status} />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="mx-auto mb-2 opacity-50" />
                            <p>No upcoming maintenances</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <LightningIcon />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionButton to="/technician/tickets" icon={<TicketIcon />} label="View My Tickets" color="blue" />
                    <QuickActionButton to="/technician/maintenances" icon={<CalendarIcon />} label="View Maintenances" color="green" />
                    <QuickActionButton to="/technician/tracking" icon={<LocationIcon />} label="Start Tracking" color="purple" />
                    <QuickActionButton to="/technician/history" icon={<ChartIcon />} label="Work History" color="indigo" />
                </div>
            </motion.div>
        </div>
    );
};

// Components

const LoadingScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading Dashboard...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please wait while we fetch your data</p>
            </div>
        </div>
    );
};

const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                        <ExclamationIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button onClick={onRetry} className="btn btn-primary w-full">
                        Try Again
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, link }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
        red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
    };

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-200"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-4 rounded-full ${colorClasses[color]}`}>{icon}</div>
            </div>
        </motion.div>
    );

    if (link) {
        return <Link to={link}>{content}</Link>;
    }

    return content;
};

interface PerformanceCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'indigo';
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ title, value, subtitle, icon, color }) => {
    const colorClasses = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
        green: 'bg-gradient-to-br from-green-500 to-green-600',
        purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
        indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`${colorClasses[color]} rounded-lg shadow-lg p-6 text-white transition-all duration-200`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
                </div>
                <div className="p-3 bg-white/20 rounded-full">{icon}</div>
            </div>
        </motion.div>
    );
};

interface MiniStatCardProps {
    title: string;
    value: string | number;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

const MiniStatCard: React.FC<MiniStatCardProps> = ({ title, value, color }) => {
    const colorClasses = {
        blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
        green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
        yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
        purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`${colorClasses[color]} border-l-4 rounded-lg p-4 transition-all duration-200`}
        >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </motion.div>
    );
};

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => {
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mt-8 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </motion.div>
    );
};

const ChartCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className="h-80">{children}</div>
        </motion.div>
    );
};

interface QuickActionButtonProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ to, icon, label, color }) => {
    return (
        <Link
            to={to}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
        >
            <div className={`p-4 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400 mb-3 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white text-center">{label}</span>
        </Link>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusColors: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const priorityColors: { [key: string]: string } = {
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
            {priority}
        </span>
    );
};

// Icon Components
const TaskIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TicketIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
    </svg>
);

const ToolIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
        />
    </svg>
);

const LightningIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ChartIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

export default TechnicianDashboard;
