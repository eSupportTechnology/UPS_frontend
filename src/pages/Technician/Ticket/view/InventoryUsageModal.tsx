import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import IconCaretDown from '../../../../components/Icon/IconCaretDown';
import IconCircleCheck from '../../../../components/Icon/IconCircleCheck';
import IconX from '../../../../components/Icon/IconX';
import { InventoryService } from '../../../../services/inventoryService';
import { RawInventoryItem, InventoryUsageItem } from '../../../../types/inventory.types';
import { useAlert } from '../../../../components/Alert/Alert';

interface InventoryUsageModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (usages: InventoryUsageItem[], notes: string) => Promise<void>;
    ticketId: string;
    loading?: boolean;
}

const InventoryUsageModal = ({ open, onClose, onSubmit, ticketId, loading = false }: InventoryUsageModalProps) => {
    const { showAlert } = useAlert();
    const [inventories, setInventories] = useState<RawInventoryItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ inventory: RawInventoryItem; quantity: number }[]>([]);
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingInventories, setLoadingInventories] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        if (open) {
            loadInventories();
        }
    }, [open]);

    const loadInventories = async () => {
        try {
            setLoadingInventories(true);
            const data = await InventoryService.getAllInventoriesRaw();
            setInventories(data);
        } catch (error: any) {
            console.error('Error loading inventories:', error);
            showAlert({
                type: 'error',
                title: 'Error',
                message: error.message || 'Failed to load inventories',
            });
        } finally {
            setLoadingInventories(false);
        }
    };

    const addInventoryItem = () => {
        if (filteredInventories.length === 0) {
            return;
        }

        const availableInventories = filteredInventories.filter(
            inv => !selectedItems.find(item => item.inventory.id === inv.id)
        );

        if (availableInventories.length === 0) {
            showAlert({
                type: 'warning',
                title: 'No More Items',
                message: 'All available inventory items have been selected',
            });
            return;
        }

        const newItem = { inventory: availableInventories[0], quantity: 1 };
        setSelectedItems([...selectedItems, newItem]);
    };

    const addSpecificInventoryItem = (inventory: RawInventoryItem) => {
        const isAlreadySelected = selectedItems.find(item => item.inventory.id === inventory.id);
        if (isAlreadySelected) return;

        const newItem = { inventory, quantity: 1 };
        setSelectedItems([...selectedItems, newItem]);
    };

    const removeInventoryItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const updateInventoryItem = (index: number, field: 'inventory' | 'quantity', value: any) => {
        const updated = [...selectedItems];
        if (field === 'inventory') {
            updated[index].inventory = value;
        } else if (field === 'quantity') {
            updated[index].quantity = Math.max(1, Math.min(value, updated[index].inventory.quantity));
        }
        setSelectedItems(updated);
    };

    const getAvailableInventories = (currentIndex: number) => {
        return filteredInventories.filter(inv =>
            !selectedItems.find((item, idx) => idx !== currentIndex && item.inventory.id === inv.id)
        );
    };

    // Filter and search inventories
    const filteredInventories = inventories.filter(inventory => {
        const matchesSearch = !searchTerm ||
            inventory.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inventory.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inventory.brand && inventory.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inventory.model && inventory.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inventory.serial_number && inventory.serial_number.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !categoryFilter || inventory.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Get unique categories for filter
    const uniqueCategories = [...new Set(inventories.map(inv => inv.category))].sort();

    const handleSubmit = async () => {
        if (inventories.length === 0) {
            try {
                setSubmitting(true);
                await onSubmit([], notes);
                handleClose();
            } catch (error) {
            } finally {
                setSubmitting(false);
            }
            return;
        }

        if (selectedItems.length === 0) {
            showAlert({
                type: 'warning',
                title: 'No Items Selected',
                message: 'Please select at least one inventory item or add a note explaining why no inventory is needed',
            });
            return;
        }

        const usages: InventoryUsageItem[] = selectedItems.map(item => ({
            inventory_id: item.inventory.id,
            quantity: item.quantity,
        }));

        try {
            setSubmitting(true);
            await onSubmit(usages, notes);
            handleClose();
        } catch (error) {
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedItems([]);
        setNotes('');
        setSearchTerm('');
        setCategoryFilter('');
        onClose();
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Select Inventory Items for Ticket
                                </Dialog.Title>

                                {loadingInventories ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        <span className="ml-3 text-gray-600">Loading inventories...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-4">

                                        {/* Search and Filter Section */}
                                        {inventories.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Search
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="search"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder="Search by product, category, serial number..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Category
                                                        </label>
                                                        <select
                                                            id="category"
                                                            value={categoryFilter}
                                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="">All Categories</option>
                                                            {uniqueCategories.map((category) => (
                                                                <option key={category} value={category}>
                                                                    {category}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSearchTerm('');
                                                                setCategoryFilter('');
                                                            }}
                                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        >
                                                            Clear Filters
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                                                    <span>Showing {filteredInventories.length} of {inventories.length} items</span>
                                                    <span className="text-blue-600">Available for selection</span>
                                                </div>
                                            </div>
                                        )}

                                        {inventories.length === 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-yellow-800">
                                                            No Inventory Items Available
                                                        </h3>
                                                        <div className="mt-2 text-sm text-yellow-700">
                                                            <p>There are currently no inventory items in the system. Please contact your administrator to add inventory items before proceeding with ticket acceptance.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Available Inventory Display - List Layout */}
                                        {inventories.length > 0 && (searchTerm || categoryFilter) && (
                                            <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
                                                <div className="px-6 py-4 border-b border-gray-200">
                                                    <h4 className="text-lg font-semibold text-gray-900">Available Inventory</h4>
                                                    <p className="text-sm text-gray-600 mt-1">Add items to your selection using the controls on the right</p>
                                                </div>
                                                <div className="divide-y divide-gray-200" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                    {filteredInventories.map((inventory) => {
                                                        const isSelected = selectedItems.some(item => item.inventory.id === inventory.id);
                                                        const selectedItem = selectedItems.find(item => item.inventory.id === inventory.id);

                                                        return (
                                                            <div key={inventory.id} className="px-6 py-4 hover:bg-gray-50">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="flex-1">
                                                                                <h5 className="text-sm font-medium text-gray-900 truncate">
                                                                                    {inventory.product_name}
                                                                                </h5>
                                                                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                                                                    <span>Category: {inventory.category}</span>
                                                                                    {inventory.brand && <span>Brand: {inventory.brand}</span>}
                                                                                    {inventory.model && <span>Model: {inventory.model}</span>}
                                                                                    {inventory.serial_number && <span>SN: {inventory.serial_number}</span>}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-2">
                                                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                                    inventory.quantity > 10
                                                                                        ? 'bg-green-100 text-green-800'
                                                                                        : inventory.quantity > 5
                                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                                        : 'bg-red-100 text-red-800'
                                                                                }`}>
                                                                                    Stock: {inventory.quantity}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center space-x-3 ml-4">
                                                                        {isSelected ? (
                                                                            <div className="flex items-center text-blue-600 text-sm">
                                                                                <IconCircleCheck className="h-4 w-4 mr-1" />
                                                                                Added
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => addSpecificInventoryItem(inventory)}
                                                                                className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                            >
                                                                                Add to Selection
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Selected Items Section */}
                                        {selectedItems.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
                                                <div className="px-6 py-4 border-b border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-lg font-semibold text-gray-900">Selected Items ({selectedItems.length})</h4>
                                                        <button
                                                            onClick={() => setSelectedItems([])}
                                                            className="text-sm text-red-600 hover:text-red-800 underline"
                                                        >
                                                            Clear All
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="overflow-x-auto" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50 sticky top-0">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {selectedItems.map((item, index) => (
                                                                <tr key={index} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm font-medium text-gray-900">{item.inventory.product_name}</div>
                                                                        {(item.inventory.brand || item.inventory.model) && (
                                                                            <div className="text-xs text-gray-500">
                                                                                {item.inventory.brand && `${item.inventory.brand} `}
                                                                                {item.inventory.model && item.inventory.model}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                        {item.inventory.category}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {item.inventory.serial_number || '-'}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center space-x-2">
                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                max={item.inventory.quantity}
                                                                                value={item.quantity}
                                                                                onChange={(e) => updateInventoryItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                            />
                                                                            <span className="text-xs text-gray-500">/ {item.inventory.quantity}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInventoryItem(index)}
                                                                            className="px-3 py-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                                                            title="Remove item"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Notes Section Below Selected Items Table */}
                                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                                    <label htmlFor="usage-notes" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Notes (Optional)
                                                    </label>
                                                    <textarea
                                                        id="usage-notes"
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                        placeholder="Add notes for all selected items..."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {selectedItems.length === 0 && inventories.length > 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                No items selected. Click "Add Item" to start selecting inventory.
                                            </div>
                                        )}

                                        {inventories.length > 0 && !searchTerm && !categoryFilter && selectedItems.length === 0 && (
                                            <div className="text-center py-12 text-gray-500">
                                                <div className="mb-4">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Select inventory items for the ticket</h3>
                                                <p className="text-gray-600 mb-4">Use the search and filter options above to find inventory items</p>
                                                <p className="text-sm text-blue-600">Start typing or select filters to browse available inventory</p>
                                            </div>
                                        )}

                                        {inventories.length > 0 && (searchTerm || categoryFilter) && filteredInventories.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                <div className="mb-2">No inventory items match your search criteria.</div>
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm('');
                                                        setCategoryFilter('');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    Clear filters to see all items
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                )}

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={submitting || loading}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting || loading || loadingInventories || (inventories.length > 0 && selectedItems.length === 0)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting || loading ? 'Processing...' :
                                         inventories.length === 0 ? 'Accept Ticket (No Inventory)' :
                                         'Accept Ticket and Order Items'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default InventoryUsageModal;
