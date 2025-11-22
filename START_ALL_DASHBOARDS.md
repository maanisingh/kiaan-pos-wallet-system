# 🚀 How to Run All Dashboards

## Quick Start (Run Everything at Once)

```bash
cd /root/kiaan-pos-wallet-system
pnpm dev
```

This will start **all 4 apps simultaneously**:

### Dashboard URLs:

1. **🏠 Landing Page** → http://localhost:3010
   - Main dashboard selector page
   - Links to all other dashboards

2. **🏪 Merchant Dashboard** → http://localhost:3001
   - Business analytics
   - Terminal management
   - Sales tracking

3. **👤 Customer Portal** → http://localhost:3002
   - Wallet management
   - Transaction history
   - Top-up & transfers

4. **💳 POS Terminal** → http://localhost:3003
   - Payment processing interface
   - Touch-optimized for terminals

---

## Alternative: Run Apps Individually

### Landing Page Only:
```bash
cd apps/web
npm run dev
# Access at http://localhost:3010
```

### Merchant Dashboard:
```bash
cd apps/merchant
npm run dev
# Access at http://localhost:3001
```

### Customer Portal:
```bash
cd apps/customer
npm run dev
# Access at http://localhost:3002
```

### POS Terminal:
```bash
cd apps/pos
npm run dev
# Access at http://localhost:3003
```

---

## 🎯 Recommended Flow

1. Start all apps: `pnpm dev`
2. Open browser to: http://localhost:3010
3. Click on any dashboard card to access that portal
4. Each dashboard opens in a new tab/window

---

## 🛠️ Troubleshooting

**Port already in use?**
```bash
# Find and kill process on port 3010
lsof -ti:3010 | xargs kill -9
```

**Dependencies missing?**
```bash
pnpm install
```

**Clear cache and restart:**
```bash
rm -rf node_modules .next
pnpm install
pnpm dev
```

---

## 📱 Mobile Testing

All dashboards are responsive. Test on:
- Desktop browsers (Chrome, Firefox, Safari)
- Tablet view (iPad, Android tablets)
- Mobile view (iPhone, Android phones)

The POS Terminal is optimized for touch input!
