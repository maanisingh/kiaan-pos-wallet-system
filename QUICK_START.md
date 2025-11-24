# Kiaan POS - Hybrid Stack Quick Start Guide
## Option 3: ERPNext + Supabase + Refine + React Native

**Created:** November 23, 2025
**Deployment Time:** 6 hours
**Status:** Ready to Deploy

---

## 📋 PREREQUISITES

Before starting, ensure you have:

```bash
# Required software
- Docker & Docker Compose (latest)
- Node.js 18+ and npm
- Git
- PostgreSQL client (psql)

# Optional but recommended
- Railway CLI (for hosting)
- Vercel CLI (for frontend hosting)
- Expo CLI (for mobile app)
```

---

## ⚡ DEPLOYMENT STEPS

### STEP 1: Backend Setup (Hour 0-2)

#### 1.1 Deploy ERPNext (30 minutes)

```bash
cd /root/kiaan-pos-hybrid-stack/docker

# Start ERPNext
docker-compose up -d erpnext

# Wait for initialization (5-10 minutes)
docker-compose logs -f erpnext

# Access at: http://localhost:8000
# Default credentials: Administrator / admin
```

#### 1.2 Deploy Supabase (Self-Hosted) (20 minutes)

```bash
# Complete self-hosted Supabase stack (9 services)
cd /root/kiaan-pos-hybrid-stack/docker
docker-compose up -d postgres studio kong rest auth realtime storage imgproxy meta analytics

# Wait for all services to initialize
sleep 60

# Verify services are running
docker-compose ps | grep -E "(postgres|studio|kong|rest|auth)"

# Access Supabase Studio at: http://localhost:54323
# Access Kong API Gateway at: http://localhost:8001
# PostgreSQL: localhost:54322
```

#### 1.3 Set Up Database Schema (30 minutes)

```bash
# The schema is automatically loaded via docker-compose volumes
# But you can also load it manually:

cd /root/kiaan-pos-hybrid-stack

# Load schema using Docker exec
docker-compose -f docker/docker-compose.yml exec -T postgres \
  psql -U postgres -d postgres < database/schema.sql

# Load seed data
docker-compose -f docker/docker-compose.yml exec -T postgres \
  psql -U postgres -d postgres < database/seed.sql

# Verify tables created
docker-compose -f docker/docker-compose.yml exec postgres \
  psql -U postgres -d postgres -c "\dt"
```

#### 1.4 Configure ERPNext (40 minutes)

```bash
# Access ERPNext: http://localhost:8000
# Login: Administrator / admin

# Setup wizard:
1. Select country
2. Set company name
3. Enable POS module
4. Create first user
5. Configure chart of accounts
```

---

### STEP 2: Admin Dashboard (Hour 2-4)

#### 2.1 Create Refine App (15 minutes)

```bash
cd /root/kiaan-pos-hybrid-stack/admin-dashboard

# Create Refine app
npm create refine-app@latest . -- \
  --preset refine-vite \
  --package-manager npm

# Install dependencies
npm install
```

#### 2.2 Configure Data Providers (30 minutes)

```bash
# Install providers
npm install @refinedev/simple-rest @refinedev/supabase

# Configuration already in src/App.tsx
```

#### 2.3 Build Admin Pages (90 minutes)

All pages are pre-generated in:
- `/admin-dashboard/src/pages/customers/`
- `/admin-dashboard/src/pages/cards/`
- `/admin-dashboard/src/pages/transactions/`
- `/admin-dashboard/src/pages/reports/`

```bash
# Start development server
npm run dev

# Access at: http://localhost:5173
```

---

### STEP 3: Mobile App (Hour 4-6)

#### 3.1 Create React Native App (15 minutes)

```bash
cd /root/kiaan-pos-hybrid-stack/mobile-app

# Create Expo app
npx create-expo-app@latest . --template blank-typescript

# Install dependencies
npm install
```

#### 3.2 Install NFC & UI Libraries (15 minutes)

```bash
# Install NFC manager
npm install react-native-nfc-manager

# Install UI library
npm install native-base react-native-svg

# Install navigation
npm install @react-navigation/native @react-navigation/stack
```

#### 3.3 Build App Screens (90 minutes)

Pre-built screens available:
- Login screen
- Balance display
- NFC card scanning
- Transaction history
- Top-up via mobile money

```bash
# Start development
npm start

# Scan QR code with Expo Go app
```

---

### STEP 4: Payment Integration (Hour 6-7)

#### 4.1 Deploy Hyperswitch (30 minutes)

```bash
cd /root/kiaan-pos-hybrid-stack/docker
docker-compose up -d hyperswitch

# Access at: http://localhost:9000
```

#### 4.2 Configure Mobile Money (30 minutes)

```bash
# Edit environment variables
nano /root/kiaan-pos-hybrid-stack/backend/.env

# Add:
MTN_API_KEY=your_mtn_key
AIRTEL_API_KEY=your_airtel_key
HYPERSWITCH_API_KEY=your_hyperswitch_key
```

---

### STEP 5: Testing (Hour 7-8)

#### 5.1 Test Complete Flow

```bash
# Run test script
cd /root/kiaan-pos-hybrid-stack/scripts
./test_complete_flow.sh
```

**Test scenarios:**
1. ✅ Create customer in admin → Appears in ERPNext
2. ✅ Issue NFC card → Card UID saved in Supabase
3. ✅ Top-up via mobile money → Balance updates
4. ✅ Make payment → Transaction recorded
5. ✅ Check balance on mobile app → Shows correct amount
6. ✅ Generate report → Financial data accurate

---

## 🌐 PRODUCTION DEPLOYMENT

### Deploy Backend (Railway or VPS)

```bash
# Option A: Deploy entire stack to VPS/Server
scp -r /root/kiaan-pos-hybrid-stack user@your-server:/opt/
ssh user@your-server
cd /opt/kiaan-pos-hybrid-stack/docker
docker-compose up -d

# Option B: Deploy individual services to Railway
cd /root/kiaan-pos-hybrid-stack/docker

# Deploy ERPNext + Supabase (self-hosted) + Hyperswitch together
railway up

# Note: Self-hosted Supabase requires all 9 services running
# Consider using a dedicated server for better control
```

### Deploy Admin Dashboard (Vercel)

```bash
cd /root/kiaan-pos-hybrid-stack/admin-dashboard

# Deploy to Vercel
vercel --prod

# Or Railway
railway up
```

### Deploy Mobile App (Expo)

```bash
cd /root/kiaan-pos-hybrid-stack/mobile-app

# Build for production
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

---

## 📊 ENVIRONMENT VARIABLES

### Backend (.env)

```bash
# ERPNext
ERPNEXT_URL=http://localhost:8000  # or https://your-domain.com:8000 in production
ERPNEXT_API_KEY=your_api_key
ERPNEXT_API_SECRET=your_api_secret

# Supabase (Self-Hosted)
SUPABASE_URL=http://localhost:8001  # Kong API Gateway
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
POSTGRES_PASSWORD=your_super_secret_password_change_this

# Hyperswitch (Self-Hosted)
HYPERSWITCH_URL=http://localhost:8002  # or https://your-domain.com:8002 in production
HYPERSWITCH_API_KEY=your_api_key

# Mobile Money
MTN_API_KEY=your_mtn_key
MTN_API_SECRET=your_mtn_secret
AIRTEL_API_KEY=your_airtel_key
AIRTEL_API_SECRET=your_airtel_secret

# JWT (For ERPNext/Custom Auth)
JWT_SECRET=your_super_secret_key_min_32_chars
```

### Admin Dashboard (.env)

```bash
# Local Development
VITE_ERPNEXT_URL=http://localhost:8000/api
VITE_SUPABASE_URL=http://localhost:8001
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Production
# VITE_ERPNEXT_URL=https://your-domain.com:8000/api
# VITE_SUPABASE_URL=https://api.your-domain.com
```

### Mobile App (.env)

```bash
# Local Development
API_URL=http://localhost:8001
SUPABASE_URL=http://localhost:8001
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Production
# API_URL=https://api.your-domain.com
# SUPABASE_URL=https://api.your-domain.com
```

---

## 🎯 ACCESS POINTS

### Local Development:
- **ERPNext Backend:** http://localhost:8000
- **Supabase Studio:** http://localhost:54323
- **Kong API Gateway:** http://localhost:8001
- **PostgREST API:** http://localhost:3001
- **GoTrue Auth:** http://localhost:9999
- **Hyperswitch:** http://localhost:8002
- **Admin Dashboard:** http://localhost:5173
- **PostgreSQL:** localhost:54322

### Production (after deployment):
- **ERPNext Backend:** https://your-domain.com:8000
- **Admin Dashboard:** https://admin.your-domain.com
- **Supabase API:** https://api.your-domain.com
- **Mobile App:** Download from Play Store

---

## 🆘 TROUBLESHOOTING

### ERPNext not starting?

```bash
# Check logs
docker-compose logs erpnext

# Restart
docker-compose restart erpnext

# Access container
docker-compose exec erpnext bash
```

### Supabase connection issues?

```bash
# Test connection
psql "postgresql://postgres:password@localhost:54322/postgres"

# Check Supabase status
docker-compose ps supabase
```

### Mobile app not detecting NFC?

```bash
# Android - Enable NFC in settings
# Check permissions in AndroidManifest.xml
# Ensure physical device (NFC doesn't work in emulator)
```

---

## 📞 SUPPORT

**Documentation:**
- ERPNext: https://docs.erpnext.com
- Supabase: https://supabase.com/docs
- Refine: https://refine.dev/docs
- React Native: https://reactnative.dev

**Community:**
- ERPNext Forum: https://discuss.frappe.io
- Supabase Discord: https://discord.supabase.com
- Refine Discord: https://discord.gg/refine

---

## ✅ CHECKLIST

Before going live:

- [ ] ERPNext configured with company details
- [ ] Supabase database schema created
- [ ] Admin dashboard connected to both backends
- [ ] Mobile app builds successfully
- [ ] NFC card reading tested
- [ ] Mobile money integration tested
- [ ] Complete payment flow tested
- [ ] SSL certificates configured
- [ ] Backup strategy in place
- [ ] User training completed

---

**Ready to start?** Follow STEP 1 above! 🚀
