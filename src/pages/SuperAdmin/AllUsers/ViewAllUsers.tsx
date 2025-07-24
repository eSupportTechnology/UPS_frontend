import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';

const ViewAllUsers = ({ open, onClose, viewUser, setViewUserModal }: any) => (
    <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={onClose} className="relative z-[51]">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 backdrop-blur-[1px]" />
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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-md text-black dark:text-white-dark bg-white dark:bg-[#232a3b] shadow-lg">
                            <button
                                type="button"
                                onClick={() => setViewUserModal(false)}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                            >
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#232a3b] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px] text-center">User Details</div>
                            <div className="p-5">
                                {viewUser && (
                                    <table className="w-full text-left">
                                        <tbody>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Name</th>
                                                <td className="py-2">{viewUser.name}</td>
                                            </tr>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Role</th>
                                                <td className="py-2">{viewUser.role}</td>
                                            </tr>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Email</th>
                                                <td className="py-2">{viewUser.email}</td>
                                            </tr>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Phone</th>
                                                <td className="py-2">{viewUser.phone}</td>
                                            </tr>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Address</th>
                                                <td className="py-2">{viewUser.location}</td>
                                            </tr>
                                            <tr>
                                                <th className="py-2 pr-4 font-medium">Status</th>
                                                <td className="py-2">
                                                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default ViewAllUsers;
