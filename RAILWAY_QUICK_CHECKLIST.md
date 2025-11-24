# ⚡ Railway Deployment - Quick Checklist

## 🚨 Current Error
```
❌ Database connection failed: Error: connect ECONNREFUSED ::1:5432
```

---

## ✅ 4-Step Fix (5 minutes)

### 1️⃣ Add PostgreSQL (30 sec)
```
Railway Dashboard → [+ New] → Database → PostgreSQL
```

### 2️⃣ Add JWT_SECRET (10 sec)
```
App Service → Variables → [+ New Variable]
Name: JWT_SECRET
Value: kiaan-pos-secret-2024-change-me
```

### 3️⃣ Run Schema (2 min)
```
PostgreSQL Service → Data → Query →
(Paste contents of database-new/schema.sql) → Run Query
```

### 4️⃣ Push Code (30 sec)
```bash
cd /root/kiaan-pos-wallet-system
git push origin main
```

---

## ✅ Success Logs

You should see:
```
📊 Using DATABASE_URL for connection
✅ Database connected successfully
🚀 Kiaan POS API Server running on port 8080
✅ Ready to accept requests!
```

---

## 🧪 Quick Test

```bash
# Get your Railway URL from dashboard
curl https://your-app.railway.app/health

# Should return: {"status":"ok","database":"connected"}
```

---

## 📋 Variables Checklist

In Variables tab, verify these exist:
- ✅ `DATABASE_URL` (auto-created by PostgreSQL)
- ✅ `JWT_SECRET` (you must add this)
- ✅ `PGHOST` (auto-created)
- ✅ `PGPORT` (auto-created)
- ✅ `PGDATABASE` (auto-created)

---

## 🔍 Where to Click in Railway

```
1. Main Dashboard
   └─ Your Project
      ├─ [+ New] ← Add PostgreSQL here
      ├─ Your App Service
      │  ├─ Variables ← Add JWT_SECRET here
      │  ├─ Deployments ← Check logs here
      │  └─ Settings → Domains ← Get URL here
      └─ PostgreSQL Service
         └─ Data → Query ← Run schema here
```

---

## ⚠️ Common Mistakes

❌ Forgot to add PostgreSQL service
❌ Didn't run the schema.sql
❌ JWT_SECRET not set
❌ Forgot to push code changes

---

## 📞 Files for More Info

- **This file** - Quick checklist ⚡
- `RAILWAY_VISUAL_FIX_GUIDE.md` - Step-by-step with screenshots
- `RAILWAY_QUICKSTART.md` - Complete guide
- `RAILWAY_ACTION_ITEMS.md` - Detailed action items

---

**Ready?** Open Railway dashboard and follow steps 1-4 above! 🚀
