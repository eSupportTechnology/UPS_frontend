import React, { useState, useEffect } from 'react';
import technicianService from '../../../services/technicianService';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../utils/imageUrl';

interface EditTechnicianModalProps {
    isOpen: boolean;
    technicianId: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    technician_type: 'inside' | 'outside';
    employment_type: 'part_time' | 'full_time';
    specialization: string;
    password: string;
    profile_image: File | null;
}

const EditTechnicianModal: React.FC<EditTechnicianModalProps> = ({
    isOpen,
    technicianId,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [brokenImage, setBrokenImage] = useState(false);
    const [imageKey, setImageKey] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        technician_type: 'inside',
        employment_type: 'full_time',
        specialization: '',
        password: '',
        profile_image: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [originalImagePath, setOriginalImagePath] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            loadTechnician();
        }
    }, [isOpen, technicianId]);

    const loadTechnician = async () => {
        setFormLoading(true);
        try {
            const response = await technicianService.getTechnician(technicianId);
            if (response.success && response.data) {
                const tech = response.data;

                // Ensure technician_type has a valid value
                const validType = (tech.technician_type === 'inside' || tech.technician_type === 'outside')
                    ? tech.technician_type
                    : 'inside';

                setFormData({
                    name: tech.name || '',
                    email: tech.email || '',
                    phone: tech.phone || '',
                    address: tech.address || '',
                    technician_type: validType,
                    employment_type: tech.employment_type || 'full_time',
                    specialization: tech.specialization || '',
                    password: '',
                    profile_image: null,
                });

                // Store and preview image
                if (tech.profile_image) {
                    setOriginalImagePath(tech.profile_image);
                    setImagePreview(getImageUrl(tech.profile_image));
                    setBrokenImage(false);
                    setImageKey(Date.now()); // Force image reload
                } else {
                    setOriginalImagePath('');
                    setImagePreview('');
                    setBrokenImage(true);
                }
            }
        } catch (error) {
            console.error('Error loading technician:', error);
            toast.error('Failed to load technician details');
        } finally {
            setFormLoading(false);
        }
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
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image must be less than 2MB');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                toast.error('Only JPEG, PNG, and GIF images are allowed');
                return;
            }

            setFormData((prev) => ({
                ...prev,
                profile_image: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setBrokenImage(false);
                setImageKey(Date.now()); // Force image reload
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error('Name and email are required');
            return;
        }

        setLoading(true);

        try {
            const response = await technicianService.updateTechnician(technicianId, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                technician_type: formData.technician_type,
                employment_type:
                    formData.technician_type === 'inside' ? formData.employment_type : undefined,
                specialization: formData.specialization,
                password: formData.password || undefined,
                profile_image: formData.profile_image || undefined,
            });

            if (response.success) {
                toast.success(response.message || 'Technician updated successfully');
                onSuccess();
                onClose();
            } else {
                toast.error(response.message || 'Failed to update technician');
                if (response.errors) {
                    const errorMessages = Object.values(response.errors).flat() as string[];
                    errorMessages.forEach((msg) => toast.error(msg));
                }
            }
        } catch (error) {
            console.error('Error updating technician:', error);
            toast.error('An error occurred while updating the technician');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Edit Technician
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                {formLoading ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">Loading technician details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Profile Image */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                Profile Image
                            </label>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    {imagePreview ? (
                                        <div className="w-32 h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            {!brokenImage ? (
                                                <img
                                                    key={imageKey}
                                                    src={`${imagePreview}?t=${imageKey}`}
                                                    alt="Technician Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => {
                                                        console.log('Image failed to load:', imagePreview);
                                                        setBrokenImage(true);
                                                    }}
                                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-300">
                                                        {formData.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs text-center px-2">
                                                Click to upload<br />image
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                    />
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Max 2MB. JPEG, PNG, GIF
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                />
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
                                />
                            </div>

                            {/* Technician Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Type
                                </label>
                                <select
                                    name="technician_type"
                                    value={formData.technician_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                >
                                    <option value="inside">Inside (Workshop)</option>
                                    <option value="outside">Outside (Field Service)</option>
                                </select>
                            </div>

                            {/* Employment Type */}
                            {formData.technician_type === 'inside' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        Employment Type
                                    </label>
                                    <select
                                        name="employment_type"
                                        value={formData.employment_type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                    >
                                        <option value="full_time">Full Time</option>
                                        <option value="part_time">Part Time</option>
                                    </select>
                                </div>
                            )}

                            {/* Specialization */}
                            <div className={formData.technician_type === 'inside' ? '' : 'sm:col-span-2'}>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                />
                            </div>

                            {/* Address */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                />
                            </div>

                            {/* Password */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    New Password (leave blank to keep current)
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light"
                                    placeholder="Enter new password or leave blank"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 dark:text-white-light hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditTechnicianModal;
