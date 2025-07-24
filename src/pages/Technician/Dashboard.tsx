import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const TechnicianDashboard: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Technician Dashboard'));
    }, [dispatch]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Technician Dashboard</h1>
                <p className="text-gray-600">Track your assignments and maintenance tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 114 0z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Assigned Tasks</h2>
                            <p className="text-2xl font-bold text-gray-900">18</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Completed</h2>
                            <p className="text-2xl font-bold text-gray-900">145</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">In Progress</h2>
                            <p className="text-2xl font-bold text-gray-900">5</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Urgent</h2>
                            <p className="text-2xl font-bold text-gray-900">2</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h3>
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">HVAC System Repair</h4>
                                <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">Urgent</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Building C, Floor 3 - Air conditioning unit malfunction</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Due: Today, 3:00 PM</span>
                                <span className="text-blue-600">In Progress</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Electrical Panel Inspection</h4>
                                <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full">Medium</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Building A, Basement - Monthly safety inspection</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Due: Tomorrow, 10:00 AM</span>
                                <span className="text-gray-600">Pending</span>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-900">Plumbing Maintenance</h4>
                                <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Low</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Building B, Floor 2 - Routine pipe inspection</p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Due: Friday, 2:00 PM</span>
                                <span className="text-gray-600">Scheduled</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools & Equipment</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V5a1 1 0 011-1h3a1 1 0 001-1V2a2 2 0 114 0z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Multimeter</span>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Available</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Drill Set</span>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">In Use</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2V3z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">Safety Kit</span>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Available</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
                        <div className="space-y-2">
                            <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Request Equipment</button>
                            <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">Report Issue</button>
                            <button className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors">View Work History</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
