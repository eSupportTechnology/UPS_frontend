import { InsideJobTicket } from '../types/ticket.types';
import { KanbanColumnConfig, InsideJobStatus } from '../types/kanban.types';

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: 'pending_inspection',
    title: 'Pending Inspection',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    allowedNext: ['in_repair', 'completed', 'quote_rejected'],
  },
  {
    id: 'in_repair',
    title: 'In Repair',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    allowedNext: ['pending_inspection', 'completed', 'quote_rejected'],
  },
  {
    id: 'completed',
    title: 'Completed',
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    allowedNext: ['pending_inspection', 'in_repair', 'quote_rejected'],
  },
  {
    id: 'quote_rejected',
    title: 'Rejected',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    allowedNext: ['pending_inspection', 'in_repair', 'completed'],
  },
];

/**
 * Get column configuration by status
 */
export const getStatusConfig = (status: InsideJobStatus): KanbanColumnConfig | undefined => {
  return KANBAN_COLUMNS.find((col) => col.id === status);
};

/**
 * Check if a transition is valid
 */
export const isValidTransition = (
  currentStatus: InsideJobStatus,
  targetStatus: InsideJobStatus
): boolean => {
  const config = getStatusConfig(currentStatus);
  if (!config) return false;
  return config.allowedNext.includes(targetStatus);
};

/**
 * Group jobs by status for Kanban display
 */
export const groupJobsByStatus = (
  jobs: InsideJobTicket[]
): Record<InsideJobStatus, InsideJobTicket[]> => {
  const grouped: Record<InsideJobStatus, InsideJobTicket[]> = {
    pending_inspection: [],
    inspected: [],
    quoted: [],
    approved_for_repair: [],
    in_repair: [],
    completed: [],
    quote_rejected: [],
  };

  jobs.forEach((job) => {
    const status = job.status as InsideJobStatus;
    // Only include jobs with statuses that are displayed in the Kanban board
    if (status === 'pending_inspection' || status === 'in_repair' || status === 'completed' || status === 'quote_rejected') {
      if (grouped[status]) {
        grouped[status].push(job);
      }
    }
  });

  return grouped;
};

/**
 * Get color classes for priority badge
 */
export const getPriorityColor = (priority?: string): string => {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount?: number): string => {
  if (!amount) return 'N/A';
  return `Rs. ${amount.toFixed(2)}`;
};

/**
 * Get status label from status code
 */
export const getStatusLabel = (status: InsideJobStatus): string => {
  const config = getStatusConfig(status);
  return config?.title || status.replace(/_/g, ' ');
};
