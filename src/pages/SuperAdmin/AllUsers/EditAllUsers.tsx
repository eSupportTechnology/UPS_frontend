import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../components/Icon/IconX';

const EditAllUsers = ({ open, onClose, params, changeValue, saveUser, setAddUserModal }: any) => (
    <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={onClose} className="relative z-[51]">
            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
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
                                onClick={() => setAddUserModal(false)}
                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                            >
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#232a3b] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px] text-center">
                                {params.id ? 'Edit User' : 'Add User'}
                            </div>
                            <div className="p-5">
                                <form>
                                    <div className="mb-5">
                                        <label htmlFor="name">Name</label>
                                        <input id="name" type="text" placeholder="Enter Name" className="form-input" value={params.name} onChange={changeValue} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={changeValue} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input id="phone" type="text" placeholder="Enter Phone Number" className="form-input" value={params.phone} onChange={changeValue} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="role">Role</label>
                                        <input id="role" type="text" placeholder="Enter Role" className="form-input" value={params.role} onChange={changeValue} />
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="location">Address</label>
                                        <textarea
                                            id="location"
                                            rows={3}
                                            placeholder="Enter Address"
                                            className="form-textarea resize-none min-h-[130px]"
                                            value={params.location}
                                            onChange={changeValue}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button type="button" className="btn btn-outline-danger" onClick={() => setAddUserModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                            {params.id ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default EditAllUsers;
