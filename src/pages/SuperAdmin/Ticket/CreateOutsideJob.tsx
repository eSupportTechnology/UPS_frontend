import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ticketService from '../../../services/ticketService';
import technicianService from '../../../services/technicianService';
import { CustomerService } from '../../../services/customerService';
import { setPageTitle } from '../../../store/themeConfigSlice';
import toast from 'react-hot-toast';

interface FormData {
    customer_id: string;
    title: string;
    description: string;
    priority: string;
    district: string;
    city: string;
    gramsewa_division: string;
    assigned_to: string;
    photos: File[];
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
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
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [formData, setFormData] = useState<FormData>({
        customer_id: '',
        title: '',
        description: '',
        priority: 'medium',
        district: '',
        city: '',
        gramsewa_division: '',
        assigned_to: '',
        photos: [],
    });
    const [photoPreview, setPhotoPreview] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(setPageTitle('Create Outside Job'));
        loadCustomersAndTechnicians();
    }, [dispatch]);

    const loadCustomersAndTechnicians = async () => {
        try {
            const [customersResponse, techniciansResponse] = await Promise.all([
                CustomerService.getActiveCustomers(),
                technicianService.getTechniciansByType('outside'), // Only outside technicians
            ]);
            setCustomers(customersResponse || []);

            // Extract technician data
            const techList = techniciansResponse.success
                ? (Array.isArray(techniciansResponse.data) ? techniciansResponse.data : techniciansResponse.data?.data || [])
                : [];
            setTechnicians(techList);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load customers or technicians');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';

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
            const response = await ticketService.createTicket({
                customer_id: parseInt(formData.customer_id),
                title: formData.title,
                description: formData.description,
                district: formData.district,
                city: formData.city,
                gn_division: formData.gramsewa_division,
                photos: formData.photos,
            });

            if (response.success) {
                toast.success('Outside job created successfully');
                navigate('/super-admin/all-tickets');
            } else {
                toast.error(response.message || 'Failed to create outside job');
            }
        } catch (error) {
            console.error('Error creating outside job:', error);
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Customer Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Customer <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.customer_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                </option>
                            ))}
                        </select>
                        {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
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

                    {/* District */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            District <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="e.g., Colombo"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.district ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g., Colombo 3"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white-light ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* Gramsewa Division */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Gramsewa Division
                        </label>
                        <input
                            type="text"
                            name="gramsewa_division"
                            value={formData.gramsewa_division}
                            onChange={handleInputChange}
                            placeholder="e.g., Colombo Central"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                        />
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
        </div>
    );
};

export default CreateOutsideJob;
