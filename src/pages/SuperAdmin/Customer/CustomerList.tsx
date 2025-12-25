import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import customerService from '../../../services/customerService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';
import CompanyBranchesModal from './CompanyBranchesModal';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    customer_type: 'personal' | 'company';
    company_name?: string;
    is_active: boolean;
}

const CustomerList: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [filterType, setFilterType] = useState<'all' | 'personal' | 'company'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showBranchesModal, setShowBranchesModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');

    useEffect(() => {
        dispatch(setPageTitle('Manage Customers'));
        loadCustomers();
    }, [dispatch]);

    useEffect(() => {
        filterCustomers();
    }, [customers, filterType, searchTerm]);

    const loadCustomers = async () => {
        setLoading(true);
        console.log('Loading customers...');
        const response = await customerService.getAllCustomers();
        console.log('Load customers response:', response);
        setLoading(false);

        if (response.success) {
            console.log('Customers loaded successfully:', response.data);
            setCustomers(response.data || []);
        } else {
            console.error('Failed to load customers:', response);
            toast.error(response.message || 'Failed to load customers');
        }
    };

    const filterCustomers = () => {
        console.log('filterCustomers called, customers:', customers);
        console.log('filterType:', filterType, 'searchTerm:', searchTerm);

        if (!Array.isArray(customers)) {
            console.log('Customers is not an array, setting to empty');
            setFilteredCustomers([]);
            return;
        }

        let filtered = [...customers];

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter((c) => c.customer_type === filterType);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
            );
        }

        console.log('Filtered customers:', filtered);
        setFilteredCustomers(filtered);
    };

    const getCustomerTypeLabel = (type: string) => {
        return type === 'personal' ? 'Individual' : 'Company';
    };

    const getCustomerTypeColor = (type: string) => {
        return type === 'personal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
    };

    const handleOpenBranches = (id: string, name: string) => {
        setSelectedCustomerId(id);
        setSelectedCustomerName(name);
        setShowBranchesModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        Swal.fire({
            title: 'Delete Customer?',
            html: `Are you sure you want to delete <strong>${name}</strong>?<br><br><span style="color: #dc2626;">This action cannot be undone.</span>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await customerService.deleteCustomer(id);

                if (response.success) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Customer deleted successfully',
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                    });
                    loadCustomers();
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.message || 'Failed to delete customer',
                        icon: 'error',
                        confirmButtonColor: '#ef4444',
                    });
                }
            }
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">
                        Manage Customers
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {Array.isArray(filteredCustomers) ? filteredCustomers.length : 0} customer{Array.isArray(filteredCustomers) && filteredCustomers.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/super-admin/create-customer')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                >
                    + Add Customer
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            placeholder="Name, email, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Customer Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        >
                            <option value="all">All Types</option>
                            <option value="personal">Individual</option>
                            <option value="company">Company</option>
                        </select>
                    </div>

                    {/* Refresh */}
                    <div className="flex items-end">
                        <button
                            onClick={loadCustomers}
                            disabled={loading}
                            className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            {loading ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">Loading customers...</p>
                </div>
            ) : !Array.isArray(filteredCustomers) || filteredCustomers.length === 0 ? (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-500">No customers found</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-black rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {Array.isArray(filteredCustomers) && filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {customer.name}
                                                </p>
                                                {customer.customer_type === 'company' &&
                                                    customer.company_name && (
                                                        <p className="text-xs text-gray-500">
                                                            {customer.company_name}
                                                        </p>
                                                    )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {customer.email}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getCustomerTypeColor(
                                                    customer.customer_type
                                                )}`}
                                            >
                                                {getCustomerTypeLabel(customer.customer_type)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    customer.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {customer.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3 flex-wrap">
                                                {customer.customer_type === 'company' && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenBranches(customer.id, customer.name)
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 font-medium transition"
                                                    >
                                                        Branches
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(customer.id, customer.name)
                                                    }
                                                    className="text-red-500 hover:text-red-700 font-medium transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Company Branches Modal */}
            <CompanyBranchesModal
                isOpen={showBranchesModal}
                customerId={selectedCustomerId}
                customerName={selectedCustomerName}
                onClose={() => setShowBranchesModal(false)}
            />
        </div>
    );
};

export default CustomerList;
