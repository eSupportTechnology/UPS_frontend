import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ViewBranchModal from '../Branch/view/ViewBranchModal';
import EditBranchModal from '../Branch/view/EditBranchModal';
import DeleteBranchModal from '../Branch/view/DeleteBranchModal';
import { Branch } from '../../../types/branch.types';
import { PaginationData } from '../../../types/pagination.types';
import { BranchService } from '../../../services/branchService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

const AllBranches: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [branches, setBranches] = useState<PaginationData<Branch> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<any>({
        search: '',
        country: '',
        state: '',
        city: '',
        per_page: 10,
    });
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const fetchBranches = useCallback(
        async (page: number = currentPage) => {
            setLoading(true);
            try {
                
                const data = await BranchService.getBranches(page, filters);
                setBranches(data);
                setCurrentPage(page);
            } catch (error: any) {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Failed to fetch branches',
                });
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filters, showAlert],
    );

    useEffect(() => {
        fetchBranches(1);
    }, [filters]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchBranches(page);
        },
        [fetchBranches],
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
            fetchBranches(1);
        },
        [fetchBranches],
    );

    const handleStatusToggle = async (branch: Branch) => {
        try {
            let response;
            if (branch.is_active) {
                response = await BranchService.deactivateBranch(branch.id);
            } else {
                response = await BranchService.activateBranch(branch.id);
            }
            fetchBranches(currentPage);
            showAlert({
                type: 'success',
                title: 'Status Updated',
                message: response.message || `Branch status updated to ${!branch.is_active ? 'Active' : 'Inactive'}.`,
                duration: 4000,
            });
        } catch (err: any) {
            showAlert({
                type: 'error',
                title: 'Error',
                message: err?.message || 'Failed to update status',
                duration: 4000,
            });
        }
    };

    const columns = useMemo(
        () => [
            { key: 'name', label: 'Branch Name' },
            { key: 'branch_code', label: 'Branch Code' },
            { key: 'type', label: 'Type' },
            { key: 'country', label: 'Country' },
            { key: 'state', label: 'State' },
            { key: 'city', label: 'City' },
            { key: 'contact_person', label: 'Contact Person' },
            {
                key: 'is_active',
                label: 'Status',
                render: (v: boolean, row: Branch) => (
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v ? 'Active' : 'Inactive'}</span>
                        <button
                            type="button"
                            className={`ml-2 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${v ? 'bg-green-500' : 'bg-gray-300'}`}
                            onClick={() => handleStatusToggle(row)}
                            title="Toggle Status"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${v ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                ),
            },
            {
                key: 'actions',
                label: 'Actions',
                render: (v: any, row: Branch) => (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            onClick={() => {
                                setSelectedBranch(row);
                                setViewModalOpen(true);
                            }}
                        >
                            View
                        </button>
                        <button
                            type="button"
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                            onClick={() => {
                                setSelectedBranch(row);
                                setEditModalOpen(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                            onClick={() => {
                                console.log('DeleteBranchModal open, branchId:', row.id);
                                setSelectedBranch(row);
                                setDeleteModalOpen(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        [fetchBranches, showAlert, currentPage],
    );

    const paginationMeta = useMemo(() => {
        if (!branches) return null;
        return {
            current_page: branches.current_page,
            last_page: branches.last_page,
            per_page: branches.per_page,
            total: branches.total,
            from: branches.from,
            to: branches.to,
        };
    }, [branches]);

    const tableData = useMemo(() => branches?.data || [], [branches]);

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
                        <span>Branches</span>
                    </li>
                </ul>
            </div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
                    <p className="text-gray-600">Manage inventory items</p>
                </div>
                <Link to="/super-admin/create-branch" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Branch
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
                            placeholder="Search by name, code, or contact..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={filters.state}
                            onChange={(e) => handleFilterChange('state', e.target.value)}
                            placeholder="State"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            placeholder="City"
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
                {branches && <div className="text-sm text-gray-600">Total: {branches.total} branches</div>}
            </div>
            <Table data={tableData} columns={columns} loading={loading} emptyMessage="No branches found" className="mb-6" />
            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}

            {/* Modals */}
            <ViewBranchModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedBranch(null);
                }}
                branch={selectedBranch}
            />
            <EditBranchModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedBranch(null);
                }}
                branch={selectedBranch}
                onUpdated={() => {
                    fetchBranches(currentPage);
                    showAlert({
                        type: 'success',
                        title: 'Branch Updated',
                        message: 'Branch updated successfully.',
                        duration: 5000,
                    });
                }}
            />
            <DeleteBranchModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedBranch(null);
                }}
                branchId={selectedBranch?.id ?? null}
                onDeleted={() => {
                    fetchBranches(currentPage);
                    setDeleteModalOpen(false);
                    setSelectedBranch(null);
                    showAlert({
                        type: 'success',
                        title: 'Branch Deleted',
                        message: 'Branch deleted successfully.',
                        duration: 5000,
                    });
                }}
            />
        </div>
    );
};

export default AllBranches;
