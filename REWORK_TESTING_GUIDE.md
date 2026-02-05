# Quick Test Guide - Rework Order Feature

## 🚀 Quick Start Testing

### Prerequisites
```bash
npm install
npm run dev
```

---

## 📋 Test Scenario 1: Field Agent Creates Rework

### Steps:
1. **Login as Field Agent**
   - Username: `dave.engineer`
   - Role: `FIELD_AGENT`

2. **Navigate to "My Jobs"**
   - Should see assigned jobs

3. **Select a Job**
   - Click on any job card (e.g., `OR-FTTP-2024-10241`)

4. **Start the Job**
   - Click "Arrived at Site" or "Start On-Site Task"
   - Status changes to `JOB_IN_PROGRESS`

5. **Mark as Rework Required**
   - Click "Complete Job" button
   - Select "⚠ Rework Required"
   - Choose category: "Fibre issue"
   - Add details: "Underground cable damaged"
   - Click "Confirm & Submit"

6. **Verify Auto-Generation**
   - Check notifications (bell icon)
   - Should see: "Rework ticket created and pending reassignment"

---

## 📋 Test Scenario 2: Operations Views Rework

### Steps:
1. **Login as Operations**
   - Username: `sarah.ops`
   - Role: `ORIT_OPS`

2. **Check Notifications**
   - Click bell icon (top right)
   - Should see: "New Rework Ticket Generated for Order OR-FTTP-2024-10241"
   - Click notification to navigate

3. **View Rework Orders Dashboard**
   - Navigate to "Orders"
   - Check KPI card: "Rework Orders" (should show count)

4. **Identify Rework Order in Table**
   - Look for orange background tint
   - Look for ↻ icon next to order ID
   - Order ID format: `RWK-OR-FTTP-2024-10241-01`

5. **View Original Order**
   - Click on original order (e.g., `OR-FTTP-2024-10241`)
   - Should see orange alert banner: "Rework Initiated"
   - Should see "View Rework Ticket" button
   - Click button to navigate to rework order

6. **View Rework Order Details**
   - Click on rework order (e.g., `RWK-OR-FTTP-2024-10241-01`)
   - Should see orange alert banner: "Rework Order"
   - Should see parent order link (clickable)
   - Should see rework reason: "Fibre issue"
   - Should see "Created from: FIELD_AGENT"

---

## 📋 Test Scenario 3: Process Rework Order

### Steps:
1. **As Operations User**
   - Navigate to rework order
   - Click "Re-evaluate Order"
   - Status changes to `INVENTORY_CHECK_PENDING`

2. **Follow Normal Workflow**
   - Verify Inventory Status → Select "Fully Available"
   - Run Site Serviceability → Select "Serviceable"
   - Verify Node Capacity
   - Allocate Local Stock → Select "Fully Available"
   - Agent gets assigned automatically

3. **As Field Agent**
   - Login as field agent
   - Should see rework order in "My Jobs"
   - Can complete like any other job

---

## 📋 Test Scenario 4: Multiple Reworks

### Steps:
1. **Create First Rework**
   - Follow Test Scenario 1
   - Rework ID: `RWK-OR-FTTP-2024-10241-01`

2. **Create Second Rework (Same Original Order)**
   - Assign original order to agent again (manually via operations)
   - Field agent marks as rework again
   - Rework ID: `RWK-OR-FTTP-2024-10241-02`

3. **Verify Counter Increment**
   - Check that counter increments: `-01`, `-02`, `-03`, etc.

---

## ✅ Expected Behaviors Checklist

### Auto-Generation
- [ ] Rework order created immediately when field agent submits
- [ ] Rework ID follows pattern: `RWK-{originalId}-{counter}`
- [ ] Counter increments for multiple reworks
- [ ] No randomness in ID generation

### Linking
- [ ] Original order has `hasReworkTicket: true`
- [ ] Original order has `reworkTicketId` reference
- [ ] Rework order has `parentOrderId` reference
- [ ] Rework order has `reworkReason` captured

### Notifications
- [ ] Operations receives: "New Rework Ticket Generated"
- [ ] Field agent receives: "Rework ticket created and pending reassignment"
- [ ] Notifications are clickable and navigate to correct order
- [ ] Notifications show in bell icon with count

### UI Indicators
- [ ] Rework orders have orange background tint in table
- [ ] Rework orders have ↻ icon next to ID
- [ ] Original orders show "View Rework Ticket" button
- [ ] Rework orders show "Re-evaluate Order" button
- [ ] Detail view shows orange alert banners
- [ ] Parent/child order links are clickable

### Audit Trail
- [ ] Rework creation logged with system actor
- [ ] Original order status change logged
- [ ] Rework reason captured in logs
- [ ] Timestamps recorded correctly

### Workflow
- [ ] Rework orders follow same workflow as new orders
- [ ] Can progress through all stages
- [ ] Can be assigned to field agents
- [ ] Can be completed successfully

---

## 🐛 Common Issues & Solutions

### Issue: Rework order not appearing
**Solution**: Refresh the page or check that you're logged in as operations user

### Issue: Notification not showing
**Solution**: Check that you're viewing notifications for the correct role (Operations vs Field Agent)

### Issue: Can't click "View Rework Ticket"
**Solution**: Ensure the original order has `hasReworkTicket: true` and `reworkTicketId` set

### Issue: Counter not incrementing
**Solution**: Check that multiple rework orders are being created for the same parent order

---

## 🎯 Key Test Points

1. **Deterministic IDs**: No randomness, predictable pattern
2. **Bidirectional Links**: Can navigate both ways
3. **Audit Trail**: All actions logged
4. **Notifications**: Real-time alerts
5. **Visual Distinction**: Easy to identify rework orders
6. **Workflow Continuity**: Rework orders follow normal process

---

## 📊 Test Data

### Test Users
- **Operations**: `sarah.ops` (ORIT_OPS)
- **Field Agent 1**: `dave.engineer` (Manchester)
- **Field Agent 2**: `emma.engineer` (London)

### Test Orders (Pre-assigned)
- `OR-FTTP-2024-10241` - Assigned to dave.engineer
- `OR-ETH-2024-10239` - Assigned to dave.engineer
- `OR-FTTP-2024-10235` - Assigned to emma.engineer

### Rework Categories
- Fibre issue
- Access denied
- Hardware missing
- Signal issue
- Other

---

## ✨ Success Criteria

✅ Field agent can mark job as rework required  
✅ System auto-generates rework order with deterministic ID  
✅ Both orders are properly linked (bidirectional)  
✅ Notifications sent to both roles  
✅ Audit logs created for all actions  
✅ Visual indicators clearly identify rework orders  
✅ Rework orders can be processed through normal workflow  
✅ No backend/API calls made  
✅ No randomness in any part of the system  

---

## 🎉 Happy Testing!

If all checklist items pass, the implementation is working correctly!
