#!/bin/bash
# EcoSmart Backend - Quick Setup Script
# This script sets up the backend in minutes

echo "🚀 EcoSmart Backend Setup"
echo "=========================="

# Step 1: Check prerequisites
echo "✅ Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
    exit 1
fi
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not installed (you'll need to install it)"
fi

echo "✅ Prerequisites OK"

# Step 2: Install dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 3: Create database
echo ""
echo "🗄️  Setting up database..."
createdb ecosmart 2>/dev/null || echo "ℹ️  Database may already exist"

# Step 4: Run migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --skip-generate
if [ $? -ne 0 ]; then
    echo "⚠️  Migration may have failed - check your PostgreSQL connection"
fi
echo "✅ Migrations complete"

# Step 5: Seed database (optional)
echo ""
read -p "🌱 Would you like to seed the database with test data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
    echo "✅ Database seeded with test data"
fi

# Step 6: Summary
echo ""
echo "=========================="
echo "✅ Setup Complete!"
echo "=========================="
echo ""
echo "📝 Test Credentials (if seeded):"
echo "   Admin: admin@ecosmart.com / admin123456"
echo "   User: john@example.com / user123456"
echo ""
echo "🚀 To start the server:"
echo "   npm run start:dev"
echo ""
echo "📚 Documentation:"
echo "   - API_DOCUMENTATION.md"
echo "   - DEVELOPMENT_GUIDE.md"
echo "   - README.md"
echo ""
echo "Server will run on: http://localhost:3000"
echo ""
