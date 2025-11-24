#!/bin/bash

# Database Setup Script
# This will initialize your Railway PostgreSQL database with the schema

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  Railway Database Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will create all database tables in your Railway PostgreSQL."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Get your DATABASE_URL from Railway"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to your Railway dashboard"
echo "2. Click on 'Postgres' service"
echo "3. Go to 'Connect' tab"
echo "4. Copy the 'DATABASE_URL' (PostgreSQL Connection URL)"
echo ""
echo "It should look like:"
echo "postgresql://postgres:password@hostname.railway.app:5432/railway"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Prompt for DATABASE_URL
read -p "Paste your DATABASE_URL here: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo ""
    echo "❌ Error: No DATABASE_URL provided"
    echo ""
    echo "Please run this script again and paste your DATABASE_URL"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Running database schema..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed"
    echo ""
    echo "Install it with:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  Mac: brew install postgresql"
    echo ""
    exit 1
fi

# Check if schema file exists
if [ ! -f "database-new/schema.sql" ]; then
    echo "❌ Error: database-new/schema.sql not found"
    echo ""
    echo "Make sure you're running this from the project root directory:"
    echo "  cd /root/kiaan-pos-wallet-system"
    echo "  ./setup-database.sh"
    echo ""
    exit 1
fi

# Run the schema
echo "Creating tables..."
echo ""

psql "$DATABASE_URL" < database-new/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ SUCCESS! Database schema created"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Tables created:"
    echo "  ✓ customers"
    echo "  ✓ nfc_cards"
    echo "  ✓ card_transactions"
    echo "  ✓ top_ups"
    echo "  ✓ branches"
    echo "  ✓ users"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 NEXT STEPS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. ✅ Database schema - DONE"
    echo ""
    echo "2. Add JWT_SECRET to Railway:"
    echo "   • Go to your main service in Railway"
    echo "   • Variables tab → + New Variable"
    echo "   • Name: JWT_SECRET"
    echo "   • Value: kiaan-pos-secret-2024"
    echo ""
    echo "3. Push code changes:"
    echo "   git push origin main"
    echo ""
    echo "4. Wait for deployment (2-3 minutes)"
    echo ""
    echo "5. Check logs - should see:"
    echo "   ✅ Database connected successfully"
    echo "   🚀 Ready to accept requests!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ ERROR: Failed to create database schema"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Common issues:"
    echo "  1. Invalid DATABASE_URL"
    echo "  2. Database connection timeout"
    echo "  3. Permission issues"
    echo ""
    echo "Try:"
    echo "  1. Verify the DATABASE_URL is correct"
    echo "  2. Check Railway PostgreSQL is running"
    echo "  3. Run: psql \"YOUR_DATABASE_URL\" -c \"SELECT 1\""
    echo ""
    exit 1
fi
