import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { AMCContract } from '../../../../types/amcContract.types';

interface ViewAMCContractModalProps {
    open: boolean;
    onClose: () => void;
    contract: AMCContract | null;
}

const ViewAMCContractModal: React.FC<ViewAMCContractModalProps> = ({ open, onClose, contract }) => {

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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl text-black dark:text-white-dark">
                            <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] ltr:pl-5 py-3 ltr:pr-[50px]">{contract ? `View: ${contract.contract_type}` : 'View AMC Contract'}</div>
                            <div className="p-5">
                                {contract && (
                                    <>
                                        {/* Contract Details Section */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <strong>Contract Type:</strong> {contract.contract_type}
                                                </div>
                                                <div>
                                                    <strong>Branch:</strong> {contract.branch?.name || contract.branch_id}
                                                </div>
                                                <div>
                                                    <strong>Customer:</strong> {contract.customer?.name || contract.customer_id}
                                                </div>
                                                <div>
                                                    <strong>Purchase Date:</strong> {contract.purchase_date}
                                                </div>
                                                <div>
                                                    <strong>Warranty End Date:</strong> {contract.warranty_end_date || '-'}
                                                </div>
                                                <div>
                                                    <strong>Amount:</strong> {contract.contract_amount != null ? `Rs ${contract.contract_amount}` : '-'}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <strong>Notes:</strong> {contract.notes || '-'}
                                                </div>
                                                <div>
                                                    <strong>Status:</strong>{' '}
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${contract.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {contract.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Maintenance Schedule Section */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
                                            {contract.maintenances && contract.maintenances.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-500">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3">Scheduled Date</th>
                                                                <th className="px-4 py-3">Status</th>
                                                                <th className="px-4 py-3">Notes</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {contract.maintenances.map((maintenance, index) => (
                                                                <tr key={maintenance.id || index} className="bg-white border-b hover:bg-gray-50">
                                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                                        {maintenance.scheduled_date}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <span 
                                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                                maintenance.status === 'completed' 
                                                                                    ? 'bg-green-100 text-green-800' 
                                                                                    : maintenance.status === 'pending'
                                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                                    : 'bg-red-100 text-red-800'
                                                                            }`}
                                                                        >
                                                                            {maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1)}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {maintenance.note || '-'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-md">
                                                    No maintenance schedule available
                                                </div>
                                            )}
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
};

export default ViewAMCContractModal;
