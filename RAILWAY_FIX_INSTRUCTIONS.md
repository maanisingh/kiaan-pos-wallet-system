# Railway Deployment Fix

## Issues Identified

1. **Database connection failing**: App expects individual DB_* env vars but Railway provides DATABASE_URL
2. **Port configuration**: App not using Railway's PORT variable
3. **Container keeps restarting**: DB connection failure causes crash loop

## Solution

### Step 1: Add PostgreSQL Database in Railway

1. Go to your Railway project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create and link the database
4. It will add these environment variables:
   - `DATABASE_URL` (main connection string)
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Step 2: Set Environment Variables

In Railway project settings, add these variables:

```env
# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

# JWT Expiration (optional)
JWT_EXPIRES_IN=7d

# CORS Origin (set to your frontend URL)
CORS_ORIGIN=*

# Node Environment
NODE_ENV=production
```

### Step 3: Initialize Database Schema

After PostgreSQL is added, you need to run the schema:

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run database migration
railway run psql $DATABASE_URL < database-new/schema.sql
```

**Option B: Using Railway Database URL directly**
1. Copy the `DATABASE_URL` from Railway dashboard
2. Run locally:
```bash
psql "YOUR_DATABASE_URL_HERE" < database-new/schema.sql
```

**Option C: Using Supabase (if using Supabase instead)**
1. Create a Supabase project
2. Copy the connection string
3. Add as `DATABASE_URL` in Railway
4. Run schema in Supabase SQL Editor

### Step 4: Deploy

The app will automatically redeploy after adding the database and environment variables.

### Step 5: Verify

Check the logs - you should see:
```
✅ Database connected successfully
🚀 Kiaan POS API Server running on port 8080
```

## Quick Test

Once deployed, test the health endpoint:
```bash
curl https://your-app.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "security": { ... }
}
```

## Environment Variables Summary

**Required:**
- `DATABASE_URL` (auto-created by Railway PostgreSQL)
- `JWT_SECRET` (you must add this)

**Optional:**
- `JWT_EXPIRES_IN` (default: 7d)
- `CORS_ORIGIN` (default: *)
- `NODE_ENV` (default: production)

## Troubleshooting

### "Database connection failed: ECONNREFUSED"
- PostgreSQL database not added to Railway project
- DATABASE_URL not set correctly

### "Invalid or expired token"
- JWT_SECRET not set or different from what was used to create tokens

### Port issues
- The app automatically uses Railway's $PORT variable (fixed in code)
