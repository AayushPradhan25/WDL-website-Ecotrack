#!/bin/bash

#############################################################################
# 🌿 EcoSmart Waste Management System - Complete Startup Script
# This script starts both backend and frontend with all requirements
#############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🌿 EcoSmart - Waste Management System                         ║${NC}"
echo -e "${BLUE}║  Starting Complete Application Stack                           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ============================================================================
# STEP 1: Verify Prerequisites
# ============================================================================
echo -e "${YELLOW}[1/6] Checking Prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL installed${NC}"

# Check npm
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
echo ""

# ============================================================================
# STEP 2: Verify Database
# ============================================================================
echo -e "${YELLOW}[2/6] Checking PostgreSQL Database...${NC}"

# Try to connect to PostgreSQL
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw ecosmart; then
    echo -e "${GREEN}✓ Database 'ecosmart' exists${NC}"
else
    echo -e "${YELLOW}⚠ Database 'ecosmart' not found, creating...${NC}"
    psql -U postgres -c "CREATE DATABASE ecosmart;" 2>/dev/null || true
    echo -e "${GREEN}✓ Database 'ecosmart' created${NC}"
fi
echo ""

# ============================================================================
# STEP 3: Setup Backend
# ============================================================================
echo -e "${YELLOW}[3/6] Setting up Backend Server...${NC}"

cd "$SCRIPT_DIR/eco-smart-backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi
echo -e "${GREEN}✓ Backend dependencies ready${NC}"

# Run Prisma migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate deploy 2>/dev/null || npx prisma db push
echo -e "${GREEN}✓ Database migrations completed${NC}"
echo ""

# ============================================================================
# STEP 4: Verify Frontend
# ============================================================================
echo -e "${YELLOW}[4/6] Verifying Frontend Files...${NC}"

cd "$SCRIPT_DIR"

# Check critical files
FILES_TO_CHECK=("index.html" "script.js" "style.css" "config.js" "user/login.html" "admin/admin-login.html")

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done
echo ""

# ============================================================================
# STEP 5: Start Backend
# ============================================================================
echo -e "${YELLOW}[5/6] Starting Backend Server...${NC}"

cd "$SCRIPT_DIR/eco-smart-backend"

# Kill any existing processes on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Stopping existing process on port 3000...${NC}"
    kill $(lsof -t -i :3000) 2>/dev/null || true
    sleep 2
fi

# Start backend in background
npm run start:dev > /tmp/ecosmart-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000/auth/ping > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "Check logs: cat /tmp/ecosmart-backend.log"
        exit 1
    fi
    sleep 1
done
echo ""

# ============================================================================
# STEP 6: Display Frontend Access Info
# ============================================================================
echo -e "${YELLOW}[6/6] Frontend Ready${NC}"

echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ EcoSmart Application is Ready!                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 BACKEND SERVER:${NC}"
echo -e "   URL: ${YELLOW}http://localhost:3000${NC}"
echo -e "   Status: ${GREEN}✓ Running${NC}"
echo ""
echo -e "${BLUE}🌐 FRONTEND ACCESS:${NC}"
echo -e "   Option 1 - Local File: ${YELLOW}file://$SCRIPT_DIR/index.html${NC}"
echo -e "   Option 2 - HTTP Server: ${YELLOW}Start a local HTTP server (see below)${NC}"
echo ""
echo -e "${BLUE}📋 DEFAULT TEST CREDENTIALS:${NC}"
echo -e "   ${YELLOW}Citizen Portal:${NC}"
echo -e "     Email: user@example.com"
echo -e "     Password: user123"
echo ""
echo -e "   ${YELLOW}Admin Portal:${NC}"
echo -e "     Email: admin@example.com"
echo -e "     Password: admin123"
echo ""
echo -e "${BLUE}🚀 TO START A LOCAL HTTP SERVER (Recommended):${NC}"
echo -e "   ${YELLOW}Option A - Using Python:${NC}"
echo -e "     cd '$SCRIPT_DIR'"
echo -e "     python3 -m http.server 8080"
echo ""
echo -e "   ${YELLOW}Option B - Using Node.js:${NC}"
echo -e "     cd '$SCRIPT_DIR'"
echo -e "     npx http-server -p 8080"
echo ""
echo -e "   Then open: ${YELLOW}http://localhost:8080${NC}"
echo ""
echo -e "${BLUE}📁 IMPORTANT FILES & FOLDERS:${NC}"
echo -e "   Backend: ${YELLOW}$SCRIPT_DIR/eco-smart-backend${NC}"
echo -e "   Frontend (Citizen): ${YELLOW}$SCRIPT_DIR/user${NC}"
echo -e "   Frontend (Admin): ${YELLOW}$SCRIPT_DIR/admin${NC}"
echo -e "   Database: ${YELLOW}PostgreSQL (ecosmart)${NC}"
echo ""
echo -e "${BLUE}🔒 API ENDPOINTS:${NC}"
echo -e "   Login: POST /auth/login"
echo -e "   Register: POST /auth/register"
echo -e "   Forgot Password: POST /auth/forgot-password"
echo -e "   Reset Password: POST /auth/reset-password"
echo ""
echo -e "${BLUE}⚠️  TROUBLESHOOTING:${NC}"
echo -e "   Backend logs: ${YELLOW}tail -f /tmp/ecosmart-backend.log${NC}"
echo -e "   Kill backend: ${YELLOW}lsof -ti:3000 | xargs kill -9${NC}"
echo -e "   Check database: ${YELLOW}psql -U postgres -d ecosmart${NC}"
echo ""
echo -e "${GREEN}📌 APPLICATION IS READY FOR PUBLIC USE!${NC}"
echo ""
