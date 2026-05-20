# 🌿 EcoSmart - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Installation Steps](#installation-steps)
4. [Running the Application](#running-the-application)
5. [Access Points](#access-points)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## 🚀 Quick Start

### For Developers (Fastest Way)

```bash
# Terminal 1: Start Backend
cd "/Users/aayush/Documents/EcoSmart the waste management/eco-smart-backend"
npm run start:dev

# Terminal 2: Start Frontend HTTP Server
cd "/Users/aayush/Documents/EcoSmart the waste management"
python3 -m http.server 8080

# Terminal 3: Access the Application
# Open browser: http://localhost:8080
```

### For Production (Automated)

```bash
# Single command to start everything
bash "/Users/aayush/Documents/EcoSmart the waste management/START_APPLICATION.sh"
```

---

## ✅ System Requirements

### Required
- **Node.js** v18+ (v24.15.0 recommended)
- **npm** v9+ (v11.12.1 recommended)
- **PostgreSQL** v12+ (v15.17 recommended)
- **Python 3** or Node.js (for HTTP server)

### Verify Installation

```bash
node --version      # Should show v24.15.0+
npm --version       # Should show v11.12.1+
psql --version      # Should show PostgreSQL 15.17+
python3 --version   # Should show Python 3.9+
```

---

## 📦 Installation Steps

### Step 1: Clone/Navigate to Project

```bash
cd "/Users/aayush/Documents/EcoSmart the waste management"
```

### Step 2: Install Backend Dependencies

```bash
cd eco-smart-backend
npm install
```

### Step 3: Setup Database

```bash
# The database 'ecosmart' should already exist
# If not, create it:
psql -U postgres -c "CREATE DATABASE ecosmart;"

# Run migrations
npx prisma migrate deploy
# OR
npx prisma db push
```

### Step 4: Configure Environment

Backend `.env` file is already configured at:
```
eco-smart-backend/.env
```

Key settings:
```
DATABASE_URL=postgresql://aayush:1234512345@localhost:5432/ecosmart
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string-at-least-32-chars
PORT=3000
NODE_ENV=development
```

---

## 🏃 Running the Application

### Method 1: Automated (Recommended for First Time)

```bash
bash "/Users/aayush/Documents/EcoSmart the waste management/START_APPLICATION.sh"
```

This script will:
- ✓ Check all prerequisites
- ✓ Verify PostgreSQL database
- ✓ Install dependencies
- ✓ Run database migrations
- ✓ Start backend server
- ✓ Display access instructions

### Method 2: Manual (For Development)

**Terminal 1 - Backend Server:**
```bash
cd "/Users/aayush/Documents/EcoSmart the waste management/eco-smart-backend"
npm run start:dev
# Backend runs on: http://localhost:3000
```

**Terminal 2 - Frontend Server:**
```bash
cd "/Users/aayush/Documents/EcoSmart the waste management"

# Option A: Using Python (Recommended)
python3 -m http.server 8080

# Option B: Using Node.js
npx http-server -p 8080

# Frontend runs on: http://localhost:8080
```

**Terminal 3 - Open Browser:**
```
http://localhost:8080
```

---

## 🌐 Access Points

### Frontend URLs

| Portal | URL |
|--------|-----|
| Main Gateway | `http://localhost:8080` |
| Citizen Login | `http://localhost:8080/user/login.html` |
| Citizen Signup | `http://localhost:8080/user/signup.html` |
| Citizen Dashboard | `http://localhost:8080/user/dashboard.html` |
| Admin Login | `http://localhost:8080/admin/admin-login.html` |
| Admin Dashboard | `http://localhost:8080/admin/admin-dashboard.html` |

### Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/ping` | GET | Health check |
| `/auth/login` | POST | User login |
| `/auth/register` | POST | New user registration |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password with token |
| `/users/me` | GET | Get current user profile |
| `/trucks` | GET | Get all trucks |
| `/complaints` | GET | Get all complaints |
| `/notifications` | GET | Get notifications |

### Swagger/API Documentation

Currently available at: `http://localhost:3000` (API root)

To add Swagger UI, see Production Deployment section.

---

## 🧪 Testing

### Test Credentials

#### Citizen User
```
Email: user@example.com
Password: user123
```

#### Admin User
```
Email: admin@example.com
Password: admin123
```

### Test Password Reset

1. Go to: `http://localhost:8080/user/forgot-password.html`
2. Enter any registered email
3. Backend will send email (check console in development)
4. Click reset link to change password

### API Testing with cURL

```bash
# Test backend is running
curl http://localhost:3000/auth/ping

# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Test forgot password
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to the server"

**Solution:**
1. Check backend is running: `curl http://localhost:3000/auth/ping`
2. Verify port 3000 is not in use: `lsof -i :3000`
3. Kill any stuck processes: `lsof -ti:3000 | xargs kill -9`
4. Restart backend: `npm run start:dev`

### Issue: "Database connection failed"

**Solution:**
1. Check PostgreSQL is running: `psql -U postgres -l`
2. Verify database exists: `psql -U postgres -d ecosmart -c "SELECT 1"`
3. Check credentials in `.env`: `DATABASE_URL`
4. Run migrations: `npx prisma db push`

### Issue: "Port 3000/8080 already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different ports
npm run start:dev -- --port 3001  # Backend
python3 -m http.server 8081        # Frontend
```

### Issue: "Module not found" (Backend)

**Solution:**
```bash
cd eco-smart-backend
rm -rf node_modules package-lock.json
npm install
npm run build
npm run start:dev
```

### Issue: "Prisma migrations failed"

**Solution:**
```bash
cd eco-smart-backend

# Option 1: Push schema to database
npx prisma db push

# Option 2: Reset and reseed database
npx prisma migrate reset
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Update `.env` with production database URL
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Configure email service (SMTP credentials)
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable HTTPS/SSL
- [ ] Update CORS origins in `main.ts`
- [ ] Set `NODE_ENV=production`
- [ ] Run database migrations on production DB
- [ ] Test complete login/password reset flow

### Environment Variables for Production

```env
# .env (Production)
DATABASE_URL=postgresql://user:password@prod-db-host:5432/ecosmart
JWT_SECRET=your-very-strong-random-secret-min-32-chars-change-this
FRONTEND_URL=https://your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@your-domain.com
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Build for Production

```bash
cd eco-smart-backend

# Build the application
npm run build

# Start production server
npm run start
```

### Deploy Frontend

```bash
# Option 1: Static hosting (Vercel, Netlify, GitHub Pages)
# Upload the entire directory as static files

# Option 2: Docker
# See docker-compose.yml (to be created)

# Option 3: Traditional hosting
# Upload files to web server (Apache, Nginx)
```

### Docker Deployment (Optional)

For containerized deployment:

```bash
# Backend Dockerfile
FROM node:24-alpine
WORKDIR /app
COPY eco-smart-backend .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### CORS Configuration for Production

Update `eco-smart-backend/src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 📊 Project Structure

```
/Users/aayush/Documents/EcoSmart the waste management/
├── START_APPLICATION.sh              # Main startup script
├── START_FRONTEND.sh                 # Frontend server launcher
├── index.html                        # Main portal selector
├── script.js                         # API layer & core logic
├── style.css                         # Global styles
├── config.js                         # Configuration
│
├── user/                             # Citizen portal
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── notifications.html
│   ├── forgot-password.html
│   ├── reset-password.html
│   └── ... (20+ other pages)
│
├── admin/                            # Admin portal
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── users.html
│   ├── trucks.html
│   └── ... (20+ other pages)
│
└── eco-smart-backend/                # NestJS Backend
    ├── src/
    │   ├── auth/                     # Authentication module
    │   │   ├── auth.service.ts
    │   │   ├── auth.controller.ts
    │   │   └── email.service.ts
    │   ├── users/                    # User management
    │   ├── trucks/                   # Truck management
    │   ├── complaints/               # Complaint system
    │   ├── notifications/            # Notifications
    │   └── ... (10+ other modules)
    ├── prisma/
    │   ├── schema.prisma             # Database schema
    │   └── migrations/               # Database migrations
    ├── .env                          # Environment variables
    └── package.json
```

---

## 📞 Support & Resources

### Important Files
- **Backend startup**: `eco-smart-backend/package.json`
- **Database schema**: `eco-smart-backend/prisma/schema.prisma`
- **API configuration**: `eco-smart-backend/.env`
- **Frontend config**: `config.js`

### Monitoring

```bash
# View backend logs
tail -f /tmp/ecosmart-backend.log

# Check database status
psql -U postgres -d ecosmart -c "SELECT * FROM \"User\" LIMIT 5;"

# Monitor running processes
ps aux | grep "node\|nest"

# Check port usage
lsof -i :3000
lsof -i :8080
```

### Common Commands

```bash
# Kill all node processes
killall node

# Reset database
psql -U postgres -d ecosmart -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Start fresh
rm -rf eco-smart-backend/node_modules
npm install
npx prisma migrate reset
```

---

## ✨ Application Features

✅ **Authentication**
- Email/password login
- User registration
- Forgot password with email reset
- JWT tokens (24-hour expiration)
- Role-based access control

✅ **Citizen Portal**
- Dashboard with stats
- Report waste issues
- Real-time truck tracking
- Eco-rewards system
- Notifications
- Leaderboard
- Browse marketplace

✅ **Admin Portal**
- Dashboard analytics
- User management
- Truck fleet management
- Complaint resolution
- Dustbin monitoring
- Reports & statistics

✅ **Technical Stack**
- **Frontend**: Vanilla HTML/CSS/JS, Leaflet.js maps
- **Backend**: NestJS, TypeScript, Express
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Real-time**: WebSocket ready

---

## 🎯 Next Steps After Setup

1. **Test the login** with provided credentials
2. **Try password reset** functionality
3. **Create new users** via signup
4. **Explore all portals** (Citizen & Admin)
5. **Test API endpoints** with cURL or Postman
6. **Configure email service** for production
7. **Deploy to cloud** (AWS, Google Cloud, Azure, etc.)

---

## 📝 Final Notes

- **CORS is open** in development mode for testing
- **Emails don't actually send** in development (check console)
- **Database is local** PostgreSQL (change for production)
- **All credentials stored** securely with bcrypt hashing
- **JWT tokens expire** after 24 hours

---

**Last Updated**: May 6, 2026
**Version**: 1.0.0 - Production Ready
**Status**: ✅ Ready for Public Deployment
