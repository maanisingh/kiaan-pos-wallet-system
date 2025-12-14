# 🚨 URGENT FIX - Run This SQL Now

## Problem Found
❌ The `users` table is missing from your database!
❌ That's why authentication endpoints are failing.

## ✅ Solution (2 minutes)

### Step 1: Go to Railway PostgreSQL
1. Open: https://railway.com/project/c6b95811-8833-4a7e-9370-b171f0aeaa7e
2. Click on **PostgreSQL** service
3. Click **Data** tab
4. Click **Query** button

### Step 2: Run This SQL
Copy the ENTIRE content from this file:
```
/root/kiaan-pos-wallet-system/database-new/001_add_users_table.sql
```

Or copy this directly:

```sql
-- Add Users Table for Authentication
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff',
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@kiaan.com',
    '$2b$10$rZEkK7KqHZm7Q5xOj8X2Yumu6QQzGJ8k2xHXjVYx3XfYc6jYzH4Sq',
    'Admin User',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Click "Run Query"

You should see: ✅ Success messages

### Step 4: Test Authentication
```bash
# Test login (use the default admin account)
curl -X POST https://kiaan-pos-wallet-system-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kiaan.com",
    "password": "admin123"
  }'
```

Expected result:
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@kiaan.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## Default Login Credentials
- **Email**: `admin@kiaan.com`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change this password after first login!

## What This Fixes
✅ User registration endpoint
✅ User login endpoint
✅ User authentication
✅ Protected API endpoints
✅ JWT token generation

## After Running Migration
All these will work:
- ✅ `POST /api/auth/register` - Register new users
- ✅ `POST /api/auth/login` - Login users
- ✅ `GET /api/auth/me` - Get current user
- ✅ All protected endpoints (customers, cards, transactions, etc.)

---

**Status**: ✅ Code fixed and pushed to GitHub
**Action Required**: Run the SQL migration in Railway PostgreSQL (2 minutes)

Once done, let me know and I'll test all endpoints!
