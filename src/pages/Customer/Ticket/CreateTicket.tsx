import React, { useState } from 'react';
import UserLayout from '../../../components/Layouts/userLayout';
import { useAlert } from '../../../components/Alert/Alert';
import ticketService from '../../../services/ticketService';
import type { CreateTicketData } from '../../../types/ticket.types';

function CreateTicket() {
    const { showAlert, AlertContainer } = useAlert();
    const [loading, setLoading] = useState(false);

    // Form state for creating tickets (matching backend requirements)
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
            // Validate file types and sizes
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
            // Get current user ID from localStorage or auth context
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

                // Reset form
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

            {/* Professional Background Container */}
            <div className="min-h-screen -m-6 p-6 bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50">
                {/* Background Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-20 dark:opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%239C92AC' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
                        backgroundSize: '60px 60px',
                    }}
                ></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Clean Page Header */}
                    <div className="relative mb-12">
                        {/* Header Background with Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-800/20 dark:via-purple-800/20 dark:to-indigo-800/20 rounded-3xl backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30"></div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl"></div>

                        <div className="relative text-center py-8 px-8">
                            {/* Clean Title */}
                            <div className="mb-4">
                                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">Create Ticket</h1>
                                <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                            </div>

                            {/* Clear Description */}
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                                Need assistance? Create a support ticket and our dedicated team will help resolve your issue promptly.
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Create Ticket Form */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 mb-8">
                        {/* Form Progress Indicator */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium">1</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Ticket Details</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Provide information about your issue</p>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center space-x-2">
                                <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                                <div className="w-8 h-1 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                                <div className="w-8 h-1 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitTicket} className="space-y-8">
                            {/* Title Field */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Issue Title *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={ticketForm.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/50"
                                        placeholder="Brief description of your issue"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments (Optional)</label>
                                <div className="relative">
                                    <input type="file" id="photos" name="photos" multiple accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} className="sr-only" />
                                    <label
                                        htmlFor="photos"
                                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                                    >
                                        <div className="text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload images</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Display selected files */}
                                {selectedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Files:</h4>
                                        <div className="space-y-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                    </div>
                                                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Issue Description *
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={ticketForm.description}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className="w-full px-4 py-4 border border-gray-300/50 dark:border-gray-600/50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 dark:bg-gray-700/50 dark:text-white transition-all duration-200 resize-vertical backdrop-blur-sm bg-white/50"
                                        placeholder="Please describe your issue in detail..."
                                        required
                                    />
                                    <div className="absolute bottom-3 right-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <div className="flex justify-end pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-10 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating Ticket...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Create Support Ticket
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

export default CreateTicket;
