#!/bin/bash

# Comprehensive Kiaan POS Deployment Test
# Tests all endpoints after successful deployment

API_URL="https://kiaan-pos-wallet-system-production.up.railway.app"

echo "=================================="
echo "Kiaan POS - Complete Deployment Test"
echo "=================================="
echo ""
echo "API URL: $API_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
  local name="$1"
  local url="$2"
  local method="$3"
  local data="$4"
  local expected_status="$5"
  local token="$6"

  echo -n "Testing: $name... "

  if [ -n "$token" ]; then
    if [ "$method" = "POST" ]; then
      HTTP_CODE=$(curl -s -o /tmp/response.txt -w "%{http_code}" -X POST "$url" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "$data")
    else
      HTTP_CODE=$(curl -s -o /tmp/response.txt -w "%{http_code}" "$url" \
        -H "Authorization: Bearer $token")
    fi
  else
    if [ "$method" = "POST" ]; then
      HTTP_CODE=$(curl -s -o /tmp/response.txt -w "%{http_code}" -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data")
    else
      HTTP_CODE=$(curl -s -o /tmp/response.txt -w "%{http_code}" "$url")
    fi
  fi

  if [ "$HTTP_CODE" = "$expected_status" ]; then
    echo -e "${GREEN}✅ PASSED${NC} (HTTP $HTTP_CODE)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ FAILED${NC} (HTTP $HTTP_CODE, expected $expected_status)"
    cat /tmp/response.txt | head -c 200
    echo ""
    FAILED=$((FAILED + 1))
  fi
}

# 1. Health Check
echo "=== 1. Infrastructure Tests ==="
test_endpoint "Health Check" "$API_URL/health" "GET" "" "200"
echo ""

# 2. Auth Tests
echo "=== 2. Authentication Tests ==="
test_endpoint "Login (admin)" "$API_URL/api/auth/login" "POST" \
  '{"email":"testadmin@kiaan.com","password":"Test123!"}' "200"

# Extract token from response
TOKEN=$(cat /tmp/response.txt | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✅ Got auth token${NC}: ${TOKEN:0:50}..."

  test_endpoint "Get Current User" "$API_URL/api/auth/me" "GET" "" "200" "$TOKEN"
else
  echo -e "${RED}❌ No auth token received${NC}"
fi

echo ""

# 3. Customer Tests
echo "=== 3. Customer Management Tests ==="
test_endpoint "List Customers" "$API_URL/api/customers" "GET" "" "200" "$TOKEN"

TIMESTAMP=$(date +%s)
test_endpoint "Create Customer" "$API_URL/api/customers" "POST" \
  "{\"erpnext_id\":\"CUST-$TIMESTAMP\",\"name\":\"Test Customer\",\"phone\":\"+256700000000\",\"email\":\"test$TIMESTAMP@example.com\"}" \
  "201" "$TOKEN"

echo ""

# 4. Card Tests
echo "=== 4. NFC Card Tests ==="
test_endpoint "List Cards" "$API_URL/api/cards" "GET" "" "200" "$TOKEN"
echo ""

# 5. Transaction Tests
echo "=== 5. Transaction Tests ==="
test_endpoint "List Transactions" "$API_URL/api/transactions" "GET" "" "200" "$TOKEN"
echo ""

# 6. Dashboard Tests
echo "=== 6. Dashboard & Analytics ==="
test_endpoint "Dashboard Stats" "$API_URL/api/dashboard/stats" "GET" "" "200" "$TOKEN"
test_endpoint "Transaction Analytics" "$API_URL/api/analytics/transactions" "GET" "" "200" "$TOKEN"
echo ""

# 7. Branch Tests
echo "=== 7. Branch Management ==="
test_endpoint "List Branches" "$API_URL/api/branches" "GET" "" "200" "$TOKEN"
echo ""

# 8. Top-up Tests
echo "=== 8. Top-up System ==="
test_endpoint "Top-up History" "$API_URL/api/topup/history" "GET" "" "200" "$TOKEN"
echo ""

# Summary
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED! Deployment is successful!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Check the output above.${NC}"
  exit 1
fi
