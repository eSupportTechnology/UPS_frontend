import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAlert } from '../../../components/Alert/Alert';
import { InventoryFormData } from '../../../types/inventory.types';
import { InventoryService } from '../../../services/inventoryService';

type RootState = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role?: string;
            role_as?: number;
        } | null;
        token: string | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    };
};

interface FormErrors {
    [key: string]: string | undefined;
}

const InventoryCreate: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const { user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<InventoryFormData>({
        created_by: user?.name || '',
        product_name: '',
        brand: '',
        model: '',
        serial_number: '',
        category: '',
        description: '',
        quantity: 0,
        unit_price: 0,
        purchase_date: '',
        warranty: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.created_by) newErrors.created_by = 'Created by is required';
        if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
        else if (formData.product_name.length > 255) newErrors.product_name = 'Must not exceed 255 characters';
        if (formData.brand && formData.brand.length > 255) newErrors.brand = 'Must not exceed 255 characters';
        if (formData.model && formData.model.length > 255) newErrors.model = 'Must not exceed 255 characters';
        if (formData.serial_number && formData.serial_number.length > 255) newErrors.serial_number = 'Must not exceed 255 characters';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        else if (formData.category.length > 255) newErrors.category = 'Must not exceed 255 characters';
        if (formData.description && formData.description.length > 1000) newErrors.description = 'Description too long';
        if (formData.quantity === null || formData.quantity === undefined || isNaN(formData.quantity) || formData.quantity < 0) newErrors.quantity = 'Quantity is required and must be 0 or more';
        if (formData.unit_price === null || formData.unit_price === undefined || isNaN(formData.unit_price) || formData.unit_price < 0)
            newErrors.unit_price = 'Unit price is required and must be 0 or more';
        if (formData.purchase_date && isNaN(Date.parse(formData.purchase_date))) newErrors.purchase_date = 'Invalid date';
        if (formData.warranty && formData.warranty.length > 255) newErrors.warranty = 'Must not exceed 255 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'quantity' || name === 'unit_price' ? (value === '' ? 0 : Number(value)) : value,
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
                const response = await InventoryService.createInventory(formData);
                showAlert({
                    type: 'success',
                    title: 'Inventory Created',
                    message: `Inventory item "${response.data?.product_name || formData.product_name}" has been created.`,
                    duration: 6000,
                });
                setFormData({
                    created_by: user?.name || '',
                    product_name: '',
                    brand: '',
                    model: '',
                    serial_number: '',
                    category: '',
                    description: '',
                    quantity: 0,
                    unit_price: 0,
                    purchase_date: '',
                    warranty: '',
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
        [validateForm, formData, showAlert, user],
    );

    const handleReset = useCallback(() => {
        setFormData({
            created_by: user?.name || '',
            product_name: '',
            brand: '',
            model: '',
            serial_number: '',
            category: '',
            description: '',
            quantity: 0,
            unit_price: 0,
            purchase_date: '',
            warranty: '',
        });
        setErrors({});
    }, [user]);

    const breadcrumbItems = useMemo(
        () => (
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm">
                <li>
                    <Link to="/super-admin" className="text-primary hover:underline transition-colors">
                        Dashboard
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Inventory Create</span>
                </li>
            </ul>
        ),
        [],
    );

    const headerSection = useMemo(
        () => (
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Inventory Item</h1>
                <p className="text-gray-600">Add a new inventory item to the system.</p>
            </div>
        ),
        [],
    );

    const createdByField = useMemo(
        () => (
            <div>
                <label htmlFor="created_by" className="block text-sm font-medium text-gray-700 mb-2">
                    Created By <span className="text-red-500">*</span>
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700">{user ? `${user.name} (${user.email})` : 'No user logged in'}</div>
                <input type="hidden" name="created_by" value={formData.created_by} />
                {errors.created_by && <p className="mt-1 text-sm text-red-600">{errors.created_by}</p>}
            </div>
        ),
        [user, formData.created_by, errors.created_by],
    );

    const formFields = useMemo(
        () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createdByField}

                <div>
                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="product_name"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.product_name ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter product name"
                    />
                    {errors.product_name && <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>}
                </div>

                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter brand"
                    />
                    {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                </div>

                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                    </label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter model"
                    />
                    {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                </div>

                <div>
                    <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">
                        Serial Number
                    </label>
                    <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.serial_number ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter serial number"
                    />
                    {errors.serial_number && <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>}
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter category"
                    />
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                        min={0}
                        placeholder="Enter quantity"
                    />
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                </div>

                <div>
                    <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="unit_price"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.unit_price ? 'border-red-500' : 'border-gray-300'}`}
                        min={0}
                        step="0.01"
                        placeholder="Enter unit price"
                    />
                    {errors.unit_price && <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>}
                </div>

                <div>
                    <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Date
                    </label>
                    <input
                        type="date"
                        id="purchase_date"
                        name="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.purchase_date ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.purchase_date && <p className="mt-1 text-sm text-red-600">{errors.purchase_date}</p>}
                </div>

                <div>
                    <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-2">
                        Warranty
                    </label>
                    <input
                        type="text"
                        id="warranty"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.warranty ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={255}
                        placeholder="Enter warranty info"
                    />
                    {errors.warranty && <p className="mt-1 text-sm text-red-600">{errors.warranty}</p>}
                </div>
            </div>
        ),
        [createdByField, formData, handleInputChange, errors],
    );

    const descriptionField = useMemo(
        () => (
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter description (optional)"
                    maxLength={1000}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
        ),
        [formData.description, handleInputChange, errors.description],
    );

    const actionButtons = useMemo(
        () => (
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
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    <span>{isLoading ? 'Creating...' : 'Create Inventory'}</span>
                </button>
            </div>
        ),
        [handleReset, isLoading, handleSubmit],
    );

    return (
        <div>
            <AlertContainer />

            <div className="mb-6">{breadcrumbItems}</div>

            {headerSection}

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields}
                    {descriptionField}
                    {actionButtons}
                </form>
            </div>
        </div>
    );
};

export default InventoryCreate;
