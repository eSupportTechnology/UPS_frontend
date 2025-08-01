import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAlert } from '../../../components/Alert/Alert';
import { BranchFormData } from '../../../types/branch.types';
import { BranchService } from '../../../services/branchService';

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

const CreateBranch: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const { user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<BranchFormData>({
        name: '',
        branch_code: '',
        type: 'sub',
        country: '',
        state: '',
        city: '',
        address_line1: '',
        address_line2: '',
        postal_code: '',
        contact_person: '',
        contact_number: '',
        email: '',
        operating_hours: '',
        is_active: true,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Branch name is required';
        if (!formData.branch_code.trim()) newErrors.branch_code = 'Branch code is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
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

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!validateForm()) {
                showAlert({ type: 'error', title: 'Validation Error', message: 'Please fix the errors and try again' });
                return;
            }
            setIsLoading(true);
            try {
                const response = await BranchService.createBranch(formData);
                showAlert({
                    type: 'success',
                    title: 'Branch Created',
                    message: `Branch "${response.data?.name || formData.name}" has been created.`,
                    duration: 6000,
                });
                setFormData({
                    name: '',
                    branch_code: '',
                    type: 'sub',
                    country: '',
                    state: '',
                    city: '',
                    address_line1: '',
                    address_line2: '',
                    postal_code: '',
                    contact_person: '',
                    contact_number: '',
                    email: '',
                    operating_hours: '',
                    is_active: true,
                });
                setErrors({});
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
        [formData, validateForm, showAlert],
    );

    return (
        <div>
            <AlertContainer />
            <div className="mb-6">
                <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                    <li>
                        <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                        <span>Branch</span>
                    </li>
                </ul>
            </div>
            <div className="mb-8 flex flex-col items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Branch</h1>
                <p className="text-gray-600 text-center">Add a new branch to the system</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-w-full mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                placeholder="Enter branch name"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="branch_code" className="block text-sm font-medium text-gray-700 mb-2">
                                Branch Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="branch_code"
                                name="branch_code"
                                value={formData.branch_code}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.branch_code ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                                placeholder="Enter branch code"
                            />
                            {errors.branch_code && <p className="text-red-500 text-xs mt-1">{errors.branch_code}</p>}
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            >
                                <option value="sub">Sub</option>
                                <option value="main">Main</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                id="address_line1"
                                name="address_line1"
                                value={formData.address_line1 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                id="address_line2"
                                name="address_line2"
                                value={formData.address_line2 || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Person
                            </label>
                            <input
                                type="text"
                                id="contact_person"
                                name="contact_person"
                                value={formData.contact_person || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                id="contact_number"
                                name="contact_number"
                                value={formData.contact_number || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-primary focus:border-primary`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="operating_hours" className="block text-sm font-medium text-gray-700 mb-2">
                                Operating Hours
                            </label>
                            <input
                                type="text"
                                id="operating_hours"
                                name="operating_hours"
                                value={formData.operating_hours || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8 space-x-4">
                        <button
                            type="button"
                            className="bg-white text-gray-800 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-primary transition-colors"
                            onClick={() =>
                                setFormData({
                                    name: '',
                                    branch_code: '',
                                    type: 'sub',
                                    country: '',
                                    state: '',
                                    city: '',
                                    address_line1: '',
                                    address_line2: '',
                                    postal_code: '',
                                    contact_person: '',
                                    contact_number: '',
                                    email: '',
                                    operating_hours: '',
                                    is_active: true,
                                })
                            }
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Creating...' : 'Create Branch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBranch;
