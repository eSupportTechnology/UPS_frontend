// src/pages/Operator/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { OperatorDashboardData } from '../../types/dashboard.types';
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
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { DashboardService } from '../../services/dashboardService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const OperatorDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState<OperatorDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Operator Dashboard'));
        fetchDashboardData();
    }, [dispatch]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await DashboardService.getOperatorDashboard();
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
    const ticketStatusChartData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                data: [dashboardData.tickets.pending, dashboardData.tickets.in_progress, dashboardData.tickets.completed],
                backgroundColor: ['rgba(255, 167, 38, 0.8)', 'rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)'],
                borderColor: ['rgba(255, 167, 38, 1)', 'rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const maintenanceStatusChartData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [
            {
                data: [dashboardData.amc_maintenances.pending, dashboardData.amc_maintenances.in_progress, dashboardData.amc_maintenances.completed],
                backgroundColor: ['rgba(255, 167, 38, 0.8)', 'rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)'],
                borderColor: ['rgba(255, 167, 38, 1)', 'rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const technicianStatusChartData = {
        labels: ['On Duty', 'Available', 'Total'],
        datasets: [
            {
                label: 'Technicians',
                data: [dashboardData.technicians.on_duty, dashboardData.technicians.available, dashboardData.technicians.total],
                backgroundColor: ['rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)', 'rgba(153, 102, 255, 0.8)'],
                borderColor: ['rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const dailyStatsChartData = {
        labels: ['Tickets Created', 'Tickets Completed', 'Maintenances Scheduled', 'Maintenances Completed'],
        datasets: [
            {
                label: 'Today',
                data: [
                    dashboardData.daily_stats.tickets_created,
                    dashboardData.daily_stats.tickets_completed,
                    dashboardData.daily_stats.maintenances_scheduled,
                    dashboardData.daily_stats.maintenances_completed,
                ],
                backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(34, 197, 94, 0.8)'],
                borderColor: ['rgba(79, 70, 229, 1)', 'rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(34, 197, 94, 1)'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Operator Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Monitor operations and manage daily tasks efficiently.</p>
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

            {/* Priority Alerts */}
            {(dashboardData.alerts.unassigned_tickets > 0 || dashboardData.alerts.overdue_maintenances > 0 || dashboardData.alerts.high_priority_tickets > 0) && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Attention Required!</h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-400 space-y-1">
                                {dashboardData.alerts.unassigned_tickets > 0 && <p>• {dashboardData.alerts.unassigned_tickets} unassigned tickets need attention</p>}
                                {dashboardData.alerts.overdue_maintenances > 0 && <p>• {dashboardData.alerts.overdue_maintenances} overdue maintenances</p>}
                                {dashboardData.alerts.high_priority_tickets > 0 && <p>• {dashboardData.alerts.high_priority_tickets} high priority tickets</p>}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Tickets"
                    value={dashboardData.tickets.pending + dashboardData.tickets.in_progress}
                    subtitle={`${dashboardData.tickets.unassigned || 0} unassigned`}
                    icon={<TicketIcon />}
                    color="blue"
                    link="/operator/tickets"
                />
                <StatCard
                    title="Completed Today"
                    value={dashboardData.daily_stats.tickets_completed}
                    subtitle={`${dashboardData.daily_stats.maintenances_completed} maintenances`}
                    icon={<CheckCircleIcon />}
                    color="green"
                />
                <StatCard
                    title="Overdue Tasks"
                    value={dashboardData.amc_maintenances.overdue}
                    subtitle="Requires immediate action"
                    icon={<ClockIcon />}
                    color="red"
                />
                <StatCard
                    title="High Priority"
                    value={dashboardData.tickets.high_priority || 0}
                    subtitle="Urgent tickets"
                    icon={<LightningIcon />}
                    color="yellow"
                />
            </div>

            {/* Tickets Overview */}
            <SectionHeader title="Tickets Overview" icon={<TicketIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MiniStatCard title="Total" value={dashboardData.tickets.total} color="blue" link="/operator/tickets" />
                <MiniStatCard title="Pending" value={dashboardData.tickets.pending} color="yellow" />
                <MiniStatCard title="In Progress" value={dashboardData.tickets.in_progress} color="blue" />
                <MiniStatCard title="Completed" value={dashboardData.tickets.completed} color="green" />
                <MiniStatCard title="Today" value={dashboardData.tickets.today || 0} color="purple" />
            </div>

            {/* Maintenance Overview */}
            <SectionHeader title="Maintenance Overview" icon={<ToolIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Maintenances"
                    value={dashboardData.amc_maintenances.total}
                    icon={<ToolIcon />}
                    color="blue"
                    link="/operator/maintenances"
                />
                <StatCard title="Scheduled Today" value={dashboardData.amc_maintenances.scheduled_today} icon={<CalendarIcon />} color="purple" />
                <StatCard title="This Week" value={dashboardData.amc_maintenances.scheduled_this_week} icon={<CalendarIcon />} color="indigo" />
                <StatCard title="Unassigned" value={dashboardData.amc_maintenances.unassigned || 0} icon={<ExclamationIcon />} color="yellow" />
            </div>

            {/* Technicians & Resources */}
            <SectionHeader title="Technicians & Resources" icon={<UsersIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Technicians" value={dashboardData.technicians.total} icon={<UsersIcon />} color="blue" link="/operator/technicians" />
                <StatCard title="On Duty" value={dashboardData.technicians.on_duty} icon={<UserCheckIcon />} color="green" />
                <StatCard title="Available" value={dashboardData.technicians.available} icon={<UserIcon />} color="green" />
                <StatCard title="Active Customers" value={dashboardData.customers.active} icon={<UserGroupIcon />} color="purple" />
            </div>

            {/* Inventory Alerts */}
            <SectionHeader title="Inventory Status" icon={<BoxIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AlertCard
                    title="Low Stock Items"
                    value={dashboardData.inventory.low_stock}
                    icon={<ExclamationIcon />}
                    color="yellow"
                    link="/operator/inventory?filter=low_stock"
                />
                <AlertCard title="Out of Stock" value={dashboardData.inventory.out_of_stock} icon={<ExclamationIcon />} color="red" link="/operator/inventory?filter=out_of_stock" />
                <AlertCard title="Total Items" value={dashboardData.inventory.low_stock_items.length} icon={<BoxIcon />} color="blue" link="/operator/inventory" />
            </div>

            {/* Low Stock Items Details */}
            {dashboardData.inventory.low_stock_items.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ExclamationIcon className="text-yellow-600" />
                            Low Stock Items
                        </h3>
                        <Link to="/operator/inventory" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All Inventory →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardData.inventory.low_stock_items.slice(0, 6).map((item: any, index: number) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.product_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-yellow-600">{item.quantity}</p>
                                        <p className="text-xs text-gray-500">in stock</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Tickets Status Distribution" subtitle="Current ticket overview">
                    <Doughnut
                        data={ticketStatusChartData}
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

                <ChartCard title="Maintenance Status Distribution" subtitle="Current maintenance overview">
                    <Doughnut
                        data={maintenanceStatusChartData}
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

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Technician Availability" subtitle="Current technician status">
                    <Bar
                        data={technicianStatusChartData}
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

                <ChartCard title="Today's Performance" subtitle="Daily statistics">
                    <Bar
                        data={dailyStatsChartData}
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

            {/* Recent Tickets and Upcoming Maintenances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tickets */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TicketIcon />
                            Recent Tickets
                        </h3>
                        <Link to="/operator/tickets" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {dashboardData.recent_tickets.length > 0 ? (
                            dashboardData.recent_tickets.slice(0, 8).map((ticket: any, index: number) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {ticket.assigned_technician?.name || 'Unassigned'} •
                                            <span
                                                className={`ml-1 ${
                                                    ticket.priority === 'high' ? 'text-red-600' : ticket.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                                }`}
                                            >
                                                {ticket.priority}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{format(new Date(ticket.created_at), 'MMM dd, HH:mm')}</p>
                                    </div>
                                    <StatusBadge status={ticket.status} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <TicketIcon className="mx-auto mb-2 opacity-50" />
                                <p>No recent tickets</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Upcoming Maintenances */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon />
                            Upcoming Maintenances
                        </h3>
                        <Link to="/operator/maintenances" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {dashboardData.upcoming_maintenances.length > 0 ? (
                            dashboardData.upcoming_maintenances.slice(0, 8).map((maintenance: any, index: number) => (
                                <motion.div
                                    key={maintenance.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                Maintenance #{maintenance.id?.substring(0, 8)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {maintenance.assigned_technician?.name || 'Unassigned'}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                Scheduled: {format(new Date(maintenance.scheduled_date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <StatusBadge status={maintenance.status} />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <CalendarIcon className="mx-auto mb-2 opacity-50" />
                                <p>No upcoming maintenances</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
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
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo' | 'pink';
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, link }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
        red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
        indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
        pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300',
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

interface AlertCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: 'yellow' | 'red' | 'blue';
    link?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, value, icon, color, link }) => {
    const colorClasses = {
        yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800',
        red: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800',
        blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800',
    };

    const iconColorClasses = {
        yellow: 'text-yellow-600 dark:text-yellow-400',
        red: 'text-red-600 dark:text-red-400',
        blue: 'text-blue-600 dark:text-blue-400',
    };

    const content = (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`${colorClasses[color]} border-2 rounded-lg p-6 transition-all duration-200`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`${iconColorClasses[color]}`}>{icon}</div>
            </div>
        </motion.div>
    );

    if (link) {
        return <Link to={link}>{content}</Link>;
    }

    return content;
};

interface MiniStatCardProps {
    title: string;
    value: number;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
    link?: string;
}

const MiniStatCard: React.FC<MiniStatCardProps> = ({ title, value, color, link }) => {
    const colorClasses = {
        blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
        green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
        yellow: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
        purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
        red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    };

    const content = (
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

    if (link) {
        return <Link to={link}>{content}</Link>;
    }

    return content;
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

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusColors: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

// Icon Components
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

const LightningIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
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

const CalendarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const BoxIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const UserCheckIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserGroupIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
    </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export default OperatorDashboard;
