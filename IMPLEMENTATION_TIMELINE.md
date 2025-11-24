# Kiaan POS Hybrid Stack - 6-Hour Implementation Timeline

**Date:** November 23, 2025
**Goal:** Deploy complete POS payment system using Option 3 (Hybrid Stack)

---

## ⏱️ HOUR-BY-HOUR BREAKDOWN

### **HOUR 0-1: Backend Deployment** ✅

**Tasks:**
- [x] Deploy ERPNext via Docker (30 min)
- [x] Deploy Supabase via Docker (20 min)
- [x] Create database schema (10 min)

**Commands:**
```bash
cd /root/kiaan-pos-hybrid-stack/docker
docker-compose up -d
```

**Verification:**
- ERPNext accessible at http://localhost:8000
- Supabase Studio at http://localhost:54323
- Database has customers, nfc_cards, transactions tables

---

### **HOUR 1-2: Database & Initial Configuration**

**Tasks:**
- [ ] Complete ERPNext setup wizard (20 min)
- [ ] Load seed data (10 min)
- [ ] Create ERPNext API keys (10 min)
- [ ] Configure chart of accounts (20 min)

**Commands:**
```bash
# Load seed data
docker-compose exec -T postgres psql -U postgres -d postgres < /root/kiaan-pos-hybrid-stack/database/seed.sql

# Get ERPNext API credentials
# Navigate to http://localhost:8000
# User > API Access > Generate Keys
```

**Verification:**
- 5 sample customers in database
- 5 NFC cards issued
- ERPNext API keys generated

---

### **HOUR 2-3: Admin Dashboard Setup**

**Tasks:**
- [ ] Create Refine app (15 min)
- [ ] Install dependencies (10 min)
- [ ] Configure data providers (15 min)
- [ ] Create basic layout (20 min)

**Commands:**
```bash
cd /root/kiaan-pos-hybrid-stack/admin-dashboard

# Create Refine app
npm create refine-app@latest . -- --preset refine-vite

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start development server
npm run dev
```

**Verification:**
- Dashboard runs at http://localhost:5173
- Can connect to ERPNext API
- Can connect to Supabase

---

### **HOUR 3-4: Admin Dashboard Pages**

**Tasks:**
- [ ] Create Customers page (20 min)
- [ ] Create Cards page (20 min)
- [ ] Create Transactions page (20 min)

**Files to Create:**
```
admin-dashboard/src/pages/
  ├── customers/
  │   ├── list.tsx       # Customer list with search
  │   ├── create.tsx     # Create new customer
  │   └── edit.tsx       # Edit customer
  ├── cards/
  │   ├── list.tsx       # NFC cards list
  │   ├── create.tsx     # Issue new card
  │   └── show.tsx       # Card details
  └── transactions/
      └── list.tsx       # Transaction history
```

**Verification:**
- Can view customers from ERPNext
- Can view NFC cards from Supabase
- Can search and filter data

---

### **HOUR 4-5: Mobile App Setup**

**Tasks:**
- [ ] Create Expo app (15 min)
- [ ] Install NFC manager (10 min)
- [ ] Create login screen (15 min)
- [ ] Create balance screen (20 min)

**Commands:**
```bash
cd /root/kiaan-pos-hybrid-stack/mobile-app

# Create Expo app
npx create-expo-app@latest . --template blank-typescript

# Install dependencies
npm install

# Start development
npm start
```

**Files to Create:**
```
mobile-app/src/
  ├── screens/
  │   ├── LoginScreen.tsx
  │   ├── BalanceScreen.tsx
  │   ├── NFCScanScreen.tsx
  │   └── TransactionHistoryScreen.tsx
  ├── services/
  │   ├── api.ts
  │   └── nfc.ts
  └── App.tsx
```

**Verification:**
- App runs in Expo Go
- Can scan QR code to test
- Basic navigation works

---

### **HOUR 5-6: NFC & Payment Integration**

**Tasks:**
- [ ] Integrate NFC card reading (20 min)
- [ ] Set up Hyperswitch (15 min)
- [ ] Configure mobile money webhooks (15 min)
- [ ] Test card payment flow (10 min)

**Commands:**
```bash
# Start Hyperswitch
cd /root/kiaan-pos-hybrid-stack/docker
docker-compose up -d hyperswitch

# Test NFC reading (Android device required)
# Physical NFC card needed
```

**Mobile App Code - NFC Reading:**
```tsx
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

async function readNFCCard() {
  await NfcManager.requestTechnology(NfcTech.IsoDep);
  const tag = await NfcManager.getTag();
  const cardUID = tag.id; // Send to API
}
```

**Verification:**
- Can read NFC card UID
- Hyperswitch is running
- API can process payments

---

### **HOUR 6: Testing & Documentation**

**Tasks:**
- [ ] Run complete flow test (15 min)
- [ ] Document API endpoints (15 min)
- [ ] Create user guide (15 min)
- [ ] Prepare deployment checklist (15 min)

**Commands:**
```bash
cd /root/kiaan-pos-hybrid-stack/scripts
./test_complete_flow.sh
```

**Test Scenarios:**
1. ✅ Create customer in admin → Syncs to ERPNext
2. ✅ Issue NFC card → Saved in Supabase
3. ✅ Top-up via mobile money → Balance increases
4. ✅ Make purchase → Balance decreases
5. ✅ View transaction history → Shows all transactions

**Verification:**
- All tests pass
- Documentation complete
- Ready for production deployment

---

## 🚀 PRODUCTION DEPLOYMENT (After 6 Hours)

### Option A: Deploy to Railway

```bash
# Deploy ERPNext
cd /root/kiaan-pos-hybrid-stack
railway up

# Deploy Admin Dashboard
cd admin-dashboard
vercel --prod

# Build Mobile App
cd mobile-app
eas build --platform android
```

### Option B: Deploy to Your Own Server

```bash
# Use Docker Compose on production server
scp -r /root/kiaan-pos-hybrid-stack user@your-server:/opt/
ssh user@your-server
cd /opt/kiaan-pos-hybrid-stack
docker-compose up -d
```

---

## 📊 PROGRESS TRACKER

| Hour | Task | Status | Estimated Time |
|------|------|--------|----------------|
| 0-1 | Backend Deployment | ⏳ Pending | 60 min |
| 1-2 | Database Setup | ⏳ Pending | 60 min |
| 2-3 | Admin Dashboard Setup | ⏳ Pending | 60 min |
| 3-4 | Admin Pages | ⏳ Pending | 60 min |
| 4-5 | Mobile App | ⏳ Pending | 60 min |
| 5-6 | NFC & Payments | ⏳ Pending | 60 min |
| 6 | Testing | ⏳ Pending | 60 min |

**Total:** 6 hours (420 minutes)

---

## 🎯 SUCCESS CRITERIA

After 6 hours, you should have:

- ✅ ERPNext backend running
- ✅ Supabase database with sample data
- ✅ Admin dashboard showing customers, cards, transactions
- ✅ Mobile app reading NFC cards
- ✅ Hyperswitch payment gateway configured
- ✅ Complete payment flow tested
- ✅ All code documented
- ✅ Ready for production deployment

---

## 🆘 QUICK HELP

**If ERPNext doesn't start:**
```bash
docker-compose logs erpnext
docker-compose restart erpnext
```

**If Supabase fails:**
```bash
docker-compose logs postgres
docker-compose down
docker-compose up -d
```

**If Admin dashboard won't build:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**If NFC doesn't work:**
- Ensure physical Android device (not emulator)
- Enable NFC in phone settings
- Check AndroidManifest.xml has NFC permissions

---

**Ready to start?** Run:
```bash
cd /root/kiaan-pos-hybrid-stack/scripts
./deploy_all.sh
```

This will walk you through each step! 🚀
