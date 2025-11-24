#!/bin/bash

# Railway Setup Verification Script
# This helps diagnose what's missing in your Railway deployment

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Railway Deployment Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check marks
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"

# Function to print section header
print_header() {
    echo ""
    echo -e "${BLUE}━━━ $1 ━━━${NC}"
}

# Function to print success
print_success() {
    echo -e "${CHECK} $1"
}

# Function to print error
print_error() {
    echo -e "${CROSS} $1"
}

# Function to print warning
print_warning() {
    echo -e "${WARN} $1"
}

# Check 1: Git repository status
print_header "1. Git Repository Status"
if [ -d ".git" ]; then
    print_success "Git repository initialized"

    # Check if changes are committed
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        print_success "All changes committed"
    else
        print_warning "Uncommitted changes detected"
        echo "           Run: git status"
    fi

    # Check if remote exists
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin 2>/dev/null)
        print_success "Remote configured: $REMOTE_URL"
    else
        print_error "No remote repository configured"
        echo "           Run: git remote add origin YOUR_GITHUB_URL"
    fi

    # Check last commit
    LAST_COMMIT=$(git log -1 --oneline 2>/dev/null | head -c 60)
    if [ ! -z "$LAST_COMMIT" ]; then
        echo "           Last commit: $LAST_COMMIT"
    fi
else
    print_error "Not a git repository"
    echo "           Run: git init"
fi

# Check 2: Required files
print_header "2. Required Files Check"
required_files=(
    "backend/server.js"
    "start-railway.js"
    "database-new/schema.sql"
    "package.json"
    "railway.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file missing"
    fi
done

# Check 3: Database schema
print_header "3. Database Schema"
if [ -f "database-new/schema.sql" ]; then
    TABLES=$(grep -c "CREATE TABLE" database-new/schema.sql)
    print_success "Schema has $TABLES tables"
    echo "           Tables: customers, nfc_cards, card_transactions, top_ups, branches, users"
else
    print_error "schema.sql not found"
fi

# Check 4: Code fixes
print_header "4. Code Fixes Applied"

# Check if DATABASE_URL support is added
if grep -q "DATABASE_URL" backend/server.js; then
    print_success "DATABASE_URL support added"
else
    print_error "DATABASE_URL support not found"
    echo "           Need to apply fixes!"
fi

# Check if poolConfig exists
if grep -q "poolConfig" backend/server.js; then
    print_success "Dynamic database configuration enabled"
else
    print_error "Database configuration not updated"
fi

# Check if start-railway.js is executable
if [ -x "start-railway.js" ]; then
    print_success "Railway startup script is executable"
else
    print_warning "Railway startup script not executable"
    echo "           Run: chmod +x start-railway.js"
fi

# Check 5: Package.json start command
print_header "5. Package.json Configuration"
if grep -q '"start": "node start-railway.js"' package.json; then
    print_success "Start command configured for Railway"
elif grep -q '"start": "pm2 start' package.json; then
    print_error "Still using PM2 start command"
    echo "           Update package.json start script"
else
    print_warning "Start command format unexpected"
fi

# Check 6: Railway.json
print_header "6. Railway Configuration"
if [ -f "railway.json" ]; then
    if grep -q "start-railway.js" railway.json; then
        print_success "Railway.json configured correctly"
    else
        print_warning "Railway.json may need updates"
    fi

    if grep -q "healthcheckPath" railway.json; then
        print_success "Health check endpoint configured"
    fi
else
    print_error "railway.json not found"
fi

# Check 7: Documentation
print_header "7. Documentation Files"
doc_files=(
    "RAILWAY_QUICK_CHECKLIST.md"
    "RAILWAY_VISUAL_FIX_GUIDE.md"
    "RAILWAY_QUICKSTART.md"
    "RAILWAY_ACTION_ITEMS.md"
)

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file"
    else
        print_warning "$file not found"
    fi
done

# Summary
print_header "Summary & Next Steps"
echo ""

echo "📋 CHECKLIST FOR RAILWAY DASHBOARD:"
echo ""
echo "   ${BLUE}IN RAILWAY (not here):${NC}"
echo "   [ ] 1. Add PostgreSQL database service"
echo "   [ ] 2. Add JWT_SECRET environment variable"
echo "   [ ] 3. Run database-new/schema.sql in PostgreSQL query editor"
echo "   [ ] 4. Push code to GitHub: git push origin main"
echo "   [ ] 5. Wait for deployment (2-3 minutes)"
echo "   [ ] 6. Check logs for 'Database connected successfully'"
echo "   [ ] 7. Test: curl https://your-app.railway.app/health"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 QUICK REFERENCE:"
echo "   • Quick checklist:  RAILWAY_QUICK_CHECKLIST.md"
echo "   • Visual guide:     RAILWAY_VISUAL_FIX_GUIDE.md"
echo "   • Complete guide:   RAILWAY_QUICKSTART.md"
echo ""
echo "🚀 TO GET YOUR PERSONAL RAILWAY TOKEN:"
echo "   1. Go to: https://railway.app/account/tokens"
echo "   2. Click 'Create New Token'"
echo "   3. Copy the token"
echo "   4. Use it with: export RAILWAY_TOKEN=your-token-here"
echo ""
echo "💡 TO DEPLOY:"
echo "   1. Open Railway dashboard: https://railway.app/dashboard"
echo "   2. Find your project"
echo "   3. Follow the 4 steps in RAILWAY_QUICK_CHECKLIST.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
