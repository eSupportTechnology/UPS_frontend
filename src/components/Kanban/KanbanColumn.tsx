import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { InsideJobTicket } from '../../types/ticket.types';
import { KanbanColumnConfig } from '../../types/kanban.types';
import JobCard from './JobCard';

interface Technician {
  id: string;
  name: string;
}

interface KanbanColumnProps {
  config: KanbanColumnConfig;
  jobs: InsideJobTicket[];
  loading: boolean;
  onJobClick?: (job: InsideJobTicket) => void;
  technicians?: Technician[];
  onAssignTechnician?: (jobId: string, technicianId: string, oldTechnicianId?: string | number) => void;
  onManageMaterials?: (job: InsideJobTicket) => void;
  onViewMaterials?: (job: InsideJobTicket) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  config,
  jobs,
  loading,
  onJobClick,
  technicians = [],
  onAssignTechnician,
  onManageMaterials,
  onViewMaterials,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: config.id,
    data: {
      type: 'column',
      status: config.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 transition-colors ${
        isOver ? `${config.borderColor} shadow-lg` : 'border-gray-200 dark:border-gray-700'
      } ${config.bgColor}`}
      style={{ minHeight: '600px' }}
    >
      {/* Column Header */}
      <div className={`sticky top-0 z-10 ${config.bgColor} p-4 border-b ${config.borderColor}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-sm ${config.textColor}`}>
            {config.title}
          </h3>
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${config.textColor} bg-white dark:bg-gray-700`}>
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500">
            <div className="text-center">
              <p className="text-xs">No jobs</p>
            </div>
          </div>
        ) : (
          // Jobs list
          <SortableContext
            items={jobs.map((j) => j.id)}
            strategy={verticalListSortingStrategy}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => onJobClick?.(job)}
                technicians={technicians}
                onAssignTechnician={onAssignTechnician}
                onManageMaterials={onManageMaterials}
                onViewMaterials={onViewMaterials}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
