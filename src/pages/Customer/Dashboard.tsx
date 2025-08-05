import React from 'react';
import UserLayout from '../../components/Layouts/userLayout';

function Dashboard() {
    return (
        <UserLayout>
            <div className="space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl backdrop-blur-sm group-hover:from-blue-500/15 group-hover:via-purple-500/15 group-hover:to-indigo-500/15 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>
                        
                        <div className="relative p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Contracts</h3>
                                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">3</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl backdrop-blur-sm group-hover:from-green-500/15 group-hover:via-emerald-500/15 group-hover:to-teal-500/15 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>
                        
                        <div className="relative p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Open Tickets</h3>
                                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">2</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl backdrop-blur-sm group-hover:from-yellow-500/15 group-hover:via-orange-500/15 group-hover:to-amber-500/15 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>
                        
                        <div className="relative p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Payments</h3>
                                    <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">Rs 15,000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-indigo-500/10 rounded-2xl backdrop-blur-sm group-hover:from-purple-500/15 group-hover:via-violet-500/15 group-hover:to-indigo-500/15 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>
                        
                        <div className="relative p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Maintenance Due</h3>
                                    <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Tickets Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm"></div>
                        
                        <div className="relative">
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Printer not working</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Created 2 days ago</p>
                                        </div>
                                        <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">In Progress</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Software installation</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Created 5 days ago</p>
                                        </div>
                                        <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Maintenance Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-teal-500/5 to-blue-500/5 rounded-2xl backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm"></div>
                        
                        <div className="relative">
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Maintenance</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Quarterly System Check</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Due in 3 days</p>
                                        </div>
                                        <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">Scheduled</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Hardware Inspection</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Due in 1 week</p>
                                        </div>
                                        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default Dashboard;