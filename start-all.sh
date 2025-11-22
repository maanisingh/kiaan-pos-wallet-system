#!/bin/bash

echo "🚀 Starting Kiaan POS & Wallet System"
echo "======================================"
echo ""
echo "Starting all dashboards..."
echo ""
echo "📍 Access URLs:"
echo "  🏠 Landing Page:        http://localhost:3010"
echo "  🏪 Merchant Dashboard:  http://localhost:3001"
echo "  👤 Customer Portal:     http://localhost:3002"
echo "  💳 POS Terminal:        http://localhost:3003"
echo ""
echo "Press Ctrl+C to stop all apps"
echo ""

cd /root/kiaan-pos-wallet-system
pnpm dev
