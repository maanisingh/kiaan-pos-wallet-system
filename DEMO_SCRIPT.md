# Kiaan POS System - Client Demo Script

## 🎯 Demo Overview

This demo showcases a complete NFC-based Point of Sale (POS) system with:
- **Backend API** (Node.js + Express + PostgreSQL)
- **Admin Dashboard** (Refine + React)
- **Mobile App** (React Native + NFC)

---

## 📋 Pre-Demo Setup

### 1. Start Backend API
```bash
cd /root/kiaan-pos-hybrid-stack/backend
PORT=4500 node server.js
```

**Verify backend is running:**
```bash
curl http://localhost:4500/health
# Should return: {"status":"ok","timestamp":"...","database":"connected"}
```

### 2. Start Admin Dashboard
```bash
cd /root/kiaan-pos-hybrid-stack/admin-dashboard
npm run dev
```

**Access at:** http://localhost:5173

### 3. Mobile App (Optional for Full Demo)
```bash
cd /root/kiaan-pos-hybrid-stack/mobile-app
npm start
```

---

## 🎬 Demo Flow (15 minutes)

### Part 1: Backend API (3 minutes)

**Show API Endpoints:**

1. **Health Check**
```bash
curl http://localhost:4500/health
```

2. **Dashboard Statistics**
```bash
curl http://localhost:4500/api/dashboard/stats | jq '.data.statistics'
```

Show:
- Total Customers: 10
- Active Cards: 10
- Today's Transactions: 20
- Today's Revenue: ~75,000 UGX
- Total Card Balance: ~474,000 UGX

3. **Customer List**
```bash
curl http://localhost:4500/api/customers | jq '.data[0]'
```

4. **Customer Drill-Down** (Show the power of nested data)
```bash
# Get first customer ID
CUSTOMER_ID=$(curl -s http://localhost:4500/api/customers | jq -r '.data[0].id')

# Show full customer details with cards, transactions, and statistics
curl http://localhost:4500/api/customers/$CUSTOMER_ID | jq '{
  name: .data.name,
  phone: .data.phone,
  cards: (.data.cards | length),
  recent_transactions: (.data.recent_transactions | length),
  total_spent: .data.statistics.total_spent,
  total_transactions: .data.statistics.total_transactions
}'
```

**Key Points to Highlight:**
- ✅ Single API call returns customer + cards + transactions + statistics
- ✅ This powers the drill-down functionality in the admin dashboard
- ✅ RESTful API design with consistent JSON responses

---

### Part 2: Admin Dashboard (7 minutes)

Open http://localhost:5173 in browser

#### 2.1 Dashboard Overview (1 minute)
- **Show Statistics Cards:**
  - Total Customers (10)
  - Active Cards (10)
  - Today's Transactions (20)
  - Today's Revenue (~75,000 UGX)
  - Total Card Balance (~474,000 UGX)

- **Show 7-Day Revenue Chart:**
  - Line chart showing revenue trend
  - Transaction count overlay

- **Show Recent Transactions Table:**
  - Real-time transaction feed
  - Color-coded by type (topup=green, purchase=blue)

#### 2.2 Customer Management (3 minutes)

**Navigate to: Customers → View List**

1. **Show Customer List:**
   - 10 customers with contact info
   - Status badges (active/inactive)
   - Joined dates

2. **Click "View Details" on any customer:**
   - **Customer Information Card:**
     - Name, phone, email, location
     - Member since date

   - **Statistics Row:**
     - Total Spent
     - Total Top-ups
     - Total Transactions

   - **NFC Cards Table:**
     - Card UID
     - Balance (color-coded: green if high, red if low)
     - Status
     - Last used timestamp

   - **Recent Transactions Table:**
     - Transaction type with color tags
     - Amount
     - Balance before/after
     - Date & time
     - Pagination (10 per page)

**Key Points:**
- ✅ **Complete drill-down**: Click customer → See all cards → See all transactions
- ✅ **Real-time statistics**: Total spent, top-ups calculated on-the-fly
- ✅ **Easy navigation**: Back button returns to customer list

#### 2.3 NFC Card Management (2 minutes)

**Navigate to: NFC Cards → View List**

1. **Show Cards List:**
   - Card UID (unique identifier)
   - Customer name
   - Balance with color coding
   - Status badges
   - Last used dates
   - Sortable by balance

2. **Click "View Details" on a card:**
   - **Card Information:**
     - Full card UID
     - Customer details
     - Current balance (large display)
     - Status (active/blocked)
     - Issued date, last used

   - **Statistics:**
     - Total Spent
     - Total Top-ups
     - Transaction count

   - **Transaction History Table:**
     - Complete transaction log for this card
     - Reference numbers
     - Balance before/after for each transaction
     - Payment methods

**Key Points:**
- ✅ Track individual card usage
- ✅ View complete transaction history per card
- ✅ Monitor card balances in real-time

#### 2.4 Transaction Monitoring (1 minute)

**Navigate to: Transactions**

**Show:**
- Complete transaction list (all cards, all customers)
- **Filters:**
  - Search by card UID or reference number
  - Filter by type (purchase/topup/refund)
  - Date range picker
- **Sortable columns:**
  - Amount
  - Date/time
- **Transaction details:**
  - Reference number
  - Card UID
  - Customer name
  - Type (with color tags)
  - Amount
  - Balance before/after
  - Payment method
  - Status

---

### Part 3: Mobile App Demo (5 minutes)

**Note:** This requires a physical device with NFC capability or Android emulator with NFC simulation.

#### 3.1 Home Screen
- Clean interface with "Scan NFC Card" button
- Shows NFC status
- Quick access to transaction history

#### 3.2 NFC Card Scanning (Simulated)
- Tap "Scan NFC Card"
- **In production:** Hold NFC card near device
- **For demo:** Simulate by directly navigating to CardDetails with test data

#### 3.3 Card Details Screen
**Show:**
1. Card information display
2. Current balance (large, prominent)
3. PIN verification input
4. Purchase flow:
   - Enter amount
   - Verify with PIN
   - Complete transaction
   - See updated balance
5. Top-up button
6. Transaction history link

#### 3.4 Top-Up Screen
**Show:**
- Current balance
- Quick amount buttons (5K, 10K, 20K, 50K, 100K)
- Custom amount input
- Payment method selection:
  - Mobile Money (MTN, Airtel)
  - Cash
  - Bank Transfer
- Top-up confirmation

#### 3.5 Transaction History
**Show:**
- Filterable transaction list
- Pull-to-refresh functionality
- Color-coded by type
- Balance tracking after each transaction
- Empty state if no transactions

---

## 💪 Key Strengths to Highlight

### 1. **Complete Drill-Down Functionality** ✅
- Customer → Cards → Transactions
- Card → Transactions → Details
- Every level shows relevant statistics

### 2. **Real-Time Data** ✅
- Dashboard updates instantly
- Transaction history in real-time
- Balance calculations on-the-fly

### 3. **Professional UI/UX** ✅
- Clean, modern design (Ant Design)
- Color-coded statuses
- Intuitive navigation
- Responsive layout

### 4. **Mobile-Ready** ✅
- Native mobile app with NFC support
- Works offline (cached data)
- Fast and responsive
- Android & iOS compatible

### 5. **Enterprise Features** ✅
- Multi-branch support (built-in)
- Audit logging (ready)
- Role-based access (extensible)
- Scalable architecture

### 6. **Developer-Friendly** ✅
- RESTful API design
- Comprehensive error handling
- PostgreSQL with proper indexing
- TypeScript for type safety

---

## 📊 Demo Data Summary

**Customers:** 10 customers
- All from Kampala, Uganda
- Active status
- With email and phone

**NFC Cards:** 10 cards
- Balances: 10,000 to 100,000 UGX
- All active
- Default PIN: 1234 (hashed with bcrypt)

**Transactions:** 20 sample transactions
- Mix of purchases and top-ups
- Various amounts (1,000 - 5,000 UGX)
- Today's date
- All completed status

**Branch:** 1 main branch in Kampala

---

## 🚀 Next Steps / Roadmap

### Phase 2 (Immediate):
1. ✅ Multi-currency support
2. ✅ Receipt generation (PDF)
3. ✅ SMS notifications
4. ✅ Email alerts
5. ✅ Backup & restore

### Phase 3 (Near-term):
1. ✅ Integration with ERPNext
2. ✅ Integration with Hyperswitch payments
3. ✅ Advanced analytics & reporting
4. ✅ Inventory management
5. ✅ Loyalty programs

### Phase 4 (Future):
1. ✅ AI-powered fraud detection
2. ✅ Predictive analytics
3. ✅ Multi-tenant SaaS
4. ✅ White-label solution
5. ✅ International expansion

---

## 🎯 Closing Points

**What Makes This Special:**

1. **Built in Hours, Not Weeks**
   - Leveraged modern frameworks (Refine, Expo)
   - Used best-in-class libraries
   - Production-ready architecture

2. **Scalable from Day 1**
   - PostgreSQL can handle millions of transactions
   - Node.js backend is horizontally scalable
   - Mobile app works offline

3. **Cost-Effective**
   - Self-hosted (no monthly SaaS fees)
   - Open-source stack
   - Minimal infrastructure requirements

4. **Customizable**
   - Full source code access
   - Modular architecture
   - Easy to extend

5. **Future-Proof**
   - Modern tech stack
   - Active community support
   - Regular updates

---

## 📞 Support & Contact

**Project Location:** `/root/kiaan-pos-hybrid-stack/`

**Components:**
- Backend API: `backend/`
- Admin Dashboard: `admin-dashboard/`
- Mobile App: `mobile-app/`
- Database: PostgreSQL (port 5433)

**Running Services:**
- Backend API: http://localhost:4500
- Admin Dashboard: http://localhost:5173

**Documentation:**
- API Docs: http://localhost:4500/
- This Demo Script: `DEMO_SCRIPT.md`
- README: `README.md`

---

**End of Demo Script**
