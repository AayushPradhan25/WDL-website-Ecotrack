# EcoSmart Backend API Documentation

## Overview
EcoSmart is a comprehensive waste management system with the following features:
- User authentication and authorization
- Eco-coins reward system
- Complaint management
- Dustbin tracking
- Truck fleet management
- Real-time notifications
- Admin dashboard

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`
- **Body**: `{ email, name, password }`
- **Response**: `{ id, email, name, role, status, ecoCoins, createdAt }`

### Login User
**POST** `/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ access_token }`

### Auth Ping (Test)
**GET** `/auth/ping`
- **Response**: `{ message: "Auth controller works" }`

---

## User Endpoints

### Get All Users (Admin Only)
**GET** `/users`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Response**: Array of users

### Get Leaderboard
**GET** `/users/leaderboard`
- **Auth**: Required (Bearer Token)
- **Response**: Top 20 users by eco coins

### Get User by ID (Admin Only)
**GET** `/users/:id`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Toggle User Status (Admin Only)
**PATCH** `/users/:id/toggle-status`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Toggle**: active ↔ banned

### Add Eco Coins to User (Admin Only)
**PATCH** `/users/:id/add-coins/:coins`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Params**: `id`, `coins`

---

## Complaint Endpoints

### Get All Complaints (Admin Only)
**GET** `/complaints`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get My Complaints
**GET** `/complaints/my`
- **Auth**: Required (Bearer Token)

### Get Complaint by ID
**GET** `/complaints/:id`
- **Auth**: Required (Bearer Token)

### Create Complaint
**POST** `/complaints`
- **Auth**: Required (Bearer Token)
- **Body**: `{ title, description, location }`

### Update Complaint Status (Admin Only)
**PATCH** `/complaints/:id/status`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ status: "pending" | "in-progress" | "resolved" | "rejected" }`

---

## Dustbin Endpoints

### Get All Dustbins
**GET** `/dustbins`
- **Auth**: Required (Bearer Token)

### Get Dustbin by ID
**GET** `/dustbins/:id`
- **Auth**: Required (Bearer Token)

### Create Dustbin (Admin Only)
**POST** `/dustbins`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ location, latitude?, longitude? }`

### Update Dustbin (Admin Only)
**PATCH** `/dustbins/:id`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ location?, fillLevel (0-100)?, status?, latitude?, longitude? }`
- **Status Options**: "active" | "full" | "maintenance" | "inactive"

### Delete Dustbin (Admin Only)
**DELETE** `/dustbins/:id`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

---

## Truck Endpoints

### Get All Trucks
**GET** `/trucks`
- **Auth**: Required (Bearer Token)

### Get Truck by ID
**GET** `/trucks/:id`
- **Auth**: Required (Bearer Token)

### Create Truck (Admin Only)
**POST** `/trucks`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ number, driverName }`

### Update Truck (Admin Only)
**PATCH** `/trucks/:id`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ number?, driverName?, status? }`
- **Status Options**: "active" | "inactive" | "maintenance" | "on-route"

### Delete Truck (Admin Only)
**DELETE** `/trucks/:id`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Add Truck Log (Admin Only)
**POST** `/trucks/:id/log`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ message }`

---

## Reward Endpoints

### Get All Rewards
**GET** `/rewards`
- **Auth**: Required (Bearer Token)

### Get My Rewards
**GET** `/rewards/mine`
- **Auth**: Required (Bearer Token)

### Create Reward (Admin Only)
**POST** `/rewards`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Body**: `{ name, description, coinsNeeded, imageUrl? }`

### Redeem Reward
**POST** `/rewards/:id/redeem`
- **Auth**: Required (Bearer Token)

---

## Notification Endpoints

### Get My Notifications
**GET** `/notifications`
- **Auth**: Required (Bearer Token)

### Mark All Notifications as Read
**PATCH** `/notifications/read-all`
- **Auth**: Required (Bearer Token)

### Mark Notification as Read
**PATCH** `/notifications/:id/read`
- **Auth**: Required (Bearer Token)

---

## Admin Dashboard Endpoints

### Get Dashboard Stats
**GET** `/admin/dashboard`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN
- **Response**: 
  ```json
  {
    "totalUsers": 0,
    "activeUsers": 0,
    "totalComplaints": 0,
    "pendingComplaints": 0,
    "totalDustbins": 0,
    "activeDustbins": 0,
    "totalTrucks": 0,
    "activeTrucks": 0,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### Get System Health
**GET** `/admin/health`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get Complaint Stats
**GET** `/admin/complaints/stats`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get Truck Stats
**GET** `/admin/trucks/stats`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get Dustbin Stats
**GET** `/admin/dustbins/stats`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get User Stats
**GET** `/admin/users/stats`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

### Get Recent Activity
**GET** `/admin/activity/recent`
- **Auth**: Required (Bearer Token)
- **Role**: ADMIN

---

## Database Schema

### User
- id: Int (Primary Key)
- email: String (Unique)
- name: String
- password: String (Hashed)
- role: String (default: "USER")
- status: String (default: "active")
- ecoCoins: Int (default: 0)
- createdAt: DateTime
- updatedAt: DateTime

### Complaint
- id: Int (Primary Key)
- userId: Int (Foreign Key)
- title: String
- description: String
- location: String
- status: String (default: "pending")
- createdAt: DateTime
- updatedAt: DateTime

### Dustbin
- id: Int (Primary Key)
- location: String
- fillLevel: Int (default: 0, 0-100)
- status: String (default: "active")
- latitude: Float
- longitude: Float
- createdAt: DateTime
- updatedAt: DateTime

### Truck
- id: Int (Primary Key)
- number: String (Unique)
- driverName: String
- status: String (default: "inactive")
- lastActive: DateTime
- createdAt: DateTime
- updatedAt: DateTime

### TruckLog
- id: Int (Primary Key)
- truckId: Int (Foreign Key)
- message: String
- createdAt: DateTime

### Reward
- id: Int (Primary Key)
- name: String
- description: String
- coinsNeeded: Int
- imageUrl: String
- createdAt: DateTime

### UserReward
- id: Int (Primary Key)
- userId: Int (Foreign Key)
- rewardId: Int (Foreign Key)
- claimedAt: DateTime

### Notification
- id: Int (Primary Key)
- userId: Int (Foreign Key)
- title: String
- message: String
- read: Boolean (default: false)
- createdAt: DateTime

---

## Error Handling

All endpoints return standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (Invalid role)
- `404`: Not Found
- `500`: Server Error

Error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## Running the Server

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Run in development
npm run start:dev

# Run in production
npm run start:prod
```

Server runs on `http://localhost:3000`

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecosmart
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000
```

---

## Testing

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e

# Run with coverage
npm run test:cov
```
