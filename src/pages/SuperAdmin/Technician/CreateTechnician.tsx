import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import technicianService from '../../../services/technicianService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    technician_type: 'inside' | 'outside';
    employment_type: 'part_time' | 'full_time';
    specialization: string;
    profile_image: File | null;
}

const CreateTechnician: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        technician_type: 'inside',
        employment_type: 'full_time',
        specialization: '',
        profile_image: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    React.useEffect(() => {
        dispatch(setPageTitle('Create Technician'));
    }, [dispatch]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Invalid email format';
        if (!formData.technician_type) newErrors.technician_type = 'Technician type is required';
        if (formData.technician_type === 'inside' && !formData.employment_type)
            newErrors.employment_type = 'Employment type is required for inside technicians';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image must be less than 2MB');
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                toast.error('Only JPEG, PNG, and GIF images are allowed');
                return;
            }

            setFormData((prev) => ({
                ...prev,
                profile_image: file,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const response = await technicianService.createTechnician({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                technician_type: formData.technician_type,
                employment_type: formData.technician_type === 'inside' ? formData.employment_type : undefined,
                specialization: formData.specialization,
                profile_image: formData.profile_image || undefined,
            });

            if (response.success) {
                toast.success(response.message || 'Technician created successfully');
                if (response.data?.temporary_password) {
                    toast.success(`Temporary password: ${response.data.temporary_password}`, {
                        duration: 10000,
                    });
                }
                navigate('/super-admin/all-technicians');
            } else {
                toast.error(response.message || 'Failed to create technician');
                if (response.errors) {
                    const errorMessages = Object.values(response.errors).flat() as string[];
                    errorMessages.forEach((msg) => toast.error(msg));
                }
            }
        } catch (error) {
            console.error('Error creating technician:', error);
            toast.error('An error occurred while creating the technician');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Create Technician</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Add a new technician to the system</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-lg shadow-sm p-6">
                {/* Profile Image Upload */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Profile Image
                    </label>
                    <div className="flex gap-6">
                        {/* Image Preview */}
                        <div className="flex-shrink-0">
                            {imagePreview ? (
                                <div className="w-32 h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm text-center px-2">Upload Image</span>
                                </div>
                            )}
                        </div>

                        {/* Upload Input */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Max file size: 2MB. Formats: JPEG, PNG, GIF
                            </p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., John Doe"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g., john@example.com"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="e.g., +1234567890"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g., 123 Main Street"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
                    </div>

                    {/* Technician Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Technician Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="technician_type"
                            value={formData.technician_type}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.technician_type ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="inside">Inside (Workshop)</option>
                            <option value="outside">Outside (Field Service)</option>
                        </select>
                        {errors.technician_type && (
                            <p className="text-red-500 text-xs mt-1">{errors.technician_type}</p>
                        )}
                    </div>

                    {/* Employment Type (only for inside technicians) */}
                    {formData.technician_type === 'inside' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Employment Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                    errors.employment_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                            </select>
                            {errors.employment_type && (
                                <p className="text-red-500 text-xs mt-1">{errors.employment_type}</p>
                            )}
                        </div>
                    )}

                    {/* Specialization */}
                    <div className={formData.technician_type === 'inside' ? '' : 'lg:col-span-2'}>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Specialization
                        </label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            placeholder="e.g., Battery Replacement, UPS Repair"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/super-admin/all-technicians')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition"
                    >
                        {loading ? 'Creating...' : 'Create Technician'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTechnician;
