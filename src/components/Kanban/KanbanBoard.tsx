import React, { useCallback, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { InsideJobTicket } from '../../types/ticket.types';
import { InsideJobStatus } from '../../types/kanban.types';
import {
  KANBAN_COLUMNS,
  groupJobsByStatus,
  isValidTransition,
} from '../../utils/kanbanHelpers';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';
import toast from 'react-hot-toast';

interface Technician {
  id: string;
  name: string;
}

interface KanbanBoardProps {
  jobs: InsideJobTicket[];
  loading: boolean;
  onStatusChange: (
    jobId: string,
    newStatus: InsideJobStatus,
    oldStatus: InsideJobStatus
  ) => Promise<void>;
  onRefresh: () => void;
  onJobClick?: (job: InsideJobTicket) => void;
  technicians?: Technician[];
  onAssignTechnician?: (jobId: string, technicianId: string, oldTechnicianId?: string | number) => Promise<void>;
  onManageMaterials?: (job: InsideJobTicket) => void;
  onViewMaterials?: (job: InsideJobTicket) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  loading,
  onStatusChange,
  onJobClick,
  technicians = [],
  onAssignTechnician,
  onManageMaterials,
  onViewMaterials,
}) => {
  const [optimisticJobs, setOptimisticJobs] = React.useState<InsideJobTicket[]>(jobs);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState<Set<string>>(new Set());

  // Sync optimistic jobs with actual jobs
  React.useEffect(() => {
    setOptimisticJobs(jobs);
  }, [jobs]);

  // Group jobs by status
  const groupedJobs = useMemo(
    () => groupJobsByStatus(optimisticJobs),
    [optimisticJobs]
  );

  // Find the job being dragged
  const activeJob = useMemo(() => {
    if (!activeId) return null;
    return optimisticJobs.find((j) => j.id === activeId);
  }, [activeId, optimisticJobs]);

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);

      const { active, over } = event;

      if (!over) return;

      const activeId = String(active.id);
      const activeJob = optimisticJobs.find((j) => j.id === activeId);
      if (!activeJob) return;

      const newStatus = String(over.id) as InsideJobStatus;
      const oldStatus = activeJob.status as InsideJobStatus;

      // If no change, return early
      if (newStatus === oldStatus) return;

      // Validate transition
      if (!isValidTransition(oldStatus, newStatus)) {
        toast.error('Invalid status transition');
        return;
      }

      // Optimistic update
      setOptimisticJobs((prev) =>
        prev.map((job) =>
          job.id === activeId ? { ...job, status: newStatus } : job
        )
      );

      // Add to updating set
      setUpdating((prev) => new Set([...prev, activeId]));

      try {
        // Call API to update status
        await onStatusChange(activeId, newStatus, oldStatus);
        toast.success('Job status updated');
      } catch (error: any) {
        // Rollback on error
        setOptimisticJobs((prev) =>
          prev.map((job) =>
            job.id === activeId ? { ...job, status: oldStatus } : job
          )
        );
        toast.error(
          error?.message || 'Failed to update job status'
        );
      } finally {
        setUpdating((prev) => {
          const next = new Set(prev);
          next.delete(activeId);
          return next;
        });
      }
    },
    [optimisticJobs, onStatusChange]
  );

  return (
    <div className="w-full overflow-x-auto pb-6">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Kanban Grid */}
        <div className="inline-grid gap-4 min-w-full" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(300px, 1fr)',
        }}>
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              config={column}
              jobs={groupedJobs[column.id] || []}
              loading={loading}
              onJobClick={onJobClick}
              technicians={technicians}
              onAssignTechnician={onAssignTechnician}
              onManageMaterials={onManageMaterials}
              onViewMaterials={onViewMaterials}
            />
          ))}
        </div>

        {/* Drag Overlay - shows the card being dragged */}
        <DragOverlay>
          {activeJob ? (
            <div className="opacity-90 transform scale-105">
              <JobCard job={activeJob} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {!loading && optimisticJobs.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No inside jobs found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Create a new inside job to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
