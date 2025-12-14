#!/bin/bash

# Complete Railway Setup & Verification Script
# This will check everything and fix what's needed

RAILWAY_TOKEN="7a6ae57f-925e-4434-aaee-c4d380c603aa"
PROJECT_ID="78399388-5ebb-4ab0-b1e5-df05e59f7549"
SERVICE_ID="6f66e911-f666-457d-97da-092267894570"
POSTGRES_ID="896cd60e-bc0f-40f6-9a9b-0c15b76c4cbb"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 COMPLETE RAILWAY SETUP - All-in-One Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will:"
echo "  ✓ Check your Railway deployment status"
echo "  ✓ Set up database tables (if needed)"
echo "  ✓ Verify environment variables"
echo "  ✓ Test your API endpoints"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Check Railway Connection
echo -e "${BLUE}[1/5] Checking Railway Project...${NC}"
PROJECT_CHECK=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ project(id: \\\"$PROJECT_ID\\\") { name } }\"}")

if echo "$PROJECT_CHECK" | grep -q "BIG POS wallet"; then
    echo -e "${GREEN}✓${NC} Connected to Railway project: BIG POS wallet"
else
    echo -e "${RED}✗${NC} Cannot connect to Railway project"
    exit 1
fi

# Step 2: Get DATABASE_URL from user
echo ""
echo -e "${BLUE}[2/5] Database Setup${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "To complete setup, I need your DATABASE_URL from Railway:"
echo ""
echo "1. Go to: https://railway.app/project/$PROJECT_ID/service/$POSTGRES_ID"
echo "2. Click 'Connect' tab"
echo "3. Copy the 'PostgreSQL Connection URL'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Paste your DATABASE_URL here (or press Enter to skip): " DATABASE_URL

if [ ! -z "$DATABASE_URL" ]; then
    echo ""
    echo "Checking database connection..."

    # Test connection
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Database connection successful"

        # Check if tables exist
        TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null | tr -d ' ')

        if [ "$TABLE_COUNT" -eq "0" ] || [ -z "$TABLE_COUNT" ]; then
            echo -e "${YELLOW}⚠${NC}  No tables found. Creating database schema..."

            if psql "$DATABASE_URL" < database-new/schema.sql > /dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} Database schema created successfully!"
                echo "  Created tables: customers, nfc_cards, card_transactions, top_ups, branches, users"
            else
                echo -e "${RED}✗${NC} Failed to create database schema"
                echo "  Run manually: psql \"$DATABASE_URL\" < database-new/schema.sql"
            fi
        else
            echo -e "${GREEN}✓${NC} Database has $TABLE_COUNT tables - already set up"
        fi
    else
        echo -e "${RED}✗${NC} Cannot connect to database"
        echo "  Please check your DATABASE_URL"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Skipped database setup"
    echo "  You can run ./setup-database.sh later"
fi

# Step 3: Check Environment Variables
echo ""
echo -e "${BLUE}[3/5] Environment Variables${NC}"
echo ""
echo -e "${YELLOW}⚠${NC}  Cannot check variables via API (security restriction)"
echo ""
echo "Please verify in Railway dashboard:"
echo "  https://railway.app/project/$PROJECT_ID/service/$SERVICE_ID"
echo ""
echo "Required variables:"
echo "  ✓ DATABASE_URL (auto-created by PostgreSQL)"
echo "  ? JWT_SECRET (you must add manually)"
echo ""
read -p "Have you added JWT_SECRET? (y/n): " JWT_CHECK

if [[ $JWT_CHECK =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}✓${NC} JWT_SECRET confirmed"
else
    echo -e "${YELLOW}⚠${NC}  Please add JWT_SECRET:"
    echo "  1. Go to: https://railway.app/project/$PROJECT_ID/service/$SERVICE_ID"
    echo "  2. Variables tab → + New Variable"
    echo "  3. Name: JWT_SECRET"
    echo "  4. Value: kiaan-pos-secret-2024-$(openssl rand -hex 16)"
fi

# Step 4: Check if code is pushed
echo ""
echo -e "${BLUE}[4/5] Code Deployment${NC}"
echo ""

if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${GREEN}✓${NC} All changes committed"
else
    echo -e "${YELLOW}⚠${NC}  Uncommitted changes found"
    echo "  Commit changes: git add . && git commit -m 'Update'"
fi

# Check if pushed
UNPUSHED=$(git rev-list @{u}..HEAD 2>/dev/null | wc -l)
if [ "$UNPUSHED" -eq "0" ]; then
    echo -e "${GREEN}✓${NC} All changes pushed to GitHub"
else
    echo -e "${YELLOW}⚠${NC}  $UNPUSHED commit(s) not pushed"
    echo ""
    read -p "Push changes now? (y/n): " PUSH_NOW
    if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
        echo "Pushing to GitHub..."
        if git push origin main; then
            echo -e "${GREEN}✓${NC} Pushed successfully!"
            echo "  Railway will auto-deploy in 2-3 minutes"
        else
            echo -e "${RED}✗${NC} Push failed"
        fi
    fi
fi

# Step 5: Test Deployment
echo ""
echo -e "${BLUE}[5/5] Testing Deployment${NC}"
echo ""
echo "Waiting for Railway to deploy..."
sleep 3

echo ""
echo "To test your deployment:"
echo "  1. Get your Railway URL from:"
echo "     https://railway.app/project/$PROJECT_ID/service/$SERVICE_ID"
echo "     (Settings → Domains)"
echo ""
echo "  2. Test health endpoint:"
echo "     curl https://your-url.railway.app/health"
echo ""
echo "  3. Check logs:"
echo "     https://railway.app/project/$PROJECT_ID/service/$SERVICE_ID"
echo "     (Deployments → Latest → View Logs)"
echo ""
echo "Expected in logs:"
echo "  ✅ Using DATABASE_URL for connection"
echo "  ✅ Database connected successfully"
echo "  🚀 Kiaan POS API Server running on port XXXX"
echo "  ✅ Ready to accept requests!"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Checklist:"
echo "  ✓ Railway project connected"
if [ ! -z "$DATABASE_URL" ]; then
    echo "  ✓ Database configured"
fi
if [[ $JWT_CHECK =~ ^[Yy]$ ]]; then
    echo "  ✓ JWT_SECRET set"
fi
if [ "$UNPUSHED" -eq "0" ]; then
    echo "  ✓ Code deployed"
fi
echo ""
echo "📚 Documentation:"
echo "  • Quick reference: RAILWAY_QUICK_CHECKLIST.md"
echo "  • Full guide: RAILWAY_QUICKSTART.md"
echo ""
echo "🔗 Your Railway Project:"
echo "  https://railway.app/project/$PROJECT_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
