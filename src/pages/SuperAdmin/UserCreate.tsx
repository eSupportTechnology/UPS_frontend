import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreateUserFormData, FormErrors, USER_ROLES, ROLE_LABELS, UserRole } from '../../types/user.types';
import { UserService } from '../../services/userService';
import { useAlert } from '../../components/Alert/Alert';

const UserCreate: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [formData, setFormData] = useState<CreateUserFormData>({
        name: '',
        email: '',
        role_as: USER_ROLES.CUSTOMER,
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length > 255) {
            newErrors.name = 'Name must not exceed 255 characters';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!UserService.isValidEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        } else if (formData.email.length > 255) {
            newErrors.email = 'Email must not exceed 255 characters';
        }
        if (!Object.values(USER_ROLES).includes(formData.role_as)) {
            newErrors.role_as = 'Please select a valid role';
        }
        if (formData.phone && formData.phone.length > 20) {
            newErrors.phone = 'Phone number must not exceed 20 characters';
        } else if (formData.phone && !UserService.isValidPhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (formData.address && formData.address.length > 255) {
            newErrors.address = 'Address must not exceed 255 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'role_as' ? (parseInt(value) as UserRole) : value,
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showAlert({
                type: 'error',
                title: 'Validation Error',
                message: 'Please fix the errors and try again',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await UserService.createUser(formData);

            showAlert({
                type: 'success',
                title: 'User Created Successfully',
                message: `User ${response.data.name} has been created and credentials sent via email`,
                duration: 6000,
            });

            setFormData({
                name: '',
                email: '',
                role_as: USER_ROLES.CUSTOMER,
                phone: '',
                address: '',
            });
            setErrors({});
        } catch (error: any) {
            console.error('User creation error:', error);

            showAlert({
                type: 'error',
                title: 'User Creation Failed',
                message: error.message || 'An unexpected error occurred',
                duration: 7000,
            });

            if (error.errors) {
                setErrors(error.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            role_as: USER_ROLES.CUSTOMER,
            phone: '',
            address: '',
        });
        setErrors({});
    };

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
                        <span>User Create</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
                <p className="text-gray-600">Create a new user account. A random password will be generated and sent to the user's email.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`
                  w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}
                `}
                                placeholder="Enter full name"
                                maxLength={255}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`
                  w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}
                `}
                                placeholder="Enter email address"
                                maxLength={255}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="role_as" className="block text-sm font-medium text-gray-700 mb-2">
                                User Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role_as"
                                name="role_as"
                                value={formData.role_as}
                                onChange={handleInputChange}
                                className={`
                  w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.role_as ? 'border-red-500' : 'border-gray-300'}
                `}
                            >
                                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.role_as && <p className="mt-1 text-sm text-red-600">{errors.role_as}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`
                  w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                  ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                `}
                                placeholder="Enter phone number"
                                maxLength={20}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                            className={`
                w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary
                ${errors.address ? 'border-red-500' : 'border-gray-300'}
              `}
                            placeholder="Enter address"
                            maxLength={255}
                        />
                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isLoading}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                        >
                            {isLoading && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            )}
                            <span>{isLoading ? 'Creating User...' : 'Create User'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreate;
