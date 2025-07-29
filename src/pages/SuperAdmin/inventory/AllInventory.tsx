import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EditInventory from './EditInventory';
import ViewInventory from './ViewInventory';
import DeleteInventoryModal from './DeleteInventoryModal';
import { Inventory } from '../../../types/inventory.types';
import { PaginationData } from '../../../types/pagination.types';
import { InventoryService } from '../../../services/inventoryService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

const AllInventory: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [inventories, setInventories] = useState<PaginationData<Inventory> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<any>({
        search: '',
        category: '',
        brand: '',
        created_by: '',
        per_page: 10,
    });

    const fetchInventories = useCallback(
        async (page: number = currentPage) => {
            setLoading(true);
            try {
                const data = await InventoryService.getInventories(page, filters);
                setInventories(data);
                setCurrentPage(page);
            } catch (error: any) {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Failed to fetch inventories',
                });
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filters, showAlert],
    );

    useEffect(() => {
        fetchInventories(1);
    }, [filters]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchInventories(page);
        },
        [fetchInventories],
    );

    const handleFilterChange = useCallback((key: string, value: any) => {
        setFilters((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            fetchInventories(1);
        },
        [fetchInventories],
    );

    // Modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [editForm, setEditForm] = useState<Partial<Inventory> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openViewModal = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setViewModalOpen(true);
    };
    const closeViewModal = () => {
        setViewModalOpen(false);
        setSelectedInventory(null);
    };
    const openEditModal = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setEditForm({ ...inventory });
        setEditModalOpen(true);
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedInventory(null);
        setEditForm(null);
    };
    const handleEditChange = (form: Partial<Inventory>) => {
        setEditForm(form);
    };
    const handleEditSave = async () => {
        if (!selectedInventory || !editForm) return;
        setIsSaving(true);
        try {
            // Call your update API here
            await InventoryService.updateInventory(selectedInventory.id, editForm);
            showAlert({ type: 'success', title: 'Success', message: 'Inventory updated successfully.' });
            closeEditModal();
            fetchInventories(currentPage);
        } catch (error: any) {
            showAlert({ type: 'error', title: 'Error', message: error.message || 'Failed to update inventory.' });
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteModal = (inventory: Inventory) => {
        setSelectedInventory(inventory);
        setDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedInventory(null);
    };
    const handleDelete = async () => {
        if (!selectedInventory) return;
        setIsDeleting(true);
        try {
            await InventoryService.deleteInventory(selectedInventory.id);
            showAlert({ type: 'success', title: 'Deleted', message: 'Inventory deleted successfully.' });
            closeDeleteModal();
            fetchInventories(currentPage);
        } catch (error: any) {
            showAlert({ type: 'error', title: 'Error', message: error.message || 'Failed to delete inventory.' });
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = useMemo(
        () => [
            { key: 'product_name', label: 'Product Name' },
            { key: 'brand', label: 'Brand', render: (v: string) => v || '-' },
            { key: 'model', label: 'Model', render: (v: string) => v || '-' },
            { key: 'serial_number', label: 'Serial Number', render: (v: string) => v || '-' },
            { key: 'category', label: 'Category' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'unit_price', label: 'Unit Price', render: (v: number) => `Rs ${v}` },
            {
                key: 'actions',
                label: 'Actions',
                render: (v: any, row: Inventory) => (
                    <div className="flex space-x-2">
                        <button type="button" className="text-blue-600 hover:text-blue-900 text-sm font-medium" onClick={() => openViewModal(row)}>
                            View
                        </button>
                        <button type="button" className="text-green-600 hover:text-green-900 text-sm font-medium" onClick={() => openEditModal(row)}>
                            Edit
                        </button>
                        <button type="button" className="text-red-600 hover:text-red-900 text-sm font-medium" onClick={() => openDeleteModal(row)}>
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const paginationMeta = useMemo(() => {
        if (!inventories) return null;
        return {
            current_page: inventories.current_page,
            last_page: inventories.last_page,
            per_page: inventories.per_page,
            total: inventories.total,
            from: inventories.from,
            to: inventories.to,
        };
    }, [inventories]);

    const tableData = useMemo(() => inventories?.data || [], [inventories]);

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
                        <span>All Inventories</span>
                    </li>
                </ul>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
                    <p className="text-gray-600">Manage inventory items</p>
                </div>
                <Link to="/super-admin/inventory-create" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Inventory
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            Search
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by product, brand, model..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            placeholder="Category"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                            Brand
                        </label>
                        <input
                            type="text"
                            id="brand"
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            placeholder="Brand"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <PerPageSelector value={filters.per_page || 10} onChange={(value) => handleFilterChange('per_page', value)} loading={loading} />
                {inventories && <div className="text-sm text-gray-600">Total: {inventories.total} items</div>}
            </div>

            <Table data={tableData} columns={columns} loading={loading} emptyMessage="No inventory found" className="mb-6" />

            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}

            {/* View Inventory Modal */}
            <ViewInventory open={viewModalOpen} onClose={closeViewModal} inventory={selectedInventory} />
            {/* Edit Inventory Modal */}
            <EditInventory open={editModalOpen} onClose={closeEditModal} inventory={selectedInventory} form={editForm} onChange={handleEditChange} onSave={handleEditSave} isSaving={isSaving} />
            {/* Delete Inventory Modal */}
            <DeleteInventoryModal open={deleteModalOpen} onClose={closeDeleteModal} onDelete={handleDelete} isDeleting={isDeleting} inventory={selectedInventory} />
        </div>
    );
};

export default AllInventory;
