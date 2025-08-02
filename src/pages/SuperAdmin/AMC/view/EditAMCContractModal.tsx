import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { AMCContract } from '../../../../types/amcContract.types';

interface EditAMCContractModalProps {
    open: boolean;
    onClose: () => void;
    contract: AMCContract | null;
    onUpdated: () => void;
}

const EditAMCContractModal: React.FC<EditAMCContractModalProps> = ({ open, onClose, contract, onUpdated }) => {
    const [form, setForm] = useState<Partial<AMCContract>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (contract) setForm(contract);
    }, [contract]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;
        setLoading(true);
        setError(null);
        try {
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to update contract');
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
                            <DialogPanel className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl text-black">
                                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-bold bg-gray-100 ltr:pl-5 py-3 ltr:pr-[50px] border-b border-gray-200">
                                    {contract ? `Edit: ${contract.contract_type}` : 'Edit AMC Contract'}
                                </div>
                                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Contract Type</label>
                                            <input
                                                name="contract_type"
                                                value={form.contract_type || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Branch ID</label>
                                            <input
                                                name="branch_id"
                                                value={form.branch_id || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Customer ID</label>
                                            <input
                                                name="customer_id"
                                                value={form.customer_id || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Purchase Date</label>
                                            <input
                                                name="purchase_date"
                                                type="date"
                                                value={form.purchase_date || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Warranty End Date</label>
                                            <input
                                                name="warranty_end_date"
                                                type="date"
                                                value={form.warranty_end_date || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Contract Amount</label>
                                            <input
                                                name="contract_amount"
                                                type="number"
                                                step="0.01"
                                                value={form.contract_amount || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block mb-1 font-medium text-gray-700">Notes</label>
                                            <textarea
                                                name="notes"
                                                value={form.notes || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                rows={2}
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Status</label>
                                            <select
                                                name="is_active"
                                                value={form.is_active ? 'true' : 'false'}
                                                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.value === 'true' }))}
                                                className="form-select border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    {error && <div className="text-red-500 text-sm">{error}</div>}
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" className="btn btn-outline-danger" onClick={onClose} disabled={loading}>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditAMCContractModal;
