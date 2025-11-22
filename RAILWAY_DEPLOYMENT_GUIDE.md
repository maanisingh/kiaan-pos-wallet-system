# 🚂 Railway Deployment Guide

## ✅ What We Just Pushed to GitHub

**Commit:** `474691e - feat: Add Railway deployment configuration`

**Files Pushed:**
- ✅ Merchant Dashboard (`apps/merchant/app/page.tsx`)
- ✅ Customer Portal (`apps/customer/app/page.tsx`)
- ✅ POS Terminal (`apps/pos/app/page.tsx`)
- ✅ Landing Page (`apps/web/app/page.tsx`)
- ✅ Railway Configuration (`railway.json`)
- ✅ Documentation files

**GitHub Repository:** https://github.com/maanisingh/kiaan-pos-wallet-system

---

## 🎯 Railway Auto-Deployment Status

Since your Railway project is connected to this GitHub repository, it should **automatically deploy** when you push to the `main` branch.

### What Railway Will Deploy:

Railway typically deploys **one service per repository**. For a monorepo like ours with multiple apps, you have a few options:

---

## 📦 Option 1: Deploy Admin Dashboard (Current Setup)

Your current `package.json` is configured to deploy the admin dashboard:

```json
"scripts": {
  "build": "pnpm install --frozen-lockfile && turbo build --filter=admin",
  "start": "cd apps/admin && pnpm start"
}
```

**Result:** Railway will deploy the **Admin Dashboard** only.

**URL:** Your existing Railway URL (e.g., https://pos-production-bae1.up.railway.app)

---

## 📦 Option 2: Deploy All Apps (Recommended)

To deploy all 4 dashboards simultaneously, we need to update the build/start scripts.

### Update `package.json` in root:

```json
"scripts": {
  "dev": "turbo dev",
  "build": "turbo build",
  "start": "turbo start"
}
```

### Add to each app's `package.json`:

```json
"scripts": {
  "start": "next start"
}
```

**Problem:** This will try to start all apps on the same port, which won't work.

---

## 📦 Option 3: Deploy Each App Separately (Best Practice)

Create **4 separate Railway services**, one for each app:

### 1. **Admin Dashboard Service**
- **Root Directory:** `/apps/admin`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Port:** 3000

### 2. **Merchant Dashboard Service**
- **Root Directory:** `/apps/merchant`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start -- --port $PORT`
- **Custom Port:** Will use Railway's `$PORT`

### 3. **Customer Portal Service**
- **Root Directory:** `/apps/customer`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start -- --port $PORT`

### 4. **POS Terminal Service**
- **Root Directory:** `/apps/pos`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start -- --port $PORT`

### 5. **Landing Page Service**
- **Root Directory:** `/apps/web`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start -- --port $PORT`

---

## 🔧 How to Set Up Multiple Services on Railway

### Via Railway Dashboard:

1. **Go to your Railway project**
2. **Click "New Service"** for each app
3. **Select your GitHub repo**
4. **Configure each service:**
   - Set **Root Directory** (e.g., `/apps/merchant`)
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npm start`
   - Railway will automatically assign a unique URL

### Via Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy each service
railway up --service merchant
railway up --service customer
railway up --service pos
railway up --service web
```

---

## 🌐 Expected Deployment URLs

After setting up all services, you'll have:

| Service | Railway URL |
|---------|-------------|
| Admin Dashboard | `https://admin-production-xxxx.up.railway.app` |
| Merchant Dashboard | `https://merchant-production-xxxx.up.railway.app` |
| Customer Portal | `https://customer-production-xxxx.up.railway.app` |
| POS Terminal | `https://pos-production-xxxx.up.railway.app` |
| Landing Page | `https://kiaan-production-xxxx.up.railway.app` |

---

## ✅ Quick Check: Is Railway Deploying?

1. **Go to Railway Dashboard:** https://railway.app/dashboard
2. **Check your project**
3. **Look for:**
   - 🟢 Green checkmark = Deployed successfully
   - 🔵 Blue circle = Deploying now
   - 🔴 Red X = Deployment failed

---

## 🐛 Troubleshooting

### Build Fails?
Check Railway logs for errors. Common issues:
- Missing dependencies
- Wrong Node version
- Build timeout

### Wrong App Deployed?
- Check `package.json` scripts in root
- Make sure `build` and `start` point to correct app

### Need All Apps?
- Create multiple Railway services (one per app)
- Each service should have its own Railway URL

---

## 🎊 Next Steps

1. ✅ Code is pushed to GitHub
2. ⏳ Railway should auto-deploy (check dashboard)
3. 🔧 If you need all 4 apps deployed:
   - Create 4 Railway services
   - Configure each with correct root directory
   - Each gets its own URL

4. 🎨 Update Landing Page links:
   - Replace localhost URLs with Railway URLs
   - Update `apps/web/app/page.tsx`

---

## 📝 Current Status

- ✅ All dashboard code pushed to GitHub
- ✅ Railway configuration added
- ⏳ Waiting for Railway auto-deployment
- 🔧 May need to configure multiple services for all apps

**Check Railway now:** https://railway.app/dashboard
