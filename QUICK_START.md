# Kiaan POS & Wallet - Quick Start Guide

This guide will get you up and running in 15 minutes.

---

## Prerequisites Check

```bash
# Check Node.js version (need 22+)
node --version

# Install pnpm globally
npm install -g pnpm@9

# Check pnpm
pnpm --version

# Check Docker (for Supabase)
docker --version
```

---

## Step 1: Initialize Monorepo

```bash
# Create project directory
mkdir kiaan-pos-wallet-system
cd kiaan-pos-wallet-system

# Initialize with Turborepo
pnpx create-turbo@latest .

# When prompted, select:
# - Package manager: pnpm
# - Include example apps: No
```

---

## Step 2: Setup Workspace

```bash
# Create workspace file
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
EOF

# Create directory structure
mkdir -p apps packages tooling supabase
```

---

## Step 3: Initialize Supabase

```bash
# Install Supabase CLI
pnpm add -g supabase

# Initialize Supabase
supabase init

# Start local Supabase (Docker required)
supabase start

# Save the credentials shown in output
# You'll need:
# - API URL
# - anon key
# - service_role key
```

---

## Step 4: Create Database Schema

```bash
# Create migration
supabase migration new initial_schema

# Edit the migration file (copy from IMPLEMENTATION_GUIDE.md)
# File location: supabase/migrations/XXXXXX_initial_schema.sql

# Apply migration
supabase db reset
```

---

## Step 5: Generate TypeScript Types

```bash
# Create database package
mkdir -p packages/database/src

# Generate types
supabase gen types typescript --local > packages/database/src/types.ts

# Create package.json for database package
cat > packages/database/package.json << 'EOF'
{
  "name": "@kiaan/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1"
  }
}
EOF
```

---

## Step 6: Create Admin Dashboard

```bash
cd apps

# Create Next.js app
pnpx create-next-app@latest admin \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd admin

# Install additional dependencies
pnpm add @kiaan/database@workspace:* \
  @supabase/ssr \
  @tanstack/react-query \
  @tanstack/react-table \
  zustand \
  react-hook-form \
  zod \
  @hookform/resolvers \
  recharts \
  lucide-react \
  date-fns \
  sonner \
  cmdk

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
EOF

# Update with actual keys from `supabase status`
```

---

## Step 7: Install shadcn/ui Components

```bash
# Inside apps/admin

# Initialize shadcn
pnpx shadcn@latest init

# Select:
# - Style: New York
# - Base color: Slate
# - CSS variables: Yes

# Install commonly used components
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add input
pnpx shadcn@latest add label
pnpx shadcn@latest add table
pnpx shadcn@latest add dialog
pnpx shadcn@latest add dropdown-menu
pnpx shadcn@latest add toast
pnpx shadcn@latest add select
pnpx shadcn@latest add badge
pnpx shadcn@latest add avatar
```

---

## Step 8: Create Mobile App

```bash
# Go to apps directory
cd ../

# Create Expo app
pnpx create-expo-app@latest mobile --template tabs

cd mobile

# Install dependencies
pnpm add @kiaan/database@workspace:* \
  @supabase/supabase-js \
  expo-router \
  expo-secure-store \
  zustand \
  @tanstack/react-query \
  tamagui \
  @tamagui/config \
  @tamagui/lucide-icons \
  date-fns

# Create .env
cat > .env << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EOF
```

---

## Step 9: Create POS Terminal

```bash
# Go to apps directory
cd ../

# Create Tauri app
pnpm create tauri-app pos

# Select:
# - Framework: React
# - Variant: TypeScript + Vite

cd pos

# Install dependencies
pnpm add @kiaan/database@workspace:* \
  @supabase/supabase-js \
  zustand \
  @tanstack/react-query \
  react-hook-form \
  zod

# For NFC integration (add to Cargo.toml)
# pcsc = "2.8"
# hex = "0.4"
```

---

## Step 10: Setup Biome (Linter/Formatter)

```bash
# Go to root
cd ../../

# Install Biome
pnpm add -D @biomejs/biome

# Initialize Biome
pnpm biome init

# Create biome.json
cat > biome.json << 'EOF'
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".next",
      ".expo",
      "target"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded",
      "quoteStyle": "single"
    }
  }
}
EOF
```

---

## Step 11: Update Root Package.json

```json
{
  "name": "kiaan-pos-wallet-system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules",
    "db:reset": "supabase db reset",
    "db:push": "supabase db push",
    "db:types": "supabase gen types typescript --local > packages/database/src/types.ts"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": ">=22",
    "pnpm": ">=9"
  }
}
```

---

## Step 12: Configure Turborepo

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "test": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## Step 13: Run Development Servers

```bash
# Install all dependencies
pnpm install

# Run all apps
pnpm dev

# This will start:
# - Admin Dashboard: http://localhost:3000
# - Mobile App: Expo DevTools
# - POS Terminal: http://localhost:5173
```

---

## Step 14: Initialize Git & GitHub

```bash
# Initialize git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production builds
.next
dist
build
*.local

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Expo
.expo
.expo-shared

# Tauri
target
Cargo.lock

# Supabase
supabase/.temp
EOF

# Add all files
git add .

# Initial commit
git commit -m "chore: initial commit - Kiaan POS Wallet System"

# Create GitHub repo (using gh CLI)
gh repo create kiaan-pos-wallet-system --public --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

---

## Step 15: Deploy to Railway (Admin Dashboard)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to admin app
cd apps/admin

# Deploy
railway up

# Set environment variables in Railway dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY

# Your admin dashboard is now live!
```

---

## Common Commands Reference

```bash
# Development
pnpm dev                        # Run all apps
pnpm dev --filter=admin         # Admin only
pnpm dev --filter=mobile        # Mobile only
pnpm dev --filter=pos           # POS only

# Building
pnpm build                      # Build all
pnpm build --filter=admin       # Build admin only

# Database
pnpm db:reset                   # Reset database
pnpm db:push                    # Push migrations
pnpm db:types                   # Generate types

# Code Quality
pnpm lint                       # Check code
pnpm lint:fix                   # Fix issues
pnpm type-check                 # TypeScript check

# Deployment
railway up                      # Deploy admin
eas build --platform android    # Build mobile
pnpm tauri build                # Build POS
```

---

## Troubleshooting

### Supabase won't start
```bash
# Check Docker is running
docker ps

# Stop any existing instances
supabase stop

# Clean and restart
supabase db reset
```

### Type errors in imports
```bash
# Regenerate types
pnpm db:types

# Rebuild packages
pnpm build --filter=@kiaan/database
```

### Port already in use
```bash
# Change port in package.json
# Admin: "dev": "next dev --port 3001"
# Mobile: Check expo config
# POS: Check vite.config.ts
```

### pnpm install fails
```bash
# Clear cache
pnpm store prune

# Delete node_modules
pnpm clean

# Reinstall
pnpm install
```

---

## Next Steps

1. **Customize UI** - Update colors, branding in Tailwind config
2. **Add Features** - Implement additional modules (see FRONTEND_PLAN.md)
3. **Setup CI/CD** - Configure GitHub Actions (see IMPLEMENTATION_GUIDE.md)
4. **Integrate Payments** - Add MTN/Airtel Mobile Money SDKs
5. **Testing** - Add unit tests and E2E tests
6. **Documentation** - Create user guides and API docs

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tauri Docs](https://tauri.app/v2/guides/)
- [Expo Docs](https://docs.expo.dev/)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Railway Docs](https://docs.railway.app/)

---

## Support

Need help? Check:
- GitHub Issues
- Documentation in `/docs` folder
- Email: support@kiaan.com

---

**You're all set! Start building amazing features! 🚀**
