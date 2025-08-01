import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAlert } from '../../../components/Alert/Alert';
import { AMCContractService } from '../../../services/amcContractService';
import { BranchService } from '../../../services/branchService';
import { CustomerService } from '../../../services/customerService';
import { AMCContractFormData, MaintenanceData, Branch, Customer } from '../../../types/amcContract.types';

interface FormErrors {
    [key: string]: string | undefined;
}

type RootState = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
};

const CreateAMCContract: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const { user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<AMCContractFormData>({
        branch_id: '',
        customer_id: '',
        contract_type: '',
        purchase_date: '',
        warranty_end_date: '',
        contract_amount: '',
        notes: '',
        is_active: true,
        maintenances: [{ scheduled_date: '', note: '', status: 'pending' }],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        loadBranches();
        loadCustomers();
    }, []);

    const loadBranches = async () => {
        try {
            const branches = await BranchService.getActiveBranches();
            setBranches(branches || []);
        } catch (error) {
            console.error('Failed to load branches:', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const customers = await CustomerService.getActiveCustomers();
            setCustomers(customers || []);
        } catch (error) {
            console.error('Failed to load customers:', error);
            setCustomers([]);
        }
    };

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.branch_id) newErrors.branch_id = 'Branch is required';
        if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
        if (!formData.contract_type.trim()) newErrors.contract_type = 'Contract type is required';
        if (!formData.purchase_date) newErrors.purchase_date = 'Purchase date is required';

        // Validate maintenances
        formData.maintenances.forEach((maintenance, index) => {
            if (!maintenance.scheduled_date) {
                newErrors[`maintenances.${index}.scheduled_date`] = 'Scheduled date is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value, type } = e.target;
            let fieldValue: any = value;
            if (type === 'checkbox') {
                fieldValue = (e.target as HTMLInputElement).checked;
            }
            setFormData((prev) => ({
                ...prev,
                [name]: fieldValue,
            }));
            if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
        },
        [errors],
    );

    const handleMaintenanceChange = useCallback(
        (index: number, field: keyof MaintenanceData, value: string) => {
            setFormData((prev) => ({
                ...prev,
                maintenances: prev.maintenances.map((maintenance, i) => (i === index ? { ...maintenance, [field]: value } : maintenance)),
            }));
            const errorKey = `maintenances.${index}.${field}`;
            if (errors[errorKey]) {
                setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
            }
        },
        [errors],
    );

    const addMaintenance = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            maintenances: [...prev.maintenances, { scheduled_date: '', note: '', status: 'pending' }],
        }));
    }, []);

    const removeMaintenance = useCallback(
        (index: number) => {
            if (formData.maintenances.length > 1) {
                setFormData((prev) => ({
                    ...prev,
                    maintenances: prev.maintenances.filter((_, i) => i !== index),
                }));
            }
        },
        [formData.maintenances.length],
    );

    const resetForm = useCallback(() => {
        setFormData({
            branch_id: '',
            customer_id: '',
            contract_type: '',
            purchase_date: '',
            warranty_end_date: '',
            contract_amount: '',
            notes: '',
            is_active: true,
            maintenances: [{ scheduled_date: '', note: '', status: 'pending' }],
        });
        setErrors({});
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateForm()) {
                showAlert({ type: 'error', title: 'Validation Error', message: 'Please fix the errors and try again' });
                return;
            }
            setIsLoading(true);
            try {
                const response = await AMCContractService.createContract(formData);
                showAlert({
                    type: 'success',
                    title: 'Contract Created',
                    message: `AMC Contract has been created successfully.`,
                    duration: 6000,
                });
                resetForm();
            } catch (error: any) {
                showAlert({
                    type: 'error',
                    title: 'Creation Failed',
                    message: error.message || 'An unexpected error occurred',
                    duration: 7000,
                });
            } finally {
                setIsLoading(false);
            }
        },
        [formData, validateForm, showAlert, resetForm],
    );

    return (
        <div>
            <AlertContainer />
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/dashboard" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>AMC Contract</span>
                    </li>
                </ul>
            </div>
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create AMC Contract</h1>
                <p className="text-gray-600 text-center">Add a new AMC contract with maintenance schedules</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-full mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contract Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="branch_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="branch_id"
                                    name="branch_id"
                                    value={formData.branch_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.branch_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name} ({branch.branch_code})
                                        </option>
                                    ))}
                                </select>
                                {errors.branch_id && <p className="text-red-500 text-xs mt-1">{errors.branch_id}</p>}
                            </div>
                            <div>
                                <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="customer_id"
                                    name="customer_id"
                                    value={formData.customer_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.customer_id ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name} {customer.email ? `(${customer.email})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
                            </div>
                            <div>
                                <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Type <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contract_type"
                                    name="contract_type"
                                    value={formData.contract_type}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.contract_type ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                    placeholder="Enter contract type"
                                />
                                {errors.contract_type && <p className="text-red-500 text-xs mt-1">{errors.contract_type}</p>}
                            </div>
                            <div>
                                <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Purchase Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="purchase_date"
                                    name="purchase_date"
                                    value={formData.purchase_date}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border ${errors.purchase_date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                />
                                {errors.purchase_date && <p className="text-red-500 text-xs mt-1">{errors.purchase_date}</p>}
                            </div>
                            <div>
                                <label htmlFor="warranty_end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Warranty End Date
                                </label>
                                <input
                                    type="date"
                                    id="warranty_end_date"
                                    name="warranty_end_date"
                                    value={formData.warranty_end_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label htmlFor="contract_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="contract_amount"
                                    name="contract_amount"
                                    value={formData.contract_amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    placeholder="Enter contract amount"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                    placeholder="Enter any additional notes"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                    Active Contract
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Maintenance Schedules</h2>
                            <button
                                type="button"
                                onClick={addMaintenance}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors"
                            >
                                Add Maintenance
                            </button>
                        </div>
                        {formData.maintenances.map((maintenance, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-medium text-gray-800">Maintenance {index + 1}</h3>
                                    {formData.maintenances.length > 1 && (
                                        <button type="button" onClick={() => removeMaintenance(index)} className="text-red-600 hover:text-red-800 transition-colors">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Scheduled Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={maintenance.scheduled_date}
                                            onChange={(e) => handleMaintenanceChange(index, 'scheduled_date', e.target.value)}
                                            className={`w-full px-3 py-2 border ${errors[`maintenances.${index}.scheduled_date`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                        />
                                        {errors[`maintenances.${index}.scheduled_date`] && <p className="text-red-500 text-xs mt-1">{errors[`maintenances.${index}.scheduled_date`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={maintenance.status}
                                            onChange={(e) => handleMaintenanceChange(index, 'status', e.target.value as 'pending' | 'completed' | 'missed')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="missed">Missed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                                        <input
                                            type="text"
                                            value={maintenance.note}
                                            onChange={(e) => handleMaintenanceChange(index, 'note', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                                            placeholder="Enter maintenance note"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-8 space-x-4">
                        <button
                            type="button"
                            className="bg-white text-gray-800 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-primary transition-colors"
                            onClick={resetForm}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Contract'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAMCContract;
