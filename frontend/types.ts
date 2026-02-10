
export enum UserRole {
  ORIT_OPS = 'ORIT_OPS',
  FIELD_AGENT = 'FIELD_AGENT'
}

// User interface for authentication and regional context
export interface User {
  id: string;
  username: string;
  role: UserRole;
  region: string;
}

export enum JobStatus {
  ORDER_RECEIVED = 'ORDER_RECEIVED',
  INVENTORY_CHECK_PENDING = 'INVENTORY_CHECK_PENDING',
  SITE_CHECK_PENDING = 'SITE_CHECK_PENDING',
  SITE_CHECK_FAILED = 'SITE_CHECK_FAILED',
  NODE_CAPACITY_PENDING = 'NODE_CAPACITY_PENDING',
  INVENTORY_ALLOCATION_PENDING = 'INVENTORY_ALLOCATION_PENDING',
  INVENTORY_MISSING = 'INVENTORY_MISSING',
  WAITING_FOR_PROCUREMENT = 'WAITING_FOR_PROCUREMENT',
  ENGINEER_ASSIGNED = 'ENGINEER_ASSIGNED',
  JOB_IN_PROGRESS = 'JOB_IN_PROGRESS',
  JOB_COMPLETED = 'JOB_COMPLETED',
  JOB_FAILED = 'JOB_FAILED',
  REWORK_REQUIRED = 'REWORK_REQUIRED',
  REWORK_INITIATED = 'REWORK_INITIATED',
  BACKEND_NOTIFIED = 'BACKEND_NOTIFIED'
}

export type FibreRouteType = 'Overhead' | 'Underground';

export interface Job {
  id: string;
  customerName: string;
  address: string;
  postcode: string;
  serviceType: 'FTTP' | 'FTTC' | 'Ethernet';
  sla: 'Standard' | 'Premium';
  status: JobStatus;
  scheduledDate: string;
  assignedAgentId?: string;
  region: string;
  coordinates: [number, number];
  notes?: string;
  ontSerialNumber?: string;
  fibreRoute?: FibreRouteType;
  photos?: string[];
  lastUpdated: string;
  drillRequired?: boolean;
  customerAvailable?: boolean;
  blockageType?: string;
  parentOrderId?: string;
  reworkReason?: string;
  createdFrom?: 'FIELD_AGENT' | 'OPERATIONS';
  hasReworkTicket?: boolean;
  reworkTicketId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fibre' | 'Hardware' | 'Cable';
  stock: number;
  exchange: string;
  status: 'In Stock' | 'Low' | 'Out of Stock';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  jobId: string;
  timestamp: string;
  isRead: boolean;
  targetRole?: UserRole;
}

export type WorkflowActor = 'ORIT System' | 'Operations User' | 'Field Agent' | 'Dispatcher';

export interface WorkflowDecision {
  type: string;
  outcome: string;
  reason: string;
  actor: WorkflowActor;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  jobId: string;
  action: string;
  actor: string;
  timestamp: string;
  previousStatus: JobStatus;
  newStatus: JobStatus;
  reason?: string;
  decision?: WorkflowDecision;
}

// Site Check Decision Options
export type SiteCheckOutcome = 'serviceable' | 'not_serviceable' | 'civil_work_required';

export interface SiteCheckDecision {
  outcome: SiteCheckOutcome;
  notes?: string;
}

// Inventory Check Decision Options
export type InventoryOutcome = 'fully_available' | 'partially_available' | 'not_available';

export interface InventoryCheckDecision {
  outcome: InventoryOutcome;
  missingItems?: string[];
  eta?: string;
}

// Job Completion Decision Options
export type JobCompletionOutcome = 'completed_successfully' | 'issue_encountered' | 'rework_required';

export interface JobCompletionDecision {
  outcome: JobCompletionOutcome;
  issueCategory?: string;
  issueDetails?: string;
}

// Assignment Decision
export interface AssignmentDecision {
  agentId: string;
  agentName: string;
  reason: string;
}

export interface AnalyticsData {
  siteCheckSuccessRate: number;
  avgInstallDurationHours: number;
  procurementDelayImpact: number;
  reworkRate: number;
  slaBreachRisk: number;
  regionCompletion: { region: string; rate: number }[];
}
