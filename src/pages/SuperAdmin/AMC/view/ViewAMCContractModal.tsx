import { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';
import { AMCContract, MaintenanceData } from '../../../../types/amcContract.types';
import { User } from '../../../../types/user.types';
import { UserService } from '../../../../services/userService';
import { AMCContractService } from '../../../../services/amcContractService';

interface ViewAMCContractModalProps {
    open: boolean;
    onClose: () => void;
    contract: AMCContract | null;
    onUpdate?: () => void;
}

const ViewAMCContractModal: React.FC<ViewAMCContractModalProps> = ({ open, onClose, contract, onUpdate }) => {
    const [technicians, setTechnicians] = useState<User[]>([]);
    const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false);
    const [assigningMaintenance, setAssigningMaintenance] = useState<string | null>(null);
    const [localContract, setLocalContract] = useState<AMCContract | null>(contract);

    useEffect(() => {
        if (open) {
            fetchTechnicians();
            setLocalContract(contract);

        }
    }, [open, contract]);

    const fetchTechnicians = async () => {
        setIsLoadingTechnicians(true);
        try {
            const response = await UserService.getAllTechnicianUsers();
            if (response.success && response.data) {
                setTechnicians(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch technicians:', error);
        } finally {
            setIsLoadingTechnicians(false);
        }
    };

    const handleTechnicianAssignment = async (maintenanceId: string, technicianId: string) => {
        setAssigningMaintenance(maintenanceId);
        try {
            const response = await AMCContractService.assignTechnicianToMaintenance(maintenanceId, technicianId);
            if (response.status === 200 || response.message.includes('successfully')) {
                // Update local contract state immediately
                if (localContract) {
                    const selectedTechnician = technicians.find(t => t.id.toString() === technicianId);
                    const updatedContract = {
                        ...localContract,
                        maintenances: localContract.maintenances?.map(m =>
                            m.id === maintenanceId
                                ? {
                                    ...m,
                                    assigned_to: technicianId,
                                    status: 'assigned' as const,
                                    assigned_technician: selectedTechnician ? {
                                        id: selectedTechnician.id.toString(),
                                        name: selectedTechnician.name,
                                        email: selectedTechnician.email
                                    } : undefined
                                }
                                : m
                        ) || []
                    };
                    setLocalContract(updatedContract);
                }

                // Trigger parent refresh to get updated data from backend
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                alert('Failed to assign technician: ' + response.message);
            }
        } catch (error: any) {
            alert('Failed to assign technician. Please try again.');
        } finally {
            setAssigningMaintenance(null);
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
                        <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] text-black dark:text-white-dark">
                            <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 outline-none">
                                <IconX />
                            </button>
                            <div className="text-lg font-medium bg-[#fbfbfb] ltr:pl-5 py-3 ltr:pr-[50px]">{localContract ? `View: ${localContract.contract_type}` : 'View AMC Contract'}</div>
                            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
                                {localContract && (
                                    <>
                                        {/* Contract Details Section */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <strong>Contract Type:</strong> {localContract.contract_type}
                                                </div>
                                                <div>
                                                    <strong>Branch:</strong> {localContract.branch?.name || localContract.branch_id}
                                                </div>
                                                <div>
                                                    <strong>Customer:</strong> {localContract.customer?.name || localContract.customer_id}
                                                </div>
                                                <div>
                                                    <strong>Purchase Date:</strong> {localContract.purchase_date}
                                                </div>
                                                <div>
                                                    <strong>Warranty End Date:</strong> {localContract.warranty_end_date || '-'}
                                                </div>
                                                <div>
                                                    <strong>Amount:</strong> {localContract.contract_amount != null ? `Rs ${localContract.contract_amount}` : '-'}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <strong>Notes:</strong> {localContract.notes || '-'}
                                                </div>
                                                <div>
                                                    <strong>Status:</strong>{' '}
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${localContract.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {localContract.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Maintenance Schedule Section */}
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
                                            {localContract.maintenances && localContract.maintenances.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-gray-500">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3">Scheduled Date</th>
                                                                <th className="px-4 py-3">Status</th>
                                                                <th className="px-4 py-3">Notes</th>
                                                                <th className="px-4 py-3">Assigned Technician</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {localContract.maintenances.map((maintenance, index) => (
                                                                <tr key={maintenance.id || index} className="bg-white border-b hover:bg-gray-50">
                                                                    <td className="px-4 py-3 font-medium text-gray-900">
                                                                        {maintenance.scheduled_date}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        <span
                                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                                maintenance.status === 'completed'
                                                                                    ? 'bg-green-100 text-green-800'
                                                                                    : maintenance.status === 'assigned'
                                                                                    ? 'bg-blue-100 text-blue-800'
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
                                                                    <td className="px-4 py-3">
                                                                        <Listbox
                                                                            value={maintenance.assigned_to || maintenance.assigned_technician_id || ''}
                                                                            onChange={(value) => handleTechnicianAssignment(maintenance.id || '', value)}
                                                                        >
                                                                            <div className="relative">
                                                                                <ListboxButton
                                                                                    className={`relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-8 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm ${
                                                                                        assigningMaintenance === maintenance.id ? 'opacity-50 cursor-wait' : ''
                                                                                    }`}
                                                                                    disabled={assigningMaintenance === maintenance.id}
                                                                                >
                                                                                    <span className="block truncate">
                                                                                        {assigningMaintenance === maintenance.id ? (
                                                                                            'Assigning...'
                                                                                        ) : (() => {
                                                                                            const assignedId = maintenance.assigned_to || maintenance.assigned_technician_id;
                                                                                            if (!assignedId) {
                                                                                                return 'Select Technician';
                                                                                            }

                                                                                            // Use backend-provided technician data first, then fallback to search
                                                                                            if (maintenance.assigned_technician?.name) {
                                                                                                return `👤 ${maintenance.assigned_technician.name}`;
                                                                                            }

                                                                                            // Fallback: search in current technicians list
                                                                                            const assignedTechnician = technicians.find(t =>
                                                                                                t.id.toString() === assignedId ||
                                                                                                t.id === assignedId ||
                                                                                                t.id === parseInt(assignedId || '0')
                                                                                            );

                                                                                            if (assignedTechnician) {
                                                                                                return `👤 ${assignedTechnician.name}`;
                                                                                            } else {
                                                                                                return `✅ Technician Assigned`;
                                                                                            }
                                                                                        })()}
                                                                                    </span>
                                                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04L10 14.148l2.7-1.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                                                                                        </svg>
                                                                                    </span>
                                                                                </ListboxButton>
                                                                                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                    {isLoadingTechnicians ? (
                                                                                        <ListboxOption value="" disabled className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                                                                                            Loading technicians...
                                                                                        </ListboxOption>
                                                                                    ) : (
                                                                                        technicians.map((technician) => (
                                                                                            <ListboxOption
                                                                                                key={technician.id}
                                                                                                value={technician.id.toString()}
                                                                                                className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-primary text-white' : 'text-gray-900'}`}
                                                                                            >
                                                                                                {({ selected }) => (
                                                                                                    <>
                                                                                                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                                                                            {technician.name}
                                                                                                        </span>
                                                                                                        {selected && (
                                                                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                                                                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                                                                                </svg>
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </>
                                                                                                )}
                                                                                            </ListboxOption>
                                                                                        ))
                                                                                    )}
                                                                                </ListboxOptions>
                                                                            </div>
                                                                        </Listbox>
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
