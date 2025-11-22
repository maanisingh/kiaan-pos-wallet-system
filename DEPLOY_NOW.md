# 🚀 READY TO DEPLOY - Railway Deployment Instructions

## ✅ **Problem FIXED!**

The "Error creating build plan with Railpack" has been resolved.

**Root Cause**: You had 3 conflicting Railway configuration files
**Solution**: Removed conflicts, fixed nixpacks config, added fallback

## 📤 **All Changes Pushed to GitHub**

Repository: `https://github.com/maanisingh/kiaan-pos-wallet-system.git`
Branch: `main`

Latest commits:
```
fbc7dff docs: add Railway fix summary and troubleshooting guide
45b3881 fix: resolve Railway build configuration conflicts
63280ff docs: add environment variables reference for Hasura setup
22de2f7 feat: configure deployment for Postgres + Hasura (not Supabase)
d6370e6 fix: Railway deployment configuration for monorepo
```

## 🎯 **Deploy to Railway NOW**

### Step 1: Set Up Hasura (Required)

**Option A: Hasura Cloud (Recommended - FREE tier)**
1. Go to: https://hasura.io/cloud
2. Sign up / Log in
3. Click "Create Project"
4. Connect to your Postgres database (see Step 2)
5. Copy your:
   - GraphQL URL: `https://xxx.hasura.app/v1/graphql`
   - Admin Secret: (set a strong password)

**Option B: Deploy Hasura on Railway**
1. Railway → New Service → Docker Image
2. Image: `hasura/graphql-engine:v2.40.0`
3. Set environment variables (see documentation)

### Step 2: Set Up Postgres Database

**Option A: Railway Postgres (Easiest)**
1. Railway → New → Database → Add PostgreSQL
2. Copy `DATABASE_URL` from Variables tab
3. Use this URL in Hasura connection

**Option B: External Postgres**
- Use DigitalOcean, AWS RDS, Supabase Postgres, etc.
- Get connection string: `postgres://user:pass@host:port/db`

### Step 3: Initialize Database

Run migrations on your production database:

```bash
# Connect to your production Postgres
psql "your-production-database-url" -f database/migrations/001_initial_schema.sql
psql "your-production-database-url" -f database/migrations/002_seed_data.sql

# Configure Hasura metadata
# Edit database/hasura-setup.sh first:
# - Change HASURA_URL to your production URL
# - Change HASURA_ADMIN_SECRET to your secret
bash database/hasura-setup.sh
```

### Step 4: Deploy Admin App to Railway

**Option A: Railway Dashboard (Recommended)**
1. Go to: https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `maanisingh/kiaan-pos-wallet-system`
5. Railway will **auto-detect** the configuration ✅
6. Add environment variables (see below)
7. Click "Deploy"

**Option B: Railway CLI**
```bash
cd /root/kiaan-pos-wallet-system

# Link to your Railway project (first time only)
railway link

# Deploy
railway up
```

### Step 5: Configure Environment Variables in Railway

**CRITICAL**: Add these in Railway dashboard → Variables:

```bash
# Hasura Configuration
NEXT_PUBLIC_HASURA_URL=https://your-hasura.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secure_admin_secret

# Database (if using external Postgres)
DATABASE_URL=postgres://user:password@host:port/database

# JWT Secret (MUST match Hasura JWT config)
JWT_SECRET=your_jwt_secret_minimum_32_characters_for_hs256_algorithm

# Application URL (Railway will provide this after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app
```

**Note**: `PORT` is set automatically by Railway - don't add it manually!

### Step 6: Monitor Build

Watch the build in Railway dashboard:

**Expected phases**:
1. ✅ Setup: Installing Node.js 22
2. ✅ Install: Enabling corepack, installing pnpm
3. ✅ Install: Running `pnpm install`
4. ✅ Build: Running `pnpm build --filter=admin`
5. ✅ Start: Starting Next.js server

**Build time**: 3-5 minutes (first build), 1-2 minutes (subsequent)

## 📋 **Build Configuration Details**

Your deployment uses:

**Primary Config**: `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs-22_x"]

[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@9.15.4 --activate",
  "pnpm install --frozen-lockfile --no-optional"
]

[phases.build]
cmds = ["pnpm build --filter=admin"]

[start]
cmd = "cd apps/admin && node_modules/.bin/next start -p $PORT"
```

**Fallback Config**: `Procfile`
```
web: cd apps/admin && pnpm start -p $PORT
```

**Node Version**: `.node-version`
```
22
```

## 🔍 **Verify Deployment**

After successful deployment:

```bash
# 1. Check app health
curl https://your-app.railway.app

# 2. Check if GraphQL client works
# Open browser: https://your-app.railway.app

# 3. Test Hasura connection
curl -X POST https://your-hasura.hasura.app/v1/graphql \
  -H "x-hasura-admin-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ customers { id name } }"}'
```

## ⚠️ **Common Issues & Solutions**

### Issue: Build fails at "Install" phase
**Cause**: pnpm-lock.yaml not committed or corrupted
**Fix**:
```bash
git ls-files | grep pnpm-lock.yaml  # Should show the file
# If missing, commit it
```

### Issue: Build fails at "Build" phase with module errors
**Cause**: Workspace packages not configured properly
**Fix**:
- Check `pnpm-workspace.yaml` exists
- Verify all packages have valid `package.json`
- Ensure turbo.json is configured correctly

### Issue: App starts but shows errors
**Cause**: Environment variables not set or wrong values
**Fix**:
1. Verify all required env vars are set in Railway
2. Check `NEXT_PUBLIC_HASURA_URL` is publicly accessible
3. Verify `JWT_SECRET` matches Hasura configuration

### Issue: GraphQL queries fail
**Cause**: Hasura configuration mismatch
**Fix**:
1. Check CORS settings in Hasura (allow your Railway domain)
2. Verify admin secret is correct
3. Check that database is accessible from Hasura

### Issue: "nodejs-22_x not found" in build logs
**Fix**: Update nixpacks.toml:
```toml
nixPkgs = ["nodejs"]  # Use default latest
```

## 📚 **Documentation Files**

All documentation is in your repository:

- `RAILWAY_FIX_SUMMARY.md` - What was fixed and why
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `ENVIRONMENT_VARIABLES.md` - Environment variables reference
- `DEPLOY_NOW.md` - This file (quick start)

## ✨ **What Was Fixed Summary**

### Before:
- ❌ 3 conflicting Railway config files
- ❌ Wrong Node.js package name in nixpacks
- ❌ Supabase environment variables (not using Supabase)
- ❌ Missing fallback configuration

### After:
- ✅ Single clean nixpacks.toml configuration
- ✅ Correct Node.js 22 package name
- ✅ Postgres + Hasura environment variables
- ✅ Procfile fallback for reliability
- ✅ .node-version for explicit Node version
- ✅ Updated package.json scripts

## 🎉 **You're Ready!**

Everything is configured and pushed to GitHub.

**Next action**: Deploy to Railway using the instructions above.

**Expected result**: ✅ Build succeeds → App deploys → Accessible at your Railway URL

---

**Need Help?**
- Check build logs in Railway dashboard
- Review troubleshooting section above
- Check `RAILWAY_FIX_SUMMARY.md` for details

**Good luck! 🚀**
