import React, { useState, useEffect } from 'react';
import customerService from '../../../services/customerService';
import toast from 'react-hot-toast';
import AddCompanyBranchesModal from './AddCompanyBranchesModal';
import Swal from 'sweetalert2';

interface Branch {
    id: string;
    company_id: string;
    branch_name: string;
    is_primary: boolean;
}

interface CompanyBranchesModalProps {
    isOpen: boolean;
    customerId: string;
    customerName: string;
    onClose: () => void;
}

const CompanyBranchesModal: React.FC<CompanyBranchesModalProps> = ({
    isOpen,
    customerId,
    customerName,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
    const [editingBranchName, setEditingBranchName] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            loadBranches();
        }
    }, [isOpen]);

    const loadBranches = async () => {
        setLoading(true);
        const response = await customerService.getCompanyCustomerBranches(customerId);
        setLoading(false);

        if (response.success && response.data?.branches) {
            setBranches(response.data.branches);
        } else {
            toast.error('Failed to load branches');
        }
    };

    const handleEditBranch = (branchId: string, branchName: string) => {
        setEditingBranchId(branchId);
        setEditingBranchName(branchName);
    };

    const handleSaveEdit = async () => {
        if (!editingBranchName.trim()) {
            toast.error('Branch name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // Call API to update branch name
            const response = await customerService.updateCompanyCustomerBranch(
                customerId,
                editingBranchId!,
                { name: editingBranchName.trim() }
            );

            setLoading(false);

            if (response.success) {
                toast.success('Branch updated successfully');
                setEditingBranchId(null);
                setEditingBranchName('');
                loadBranches();
            } else {
                toast.error(response.message || 'Failed to update branch');
            }
        } catch (error) {
            setLoading(false);
            toast.error('Error updating branch');
        }
    };

    const handleCancelEdit = () => {
        setEditingBranchId(null);
        setEditingBranchName('');
    };

    const handleRemoveBranch = async (branchId: string, branchName: string) => {
        Swal.fire({
            title: 'Remove Branch?',
            html: `Are you sure you want to remove <strong>${branchName}</strong> from this customer?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await customerService.removeCompanyCustomerBranch(
                    customerId,
                    branchId
                );

                if (response.success) {
                    toast.success('Branch removed successfully');
                    loadBranches();
                } else {
                    toast.error(response.message || 'Failed to remove branch');
                }
            }
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-black rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                    <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {customerName} - Branches
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            ✕
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500">Loading branches...</p>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {/* Add Branches Button */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                            >
                                + Add More Branches
                            </button>

                            {/* Branches List */}
                            {branches.length === 0 ? (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                                        No branches assigned yet. Click the button above to add branches.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Assigned Branches ({branches.length})
                                    </h3>
                                    {branches.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`border rounded-lg p-4 transition ${
                                                editingBranchId === item.id
                                                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                            }`}
                                        >
                                            {editingBranchId === item.id ? (
                                                // Edit Mode
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editingBranchName}
                                                        onChange={(e) => setEditingBranchName(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light focus:outline-none focus:border-blue-500 text-sm"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            disabled={loading}
                                                            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition font-medium text-sm"
                                                        >
                                                            {loading ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            disabled={loading}
                                                            className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 transition font-medium text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // View Mode
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                {item.branch_name || 'Unknown Branch'}
                                                            </h4>
                                                            {item.is_primary && (
                                                                <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                                                                    Headquarters
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditBranch(
                                                                    item.id,
                                                                    item.branch_name || 'Unknown Branch'
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveBranch(
                                                                    item.id,
                                                                    item.branch_name || 'Unknown Branch'
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Close Button */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Branches Modal */}
            <AddCompanyBranchesModal
                isOpen={showAddModal}
                customerId={customerId}
                customerName={customerName}
                onClose={() => setShowAddModal(false)}
                onSuccess={loadBranches}
            />
        </>
    );
};

export default CompanyBranchesModal;
