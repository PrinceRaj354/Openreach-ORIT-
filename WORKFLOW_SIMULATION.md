# Enterprise Workflow Simulation - Implementation Guide

## Overview

This document describes the **decision-driven workflow simulation** layer added to the BT/Openreach Field Agent application. The enhancement ensures every status transition is intentional, explainable, and ownership-aware.

---

## Core Principles

### ✅ What We Simulate
- **Decision outcomes** (not backend execution)
- **Preconditions** for status transitions
- **Ownership** (ORIT System, Operations User, Field Agent)
- **Side effects** (notifications, audit logs)
- **Business logic** validation

### ❌ What We Do NOT Simulate
- API calls or async backend processes
- Random timers or delays (except minimal UX feedback)
- Technical backend infrastructure
- Database transactions

---

## Key Features

### 1. Gated Status Transitions

**Before Enhancement:**
- Free-form "Next Status" buttons
- Random outcome generation
- No validation or preconditions

**After Enhancement:**
- Status changes only occur after explicit business decisions
- Preconditions must be met before transition buttons appear
- Decision modals capture user intent

**Example:**
```typescript
// Operations User must select site check outcome
Site Check Decision Modal:
  ✓ Site Serviceable → INVENTORY_AVAILABLE
  ✗ Not Serviceable → SITE_CHECK_FAILED
  ⚠ Civil Work Required → SITE_CHECK_FAILED
```

---

### 2. Decision-Driven UI Actions

Every workflow stage presents explicit decision inputs before allowing transitions.

#### Operations Dashboard Decisions

**Site Check (SITE_CHECK_PENDING → next status)**
- Decision Options:
  - ✓ Site Serviceable
  - ✗ Not Serviceable  
  - ⚠ Civil Work Required
- Required: Outcome selection
- Optional: Notes field
- Result: Status updates with reason logged

**Inventory Allocation (INVENTORY_AVAILABLE → next status)**
- Decision Options:
  - ✓ Fully Available (assigns agent)
  - ⚠ Partially Available
  - ✗ Not Available
- Required: Inventory status selection
- Optional: Missing items, ETA notes
- Result: Agent assignment or procurement trigger

#### Field Agent Decisions

**Job Completion (JOB_IN_PROGRESS → next status)**
- Decision Options:
  - ✓ Completed Successfully
  - ⚠ Rework Required
  - ✗ Job Failed
- Required for success: ONT serial, photos
- Required for failure: Issue category, details
- Result: Job completion or escalation

---

### 3. Status Change Explanation (Audit Trail)

Every status update automatically generates and displays:

```typescript
interface AuditLog {
  action: string;           // "Status change to ENGINEER_ASSIGNED"
  reason: string;           // "All inventory allocated and agent Dave Mitchell assigned"
  actor: string;            // "ORIT System" | "Dave Mitchell (Field Agent)"
  timestamp: string;        // ISO timestamp
  previousStatus: JobStatus;
  newStatus: JobStatus;
  decision?: WorkflowDecision;
}
```

**Display Format:**
```
Status changed to ENGINEER_ASSIGNED
Reason: All inventory allocated and agent Dave Mitchell assigned
Updated by: ORIT System
Time: 10:42 AM
```

**Visible in:**
- Job details modal (Operations Dashboard)
- Field Agent job sheet (Logs tab)
- Audit trail panel (enhanced display)

---

### 4. Visual Status Timeline

The `WorkflowTimeline` component shows:
- ✓ Completed statuses (green checkmark)
- → Current status (highlighted)
- ○ Upcoming statuses (disabled/grey)

**Ownership Indicators:**
- Purple: ORIT System
- Blue: Operations User
- Green: Field Agent

**Implementation:**
```tsx
<WorkflowTimeline currentStatus={job.status} />
```

---

### 5. Ownership Enforcement

**ORIT / Operations Controls:**
- Order intake
- Site feasibility checks
- Inventory allocation
- Agent assignment
- Procurement triggers
- Backend notifications

**Field Agent Controls:**
- Job start (ENGINEER_ASSIGNED → JOB_IN_PROGRESS)
- Job completion outcomes
- Issue reporting
- Evidence capture (ONT serial, photos)

**UI Enforcement:**
- Buttons hidden for invalid role actions
- Read-only states for cross-role data
- Ownership hints in status badges

---

### 6. Side-Effect Simulation

Each status transition triggers UI-level side effects:

**Bidirectional Notifications:**

Operations → Field Agent:
```typescript
ENGINEER_ASSIGNED → Notification to Field Agent
"A new FTTP order (OR-2024-001) has been assigned to you by ORIT."
```

Field Agent → Operations:
```typescript
JOB_IN_PROGRESS → Notification to Operations
"Agent Dave Mitchell has arrived at site and started OR-2024-001."

JOB_COMPLETED → Notification to Operations
"Agent Dave Mitchell has finished installation for OR-2024-001. Awaiting system activation."

REWORK_REQUIRED → Notification to Operations
"Field Alert: Agent Dave Mitchell reported a blockage for OR-2024-001."
```

**Audit Log Entries:**
- Appended on every status change
- Include decision metadata
- Timestamped and actor-attributed

**Action Enablement:**
- Next workflow buttons appear/disappear
- Form validation triggers
- SLA warning badges

---

### 7. Light Delay Simulation (Conceptual)

Static delay indicators reflect real-world operations:

**Examples:**
- "Waiting for procurement (ETA: 2 days)" - displayed as status badge
- "SLA risk: engineer unavailable today" - warning banner
- "Syncing ORIT..." - 1.5s visual feedback on job completion

**Implementation:**
```typescript
// Minimal UX feedback only
setIsSyncing(true);
await new Promise(r => setTimeout(r, 1500));
updateJobStatus(...);
setIsSyncing(false);
```

**No real timers or async logic** - just user perception of system processing.

---

## Implementation Details

### Enhanced Types (`types.ts`)

```typescript
export type WorkflowActor = 'ORIT System' | 'Operations User' | 'Field Agent' | 'Dispatcher';

export interface WorkflowDecision {
  type: string;
  outcome: string;
  reason: string;
  actor: WorkflowActor;
  timestamp: string;
}

export interface AuditLog {
  // ... existing fields
  reason?: string;
  decision?: WorkflowDecision;
}

export type SiteCheckOutcome = 'serviceable' | 'not_serviceable' | 'civil_work_required';
export type InventoryOutcome = 'fully_available' | 'partially_available' | 'not_available';
export type JobCompletionOutcome = 'completed_successfully' | 'issue_encountered' | 'rework_required';
```

### Workflow Utilities (`workflow.ts`)

```typescript
export interface StatusLifecycle {
  status: JobStatus;
  label: string;
  owner: 'ORIT' | 'Operations' | 'Field Agent';
  description: string;
  nextPossibleStatuses: JobStatus[];
  requiredDecision?: string;
}

export const JOB_LIFECYCLE: StatusLifecycle[] = [
  // Complete lifecycle definition with ownership and transitions
];

export function canTransitionTo(from: JobStatus, to: JobStatus): boolean;
export function getStatusOwner(status: JobStatus): string;
export function getRequiredDecision(status: JobStatus): string | undefined;
```

### Enhanced Context (`AppContext.tsx`)

```typescript
updateJobStatus: (
  jobId: string,
  newStatus: JobStatus,
  actor: User,
  metadata?: Partial<Job>,
  decision?: { reason: string; outcome?: string }
) => void;
```

**Decision parameter captures:**
- Human-readable reason
- Decision outcome code
- Automatically creates WorkflowDecision object
- Generates bidirectional notifications

---

## User Experience Flow

### Operations User Journey

1. **Order Received** → Click "Verify Node Capacity"
   - System updates to SITE_CHECK_PENDING
   - Reason: "Node capacity verified, initiating site feasibility check"

2. **Site Check Pending** → Click "Run Site Feasibility"
   - Modal appears with 3 decision options
   - User selects outcome + optional notes
   - Click "Confirm Decision"
   - System updates to INVENTORY_AVAILABLE or SITE_CHECK_FAILED
   - Reason: "Site check passed: Location serviceable for installation"

3. **Inventory Available** → Click "Allocate Local Stock"
   - Modal appears with 3 inventory status options
   - User selects "Fully Available"
   - System assigns agent automatically
   - Updates to ENGINEER_ASSIGNED
   - Reason: "All inventory allocated and agent Dave Mitchell assigned"
   - **Notification sent to Field Agent**

4. **View Job Details**
   - Audit trail shows all decisions with reasons
   - Timeline shows progress through lifecycle
   - Field sync data visible (ONT serial, photos when captured)

### Field Agent Journey

1. **Receives Notification**
   - "New Job Assigned: OR-2024-001"
   - Opens job from Daily Route list

2. **Engineer Assigned** → Click "Start On-Site Task"
   - System updates to JOB_IN_PROGRESS
   - Reason: "Agent Dave Mitchell arrived at site and commenced installation"
   - **Notification sent to Operations**

3. **Capture Evidence**
   - Enter ONT serial number (mandatory)
   - Select fibre route type
   - Upload photos (mandatory)
   - Add notes

4. **Complete Job** → Click "Complete Job"
   - Modal appears with 3 completion outcomes
   - For success: validates ONT serial + photos
   - For failure: requires issue category + details
   - Click "Confirm & Submit"
   - System updates to JOB_COMPLETED, REWORK_REQUIRED, or JOB_FAILED
   - Reason: "Installation completed successfully by Dave Mitchell. ONT BT-99-AABB registered."
   - **Notification sent to Operations**

---

## Presentation Talking Points

### "Why This Approach?"

> "Each status transition represents a validated backend decision. We simulate decision outcomes, ownership, and side effects to demonstrate workflow correctness, without over-engineering backend execution."

### "What Makes It Enterprise-Grade?"

1. **Intentional Transitions**: No arbitrary status changes
2. **Clear Ownership**: Every action has a responsible actor
3. **Audit Trail**: Complete history with reasons
4. **Bidirectional Sync**: Operations ↔ Field Agent notifications
5. **Validation**: Preconditions enforced before transitions
6. **Explainability**: Every change has a "why" and "who"

### "How Is This Different from a Demo?"

**Demo Approach:**
- Random outcomes
- "Next Status" buttons
- No validation
- No audit trail

**Enterprise Simulation:**
- Decision-driven outcomes
- Gated transitions
- Business rule validation
- Complete audit trail with reasons
- Role-based ownership
- Bidirectional notifications

---

## Testing the Workflow

### Test Scenario 1: Happy Path

1. Login as Operations User (ORIT_OPS)
2. Select job with status ORDER_RECEIVED
3. Click "Verify Node Capacity" → SITE_CHECK_PENDING
4. Click "Run Site Feasibility" → Select "Site Serviceable" → INVENTORY_AVAILABLE
5. Click "Allocate Local Stock" → Select "Fully Available" → ENGINEER_ASSIGNED
6. Check notifications panel → Field Agent notified
7. Logout and login as Field Agent
8. Open assigned job → Click "Start On-Site Task" → JOB_IN_PROGRESS
9. Fill ONT serial, upload photos
10. Click "Complete Job" → Select "Completed Successfully" → JOB_COMPLETED
11. Logout and login as Operations → Check notifications → Completion notified

### Test Scenario 2: Failure Path

1. Operations: Site check → Select "Civil Work Required" → SITE_CHECK_FAILED
2. Check audit trail → Reason logged
3. Status cannot progress (terminal state)

### Test Scenario 3: Rework Path

1. Field Agent: Job in progress
2. Click "Complete Job" → Select "Rework Required"
3. Choose issue category "Fibre Blockage"
4. Enter details
5. Confirm → REWORK_REQUIRED
6. Operations receives notification
7. Check audit trail → Full context visible

---

## Code Locations

- **Types**: `types.ts` (WorkflowDecision, AuditLog enhancements)
- **Workflow Logic**: `workflow.ts` (StatusLifecycle, validation functions)
- **Context**: `AppContext.tsx` (enhanced updateJobStatus)
- **Operations UI**: `pages/OpsDashboard.tsx` (decision modals)
- **Field Agent UI**: `pages/FieldAgentJobs.tsx` (completion modal)
- **Timeline**: `components/WorkflowTimeline.tsx` (visual lifecycle)

---

## Future Enhancements (Out of Scope)

- Real backend API integration
- Async job processing
- Multi-agent coordination
- Real-time WebSocket updates
- Advanced SLA calculations
- Geolocation tracking
- Photo upload to cloud storage

---

## Summary

This enterprise workflow simulation provides:

✅ **Decision-driven** status transitions  
✅ **Explainable** audit trail with reasons  
✅ **Ownership-aware** role enforcement  
✅ **Bidirectional** notifications  
✅ **Validation** of preconditions  
✅ **Professional** UX with modals and confirmations  

**Result**: A prototype that feels enterprise-real, not demo-fake, and can be confidently presented to BT/Openreach architects.
