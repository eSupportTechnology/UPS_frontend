import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { InsideJobTicket } from '../../types/ticket.types';
import Badge from '../UI/Badge';
import { getPriorityColor, formatCurrency } from '../../utils/kanbanHelpers';
import IconArchive from '../Icon/IconArchive';
import IconEye from '../Icon/IconEye';

interface Technician {
  id: string;
  name: string;
}

interface JobCardProps {
  job: InsideJobTicket;
  onClick?: () => void;
  technicians?: Technician[];
  onAssignTechnician?: (jobId: string, technicianId: string, oldTechnicianId?: string | number) => void;
  onManageMaterials?: (job: InsideJobTicket) => void;
  onViewMaterials?: (job: InsideJobTicket) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, technicians = [], onAssignTechnician, onManageMaterials, onViewMaterials }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: 'job',
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'shadow-lg' : ''
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {/* Header with Job Number and Priority */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-mono font-bold text-sm text-gray-800 dark:text-white-light">
            {job.job_number || 'N/A'}
          </h3>
        </div>
        {job.priority && (
          <Badge variant="priority" size="sm" className="ml-2">
            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          </Badge>
        )}
      </div>

      {/* Customer Information */}
      <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
        <p className="font-medium text-sm text-gray-800 dark:text-white-light">
          {job.customer_name || 'N/A'}
        </p>
        {job.customer_phone && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{job.customer_phone}</p>
        )}
      </div>

      {/* UPS Details */}
      <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">UPS Details</p>
        <p className="font-medium text-sm text-gray-800 dark:text-white-light">
          {job.ups_brand || 'N/A'} {job.ups_model || ''}
        </p>
        {job.ups_serial_number && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{job.ups_serial_number}</p>
        )}
      </div>

      {/* Technician Assignment */}
      {technicians.length > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned To</p>
          <select
            value={job.assigned_to || ''}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              if (onAssignTechnician && e.target.value) {
                onAssignTechnician(job.id, e.target.value, job.assigned_to);
              }
            }}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs bg-white dark:bg-gray-700 text-gray-800 dark:text-white-light"
          >
            <option value="">-- Select Technician --</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Quote Amount (if available) */}
      {job.quote_total && (
        <div className="mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Quote Amount</p>
          <p className="font-semibold text-sm text-green-600 dark:text-green-400">
            {formatCurrency(job.quote_total)}
          </p>
        </div>
      )}

      {/* Materials Section */}
      {(onManageMaterials || onViewMaterials) && (
        <div className="mt-3 mb-2 space-y-2">
          {/* Materials Count */}
          {(job as any).planned_materials && (job as any).planned_materials.length > 0 && (
            <div className="flex items-center justify-between px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              <span className="text-xs text-gray-600 dark:text-gray-400">Materials:</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {(job as any).planned_materials.length} items
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onManageMaterials && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onManageMaterials(job);
                }}
                className="flex-1 px-3 py-2 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition font-medium flex items-center justify-center gap-1"
              >
                <IconArchive className="w-3 h-3" />
                Add
              </button>
            )}
            {onViewMaterials && (job as any).planned_materials && (job as any).planned_materials.length > 0 && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onViewMaterials(job);
                }}
                className="flex-1 px-3 py-2 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition font-medium flex items-center justify-center gap-1"
              >
                <IconEye className="w-3 h-3" />
                View
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer with Status Indicator */}
      <div className="mt-2 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          {job.created_at
            ? new Date(job.created_at).toLocaleDateString()
            : 'N/A'}
        </span>
        {job.approval_status && (
          <Badge
            variant={
              job.approval_status === 'approved'
                ? 'success'
                : job.approval_status === 'rejected'
                  ? 'error'
                  : 'warning'
            }
            size="sm"
          >
            {job.approval_status.charAt(0).toUpperCase() +
              job.approval_status.slice(1)}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default JobCard;
