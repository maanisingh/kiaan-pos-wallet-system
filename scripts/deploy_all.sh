#!/bin/bash

# Kiaan POS Hybrid Stack - Complete Deployment Script
# This script deploys everything in one go!

set -e

echo "🚀 Kiaan POS Hybrid Stack - Automated Deployment"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required but not installed.${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose is required but not installed.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}" >&2; exit 1; }

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# Step 1: Deploy Backend Services
echo "📦 Step 1/6: Deploying Backend Services (ERPNext, Supabase, Hyperswitch)"
echo "----------------------------------------------------------------------"

cd /root/kiaan-pos-hybrid-stack/docker

echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for services to initialize (2 minutes)..."
sleep 120

echo -e "${GREEN}✅ Backend services started${NC}"
echo ""

# Step 2: Initialize Database
echo "🗄️  Step 2/6: Initializing Database"
echo "------------------------------------"

echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  echo "  Waiting..."
  sleep 5
done

echo "Running database schema..."
docker-compose exec -T postgres psql -U postgres -d postgres < ../database/schema.sql

echo "Loading seed data..."
docker-compose exec -T postgres psql -U postgres -d postgres < ../database/seed.sql

echo -e "${GREEN}✅ Database initialized${NC}"
echo ""

# Step 3: Configure ERPNext
echo "⚙️  Step 3/6: Configuring ERPNext"
echo "---------------------------------"

echo "Waiting for ERPNext to be ready..."
sleep 60

echo -e "${YELLOW}ℹ️  ERPNext Configuration${NC}"
echo "  Access: http://localhost:8000"
echo "  Username: Administrator"
echo "  Password: admin"
echo ""
echo "  Please complete the setup wizard in your browser:"
echo "  1. Select country: Uganda"
echo "  2. Company name: Your Company Name"
echo "  3. Enable POS module"
echo "  4. Complete wizard"
echo ""
echo "  Press ENTER when setup wizard is complete..."
read

echo -e "${GREEN}✅ ERPNext configured${NC}"
echo ""

# Step 4: Deploy Admin Dashboard
echo "🖥️  Step 4/6: Building Admin Dashboard"
echo "--------------------------------------"

cd /root/kiaan-pos-hybrid-stack/admin-dashboard

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Building admin dashboard..."
npm run build

echo -e "${GREEN}✅ Admin dashboard built${NC}"
echo ""

# Step 5: Build Mobile App
echo "📱 Step 5/6: Building Mobile App"
echo "---------------------------------"

cd /root/kiaan-pos-hybrid-stack/mobile-app

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo -e "${GREEN}✅ Mobile app dependencies installed${NC}"
echo ""

# Step 6: Test Everything
echo "🧪 Step 6/6: Testing Complete System"
echo "-------------------------------------"

cd /root/kiaan-pos-hybrid-stack/scripts
./test_complete_flow.sh

echo ""
echo "================================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "================================================"
echo ""
echo "📊 Access Points:"
echo "  ERPNext:          http://localhost:8000"
echo "  Admin Dashboard:  http://localhost:5173 (npm run dev)"
echo "  Supabase Studio:  http://localhost:54323"
echo "  Hyperswitch:      http://localhost:8080"
echo "  Database Admin:   http://localhost:8081"
echo ""
echo "📱 Mobile App:"
echo "  cd /root/kiaan-pos-hybrid-stack/mobile-app"
echo "  npm start"
echo ""
echo "📚 Documentation:"
echo "  Quick Start: /root/kiaan-pos-hybrid-stack/QUICK_START.md"
echo ""
echo "🔑 Default Credentials:"
echo "  ERPNext:   Administrator / admin"
echo "  Database:  postgres / your_super_secret_password"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "  1. Configure mobile money API keys (MTN, Airtel)"
echo "  2. Set up payment webhooks"
echo "  3. Test NFC card reading"
echo "  4. Configure production domains"
echo ""
echo "Happy coding! 🚀"
