import React, { useState, useEffect } from 'react';
import IconX from '../Icon/IconX';
import insideJobService from '../../services/insideJobService';
import toast from 'react-hot-toast';

interface PlannedMaterial {
    id: string;
    inventory_id: string;
    product_name: string;
    brand?: string;
    category?: string;
    quantity: number;
}

interface RejectJobModalProps {
    jobId: string;
    jobNumber: string;
    onClose: () => void;
    onReject: (reason: string, rollbackMaterialIds: string[]) => Promise<void>;
}

const RejectJobModal: React.FC<RejectJobModalProps> = ({
    jobId,
    jobNumber,
    onClose,
    onReject,
}) => {
    const [materials, setMaterials] = useState<PlannedMaterial[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMaterials();
    }, [jobId]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const response = await insideJobService.getPlannedMaterials(jobId);
            if (response.success && response.data) {
                setMaterials(response.data);
                // Select all materials by default for rollback
                setSelectedMaterials(response.data.map((m: PlannedMaterial) => m.id));
            }
        } catch (error) {
            toast.error('Failed to load materials');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMaterial = (materialId: string) => {
        setSelectedMaterials(prev =>
            prev.includes(materialId)
                ? prev.filter(id => id !== materialId)
                : [...prev, materialId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMaterials.length === materials.length) {
            setSelectedMaterials([]);
        } else {
            setSelectedMaterials(materials.map(m => m.id));
        }
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setSubmitting(true);
        try {
            await onReject(reason.trim(), selectedMaterials);
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to reject job');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Reject Job</h2>
                        <p className="text-red-100 text-sm">Job: {jobNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-800 rounded-full transition"
                        disabled={submitting}
                    >
                        <IconX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Rejection Reason */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter the reason for rejecting this job..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            rows={3}
                        />
                    </div>

                    {/* Materials Rollback Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Materials to Rollback (Return to Inventory)
                            </label>
                            {materials.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {selectedMaterials.length === materials.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                            </div>
                        ) : materials.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">No materials planned for this job</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {materials.map((material) => (
                                    <label
                                        key={material.id}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                                            selectedMaterials.includes(material.id)
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMaterials.includes(material.id)}
                                            onChange={() => handleToggleMaterial(material.id)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <div className="ml-3 flex-1">
                                            <p className="font-medium text-gray-800 dark:text-white-light">
                                                {material.product_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {material.brand && `${material.brand} • `}
                                                {material.category && `${material.category} • `}
                                                Qty: {material.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                            x{material.quantity}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {materials.length > 0 && selectedMaterials.length > 0 && (
                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    <strong>{selectedMaterials.length}</strong> material(s) will be returned to inventory
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !reason.trim()}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Rejecting...
                            </>
                        ) : (
                            'Reject Job'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectJobModal;
