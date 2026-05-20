/**
 * ECOSMART BACKEND - ALL API ENDPOINTS SUMMARY
 * Generated: May 2026
 */

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /auth/register
 * - Public endpoint
 * - Register new user
 * - Body: { email, name, password }
 */

/**
 * POST /auth/login
 * - Public endpoint
 * - User login
 * - Body: { email, password }
 * - Returns: { access_token }
 */

/**
 * GET /auth/ping
 * - Public endpoint
 * - Test authentication service
 * - Returns: { message: "Auth controller works" }
 */

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

/**
 * GET /users
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get all users
 * - Returns: User[]
 */

/**
 * GET /users/leaderboard
 * - Protected: JWT required
 * - Get eco-coins leaderboard
 * - Returns: Top 20 users by eco coins
 */

/**
 * GET /users/:id
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get user by ID
 * - Params: id (number)
 */

/**
 * PATCH /users/:id/toggle-status
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Toggle user status (active <-> banned)
 * - Params: id (number)
 */

/**
 * PATCH /users/:id/add-coins/:coins
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Add eco coins to user
 * - Params: id (number), coins (number)
 */

// ============================================
// COMPLAINT ENDPOINTS
// ============================================

/**
 * GET /complaints
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get all complaints
 */

/**
 * GET /complaints/my
 * - Protected: JWT required
 * - Get logged-in user's complaints
 */

/**
 * GET /complaints/:id
 * - Protected: JWT required
 * - Get complaint by ID
 * - Params: id (number)
 */

/**
 * POST /complaints
 * - Protected: JWT required
 * - Create new complaint
 * - Body: { title, description, location }
 */

/**
 * PATCH /complaints/:id/status
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Update complaint status
 * - Params: id (number)
 * - Body: { status: "pending" | "in-progress" | "resolved" | "rejected" }
 */

// ============================================
// DUSTBIN ENDPOINTS
// ============================================

/**
 * GET /dustbins
 * - Protected: JWT required
 * - Get all dustbins
 */

/**
 * GET /dustbins/:id
 * - Protected: JWT required
 * - Get dustbin by ID
 * - Params: id (number)
 */

/**
 * POST /dustbins
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Create new dustbin
 * - Body: { location, latitude?, longitude? }
 */

/**
 * PATCH /dustbins/:id
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Update dustbin
 * - Params: id (number)
 * - Body: { location?, fillLevel (0-100)?, status?, latitude?, longitude? }
 * - Status: "active" | "full" | "maintenance" | "inactive"
 */

/**
 * DELETE /dustbins/:id
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Delete dustbin
 * - Params: id (number)
 */

// ============================================
// TRUCK ENDPOINTS
// ============================================

/**
 * GET /trucks
 * - Protected: JWT required
 * - Get all trucks
 */

/**
 * GET /trucks/:id
 * - Protected: JWT required
 * - Get truck by ID
 * - Params: id (number)
 */

/**
 * POST /trucks
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Create new truck
 * - Body: { number, driverName }
 */

/**
 * PATCH /trucks/:id
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Update truck
 * - Params: id (number)
 * - Body: { number?, driverName?, status? }
 * - Status: "active" | "inactive" | "maintenance" | "on-route"
 */

/**
 * DELETE /trucks/:id
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Delete truck
 * - Params: id (number)
 */

/**
 * POST /trucks/:id/log
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Add activity log to truck
 * - Params: id (number)
 * - Body: { message }
 */

// ============================================
// REWARD ENDPOINTS
// ============================================

/**
 * GET /rewards
 * - Protected: JWT required
 * - Get all rewards
 */

/**
 * GET /rewards/mine
 * - Protected: JWT required
 * - Get user's claimed rewards
 */

/**
 * POST /rewards
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Create new reward
 * - Body: { name, description, coinsNeeded, imageUrl? }
 */

/**
 * POST /rewards/:id/redeem
 * - Protected: JWT required
 * - Redeem reward using eco coins
 * - Params: id (number)
 */

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================

/**
 * GET /notifications
 * - Protected: JWT required
 * - Get user's notifications
 */

/**
 * PATCH /notifications/read-all
 * - Protected: JWT required
 * - Mark all notifications as read
 */

/**
 * PATCH /notifications/:id/read
 * - Protected: JWT required
 * - Mark notification as read
 * - Params: id (number)
 */

// ============================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================

/**
 * GET /admin/dashboard
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get dashboard statistics
 * - Returns: {
 *     totalUsers, activeUsers,
 *     totalComplaints, pendingComplaints,
 *     totalDustbins, activeDustbins,
 *     totalTrucks, activeTrucks,
 *     timestamp
 *   }
 */

/**
 * GET /admin/health
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get system health status
 * - Returns: { status, database, timestamp }
 */

/**
 * GET /admin/complaints/stats
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get complaint statistics by status
 */

/**
 * GET /admin/trucks/stats
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get truck statistics
 */

/**
 * GET /admin/dustbins/stats
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get dustbin statistics
 */

/**
 * GET /admin/users/stats
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get user statistics
 */

/**
 * GET /admin/activity/recent
 * - Protected: JWT required
 * - Role: ADMIN only
 * - Get recent system activity
 */

// ============================================
// TOTAL ENDPOINTS: 42
// ============================================
// Authentication: 3
// Users: 5
// Complaints: 5
// Dustbins: 5
// Trucks: 7
// Rewards: 4
// Notifications: 3
// Admin: 7
// ============================================
