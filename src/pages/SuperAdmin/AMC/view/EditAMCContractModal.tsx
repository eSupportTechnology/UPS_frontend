import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { AMCContract, Customer } from '../../../../types/amcContract.types';
import { Branch } from '../../../../types/branch.types';
import { AMCContractService } from '../../../../services/amcContractService';
import { BranchService } from '../../../../services/branchService';
import { CustomerService } from '../../../../services/customerService';
import { useAlert } from '../../../../components/Alert/Alert';

interface EditAMCContractModalProps {
    open: boolean;
    onClose: () => void;
    contract: AMCContract | null;
    onUpdated: () => void;
}

const EditAMCContractModal: React.FC<EditAMCContractModalProps> = ({ open, onClose, contract, onUpdated }) => {
    const { showAlert } = useAlert();
    const [form, setForm] = useState<Partial<AMCContract>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        if (contract) setForm(contract);
    }, [contract]);

    useEffect(() => {
        if (open) {
            loadBranches();
            loadCustomers();
        }
    }, [open]);

    const loadBranches = async () => {
        try {
            const branches = await BranchService.getActiveBranches();
            setBranches(branches || []);
        } catch (error) {
            console.error('Failed to load branches:', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const customers = await CustomerService.getActiveCustomers();
            setCustomers(customers || []);
        } catch (error) {
            console.error('Failed to load customers:', error);
            setCustomers([]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!contract) return;
        setLoading(true);
        setError(null);
        try {
            await AMCContractService.updateContract(contract.id, form);
            showAlert({
                type: 'success',
                title: 'Success',
                message: 'Contract updated successfully',
            });
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to update contract');
            showAlert({
                type: 'error',
                title: 'Error',
                message: err?.message || 'Failed to update contract',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={onClose} className="relative z-[51]">
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl text-black dark:text-white-dark">
                                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                    {contract ? `Edit: ${contract.contract_type}` : 'Edit AMC Contract'}
                                </div>
                                <div className="p-5">
                                    <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                                        <div className="mb-5">
                                            <label htmlFor="contract_type">Contract Type</label>
                                            <input
                                                id="contract_type"
                                                name="contract_type"
                                                type="text"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.contract_type || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="branch_id">Branch Name</label>
                                            <select
                                                id="branch_id"
                                                name="branch_id"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.branch_id || ''}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name} ({branch.branch_code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="customer_id">Customer Name</label>
                                            <select
                                                id="customer_id"
                                                name="customer_id"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.customer_id || ''}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Customer</option>
                                                {customers.map((customer) => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.name} {customer.email ? `(${customer.email})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="purchase_date">Purchase Date</label>
                                            <input
                                                id="purchase_date"
                                                name="purchase_date"
                                                type="date"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.purchase_date || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="warranty_end_date">Warranty End Date</label>
                                            <input
                                                id="warranty_end_date"
                                                name="warranty_end_date"
                                                type="date"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.warranty_end_date || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="contract_amount">Contract Amount</label>
                                            <input
                                                id="contract_amount"
                                                name="contract_amount"
                                                type="number"
                                                step="0.01"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.contract_amount || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="is_active">Status</label>
                                            <select
                                                id="is_active"
                                                name="is_active"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.is_active ? 'true' : 'false'}
                                                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === 'true' }))}
                                                required
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                        <div className="mb-5 md:col-span-3">
                                            <label htmlFor="notes">Notes</label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                                value={form.notes || ''}
                                                onChange={handleChange}
                                                rows={3}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="mt-6 text-right p-5 pt-0 flex gap-2 justify-end">
                                    <button onClick={onClose} className="btn btn-outline-danger" type="button" disabled={loading}>
                                        Cancel
                                    </button>
                                    <button onClick={handleSubmit} className="btn btn-primary" type="button" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                                {error && <div className="text-red-500 text-sm p-5 pt-0">{error}</div>}
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditAMCContractModal;
