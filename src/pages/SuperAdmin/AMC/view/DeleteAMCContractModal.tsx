import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import IconX from '../../../../components/Icon/IconX';

interface DeleteAMCContractModalProps {
    open: boolean;
    onClose: () => void;
    contractId: string | null;
    onDeleted: () => void;
}

const DeleteAMCContractModal: React.FC<DeleteAMCContractModalProps> = ({ open, onClose, contractId, onDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!contractId) {
            setError('No contract selected for deletion.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            onDeleted();
            onClose();
        } catch (err: any) {
            setError(err?.message || 'Failed to delete contract');
        } finally {
            setLoading(false);
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
                            <DialogPanel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-md text-black dark:text-white-dark">
                                <button type="button" onClick={onClose} className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 outline-none">
                                    <IconX />
                                </button>
                                <div className="text-lg font-medium bg-[#fbfbfb] ltr:pl-5 py-3 ltr:pr-[50px]">Delete AMC Contract</div>
                                <div className="p-5">
                                    <p>Are you sure you want to delete this contract?</p>
                                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                                </div>
                                <div className="mt-6 text-right p-5 pt-0 flex gap-2 justify-end">
                                    <button onClick={onClose} className="btn btn-outline-primary" type="button" disabled={loading}>
                                        Cancel
                                    </button>
                                    <button onClick={handleDelete} className="btn btn-danger" type="button" disabled={loading}>
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteAMCContractModal;
