-- Add Users Table for Authentication
-- Migration: 001_add_users_table
-- Created: 2025-11-24

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff', -- admin, manager, staff
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Create default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, name, role)
VALUES (
    'admin@kiaan.com',
    '$2b$10$rZEkK7KqHZm7Q5xOj8X2Yumu6QQzGJ8k2xHXjVYx3XfYc6jYzH4Sq',
    'Admin User',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'User authentication and authorization table';
COMMENT ON COLUMN users.role IS 'User role: admin, manager, or staff';
COMMENT ON COLUMN users.status IS 'Account status: active, inactive, or suspended';
