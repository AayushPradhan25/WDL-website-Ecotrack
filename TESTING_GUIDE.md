# 🧪 EcoSmart Integration Testing Guide

## ✅ Pre-Testing Checklist

### Backend Setup
```bash
cd eco-smart-backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

The backend should start at `http://localhost:3000`

### Test Credentials
**Admin User:**
- Email: `admin@ecosmart.com`
- Password: `admin123456`

**Regular User:**
- Email: `john@example.com`
- Password: `user123456`

---

## 🧑‍💼 Admin Portal Testing

### 1. Truck Requests Management
**URL**: `http://localhost:3000/admin/truck-requests.html`

**Steps to Test**:
1. Log in with admin credentials
2. Sidebar should show "Truck Requests" link
3. Click to navigate to truck requests page
4. Page should load with request list
5. Click "Pending" filter to see pending requests
6. Click "Approve" button on any request
7. Request should move to "Approved" list
8. Click "Reject" and confirm - request moves to "Rejected" list

**Expected Features**:
- ✅ Real-time pending count in hero section
- ✅ Filter buttons working (All, Pending, Approved, Rejected)
- ✅ Request cards show: ID, user name, location, waste type, quantity
- ✅ Approve/Reject buttons appear only on pending requests
- ✅ Toast notifications on approve/reject actions

---

### 2. Schedule Management
**URL**: `http://localhost:3000/admin/schedules.html`

**Steps to Test**:
1. Click "Manage Schedules" in admin sidebar
2. Page loads showing existing schedules in grid
3. Click "+ Add New Schedule" button
4. Modal form opens
5. Fill in form:
   - Day: Wednesday
   - Time: 09:00
   - Location: Sector 15
   - Activity: Dustbin Cleaning
   - Truck: T-005
   - Duration: 90 minutes
6. Click "Save Schedule"
7. Toast notification appears
8. New schedule appears in grid
9. Click "Edit" on any schedule - form opens with prefilled data
10. Modify and save
11. Click "Delete" - confirm dialog appears
12. Schedule is removed from grid

**Expected Features**:
- ✅ Modal form opens/closes properly
- ✅ Form fields validate (required fields)
- ✅ Activity type icons show correctly (🚛 🧹 🌿 ⭐)
- ✅ Edit pre-fills form data
- ✅ Delete requires confirmation
- ✅ Grid refreshes after save/delete operations

---

### 3. Complaint Management
**URL**: `http://localhost:3000/admin/complaints.html`

**Steps to Test**:
1. Click "Complaints" in sidebar
2. See all complaints from all citizens
3. Click on any complaint
4. Click "Mark In Progress" (if visible)
5. Status should update
6. Back to list - complaint moved to appropriate category

**Expected Features**:
- ✅ Real-time badge showing pending count
- ✅ Can view complaint category (if submitted with one)
- ✅ Can update status from pending → in-progress → resolved
- ✅ Complaint list updates after status change

---

## 👤 Citizen Portal Testing

### 1. Raise a Complaint
**URL**: `http://localhost:3000/user/raise-complaint.html`

**Steps to Test**:
1. Log in with user credentials
2. Click "Raise Complaint" in sidebar
3. Fill complaint form:
   - **Category**: Select "Overflowing Bin"
   - **Title**: "Garbage overflow near gate 3"
   - **Description**: "Dustbin not emptied since morning, spilling waste"
   - **Location**: "Gate 3, Sector 14"
   - **Urgency**: "High"
   - **Photo**: (optional) Click to select image
4. Click "Submit Complaint"
5. Toast: "Complaint submitted! Admin notified instantly. +20 Eco Coins! 🌿"
6. Redirect to complaint-list.html

**Expected Features**:
- ✅ 6 category options with icons
- ✅ Category selection required before submit
- ✅ Photo preview shows after selection
- ✅ Toast notification on successful submission
- ✅ Complaint appears in "My Complaints" page immediately (or within 5 seconds)

---

### 2. View My Complaints
**URL**: `http://localhost:3000/user/complaint-list.html`

**Steps to Test**:
1. Click "My Complaints" in sidebar
2. See table with all your complaints
3. Table columns: Reference ID, Title, Location, Date, Status, Action
4. Click "View" on any complaint
5. Should navigate to complaint-details.html with full details
6. Status tracker shows progress (pending → in-progress → resolved)
7. Back button returns to list
8. Filter by status tabs: All, Pending, In Progress, Resolved

**Expected Features**:
- ✅ Sidebar visible on left (persistent)
- ✅ Table shows all complaints
- ✅ Filter tabs work and update table
- ✅ "File New Complaint" button visible in header
- ✅ No complaints message when filter returns empty

---

### 3. Complaint Details
**URL**: `http://localhost:3000/user/complaint-details.html?id=1`

**Steps to Test**:
1. From complaint-list, click "View" on any complaint
2. Page loads complaint details
3. See complaint title, description, location, category
4. Timeline shows status progress:
   - ✅ Filed (always completed)
   - In Progress (if status = "in-progress")
   - Resolved (if status = "resolved")
5. Right sidebar shows timeline and actions
6. Click "File Another" button - goes to raise-complaint form

**Expected Features**:
- ✅ Sidebar visible and persistent
- ✅ Back button works
- ✅ Status tracker shows correct progress
- ✅ All complaint details display correctly
- ✅ Timeline color-coded (green for completed)
- ✅ Actions buttons available

---

### 4. Request a Truck
**URL**: `http://localhost:3000/user/request-truck.html`

**Steps to Test**:
1. Click "Request Truck" in sidebar
2. Fill truck request form:
   - Location: "Sector 16"
   - Waste Type: "Bulky Waste"
   - Quantity: "3 bags"
   - Requested Date: (tomorrow's date)
   - Description: "Large furniture items for pickup"
3. Click "Submit Request"
4. Toast: "Truck request submitted! Awaiting admin approval."
5. Request appears in admin portal

**Expected Features**:
- ✅ Form validation works
- ✅ Date picker shows proper format
- ✅ Successful submission feedback
- ✅ Request accessible in admin panel

---

### 5. Live Truck Tracking
**URL**: `http://localhost:3000/user/livetracking.html`

**Steps to Test**:
1. Click "Live Tracking" in sidebar
2. Map loads with user location marker
3. Truck markers appear (may be sample data)
4. Nearest truck info displays on right panel
5. ETA calculated in minutes
6. Route timeline shows truck progress
7. If truck within 2km, proximity alert appears at top
8. Updates every 10 seconds (timestamp updates)

**Expected Features**:
- ✅ Map displays with Leaflet
- ✅ User location marked with green pin
- ✅ Trucks marked with orange trucks
- ✅ Proximity alert appears when truck < 2km away
- ✅ ETA and distance calculated
- ✅ Driver info displayed
- ✅ Route timeline shows upcoming stops

---

### 6. Truck Schedule
**URL**: `http://localhost:3000/user/truck-shedule.html`

**Steps to Test**:
1. Click "Truck Schedule" in sidebar
2. Weekly grid shows all 7 days
3. Each day shows scheduled collections/activities
4. Color coding: 🟢 Collection, 🔵 Cleaning, 🟡 Sanitization, 🟣 Special
5. List view below shows all activities in detail
6. Click bell icon to set reminder for activity

**Expected Features**:
- ✅ Week grid displays properly
- ✅ Today's column highlighted
- ✅ Activities show correct icons and colors
- ✅ Time displayed on each activity
- ✅ List view shows all activity details
- ✅ Reminder toggle works
- ✅ Responsive: grid changes to 4 columns on tablet

---

## 🌐 Cross-Cutting Features

### Sidebar Persistence
**Test on any page**:
1. Navigate between different pages (complaint-list → dashboard)
2. Sidebar should remain visible
3. Click sidebar toggle (collapse button)
4. Sidebar should collapse to narrow width
5. Main content expands
6. Refresh page - sidebar state remembered

**Expected**:
- ✅ Sidebar always visible (left side)
- ✅ Toggle button works
- ✅ State persists across navigation
- ✅ Page title and user info show in top bar

---

### Real-time Updates
**Test as Admin**:
1. Open admin complaint page
2. In another tab/window, create a complaint as citizen
3. Complaint badge on admin sidebar should increment
4. Admin complaint list should show new complaint
5. Status updates when citizen creates complaint

**Expected**:
- ✅ Badge updates in real-time (within poll interval)
- ✅ New items appear in list without page refresh

---

## 📊 Data Verification

### Check Backend Serves Data
```bash
# Admin login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecosmart.com","password":"admin123456"}'

# Get complaints
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/complaints

# Get truck requests
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/truck-requests

# Get schedules
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/schedules
```

---

## ❌ Troubleshooting

### Issue: Backend won't start
```bash
# Reset database
npx prisma migrate reset
npm run seed

# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run start:dev
```

### Issue: Sidebar not showing
- Check browser console for JavaScript errors
- Verify `script.js` is loading (check Network tab)
- Ensure page has `<aside class="user-sidebar"></aside>` markup

### Issue: API calls failing
- Check network tab in DevTools
- Verify token exists in localStorage
- Check backend is running on port 3000
- Look at backend console for error messages

### Issue: Modal form not opening
- Check for JavaScript errors in console
- Verify modal element has id="scheduleModal"
- Check z-index doesn't conflict with other elements

---

## ✅ Final Verification

Once all tests pass, verify:

```
☐ Backend builds without errors
☐ Frontend loads all pages without console errors
☐ Sidebar persists across all pages
☐ Admin can manage truck requests
☐ Admin can create/edit/delete schedules
☐ Citizens can submit complaints with categories
☐ Citizens can view complaint list and details
☐ Citizens can request trucks
☐ Live tracking map displays
☐ Schedule view shows weekly timetable
☐ Real-time updates work (badges, counts)
☐ Responsive design works on mobile/tablet
☐ All API endpoints integrated
☐ Authentication working (login/logout)
☐ Toast notifications appear correctly
```

---

## 🚀 Deployment Readiness

When all tests pass:
1. ✅ Backend compiled: `npm run build`
2. ✅ Frontend assets bundled (if using build tool)
3. ✅ Environment variables set (.env)
4. ✅ Database migrations applied
5. ✅ Seed data loaded
6. ✅ All pages accessible
7. ✅ API endpoints working
8. ✅ Error handling verified
9. ✅ Performance acceptable
10. ✅ Security checks passed

**System is ready for production deployment!**

---

**Last Updated**: May 3, 2026
**Integration Version**: 1.0.0
**Status**: ✅ READY FOR TESTING
