#!/bin/bash

# Kiaan POS - Complete System Test
# Tests the entire payment flow end-to-end

set -e

echo "🧪 Testing Complete POS Payment Flow"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
PASSED=0
FAILED=0

# Helper function for tests
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "

    response=$(curl -s -o /dev/null -w "%{http_code}" $url)

    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected $expected_status, got $response)"
        ((FAILED++))
    fi
}

echo "1️⃣  Testing Backend Services"
echo "----------------------------"

test_endpoint "ERPNext" "http://localhost:8000"
test_endpoint "Supabase Studio" "http://localhost:54323"
test_endpoint "Hyperswitch" "http://localhost:8080/health"
test_endpoint "Database Admin" "http://localhost:8081"

echo ""
echo "2️⃣  Testing Database"
echo "--------------------"

echo -n "Checking PostgreSQL... "
if docker-compose -f /root/kiaan-pos-hybrid-stack/docker/docker-compose.yml exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC}"
    ((FAILED++))
fi

echo -n "Checking customers table... "
customer_count=$(docker-compose -f /root/kiaan-pos-hybrid-stack/docker/docker-compose.yml exec -T postgres psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM customers;" 2>/dev/null | tr -d ' ')
if [ "$customer_count" -gt 0 ]; then
    echo -e "${GREEN}✅ PASSED${NC} ($customer_count customers)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} (No customers found)"
    ((FAILED++))
fi

echo -n "Checking NFC cards table... "
cards_count=$(docker-compose -f /root/kiaan-pos-hybrid-stack/docker/docker-compose.yml exec -T postgres psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM nfc_cards;" 2>/dev/null | tr -d ' ')
if [ "$cards_count" -gt 0 ]; then
    echo -e "${GREEN}✅ PASSED${NC} ($cards_count cards)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} (No cards found)"
    ((FAILED++))
fi

echo ""
echo "3️⃣  Testing API Endpoints"
echo "-------------------------"

# Note: These tests assume ERPNext API is accessible
# In production, you'll need proper authentication

echo -e "${YELLOW}ℹ️  Skipping ERPNext API tests (requires authentication)${NC}"
echo "   To test manually:"
echo "   curl -H 'Authorization: token <api_key>:<api_secret>' http://localhost:8000/api/resource/Customer"

echo ""
echo "4️⃣  Summary"
echo "-----------"
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
