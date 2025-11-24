-- Kiaan POS Hybrid Stack - Database Schema
-- Supabase PostgreSQL Schema
-- Created: 2025-11-23

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE (synced from ERPNext)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    erpnext_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_erpnext_id ON customers(erpnext_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- ============================================
-- NFC CARDS TABLE
-- ============================================
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

CREATE INDEX idx_cards_uid ON nfc_cards(card_uid);
CREATE INDEX idx_cards_customer ON nfc_cards(customer_id);
CREATE INDEX idx_cards_status ON nfc_cards(status);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS card_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid VARCHAR(50) REFERENCES nfc_cards(card_uid) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    transaction_type VARCHAR(20) NOT NULL, -- purchase, topup, refund
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UGX',
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    merchant_id UUID,
    branch_id UUID,
    terminal_id VARCHAR(100),
    payment_method VARCHAR(50), -- nfc, mobile_money, cash
    payment_provider VARCHAR(50), -- mtn, airtel, etc.
    reference_number VARCHAR(100) UNIQUE,
    description TEXT,
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_card ON card_transactions(card_uid);
CREATE INDEX idx_transactions_customer ON card_transactions(customer_id);
CREATE INDEX idx_transactions_type ON card_transactions(transaction_type);
CREATE INDEX idx_transactions_date ON card_transactions(created_at);
CREATE INDEX idx_transactions_reference ON card_transactions(reference_number);

-- ============================================
-- BRANCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    erpnext_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    manager_name VARCHAR(255),
    manager_phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_branches_code ON branches(code);

-- ============================================
-- TERMINALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_id VARCHAR(100) UNIQUE NOT NULL,
    branch_id UUID REFERENCES branches(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- pos, mobile, web
    status VARCHAR(20) DEFAULT 'active',
    last_ping TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_terminals_branch ON terminals(branch_id);
CREATE INDEX idx_terminals_id ON terminals(terminal_id);

-- ============================================
-- TOP-UPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS top_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_uid VARCHAR(50) REFERENCES nfc_cards(card_uid),
    customer_id UUID REFERENCES customers(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'UGX',
    payment_method VARCHAR(50) NOT NULL, -- mtn, airtel, cash
    payment_reference VARCHAR(100) UNIQUE,
    payment_provider VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    callback_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_topups_card ON top_ups(card_uid);
CREATE INDEX idx_topups_customer ON top_ups(customer_id);
CREATE INDEX idx_topups_reference ON top_ups(payment_reference);
CREATE INDEX idx_topups_status ON top_ups(status);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON nfc_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terminals_updated_at BEFORE UPDATE ON terminals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- Daily transaction summary
CREATE OR REPLACE VIEW daily_transaction_summary AS
SELECT
    DATE(created_at) as transaction_date,
    transaction_type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM card_transactions
WHERE status = 'completed'
GROUP BY DATE(created_at), transaction_type
ORDER BY transaction_date DESC, transaction_type;

-- Card balance overview
CREATE OR REPLACE VIEW card_balance_overview AS
SELECT
    c.card_uid,
    c.balance,
    c.status as card_status,
    cust.name as customer_name,
    cust.phone as customer_phone,
    c.issued_at,
    c.last_used_at,
    COUNT(t.id) as total_transactions,
    SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount ELSE 0 END) as total_spent,
    SUM(CASE WHEN t.transaction_type = 'topup' THEN t.amount ELSE 0 END) as total_topped_up
FROM nfc_cards c
LEFT JOIN customers cust ON c.customer_id = cust.id
LEFT JOIN card_transactions t ON c.card_uid = t.card_uid
GROUP BY c.card_uid, c.balance, c.status, cust.name, cust.phone, c.issued_at, c.last_used_at;

-- Branch performance
CREATE OR REPLACE VIEW branch_performance AS
SELECT
    b.name as branch_name,
    b.code as branch_code,
    COUNT(DISTINCT t.id) as total_transactions,
    COUNT(DISTINCT t.card_uid) as unique_customers,
    SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount ELSE 0 END) as total_sales,
    AVG(CASE WHEN t.transaction_type = 'purchase' THEN t.amount ELSE 0 END) as average_transaction
FROM branches b
LEFT JOIN card_transactions t ON b.id = t.branch_id
WHERE t.status = 'completed'
GROUP BY b.id, b.name, b.code;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_ups ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read access" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON nfc_cards
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON card_transactions
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample branch
INSERT INTO branches (name, code, city, country, status)
VALUES ('Main Branch', 'MAIN', 'Kampala', 'Uganda', 'active')
ON CONFLICT (code) DO NOTHING;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables: customers, nfc_cards, card_transactions, branches, terminals, top_ups, audit_logs';
    RAISE NOTICE 'Views: daily_transaction_summary, card_balance_overview, branch_performance';
END $$;
