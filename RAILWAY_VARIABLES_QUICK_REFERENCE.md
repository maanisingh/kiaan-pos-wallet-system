# Railway Environment Variables - Quick Reference

## 🎯 Copy & Paste Ready

---

## 1️⃣ PostgreSQL Database
**Service Type:** Database → PostgreSQL
**Action:** Create it first, Railway auto-generates all variables

---

## 2️⃣ Backend API Service

**GitHub Repo:** `maanisingh/kiaan-pos-wallet-system`
**Root Directory:** `/backend`
**Build Command:** `npm install`
**Start Command:** `node server.js`

### Environment Variables:

```env
NODE_ENV=production
PORT=4500
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
JWT_SECRET=kiaan_pos_jwt_secret_2024_change_to_random_64_character_string
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=10
```

**After deployment, copy your backend URL** (something like `https://kiaan-backend-production-abc123.up.railway.app`)

---

## 3️⃣ Admin Dashboard Service

**GitHub Repo:** `maanisingh/kiaan-pos-wallet-system`
**Root Directory:** `/admin-dashboard`
**Build Command:** `npm install && npm run build`
**Start Command:** `npx vite preview --host 0.0.0.0 --port $PORT`

### Environment Variables:

```env
VITE_API_URL=YOUR_BACKEND_URL_HERE
VITE_APP_NAME=Kiaan POS Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_NFC=true
VITE_ENABLE_MOBILE_MONEY=true
VITE_ENABLE_USSD=true
```

**Replace `YOUR_BACKEND_URL_HERE` with your actual backend URL from step 2**

---

## 📊 Complete Setup Checklist

### Phase 1: Create Services
- [ ] Create PostgreSQL database (Railway managed)
- [ ] Create Backend service (GitHub repo)
- [ ] Create Admin Dashboard service (GitHub repo)

### Phase 2: Configure Backend
- [ ] Add all backend environment variables
- [ ] Link `${{Postgres.*}}` variables
- [ ] Deploy and wait for build
- [ ] Copy backend public URL

### Phase 3: Configure Admin Dashboard
- [ ] Add dashboard environment variables
- [ ] Set `VITE_API_URL` to backend URL
- [ ] Deploy and wait for build

### Phase 4: Initialize Database
- [ ] Connect to PostgreSQL via Railway CLI or GUI
- [ ] Run `/database-new/schema.sql`
- [ ] Run `/database-new/seed.sql` (optional sample data)

### Phase 5: Test Everything
- [ ] Test backend: `curl YOUR_BACKEND_URL/health`
- [ ] Open admin dashboard in browser
- [ ] Verify API calls work from frontend

---

## 🔗 Variable References

When setting up in Railway, use these references to link services:

| Variable | Reference Format | Example |
|----------|-----------------|---------|
| Database URL | `${{Postgres.DATABASE_URL}}` | Auto-filled by Railway |
| DB Host | `${{Postgres.PGHOST}}` | Auto-filled by Railway |
| DB Port | `${{Postgres.PGPORT}}` | Auto-filled by Railway |
| DB User | `${{Postgres.PGUSER}}` | Auto-filled by Railway |
| DB Password | `${{Postgres.PGPASSWORD}}` | Auto-filled by Railway |
| DB Name | `${{Postgres.PGDATABASE}}` | Auto-filled by Railway |

---

## 🌐 URLs After Deployment

After deploying, you'll get these URLs:

1. **Backend API:** `https://kiaan-backend-production-XXXXX.up.railway.app`
2. **Admin Dashboard:** `https://kiaan-dashboard-production-XXXXX.up.railway.app`
3. **PostgreSQL:** (Internal only, accessible via `${{Postgres.DATABASE_URL}}`)

---

## 🔑 Important Notes

1. **JWT_SECRET**: Generate a secure random string (64+ characters)
   ```bash
   # Generate on your machine:
   openssl rand -base64 48
   ```

2. **CORS_ORIGIN**: For production, change from `*` to specific domain:
   ```
   CORS_ORIGIN=https://kiaan-dashboard-production-XXXXX.up.railway.app
   ```

3. **Database**: Must be created FIRST, then reference it in backend

4. **Build Order**:
   - PostgreSQL → Backend → Admin Dashboard

5. **VITE_ prefix**: All Vite environment variables MUST start with `VITE_`

---

## 🚀 One-Command Database Setup

Once services are deployed, run this via Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to PostgreSQL
railway run psql

# Then paste the schema.sql contents
```

---

## 💡 Pro Tips

1. **Use Railway's "Service Variables"**: Click "+ Reference" to auto-link services
2. **Enable "Private Networking"** in Railway for better security
3. **Set up domains**: Add custom domains in Railway settings
4. **Monitor logs**: Use `railway logs` to debug issues
5. **Use Railway CLI**: Faster than web UI for some tasks

---

## ❌ Common Mistakes to Avoid

1. ❌ Forgetting to update `VITE_API_URL` after backend deploys
2. ❌ Using `localhost` in environment variables
3. ❌ Not linking database variables with `${{Postgres.*}}`
4. ❌ Deploying admin dashboard before backend is ready
5. ❌ Not running database migrations after first deploy

---

## ✅ Final Verification

Run these tests after deployment:

```bash
# Test backend health
curl https://your-backend.up.railway.app/health

# Test API endpoint
curl https://your-backend.up.railway.app/api/branches

# Open admin dashboard
open https://your-admin-dashboard.up.railway.app
```

**If all three work, you're successfully deployed! 🎉**
