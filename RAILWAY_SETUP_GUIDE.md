# Railway Deployment Guide - Kiaan POS Wallet System

## 🚂 Railway Services Required

You need to create **3 services** in Railway:

### 1. PostgreSQL Database (Managed)
### 2. Backend API Service
### 3. Admin Dashboard Service

---

## 📦 SERVICE 1: PostgreSQL Database

**How to create:**
1. In Railway dashboard → Click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create and provide connection details

**No environment variables needed** - Railway manages this automatically.

**Note the following auto-generated variables:**
- `DATABASE_URL` (you'll use this in the backend service)
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

---

## 🔧 SERVICE 2: Backend API

**How to create:**
1. Click "New" → "GitHub Repo"
2. Connect to: `maanisingh/kiaan-pos-wallet-system`
3. Set Root Directory: `/backend`
4. Set Start Command: `node server.js`

### Environment Variables for Backend:

```bash
# Server Configuration
NODE_ENV=production
PORT=4500

# Database (Link to PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# JWT Authentication
JWT_SECRET=kiaan_pos_production_jwt_secret_change_this_to_random_64_chars
JWT_EXPIRES_IN=7d

# CORS (Use your admin dashboard URL)
CORS_ORIGIN=https://your-admin-dashboard.up.railway.app

# Mobile Money Integration (Optional - Add later)
MTN_API_KEY=your_mtn_api_key_here
MTN_API_SECRET=your_mtn_api_secret_here
MTN_API_URL=https://sandbox.momodeveloper.mtn.com

AIRTEL_API_KEY=your_airtel_api_key_here
AIRTEL_API_SECRET=your_airtel_api_secret_here
AIRTEL_API_URL=https://openapi.airtel.africa

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=10
```

### Backend Build Settings:
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Root Directory:** `/backend`

---

## 🎨 SERVICE 3: Admin Dashboard

**How to create:**
1. Click "New" → "GitHub Repo"
2. Connect to: `maanisingh/kiaan-pos-wallet-system`
3. Set Root Directory: `/admin-dashboard`

### Environment Variables for Admin Dashboard:

```bash
# API Configuration (Use backend URL from Railway)
VITE_API_URL=https://your-backend-api.up.railway.app

# App Configuration
VITE_APP_NAME=Kiaan POS Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_NFC=true
VITE_ENABLE_MOBILE_MONEY=true
VITE_ENABLE_USSD=true
```

### Admin Dashboard Build Settings:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npx vite preview --host 0.0.0.0 --port $PORT`
- **Root Directory:** `/admin-dashboard`

---

## 🗃️ Database Setup (After Services Are Running)

### Step 1: Run Schema Migration

```bash
# Connect to your Railway PostgreSQL via CLI or GUI
# Copy the DATABASE_URL from Railway Postgres service

psql "your_railway_database_url_here"

# Or use Railway CLI:
railway run psql -h $PGHOST -U $PGUSER -d $PGDATABASE
```

### Step 2: Load Schema

```sql
-- Copy and paste from: /database-new/schema.sql
-- Or use the simpler schema: /database-new/schema-simple.sql

-- This will create tables:
-- - customers
-- - nfc_cards
-- - card_transactions
-- - branches
-- - topup_transactions
-- - ussd_sessions
```

### Step 3: Load Seed Data (Optional)

```sql
-- Copy and paste from: /database-new/seed.sql
-- This creates sample customers and NFC cards for testing
```

---

## 🔗 Service Linking

In Railway, you need to **link services together**:

### Link Backend to PostgreSQL:
1. Go to Backend service
2. Click "Variables"
3. Click "Add Reference"
4. Select PostgreSQL service
5. Use the format: `${{Postgres.DATABASE_URL}}`

### Link Admin Dashboard to Backend:
1. Go to Admin Dashboard service
2. Set `VITE_API_URL` to the Backend's public URL
3. Format: `https://kiaan-pos-backend-production.up.railway.app`

---

## 📋 Quick Copy-Paste Variables

### For Backend Service:

```
NODE_ENV=production
PORT=4500
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
JWT_SECRET=your_random_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=10
```

### For Admin Dashboard:

```
VITE_API_URL=https://your-backend-url.up.railway.app
VITE_APP_NAME=Kiaan POS Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_NFC=true
VITE_ENABLE_MOBILE_MONEY=true
VITE_ENABLE_USSD=true
```

---

## 🚀 Deployment Order

1. ✅ **Deploy PostgreSQL** first (Railway managed)
2. ✅ **Deploy Backend** second (wait for it to be healthy)
3. ✅ **Run Database Schema** (via Railway CLI or psql)
4. ✅ **Deploy Admin Dashboard** last (update `VITE_API_URL` with backend URL)

---

## 🧪 Testing After Deployment

### Test Backend API:

```bash
# Health check
curl https://your-backend.up.railway.app/health

# Test branch listing
curl https://your-backend.up.railway.app/api/branches
```

### Test Admin Dashboard:

1. Open: `https://your-admin-dashboard.up.railway.app`
2. You should see the login page
3. Try to login (create a test user first via API)

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a random 64-character string
- [ ] Update `CORS_ORIGIN` to specific domains (not `*`)
- [ ] Set strong PostgreSQL password
- [ ] Enable Railway's private networking
- [ ] Add rate limiting configuration
- [ ] Set up monitoring and alerts

---

## 📱 Optional: Mobile App Deployment

The mobile app (`/mobile-app`) is a React Native Expo app:

**Deployment options:**
1. **Expo Go** (Development): `expo start`
2. **Expo EAS Build** (Production): Build APK/IPA files
3. **App Stores**: Submit to Google Play / Apple App Store

**Mobile App Environment Variables:**
```bash
API_URL=https://your-backend.up.railway.app
```

---

## 🆘 Troubleshooting

### Backend not connecting to database:
- Check `DATABASE_URL` is properly linked
- Verify PostgreSQL service is running
- Check Railway logs: `railway logs --service backend`

### Admin Dashboard showing API errors:
- Ensure `VITE_API_URL` points to correct backend URL
- Check CORS settings in backend
- Verify backend is deployed and healthy

### Database schema not loading:
- Use Railway CLI: `railway run psql`
- Or use Adminer/pgAdmin with connection string
- Make sure to run schema.sql before seed.sql

---

## 📞 Support

- **Railway Docs:** https://docs.railway.app
- **Project Repo:** https://github.com/maanisingh/kiaan-pos-wallet-system
- **Issues:** Create an issue on GitHub

---

## ✅ Success Checklist

- [ ] PostgreSQL service created and running
- [ ] Backend API deployed and healthy
- [ ] Database schema loaded
- [ ] Admin Dashboard deployed
- [ ] Backend API responds to `/health`
- [ ] Admin Dashboard loads in browser
- [ ] APIs are accessible from frontend
- [ ] CORS configured correctly
- [ ] JWT authentication working

**You're ready to go live! 🎉**
