import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import IconCaretDown from '../Icon/IconCaretDown';
import IconCircleCheck from '../Icon/IconCircleCheck';
import IconX from '../Icon/IconX';
import { InventoryService } from '../../services/inventoryService';
import { RawInventoryItem, InventoryUsageItem } from '../../types/inventory.types';

interface InventoryUsageModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (usages: InventoryUsageItem[], notes: string) => Promise<void>;
    jobId: string;
    loading?: boolean;
}

const InventoryUsageModal = ({ open, onClose, onSubmit, jobId, loading = false }: InventoryUsageModalProps) => {
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
            console.error('Failed to load inventories:', error);
        } finally {
            setLoadingInventories(false);
        }
    };

    const addInventoryItem = () => {
        if (filteredInventories.length === 0) return;

        const availableInventories = filteredInventories.filter(
            inv => !selectedItems.find(item => item.inventory.id === inv.id)
        );

        if (availableInventories.length === 0) {
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
            updated[index].quantity = Math.max(1, value);
        }
        setSelectedItems(updated);
    };

    const getAvailableInventories = (currentIndex: number) => {
        return filteredInventories.filter(inv =>
            !selectedItems.find((item, idx) => idx !== currentIndex && item.inventory.id === inv.id)
        );
    };

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

    const uniqueCategories = [...new Set(inventories.map(inv => inv.category))].sort();

    const handleSubmit = async () => {
        const usages: InventoryUsageItem[] = selectedItems.map(item => ({
            inventory_id: item.inventory.id,
            quantity: item.quantity,
        }));

        try {
            setSubmitting(true);
            await onSubmit(usages, notes);
            handleClose();
        } catch (error) {
            console.error('Failed to submit inventory usage:', error);
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
        <>
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
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                    Record Materials Used for Job {jobId}
                                </Dialog.Title>

                                {loadingInventories ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading inventory...</span>
                                    </div>
                                ) : (
                                    <div className="space-y-4">

                                        {/* Search and Filter Section */}
                                        {inventories.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-600">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Search
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="search"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder="Search by product, category, serial..."
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Category
                                                        </label>
                                                        <select
                                                            id="category"
                                                            value={categoryFilter}
                                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
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
                                                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-colors"
                                                        >
                                                            Clear Filters
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {inventories.length === 0 && (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                                                <p className="text-yellow-800 dark:text-yellow-200">No inventory items available</p>
                                            </div>
                                        )}

                                        {/* Available Inventory Display */}
                                        {inventories.length > 0 && (searchTerm || categoryFilter) && (
                                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 mb-6">
                                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Available Materials</h4>
                                                </div>
                                                <div className="divide-y divide-gray-200 dark:divide-gray-600" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                    {filteredInventories.map((inventory) => {
                                                        const isSelected = selectedItems.some(item => item.inventory.id === inventory.id);

                                                        return (
                                                            <div key={inventory.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {inventory.product_name}
                                                                        </h5>
                                                                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                            <span>Category: {inventory.category}</span>
                                                                            {inventory.brand && <span>Brand: {inventory.brand}</span>}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center space-x-3 ml-4">
                                                                        {isSelected ? (
                                                                            <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                                                                                <IconCircleCheck className="h-4 w-4 mr-1" />
                                                                                Added
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => addSpecificInventoryItem(inventory)}
                                                                                className="px-3 py-1 text-xs text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-600 rounded hover:bg-purple-50 dark:hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                            >
                                                                                Add
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
                                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 mb-6">
                                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Materials to Use ({selectedItems.length})</h4>
                                                        <button
                                                            onClick={() => setSelectedItems([])}
                                                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
                                                        >
                                                            Clear All
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="overflow-x-auto" style={{maxHeight: '250px', overflowY: 'auto'}}>
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                                        <thead className="bg-gray-50 dark:bg-gray-600 sticky top-0">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Product</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                                            {selectedItems.map((item, index) => (
                                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.inventory.product_name}</div>
                                                                        {item.inventory.brand && (
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {item.inventory.brand}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                                        {item.inventory.category}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            value={item.quantity}
                                                                            onChange={(e) => updateInventoryItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                                            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeInventoryItem(index)}
                                                                            className="px-3 py-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Notes Section */}
                                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600">
                                                    <label htmlFor="usage-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Notes (Optional)
                                                    </label>
                                                    <textarea
                                                        id="usage-notes"
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                                        placeholder="Add notes about materials used..."
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {selectedItems.length === 0 && inventories.length > 0 && (
                                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                Search and select materials from above to record their usage.
                                            </div>
                                        )}

                                    </div>
                                )}

                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={submitting || loading}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting || loading || loadingInventories}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting || loading ? 'Processing...' : 'Record Materials & Complete Job'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    );
};

export default InventoryUsageModal;
