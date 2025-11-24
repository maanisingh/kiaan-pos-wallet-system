# 🚀 Railway Deployment - Quick Start Guide

## What Was Fixed

✅ **Database Connection**: Now supports both `DATABASE_URL` (Railway) and individual `DB_*` variables (local)
✅ **Port Configuration**: Uses Railway's `$PORT` environment variable
✅ **Startup Process**: Simplified - no PM2 complexity in production
✅ **Health Check**: Added health check endpoint for Railway monitoring

---

## 📋 Prerequisites

- Railway account ([railway.app](https://railway.app))
- GitHub repository (this project should be pushed to GitHub)
- Basic knowledge of Railway dashboard

---

## 🎯 Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
cd /root/kiaan-pos-wallet-system

# Initialize git if not already done
git init
git add .
git commit -m "feat: Railway deployment ready with DB connection fix"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/kiaan-pos-wallet.git
git branch -M main
git push -u origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `kiaan-pos-wallet` repository
5. Railway will start deploying automatically

### 3. Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates these environment variables:
   - `DATABASE_URL`
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### 4. Set Required Environment Variables

In your Railway project **Variables** section, add:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
NODE_ENV=production
```

**Important**: Replace `your-super-secret-jwt-key...` with a strong random string.

### 5. Initialize Database Schema

**Option A: Using Railway Dashboard**
1. Click on the PostgreSQL service
2. Go to **"Data"** tab
3. Click **"Query"**
4. Copy and paste the contents of `database-new/schema.sql`
5. Click **"Run Query"**

**Option B: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Run schema
railway run psql $DATABASE_URL < database-new/schema.sql

# (Optional) Seed sample data
railway run psql $DATABASE_URL < database-new/seed.sql
```

**Option C: Using Connection String**
```bash
# Copy DATABASE_URL from Railway dashboard, then:
psql "postgresql://user:pass@host:port/dbname" < database-new/schema.sql
```

### 6. Deploy

Railway will automatically redeploy when you:
- Push to GitHub
- Change environment variables
- Manually trigger deployment

To trigger manual deployment:
1. Go to your service in Railway
2. Click **"Deploy"** → **"Redeploy"**

---

## ✅ Verify Deployment

### Check Logs

In Railway dashboard:
1. Click on your service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. Check logs for:
```
📊 Using DATABASE_URL for connection
✅ Database connected successfully
🚀 Kiaan POS API Server running on port 8080
✅ Ready to accept requests!
```

### Test API Endpoints

Get your Railway URL from the dashboard (e.g., `https://kiaan-pos-production.up.railway.app`)

```bash
# Health check
curl https://your-app.railway.app/health

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-11-24T...",
  "security": { ... }
}

# Register a test user
curl -X POST https://your-app.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "admin"
  }'

# Login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 🔧 Troubleshooting

### "Database connection failed: ECONNREFUSED"

**Cause**: PostgreSQL not added or DATABASE_URL not set
**Fix**:
1. Verify PostgreSQL service is added
2. Check `DATABASE_URL` exists in Variables
3. Restart deployment

### "Container keeps restarting"

**Cause**: Database schema not initialized
**Fix**:
1. Run the schema SQL (see Step 5)
2. Check logs for specific errors

### "Invalid or expired token"

**Cause**: JWT_SECRET not set or changed
**Fix**:
1. Add `JWT_SECRET` to environment variables
2. Re-login to get new token

### Port issues

**Fixed**: App now uses Railway's $PORT automatically. No action needed.

---

## 📊 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | Auto-created by Railway PostgreSQL |
| `JWT_SECRET` | ✅ Yes | - | Secret key for JWT tokens (must be strong) |
| `JWT_EXPIRES_IN` | No | 7d | JWT token expiration time |
| `CORS_ORIGIN` | No | * | Allowed CORS origins (use your frontend URL) |
| `NODE_ENV` | No | production | Node environment |
| `PORT` | No | 8080 | Auto-set by Railway |

---

## 🎉 Next Steps

After successful deployment:

1. **Secure JWT_SECRET**: Use a strong random value
2. **Configure CORS**: Set `CORS_ORIGIN` to your frontend URL
3. **Set up Custom Domain**: In Railway dashboard → Settings → Domains
4. **Enable Database Backups**: PostgreSQL service → Settings → Backups
5. **Monitor Logs**: Set up log monitoring
6. **Load Test**: Test with expected traffic
7. **Set up CI/CD**: Automatic deployments from GitHub

---

## 📞 Support

- **Logs**: Railway Dashboard → Deployments → Latest → View Logs
- **Database Query**: Railway Dashboard → PostgreSQL → Data → Query
- **Metrics**: Railway Dashboard → Service → Metrics

---

## 🔄 Local Development

The fixes are backward compatible with local development:

```bash
# 1. Set up local PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=kiaan_pos \
  postgres:15

# 2. Run schema
psql -h localhost -U postgres -d kiaan_pos < database-new/schema.sql

# 3. Copy and configure .env
cp backend/.env.example backend/.env
# Edit backend/.env with your local DB credentials

# 4. Start development server
cd backend
npm install
npm run dev
```

---

## 📝 Changes Made

1. **`backend/server.js`**:
   - Added DATABASE_URL support
   - Auto-detection of connection method
   - SSL configuration for production
   - Better error logging

2. **`start-railway.js`**:
   - New simplified startup script
   - No PM2 in production
   - Graceful shutdown handling

3. **`package.json`**:
   - Updated start command
   - Added `start:pm2` for local multi-service dev

4. **`railway.json`**:
   - Simplified build command
   - Added health check
   - Direct Node.js startup

---

## ✨ Features Preserved

All original features work as expected:
- ✅ JWT Authentication
- ✅ NFC Card Management
- ✅ Customer Management
- ✅ Transaction Processing
- ✅ Mobile Money Integration
- ✅ USSD Interface
- ✅ Analytics Dashboard
- ✅ Security (Rate limiting, XSS protection, SQL injection protection)

---

**Railway Deployment Status**: ✅ READY

Last updated: 2025-11-24
