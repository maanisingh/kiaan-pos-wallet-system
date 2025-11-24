-- Simple PostgreSQL Schema for Kiaan POS
-- No Supabase dependencies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    erpnext_id VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- NFC CARDS TABLE
CREATE TABLE IF NOT EXISTS nfc_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'UGX',
    status VARCHAR(20) DEFAULT 'active',
    pin_hash VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP,
    blocked_at TIMESTAMP,
    blocked_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS card_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid VARCHAR(50) REFERENCES nfc_cards(card_uid) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    merchant_id UUID,
    branch_id UUID,
    terminal_id VARCHAR(100),
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),
    reference_number VARCHAR(100) UNIQUE,
    description TEXT,
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

-- BRANCHES TABLE
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    phone VARCHAR(50),
    email VARCHAR(255),
    manager_id UUID,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TERMINALS TABLE
CREATE TABLE IF NOT EXISTS terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_id VARCHAR(100) UNIQUE NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(255),
    device_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    last_online TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- TOP UPS TABLE
CREATE TABLE IF NOT EXISTS top_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid VARCHAR(50) REFERENCES nfc_cards(card_uid) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50),
    provider_reference VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_customer_id ON nfc_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_nfc_cards_card_uid ON nfc_cards(card_uid);
CREATE INDEX IF NOT EXISTS idx_transactions_card_uid ON card_transactions(card_uid);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON card_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_top_ups_card_uid ON top_ups(card_uid);

-- Create views for reporting
CREATE OR REPLACE VIEW daily_transaction_summary AS
SELECT
    DATE(created_at) as transaction_date,
    COUNT(*) as total_transactions,
    SUM(CASE WHEN transaction_type = 'purchase' THEN amount ELSE 0 END) as total_purchases,
    SUM(CASE WHEN transaction_type = 'topup' THEN amount ELSE 0 END) as total_topups,
    SUM(CASE WHEN transaction_type = 'refund' THEN amount ELSE 0 END) as total_refunds
FROM card_transactions
GROUP BY DATE(created_at)
ORDER BY transaction_date DESC;

CREATE OR REPLACE VIEW card_balance_overview AS
SELECT
    c.card_uid,
    c.balance,
    c.status as card_status,
    cust.name as customer_name,
    cust.phone as customer_phone,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount ELSE 0 END) as total_spent
FROM nfc_cards c
LEFT JOIN customers cust ON c.customer_id = cust.id
LEFT JOIN card_transactions t ON c.card_uid = t.card_uid
GROUP BY c.card_uid, c.balance, c.status, cust.name, cust.phone;

CREATE OR REPLACE VIEW branch_performance AS
SELECT
    b.name as branch_name,
    b.city,
    COUNT(DISTINCT t.id) as transaction_count,
    SUM(t.amount) as total_revenue,
    COUNT(DISTINCT te.id) as terminal_count
FROM branches b
LEFT JOIN terminals te ON b.id = te.branch_id
LEFT JOIN card_transactions t ON te.terminal_id = t.terminal_id
GROUP BY b.id, b.name, b.city;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfc_cards_updated_at BEFORE UPDATE ON nfc_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terminals_updated_at BEFORE UPDATE ON terminals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables: customers, nfc_cards, card_transactions, branches, terminals, top_ups, audit_logs';
    RAISE NOTICE 'Views: daily_transaction_summary, card_balance_overview, branch_performance';
END $$;
