import React, { useState } from 'react';
import customerService from '../../../services/customerService';
import toast from 'react-hot-toast';

interface SelectedBranch {
    name: string;
}

interface AddCompanyBranchesModalProps {
    isOpen: boolean;
    customerId: string;
    customerName: string;
    onClose: () => void;
    onSuccess: () => void;
}

const AddCompanyBranchesModal: React.FC<AddCompanyBranchesModalProps> = ({
    isOpen,
    customerId,
    customerName,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [newBranchName, setNewBranchName] = useState<string>('');
    const [selectedBranches, setSelectedBranches] = useState<SelectedBranch[]>([]);

    const handleAddBranch = () => {
        const branchName = newBranchName.trim();

        if (!branchName) {
            toast.error('Please enter a branch name');
            return;
        }

        // Check if branch already added
        if (selectedBranches.some((b) => b.name.toLowerCase() === branchName.toLowerCase())) {
            toast.error('This branch is already added');
            return;
        }

        // Add new branch
        setSelectedBranches([
            ...selectedBranches,
            {
                name: branchName,
            },
        ]);
        setNewBranchName('');
        toast.success(`Branch "${branchName}" added`);
    };

    const handleRemoveBranch = (index: number) => {
        const removedBranch = selectedBranches[index];
        setSelectedBranches(selectedBranches.filter((_, i) => i !== index));
        toast.success(`Branch "${removedBranch.name}" removed`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedBranches.length === 0) {
            toast.error('Please add at least one branch');
            return;
        }

        setLoading(true);

        const response = await customerService.addCompanyCustomerBranches(
            customerId,
            selectedBranches.map(b => b.name)
        );

        setLoading(false);

        if (response.success) {
            toast.success(response.message || 'Branches added successfully');
            setSelectedBranches([]);
            setNewBranchName('');
            onSuccess();
            onClose();
        } else {
            toast.error(response.message || 'Failed to add branches');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-black rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Add Branches to {customerName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Branch Name Input */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Add Branches to {customerName}
                        </h3>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Branch Name
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g., Delhi Office, Mumbai Branch..."
                                value={newBranchName}
                                onChange={(e) => setNewBranchName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddBranch();
                                    }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white-light focus:outline-none focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={handleAddBranch}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition font-semibold"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* Selected Branches List */}
                    {selectedBranches.length > 0 ? (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Branches to be Added ({selectedBranches.length})
                            </h4>
                            <div className="space-y-2">
                                {selectedBranches.map((branch, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {branch.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBranch(index)}
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No branches added yet. Type a branch name and click "+ Add" to add branches.
                        </p>
                    )}

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
                            disabled={loading || selectedBranches.length === 0}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Adding...' : `Add ${selectedBranches.length} Branch(es)`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompanyBranchesModal;
