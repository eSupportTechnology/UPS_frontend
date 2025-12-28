import { InsideJobTicket } from './ticket.types';

export type InsideJobStatus =
  | 'pending_inspection'
  | 'inspected'
  | 'quoted'
  | 'approved_for_repair'
  | 'in_repair'
  | 'completed'
  | 'quote_rejected';

export interface KanbanColumnConfig {
  id: InsideJobStatus;
  title: string;
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'orange' | 'gray' | 'red';
  bgColor: string;
  borderColor: string;
  textColor: string;
  allowedNext: InsideJobStatus[];
}

export interface DragItem {
  id: string;
  status: InsideJobStatus;
  job: InsideJobTicket;
}

export interface KanbanBoardProps {
  jobs: InsideJobTicket[];
  loading: boolean;
  onStatusChange: (jobId: string, newStatus: InsideJobStatus, oldStatus: InsideJobStatus) => Promise<void>;
  onRefresh: () => void;
  onJobClick?: (job: InsideJobTicket) => void;
}

export interface KanbanColumnProps {
  config: KanbanColumnConfig;
  jobs: InsideJobTicket[];
  loading: boolean;
  onJobClick?: (job: InsideJobTicket) => void;
}

export interface JobCardProps {
  job: InsideJobTicket;
  onClick?: () => void;
  isDragging?: boolean;
}

export interface ViewToggleProps {
  currentView: 'list' | 'kanban';
  onViewChange: (view: 'list' | 'kanban') => void;
}

export interface StatusTransition {
  from: InsideJobStatus;
  to: InsideJobStatus;
  requiresData?: 'inspection' | 'quote' | 'approval' | 'completion';
}
