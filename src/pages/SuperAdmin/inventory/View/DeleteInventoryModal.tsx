import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { Inventory } from '../../../../types/inventory.types';

interface DeleteInventoryModalProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    isDeleting: boolean;
    inventory: Inventory | null;
}

const DeleteInventoryModal: React.FC<DeleteInventoryModalProps> = ({ open, onClose, onDelete, isDeleting, inventory }) => (
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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-md text-black dark:text-white-dark">
                            <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">Delete Inventory</div>
                            <div className="p-5">
                                <p>
                                    Are you sure you want to delete <strong>{inventory?.product_name}</strong>?
                                </p>
                            </div>
                            <div className="mt-6 text-right p-5 pt-0 flex gap-2 justify-end">
                                <button onClick={onClose} className="btn btn-outline-primary" type="button" disabled={isDeleting}>
                                    Cancel
                                </button>
                                <button onClick={onDelete} className="btn btn-danger" type="button" disabled={isDeleting}>
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default DeleteInventoryModal;
