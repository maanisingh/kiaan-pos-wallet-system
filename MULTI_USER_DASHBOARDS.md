# Multi-User Dashboard System

## Overview

The Kiaan POS & Wallet system requires **FOUR different dashboards** for different user roles:

---

## 1. ✅ Admin Dashboard (CURRENT - READY)

**URL**: https://pos-production-bae1.up.railway.app

### Who Uses It:
- System administrators
- Branch managers
- Head office staff

### What They Can Do:
- **Customer Management**: View all customers, create accounts, issue cards
- **Card Management**: Issue cards, block/unblock, set limits, view transactions
- **Merchant Management**: Onboard merchants, assign terminals, set commission rates
- **Terminal Management**: Register terminals, monitor status, update software
- **Transaction Monitoring**: View all transactions across the system
- **Reports & Analytics**: Business intelligence, revenue reports, trends
- **Branch Management**: Multi-branch operations, staff assignments
- **Settings**: System configuration, user roles, permissions

### Current Pages (9 main + detail pages):
- ✅ Dashboard (overview)
- ✅ Customers (list + detail pages)
- ✅ Cards (list + detail pages)
- ✅ Transactions (list + detail pages)
- ✅ Merchants (list + detail pages needed)
- ✅ Terminals (list + detail pages needed)
- ✅ Reports
- ✅ Analytics
- ✅ Branches

**Status**: ✅ **READY FOR CLIENT DEMO**

---

## 2. ⏳ Merchant Dashboard (NEEDED)

**Purpose**: Self-service portal for merchant owners

### Who Uses It:
- Restaurant owners
- Retail store managers
- Fuel station operators
- Any business accepting Kiaan cards

### What They Can Do:
- **Today's Sales**: View today's transactions and revenue
- **Transaction History**: Filter by date, amount, card
- **Terminal Management**: View their assigned terminals, check status
- **Settlement Reports**: See daily/weekly/monthly settlements
- **Customer Insights**: Anonymous analytics (no PII)
- **Dispute Management**: Raise chargebacks, report issues
- **Commission View**: See their commission structure
- **Profile Settings**: Update business info, contact details

### Pages Needed:
- Dashboard (today's sales, revenue, transaction count)
- Transactions (filtered to their merchant only)
- Terminals (their terminals only)
- Settlements (payment history)
- Reports (merchant-specific analytics)
- Disputes
- Settings

**Estimated Time**: 1-2 weeks after admin approval

---

## 3. ⏳ Customer Mobile App (NEEDED)

**Purpose**: Personal wallet for cardholders

### Who Uses It:
- All customers with Kiaan cards
- Individuals using the card system

### What They Can Do:
- **Check Balance**: Real-time card balance
- **View Transactions**: Their purchase history
- **Top-Up Wallet**: Add money via MTN/Airtel Mobile Money
- **USSD Top-Up**: Use *123# for quick top-ups
- **Request Card**: Apply for new/replacement cards
- **Report Lost/Stolen**: Block card immediately
- **Set PIN**: Change card PIN
- **Transaction Alerts**: Push notifications
- **Spending Analytics**: Personal spending insights
- **Find Merchants**: Locate nearby accepting merchants

### Features:
- **Platform**: Android (React Native)
- **Offline Mode**: View cached balance and transactions
- **Biometric Auth**: Fingerprint/face unlock
- **QR Code**: Personal QR for quick top-ups
- **Multi-Card**: Manage multiple cards
- **Language**: English + Local languages

**Estimated Time**: 2-3 weeks after admin approval

---

## 4. ⏳ POS Terminal App (NEEDED)

**Purpose**: Point-of-sale interface for cashiers

### Who Uses It:
- Cashiers at merchant locations
- Store staff processing payments

### What They Can Do:
- **Scan NFC Card**: Read card UID from NFC chip
- **Enter Amount**: Input purchase amount
- **Verify PIN**: Customer enters 4-digit PIN
- **Process Payment**: Authorize and complete transaction
- **Print Receipt**: Thermal printer output
- **Daily Reconciliation**: End-of-day settlement
- **Offline Mode**: Queue transactions when internet down
- **Refunds**: Process purchase refunds
- **View History**: Today's transactions
- **Help/Support**: Contact support, report issues

### Features:
- **Platform**: Android (React Native) + Hardware integration
- **NFC Reading**: Read Mifare/NTAG cards
- **Receipt Printing**: Bluetooth/USB thermal printers
- **Offline Capability**: Store & forward when offline
- **Security**: Encrypted PIN entry, secure storage
- **Multi-Cashier**: Login/logout, shift tracking

**Estimated Time**: 2-3 weeks after admin approval

---

## Priority Order for Development

### ✅ Phase 1: Admin Dashboard (CURRENT)
**Status**: Complete, ready for demo
**Why First**: Central control point, needed to issue cards and manage system

### 🔄 Phase 2: Customer Mobile App (NEXT)
**Why Second**: Customers need to check balances and top up before they can use the system
**Timeline**: Start after admin approval (2-3 weeks)

### 🔄 Phase 3: POS Terminal App (PARALLEL)
**Why Third**: Merchants need this to accept payments
**Timeline**: Can start in parallel with mobile app (2-3 weeks)

### 🔄 Phase 4: Merchant Dashboard (LATER)
**Why Last**: Nice-to-have for self-service, but admins can handle merchant support initially
**Timeline**: 1-2 weeks after terminal app is done

---

## Technical Stack by Dashboard

### Admin Dashboard ✅
- **Frontend**: Next.js 15 (React 19) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Railway
- **Backend**: Hasura GraphQL (pending connection)

### Merchant Dashboard ⏳
- **Frontend**: Next.js 15 (React 19) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Separate merchant login
- **Deployment**: Railway (same monorepo)

### Customer Mobile App ⏳
- **Framework**: React Native (Expo)
- **State**: Redux Toolkit
- **Backend**: Same Hasura GraphQL
- **Platform**: Android (iOS optional later)

### POS Terminal App ⏳
- **Framework**: React Native
- **Hardware**: NFC reader, thermal printer
- **Offline**: SQLite local database
- **Backend**: Same Hasura GraphQL + sync

---

## User Authentication & Permissions

### Admin Dashboard
- **Roles**: Super Admin, Branch Manager, Staff
- **Permissions**: Full CRUD vs. Read-only vs. Branch-specific
- **Login**: Email + Password + 2FA (optional)

### Merchant Dashboard
- **Roles**: Owner, Manager, Staff
- **Permissions**: View transactions, manage terminals, view reports
- **Login**: Email + Password (merchant credentials)

### Customer Mobile App
- **Auth**: Phone number + OTP, or Email + Password
- **Security**: Biometric unlock, PIN for transactions
- **Multi-device**: Can log in on multiple phones

### POS Terminal App
- **Auth**: Terminal ID + Cashier PIN
- **Shifts**: Clock in/out tracking
- **Offline**: Cached authentication

---

## Data Isolation by Dashboard

### Admin Dashboard
- **Access**: ALL customers, ALL cards, ALL transactions, ALL merchants
- **Filtering**: Can filter by branch, merchant, date, etc.
- **Exports**: Full data exports

### Merchant Dashboard
- **Access**: ONLY their merchant's transactions and terminals
- **Isolation**: Cannot see other merchants' data
- **Exports**: Their data only

### Customer Mobile App
- **Access**: ONLY their own cards and transactions
- **Isolation**: Cannot see other customers
- **Privacy**: No access to merchant details beyond name

### POS Terminal App
- **Access**: ONLY transactions from that terminal
- **Isolation**: Terminal-specific data
- **Sync**: Uploads to central database

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Hasura GraphQL Engine           │
│      (Central Database & API)           │
└────────────┬────────────────────────────┘
             │
    ┌────────┴─────────┬──────────┬───────────┐
    │                  │          │           │
┌───▼───┐       ┌─────▼────┐  ┌──▼──┐   ┌───▼────┐
│ Admin │       │ Merchant │  │ Cust│   │  POS   │
│  Web  │       │   Web    │  │ App │   │  App   │
└───────┘       └──────────┘  └─────┘   └────────┘
Railway         Railway       Play Store Play Store
```

---

## Minimum Viable Product (MVP)

### For Initial Launch:
1. ✅ **Admin Dashboard** - Issue cards, manage system
2. ✅ **Customer Mobile App** - Check balance, top up
3. ✅ **POS Terminal App** - Accept payments

### Can Wait for v2:
- ⏳ **Merchant Dashboard** - Handle via admin initially
- ⏳ **Advanced Analytics** - Basic reports first
- ⏳ **Mobile Money Auto Top-up** - Manual first
- ⏳ **Multi-language** - English first

---

## Timeline Summary

**Total Time from Admin Approval to Full Launch**: 5-7 weeks

- **Week 1-2**: Customer Mobile App development
- **Week 2-3**: POS Terminal App development (parallel)
- **Week 4**: Integration testing, bug fixes
- **Week 5**: Merchant Dashboard development
- **Week 6**: End-to-end testing with real hardware
- **Week 7**: Soft launch with pilot customers

**Phased Rollout Recommended**:
1. Pilot with 1-2 merchants, 20 customers, 3 terminals (Week 1-2)
2. Expand to 5 merchants, 100 customers (Week 3-4)
3. Full launch (Week 5+)

---

## Question for Client

**For the demo, we're showing the Admin Dashboard only. Do you want to see mockups of the other dashboards (Merchant, Customer, POS) as well, or should we focus on perfecting the Admin Dashboard first and get approval before moving to the others?**

Recommend: **Get Admin Dashboard approved first**, then build others. This saves time if design changes are needed.

---

**Current Status**:
- ✅ Admin Dashboard ready for demo
- ⏳ Merchant Dashboard design needed
- ⏳ Customer App design needed
- ⏳ POS App design needed

**Next Step**: Client reviews and approves Admin Dashboard design, then we proceed with other interfaces.
