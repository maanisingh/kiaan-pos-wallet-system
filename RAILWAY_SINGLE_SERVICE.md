# 🚂 Railway Single-Service Deployment (All Apps)

## ✅ What We've Configured

Your Railway service will now run **ALL 4 dashboards** from a single deployment!

### Architecture:

```
Railway Service (Port 8080)
    ↓
Reverse Proxy Server (Express)
    ├── /              → Landing Page (port 3000)
    ├── /merchant      → Merchant Dashboard (port 3001)
    ├── /customer      → Customer Portal (port 3002)
    └── /pos           → POS Terminal (port 3003)
        ↑
    PM2 Process Manager
    (Runs all 4 Next.js apps)
```

---

## 📦 Files Added/Modified

### 1. **ecosystem.config.js** - PM2 Configuration
Manages all 4 Next.js applications on different ports

### 2. **server.js** - Reverse Proxy
Express server that routes requests to the appropriate app based on path

### 3. **package.json** - Updated Scripts
- `build`: Builds ALL apps (not just admin)
- `start`: Starts PM2 + Proxy server
- Added dependencies: `pm2`, `express`, `http-proxy-middleware`

### 4. **apps/web/app/page.tsx** - Updated Links
Landing page now uses proxy paths (`/merchant`, `/customer`, `/pos`)

---

## 🌐 How It Works

1. **Railway deploys** your code
2. **Build step**: Builds all 4 Next.js apps
3. **Start step**: 
   - PM2 starts all 4 apps on ports 3000-3003
   - Proxy server starts on Railway's PORT (usually 8080)
4. **User visits** your Railway URL
5. **Proxy routes** requests to the correct app

---

## 📍 URL Structure

| URL Path | Dashboard | Internal Port |
|----------|-----------|---------------|
| `https://your-app.railway.app/` | Landing Page | 3000 |
| `https://your-app.railway.app/merchant` | Merchant Dashboard | 3001 |
| `https://your-app.railway.app/customer` | Customer Portal | 3002 |
| `https://your-app.railway.app/pos` | POS Terminal | 3003 |

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub ✅
```bash
git add .
git commit -m "feat: Configure single-service deployment for all apps"
git push origin main
```

### Step 2: Railway Auto-Deploys ⏳
Railway will automatically:
1. Detect the push
2. Install dependencies (including pm2, express)
3. Run `pnpm build` (builds all 4 apps)
4. Run `pnpm start` (starts PM2 + proxy)

### Step 3: Access Your Apps 🎉
Visit your Railway URL and you'll see:
- **Landing page** with cards linking to all dashboards
- Click any card to access that dashboard
- All routes work: `/merchant`, `/customer`, `/pos`

---

## 🔧 Local Testing

Test the full setup locally:

```bash
# Build all apps
pnpm build

# Start all apps with proxy
pnpm start

# Access at http://localhost:8080
```

Or start individually:
```bash
# Terminal 1: Start all Next.js apps
pnpm run start:apps

# Terminal 2: Start proxy server
pnpm run start:proxy
```

---

## 📊 Monitoring

### Check PM2 Status:
```bash
pm2 list
pm2 logs
pm2 monit
```

### Check Health:
```bash
curl https://your-app.railway.app/health
```

---

## 🐛 Troubleshooting

### Apps not starting?
1. Check Railway logs
2. Verify PM2 is installed: `pnpm list pm2`
3. Check ecosystem.config.js paths

### Proxy not routing?
1. Check server.js is running
2. Verify ports in ecosystem.config.js
3. Test health endpoint: `/health`

### Build fails?
1. Check turbo build works locally
2. Verify all package.json files have `build` script
3. Check Railway build logs for specific errors

---

## 💡 Benefits of Single-Service Deployment

✅ **Cost Effective**: One Railway service instead of 4
✅ **Shared Resources**: Apps share memory and CPU
✅ **Simpler Management**: One deployment to manage
✅ **Single URL**: All apps under one domain
✅ **Easy Updates**: Push once, update everything

---

## 🎯 Next Steps

1. ✅ Code is ready
2. ⏳ Push to GitHub (trigger deployment)
3. 🔍 Monitor Railway deployment
4. 🎉 Access all dashboards from one URL!

---

## 📝 Current Configuration

**Build Command (Railway):**
```bash
pnpm install --frozen-lockfile && turbo build
```

**Start Command (Railway):**
```bash
pm2 start ecosystem.config.js && node server.js
```

**Port:** Railway will provide `PORT` environment variable (proxy uses it)

**Apps Running:**
- ✅ Landing Page (web) - Port 3000
- ✅ Merchant Dashboard - Port 3001  
- ✅ Customer Portal - Port 3002
- ✅ POS Terminal - Port 3003
- ✅ Reverse Proxy - Port $PORT (Railway assigned)

All ready for deployment! 🚀
