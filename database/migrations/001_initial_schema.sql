-- Kiaan POS & Wallet System - Initial Database Schema
-- Big Innovation Group Ltd
-- Closed-Loop Payment System
-- PostgreSQL + Hasura Version

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'branch_manager', 'cashier');
CREATE TYPE card_status AS ENUM ('active', 'inactive', 'lost', 'stolen');
CREATE TYPE transaction_type AS ENUM ('purchase', 'top_up', 'adjustment', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE payment_provider AS ENUM ('mtn', 'airtel', 'cash', 'system');

-- CUSTOMERS TABLE
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARDS TABLE
CREATE TABLE cards (
  uid TEXT PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
  status card_status DEFAULT 'active',
  pin_hash TEXT NOT NULL,
  daily_limit NUMERIC(10, 2) DEFAULT 1000.00,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANCHES TABLE
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF TABLE
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for branch manager
ALTER TABLE branches ADD CONSTRAINT fk_branch_manager
  FOREIGN KEY (manager_id) REFERENCES staff(id) ON DELETE SET NULL;

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT REFERENCES cards(uid) NOT NULL,
  type transaction_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  balance_before NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  branch_id UUID REFERENCES branches(id),
  staff_id UUID REFERENCES staff(id),
  payment_method payment_provider,
  payment_reference TEXT,
  status transaction_status DEFAULT 'completed',
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOP-UPS TABLE
CREATE TABLE top_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  card_uid TEXT REFERENCES cards(uid) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  source TEXT NOT NULL CHECK (source IN ('ussd', 'mobile_app', 'admin')),
  payment_provider payment_provider NOT NULL,
  phone_number TEXT NOT NULL,
  payment_reference TEXT UNIQUE,
  status transaction_status DEFAULT 'pending',
  callback_data JSONB,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- AUDIT LOG TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_cards_customer ON cards(customer_id);
CREATE INDEX idx_cards_status ON cards(status) WHERE status = 'active';
CREATE INDEX idx_transactions_card ON transactions(card_uid);
CREATE INDEX idx_transactions_branch ON transactions(branch_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_topups_card ON top_ups(card_uid);
CREATE INDEX idx_topups_status ON top_ups(status) WHERE status = 'pending';
CREATE INDEX idx_topups_reference ON top_ups(payment_reference);
CREATE INDEX idx_staff_branch ON staff(branch_id);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_email ON staff(email);

-- TRIGGERS

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- STORED PROCEDURES

-- Process Purchase Function
CREATE OR REPLACE FUNCTION process_purchase(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_branch_id UUID,
  p_staff_id UUID,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Lock and get card
  SELECT * INTO v_card FROM cards WHERE uid = p_card_uid FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Card not found');
  END IF;

  IF v_card.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Card is not active');
  END IF;

  -- Check balance
  IF v_card.balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_card.balance,
      'required', p_amount
    );
  END IF;

  -- Calculate new balance
  v_new_balance := v_card.balance - p_amount;

  -- Insert transaction
  INSERT INTO transactions (
    card_uid, type, amount, balance_before, balance_after,
    branch_id, staff_id, status, description
  ) VALUES (
    p_card_uid, 'purchase', p_amount, v_card.balance, v_new_balance,
    p_branch_id, p_staff_id, 'completed', p_description
  ) RETURNING id INTO v_transaction_id;

  -- Update card
  UPDATE cards SET
    balance = v_new_balance,
    last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'previous_balance', v_card.balance,
    'amount_deducted', p_amount,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Process Top-Up Function
CREATE OR REPLACE FUNCTION process_top_up(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_payment_provider TEXT,
  p_payment_reference TEXT,
  p_phone_number TEXT,
  p_source TEXT DEFAULT 'mobile_app'
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
  v_topup_id UUID;
BEGIN
  -- Check for duplicate payment reference
  IF EXISTS (SELECT 1 FROM top_ups WHERE payment_reference = p_payment_reference) THEN
    RETURN json_build_object('success', false, 'error', 'Duplicate payment reference');
  END IF;

  -- Lock and get card
  SELECT * INTO v_card FROM cards WHERE uid = p_card_uid FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Card not found');
  END IF;

  -- Calculate new balance
  v_new_balance := v_card.balance + p_amount;

  -- Insert transaction
  INSERT INTO transactions (
    card_uid, type, amount, balance_before, balance_after,
    payment_method, payment_reference, status
  ) VALUES (
    p_card_uid, 'top_up', p_amount, v_card.balance, v_new_balance,
    p_payment_provider::payment_provider, p_payment_reference, 'completed'
  ) RETURNING id INTO v_transaction_id;

  -- Insert top-up record
  INSERT INTO top_ups (
    transaction_id, card_uid, amount, source, payment_provider,
    phone_number, payment_reference, status, completed_at
  ) VALUES (
    v_transaction_id, p_card_uid, p_amount, p_source,
    p_payment_provider::payment_provider, p_phone_number,
    p_payment_reference, 'completed', NOW()
  ) RETURNING id INTO v_topup_id;

  -- Update card
  UPDATE cards SET
    balance = v_new_balance,
    last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'topup_id', v_topup_id,
    'previous_balance', v_card.balance,
    'amount_added', p_amount,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Get Dashboard Stats Function
CREATE OR REPLACE FUNCTION get_dashboard_stats(
  p_branch_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_cards', (SELECT COUNT(*) FROM cards WHERE status = 'active'),
    'total_customers', (SELECT COUNT(*) FROM customers),
    'total_balance', (SELECT COALESCE(SUM(balance), 0) FROM cards WHERE status = 'active'),
    'today_transactions', (
      SELECT COUNT(*) FROM transactions
      WHERE created_at >= CURRENT_DATE
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'today_revenue', (
      SELECT COALESCE(SUM(amount), 0) FROM transactions
      WHERE type = 'purchase'
      AND created_at >= CURRENT_DATE
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'total_topups', (
      SELECT COALESCE(SUM(amount), 0) FROM top_ups
      WHERE status = 'completed'
      AND completed_at BETWEEN p_start_date AND p_end_date
    ),
    'pending_topups', (
      SELECT COUNT(*) FROM top_ups WHERE status = 'pending'
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;
