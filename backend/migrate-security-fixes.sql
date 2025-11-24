-- Kiaan POS Security Fixes Database Migration
-- Run this to create users table and clean XSS payloads

-- ====================
-- FIX #1: Create Users Table for Authentication
-- ====================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert default admin user (password: admin123)
-- Password hash generated with: bcrypt.hash('admin123', 10)
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@kiaan.com', '$2a$10$IhKGzEv/v44bB.ZhRW2Q1e3OWPzrTRHmPonyM4o7zcPm65PH6RlOm', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ====================
-- FIX #2: Clean XSS Payloads from Database
-- ====================

-- Remove customers with XSS payloads in their names
DELETE FROM customers
WHERE name LIKE '%<script%'
   OR name LIKE '%<img%'
   OR name LIKE '%javascript:%'
   OR name LIKE '%<svg%'
   OR name LIKE '%onerror%'
   OR name LIKE '%onload%';

-- Clean any remaining HTML/script tags from customer names
UPDATE customers
SET name = REGEXP_REPLACE(name, '<[^>]*>', '', 'g')
WHERE name ~ '<[^>]*>';

-- Clean HTML tags from customer emails if any
UPDATE customers
SET email = REGEXP_REPLACE(email, '<[^>]*>', '', 'g')
WHERE email ~ '<[^>]*>';

-- Clean HTML tags from customer addresses
UPDATE customers
SET address = REGEXP_REPLACE(address, '<[^>]*>', '', 'g')
WHERE address ~ '<[^>]*>' AND address IS NOT NULL;

-- ====================
-- Migration Complete
-- ====================

-- Verify the cleanup
SELECT
    'Users table created' as status,
    COUNT(*) as user_count
FROM users;

SELECT
    'XSS payloads removed' as status,
    COUNT(*) as remaining_customers
FROM customers;

-- Show any remaining suspicious content (should be 0)
SELECT
    id,
    name,
    email,
    'WARNING: Suspicious content detected' as alert
FROM customers
WHERE name LIKE '%<%'
   OR name LIKE '%>%'
   OR email LIKE '%<%';
