# Railway Deployment Guide - Kiaan POS Wallet System
## Self-Hosted Postgres + Hasura GraphQL

## Problem Fixed ✅

The "Error creating build plan with Railpack" error has been resolved with the following changes:

### Changes Made:

1. **Fixed `pnpm-workspace.yaml`**
   - Removed reference to non-existent `tooling/*` directory
   - Now only references `apps/*` and `packages/*`

2. **Updated `nixpacks.toml`**
   - Simplified nixPkgs to only include `nodejs_22`
   - Added explicit corepack enable and pnpm activation
   - Fixed start command to use Railway's PORT environment variable

3. **Created `.npmrc`**
   - Added pnpm configuration for proper dependency resolution
   - Enabled hoisting for monorepo compatibility

4. **Added `.railwayignore`**
   - Excludes build artifacts and cache from deployment
   - Reduces upload time and deployment size

5. **Created `railway.toml`**
   - Explicit Railway configuration at root level
   - Defines build and deploy settings clearly

6. **Updated Environment Variables**
   - Removed Supabase configuration
   - Added Postgres + Hasura configuration

## Architecture

Your POS Wallet system uses:
- **Database**: Self-hosted PostgreSQL 15
- **GraphQL API**: Hasura GraphQL Engine
- **Frontend**: Next.js 15 Admin Dashboard
- **State Management**: URQL (GraphQL client)
- **Authentication**: JWT tokens via Hasura

## Deployment Steps

### 1. Set Up Production Database

You need a **self-hosted Postgres database** for Railway deployment. Options:

#### Option A: Railway Postgres (Recommended)
```bash
# In Railway dashboard:
# 1. Click "New" → "Database" → "PostgreSQL"
# 2. Copy the DATABASE_URL after it's created
```

#### Option B: External Postgres (DigitalOcean, AWS RDS, etc.)
```bash
# Use your existing production Postgres connection string
DATABASE_URL=postgres://username:password@host:port/database
```

### 2. Set Up Production Hasura

You need Hasura GraphQL Engine deployed. Options:

#### Option A: Hasura Cloud (Easiest - Free Tier Available)
1. Go to [hasura.io/cloud](https://hasura.io/cloud)
2. Create a new project
3. Connect your Railway Postgres database
4. Copy your Hasura GraphQL endpoint and admin secret

#### Option B: Self-hosted Hasura on Railway
```bash
# Deploy Hasura as a separate Railway service
# 1. Create new service from Docker image: hasura/graphql-engine:v2.40.0
# 2. Set environment variables (see below)
```

### 3. Configure Environment Variables in Railway

In your Railway project dashboard, add these environment variables:

**Required - Hasura Configuration:**
```bash
NEXT_PUBLIC_HASURA_URL=https://your-hasura-endpoint.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secure_admin_secret_here
```

**Required - Database:**
```bash
DATABASE_URL=postgres://user:pass@host:port/dbname
```

**Required - JWT (must match your Hasura JWT config):**
```bash
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_long
```

**Required - Application:**
```bash
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

**Automatic (Railway sets this):**
```bash
PORT=<auto-set-by-railway>
```

### 4. Initialize Database Schema

Run migrations on your production database:

```bash
# Option 1: Using local docker-compose (pointing to production DB)
export DATABASE_URL="your-production-database-url"
docker-compose up postgres
psql $DATABASE_URL < database/migrations/001_initial_schema.sql
psql $DATABASE_URL < database/migrations/002_seed_data.sql

# Option 2: Direct psql connection
psql "your-production-database-url" -f database/migrations/001_initial_schema.sql
psql "your-production-database-url" -f database/migrations/002_seed_data.sql
```

### 5. Configure Hasura Metadata

Run the Hasura setup script (update with your production Hasura URL):

```bash
# Edit database/hasura-setup.sh with your production values:
HASURA_URL="https://your-hasura-endpoint.hasura.app"
HASURA_ADMIN_SECRET="your-admin-secret"

# Then run:
bash database/hasura-setup.sh
```

This will:
- Track all tables (customers, cards, branches, staff, transactions, top_ups, audit_logs)
- Create relationships between tables
- Set up admin permissions

### 6. Push Changes to Git

```bash
cd /root/kiaan-pos-wallet-system
git add .
git commit -m "feat: configure for Postgres + Hasura deployment"
git push origin main
```

### 7. Deploy to Railway

#### Option A: Using Railway CLI

```bash
# If not already linked
railway link

# Deploy
railway up
```

#### Option B: Using Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `kiaan-pos-wallet-system` repository
4. Railway will auto-detect the configuration from `nixpacks.toml`

### 8. Monitor Build

Watch the build logs in Railway dashboard. The build process:
1. **Setup**: Installs Node.js 22
2. **Install**: Activates pnpm 9.15.4 and installs dependencies
3. **Build**: Runs `pnpm build --filter=admin`
4. **Start**: Starts the Next.js server on Railway's PORT

## Local Development Setup

### Start Local Stack

```bash
# 1. Start Postgres + Hasura
docker-compose up -d

# 2. Run migrations
psql postgres://kiaan_user:kiaan_secure_pass_2024@localhost:5440/kiaan_pos_wallet \
  -f database/migrations/001_initial_schema.sql

psql postgres://kiaan_user:kiaan_secure_pass_2024@localhost:5440/kiaan_pos_wallet \
  -f database/migrations/002_seed_data.sql

# 3. Configure Hasura
bash database/hasura-setup.sh

# 4. Start Next.js dev server
pnpm dev

# Access:
# - Admin Dashboard: http://localhost:3000
# - Hasura Console: http://localhost:8095/console
# - GraphQL Endpoint: http://localhost:8095/v1/graphql
```

## Environment Variables Reference

### Development (.env.local)
```bash
NEXT_PUBLIC_HASURA_URL=http://localhost:8095/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=kiaan_admin_secret_2024
DATABASE_URL=postgres://kiaan_user:kiaan_secure_pass_2024@localhost:5440/kiaan_pos_wallet
JWT_SECRET=kiaan_jwt_secret_key_change_this_in_production_2024
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Railway)
```bash
NEXT_PUBLIC_HASURA_URL=https://your-hasura.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=<strong-secret-here>
DATABASE_URL=<railway-postgres-connection-string>
JWT_SECRET=<minimum-32-character-secret>
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

## Build Configuration Details

### Nixpacks Build Process

```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@9.15.4 --activate",
  "pnpm install --frozen-lockfile"
]

[phases.build]
cmds = ["pnpm build --filter=admin"]

[start]
cmd = "cd apps/admin && pnpm start -p $PORT"
```

## Database Schema

Your system has these tables:
- `customers` - Customer information
- `cards` - NFC/RFID card management
- `branches` - Store/branch locations
- `staff` - Staff members and authentication
- `transactions` - Purchase transactions
- `top_ups` - Card balance top-ups
- `audit_logs` - System audit trail

## Hasura GraphQL Setup

Your Hasura instance provides:
- **GraphQL API** for all database tables
- **Relationships** between entities (customers → cards, transactions → branches, etc.)
- **Admin permissions** for full CRUD operations
- **JWT authentication** for secure access
- **Real-time subscriptions** for live updates

## Troubleshooting

### Build Fails During Install

**Issue**: `pnpm install` fails
**Solution**: Check that `pnpm-lock.yaml` is committed to git

### Build Fails During Build Phase

**Issue**: `pnpm build` fails with module resolution errors
**Solution**:
1. Verify workspace packages build locally: `pnpm build --filter=admin`
2. Check that `@kiaan/database` and `@kiaan/ui` packages have valid exports
3. Review TypeScript errors: `pnpm type-check`

### GraphQL Client Connection Errors

**Issue**: Can't connect to Hasura from deployed app
**Solution**:
1. Verify `NEXT_PUBLIC_HASURA_URL` is correct and publicly accessible
2. Check CORS settings in Hasura (should allow your Railway domain)
3. Verify admin secret matches between Railway env and Hasura config

### Database Connection Failed

**Issue**: Can't connect to Postgres
**Solution**:
1. Verify `DATABASE_URL` format: `postgres://user:pass@host:port/db`
2. Check that database allows connections from Railway IPs
3. Verify database is running and accessible

### JWT Authentication Fails

**Issue**: Token validation errors
**Solution**:
1. Ensure `JWT_SECRET` in Railway matches Hasura's JWT secret
2. Verify JWT secret is minimum 32 characters (HS256 requirement)
3. Check that JWT configuration in Hasura uses same algorithm (HS256)

### Health Check Fails

**Issue**: Railway reports health check failures
**Solution**:
1. Verify the app is listening on the PORT environment variable
2. Check that the root route (`/`) is accessible
3. Increase `healthcheckTimeout` in `railway.toml` if needed

## Production Checklist

Before going live:

- [ ] Database migrations applied to production DB
- [ ] Hasura metadata configured (tables tracked, relationships set)
- [ ] Strong JWT secret generated (min 32 chars)
- [ ] Hasura admin secret is secure (not default)
- [ ] Database credentials are secure
- [ ] CORS configured correctly in Hasura
- [ ] Environment variables set in Railway
- [ ] Test GraphQL queries work from production URL
- [ ] Authentication flow tested
- [ ] Custom domain configured (optional)

## Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
   - Add custom domain in Railway dashboard
   - Update DNS records
   - Update `NEXT_PUBLIC_APP_URL`

2. **Configure Hasura authentication**
   - Set up JWT claims for role-based access
   - Configure user/admin role permissions
   - Test authentication flow

3. **Set up monitoring**
   - Railway metrics
   - Hasura Cloud analytics (if using)
   - Database performance monitoring

4. **Database backups**
   - Railway automatic backups (if using Railway Postgres)
   - Manual backup scripts for external DB

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Hasura Docs**: https://hasura.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **URQL Docs**: https://formidable.com/open-source/urql/docs

## Important Notes

### Supabase Dependencies
Your codebase currently has Supabase imports in:
- `packages/database/src/client.ts`
- `apps/admin/lib/supabase/`

**These are NOT being used** since you're using Hasura GraphQL (via URQL), but they're still in package.json. Consider removing them in a future cleanup:
```bash
# Optional cleanup (do after deployment works):
pnpm remove @supabase/supabase-js @supabase/ssr
```

### GraphQL vs REST
You're using **GraphQL (Hasura + URQL)** for data fetching, not Supabase's REST API. The GraphQL client is configured in:
- `apps/admin/lib/graphql-client.ts`
- `apps/admin/lib/graphql-operations.ts`

---

**Status**: ✅ Ready to deploy with Postgres + Hasura
**Last Updated**: 2025-11-22
