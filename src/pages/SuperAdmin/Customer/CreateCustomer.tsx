import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import customerService from '../../../services/customerService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import api from '../../../config/api.config';

interface Branch {
    id: string;
    name: string;
    branch_code: string;
    city?: string;
}

interface SelectedBranch {
    id?: string;
    name: string;
    branch_code?: string;
    isNew?: boolean;
}

interface ExistingBranch {
    id: string;
    name: string;
    branch_code: string;
    city?: string;
}

const CreateCustomer: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedBranches, setSelectedBranches] = useState<SelectedBranch[]>([]);
    const [existingBranches, setExistingBranches] = useState<ExistingBranch[]>([]);
    const [newBranchName, setNewBranchName] = useState<string>('');
    const [selectedExistingBranch, setSelectedExistingBranch] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        customer_type: 'personal' as 'personal' | 'company',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(setPageTitle('Create Customer'));
    }, [dispatch]);

    const handleAddBranch = () => {
        const branchName = newBranchName.trim();

        if (!branchName) {
            toast.error('Please enter a branch name');
            return;
        }

        // Check if branch already added
        if (selectedBranches.some((b) => b.name.toLowerCase() === branchName.toLowerCase())) {
            toast.error('This branch is already added');
            return;
        }

        // Add new branch
        setSelectedBranches([
            ...selectedBranches,
            {
                name: branchName,
                isNew: true,
            },
        ]);
        setNewBranchName('');
        toast.success(`Branch "${branchName}" added`);
    };

    const handleRemoveBranch = (index: number) => {
        const removedBranch = selectedBranches[index];
        setSelectedBranches(selectedBranches.filter((_, i) => i !== index));
        toast.success(`Branch "${removedBranch.name}" removed`);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validation
        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error('Name and email are required');
            return;
        }

        setLoading(true);

        const response = await customerService.createCustomer({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            address: formData.address || undefined,
            customer_type: formData.customer_type,
            branches: selectedBranches.length > 0 ? selectedBranches.map((b) => ({
                name: b.name,
            })) : undefined,
        });

        setLoading(false);

        if (response.success) {
            toast.success(response.message || 'Customer created successfully');
            setSelectedBranches([]);
            setSelectedExistingBranch('');
            navigate('/super-admin/all-customers');
        } else {
            toast.error(response.message || 'Failed to create customer');
            if (response.errors) {
                const errorMessages = Object.values(response.errors).flat() as string[];
                errorMessages.forEach((msg) => toast.error(msg));
                setErrors(
                    Object.keys(response.errors || {}).reduce(
                        (acc, key) => {
                            acc[key] = Array.isArray(response.errors![key])
                                ? response.errors![key][0]
                                : response.errors![key];
                            return acc;
                        },
                        {} as Record<string, string>
                    )
                );
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">
                    Create Customer
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Add a new customer to the system
                </p>
            </div>

            <div className="bg-white dark:bg-black rounded-lg shadow-sm p-6 max-w-4xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Type Selection */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Customer Type
                        </h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                formData.customer_type === 'personal'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                            }`}>
                                <input
                                    type="radio"
                                    name="customer_type"
                                    value="personal"
                                    checked={formData.customer_type === 'personal'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        Individual Customer
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Single person customer
                                    </p>
                                </div>
                            </label>

                            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                formData.customer_type === 'company'
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                            }`}>
                                <input
                                    type="radio"
                                    name="customer_type"
                                    value="company"
                                    checked={formData.customer_type === 'company'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4"
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        Company Customer
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Multiple branches
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                        errors.name ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Enter customer name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                    placeholder="Enter customer email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Branches Section for Company Customers */}
                    {formData.customer_type === 'company' && (
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                Add Branches (Optional)
                            </h3>

                            {/* Branch Name Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Branch Name
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g., Delhi Office, Mumbai Branch, Bangalore HQ..."
                                        value={newBranchName}
                                        onChange={(e) => setNewBranchName(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddBranch();
                                            }
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddBranch}
                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition font-semibold"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Selected Branches List */}
                            {selectedBranches.length > 0 ? (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Branches to be Added ({selectedBranches.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {selectedBranches.map((branch, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {branch.name}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBranch(index)}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    No branches added yet. Type a branch name and click "+ Add" to add branches for this company.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/super-admin/all-customers')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition"
                        >
                            {loading ? 'Creating...' : 'Create Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCustomer;
