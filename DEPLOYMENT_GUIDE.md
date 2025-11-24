# Complete Deployment Guide - Kiaan POS Hybrid Stack
## Self-Hosted: ERPNext + Supabase + Hyperswitch

**Created:** November 23, 2025
**Stack:** 18 Docker Containers - 100% Open Source
**Total Setup Time:** 15-30 minutes

---

## 🎯 What You're Deploying

This guide deploys a complete, production-ready POS payment system with:

- **ERPNext** (5 containers) - Accounting & inventory backend
- **Supabase** (9 containers) - Real-time database & auto-generated APIs
- **Hyperswitch** (1 container) - Payment orchestration
- **Supporting Services** (3 containers) - Redis, MariaDB, imgproxy

**All self-hosted. All open source. No vendor lock-in.**

---

## 📦 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                 18 DOCKER CONTAINERS                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ERPNext Stack (5 services):                        │
│    ├── erpnext           (port 8000, 9000, 6787)   │
│    ├── mariadb           (ERPNext database)         │
│    ├── redis-cache       (caching)                  │
│    ├── redis-queue       (background jobs)          │
│    └── redis-socketio    (websockets)               │
│                                                      │
│  Supabase Stack (9 services):                       │
│    ├── postgres          (port 54322)               │
│    ├── studio            (port 54323)               │
│    ├── kong              (port 8001, 8444)          │
│    ├── rest              (port 3001 - PostgREST)    │
│    ├── auth              (port 9999 - GoTrue)       │
│    ├── realtime          (port 4000)                │
│    ├── storage           (port 5000)                │
│    ├── imgproxy          (port 5001)                │
│    ├── meta              (port 8080 - pg-meta)      │
│    └── analytics         (port 4000)                │
│                                                      │
│  Hyperswitch (1 service):                           │
│    └── hyperswitch       (port 8002)                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

### Required Software

```bash
# Docker & Docker Compose
docker --version  # Should be 20.10+
docker-compose --version  # Should be 1.29+

# Node.js (for frontend development)
node --version  # Should be 18+
npm --version   # Should be 9+

# Git (already installed)
git --version
```

### System Requirements

**Minimum:**
- 4GB RAM
- 2 CPU cores
- 20GB disk space
- Ubuntu 20.04+ or similar Linux

**Recommended (Production):**
- 8GB RAM
- 4 CPU cores
- 50GB SSD storage
- Ubuntu 22.04 LTS

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Start All Services (5 minutes)

```bash
# Navigate to project
cd /root/kiaan-pos-hybrid-stack/docker

# Start all 18 containers
docker-compose up -d

# This will start:
# - ERPNext (5 containers)
# - Supabase (9 containers)
# - Hyperswitch (1 container)
# - Supporting services (3 containers)
```

**Wait 2-3 minutes for all services to initialize.**

### Step 2: Verify Services Are Running (2 minutes)

```bash
# Check all containers
docker-compose ps

# You should see 18 containers with "Up" status
# Look for these key services:
# - erpnext
# - postgres
# - kong
# - hyperswitch
```

### Step 3: Initialize Database (3 minutes)

```bash
# Navigate to project root
cd /root/kiaan-pos-hybrid-stack

# Load database schema (creates tables)
docker-compose -f docker/docker-compose.yml exec -T postgres \
  psql -U postgres -d postgres < database/schema.sql

# Load seed data (sample customers & NFC cards)
docker-compose -f docker/docker-compose.yml exec -T postgres \
  psql -U postgres -d postgres < database/seed.sql

# Verify tables were created
docker-compose -f docker/docker-compose.yml exec postgres \
  psql -U postgres -d postgres -c "\dt"
```

**Expected output:** You should see tables like customers, nfc_cards, card_transactions, etc.

### Step 4: Access All Services (2 minutes)

Open your browser and verify these URLs:

| Service | URL | Credentials |
|---------|-----|-------------|
| **ERPNext** | http://localhost:8000 | Administrator / admin |
| **Supabase Studio** | http://localhost:54323 | - |
| **Kong API Gateway** | http://localhost:8001 | - |
| **Hyperswitch** | http://localhost:8002/health | - |

### Step 5: Complete ERPNext Setup (10 minutes)

1. Open http://localhost:8000
2. Login with `Administrator` / `admin`
3. Complete setup wizard:
   - Select country (e.g., Uganda)
   - Enter company name
   - Set currency (UGX)
   - Enable POS module
   - Create first user

### Step 6: Test Complete System (5 minutes)

```bash
# Run automated test script
cd /root/kiaan-pos-hybrid-stack/scripts
chmod +x test_complete_flow.sh
./test_complete_flow.sh
```

**Expected output:** All tests should pass with ✅ checkmarks.

---

## 🔧 CONFIGURATION

### Environment Variables

All services are pre-configured with default values. For production, update these:

#### 1. Update PostgreSQL Password

```bash
# In docker/docker-compose.yml, change:
POSTGRES_PASSWORD: your_super_secret_password_change_this

# Update in ALL services that connect to PostgreSQL:
# - postgres
# - rest
# - auth
# - storage
# - hyperswitch
```

#### 2. Update JWT Secrets

```bash
# In docker/docker-compose.yml, update:
JWT_SECRET: your_random_64_character_secret_here
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate new keys at: https://supabase.com/docs/guides/self-hosting#api-keys
```

#### 3. Configure Mobile Money (Optional)

```bash
# Add to docker/docker-compose.yml under hyperswitch:
MTN_API_KEY: your_mtn_api_key
MTN_API_SECRET: your_mtn_api_secret
AIRTEL_API_KEY: your_airtel_api_key
AIRTEL_API_SECRET: your_airtel_api_secret
```

---

## 📊 ACCESSING YOUR DATA

### PostgreSQL Database

```bash
# Connect via Docker
docker-compose -f docker/docker-compose.yml exec postgres \
  psql -U postgres -d postgres

# Or from your machine (port 54322)
psql -h localhost -p 54322 -U postgres -d postgres
# Password: your_super_secret_password_change_this
```

### Supabase Studio

1. Open http://localhost:54323
2. You can:
   - View all tables
   - Run SQL queries
   - Manage users & authentication
   - View API documentation
   - Test real-time subscriptions

### ERPNext API

```bash
# Get API credentials
# 1. Login to ERPNext: http://localhost:8000
# 2. Go to: User → Administrator → API Access
# 3. Generate Keys

# Test API
curl -X GET http://localhost:8000/api/resource/Customer \
  -H "Authorization: token api_key:api_secret"
```

---

## 🌐 PRODUCTION DEPLOYMENT

### Option 1: VPS/Server (Recommended)

```bash
# 1. Get a VPS (DigitalOcean, Linode, AWS, etc.)
#    Minimum: 4GB RAM, 2 CPU cores
#    Recommended: 8GB RAM, 4 CPU cores

# 2. Copy project to server
scp -r /root/kiaan-pos-hybrid-stack user@your-server.com:/opt/

# 3. SSH to server
ssh user@your-server.com

# 4. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 5. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 6. Start services
cd /opt/kiaan-pos-hybrid-stack/docker
docker-compose up -d

# 7. Configure SSL with Let's Encrypt
sudo apt update
sudo apt install certbot nginx -y

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# 8. Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/kiaan-pos
```

**Nginx Configuration:**

```nginx
# ERPNext
server {
    listen 80;
    server_name erp.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name erp.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Supabase API
server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Supabase Studio
server {
    listen 443 ssl;
    server_name studio.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:54323;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kiaan-pos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Railway (Cloud Platform)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd /root/kiaan-pos-hybrid-stack/docker
railway up

# Note: You'll need to configure each service separately
# Railway charges based on resource usage
```

---

## 🧪 TESTING

### Manual Testing

1. **Create a Customer:**
   - Open ERPNext: http://localhost:8000
   - Go to: Selling → Customer → New
   - Fill details and save

2. **Issue NFC Card:**
   - Open Supabase Studio: http://localhost:54323
   - Go to Table Editor → nfc_cards
   - Insert new row:
     ```sql
     card_uid: 04A1B2C3D4E5F6
     customer_id: [select from customers table]
     balance: 10000.00
     pin_hash: $2b$10$... (generate with bcrypt)
     status: active
     ```

3. **Test Transaction:**
   ```bash
   # Test API endpoint
   curl -X POST http://localhost:8001/rest/v1/card_transactions \
     -H "Content-Type: application/json" \
     -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -d '{
       "card_uid": "04A1B2C3D4E5F6",
       "transaction_type": "purchase",
       "amount": 5000,
       "balance_before": 10000,
       "balance_after": 5000
     }'
   ```

### Automated Testing

```bash
# Run complete test suite
cd /root/kiaan-pos-hybrid-stack/scripts
./test_complete_flow.sh

# Tests included:
# ✅ ERPNext is running
# ✅ Supabase is accessible
# ✅ Database has data
# ✅ All APIs responding
# ✅ Can create customer
# ✅ Can issue NFC card
# ✅ Can process transaction
```

---

## 🆘 TROUBLESHOOTING

### Services Won't Start

```bash
# View all logs
cd /root/kiaan-pos-hybrid-stack/docker
docker-compose logs

# View specific service logs
docker-compose logs erpnext
docker-compose logs postgres
docker-compose logs kong

# Restart all services
docker-compose restart

# Reset everything (CAUTION: Deletes data)
docker-compose down -v
docker-compose up -d
```

### ERPNext Not Accessible

```bash
# Check ERPNext logs
docker-compose logs erpnext

# Common issues:
# 1. Wait longer (first start takes 5-10 minutes)
# 2. Check port 8000 is not in use
# 3. Verify MariaDB is running

# Access ERPNext container
docker-compose exec erpnext bash
```

### Supabase API Not Working

```bash
# Check Kong logs
docker-compose logs kong

# Test Kong directly
curl http://localhost:8001

# Verify postgres is running
docker-compose exec postgres pg_isready -U postgres

# Check PostgREST
curl http://localhost:3001
```

### Database Connection Failed

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d postgres -c "SELECT version();"

# Check password in docker-compose.yml matches in:
# - postgres service
# - rest service
# - auth service
# - storage service
```

### Out of Memory

```bash
# Check Docker memory
docker stats

# Increase Docker memory limit:
# Docker Desktop → Settings → Resources → Memory → 8GB

# On Linux, add to /etc/docker/daemon.json:
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  }
}

# Restart Docker
sudo systemctl restart docker
```

---

## 📈 MONITORING

### Check Service Status

```bash
# View all containers
docker-compose ps

# Check resource usage
docker stats

# View logs in real-time
docker-compose logs -f
```

### Database Monitoring

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d postgres

# Check database size
SELECT pg_size_pretty(pg_database_size('postgres'));

# Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

### ERPNext Monitoring

```bash
# Check background jobs
# Login to ERPNext → Background Jobs

# Check error logs
# Login to ERPNext → Error Log

# Database backup
docker-compose exec mariadb mysqldump -u root -p erpnext > backup.sql
```

---

## 🔒 SECURITY

### Change Default Passwords

```bash
# 1. ERPNext Administrator password
# Login → User → Administrator → Set Password

# 2. PostgreSQL password
# Update in docker-compose.yml
# Then: docker-compose down && docker-compose up -d

# 3. JWT secrets
# Generate new keys: https://supabase.com/docs/guides/self-hosting#api-keys
# Update in docker-compose.yml and docker/kong.yml
```

### Enable Firewall

```bash
# Ubuntu UFW
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# Block direct access to services
# Only expose via Nginx reverse proxy
```

### Regular Backups

```bash
# Create backup script
cat > /opt/backup-kiaan-pos.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"

# Backup PostgreSQL
docker-compose -f /opt/kiaan-pos-hybrid-stack/docker/docker-compose.yml exec -T postgres \
  pg_dump -U postgres postgres > $BACKUP_DIR/postgres_$DATE.sql

# Backup ERPNext MariaDB
docker-compose -f /opt/kiaan-pos-hybrid-stack/docker/docker-compose.yml exec -T mariadb \
  mysqldump -u root erpnext > $BACKUP_DIR/erpnext_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-kiaan-pos.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /opt/backup-kiaan-pos.sh
```

---

## 📞 SUPPORT

### Documentation

- **ERPNext:** https://docs.erpnext.com
- **Supabase:** https://supabase.com/docs/guides/self-hosting
- **Hyperswitch:** https://hyperswitch.io/docs
- **Docker Compose:** https://docs.docker.com/compose/

### Community

- **ERPNext Forum:** https://discuss.frappe.io
- **Supabase Discord:** https://discord.supabase.com
- **Hyperswitch Discord:** https://discord.gg/hyperswitch

### Common Issues

1. **Port conflicts:** Change ports in docker-compose.yml
2. **Out of memory:** Increase Docker memory limit
3. **Slow performance:** Upgrade to SSD, increase RAM
4. **SSL issues:** Use Let's Encrypt with certbot

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] All 18 containers running
- [ ] ERPNext accessible at http://localhost:8000
- [ ] Supabase Studio accessible at http://localhost:54323
- [ ] Database tables created
- [ ] Sample data loaded
- [ ] ERPNext setup wizard completed
- [ ] API keys generated
- [ ] Default passwords changed
- [ ] SSL certificates configured (production)
- [ ] Firewall enabled (production)
- [ ] Backup script configured (production)
- [ ] Nginx reverse proxy configured (production)

---

## 🎉 SUCCESS!

Your Kiaan POS Hybrid Stack is now deployed and running!

**What you have:**
- ✅ Complete accounting system (ERPNext)
- ✅ Real-time database with auto-generated APIs (Supabase)
- ✅ Payment orchestration (Hyperswitch)
- ✅ All self-hosted, all open source
- ✅ 18 services working together seamlessly

**Next Steps:**
1. Build admin dashboard (see QUICK_START.md)
2. Create mobile app (see IMPLEMENTATION_TIMELINE.md)
3. Configure mobile money integration
4. Order NFC cards and readers
5. Train your team
6. Go live! 🚀

---

**Questions?** Review the documentation in `/root/kiaan-pos-hybrid-stack/`

**Need help?** Check troubleshooting section above

**Ready to build the UI?** Follow QUICK_START.md for admin dashboard and mobile app setup

**Happy Building!** 🎊
