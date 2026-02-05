# Auto Rework Order Generation - Implementation Summary

## ✅ Implementation Complete

This document describes the auto-rework order generation feature that has been successfully implemented in the Openreach ORIT system.

---

## 🎯 Feature Overview

When a field agent marks a job as **"Rework Required"**, the system automatically:
1. Creates a new rework order ticket
2. Links it to the original order
3. Generates audit logs
4. Sends notifications to both Operations and Field Agent
5. Displays the rework order in the operational queue

---

## 🔧 Technical Implementation

### 1. **Type System Updates** (`types.ts`)

Added new fields to the `Job` interface:
```typescript
parentOrderId?: string;           // Links rework order to original
reworkReason?: string;             // Reason for rework
createdFrom?: 'FIELD_AGENT' | 'OPERATIONS';
hasReworkTicket?: boolean;         // Original order flag
reworkTicketId?: string;           // Reference to rework ticket
```

Added new status:
```typescript
REWORK_INITIATED = 'REWORK_INITIATED'
```

### 2. **Context Logic** (`AppContext.tsx`)

**Auto-Generation Logic:**
- Triggers when `JobStatus.REWORK_REQUIRED` is set
- Creates deterministic rework order ID: `RWK-{originalOrderId}-{counter}`
- Counter increments for multiple reworks: `-01`, `-02`, etc.
- Copies all relevant data from original order
- Resets field-specific data (ONT serial, photos, etc.)

**Audit Trail:**
- Logs rework creation with system actor
- Links to parent order
- Captures rework reason

**Notifications:**
- Operations: "New Rework Ticket Generated for Order {ID}"
- Field Agent: "Rework ticket created and pending reassignment"

### 3. **Operations UI** (`JobOperations.tsx`)

**KPI Dashboard:**
- Changed "Material Procuring" card to "Rework Orders"
- Shows count of all rework-related orders

**Order Table:**
- Rework orders have orange background tint
- Rework icon (↻) displayed next to order ID
- Original orders with rework show "View Rework Ticket" button
- Rework orders show "Re-evaluate Order" button

**Detail Modal:**
- Orange alert banner for rework orders
- Shows parent order ID (clickable)
- Shows rework reason
- Shows creation source
- Original orders show rework ticket reference

### 4. **Field Agent UI** (`FieldAgentJobs.tsx`)

**Completion Modal:**
Updated issue categories to match requirements:
- Fibre issue
- Access denied
- Hardware missing
- Signal issue
- Other

**Workflow:**
1. Agent selects "Rework Required"
2. Selects category from dropdown
3. Adds details
4. System auto-generates rework order on submission

### 5. **Status Badge** (`StatusBadge.tsx`)

Added styling for `REWORK_INITIATED` status:
- Orange background
- Distinct from other statuses

### 6. **Workflow Timeline** (`WorkflowTimeline.tsx`)

Updated to include `REWORK_INITIATED` in the "Inventory Audit" step, allowing rework orders to follow the same workflow as new orders.

---

## 📋 Workflow Example

### Scenario: Fibre Issue Encountered

1. **Field Agent** (dave.engineer):
   - Arrives at site for order `OR-FTTP-2024-10234`
   - Starts job → Status: `JOB_IN_PROGRESS`
   - Encounters fibre blockage
   - Selects "Rework Required"
   - Category: "Fibre issue"
   - Details: "Underground fibre damaged, needs repair"
   - Submits

2. **System Auto-Actions**:
   - Original order → Status: `REWORK_REQUIRED`
   - Creates new order: `RWK-OR-FTTP-2024-10234-01`
   - Status: `REWORK_INITIATED`
   - Links: `parentOrderId = OR-FTTP-2024-10234`
   - Audit logs created for both orders
   - Notifications sent

3. **Operations View**:
   - Sees original order with "View Rework Ticket" button
   - Sees new rework order in queue with ↻ icon
   - Can click "Re-evaluate Order" to start workflow
   - Rework order follows normal flow: Inventory → Site Check → Assign → Complete

4. **Notifications**:
   - Operations: "New Rework Ticket Generated for Order OR-FTTP-2024-10234"
   - Field Agent: "Rework ticket created and pending reassignment"

---

## 🔒 Data Rules (Strictly Followed)

✅ **Hardcoded/Shared State Only**
- No backend calls
- No API requests
- All data in React Context

✅ **Deterministic ID Generation**
- Format: `RWK-{parentId}-{counter}`
- Counter based on existing rework orders
- No randomness

✅ **Proper Linking**
- Bidirectional references
- Parent knows about rework ticket
- Rework knows about parent

✅ **Audit Trail**
- All actions logged
- Actor tracked
- Timestamps recorded
- Reasons captured

---

## 🎨 UI Behavior

### Visual Indicators

**Rework Orders:**
- Orange background tint in table
- ↻ (refresh/rework) icon
- "REWORK INITIATED" badge (orange)

**Original Orders with Rework:**
- "View Rework Ticket" button
- Alert banner in detail view
- Clickable rework ticket reference

**Notifications:**
- Real-time alerts
- Role-based filtering
- Clickable to navigate to order

### User Experience

**Operations User:**
1. Receives notification of rework
2. Sees rework order in queue
3. Can view both original and rework orders
4. Can process rework through normal workflow

**Field Agent:**
1. Marks job as rework required
2. Receives confirmation notification
3. Rework order appears in their queue when reassigned

---

## 🧪 Testing Scenarios

### Test 1: Create First Rework
1. Login as field agent (dave.engineer)
2. Select any assigned job
3. Start job
4. Complete → Select "Rework Required"
5. Category: "Fibre issue"
6. Details: "Test rework"
7. Submit
8. **Expected**: New order `RWK-{originalId}-01` created

### Test 2: Multiple Reworks
1. Repeat Test 1 on same original order
2. **Expected**: New order `RWK-{originalId}-02` created

### Test 3: Operations View
1. Login as operations (sarah.ops)
2. Check notifications
3. **Expected**: "New Rework Ticket Generated" notification
4. Navigate to Jobs
5. **Expected**: See rework order with ↻ icon
6. Click original order
7. **Expected**: See "View Rework Ticket" button

### Test 4: Workflow Continuation
1. As operations, click rework order
2. Click "Re-evaluate Order"
3. **Expected**: Rework order follows normal workflow
4. Can assign to field agent
5. Field agent can complete

---

## 📊 Data Structure Example

```typescript
// Original Order (after rework marked)
{
  id: "OR-FTTP-2024-10234",
  status: "REWORK_REQUIRED",
  hasReworkTicket: true,
  reworkTicketId: "RWK-OR-FTTP-2024-10234-01",
  blockageType: "Fibre issue",
  // ... other fields
}

// Auto-Generated Rework Order
{
  id: "RWK-OR-FTTP-2024-10234-01",
  status: "REWORK_INITIATED",
  parentOrderId: "OR-FTTP-2024-10234",
  reworkReason: "Fibre issue",
  createdFrom: "FIELD_AGENT",
  customerName: "TechCorp Solutions", // Copied from original
  address: "15 High Street, Manchester", // Copied from original
  // ... other copied fields
  assignedAgentId: undefined, // Reset
  ontSerialNumber: undefined, // Reset
  photos: undefined, // Reset
}
```

---

## 🚀 Key Features

✅ Automatic rework order generation  
✅ Deterministic ID pattern  
✅ Bidirectional linking  
✅ Complete audit trail  
✅ Real-time notifications  
✅ Visual indicators (icons, badges, colors)  
✅ Clickable navigation between linked orders  
✅ Rework orders follow same workflow as new orders  
✅ No backend/API dependencies  
✅ No randomness - fully deterministic  

---

## 📝 Files Modified

1. `types.ts` - Added rework-related fields and status
2. `AppContext.tsx` - Auto-generation logic, notifications, audit logs
3. `JobOperations.tsx` - UI updates, rework display, linking
4. `FieldAgentJobs.tsx` - Updated issue categories
5. `StatusBadge.tsx` - Added REWORK_INITIATED styling
6. `WorkflowTimeline.tsx` - Included rework status in workflow

---

## ✨ Enterprise-Grade Behavior

This implementation simulates real Openreach internal system behavior:

- **Automatic ticket generation** - No manual intervention needed
- **Deterministic tracking** - Every rework has predictable ID
- **Full traceability** - Complete audit trail maintained
- **Bidirectional linking** - Easy navigation between related orders
- **Role-based notifications** - Right people get right alerts
- **Workflow continuity** - Rework orders follow standard process
- **Visual distinction** - Clear identification of rework orders

---

## 🎉 Implementation Status: COMPLETE

All requirements have been successfully implemented with:
- ✅ Hardcoded/shared state only
- ✅ No backend/API calls
- ✅ Deterministic ID generation
- ✅ Complete audit trail
- ✅ Bidirectional linking
- ✅ Real-time notifications
- ✅ Visual indicators
- ✅ Enterprise-grade behavior

The system is ready for testing and demonstration.
