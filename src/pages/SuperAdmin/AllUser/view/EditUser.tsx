import { Fragment } from 'react';
import { ROLE_LABELS } from '../../../../types/user.types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

interface EditUserProps {
    open: boolean;
    onClose: () => void;
    user: any;
    form: any;
    onChange: (form: any) => void;
    onSave: () => void;
    isSaving?: boolean;
}

const EditUser: React.FC<EditUserProps> = ({ open, onClose, user, form, onChange, onSave, isSaving }) => (
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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                            <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                ×
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] pl-5 py-3 pr-[50px]">{user ? `Edit: ${user.name}` : 'Edit User'}</div>
                            <div className="p-5 space-y-2">
                                <div className="mb-5">
                                    <label htmlFor="name">Name</label>
                                    <input id="name" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.name || ''} onChange={(e) => onChange({ ...form, name: e.target.value })} />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.email || ''} onChange={(e) => onChange({ ...form, email: e.target.value })} />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="role_as">Role</label>
                                    <select id="role_as" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.role_as || ''} onChange={(e) => onChange({ ...form, role_as: Number(e.target.value) })}>
                                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="phone">Phone</label>
                                    <input id="phone" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.phone || ''} onChange={(e) => onChange({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="address">Address</label>
                                    <input id="address" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.address || ''} onChange={(e) => onChange({ ...form, address: e.target.value })} />
                                </div>
                            </div>
                            <div className="mt-6 text-right p-5 pt-0 flex gap-2 justify-end">
                                <button onClick={onClose} className="btn btn-outline-danger" type="button">
                                    Cancel
                                </button>
                                <button onClick={onSave} className="btn btn-primary" type="button" disabled={isSaving}>
                                    Save
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default EditUser;
