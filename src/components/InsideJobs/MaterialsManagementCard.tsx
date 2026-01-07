import { useState, useEffect } from 'react';
import { InventoryService } from '../../services/inventoryService';
import insideJobService from '../../services/insideJobService';
import { RawInventoryItem } from '../../types/inventory.types';
import IconX from '../Icon/IconX';
import IconTrash from '../Icon/IconTrash';
import toast from 'react-hot-toast';

interface PlannedMaterial {
    id: string;
    ticket_id: string;
    inventory_id: string;
    product_name: string;
    brand: string | null;
    category: string | null;
    quantity: number;
}

interface MaterialsManagementCardProps {
    jobId: string;
    jobNumber: string;
    onClose: () => void;
    onSave: (materials: PlannedMaterial[]) => void;
}

const MaterialsManagementCard = ({ jobId, jobNumber, onClose, onSave }: MaterialsManagementCardProps) => {
    const [inventories, setInventories] = useState<RawInventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [savedMaterials, setSavedMaterials] = useState<PlannedMaterial[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [addingId, setAddingId] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        loadInventories();
        loadSavedMaterials();
    }, []);

    const loadInventories = async () => {
        try {
            setLoading(true);
            const data = await InventoryService.getAllInventoriesRaw();
            setInventories(data);
        } catch (error: any) {
            toast.error('Failed to load inventory items');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedMaterials = async () => {
        try {
            const response = await insideJobService.getPlannedMaterials(jobId);
            if (response.success) {
                setSavedMaterials(response.data || []);
            }
        } catch (error: any) {
            console.error('Failed to load saved materials:', error);
        }
    };

    const filteredInventories = inventories.filter(inventory => {
        const matchesSearch = !searchTerm ||
            inventory.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inventory.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inventory.brand && inventory.brand.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !categoryFilter || inventory.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    const uniqueCategories = [...new Set(inventories.map(inv => inv.category))].sort();

    const addMaterial = async (material: RawInventoryItem) => {
        setAddingId(material.id);
        try {
            const response = await insideJobService.addPlannedMaterial({
                ticket_id: jobId,
                inventory_id: material.id,
                product_name: material.product_name,
                brand: material.brand,
                category: material.category,
                quantity: 1,
            });

            if (response.success) {
                setSavedMaterials(response.data || []);
                // Reload inventories to get updated quantities
                await loadInventories();
                toast.success(`${material.product_name} added`);
            } else {
                toast.error(response.message || 'Failed to add material');
            }
        } catch (error: any) {
            toast.error('Failed to add material');
            console.error(error);
        } finally {
            setAddingId(null);
        }
    };

    const removeMaterial = async (material: PlannedMaterial) => {
        setRemovingId(material.id);
        try {
            const response = await insideJobService.removePlannedMaterial(material.id);

            if (response.success) {
                setSavedMaterials(response.data || []);
                // Reload inventories to get updated quantities
                await loadInventories();
                toast.success('Material removed');
            } else {
                toast.error(response.message || 'Failed to remove material');
            }
        } catch (error: any) {
            toast.error('Failed to remove material');
            console.error(error);
        } finally {
            setRemovingId(null);
        }
    };

    const updateQuantity = async (material: PlannedMaterial, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await insideJobService.updateMaterialQuantity(material.id, newQuantity);

            if (response.success) {
                setSavedMaterials(response.data || []);
                await loadInventories();
            } else {
                toast.error(response.message || 'Failed to update quantity');
            }
        } catch (error: any) {
            toast.error('Failed to update quantity');
            console.error(error);
        }
    };

    const getStockColor = (quantity: number) => {
        if (quantity > 10) return 'bg-green-100 text-green-800';
        if (quantity > 5) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getStockStatus = (quantity: number) => {
        if (quantity > 10) return 'Sufficient';
        if (quantity > 5) return 'Low Stock';
        return 'Critical';
    };

    const isAlreadyAdded = (inventoryId: string) => {
        return savedMaterials.some(m => m.inventory_id === inventoryId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center rounded-t-lg">
                        <div>
                            <h2 className="text-2xl font-bold">Materials Management</h2>
                            <p className="text-blue-100 text-sm mt-1">Job {jobNumber} - Add or remove materials</p>
                        </div>
                        <button
                            onClick={() => {
                                onSave(savedMaterials);
                                onClose();
                            }}
                            className="p-2 hover:bg-blue-800 rounded-full transition"
                        >
                            <IconX className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Search & Filter */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Search Materials
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by name, brand..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">All Categories</option>
                                        {uniqueCategories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setCategoryFilter('');
                                        }}
                                        className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Available Materials */}
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Available Materials ({filteredInventories.length})
                                </h3>
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading materials...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                                        {filteredInventories.map((material) => {
                                            const alreadyAdded = isAlreadyAdded(material.id);
                                            const isAdding = addingId === material.id;

                                            return (
                                                <div
                                                    key={material.id}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        alreadyAdded
                                                            ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                                                    }`}
                                                >
                                                    {/* Header with Add Button */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                {material.product_name}
                                                            </p>
                                                            {material.brand && (
                                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {material.brand}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            disabled={isAdding || material.quantity < 1}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                addMaterial(material);
                                                            }}
                                                            className={`ml-2 px-2 py-1 text-xs text-white rounded whitespace-nowrap transition z-10 relative ${
                                                                isAdding || material.quantity < 1
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                            }`}
                                                        >
                                                            {isAdding ? 'Adding...' : '+ Add'}
                                                        </button>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="space-y-2 text-xs">
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            <strong>Category:</strong> {material.category}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                <strong>Stock:</strong> {material.quantity} units
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStockColor(material.quantity)}`}>
                                                                {getStockStatus(material.quantity)}
                                                            </span>
                                                        </div>
                                                        {alreadyAdded && (
                                                            <p className="text-green-600 dark:text-green-400 font-semibold">
                                                                Already added to this job
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Added Materials */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-fit sticky top-20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Added Materials
                                    </h4>
                                    <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                        {savedMaterials.length}
                                    </span>
                                </div>

                                {savedMaterials.length > 0 ? (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {savedMaterials.map((item) => {
                                            const isRemoving = removingId === item.id;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                                {item.product_name}
                                                            </p>
                                                            {item.brand && (
                                                                <p className="text-xs text-gray-500">{item.brand}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            disabled={isRemoving}
                                                            onClick={() => removeMaterial(item)}
                                                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition disabled:opacity-50"
                                                        >
                                                            {isRemoving ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <IconTrash className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-gray-600 dark:text-gray-400">Qty:</label>
                                                        <button
                                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item, item.quantity + 1)}
                                                            className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        No materials added yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                        <button
                            onClick={() => {
                                onSave(savedMaterials);
                                onClose();
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialsManagementCard;
