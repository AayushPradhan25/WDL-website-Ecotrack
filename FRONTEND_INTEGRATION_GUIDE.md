# EcoSmart Frontend Integration Guide

This guide explains how to integrate the frontend with the completed EcoSmart backend API.

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Configuration](#configuration)
3. [API Client Usage](#api-client-usage)
4. [Helper Classes](#helper-classes)
5. [Authentication Flow](#authentication-flow)
6. [Page Integration Examples](#page-integration-examples)
7. [Error Handling](#error-handling)
8. [Common Patterns](#common-patterns)

---

## 🚀 Setup Instructions

### Prerequisites

- Backend running on `http://localhost:3000`
- Database seeded with test data: `npm run seed` (in backend)
- Frontend files downloaded in `/user` and `/admin` directories

### Step 1: Include Required Scripts

Add these scripts to **ALL HTML files** in the `<head>` or before closing `</body>`:

```html
<!-- Configuration -->
<script src="../config.js"></script>

<!-- API Client -->
<script src="../api-client.js"></script>

<!-- Helper Utilities -->
<script src="../helpers.js"></script>

<!-- Main Application -->
<script src="../script.js"></script>
```

### Step 2: Verify Configuration

The `config.js` file sets up:
- API base URL based on environment (localhost for dev, production URL for production)
- Application settings (token expiry, page size, etc.)
- Endpoint mappings

```javascript
// Development
window.API_BASE_URL = 'http://localhost:3000'

// Production
window.API_BASE_URL = 'https://api.ecosmart.com'
```

---

## ⚙️ Configuration

### Environment Variables

Edit `config.js` for environment-specific settings:

```javascript
window.API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.ecosmart.com',
    timeout: 10000,
    retryAttempts: 3,
  },
};
```

### App Settings

```javascript
window.APP_SETTINGS = {
  tokenKey: 'auth_token',           // localStorage key for token
  userKey: 'user_data',              // localStorage key for user data
  tokenExpiry: 24 * 60 * 60 * 1000,  // 24 hours
  defaultPageSize: 10,
  toastDuration: 3000,               // Toast notification duration
};
```

---

## 🔌 API Client Usage

### Global Access

The API client is available globally as `window.api`:

```javascript
// In any page
const api = window.api;
```

### Authentication Methods

#### Register New User

```javascript
try {
  const result = await api.register(name, email, password);
  console.log('User created:', result);
  // result contains: { id, email, name, role, ... }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### Login User

```javascript
try {
  const result = await api.login(email, password);
  console.log('Logged in:', result);
  // result contains: { token, user: { id, email, name, role } }
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### Logout User

```javascript
api.logout();
// Clears token from localStorage and redirects to login
```

### User Endpoints

#### Get All Users (Admin Only)

```javascript
try {
  const users = await api.getAllUsers(page = 1, pageSize = 10);
  console.log('Users:', users);
  // Returns: { data: [...], total, page, pageSize }
} catch (error) {
  console.error('Failed to load users:', error.message);
}
```

#### Get User Leaderboard

```javascript
try {
  const leaderboard = await api.getLeaderboard();
  console.log('Leaderboard:', leaderboard);
  // Returns: sorted users by coins earned
} catch (error) {
  console.error('Failed to load leaderboard:', error.message);
}
```

#### Get Current User

```javascript
try {
  const currentUser = await api.getCurrentUser();
  console.log('Current user:', currentUser);
} catch (error) {
  console.error('Failed to load current user:', error.message);
}
```

#### Toggle User Status (Admin Only)

```javascript
try {
  const updated = await api.toggleUserStatus(userId);
  console.log('User status toggled:', updated);
} catch (error) {
  console.error('Failed to toggle status:', error.message);
}
```

#### Add Coins to User (Admin Only)

```javascript
try {
  const updated = await api.addCoinsToUser(userId, 100);
  console.log('Coins added:', updated);
} catch (error) {
  console.error('Failed to add coins:', error.message);
}
```

### Complaint Endpoints

#### Get All Complaints (Admin Only)

```javascript
try {
  const complaints = await api.getAllComplaints(page = 1, pageSize = 10, status = 'PENDING');
  console.log('Complaints:', complaints);
} catch (error) {
  console.error('Failed to load complaints:', error.message);
}
```

#### Get My Complaints (Current User)

```javascript
try {
  const myComplaints = await api.getMyComplaints();
  console.log('My complaints:', myComplaints);
} catch (error) {
  console.error('Failed to load complaints:', error.message);
}
```

#### Get Single Complaint

```javascript
try {
  const complaint = await api.getComplaint(complaintId);
  console.log('Complaint:', complaint);
} catch (error) {
  console.error('Failed to load complaint:', error.message);
}
```

#### Create Complaint

```javascript
try {
  const newComplaint = await api.createComplaint(
    title = 'Overfilled Dustbin',
    description = 'The dustbin at main street is overflowing',
    location = 'Main Street, Downtown'
  );
  console.log('Complaint created:', newComplaint);
} catch (error) {
  console.error('Failed to create complaint:', error.message);
}
```

#### Update Complaint Status (Admin Only)

```javascript
try {
  const updated = await api.updateComplaintStatus(complaintId, status = 'RESOLVED');
  console.log('Complaint status updated:', updated);
  // Status values: PENDING, IN_PROGRESS, RESOLVED
} catch (error) {
  console.error('Failed to update complaint:', error.message);
}
```

### Dustbin Endpoints

#### Get All Dustbins

```javascript
try {
  const dustbins = await api.getAllDustbins(page = 1, pageSize = 10);
  console.log('Dustbins:', dustbins);
} catch (error) {
  console.error('Failed to load dustbins:', error.message);
}
```

#### Get Single Dustbin

```javascript
try {
  const dustbin = await api.getDustbin(dustbinId);
  console.log('Dustbin:', dustbin);
} catch (error) {
  console.error('Failed to load dustbin:', error.message);
}
```

#### Create Dustbin (Admin Only)

```javascript
try {
  const newDustbin = await api.createDustbin(
    location = '123 Main St',
    capacity = 100,
    type = 'general'
  );
  console.log('Dustbin created:', newDustbin);
} catch (error) {
  console.error('Failed to create dustbin:', error.message);
}
```

#### Update Dustbin (Admin Only)

```javascript
try {
  const updated = await api.updateDustbin(dustbinId, {
    location: '123 Main St',
    capacity: 150,
    fillLevel: 75
  });
  console.log('Dustbin updated:', updated);
} catch (error) {
  console.error('Failed to update dustbin:', error.message);
}
```

#### Delete Dustbin (Admin Only)

```javascript
try {
  await api.deleteDustbin(dustbinId);
  console.log('Dustbin deleted');
} catch (error) {
  console.error('Failed to delete dustbin:', error.message);
}
```

### Truck Endpoints

#### Get All Trucks

```javascript
try {
  const trucks = await api.getAllTrucks(page = 1, pageSize = 10);
  console.log('Trucks:', trucks);
} catch (error) {
  console.error('Failed to load trucks:', error.message);
}
```

#### Get Single Truck

```javascript
try {
  const truck = await api.getTruck(truckId);
  console.log('Truck:', truck);
} catch (error) {
  console.error('Failed to load truck:', error.message);
}
```

#### Create Truck (Admin Only)

```javascript
try {
  const newTruck = await api.createTruck(
    numberPlate = 'ABC123',
    driverId = userId,
    capacity = 5000
  );
  console.log('Truck created:', newTruck);
} catch (error) {
  console.error('Failed to create truck:', error.message);
}
```

#### Add Truck Log

```javascript
try {
  const logEntry = await api.addTruckLog(truckId, {
    location: '123 Main St',
    timestamp: new Date(),
    fillLevel: 75
  });
  console.log('Truck log added:', logEntry);
} catch (error) {
  console.error('Failed to add truck log:', error.message);
}
```

### Reward Endpoints

#### Get All Rewards

```javascript
try {
  const rewards = await api.getAllRewards(page = 1, pageSize = 10);
  console.log('Rewards:', rewards);
} catch (error) {
  console.error('Failed to load rewards:', error.message);
}
```

#### Get My Rewards (Current User)

```javascript
try {
  const myRewards = await api.getMyRewards();
  console.log('My rewards:', myRewards);
} catch (error) {
  console.error('Failed to load rewards:', error.message);
}
```

#### Create Reward (Admin Only)

```javascript
try {
  const newReward = await api.createReward(
    title = '10% Off Store',
    description = 'Get 10% off at local stores',
    coinsRequired = 500
  );
  console.log('Reward created:', newReward);
} catch (error) {
  console.error('Failed to create reward:', error.message);
}
```

#### Redeem Reward

```javascript
try {
  const redeemed = await api.redeemReward(rewardId);
  console.log('Reward redeemed:', redeemed);
} catch (error) {
  console.error('Failed to redeem reward:', error.message);
}
```

### Notification Endpoints

#### Get Notifications

```javascript
try {
  const notifications = await api.getNotifications();
  console.log('Notifications:', notifications);
} catch (error) {
  console.error('Failed to load notifications:', error.message);
}
```

#### Mark Notification as Read

```javascript
try {
  const marked = await api.markNotificationAsRead(notificationId);
  console.log('Notification marked as read:', marked);
} catch (error) {
  console.error('Failed to mark as read:', error.message);
}
```

#### Mark All Notifications as Read

```javascript
try {
  await api.markAllNotificationsAsRead();
  console.log('All notifications marked as read');
} catch (error) {
  console.error('Failed to mark all as read:', error.message);
}
```

### Admin Endpoints

#### Get Dashboard Statistics (Admin Only)

```javascript
try {
  const stats = await api.getDashboardStats();
  console.log('Dashboard stats:', stats);
  // Returns: { totalUsers, totalComplaints, totalTrucks, totalDustbins, ... }
} catch (error) {
  console.error('Failed to load dashboard stats:', error.message);
}
```

#### Get Complaint Statistics (Admin Only)

```javascript
try {
  const stats = await api.getComplaintStats();
  console.log('Complaint stats:', stats);
} catch (error) {
  console.error('Failed to load complaint stats:', error.message);
}
```

#### Get Truck Statistics (Admin Only)

```javascript
try {
  const stats = await api.getTruckStats();
  console.log('Truck stats:', stats);
} catch (error) {
  console.error('Failed to load truck stats:', error.message);
}
```

#### Get Dustbin Statistics (Admin Only)

```javascript
try {
  const stats = await api.getDustbinStats();
  console.log('Dustbin stats:', stats);
} catch (error) {
  console.error('Failed to load dustbin stats:', error.message);
}
```

#### Get User Statistics (Admin Only)

```javascript
try {
  const stats = await api.getUserStatistics();
  console.log('User stats:', stats);
} catch (error) {
  console.error('Failed to load user stats:', error.message);
}
```

#### Get Recent Activity (Admin Only)

```javascript
try {
  const activity = await api.getRecentActivity();
  console.log('Recent activity:', activity);
} catch (error) {
  console.error('Failed to load recent activity:', error.message);
}
```

---

## 🛠️ Helper Classes

### UIHelper

Provides UI operations and formatting utilities.

#### Show Loading State

```javascript
UIHelper.showLoader();

// Do some work...

UIHelper.hideLoader();
```

#### Show Notifications

```javascript
// Success notification
UIHelper.showSuccess('Action completed successfully!');

// Error notification
UIHelper.showError('Something went wrong!');

// Info notification
UIHelper.showInfo('This is informational');
```

#### Format Dates and Times

```javascript
const date = new Date();

UIHelper.formatDate(date);        // "Jan 15, 2024"
UIHelper.formatTime(date);        // "02:30 PM"
UIHelper.formatDateTime(date);    // "Jan 15, 2024 02:30 PM"
```

#### Redirect

```javascript
UIHelper.redirect('/user/dashboard.html');
```

#### Get Query Parameters

```javascript
const id = UIHelper.getQueryParam('id');
const status = UIHelper.getQueryParam('status');
```

### AuthHelper

Manages authentication state and role-based access.

#### Check if User is Logged In

```javascript
if (AuthHelper.isLoggedIn()) {
  console.log('User is authenticated');
} else {
  console.log('User needs to log in');
}
```

#### Get Current User Data

```javascript
const user = AuthHelper.getCurrentUser();
console.log(user.email);
console.log(user.name);
console.log(user.role);
```

#### Store User Data

```javascript
const userData = { id: 1, email: 'user@example.com', name: 'John Doe', role: 'USER' };
AuthHelper.setCurrentUser(userData);
```

#### Check if User is Admin

```javascript
if (AuthHelper.isAdmin()) {
  // Show admin-only features
} else {
  // Hide admin features
}
```

#### Logout User

```javascript
AuthHelper.logout();
// Clears user data and redirects to login
```

#### Require Login (Redirect if Not Authenticated)

```javascript
AuthHelper.requireLogin();
// If not logged in, redirects to login.html
```

#### Require Admin (Redirect if Not Admin)

```javascript
AuthHelper.requireAdmin();
// If not admin, shows error message and redirects
```

### DataFormatter

Formats data for display.

#### Get Status Badge HTML

```javascript
const statusBadge = DataFormatter.getStatusBadge('RESOLVED');
// Returns: <span class="badge badge-success">Resolved</span>

const badge = DataFormatter.getStatusBadge('PENDING');
// Returns: <span class="badge badge-warning">Pending</span>
```

#### Format Currency

```javascript
DataFormatter.formatCurrency(1000);        // "₹1,000"
DataFormatter.formatCurrency(1234.56);     // "₹1,234.56"
```

#### Format Number

```javascript
DataFormatter.formatNumber(1000000);       // "1,000,000"
DataFormatter.formatNumber(999);           // "999"
```

#### Truncate Text

```javascript
DataFormatter.truncate('This is a very long text', 15);
// Returns: "This is a ver..."
```

#### Capitalize Text

```javascript
DataFormatter.capitalize('john doe');      // "John doe"
DataFormatter.capitalize('hello world');   // "Hello world"
```

---

## 🔐 Authentication Flow

### Login Flow

```javascript
// 1. User fills login form and clicks submit
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    UIHelper.showLoader();
    
    // 2. Call API login
    const result = await api.login(email, password);
    // result: { token: "...", user: { id, email, name, role } }
    
    UIHelper.hideLoader();
    UIHelper.showSuccess('Login successful!');
    
    // 3. Redirect to dashboard (token is automatically stored)
    setTimeout(() => {
      UIHelper.redirect('./dashboard.html');
    }, 1000);
    
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError(error.message);
  }
});
```

### Protected Page Flow

```javascript
// At the top of protected pages (like dashboard.html)
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check if user is logged in
  if (!AuthHelper.isLoggedIn()) {
    UIHelper.redirect('../user/login.html');
    return;
  }
  
  // 2. For admin-only pages
  if (!AuthHelper.isAdmin()) {
    UIHelper.showError('Access denied: Admin only');
    UIHelper.redirect('../user/dashboard.html');
    return;
  }
  
  // 3. Proceed with loading page data
  await loadPageData();
});
```

### Token Management

Tokens are automatically managed by the API client:

- **Stored**: When user logs in, token is stored in localStorage
- **Sent**: Automatically included in all API requests as `Authorization: Bearer <token>`
- **Refreshed**: If request returns 401, user is redirected to login
- **Cleared**: When user logs out, token is removed from localStorage

---

## 📄 Page Integration Examples

### User Login Page (`/user/login.html`)

```html
<form id="loginForm">
  <input type="email" id="email" placeholder="Email" required>
  <input type="password" id="password" placeholder="Password" required>
  <button type="submit">Login</button>
</form>

<script>
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      UIHelper.showLoader();
      const result = await api.login(
        document.getElementById('email').value,
        document.getElementById('password').value
      );
      UIHelper.hideLoader();
      UIHelper.showSuccess('Login successful!');
      setTimeout(() => UIHelper.redirect('./dashboard.html'), 1000);
    } catch (error) {
      UIHelper.hideLoader();
      UIHelper.showError(error.message);
    }
  });
</script>
```

### User Dashboard (`/user/dashboard.html`)

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Ensure user is logged in
  if (!AuthHelper.isLoggedIn()) {
    UIHelper.redirect('../user/login.html');
    return;
  }
  
  try {
    UIHelper.showLoader();
    
    // Load complaints
    const complaints = await api.getMyComplaints();
    const complaintsContainer = document.getElementById('complaints-list');
    
    complaintsContainer.innerHTML = complaints.map(c => `
      <div class="complaint-card">
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <p>Location: ${c.location}</p>
        ${DataFormatter.getStatusBadge(c.status)}
      </div>
    `).join('');
    
    // Load rewards
    const rewards = await api.getMyRewards();
    const rewardsContainer = document.getElementById('rewards-list');
    
    rewardsContainer.innerHTML = rewards.map(r => `
      <div class="reward-card">
        <h3>${r.title}</h3>
        <p>${DataFormatter.formatCurrency(r.coinsRequired)}</p>
      </div>
    `).join('');
    
    UIHelper.hideLoader();
    
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError('Failed to load dashboard data');
  }
});
```

### Complaint Creation (`/user/raise-complaint.html`)

```javascript
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    UIHelper.showLoader();
    
    const result = await api.createComplaint(
      document.getElementById('title').value,
      document.getElementById('description').value,
      document.getElementById('location').value
    );
    
    UIHelper.hideLoader();
    UIHelper.showSuccess('Complaint created successfully!');
    
    setTimeout(() => {
      UIHelper.redirect('./complaint-list.html');
    }, 1000);
    
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError(error.message);
  }
});
```

### Admin Dashboard (`/admin/admin-dashboard.html`)

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Ensure user is admin
  if (!AuthHelper.isAdmin()) {
    UIHelper.showError('Access denied: Admin only');
    UIHelper.redirect('../index.html');
    return;
  }
  
  try {
    UIHelper.showLoader();
    
    // Load statistics
    const stats = await api.getDashboardStats();
    
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-complaints').textContent = stats.totalComplaints;
    document.getElementById('total-trucks').textContent = stats.totalTrucks;
    document.getElementById('total-dustbins').textContent = stats.totalDustbins;
    
    // Load recent activity
    const activity = await api.getRecentActivity();
    const activityContainer = document.getElementById('activity-list');
    
    activityContainer.innerHTML = activity.map(a => `
      <div class="activity-item">
        <p>${a.description}</p>
        <small>${UIHelper.formatDateTime(new Date(a.timestamp))}</small>
      </div>
    `).join('');
    
    UIHelper.hideLoader();
    
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError('Failed to load admin dashboard');
  }
});
```

---

## ⚠️ Error Handling

### API Errors

The API client automatically handles different error types:

```javascript
try {
  await api.login(email, password);
} catch (error) {
  // error.message contains the error description
  // Examples:
  // - "Invalid email or password"
  // - "User not found"
  // - "Network error"
  console.error(error.message);
}
```

### Custom Error Handling

```javascript
try {
  await api.createComplaint(title, description, location);
} catch (error) {
  // Handle specific error types
  if (error.message.includes('location')) {
    UIHelper.showError('Invalid location. Please try again.');
  } else if (error.message.includes('Network')) {
    UIHelper.showError('Network error. Check your connection.');
  } else {
    UIHelper.showError('An unexpected error occurred.');
  }
}
```

### Network Error Handling

```javascript
const apiCall = async () => {
  try {
    // Make API call
    return await api.getAllComplaints();
  } catch (error) {
    if (!navigator.onLine) {
      UIHelper.showError('No internet connection');
    } else {
      UIHelper.showError('Server is unreachable');
    }
  }
};
```

---

## 🎯 Common Patterns

### Load and Display Data

```javascript
async function loadAndDisplayComplaints() {
  try {
    UIHelper.showLoader();
    const complaints = await api.getMyComplaints();
    UIHelper.hideLoader();
    
    const html = complaints.map(c => `
      <div class="complaint-item">
        <h4>${c.title}</h4>
        <p>${c.description}</p>
        <small>${UIHelper.formatDateTime(new Date(c.createdAt))}</small>
      </div>
    `).join('');
    
    document.getElementById('complaints-container').innerHTML = html;
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError('Failed to load complaints');
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadAndDisplayComplaints);
```

### Handle Form Submission

```javascript
async function handleFormSubmit(e, apiFunction, redirectUrl) {
  e.preventDefault();
  
  try {
    UIHelper.showLoader();
    const formData = new FormData(e.target);
    await apiFunction(...Object.values(Object.fromEntries(formData)));
    UIHelper.hideLoader();
    UIHelper.showSuccess('Operation successful!');
    setTimeout(() => UIHelper.redirect(redirectUrl), 1000);
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError(error.message);
  }
}

// Usage
form.addEventListener('submit', (e) => 
  handleFormSubmit(e, api.createComplaint, './complaint-list.html')
);
```

### Pagination

```javascript
let currentPage = 1;

async function loadComplaints(page = 1) {
  try {
    UIHelper.showLoader();
    const data = await api.getAllComplaints(page, 10);
    UIHelper.hideLoader();
    
    displayComplaints(data.data);
    displayPagination(data.page, data.total);
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError('Failed to load complaints');
  }
}

function displayPagination(currentPage, total) {
  const totalPages = Math.ceil(total / 10);
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}
```

### Real-time Search

```javascript
let searchTimeout;

document.getElementById('search-input').addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  const query = e.target.value;
  
  searchTimeout = setTimeout(async () => {
    if (query.length < 2) return;
    
    try {
      UIHelper.showLoader();
      // Implement server-side search if available
      const results = await api.searchComplaints(query);
      UIHelper.hideLoader();
      displayResults(results);
    } catch (error) {
      UIHelper.hideLoader();
      UIHelper.showError('Search failed');
    }
  }, 300);
});
```

### List with Actions

```javascript
function displayComplaintsWithActions(complaints) {
  const html = complaints.map(c => `
    <div class="complaint-row">
      <div class="complaint-info">
        <h4>${c.title}</h4>
        <p>${c.description}</p>
      </div>
      <div class="complaint-actions">
        ${AuthHelper.isAdmin() ? `
          <button onclick="updateComplaintStatus('${c.id}', 'IN_PROGRESS')">
            Mark In Progress
          </button>
          <button onclick="updateComplaintStatus('${c.id}', 'RESOLVED')">
            Mark Resolved
          </button>
        ` : ''}
        <button onclick="viewComplaintDetails('${c.id}')">View Details</button>
      </div>
    </div>
  `).join('');
  
  document.getElementById('complaints-list').innerHTML = html;
}

async function updateComplaintStatus(complaintId, status) {
  try {
    UIHelper.showLoader();
    await api.updateComplaintStatus(complaintId, status);
    UIHelper.hideLoader();
    UIHelper.showSuccess('Status updated');
    loadComplaints(); // Reload list
  } catch (error) {
    UIHelper.hideLoader();
    UIHelper.showError('Failed to update status');
  }
}
```

---

## 📱 Test Credentials

Use these credentials to test the frontend integration:

### Admin Account
- **Email**: `admin@ecosmart.com`
- **Password**: `Admin@123`
- **Role**: ADMIN

### Regular User
- **Email**: `john@example.com`
- **Password**: `Password@123`
- **Role**: USER

---

## 🐛 Debugging

### Enable Console Logging

```javascript
// Add to any page to debug API calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('API Call:', args[0]);
  const response = await originalFetch(...args);
  console.log('Response:', response.status);
  return response;
};
```

### Check Token Storage

```javascript
// In browser console
localStorage.getItem('auth_token')
localStorage.getItem('user_data')
```

### Verify API Connection

```javascript
// Test API connectivity
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(data => console.log('API is running:', data))
  .catch(e => console.error('API is not running:', e));
```

---

## 📞 Support

For issues or questions:

1. Check the backend is running: `npm run start`
2. Verify database is seeded: `npm run seed`
3. Check browser console for errors
4. Verify token is stored in localStorage
5. Check network tab in browser DevTools

---

**Last Updated**: January 2024
**Backend Version**: 1.0.0
**Frontend Version**: 1.0.0
