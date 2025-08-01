import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { Branch } from '../../../../types/branch.types';

interface ViewBranchModalProps {
    open: boolean;
    onClose: () => void;
    branch: Branch | null;
}

const ViewBranchModal: React.FC<ViewBranchModalProps> = ({ open, onClose, branch }) => (
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
                                {branch ? `View: ${branch.name}` : 'View Branch'}
                            </div>
                            <div className="p-5 space-y-2">
                                {branch && (
                                    <>
                                        <div>
                                            <strong>Branch Name:</strong> {branch.name}
                                        </div>
                                        <div>
                                            <strong>Branch Code:</strong> {branch.branch_code}
                                        </div>
                                        <div>
                                            <strong>Type:</strong> {branch.type}
                                        </div>
                                        <div>
                                            <strong>Country:</strong> {branch.country || '-'}
                                        </div>
                                        <div>
                                            <strong>State:</strong> {branch.state || '-'}
                                        </div>
                                        <div>
                                            <strong>City:</strong> {branch.city || '-'}
                                        </div>
                                        <div>
                                            <strong>Address 1:</strong> {branch.address_line1 || '-'}
                                        </div>
                                        <div>
                                            <strong>Address 2:</strong> {branch.address_line2 || '-'}
                                        </div>
                                        <div>
                                            <strong>Postal Code:</strong> {branch.postal_code || '-'}
                                        </div>
                                        <div>
                                            <strong>Contact Person:</strong> {branch.contact_person || '-'}
                                        </div>
                                        <div>
                                            <strong>Contact Number:</strong> {branch.contact_number || '-'}
                                        </div>
                                        <div>
                                            <strong>Email:</strong> {branch.email || '-'}
                                        </div>
                                        <div>
                                            <strong>Operating Hours:</strong> {branch.operating_hours || '-'}
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {branch.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-start mt-6">
                                    <button
                                        type="button"
                                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:ring-2 focus:ring-primary transition-colors"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default ViewBranchModal;
