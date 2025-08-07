import React from 'react';
import UserLayout from '../../components/Layouts/userLayout';

function Dashboard() {
    return (
        <UserLayout>
            <div className="space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 rounded-2xl backdrop-blur-sm group-hover:from-blue-500/15 group-hover:via-cyan-500/15 group-hover:to-blue-600/15 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>

                        <div className="relative p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Domains</h3>
                                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">5</p>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hosting Plans</h3>
                                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">3</p>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Invoices</h3>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Support Tickets</h3>
                                    <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Services Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 rounded-2xl backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm"></div>

                        <div className="relative">
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Services</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-blue-100 dark:border-blue-900/30">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">example.com</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Domain Registration</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Active</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-green-100 dark:border-green-900/30">
                                        <div className="flex items-center">
                                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-3">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Shared Hosting Pro</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Web Hosting Service</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Support Tickets Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-purple-600/5 rounded-2xl backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 backdrop-blur-sm"></div>

                        <div className="relative">
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Support</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-yellow-100 dark:border-yellow-900/30">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Email Configuration Help</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Ticket #12345 • 2 days ago</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">In Progress</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-green-100 dark:border-green-900/30">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">SSL Certificate Installation</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Ticket #12344 • 5 days ago</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">Resolved</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
                            </svg>
                            <span className="text-sm font-medium">Register Domain</span>
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2" />
                            </svg>
                            <span className="text-sm font-medium">Upgrade Hosting</span>
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm font-medium">Submit Ticket</span>
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium">Pay Invoice</span>
                        </button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default Dashboard;