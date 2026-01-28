import { JobStatus } from './types';

export interface StatusLifecycle {
  status: JobStatus;
  label: string;
  owner: 'ORIT' | 'Operations' | 'Field Agent';
  description: string;
  nextPossibleStatuses: JobStatus[];
  requiredDecision?: string;
}

export const JOB_LIFECYCLE: StatusLifecycle[] = [
  {
    status: JobStatus.ORDER_RECEIVED,
    label: 'Order Received',
    owner: 'ORIT',
    description: 'Order received from Business Unit',
    nextPossibleStatuses: [JobStatus.SITE_CHECK_PENDING],
    requiredDecision: 'Initiate site check',
  },
  {
    status: JobStatus.SITE_CHECK_PENDING,
    label: 'Site Check Pending',
    owner: 'Operations',
    description: 'Awaiting site feasibility assessment',
    nextPossibleStatuses: [JobStatus.INVENTORY_AVAILABLE, JobStatus.SITE_CHECK_FAILED],
    requiredDecision: 'Site check outcome',
  },
  {
    status: JobStatus.SITE_CHECK_FAILED,
    label: 'Site Check Failed',
    owner: 'Operations',
    description: 'Site not serviceable or requires civil work',
    nextPossibleStatuses: [JobStatus.BACKEND_NOTIFIED],
    requiredDecision: 'Notify Business Unit',
  },
  {
    status: JobStatus.INVENTORY_AVAILABLE,
    label: 'Inventory Available',
    owner: 'ORIT',
    description: 'All required inventory allocated',
    nextPossibleStatuses: [JobStatus.ENGINEER_ASSIGNED],
    requiredDecision: 'Assign field agent',
  },
  {
    status: JobStatus.INVENTORY_MISSING,
    label: 'Inventory Missing',
    owner: 'ORIT',
    description: 'Required inventory not available',
    nextPossibleStatuses: [JobStatus.WAITING_FOR_PROCUREMENT],
    requiredDecision: 'Initiate procurement',
  },
  {
    status: JobStatus.WAITING_FOR_PROCUREMENT,
    label: 'Waiting for Procurement',
    owner: 'ORIT',
    description: 'Awaiting inventory procurement',
    nextPossibleStatuses: [JobStatus.INVENTORY_AVAILABLE],
    requiredDecision: 'Inventory received confirmation',
  },
  {
    status: JobStatus.ENGINEER_ASSIGNED,
    label: 'Engineer Assigned',
    owner: 'Operations',
    description: 'Field agent assigned to job',
    nextPossibleStatuses: [JobStatus.JOB_IN_PROGRESS],
    requiredDecision: 'Agent starts job',
  },
  {
    status: JobStatus.JOB_IN_PROGRESS,
    label: 'Job In Progress',
    owner: 'Field Agent',
    description: 'Agent actively working on installation',
    nextPossibleStatuses: [JobStatus.JOB_COMPLETED, JobStatus.JOB_FAILED, JobStatus.REWORK_REQUIRED],
    requiredDecision: 'Job completion outcome',
  },
  {
    status: JobStatus.JOB_COMPLETED,
    label: 'Job Completed',
    owner: 'Field Agent',
    description: 'Installation completed successfully',
    nextPossibleStatuses: [],
  },
  {
    status: JobStatus.JOB_FAILED,
    label: 'Job Failed',
    owner: 'Field Agent',
    description: 'Installation failed due to site issue',
    nextPossibleStatuses: [JobStatus.BACKEND_NOTIFIED],
    requiredDecision: 'Operations review',
  },
  {
    status: JobStatus.REWORK_REQUIRED,
    label: 'Rework Required',
    owner: 'Field Agent',
    description: 'Issue encountered, requires rework',
    nextPossibleStatuses: [JobStatus.ENGINEER_ASSIGNED],
    requiredDecision: 'Operations review and reassignment',
  },
  {
    status: JobStatus.BACKEND_NOTIFIED,
    label: 'Backend Notified',
    owner: 'ORIT',
    description: 'Business Unit notified of issue',
    nextPossibleStatuses: [],
  },
];

export function getStatusLifecycle(status: JobStatus): StatusLifecycle | undefined {
  return JOB_LIFECYCLE.find((s) => s.status === status);
}

export function getNextStatuses(currentStatus: JobStatus): JobStatus[] {
  const lifecycle = getStatusLifecycle(currentStatus);
  return lifecycle?.nextPossibleStatuses || [];
}

export function canTransitionTo(from: JobStatus, to: JobStatus): boolean {
  const nextStatuses = getNextStatuses(from);
  return nextStatuses.includes(to);
}

export function getStatusOwner(status: JobStatus): 'ORIT' | 'Operations' | 'Field Agent' {
  const lifecycle = getStatusLifecycle(status);
  return lifecycle?.owner || 'ORIT';
}

export function getStatusLabel(status: JobStatus): string {
  const lifecycle = getStatusLifecycle(status);
  return lifecycle?.label || status.replace(/_/g, ' ');
}

export function getStatusDescription(status: JobStatus): string {
  const lifecycle = getStatusLifecycle(status);
  return lifecycle?.description || '';
}

export function getRequiredDecision(status: JobStatus): string | undefined {
  const lifecycle = getStatusLifecycle(status);
  return lifecycle?.requiredDecision;
}
