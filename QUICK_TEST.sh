#!/bin/bash

# Quick Test Script for Multi-Dashboard Deployment
# Usage: ./QUICK_TEST.sh

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║       Kiaan POS Multi-Dashboard Deployment Test               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="https://pos-production-bae1.up.railway.app"

echo "🔍 Testing Deployment at: $BASE_URL"
echo ""

# Test 1: Health Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Health Check Endpoint"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo "✅ Health Check: PASSED"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health Check: FAILED"
    echo "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Landing Page
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Landing Page (Root)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LANDING_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$LANDING_STATUS" = "200" ]; then
    echo "✅ Landing Page: PASSED (HTTP $LANDING_STATUS)"
else
    echo "❌ Landing Page: FAILED (HTTP $LANDING_STATUS)"
fi
echo ""

# Test 3: Admin Dashboard
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Admin Dashboard (/admin)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin")
if [ "$ADMIN_STATUS" = "200" ]; then
    echo "✅ Admin Dashboard: PASSED (HTTP $ADMIN_STATUS)"
else
    echo "❌ Admin Dashboard: FAILED (HTTP $ADMIN_STATUS)"
fi
echo ""

# Test 4: Merchant Dashboard
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Merchant Dashboard (/merchant)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
MERCHANT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/merchant")
if [ "$MERCHANT_STATUS" = "200" ]; then
    echo "✅ Merchant Dashboard: PASSED (HTTP $MERCHANT_STATUS)"
else
    echo "❌ Merchant Dashboard: FAILED (HTTP $MERCHANT_STATUS)"
fi
echo ""

# Test 5: Customer Portal
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Customer Portal (/customer)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
CUSTOMER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/customer")
if [ "$CUSTOMER_STATUS" = "200" ]; then
    echo "✅ Customer Portal: PASSED (HTTP $CUSTOMER_STATUS)"
else
    echo "❌ Customer Portal: FAILED (HTTP $CUSTOMER_STATUS)"
fi
echo ""

# Test 6: POS Terminal
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. POS Terminal (/pos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
POS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/pos")
if [ "$POS_STATUS" = "200" ]; then
    echo "✅ POS Terminal: PASSED (HTTP $POS_STATUS)"
else
    echo "❌ POS Terminal: FAILED (HTTP $POS_STATUS)"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                         TEST SUMMARY                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

[[ $HEALTH_RESPONSE == *"ok"* ]] && ((PASSED++)) || ((FAILED++))
[ "$LANDING_STATUS" = "200" ] && ((PASSED++)) || ((FAILED++))
[ "$ADMIN_STATUS" = "200" ] && ((PASSED++)) || ((FAILED++))
[ "$MERCHANT_STATUS" = "200" ] && ((PASSED++)) || ((FAILED++))
[ "$CUSTOMER_STATUS" = "200" ] && ((PASSED++)) || ((FAILED++))
[ "$POS_STATUS" = "200" ] && ((PASSED++)) || ((FAILED++))

echo "✅ Tests Passed: $PASSED/6"
echo "❌ Tests Failed: $FAILED/6"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed! Deployment is successful!"
    echo ""
    echo "🌐 You can access your dashboards at:"
    echo "   • Landing:  $BASE_URL/"
    echo "   • Admin:    $BASE_URL/admin"
    echo "   • Merchant: $BASE_URL/merchant"
    echo "   • Customer: $BASE_URL/customer"
    echo "   • POS:      $BASE_URL/pos"
else
    echo "⚠️  Some tests failed. Please check:"
    echo "   1. Railway deployment status"
    echo "   2. Build logs for errors"
    echo "   3. Ensure PM2 and Express proxy are running"
fi
echo ""
