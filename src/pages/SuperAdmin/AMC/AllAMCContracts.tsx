import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ViewAMCContractModal from './view/ViewAMCContractModal';
import EditAMCContractModal from './view/EditAMCContractModal';
import DeleteAMCContractModal from './view/DeleteAMCContractModal';
import { AMCContract } from '../../../types/amcContract.types';
import { AMCContractService } from '../../../services/amcContractService';
import { useAlert } from '../../../components/Alert/Alert';
import { Table } from '../../../components/UI/Table';
import { Pagination } from '../../../components/UI/Pagination';
import { PerPageSelector } from '../../../components/UI/PerPageSelector';

const AllAMCContracts: React.FC = () => {
    const { showAlert, AlertContainer } = useAlert();
    const [contracts, setContracts] = useState<{ data: AMCContract[]; total: number; current_page: number; last_page: number; per_page: number; from: number; to: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<any>({
        search: '',
        status: '',
        per_page: 10,
    });
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<AMCContract | null>(null);

    const fetchContracts = useCallback(
        async (page: number = currentPage) => {
            setLoading(true);
            try {
                const data = await AMCContractService.getContracts(page, filters);
                setContracts(data);
                setCurrentPage(page);
            } catch (error: any) {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    message: error.message || 'Failed to fetch contracts',
                });
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filters, showAlert],
    );

    useEffect(() => {
        fetchContracts(1);
    }, [filters]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchContracts(page);
        },
        [fetchContracts],
    );

    const handleFilterChange = useCallback((key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const handleSearch = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            fetchContracts(1);
        },
        [fetchContracts],
    );

    const columns = useMemo(
        () => [
            { key: 'contract_type', label: 'Contract Type' },
            { key: 'branch', label: 'Branch', render: (v: any, row: AMCContract) => row.branch?.name || '-' },
            { key: 'customer', label: 'Customer', render: (v: any, row: AMCContract) => row.customer?.name || '-' },
            { key: 'purchase_date', label: 'Purchase Date' },
            { key: 'warranty_end_date', label: 'Warranty End Date' },
            { key: 'contract_amount', label: 'Amount', render: (v: any) => (v != null ? `₹${v}` : '-') },
            { key: 'notes', label: 'Notes', render: (v: any) => v || '-' },
            {
                key: 'is_active',
                label: 'Status',
                render: (v: boolean) => (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v ? 'Active' : 'Inactive'}</span>
                ),
            },
            {
                key: 'actions',
                label: 'Actions',
                render: (v: any, row: AMCContract) => (
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            onClick={() => {
                                setSelectedContract(row);
                                setViewModalOpen(true);
                            }}
                        >
                            View
                        </button>
                        <button
                            type="button"
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                            onClick={() => {
                                setSelectedContract(row);
                                setEditModalOpen(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                            onClick={() => {
                                setSelectedContract(row);
                                setDeleteModalOpen(true);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const paginationMeta = useMemo(() => {
        if (!contracts) return null;
        return {
            current_page: contracts.current_page,
            last_page: contracts.last_page,
            per_page: contracts.per_page,
            total: contracts.total,
            from: contracts.from,
            to: contracts.to,
        };
    }, [contracts]);

    const tableData = useMemo(() => contracts?.data || [], [contracts]);

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
                        <span>AMC Contracts</span>
                    </li>
                </ul>
            </div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">AMC Contracts</h1>
                    <p className="text-gray-600">Manage AMC contracts</p>
                </div>
                <Link to="/super-admin/create-contract" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create AMC Contract
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
                            placeholder="Search by contract number or customer..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        >
                            <option value="">All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 flex items-end">
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
                {contracts && <div className="text-sm text-gray-600">Total: {contracts.total} contracts</div>}
            </div>
            <Table data={tableData} columns={columns} loading={loading} emptyMessage="No AMC contracts found" className="mb-6" />
            {paginationMeta && <Pagination meta={paginationMeta} onPageChange={handlePageChange} loading={loading} />}

            <ViewAMCContractModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} contract={selectedContract} />
            <EditAMCContractModal open={editModalOpen} onClose={() => setEditModalOpen(false)} contract={selectedContract} onUpdated={() => fetchContracts(currentPage)} />
            <DeleteAMCContractModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} contractId={selectedContract?.id ?? null} onDeleted={() => fetchContracts(currentPage)} />
        </div>
    );
};

export default AllAMCContracts;
