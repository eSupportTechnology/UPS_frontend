import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ticketService from '../../../services/ticketService';
import technicianService from '../../../services/technicianService';
import customerService from '../../../services/customerService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';

interface FormData {
    customer_id: string;
    title: string;
    description: string;
    priority: string;
    assigned_to: string;
    photos: File[];
    address?: string;
    branch_id?: string;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    customer_type?: 'personal' | 'company';
    company_name?: string;
    address?: string;
}

interface Branch {
    id: string;
    branch_name: string;
    company_id: number;
    is_primary: boolean;
    created_at?: string;
    updated_at?: string;
}

interface Technician {
    id: string;
    name: string;
    email: string;
}

const CreateOutsideJob: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [selectedCustomerType, setSelectedCustomerType] = useState<'personal' | 'company'>('personal');
    const [customerType, setCustomerType] = useState<'personal' | 'company' | null>(null);
    const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        customer_type: 'personal' as 'personal' | 'company',
        company_name: '',
        branches: [] as { name: string; is_primary: boolean }[],
    });
    const [newBranchInput, setNewBranchInput] = useState('');
    const [newCustomerErrors, setNewCustomerErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<FormData>({
        customer_id: '',
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        photos: [],
        address: '',
        branch_id: '',
    });
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(setPageTitle('Create Outside Job'));
        loadCustomersAndTechnicians();
    }, [dispatch]);

    useEffect(() => {
        // Filter customers by selected type
        const filtered = allCustomers.filter((c) => c.customer_type === selectedCustomerType);
        setFilteredCustomers(filtered);

        // Reset customer selection when type changes
        setFormData((prev) => ({
            ...prev,
            customer_id: '',
            branch_id: '', // Reset branch when type changes
        }));
        setCustomerType(null);
        setSelectedBranch('');
        setAvailableBranches([]);
    }, [selectedCustomerType, allCustomers]);

    const loadCustomersAndTechnicians = async () => {
        try {
            const [customersResponse, techniciansResponse] = await Promise.all([
                customerService.getActiveCustomers(),
                technicianService.getTechniciansByType('outside'), // Only outside technicians
            ]);

            // Extract customers array from response
            const customers = customersResponse.success && Array.isArray(customersResponse.data)
                ? customersResponse.data
                : [];

            setAllCustomers(customers);

            // Filter for initial selected type (personal)
            const filtered = customers.filter((c: any) => c.customer_type === selectedCustomerType);
            setFilteredCustomers(filtered);

            // Extract technician data
            const techList = techniciansResponse.success
                ? (Array.isArray(techniciansResponse.data) ? techniciansResponse.data : techniciansResponse.data?.data || [])
                : [];
            setTechnicians(techList);
        } catch (error) {
            toast.error('Failed to load customers or technicians');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        // Validate address for individual customers
        if (customerType === 'personal' && !formData.address?.trim()) {
            newErrors.address = 'Address is required for individual customers';
        }

        // Validate branch for company customers
        if (customerType === 'company' && !formData.branch_id) {
            newErrors.branch_id = 'Branch is required for company customers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle customer selection
        if (name === 'customer_id') {
            // Convert ID to string because dropdown returns string value
            const selectedCustomer = filteredCustomers.find((c: any) => String(c.id) === value);

            if (selectedCustomer) {
                const type = selectedCustomer.customer_type || 'personal';
                setCustomerType(type);
                setSelectedBranch('');
                setAvailableBranches([]);

                // Load branches for company customers
                if (type === 'company') {
                    loadBranchesForCustomer(String(value));
                }
            } else {
                setCustomerType(null);
                setSelectedBranch('');
                setAvailableBranches([]);
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const loadBranchesForCustomer = async (customerId: string) => {
        setLoadingBranches(true);
        try {
            const response = await customerService.getCompanyCustomerBranches(customerId);

            if (response.success && response.data?.branches) {
                setAvailableBranches(response.data.branches);
            } else {
                toast.error('Failed to load branches');
                setAvailableBranches([]);
            }
        } catch (error) {
            toast.error('Error loading branches');
            setAvailableBranches([]);
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleCreateCustomerClick = () => {
        // Set the new customer type to match the currently selected type
        setNewCustomerData((prev) => ({
            ...prev,
            customer_type: selectedCustomerType,
            branches: [],
        }));
        setNewBranchInput('');
        setShowCreateCustomerModal(true);
    };

    const handleAddBranch = () => {
        if (newBranchInput.trim()) {
            const newBranch = {
                name: newBranchInput.trim(),
                is_primary: newCustomerData.branches.length === 0, // First branch is primary
            };
            setNewCustomerData((prev) => ({
                ...prev,
                branches: [...prev.branches, newBranch],
            }));
            setNewBranchInput('');
        }
    };

    const handleRemoveBranch = (index: number) => {
        const updatedBranches = newCustomerData.branches.filter((_, i) => i !== index);
        // If we removed the primary branch, set the first remaining as primary
        if (updatedBranches.length > 0 && !updatedBranches.some(b => b.is_primary)) {
            updatedBranches[0].is_primary = true;
        }
        setNewCustomerData((prev) => ({
            ...prev,
            branches: updatedBranches,
        }));
    };

    const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCustomerData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (newCustomerErrors[name]) {
            setNewCustomerErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNewCustomerErrors({});

        // Validation
        if (!newCustomerData.name.trim() || !newCustomerData.email.trim()) {
            toast.error('Name and email are required');
            return;
        }

        if (newCustomerData.customer_type === 'personal' && !newCustomerData.address.trim()) {
            toast.error('Address is required for individual customers');
            return;
        }

        if (newCustomerData.customer_type === 'company' && newCustomerData.branches.length === 0) {
            toast.error('At least one branch is required for company customers');
            return;
        }

        try {
            const response = await customerService.createCustomer({
                name: newCustomerData.name,
                email: newCustomerData.email,
                phone: newCustomerData.phone || undefined,
                address: newCustomerData.customer_type === 'personal' ? newCustomerData.address : undefined,
                customer_type: newCustomerData.customer_type,
                company_name: newCustomerData.customer_type === 'company' ? newCustomerData.company_name : undefined,
                branches: newCustomerData.customer_type === 'company' ? newCustomerData.branches.map(b => ({ name: b.name })) : undefined,
            });

            if (response.success) {
                toast.success('Customer created successfully!');
                // Reload customers list
                await loadCustomersAndTechnicians();
                // Select the newly created customer
                const createdCustomer = response.data?.customer;
                if (createdCustomer) {
                    setSelectedCustomerType(createdCustomer.customer_type || 'personal');
                    setFormData((prev) => ({
                        ...prev,
                        customer_id: createdCustomer.id,
                    }));
                    setCustomerType(createdCustomer.customer_type || 'personal');
                }
                setShowCreateCustomerModal(false);
                // Reset new customer form
                setNewCustomerData({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    customer_type: 'personal',
                    company_name: '',
                    branches: [],
                });
                setNewBranchInput('');
            } else {
                toast.error(response.message || 'Failed to create customer');
                if (response.errors) {
                    const errorMessages = Object.values(response.errors).flat() as string[];
                    errorMessages.forEach((msg) => toast.error(msg));
                }
            }
        } catch (error) {
            toast.error('An error occurred while creating the customer');
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Limit to 5 photos
        if (files.length + formData.photos.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...files],
        }));

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
        setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const ticketData: any = {
                customer_id: parseInt(formData.customer_id),
                title: formData.title,
                description: formData.description,
                photos: formData.photos,
            };

            // Add address for individual customers
            if (customerType === 'personal' && formData.address) {
                ticketData.address = formData.address;
            }

            // Add branch for company customers
            if (customerType === 'company' && formData.branch_id) {
                ticketData.branch_id = formData.branch_id;
            }

            const response = await ticketService.createTicket(ticketData);

            if (response.success) {
                toast.success('Outside job created successfully');
                navigate('/super-admin/all-tickets');
            } else {
                toast.error(response.message || 'Failed to create outside job');
            }
        } catch (error) {
            toast.error('An error occurred while creating the job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Create Outside Job</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new field service repair job</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-lg shadow-sm p-6">
                {/* Customer Type Selection at Top */}
                <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        Customer Type
                    </h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                        <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedCustomerType === 'personal'
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                        }`}>
                            <input
                                type="radio"
                                name="customer_type_select"
                                value="personal"
                                checked={selectedCustomerType === 'personal'}
                                onChange={(e) => setSelectedCustomerType(e.target.value as 'personal' | 'company')}
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
                            selectedCustomerType === 'company'
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                        }`}>
                            <input
                                type="radio"
                                name="customer_type_select"
                                value="company"
                                checked={selectedCustomerType === 'company'}
                                onChange={(e) => setSelectedCustomerType(e.target.value as 'personal' | 'company')}
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


                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Customer Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <select
                                name="customer_id"
                                value={formData.customer_id}
                                onChange={handleInputChange}
                                className={`flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                    errors.customer_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select Customer</option>
                                {filteredCustomers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                        {customer.customer_type === 'company' && customer.company_name
                                            ? ` - ${customer.company_name}`
                                            : ''}
                                        {' '}({customer.email})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleCreateCustomerClick}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition font-semibold whitespace-nowrap"
                            >
                                + Create
                            </button>
                        </div>
                        {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
                    </div>

                    {/* Address - Only for Individual Customers */}
                    {customerType === 'personal' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter customer address"
                                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                    )}

                    {/* Branch - Only for Company Customers */}
                    {customerType === 'company' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Branch <span className="text-red-500">*</span>
                            </label>
                            {availableBranches.length > 0 ? (
                                <select
                                    name="branch_id"
                                    value={formData.branch_id}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setSelectedBranch(e.target.value);
                                    }}
                                    disabled={loadingBranches}
                                    className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                        errors.branch_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Branch</option>
                                    {availableBranches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.branch_name}
                                            {branch.is_primary ? ' (Headquarters)' : ''}
                                        </option>
                                    ))}
                                </select>
                            ) : loadingBranches ? (
                                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    Loading branches...
                                </div>
                            ) : (
                                <div className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    No branches available. Please contact support.
                                </div>
                            )}
                            {errors.branch_id && <p className="text-red-500 text-xs mt-1">{errors.branch_id}</p>}
                        </div>
                    )}

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Priority
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    {/* Assign To Technician */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Assign To Technician
                        </label>
                        <select
                            name="assigned_to"
                            value={formData.assigned_to}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        >
                            <option value="">Select Technician (Optional)</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., UPS Battery Replacement"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>



                </div>

                {/* Description */}
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the issue and what the customer reported..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Photos */}
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Photos (Max 5)
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                    />
                    {photoPreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-5">
                            {photoPreview.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/super-admin/all-tickets')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition"
                    >
                        {loading ? 'Creating...' : 'Create Outside Job'}
                    </button>
                </div>
            </form>

            {/* Create Customer Modal */}
            {showCreateCustomerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-black rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Customer</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Add a new customer to the system</p>
                        </div>

                        <form onSubmit={handleCreateCustomerSubmit} className="p-6 space-y-6">
                            {/* Customer Type Selection */}
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                    Customer Type
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                        newCustomerData.customer_type === 'personal'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="customer_type"
                                            value="personal"
                                            checked={newCustomerData.customer_type === 'personal'}
                                            onChange={handleNewCustomerChange}
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
                                        newCustomerData.customer_type === 'company'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="customer_type"
                                            value="company"
                                            checked={newCustomerData.customer_type === 'company'}
                                            onChange={handleNewCustomerChange}
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
                                            value={newCustomerData.name}
                                            onChange={handleNewCustomerChange}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                                newCustomerErrors.name ? 'border-red-500' : ''
                                            }`}
                                            placeholder="Enter customer name"
                                        />
                                        {newCustomerErrors.name && (
                                            <p className="text-red-500 text-xs mt-1">{newCustomerErrors.name}</p>
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
                                            value={newCustomerData.email}
                                            onChange={handleNewCustomerChange}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                                newCustomerErrors.email ? 'border-red-500' : ''
                                            }`}
                                            placeholder="Enter customer email"
                                        />
                                        {newCustomerErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">{newCustomerErrors.email}</p>
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
                                            value={newCustomerData.phone}
                                            onChange={handleNewCustomerChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    {/* Company Name - Only for Company Customers */}
                                    {newCustomerData.customer_type === 'company' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                name="company_name"
                                                value={newCustomerData.company_name}
                                                onChange={handleNewCustomerChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                    )}

                                    {/* Address - Only for Individual Customers */}
                                    {newCustomerData.customer_type === 'personal' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newCustomerData.address}
                                                onChange={handleNewCustomerChange}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                                    newCustomerErrors.address ? 'border-red-500' : ''
                                                }`}
                                                placeholder="Enter address"
                                            />
                                            {newCustomerErrors.address && (
                                                <p className="text-red-500 text-xs mt-1">{newCustomerErrors.address}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Branches - Only for Company Customers */}
                            {newCustomerData.customer_type === 'company' && (
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        Company Branches
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Add Branch Input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newBranchInput}
                                                onChange={(e) => setNewBranchInput(e.target.value)}
                                                placeholder="Enter branch name"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddBranch();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddBranch}
                                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                                            >
                                                Add Branch
                                            </button>
                                        </div>

                                        {/* Branches List */}
                                        {newCustomerData.branches.length > 0 && (
                                            <div className="space-y-2">
                                                {newCustomerData.branches.map((branch, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-800 dark:text-white">
                                                                {branch.name}
                                                            </span>
                                                            {branch.is_primary && (
                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                    Headquarters
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBranch(index)}
                                                            className="text-red-500 hover:text-red-700 transition"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Modal Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCustomerModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                                >
                                    Create Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateOutsideJob;
