import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const OperatorDashboard: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Operator Dashboard'));
    }, [dispatch]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Operator Dashboard</h1>
                <p className="text-gray-600">Monitor operations and manage daily tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Active Tasks</h2>
                            <p className="text-2xl font-bold text-gray-900">24</p>
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
                            <h2 className="text-sm font-medium text-gray-600">Completed Today</h2>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Overdue</h2>
                            <p className="text-2xl font-bold text-gray-900">3</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-600">Priority Tasks</h2>
                            <p className="text-2xl font-bold text-gray-900">7</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Emergency Repair - Building A</h4>
                            <p className="text-sm text-gray-500">Due: 2:00 PM</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">Urgent</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Equipment Inspection</h4>
                            <p className="text-sm text-gray-500">Due: 4:30 PM</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full">Medium</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Routine Maintenance Check</h4>
                            <p className="text-sm text-gray-500">Due: 6:00 PM</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Low</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDashboard;
