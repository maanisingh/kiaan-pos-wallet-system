# Railway Environment Variables Setup Guide

## 🚨 CRITICAL: Set These Variables Before Deployment Works

The admin dashboard is now connected to Hasura GraphQL, but it **REQUIRES** these environment variables to be set in Railway.

## 📋 Required Environment Variables

Go to Railway Dashboard → Your Project → Variables tab → Add these:

### 1. Hasura GraphQL Configuration

```bash
# Your Hasura GraphQL endpoint
NEXT_PUBLIC_HASURA_URL=https://your-hasura-instance.hasura.app/v1/graphql

# Your Hasura admin secret (set when you created Hasura)
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secure_admin_secret_here
```

### 2. Database Configuration (Optional)

Only needed if you're running background jobs or server-side operations:

```bash
DATABASE_URL=postgres://user:password@host:port/kiaan_pos_wallet
```

### 3. JWT Configuration

Must match your Hasura JWT configuration:

```bash
JWT_SECRET=your_jwt_secret_minimum_32_characters_for_hs256_algorithm
```

### 4. Application URL

Railway provides this automatically, but you can set it:

```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app
```

## ⚙️ How to Set Up Hasura

### Option A: Hasura Cloud (Recommended - FREE Tier)

1. **Sign up**: https://hasura.io/cloud
2. **Create Project**:
   - Click "Create Project"
   - Choose region (closest to your users)
   - Wait for project to be created
3. **Get your credentials**:
   - GraphQL URL: Copy from project dashboard (looks like: `https://xxx.hasura.app/v1/graphql`)
   - Admin Secret: Set in "Env vars" tab (create a strong password)
4. **Connect Database**:
   - Go to "Data" tab
   - Click "Connect Database"
   - Enter your Postgres connection string
   - Or use Hasura's free database (limited)

### Option B: Deploy Hasura on Railway

1. **Create New Service**:
   - Railway Dashboard → New → Database → PostgreSQL
   - Note the `DATABASE_URL` from Variables tab
2. **Deploy Hasura**:
   - New → Empty Service
   - Settings → Deploy from Docker Image
   - Image: `hasura/graphql-engine:v2.40.0`
3. **Set Hasura Environment Variables**:
   ```bash
   HASURA_GRAPHQL_DATABASE_URL=${{Postgres.DATABASE_URL}}
   HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret_here
   HASURA_GRAPHQL_ENABLE_CONSOLE=true
   HASURA_GRAPHQL_DEV_MODE=true
   HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup,http-log,webhook-log,websocket-log,query-log
   ```
4. **Expose Port**: 8080 (Hasura's default port)

## 📊 Initialize Database Schema

Once Hasura is running and connected to Postgres:

### Step 1: Run Migrations

```bash
# Connect to your production Postgres database
psql "your-production-database-url"

# Run schema migrations
\i /path/to/database/migrations/001_initial_schema.sql
\i /path/to/database/migrations/002_seed_data.sql
```

### Step 2: Track Tables in Hasura

```bash
# Option A: Use Hasura Console (Web UI)
# 1. Open: https://your-hasura.hasura.app/console
# 2. Go to "Data" tab
# 3. Click "Track All" for all untracked tables

# Option B: Use CLI script
cd /root/kiaan-pos-wallet-system/database
bash hasura-setup.sh
```

**Note**: Edit `hasura-setup.sh` first and update:
- `HASURA_URL` → Your production Hasura URL
- `HASURA_ADMIN_SECRET` → Your production admin secret

### Step 3: Set Up Relationships

The `hasura-setup.sh` script automatically creates these relationships:

**Customers ↔ Cards**
- `cards` → `customer` (many-to-one)
- `customers` → `cards` (one-to-many)

**Cards ↔ Transactions**
- `transactions` → `card` (many-to-one)
- `cards` → `transactions` (one-to-many)

**Branches ↔ Transactions**
- `transactions` → `branch` (many-to-one)
- `branches` → `transactions` (one-to-many)

**Staff ↔ Transactions**
- `transactions` → `staff` (many-to-one)
- `staff` → `transactions` (one-to-many)

## ✅ Verify Setup

### Test 1: Check Hasura Connection

```bash
curl -X POST https://your-hasura.hasura.app/v1/graphql \
  -H "x-hasura-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ __schema { queryType { name } } }"
  }'
```

Expected: `{"data":{"__schema":{"queryType":{"name":"query_root"}}}}`

### Test 2: Check Customers Table

```bash
curl -X POST https://your-hasura.hasura.app/v1/graphql \
  -H "x-hasura-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ customers { id full_name } }"
  }'
```

Expected: Array of customers (or empty array if no data yet)

### Test 3: Check Railway Deployment

After setting environment variables in Railway:

1. **Redeploy**: Railway should auto-redeploy when env vars change
2. **Check Logs**: Look for "ready" status
3. **Open App**: Visit `https://your-app.railway.app/dashboard/customers`
4. **Expected**:
   - If Hasura has data: See real customer list
   - If Hasura is empty: See "No customers" message
   - If env vars wrong: See error message with troubleshooting

## 🔍 Troubleshooting

### Issue: "Network request failed"

**Cause**: `NEXT_PUBLIC_HASURA_URL` not set or wrong

**Fix**:
1. Check Railway Variables tab
2. Ensure `NEXT_PUBLIC_HASURA_URL` exists
3. Verify URL is accessible: `curl https://your-hasura.hasura.app/healthz`
4. Redeploy after setting variables

### Issue: "x-hasura-admin-secret required"

**Cause**: `NEXT_PUBLIC_HASURA_ADMIN_SECRET` missing or wrong

**Fix**:
1. Check Hasura env vars for admin secret
2. Copy exact secret to Railway variables
3. Ensure no extra spaces or quotes
4. Redeploy

### Issue: "Table 'customers' not found"

**Cause**: Database schema not initialized

**Fix**:
1. Run migrations: `/database/migrations/001_initial_schema.sql`
2. Track tables in Hasura Console
3. Verify in Hasura Console → Data tab

### Issue: Empty data but no errors

**Cause**: Database has no data yet

**Fix**:
1. Run seed data: `/database/migrations/002_seed_data.sql`
2. Or create test customer in Hasura Console
3. Refresh admin dashboard

## 📦 What Happens After Setup

Once environment variables are set:

1. **Customers Page** (`/dashboard/customers`):
   - Fetches real customers from Hasura
   - Shows loading spinner while fetching
   - Displays error if connection fails
   - Shows real-time data with search/filter

2. **Cards Page** (`/dashboard/cards`):
   - Fetches real cards with customer info
   - Shows card balances, status, transactions
   - Filter by status (active, inactive, blocked)
   - Search by card UID or customer name

3. **Other Pages**:
   - Transactions, Dashboard stats - TODO (will connect next)
   - Still using mock data until connected

## 🎯 Next Steps

1. ✅ Set environment variables in Railway (do this NOW)
2. ✅ Deploy Hasura (Hasura Cloud or Railway)
3. ✅ Connect Hasura to Postgres database
4. ✅ Run database migrations
5. ✅ Track tables in Hasura
6. ✅ Test GraphQL queries
7. ✅ Verify admin dashboard shows real data
8. 🔄 Connect remaining pages (transactions, dashboard stats)
9. 🔄 Implement CRUD operations (create, edit, delete)
10. 🔄 Add NFC card features, PIN verification, mobile money integration

---

**Status**: Customers and Cards pages now use real GraphQL data!

**What's Connected**: ✅ Customers, ✅ Cards
**What's Not**: ❌ Transactions, ❌ Dashboard Stats, ❌ Merchants, ❌ Terminals

**Action Required**: Set environment variables in Railway → Redeploy → Test

**Last Updated**: 2025-11-22
