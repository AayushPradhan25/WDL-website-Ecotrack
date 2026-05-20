# EcoSmart Backend API

A comprehensive NestJS backend for the EcoSmart waste management system. This API provides functionality for user authentication, waste bin tracking, complaint management, truck fleet management, reward systems, and admin dashboards.

## 🚀 Features

- **User Authentication** - JWT-based authentication with role-based access control
- **User Management** - Admin can manage users, ban/unban, and distribute eco coins
- **Complaint System** - Users can report waste management issues
- **Dustbin Tracking** - Real-time monitoring of waste bin fill levels and status
- **Truck Fleet Management** - Track trucks, drivers, and collection activities
- **Eco-Coins Reward System** - Users earn coins for participation and can redeem rewards
- **Notifications** - Real-time notifications for users
- **Admin Dashboard** - Comprehensive analytics and system monitoring
- **Database** - PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## 🔧 Installation

1. **Navigate to backend directory**
```bash
cd eco-smart-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# The .env file is already configured
cat .env
```

4. **Setup PostgreSQL**
Ensure PostgreSQL is running on localhost:5432 with database `ecosmart` and credentials as per .env

5. **Run database migrations**
```bash
npx prisma migrate dev
```

6. **Seed the database (optional)**
```bash
npm run seed
```
This creates test data including:
- Admin user: admin@ecosmart.com / admin123456
- 4 Regular users
- 4 Dustbins
- 3 Trucks
- Complaints, Rewards, and Notifications

## 📖 Running the Server

### Development Mode
```bash
npm run start:dev
```
- Watches for file changes
- Auto-restarts on code changes
- Runs on http://localhost:3000

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Watch mode
npm test:watch
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for comprehensive API reference including:
- Authentication endpoints
- User management
- Complaints
- Dustbins
- Trucks
- Rewards
- Notifications
- Admin dashboard

## 🗂️ Project Structure

```
src/
├── admin/                 # Admin module & dashboard
├── auth/                  # Authentication & authorization
│   └── dto/              # Data Transfer Objects
├── complaints/           # Complaint management
│   └── dto/
├── common/               # Common utilities & filters
├── dustbins/             # Dustbin tracking
│   └── dto/
├── notifications/        # Notification system
├── rewards/              # Reward system
│   └── dto/
├── trucks/               # Truck management
│   └── dto/
├── users/                # User management
├── app.controller.ts     # Main app controller
├── app.module.ts         # Root module
├── app.service.ts        # Root service
├── main.ts              # Application entry point
└── prisma.service.ts    # Prisma service

prisma/
├── schema.prisma         # Database schema
└── migrations/           # Migration history
```

## 🛢️ Database Schema

### Core Models
- **User** - System users with roles (ADMIN, USER)
- **Complaint** - Waste management complaints
- **Dustbin** - Physical dustbins with location & fill level
- **Truck** - Collection trucks and drivers
- **TruckLog** - Activity logs for trucks
- **Reward** - Eco-coins rewards catalog
- **UserReward** - User reward redemptions
- **Notification** - System notifications for users

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Request validation with class-validator
- CORS enabled for frontend communication
- Global exception handling

## 🌐 API Base URL

```
http://localhost:3000
```

## 🔑 Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example Requests

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "User Name",
    "password": "password123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123456"
  }'
```

### Get Dashboard (Admin)
```bash
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

## 🐛 Debugging

- Enable debug logging: Set `LOG_LEVEL=debug` in .env
- Database logs: Check PostgreSQL logs
- API logs: Check console output in development mode

## 🚨 Common Issues

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists: `createdb ecosmart`

### Port Already in Use
- Change PORT in .env
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

### JWT Token Expired
- Login again to get a new token
- Default expiration: 24 hours

## 📦 Dependencies

- **@nestjs/core** - NestJS framework
- **@nestjs/jwt** - JWT authentication
- **@nestjs/passport** - Passport strategies
- **@prisma/client** - Database ORM
- **bcrypt** - Password hashing
- **passport-jwt** - JWT strategy
- **class-validator** - Request validation
- **dotenv** - Environment variables

## 🤝 Contributing

When adding new features:
1. Create DTOs for input validation
2. Implement service logic
3. Add controller endpoints with proper guards
4. Add database migrations if needed
5. Update API_DOCUMENTATION.md

## 📄 License

UNLICENSED - Proprietary Software

## 👨‍💻 Development Notes

### Adding a New Module
1. Generate: `nest g module features/mymodule`
2. Generate service: `nest g service features/mymodule`
3. Generate controller: `nest g controller features/mymodule`
4. Create DTOs in `dto/` folder
5. Import in app.module.ts

### Database Migration
```bash
# Create new migration
npx prisma migrate dev --name <migration_name>

# View migrations
npx prisma migrate status

# Rollback
npx prisma migrate resolve
```

## 📞 Support

For issues or questions, check:
1. API_DOCUMENTATION.md
2. NestJS Documentation: https://docs.nestjs.com
3. Prisma Documentation: https://www.prisma.io/docs

---

**Last Updated**: May 2026
**Status**: Production Ready ✅
