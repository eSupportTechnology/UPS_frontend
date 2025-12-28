import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import insideJobService from '../../../services/insideJobService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';

interface FormData {
    customer_name: string;
    customer_phone: string;
    title: string;
    description: string;
    ups_serial_number: string;
    ups_model: string;
    ups_brand: string;
    priority: string;
}

const CreateInsideJob: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        customer_name: '',
        customer_phone: '',
        title: '',
        description: '',
        ups_serial_number: '',
        ups_model: '',
        ups_brand: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(setPageTitle('Create Inside Job'));
    }, [dispatch]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_name.trim()) newErrors.customer_name = 'Customer name is required';
        if (!formData.customer_phone.trim()) newErrors.customer_phone = 'Customer phone is required';
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.ups_serial_number.trim()) newErrors.ups_serial_number = 'UPS Serial Number is required';
        if (!formData.ups_model.trim()) newErrors.ups_model = 'UPS Model is required';
        if (!formData.ups_brand.trim()) newErrors.ups_brand = 'UPS Brand is required';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            const response = await insideJobService.createInsideJobDirect({
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                title: formData.title,
                description: formData.description,
                ups_serial_number: formData.ups_serial_number,
                ups_model: formData.ups_model,
                ups_brand: formData.ups_brand,
                priority: formData.priority,
            });

            if (response.success) {
                toast.success('Inside job created successfully');
                navigate('/super-admin/inside-jobs');
            } else {
                toast.error(response.message || 'Failed to create inside job');
                if (response.errors) {
                    const errorMessages = Object.values(response.errors).flat() as string[];
                    errorMessages.forEach(msg => toast.error(msg));
                }
            }
        } catch (error) {
            console.error('Error creating inside job:', error);
            toast.error('An error occurred while creating the job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white-light">Create Inside Job</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new workshop repair job</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleInputChange}
                            placeholder="Enter customer name"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.customer_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                    </div>

                    {/* Customer Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Customer Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleInputChange}
                            placeholder="Enter customer phone number"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.customer_phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                    </div>

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

                    {/* UPS Brand */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            UPS Brand <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ups_brand"
                            value={formData.ups_brand}
                            onChange={handleInputChange}
                            placeholder="e.g., APC, Numeric, EMERSON"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.ups_brand ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.ups_brand && <p className="text-red-500 text-xs mt-1">{errors.ups_brand}</p>}
                    </div>

                    {/* UPS Model */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            UPS Model <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ups_model"
                            value={formData.ups_model}
                            onChange={handleInputChange}
                            placeholder="e.g., Smart-UPS 1500"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.ups_model ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.ups_model && <p className="text-red-500 text-xs mt-1">{errors.ups_model}</p>}
                    </div>

                    {/* UPS Serial Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            UPS Serial Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="ups_serial_number"
                            value={formData.ups_serial_number}
                            onChange={handleInputChange}
                            placeholder="e.g., AS1234567890"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.ups_serial_number ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.ups_serial_number && <p className="text-red-500 text-xs mt-1">{errors.ups_serial_number}</p>}
                    </div>

                </div>

                {/* Title */}
                <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Workshop Repair - Battery Replacement"
                        className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
                        placeholder="Describe the repair work needed, issues found, etc..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                            errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/super-admin/inside-jobs')}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition"
                    >
                        {loading ? 'Creating...' : 'Create Inside Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInsideJob;
