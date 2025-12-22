import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { AdminDashboardData } from '../../types/dashboard.types';
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

const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Admin Dashboard'));
        fetchDashboardData();
    }, [dispatch]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await DashboardService.getAdminDashboard();
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
    const userRolesChartData = {
        labels: ['Operators', 'Technicians', 'Customers'],
        datasets: [
            {
                label: 'Users by Role',
                data: [dashboardData.users.operators || 0, dashboardData.users.technicians || 0, dashboardData.users.customers || 0],
                backgroundColor: ['rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const ticketStatusChartData = {
        labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        datasets: [
            {
                label: 'Tickets',
                data: [
                    dashboardData.tickets.pending,
                    dashboardData.tickets.in_progress,
                    dashboardData.tickets.completed,
                    dashboardData.tickets.cancelled,
                ],
                backgroundColor: ['rgba(255, 167, 38, 0.8)', 'rgba(66, 165, 245, 0.8)', 'rgba(102, 187, 106, 0.8)', 'rgba(239, 83, 80, 0.8)'],
                borderColor: ['rgba(255, 167, 38, 1)', 'rgba(66, 165, 245, 1)', 'rgba(102, 187, 106, 1)', 'rgba(239, 83, 80, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const weeklyTrendsChartData = {
        labels: dashboardData.weekly_trends.tickets.map((item) => format(new Date(item.date), 'MMM dd')),
        datasets: [
            {
                label: 'Tickets Created',
                data: dashboardData.weekly_trends.tickets.map((item) => item.count),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Maintenances Completed',
                data: dashboardData.weekly_trends.maintenances_completed?.map((item) => item.count) || [],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage users and oversee system operations.</p>
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

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={dashboardData.users.operators! + dashboardData.users.technicians! + dashboardData.users.customers!}
                    change="+8%"
                    trend="up"
                    icon={<UsersIcon />}
                    color="blue"
                    link="/admin/users"
                />
                <StatCard
                    title="Active Tickets"
                    value={dashboardData.tickets.pending + dashboardData.tickets.in_progress}
                    change="+12%"
                    trend="up"
                    icon={<TicketIcon />}
                    color="yellow"
                    link="/admin/tickets"
                />
                <StatCard
                    title="Total Contracts"
                    value={dashboardData.amc_contracts.total}
                    subtitle={`$${dashboardData.amc_contracts.total_value.toLocaleString()}`}
                    icon={<DocumentIcon />}
                    color="green"
                    link="/admin/amc-contracts"
                />
                <StatCard
                    title="Active Technicians"
                    value={dashboardData.technician_performance.active_technicians}
                    subtitle={`of ${dashboardData.users.technicians || 0} total`}
                    icon={<UserIcon />}
                    color="purple"
                />
            </div>

            {/* Users Overview */}
            <SectionHeader title="Users Overview" icon={<UsersIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title="Operators" value={dashboardData.users.operators || 0} color="yellow" />
                <MiniStatCard title="Technicians" value={dashboardData.users.technicians || 0} color="green" />
                <MiniStatCard title="Customers" value={dashboardData.users.customers || 0} color="purple" />
                <MiniStatCard title="Active Users" value={dashboardData.users.active_users || 0} color="blue" />
            </div>

            {/* Tickets Overview */}
            <SectionHeader title="Tickets Overview" icon={<TicketIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MiniStatCard title="Total" value={dashboardData.tickets.total} color="blue" link="/admin/tickets" />
                <MiniStatCard title="Pending" value={dashboardData.tickets.pending} color="yellow" />
                <MiniStatCard title="In Progress" value={dashboardData.tickets.in_progress} color="blue" />
                <MiniStatCard title="Completed" value={dashboardData.tickets.completed} color="green" />
                <MiniStatCard title="This Week" value={dashboardData.tickets.this_week || 0} color="purple" />
            </div>

            {/* AMC Overview */}
            <SectionHeader title="AMC Contracts & Maintenance" icon={<DocumentIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contracts"
                    value={dashboardData.amc_contracts.total}
                    subtitle={`${dashboardData.amc_contracts.active} active`}
                    icon={<DocumentIcon />}
                    color="blue"
                    link="/admin/amc-contracts"
                />
                <StatCard
                    title="Expiring Soon"
                    value={dashboardData.amc_contracts.expiring_soon}
                    subtitle="Next 30 days"
                    icon={<ExclamationIcon />}
                    color="red"
                />
                <StatCard
                    title="Scheduled Today"
                    value={dashboardData.amc_maintenances.scheduled_today}
                    subtitle={`${dashboardData.amc_maintenances.scheduled_this_week} this week`}
                    icon={<CalendarIcon />}
                    color="purple"
                />
                <StatCard
                    title="Overdue"
                    value={dashboardData.amc_maintenances.overdue}
                    subtitle="Requires attention"
                    icon={<ExclamationIcon />}
                    color="red"
                />
            </div>

            {/* Inventory Overview */}
            <SectionHeader title="Inventory Status" icon={<BoxIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Items"
                    value={dashboardData.inventory.total_items}
                    icon={<BoxIcon />}
                    color="purple"
                    link="/admin/inventory"
                />
                <StatCard title="Low Stock" value={dashboardData.inventory.low_stock} icon={<ExclamationIcon />} color="yellow" />
                <StatCard title="Out of Stock" value={dashboardData.inventory.out_of_stock} icon={<ExclamationIcon />} color="red" />
                <StatCard
                    title="Total Value"
                    value={`$${dashboardData.inventory.total_value.toLocaleString()}`}
                    icon={<CashIcon />}
                    color="green"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Users by Role" subtitle="Distribution of managed users">
                    <Doughnut
                        data={userRolesChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        padding: 15,
                                        font: {
                                            size: 12,
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="Tickets by Status" subtitle="Current ticket distribution">
                    <Bar
                        data={ticketStatusChartData}
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
                <ChartCard title="Weekly Trends" subtitle="Last 7 days performance">
                    <Line
                        data={weeklyTrendsChartData}
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

                <ChartCard title="Maintenance Status" subtitle="Current maintenance distribution">
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

            {/* Top Technicians Performance */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrophyIcon />
                            Top Performing Technicians
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on completed tickets</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {dashboardData.technician_performance.top_technicians.length > 0 ? (
                        dashboardData.technician_performance.top_technicians.map((tech: any, index: number) => (
                            <motion.div
                                key={tech.assigned_to}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                                        }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{tech.assigned_technician?.name || 'Unknown'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Technician</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">{tech.completed_tickets}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <UserIcon className="mx-auto mb-2 opacity-50" />
                            <p>No technician data available</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Admin Tools and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Admin Tools */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ToolIcon />
                        Admin Tools
                    </h3>
                    <div className="space-y-2">
                        <AdminToolButton
                            to="/admin/users"
                            icon={<UsersIcon />}
                            title="User Management"
                            description="Manage user accounts and permissions"
                            color="blue"
                        />
                        <AdminToolButton to="/admin/tickets" icon={<TicketIcon />} title="Ticket Management" description="View and manage all tickets" color="yellow" />
                        <AdminToolButton
                            to="/admin/amc-contracts"
                            icon={<DocumentIcon />}
                            title="AMC Contracts"
                            description="Manage AMC contracts and maintenance"
                            color="green"
                        />
                        <AdminToolButton to="/admin/reports" icon={<ChartIcon />} title="Reports & Analytics" description="View system reports and analytics" color="purple" />
                        <AdminToolButton to="/admin/inventory" icon={<BoxIcon />} title="Inventory" description="Manage inventory items" color="indigo" />
                        <AdminToolButton to="/admin/settings" icon={<SettingsIcon />} title="System Settings" description="Configure system settings" color="gray" />
                    </div>
                </motion.div>

                {/* Pending Tickets */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TicketIcon />
                            Pending Tickets
                        </h3>
                        <Link to="/admin/tickets" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {dashboardData.recent_activities.pending_tickets.length > 0 ? (
                            dashboardData.recent_activities.pending_tickets.slice(0, 10).map((ticket: any, index: number) => (
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
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}</p>
                                    </div>
                                    <StatusBadge status={ticket.status} />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <TicketIcon className="mx-auto mb-2 opacity-50" />
                                <p>No pending tickets</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Upcoming Maintenances Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon />
                            Upcoming Maintenances
                        </h3>
                        <Link to="/admin/maintenances" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Scheduled Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contract</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Technician</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {dashboardData.recent_activities.upcoming_maintenances.length > 0 ? (
                            dashboardData.recent_activities.upcoming_maintenances.map((maintenance: any, index: number) => (
                                <motion.tr
                                    key={maintenance.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {format(new Date(maintenance.scheduled_date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {maintenance.amc_contract?.id?.substring(0, 8) || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {maintenance.assigned_technician?.name || 'Unassigned'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={maintenance.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link to={`/admin/maintenance/${maintenance.id}`} className="text-primary hover:text-primary-dark font-medium">
                                            View Details
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <CalendarIcon className="mx-auto mb-2 opacity-50" />
                                    <p>No upcoming maintenances</p>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
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
    change?: string;
    trend?: 'up' | 'down';
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo' | 'pink';
    link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, change, trend, icon, color, link }) => {
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
                    {change && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? '↑' : '↓'}
                            <span className="font-medium">{change}</span>
                            <span className="text-gray-500 dark:text-gray-400">vs last period</span>
                        </div>
                    )}
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

interface AdminToolButtonProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}

const AdminToolButton: React.FC<AdminToolButtonProps> = ({ to, icon, title, description, color }) => {
    return (
        <Link
            to={to}
            className="flex items-start gap-4 p-4 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
            <div
                className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center text-${color}-600 dark:text-${color}-400 flex-shrink-0 group-hover:scale-110 transition-transform`}
            >
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
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
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

// Icon Components
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

const DocumentIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const CalendarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const BoxIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const CashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

const ChartIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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

export default AdminDashboard;
