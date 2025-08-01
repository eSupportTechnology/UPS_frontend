import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { Branch } from '../../../../types/branch.types';
import { BranchService } from '../../../../services/branchService';

interface EditBranchModalProps {
    open: boolean;
    onClose: () => void;
    branch: Branch | null;
    onUpdated: () => void;
}

const EditBranchModal: React.FC<EditBranchModalProps> = ({ open, onClose, branch, onUpdated }) => {
    const [form, setForm] = useState<Partial<Branch>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Populate form when branch changes
    useEffect(() => {
        if (branch) setForm(branch);
    }, [branch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!branch) return;
        setLoading(true);
        setError(null);
        try {
            if (branch.id) {
                await BranchService.updateBranch(branch.id, form);
            }
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to update branch');
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
                            <DialogPanel className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl text-black">
                                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-bold bg-gray-100 ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px] border-b border-gray-200">
                                    {branch ? `Edit: ${branch.name}` : 'Edit Branch'}
                                </div>
                                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Branch Name</label>
                                            <input
                                                name="name"
                                                value={form.name || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Branch Code</label>
                                            <input
                                                name="branch_code"
                                                value={form.branch_code || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Type</label>
                                            <select
                                                name="type"
                                                value={form.type || ''}
                                                onChange={handleChange}
                                                className="form-select border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                                required
                                            >
                                                <option value="sub">Sub</option>
                                                <option value="main">Main</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Country</label>
                                            <input
                                                name="country"
                                                value={form.country || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">State</label>
                                            <input
                                                name="state"
                                                value={form.state || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">City</label>
                                            <input
                                                name="city"
                                                value={form.city || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Address 1</label>
                                            <input
                                                name="address_line1"
                                                value={form.address_line1 || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Address 2</label>
                                            <input
                                                name="address_line2"
                                                value={form.address_line2 || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Postal Code</label>
                                            <input
                                                name="postal_code"
                                                value={form.postal_code || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Contact Person</label>
                                            <input
                                                name="contact_person"
                                                value={form.contact_person || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Contact Number</label>
                                            <input
                                                name="contact_number"
                                                value={form.contact_number || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Email</label>
                                            <input
                                                name="email"
                                                value={form.email || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block mb-1 font-medium text-gray-700">Operating Hours</label>
                                            <input
                                                name="operating_hours"
                                                value={form.operating_hours || ''}
                                                onChange={handleChange}
                                                className="form-input border border-gray-300 rounded-md focus:ring-primary focus:border-primary w-full px-3 py-2"
                                            />
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

export default EditBranchModal;
