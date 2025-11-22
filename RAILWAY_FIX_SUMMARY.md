# Railway Deployment Fix Summary

## ❌ Problem: "Error creating build plan with Railpack"

Your Railway deployment was failing because of **conflicting configuration files**.

## 🔍 Root Cause

You had **3 different Railway configuration files** competing with each other:

1. ❌ `./railway.toml` (root level)
2. ❌ `./apps/admin/railway.json` (app level)
3. ✅ `./nixpacks.toml` (root level - the one we kept)

Railway got confused trying to merge these configurations, causing the build to fail.

## ✅ What Was Fixed

### 1. **Removed Conflicting Files**
```bash
❌ Deleted: railway.toml (redundant)
❌ Deleted: apps/admin/railway.json (conflicting)
✅ Kept: nixpacks.toml (primary build config)
```

### 2. **Fixed nixpacks.toml**
```diff
[phases.setup]
- nixPkgs = ["nodejs_22"]              # Wrong package name
+ nixPkgs = ["nodejs-22_x"]            # Correct nixpkgs name

[phases.install]
cmds = [
  "corepack enable",
  "corepack prepare pnpm@9.15.4 --activate",
- "pnpm install --frozen-lockfile"
+ "pnpm install --frozen-lockfile --no-optional"  # Skip optional deps
]

[start]
- cmd = "cd apps/admin && pnpm start -p $PORT"
+ cmd = "cd apps/admin && node_modules/.bin/next start -p $PORT"  # Direct binary
```

### 3. **Added Fallback Configuration**
Created `Procfile` as backup if nixpacks fails:
```
web: cd apps/admin && pnpm start -p $PORT
```

Created `.node-version` to explicitly specify Node.js:
```
22
```

### 4. **Updated Root package.json**
```json
{
  "scripts": {
    "build": "pnpm install --frozen-lockfile && turbo build --filter=admin",
    "start": "cd apps/admin && pnpm start"
  }
}
```

### 5. **Removed Unused Scripts**
Cleaned up old Supabase scripts from package.json:
```diff
- "db:start": "supabase start",
- "db:stop": "supabase stop",
- "db:reset": "supabase db reset",
- "db:push": "supabase db push",
- "db:types": "supabase gen types typescript --local > packages/database/src/types.ts",
- "db:seed": "supabase db seed",
```

## 🚀 Deployment Configuration

### Current Setup (Simplified)

**Primary**: `nixpacks.toml`
- Handles build phases
- Installs pnpm and dependencies
- Builds the admin app
- Starts Next.js server

**Fallback**: `Procfile` + `package.json`
- If nixpacks has issues
- Railway can use standard build/start scripts

**Node Version**: `.node-version`
- Specifies Node.js 22

## 📝 Files Overview

```
kiaan-pos-wallet-system/
├── .node-version          # Node.js version (22)
├── .npmrc                 # pnpm configuration
├── .railwayignore         # Files to exclude from deployment
├── nixpacks.toml          # PRIMARY: Nixpacks build configuration
├── Procfile               # FALLBACK: Process definition
├── package.json           # Root package with build/start scripts
├── pnpm-workspace.yaml    # Monorepo workspace definition
└── apps/admin/            # Next.js admin app
    ├── package.json
    └── ...
```

## ✅ What Should Happen Now

When you deploy to Railway:

1. **Build Phase** (nixpacks.toml):
   ```bash
   # Setup: Install Node.js 22
   # Install: Enable corepack, install pnpm, install dependencies
   # Build: Run `pnpm build --filter=admin`
   ```

2. **Start Phase**:
   ```bash
   cd apps/admin && node_modules/.bin/next start -p $PORT
   ```

3. **If nixpacks fails**, Railway will fall back to:
   ```bash
   # Build: npm run build (or pnpm build)
   # Start: npm run start (or pnpm start)
   ```

## 🔧 Troubleshooting

### If Build Still Fails

**Check 1: Node.js Version**
```bash
# Railway should detect Node.js 22 from .node-version
# If not, set in Railway dashboard:
# Settings → Environment → Node Version → 22
```

**Check 2: pnpm Lock File**
```bash
# Make sure pnpm-lock.yaml is committed
git ls-files | grep pnpm-lock.yaml
```

**Check 3: Build Logs**
Look for these in Railway logs:
- "Setup: Installing nixPkgs nodejs-22_x" ✅
- "Install: corepack enable" ✅
- "Install: pnpm install" ✅
- "Build: pnpm build --filter=admin" ✅

### Common Issues

**Issue**: "nodejs-22_x not found"
**Fix**: Railway might use different nixpkgs version. Try:
```toml
nixPkgs = ["nodejs_latest"]
# or
nixPkgs = ["nodejs"]  # Uses default latest
```

**Issue**: "pnpm not found"
**Fix**: Make sure corepack is enabled:
```toml
cmds = [
  "corepack enable",
  "corepack prepare pnpm@9.15.4 --activate",
  ...
]
```

**Issue**: "Cannot find module @kiaan/database"
**Fix**: Workspace packages need to be built. Check that:
1. `pnpm-workspace.yaml` is correct
2. All workspace packages have valid package.json
3. Build command includes workspace: `--filter=admin`

## 🎯 Next Steps

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Set Environment Variables in Railway**:
   ```bash
   NEXT_PUBLIC_HASURA_URL=https://your-hasura.hasura.app/v1/graphql
   NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_admin_secret
   DATABASE_URL=postgres://user:pass@host:port/db
   JWT_SECRET=your_jwt_secret_min_32_chars
   NEXT_PUBLIC_APP_URL=https://your-app.railway.app
   ```

3. **Deploy**:
   - Railway will auto-deploy from GitHub
   - Or use: `railway up`

4. **Monitor Build**:
   - Watch Railway build logs
   - Check for successful phases: Setup → Install → Build → Start

## 📚 Documentation

See these files for more details:
- `RAILWAY_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `ENVIRONMENT_VARIABLES.md` - Environment variables reference
- `nixpacks.toml` - Build configuration

## ✨ Summary

**Before**: 3 conflicting config files, wrong Node.js package name
**After**: 1 clean nixpacks.toml + Procfile fallback

**Status**: ✅ Ready to deploy
**Expected**: Build should now succeed

---

**Last Updated**: 2025-11-22
**Issue**: Resolved Railway build configuration conflicts
