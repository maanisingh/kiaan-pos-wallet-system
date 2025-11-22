# Railway Full Stack Deployment Guide

## Current Issue
❌ Admin dashboard loads but shows blank screen
❌ Browser console error: "Failed to fetch from http://localhost:8095"

## Root Cause
Your admin frontend is deployed, but it's trying to connect to:
- Hasura GraphQL API at `localhost:8095` (doesn't exist in production)
- PostgreSQL at `localhost:5440` (doesn't exist in production)

---

## Solution: Deploy Complete Backend

### Option 1: Deploy Everything to Railway (Recommended)

**Add 2 More Services to Your Railway Project:**

#### Service 1: PostgreSQL Database

1. In Railway Dashboard → **New Service**
2. Select **Database** → **PostgreSQL**
3. Railway will provision the database automatically
4. **Note the connection details:**
   - `DATABASE_URL` (automatically created)

#### Service 2: Hasura GraphQL Engine

1. In Railway Dashboard → **New Service**
2. Select **Docker Image**
3. Image: `hasura/graphql-engine:v2.40.0`
4. **Set Environment Variables:**

```env
# Database Connection (use Railway's PostgreSQL)
HASURA_GRAPHQL_DATABASE_URL=${{Postgres.DATABASE_URL}}

# Admin Secret (IMPORTANT: Change this!)
HASURA_GRAPHQL_ADMIN_SECRET=your-secure-admin-secret-here

# Enable Console
HASURA_GRAPHQL_ENABLE_CONSOLE=true

# CORS (allow your admin domain)
HASURA_GRAPHQL_CORS_DOMAIN=*

# JWT Secret (for authentication)
HASURA_GRAPHQL_JWT_SECRET={"type":"HS256","key":"your-jwt-secret-key-change-this"}

# Logging
HASURA_GRAPHQL_DEV_MODE=false
HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup,http-log,webhook-log

# Permissions
HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS=true
```

5. **Generate Domain** for Hasura service
6. **Note the URL:** `https://hasura-production-xxxx.up.railway.app`

#### Service 3: Update Admin Frontend Variables

Go to **admin** service → **Variables** and add:

```env
# Hasura GraphQL Endpoint (use Hasura's Railway URL)
NEXT_PUBLIC_HASURA_URL=https://hasura-production-xxxx.up.railway.app/v1/graphql

# Admin Secret (same as Hasura)
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your-secure-admin-secret-here

# Node Environment
NODE_ENV=production
```

---

### Option 2: Use Hasura Cloud (Easier, Recommended for Production)

Hasura Cloud is managed and has a free tier:

1. **Sign up:** https://cloud.hasura.io/signup
2. **Create New Project:**
   - Name: `kiaan-pos-wallet`
   - Region: Select closest to users
   - Plan: Free tier (good for development)

3. **Create Database:**
   - Click **"Launch Console"**
   - Go to **Data** tab → **Connect Database**
   - Select **"Create Heroku Database (Free)"** or use Railway's PostgreSQL

4. **Get Hasura URL:**
   - Format: `https://your-project.hasura.app/v1/graphql`
   - Copy this URL

5. **Get Admin Secret:**
   - Go to **Settings** → **Env vars**
   - Copy `HASURA_GRAPHQL_ADMIN_SECRET`

6. **Update Railway Variables** (in admin service):

```env
NEXT_PUBLIC_HASURA_URL=https://your-project.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your-admin-secret-from-hasura
NODE_ENV=production
```

7. **Apply Database Schema:**

```bash
# Install Hasura CLI
npm install -g hasura-cli

# Go to project root
cd /root/kiaan-pos-wallet-system

# Initialize Hasura
hasura init

# Connect to cloud
hasura metadata apply --endpoint https://your-project.hasura.app \
  --admin-secret your-admin-secret

# Apply migrations
hasura migrate apply --endpoint https://your-project.hasura.app \
  --admin-secret your-admin-secret

# Apply metadata
hasura metadata apply --endpoint https://your-project.hasura.app \
  --admin-secret your-admin-secret
```

---

## Quick Setup Script (Option 2)

I can create an automated setup for Hasura Cloud. Would you like me to:

1. ✅ Set up Hasura Cloud account
2. ✅ Apply database schema automatically
3. ✅ Configure Railway environment variables
4. ✅ Test the connection

---

## Verification Steps

After setting up backend:

1. **Test Hasura GraphQL:**
```bash
curl -X POST https://YOUR-HASURA-URL/v1/graphql \
  -H "x-hasura-admin-secret: YOUR-SECRET" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

Should return list of GraphQL types.

2. **Test Admin Dashboard:**
   - Open: `https://admin-production-xxxx.up.railway.app`
   - Dashboard should now load with data
   - No console errors

---

## Cost Comparison

### Option 1: All on Railway
- PostgreSQL: $5/month (500MB)
- Hasura Container: $5/month (512MB RAM)
- Admin Frontend: $5/month
- **Total: ~$15/month**

### Option 2: Railway + Hasura Cloud
- Railway Admin: $5/month
- Hasura Cloud Free: $0 (1GB data, 60 API calls/min)
- Upgrade to Pro: $99/month (when needed)
- **Total: $5/month initially**

---

## Which Option Do You Prefer?

**Option 1 (Railway Only):**
- ✅ Everything in one place
- ✅ Full control
- ❌ Need to configure 3 services
- ❌ Manual database management

**Option 2 (Hasura Cloud):**
- ✅ Managed Hasura with auto-scaling
- ✅ Built-in monitoring
- ✅ Free tier available
- ✅ Easier database management
- ❌ One more external service

Let me know which option you prefer, and I'll help you set it up!
