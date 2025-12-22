import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { SuperAdminDashboardData } from '../../types/dashboard.types';
import { motion, AnimatePresence } from 'framer-motion';
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

// Register ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const SuperAdminDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

    useEffect(() => {
        dispatch(setPageTitle('Super Admin Dashboard'));
        fetchDashboardData();
    }, [dispatch]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await DashboardService.getSuperAdminDashboard();
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
        labels: ['Super Admins', 'Admins', 'Operators', 'Technicians', 'Customers'],
        datasets: [
            {
                label: 'Users by Role',
                data: [
                    dashboardData.users.super_admins,
                    dashboardData.users.admins,
                    dashboardData.users.operators,
                    dashboardData.users.technicians,
                    dashboardData.users.customers,
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
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

    const monthlyTrendsChartData = {
        labels: dashboardData.monthly_trends.tickets.map((item) => item.month),
        datasets: [
            {
                label: 'Tickets',
                data: dashboardData.monthly_trends.tickets.map((item) => item.count),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Maintenances',
                data: dashboardData.monthly_trends.maintenances.map((item) => item.count),
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

    const inventoryCategoryChartData = {
        labels: dashboardData.inventory.by_category.map((item) => item.category),
        datasets: [
            {
                label: 'Items by Category',
                data: dashboardData.inventory.by_category.map((item) => item.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
            },
        ],
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Super Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your system today.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Last updated: {format(new Date(), 'PPpp')}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="btn btn-primary flex items-center gap-2"
                        >
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
                    value={dashboardData.users.total}
                    change="+12%"
                    trend="up"
                    icon={<UsersIcon />}
                    color="blue"
                    link="/super-admin/users"
                />
                <StatCard
                    title="Active Tickets"
                    value={dashboardData.tickets.pending + dashboardData.tickets.in_progress}
                    change="+8%"
                    trend="up"
                    icon={<TicketIcon />}
                    color="yellow"
                    link="/super-admin/tickets"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${dashboardData.amc_contracts.total_value.toLocaleString()}`}
                    change="+23%"
                    trend="up"
                    icon={<CashIcon />}
                    color="green"
                    link="/super-admin/amc-contracts"
                />
                <StatCard
                    title="Active Technicians"
                    value={dashboardData.tracking.active_technicians}
                    change="-2%"
                    trend="down"
                    icon={<UserIcon />}
                    color="purple"
                />
            </div>

            {/* Users Overview */}
            <SectionHeader title="Users Overview" icon={<UsersIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MiniStatCard title="Super Admins" value={dashboardData.users.super_admins} color="red" />
                <MiniStatCard title="Admins" value={dashboardData.users.admins} color="blue" />
                <MiniStatCard title="Operators" value={dashboardData.users.operators} color="yellow" />
                <MiniStatCard title="Technicians" value={dashboardData.users.technicians} color="green" />
            </div>

            {/* Tickets Overview */}
            <SectionHeader title="Tickets Overview" icon={<TicketIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MiniStatCard title="Total" value={dashboardData.tickets.total} color="blue" link="/super-admin/tickets" />
                <MiniStatCard title="Pending" value={dashboardData.tickets.pending} color="yellow" />
                <MiniStatCard title="In Progress" value={dashboardData.tickets.in_progress} color="blue" />
                <MiniStatCard title="Completed" value={dashboardData.tickets.completed} color="green" />
                <MiniStatCard title="Today" value={dashboardData.tickets.today} color="purple" />
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
                    link="/super-admin/amc-contracts"
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

            {/* Inventory & Tracking */}
            <SectionHeader title="Inventory & Tracking" icon={<BoxIcon />} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Items"
                    value={dashboardData.inventory.total_items}
                    subtitle={`Qty: ${dashboardData.inventory.total_quantity}`}
                    icon={<BoxIcon />}
                    color="purple"
                    link="/super-admin/inventory"
                />
                <StatCard
                    title="Low Stock"
                    value={dashboardData.inventory.low_stock}
                    subtitle={`${dashboardData.inventory.out_of_stock} out of stock`}
                    icon={<ExclamationIcon />}
                    color="yellow"
                />
                <StatCard
                    title="Active Tracks"
                    value={dashboardData.tracking.active_tracks}
                    subtitle={`${dashboardData.tracking.total_tracks_today} today`}
                    icon={<LocationIcon />}
                    color="blue"
                />
                <StatCard
                    title="Total Value"
                    value={`$${dashboardData.inventory.total_value.toLocaleString()}`}
                    subtitle="Inventory worth"
                    icon={<CashIcon />}
                    color="green"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Users by Role" subtitle="Distribution of user roles">
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
                                    ticks: {
                                        stepSize: 1,
                                    },
                                },
                            },
                        }}
                    />
                </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="6-Month Trends" subtitle="Tickets and maintenance over time">
                    <Line
                        data={monthlyTrendsChartData}
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

            {/* Charts Row 3 */}
            {dashboardData.inventory.by_category.length > 0 && (
                <ChartCard title="Inventory by Category" subtitle="Items distribution across categories">
                    <Bar
                        data={inventoryCategoryChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartCard>
            )}

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LightningIcon />
                        Quick Actions
                    </h3>
                    <div className="space-y-2">
                        <QuickActionLink to="/super-admin/user-create" icon={<PlusIcon />} label="Create New User" color="blue" />
                        <QuickActionLink to="/super-admin/users" icon={<UsersIcon />} label="Manage Users" color="green" />
                        <QuickActionLink to="/super-admin/branches" icon={<BuildingIcon />} label="Manage Branches" color="purple" />
                        <QuickActionLink to="/super-admin/tickets" icon={<TicketIcon />} label="View All Tickets" color="yellow" />
                        <QuickActionLink to="/super-admin/amc-contracts" icon={<DocumentIcon />} label="AMC Contracts" color="indigo" />
                        <QuickActionLink to="/super-admin/inventory" icon={<BoxIcon />} label="Inventory Management" color="pink" />
                    </div>
                </motion.div>

                {/* Recent Tickets */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TicketIcon />
                            Recent Tickets
                        </h3>
                        <Link to="/super-admin/tickets" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {dashboardData.recent_activities.recent_tickets.length > 0 ? (
                            dashboardData.recent_activities.recent_tickets.map((ticket: any, index: number) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ticket.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {ticket.assigned_technician?.name || 'Unassigned'} •
                                            <span className={`ml-1 ${ticket.priority === 'high' ? 'text-red-600' : ticket.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
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
                                <p>No recent tickets</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Maintenances Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ToolIcon />
                            Recent Maintenances
                        </h3>
                        <Link to="/super-admin/maintenances" className="text-primary hover:text-primary-dark text-sm font-medium">
                            View All →
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Scheduled Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contract ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Technician</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {dashboardData.recent_activities.recent_maintenances.length > 0 ? (
                            dashboardData.recent_activities.recent_maintenances.map((maintenance: any, index: number) => (
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
                                        <Link
                                            to={`/super-admin/maintenance/${maintenance.id}`}
                                            className="text-primary hover:text-primary-dark font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    <ToolIcon className="mx-auto mb-2 opacity-50" />
                                    <p>No recent maintenances</p>
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

// Loading Screen
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

// Error Screen
const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full"
            >
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

// Stat Card Component
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
                            <span className="text-gray-500 dark:text-gray-400">vs last month</span>
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

// Mini Stat Card
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

// Section Header
const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => {
    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mt-8 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </motion.div>
    );
};

// Chart Card
const ChartCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className="h-80">{children}</div>
        </motion.div>
    );
};

// Quick Action Link
interface QuickActionLinkProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

const QuickActionLink: React.FC<QuickActionLinkProps> = ({ to, icon, label, color }) => {
    return (
        <Link
            to={to}
            className="flex items-center gap-3 p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
        >
            <div className={`w-8 h-8 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <span className="font-medium">{label}</span>
            <span className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
    );
};

// Status Badge
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

// Icon Components (Add these at the end of the file)
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

const UserIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

const BoxIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

const RefreshIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const BuildingIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
    </svg>
);

const LightningIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default SuperAdminDashboard;
