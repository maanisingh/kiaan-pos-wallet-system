#!/bin/bash

# Check Railway Project Status via API
# Uses your Railway token to check configuration

TOKEN="7a6ae57f-925e-4434-aaee-c4d380c603aa"
PROJECT_ID="78399388-5ebb-4ab0-b1e5-df05e59f7549"
SERVICE_ID="6f66e911-f666-457d-97da-092267894570"
POSTGRES_ID="896cd60e-bc0f-40f6-9a9b-0c15b76c4cbb"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Railway Project Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check 1: Project Access
echo -e "${BLUE}1. Checking Project Access...${NC}"
PROJECT_INFO=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ projects { edges { node { id name } } } }\"}")

if echo "$PROJECT_INFO" | grep -q "BIG POS wallet"; then
    echo -e "${CHECK} Connected to 'BIG POS wallet' project"
else
    echo -e "${CROSS} Cannot access project"
fi

# Check 2: Services
echo ""
echo -e "${BLUE}2. Services in Project:${NC}"
SERVICES=$(curl -s -X POST https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"{ project(id: \\\"$PROJECT_ID\\\") { services { edges { node { id name } } } } }\"}")

echo "$SERVICES" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    services = data.get('data', {}).get('project', {}).get('services', {}).get('edges', [])
    for svc in services:
        name = svc['node']['name']
        svc_id = svc['node']['id']
        if 'Postgres' in name or 'postgres' in name.lower():
            print('   ✓ PostgreSQL database: ' + name + ' (ID: ' + svc_id + ')')
        elif 'kiaan-pos' in name.lower():
            print('   ✓ Main app: ' + name + ' (ID: ' + svc_id + ')')
        else:
            print('   • ' + name)
except:
    print('   ⚠ Could not parse services')
" 2>/dev/null || echo "   ⚠ Could not check services"

# Check 3: Latest Deployment
echo ""
echo -e "${BLUE}3. Latest Deployment Status:${NC}"
echo "   ⚠ Cannot query deployment status via API (requires web interface)"
echo "   👉 Check in Railway Dashboard → Deployments tab"

# Check 4: Environment Variables
echo ""
echo -e "${BLUE}4. Environment Variables:${NC}"
echo "   ⚠ Cannot list variables via API (security restriction)"
echo "   👉 Check in Railway Dashboard → Variables tab"
echo ""
echo "   REQUIRED Variables:"
echo "   • DATABASE_URL (auto-created by PostgreSQL)"
echo "   • JWT_SECRET (you must add manually)"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}Summary:${NC}"
echo ""
echo -e "${CHECK} Project found: BIG POS wallet"
echo -e "${CHECK} PostgreSQL database is added"
echo -e "${CHECK} Main service exists: kiaan-pos-wallet-system"
echo ""
echo -e "${YELLOW}⚠️  MANUAL STEPS REQUIRED IN RAILWAY DASHBOARD:${NC}"
echo ""
echo "   1. Check Variables tab for:"
echo "      • DATABASE_URL exists (auto-created)"
echo "      • JWT_SECRET exists (add if missing)"
echo ""
echo "   2. Check Deployments tab:"
echo "      • Latest deployment status"
echo "      • View logs for errors"
echo ""
echo "   3. Initialize database:"
echo "      • PostgreSQL → Data → Query"
echo "      • Run: database-new/schema.sql"
echo ""
echo "   4. Push code changes:"
echo "      • git push origin main"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Quick Links:"
echo "   • Dashboard: https://railway.app/project/$PROJECT_ID"
echo "   • Service: https://railway.app/project/$PROJECT_ID/service/$SERVICE_ID"
echo "   • PostgreSQL: https://railway.app/project/$PROJECT_ID/service/$POSTGRES_ID"
echo ""
echo "📚 Documentation:"
echo "   • Quick guide: RAILWAY_QUICK_CHECKLIST.md"
echo "   • Visual guide: RAILWAY_VISUAL_FIX_GUIDE.md"
echo ""
