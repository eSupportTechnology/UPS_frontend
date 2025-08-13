import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';
import UserLayout from '../../components/Layouts/userLayout';

function Dashboard() {
    const { user } = useSelector((state: IRootState) => state.auth);

    const getUserInitials = (name?: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return names[0][0].toUpperCase();
    };

    const formatCustomerSince = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };
    return (
        <UserLayout>
            <div className="space-y-6">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - User Information Card */}
                    <div className="group relative lg:col-span-1">
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl backdrop-blur-sm group-hover:bg-primary/10 transition-all duration-300"></div>
                        <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>

                        <div className="relative overflow-hidden rounded-2xl">
                            {/* Header with Primary Blue Background */}
                            <div className="bg-primary px-8 py-6">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/30">
                                            {getUserInitials(user?.name)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="ml-6">
                                        <h2 className="text-2xl font-bold text-white">{user?.name || 'User Name'}</h2>
                                        <p className="text-white/80">Premium Customer</p>
                                        <div className="flex items-center mt-2">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user?.is_active ? 'bg-green-100/90 text-green-800' : 'bg-red-100/90 text-red-800'}`}>
                                                {user?.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 bg-white/50 dark:bg-gray-800/50">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-3 border-b border-primary/20 dark:border-primary-light/20">
                                        <span className="text-primary/60 dark:text-primary-light/60">Email:</span>
                                        <span className="font-medium text-primary-dark dark:text-primary-light">{user?.email || 'user@example.com'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-primary/20 dark:border-primary-light/20">
                                        <span className="text-primary/60 dark:text-primary-light/60">Phone:</span>
                                        <span className="font-medium text-primary-dark dark:text-primary-light">{user?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-primary/20 dark:border-primary-light/20">
                                        <span className="text-primary/60 dark:text-primary-light/60">Customer Since:</span>
                                        <span className="font-medium text-primary-dark dark:text-primary-light">{formatCustomerSince(user?.created_at)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-primary/20 dark:border-primary-light/20">
                                        <span className="text-primary/60 dark:text-primary-light/60">Account Type:</span>
                                        <span className="font-medium text-primary dark:text-primary-light">Premium</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3">
                                        <span className="text-primary/60 dark:text-primary-light/60">Status:</span>
                                        <span className={`font-medium ${user?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {user?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Ticket Counts and WhatsApp QR */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Ticket Counts Card */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl backdrop-blur-sm group-hover:bg-primary/10 transition-all duration-300"></div>
                            <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>

                            <div className="relative overflow-hidden rounded-2xl">
                                {/* Header with Primary Blue Background */}
                                <div className="bg-primary px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-white ml-3">Support Tickets</h3>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 bg-white/50 dark:bg-gray-800/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-primary/10">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">5</div>
                                            <div className="text-sm text-primary/60 dark:text-primary-light/60 mt-1">Resolved</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-primary/10">
                                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</div>
                                            <div className="text-sm text-primary/60 dark:text-primary-light/60 mt-1">In Progress</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-primary/10">
                                            <div className="text-2xl font-bold text-primary dark:text-primary-light">1</div>
                                            <div className="text-sm text-primary/60 dark:text-primary-light/60 mt-1">Open</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/70 dark:bg-gray-700/50 backdrop-blur-sm border border-primary/10">
                                            <div className="text-2xl font-bold text-primary-dark dark:text-primary-light">8</div>
                                            <div className="text-sm text-primary/60 dark:text-primary-light/60 mt-1">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp QR Code Card */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-green-500/5 rounded-2xl backdrop-blur-sm group-hover:bg-green-500/10 transition-all duration-300"></div>
                            <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/30 group-hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"></div>

                            <div className="relative overflow-hidden rounded-2xl">
                                {/* Header with Primary Blue Background */}
                                <div className="bg-primary px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white ml-3">Join Our WhatsApp Group</h3>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 bg-white/50 dark:bg-gray-800/50">
                                    <div className="text-center">
                                        {/* QR Code */}
                                        <div className="bg-white p-4 rounded-xl shadow-inner mx-auto w-fit mb-4 border border-primary/10">
                                            <img src="/assets/images/qr.png" alt="WhatsApp Group QR Code" className="w-32 h-32 rounded-lg" />
                                        </div>

                                        <p className="text-sm text-primary/60 dark:text-primary-light/60 mb-4">
                                            Scan the QR code to join our WhatsApp support group for instant updates and assistance.
                                        </p>

                                        <button className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                            <div className="flex items-center justify-center">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                </svg>
                                                Join WhatsApp Group
                                            </div>
                                        </button>
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
