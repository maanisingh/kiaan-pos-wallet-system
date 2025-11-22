# Environment Variables - Kiaan POS Wallet System

## ✅ Stack Configuration

Your system uses:
- **Database**: Self-hosted PostgreSQL 15
- **GraphQL API**: Hasura GraphQL Engine
- **GraphQL Client**: URQL (NOT Supabase)
- **Frontend**: Next.js 15

## Required Environment Variables for Railway

Set these in your Railway project dashboard:

### 1. Hasura Configuration
```bash
NEXT_PUBLIC_HASURA_URL=https://your-hasura-endpoint.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secure_admin_secret_here
```

### 2. Database
```bash
DATABASE_URL=postgres://user:password@host:port/database_name
```

### 3. JWT Authentication
```bash
JWT_SECRET=your_jwt_secret_minimum_32_characters_for_hs256
```

### 4. Application URL
```bash
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

### 5. Port (Automatic - Railway sets this)
```bash
PORT=<automatically-set-by-railway>
```

## Local Development (.env.local)

```bash
NEXT_PUBLIC_HASURA_URL=http://localhost:8095/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=kiaan_admin_secret_2024
DATABASE_URL=postgres://kiaan_user:kiaan_secure_pass_2024@localhost:5440/kiaan_pos_wallet
JWT_SECRET=kiaan_jwt_secret_key_change_this_in_production_2024
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Production Setup

### Step 1: Set Up Hasura

**Option A: Hasura Cloud (Recommended - Free tier available)**
1. Go to https://hasura.io/cloud
2. Create new project
3. Connect to your Railway Postgres
4. Copy the GraphQL endpoint and admin secret

**Option B: Deploy Hasura on Railway**
```bash
# Create new Railway service
# Image: hasura/graphql-engine:v2.40.0
# Set these environment variables in Hasura service:
HASURA_GRAPHQL_DATABASE_URL=<your-railway-postgres-url>
HASURA_GRAPHQL_ADMIN_SECRET=<strong-secret>
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256","key":"<your-jwt-secret>"}'
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
HASURA_GRAPHQL_CORS_DOMAIN=*
```

### Step 2: Set Up Postgres Database

**Option A: Railway Postgres**
```bash
# In Railway dashboard:
# 1. Click "New" → "Database" → "PostgreSQL"
# 2. Copy the DATABASE_URL
```

**Option B: External Postgres (DigitalOcean, AWS RDS, etc.)**
```bash
# Use your existing connection string
DATABASE_URL=postgres://user:pass@host:port/db
```

### Step 3: Initialize Database

Run migrations on your production database:
```bash
psql "your-production-database-url" -f database/migrations/001_initial_schema.sql
psql "your-production-database-url" -f database/migrations/002_seed_data.sql
```

### Step 4: Configure Hasura Metadata

Update `database/hasura-setup.sh` with production URLs and run:
```bash
bash database/hasura-setup.sh
```

## Important Notes

### ❌ NOT Using Supabase
Despite having `@supabase/supabase-js` in package.json, you are **NOT using Supabase**.

Your app uses:
- ✅ **Hasura GraphQL API** (via URQL client)
- ✅ **Self-hosted Postgres**
- ✅ **JWT authentication via Hasura**

The Supabase imports in `packages/database/src/client.ts` and `apps/admin/lib/supabase/` are unused legacy code.

### GraphQL Client Location
Your GraphQL configuration is in:
- `apps/admin/lib/graphql-client.ts` - Hasura client setup
- `apps/admin/lib/graphql-operations.ts` - GraphQL queries
- `apps/admin/lib/providers.tsx` - URQL provider

## Security Checklist

Before deploying to production:

- [ ] Change `HASURA_ADMIN_SECRET` from default
- [ ] Generate strong `JWT_SECRET` (min 32 chars)
- [ ] Use secure database password
- [ ] Ensure JWT secret matches between app and Hasura
- [ ] Configure CORS in Hasura for your domain only
- [ ] Enable SSL for database connections (if external)
- [ ] Set up database backups
- [ ] Review Hasura role permissions

## Quick Reference

| Variable | Purpose | Where to Get It |
|----------|---------|----------------|
| `NEXT_PUBLIC_HASURA_URL` | Hasura GraphQL endpoint | Hasura Cloud dashboard or your Hasura Railway service URL |
| `NEXT_PUBLIC_HASURA_ADMIN_SECRET` | Hasura admin authentication | Set in Hasura configuration |
| `DATABASE_URL` | Postgres connection string | Railway Postgres or your DB provider |
| `JWT_SECRET` | Token signing key | Generate a strong secret (min 32 chars) |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | Railway provides this after deployment |

## Testing the Setup

After deployment, test these endpoints:

```bash
# 1. Check Hasura GraphQL endpoint
curl -X POST https://your-hasura-url/v1/graphql \
  -H "x-hasura-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ customers { id name } }"}'

# 2. Check your Next.js app
curl https://your-app.railway.app

# 3. Check health
curl https://your-app.railway.app/api/health
```

## Support

- Railway: https://docs.railway.app
- Hasura: https://hasura.io/docs
- Next.js: https://nextjs.org/docs
- URQL: https://formidable.com/open-source/urql/docs
