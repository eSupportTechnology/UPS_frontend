import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';
import { Inventory } from '../../../types/inventory.types';

interface ViewInventoryProps {
    open: boolean;
    onClose: () => void;
    inventory: Inventory | null;
}

const ViewInventory: React.FC<ViewInventoryProps> = ({ open, onClose, inventory }) => (
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
                            <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                {inventory ? `View: ${inventory.product_name}` : 'View Inventory'}
                            </div>
                            <div className="p-5 space-y-2">
                                {inventory && (
                                    <>
                                        <div>
                                            <strong>Product Name:</strong> {inventory.product_name}
                                        </div>
                                        <div>
                                            <strong>Brand:</strong> {inventory.brand || '-'}
                                        </div>
                                        <div>
                                            <strong>Model:</strong> {inventory.model || '-'}
                                        </div>
                                        <div>
                                            <strong>Serial Number:</strong> {inventory.serial_number || '-'}
                                        </div>
                                        <div>
                                            <strong>Category:</strong> {inventory.category}
                                        </div>
                                        <div>
                                            <strong>Description:</strong> {inventory.description || '-'}
                                        </div>
                                        <div>
                                            <strong>Quantity:</strong> {inventory.quantity}
                                        </div>
                                        <div>
                                            <strong>Unit Price:</strong> Rs {inventory.unit_price}
                                        </div>
                                        <div>
                                            <strong>Purchase Date:</strong> {inventory.purchase_date || '-'}
                                        </div>
                                        <div>
                                            <strong>Warranty:</strong> {inventory.warranty || '-'}
                                        </div>
                                        <div>
                                            <strong>Created By:</strong> {inventory.created_by}
                                        </div>
                                        <div>
                                            <strong>Created At:</strong> {inventory.created_at}
                                        </div>
                                        <div>
                                            <strong>Updated At:</strong> {inventory.updated_at}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-6 text-right p-5 pt-0">
                                <button onClick={onClose} className="btn btn-primary">
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default ViewInventory;
