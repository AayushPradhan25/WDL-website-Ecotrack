# EcoSmart Backend - Development Guide

## 📖 Quick Start

### Prerequisites
- Node.js 16+ installed
- PostgreSQL 12+ running
- Git installed

### Setup (5 minutes)

```bash
# 1. Navigate to backend directory
cd eco-smart-backend

# 2. Install dependencies
npm install

# 3. Ensure PostgreSQL is running
# Check with: psql --version

# 4. Create database (if not exists)
createdb ecosmart

# 5. Run migrations
npx prisma migrate dev

# 6. Seed database (optional but recommended)
npm run seed

# 7. Start development server
npm run start:dev
```

Server will be running at `http://localhost:3000`

---

## 🏗️ Project Architecture

```
EcoSmart Backend (NestJS)
│
├── Authentication Layer
│   ├── JWT Strategy
│   ├── Guards (JWT, Roles)
│   └── Decorators
│
├── API Modules
│   ├── Auth Module
│   ├── Users Module
│   ├── Complaints Module
│   ├── Dustbins Module
│   ├── Trucks Module
│   ├── Rewards Module
│   ├── Notifications Module
│   └── Admin Module
│
├── Data Access Layer
│   ├── Prisma ORM
│   ├── Database Models
│   └── Migrations
│
└── Cross-cutting Concerns
    ├── Exception Filters
    ├── Validation Pipes
    └── Logger
```

---

## 📁 Folder Structure & Responsibilities

### `src/`
Main application source code

### `src/auth/`
- **auth.controller.ts** - Register & Login endpoints
- **auth.service.ts** - User registration & authentication logic
- **jwt.strategy.ts** - JWT validation strategy
- **jwt-auth.guard.ts** - JWT authentication guard
- **roles.guard.ts** - Role-based authorization
- **roles.decorator.ts** - @Roles decorator
- **auth.module.ts** - Auth module configuration
- **dto/** - Data Transfer Objects for auth

### `src/{module}/`
Each feature module (users, complaints, etc.) follows this pattern:
```
dustbins/
├── dustbins.controller.ts    - HTTP endpoints
├── dustbins.service.ts       - Business logic
├── dustbins.module.ts        - Module config
└── dto/
    └── dustbin.dto.ts        - Data validation
```

### `src/admin/`
Admin dashboard and analytics
- **admin.controller.ts** - Dashboard endpoints
- **admin.service.ts** - Analytics & statistics

### `prisma/`
- **schema.prisma** - Database schema definition
- **migrations/** - Migration history

---

## 🔄 Request Flow

```
HTTP Request
    ↓
[Main Guard - JWT]
    ↓
[Role Guard - Check ADMIN/USER]
    ↓
[Controller] - Route handling
    ↓
[DTO Validation] - class-validator
    ↓
[Service] - Business logic
    ↓
[Prisma] - Database query
    ↓
Database (PostgreSQL)
    ↓
Response (JSON)
```

---

## 🗄️ Database Models & Relationships

### User
```
User
├── Complaint (1:many)
├── UserReward (1:many)
└── Notification (1:many)
```

### Complaint
```
Complaint
└── User (many:1)
```

### Truck
```
Truck
└── TruckLog (1:many)
```

### Reward
```
Reward
└── UserReward (1:many)
```

### UserReward
```
UserReward
├── User (many:1)
└── Reward (many:1)
```

### Notification
```
Notification
└── User (many:1)
```

---

## 🛠️ Adding a New Feature

### Example: Adding "Reports" Module

#### Step 1: Generate Module
```bash
nest g module features/reports
nest g service features/reports
nest g controller features/reports
```

#### Step 2: Create DTOs
```typescript
// src/reports/dto/create-report.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsNumber()
  severity: number; // 1-5
}
```

#### Step 3: Create Service
```typescript
// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    // Business logic
  }

  findAll() {
    // Query logic
  }
}
```

#### Step 4: Create Controller
```typescript
// src/reports/reports.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateReportDto) {
    return this.service.create(dto);
  }
}
```

#### Step 5: Update Module
```typescript
// src/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
  exports: [ReportsService],
})
export class ReportsModule {}
```

#### Step 6: Import in App Module
```typescript
// src/app.module.ts
import { ReportsModule } from './features/reports/reports.module';

@Module({
  imports: [
    // ... other modules
    ReportsModule,
  ],
})
export class AppModule {}
```

#### Step 7: Update Database Schema (if needed)
```prisma
// prisma/schema.prisma
model Report {
  id        Int     @id @default(autoincrement())
  title     String
  severity  Int
  createdAt DateTime @default(now())
}
```

#### Step 8: Create Migration
```bash
npx prisma migrate dev --name add_report_model
```

---

## 🔐 Authentication & Authorization

### How JWT Works
1. User logs in → Server validates credentials
2. Server creates JWT token (claims + signature)
3. Client stores token (localStorage/sessionStorage)
4. Client sends token with each request: `Authorization: Bearer <token>`
5. Server validates token signature and claims

### Token Structure
```
Header.Payload.Signature

Payload contains:
{
  "sub": 1,           // User ID
  "email": "user@...",
  "role": "USER",
  "iat": 1234567890,  // Issued at
  "exp": 1234654290   // Expires at (24 hours later)
}
```

### Role-Based Access Control
```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  // Only ADMIN can access
}
```

---

## 🧪 Testing Endpoints

### Using cURL
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123456"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123456"
  }'
# Response: { "access_token": "eyJhbGc..." }

# Use Token
curl -X GET http://localhost:3000/complaints \
  -H "Authorization: Bearer eyJhbGc..."
```

### Using Postman
1. Create Environment with variable: `token`
2. Login endpoint → Save token response to variable
3. Use `{{token}}` in Authorization header for other requests

### Using Thunder Client (VS Code)
Same as Postman, built into VS Code

---

## 🐛 Debugging Tips

### Enable Logging
```typescript
// In main.ts
if (process.env.LOG_LEVEL === 'debug') {
  app.useLogger(new Logger());
}
```

### Database Queries
```bash
# View all queries in real-time
# Add to prisma.service.ts constructor
console.log('DATABASE_URL:', process.env.DATABASE_URL);
```

### JWT Issues
```typescript
// Add to jwt.strategy.ts
async validate(payload: any) {
  console.log('JWT Payload:', payload); // Debug
  return { userId: payload.sub, email: payload.email, role: payload.role };
}
```

### Check Active Routes
```typescript
// In main.ts after bootstrap
const server = app.getHttpServer();
console.log(server._events.request.stack);
```

---

## 📊 Database Operations

### View Data in PostgreSQL
```bash
# Connect to database
psql -U aayush -d ecosmart

# List tables
\dt

# Query users
SELECT * FROM "User";

# Query complaints
SELECT * FROM "Complaint";

# Exit
\q
```

### Prisma Studio
```bash
# Open visual database explorer
npx prisma studio
```

### Run Seed
```bash
# Populate test data
npm run seed
```

---

## 📈 Performance Optimization

### Database Indexing
```prisma
model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique  // Indexed automatically
  // ...
}
```

### Query Optimization
```typescript
// Bad: N+1 queries
const users = await prisma.user.findMany();
for (const user of users) {
  const rewards = await prisma.userReward.findMany({
    where: { userId: user.id }
  });
}

// Good: Use include/select
const users = await prisma.user.findMany({
  include: { rewards: true }
});
```

---

## 🚀 Deployment Checklist

- [ ] Update `.env` with production credentials
- [ ] Set `NODE_ENV=production`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Build: `npm run build`
- [ ] Start: `npm run start:prod`
- [ ] Test endpoints with production URL
- [ ] Monitor logs and errors
- [ ] Set up backup strategy
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain

---

## 📚 Useful Commands

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode

# Testing
npm test                   # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report

# Database
npx prisma migrate dev    # Create migration
npx prisma migrate deploy # Deploy migration
npx prisma studio        # Open GUI

# Linting & Formatting
npm run lint              # Check code style
npm run format            # Fix formatting
```

---

## 🎯 Common Patterns

### Service Method
```typescript
async findAll() {
  return this.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    }
  });
}
```

### Error Handling
```typescript
import { NotFoundException } from '@nestjs/common';

async findOne(id: number) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('User not found');
  return user;
}
```

### Protected Endpoint
```typescript
@Post()
@UseGuards(JwtAuthGuard)
create(@Body() dto: CreateDto, @Request() req) {
  return this.service.create(req.user.userId, dto);
}
```

---

## 📞 Quick Reference

| What | Where | How |
|------|-------|-----|
| Start server | Terminal | `npm run start:dev` |
| View database | Terminal | `npx prisma studio` |
| Run tests | Terminal | `npm test` |
| Fix formatting | Terminal | `npm run format` |
| Create migration | Terminal | `npx prisma migrate dev --name <name>` |
| View API docs | Browser | `http://localhost:3000` (or check API_DOCUMENTATION.md) |

---

**Last Updated**: May 2026
**Backend Version**: 1.0.0
**Status**: Production Ready ✅
