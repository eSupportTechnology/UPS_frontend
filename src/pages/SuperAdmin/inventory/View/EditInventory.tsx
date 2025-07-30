import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { Inventory } from '../../../../types/inventory.types';

interface EditInventoryProps {
    open: boolean;
    onClose: () => void;
    inventory: Inventory | null;
    form: Partial<Inventory> | null;
    onChange: (form: Partial<Inventory>) => void;
    onSave: () => void;
    isSaving?: boolean;
}

const EditInventory: React.FC<EditInventoryProps> = ({ open, onClose, inventory, form, onChange, onSave, isSaving }) => (
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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-3xl text-black dark:text-white-dark">
                            <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {inventory ? `Edit: ${inventory.product_name}` : 'Edit Inventory'}
                            </div>
                            <div className="p-5">
                                <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="mb-5">
                                        <label htmlFor="product_name">Product Name</label>
                                        <input
                                            id="product_name"
                                            type="text"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                            value={form?.product_name || ''}
                                            onChange={(e) => onChange({ ...form, product_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="brand">Brand</label>
                                        <input id="brand" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.brand || ''} onChange={(e) => onChange({ ...form, brand: e.target.value })} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="model">Model</label>
                                        <input id="model" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.model || ''} onChange={(e) => onChange({ ...form, model: e.target.value })} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="serial_number">Serial Number</label>
                                        <input
                                            id="serial_number"
                                            type="text"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                            value={form?.serial_number || ''}
                                            onChange={(e) => onChange({ ...form, serial_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="category">Category</label>
                                        <input id="category" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.category || ''} onChange={(e) => onChange({ ...form, category: e.target.value })} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="quantity">Quantity</label>
                                        <input
                                            id="quantity"
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                            value={form?.quantity || ''}
                                            onChange={(e) => onChange({ ...form, quantity: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="unit_price">Unit Price</label>
                                        <input
                                            id="unit_price"
                                            type="number"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                            value={form?.unit_price || ''}
                                            onChange={(e) => onChange({ ...form, unit_price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="purchase_date">Purchase Date</label>
                                        <input
                                            id="purchase_date"
                                            type="date"
                                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300"
                                            value={form?.purchase_date || ''}
                                            onChange={(e) => onChange({ ...form, purchase_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="warranty">Warranty</label>
                                        <input id="warranty" type="text" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.warranty || ''} onChange={(e) => onChange({ ...form, warranty: e.target.value })} />
                                    </div>
                                    <div className="mb-5 md:col-span-3">
                                        <label htmlFor="description">Description</label>
                                        <textarea id="description" className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary border-gray-300" value={form?.description || ''} onChange={(e) => onChange({ ...form, description: e.target.value })} />
                                    </div>
                                </form>
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

export default EditInventory;
