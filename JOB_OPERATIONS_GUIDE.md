# Job Operations Page - Quick Reference

## Purpose

**Job Operations** is the Operations User's monitoring dashboard for tracking field agent execution in real-time.

## Location

- **Route**: `/jobs`
- **Access**: Operations Users (ORIT_OPS role) only
- **Navigation**: Sidebar → "Job Operations"

---

## What It Does

### 1. **Real-Time Field Monitoring**
- Shows all jobs currently assigned to field agents
- Tracks job progress through field execution stages
- Displays field-captured data (ONT serials, photos, notes)

### 2. **Filter Views**
```
All Jobs       → Complete job list
In Field       → ENGINEER_ASSIGNED + JOB_IN_PROGRESS
Completed      → JOB_COMPLETED + JOB_FAILED
```

### 3. **KPI Metrics**
- **Active in Field**: Jobs currently being worked on
- **Completed Today**: Successfully finished installations
- **Issues / Rework**: Failed jobs or rework required

### 4. **Job Details Modal**
Click any job to see:
- Customer information
- Assigned agent details
- Field-captured data (ONT serial, fibre route)
- Evidence photos
- Complete audit trail with reasons

---

## Key Differences from Dashboard

| Feature | Dashboard | Job Operations |
|---------|-----------|----------------|
| **Focus** | Pre-field workflow | Field execution |
| **Actions** | Site checks, inventory, assignment | View-only monitoring |
| **Statuses** | ORDER_RECEIVED → ENGINEER_ASSIGNED | ENGINEER_ASSIGNED → JOB_COMPLETED |
| **Data** | ORIT system data | Field-captured data |

---

## Use Cases

### 1. **Monitor Field Progress**
Operations can see which agents are actively working and their progress.

### 2. **Verify Field Data**
Check that agents captured required information:
- ONT serial numbers
- Installation photos
- Fibre route types
- Site notes

### 3. **Track Completion Rate**
Monitor how many jobs are being completed vs. requiring rework.

### 4. **Audit Field Activity**
Review complete history of field agent actions with reasons.

---

## Example Workflow

1. **Operations assigns job** (Dashboard)
   - Status: ENGINEER_ASSIGNED
   - Agent: Dave Mitchell

2. **Agent starts job** (Field Agent App)
   - Status: JOB_IN_PROGRESS
   - Operations sees in "Job Operations" → In Field filter

3. **Agent captures data**
   - ONT Serial: BT-99-AABB
   - Photos: 2 uploaded
   - Operations can view in real-time

4. **Agent completes job**
   - Status: JOB_COMPLETED
   - Operations sees in "Job Operations" → Completed filter
   - All field data visible for verification

---

## Technical Details

**Component**: `pages/JobOperations.tsx`

**Key Features**:
- Read-only view (no status changes)
- Real-time data from AppContext
- Filter by execution stage
- Detailed modal with audit trail
- Field data verification

**Data Displayed**:
```typescript
- Job ID, Customer, Service Type
- Assigned Agent ID & Region
- Current Status
- ONT Serial Number (if captured)
- Fibre Route Type (if captured)
- Installation Photos (if uploaded)
- Agent Notes
- Complete Audit Trail
```

---

## Summary

**Job Operations** = Operations User's window into field execution.

It answers:
- ✅ Which jobs are agents working on right now?
- ✅ What data have agents captured?
- ✅ Are installations being completed successfully?
- ✅ What issues are agents encountering?

**It does NOT**:
- ❌ Change job statuses (that's the Dashboard)
- ❌ Assign agents (that's the Dashboard)
- ❌ Capture field data (that's the Field Agent App)
