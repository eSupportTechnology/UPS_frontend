import React, { useState } from 'react';
import UserLayout from '../../../components/Layouts/userLayout';
import { useAlert } from '../../../components/Alert/Alert';
import ticketService from '../../../services/ticketService';
import type { CreateTicketData } from '../../../types/ticket.types';

function CreateTicket() {
    const { showAlert, AlertContainer } = useAlert();
    const [loading, setLoading] = useState(false);

    const [ticketForm, setTicketForm] = useState({
        title: '',
        description: '',
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTicketForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            const validFiles = files.filter((file) => {
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                return validTypes.includes(file.type) && file.size <= maxSize;
            });

            if (validFiles.length !== files.length) {
                showAlert({
                    type: 'warning',
                    title: 'File Validation',
                    message: 'Some files were excluded. Only JPEG, JPG, PNG images under 5MB are allowed.',
                });
            }

            setSelectedFiles(validFiles);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketForm.title.trim() || !ticketForm.description.trim()) {
            showAlert({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fill in all required fields',
            });
            return;
        }

        setLoading(true);
        try {
            const userData = localStorage.getItem('user');
            let customerId = '';

            if (userData) {
                const user = JSON.parse(userData);
                customerId = user.id;
            } else {
                throw new Error('User not authenticated');
            }

            const ticketData = {
                customer_id: Number(customerId),
                title: ticketForm.title,
                description: ticketForm.description,
                photos: selectedFiles.length > 0 ? selectedFiles : undefined,
            };

            const response = await ticketService.createTicket(ticketData);

            if (response.success) {
                showAlert({
                    type: 'success',
                    title: 'Success',
                    message: response.message || 'Support ticket created successfully! We will get back to you soon.',
                });

                setTicketForm({
                    title: '',
                    description: '',
                });
                setSelectedFiles([]);
            } else {
                throw new Error(response.message || 'Failed to create ticket');
            }
        } catch (error: any) {
            console.error('Error creating ticket:', error);
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to create ticket. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            <AlertContainer />

            {/* Content Area */}
            <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Left Side - Recent Tickets & Support Section */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Recent Tickets Section */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    Recent Tickets
                                </h3>
                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">Last 5</span>
                            </div>

                            <div className="space-y-3">
                                {/* Mock Recent Tickets - Replace with actual data */}
                                <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Login Issue</span>
                                        <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Pending</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Cannot access my account...</p>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        2 hours ago
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Payment Problem</span>
                                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">Resolved</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Payment not processing...</p>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        1 day ago
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Service Request</span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">In Progress</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Need additional features...</p>
                                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        2 days ago
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                                <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">View All Tickets →</button>
                            </div>
                        </div>

                        {/* Support Section */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Need Help?
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <h4 className="font-medium text-blue-900 dark:text-blue-100">FAQ</h4>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Find quick answers to common questions</p>
                                    <button className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Browse FAQ</button>
                                </div>

                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200/50 dark:border-green-700/30">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m2-4h4a2 2 0 014 4v6a2 2 0 01-4 4H9l-4-4V7a2 2 0 014-4z"
                                            />
                                        </svg>
                                        <h4 className="font-medium text-green-900 dark:text-green-100">Live Chat</h4>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">Get instant help from our support team</p>
                                    <button className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">Start Chat</button>
                                </div>

                                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/30">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <h4 className="font-medium text-purple-900 dark:text-purple-100">Phone Support</h4>
                                    </div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">Call us directly for urgent matters</p>
                                    <div className="text-xs font-medium text-purple-900 dark:text-purple-100">07777 00 255</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Create Ticket Form */}
                    <div className="lg:col-span-8">
                        {/* Enhanced Create Ticket Form */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 lg:p-8">
                            {/* Form Header */}
                            <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Support Ticket</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Describe your issue and we'll get back to you as soon as possible</p>
                            </div>

                            <form onSubmit={handleSubmitTicket} className="space-y-6 sm:space-y-8">
                                {/* Title Field */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Issue Title *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={ticketForm.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300/50 dark:border-gray-600/50 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/50"
                                            placeholder="Brief description of your issue"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                <div className="space-y-3 sm:space-y-4">
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments (Optional)</label>
                                    <div className="relative">
                                        <input type="file" id="photos" name="photos" multiple accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} className="sr-only" />
                                        <label
                                            htmlFor="photos"
                                            className="flex items-center justify-center w-full px-3 sm:px-4 py-4 sm:py-6 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-lg sm:rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                                        >
                                            <div className="text-center">
                                                <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload images</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB each</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Display selected files */}
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-3 sm:mt-4">
                                            <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files:</h4>
                                            <div className="space-y-2">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                                            <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                        </div>
                                                        <button type="button" onClick={() => removeFile(index)} className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0">
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Description */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Issue Description *
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={ticketForm.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300/50 dark:border-gray-600/50 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 resize-vertical backdrop-blur-sm bg-white/50"
                                            placeholder="Please describe your issue in detail..."
                                            required
                                        />
                                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Submit Button */}
                                <div className="flex justify-center sm:justify-end pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full sm:w-auto group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 sm:px-10 text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                <span className="hidden sm:inline">Creating Ticket...</span>
                                                <span className="sm:hidden">Creating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-200"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                <span className="hidden sm:inline">Create Support Ticket</span>
                                                <span className="sm:hidden">Create Ticket</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default CreateTicket;
