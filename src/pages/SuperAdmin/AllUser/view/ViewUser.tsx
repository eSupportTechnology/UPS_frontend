import { Fragment } from 'react';
import { ROLE_LABELS } from '../../../../types/user.types';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

interface ViewUserProps {
    open: boolean;
    onClose: () => void;
    user: any;
}

const ViewUser: React.FC<ViewUserProps> = ({ open, onClose, user }) => (
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
                            <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none">
                                ×
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] pl-5 py-3 pr-[50px]">{user ? `View: ${user.name}` : 'View User'}</div>
                            <div className="p-5 space-y-2">
                                {user && (
                                    <>
                                        {/* ID removed as per request */}
                                        <div>
                                            <strong>Name:</strong> {user.name}
                                        </div>
                                        <div>
                                            <strong>Email:</strong> {user.email}
                                        </div>
                                        <div>
                                            <strong>Role:</strong> {ROLE_LABELS[user.role_as as keyof typeof ROLE_LABELS] || user.role_as}
                                        </div>
                                        <div>
                                            <strong>Phone:</strong> {user.phone || '-'}
                                        </div>
                                        <div>
                                            <strong>Address:</strong> {user.address || '-'}
                                        </div>
                                        {/* Created At and Updated At removed as per request */}
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

export default ViewUser;
