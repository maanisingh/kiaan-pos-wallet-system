-- Kiaan POS & Wallet System - Seed Data
-- Test data for development

-- Insert test branches
INSERT INTO branches (id, name, code, location, phone, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Branch', 'BR001', 'Kampala Central, Uganda', '+256700000001', 'main@biginnovation.com'),
  ('00000000-0000-0000-0000-000000000002', 'Downtown Branch', 'BR002', 'Kampala Downtown, Uganda', '+256700000002', 'downtown@biginnovation.com'),
  ('00000000-0000-0000-0000-000000000003', 'Airport Branch', 'BR003', 'Entebbe International Airport', '+256700000003', 'airport@biginnovation.com');

-- Insert admin and staff users
INSERT INTO staff (id, full_name, email, phone, role, branch_id) VALUES
  ('00000000-0000-0000-0000-000000000010', 'System Admin', 'admin@kiaan.com', '+256700000010', 'admin', NULL),
  ('00000000-0000-0000-0000-000000000011', 'John Manager', 'manager1@kiaan.com', '+256700000011', 'branch_manager', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000012', 'Sarah Cashier', 'cashier1@kiaan.com', '+256700000012', 'cashier', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000013', 'Peter Manager', 'manager2@kiaan.com', '+256700000013', 'branch_manager', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000014', 'Jane Cashier', 'cashier2@kiaan.com', '+256700000014', 'cashier', '00000000-0000-0000-0000-000000000002');

-- Update branch managers
UPDATE branches SET manager_id = '00000000-0000-0000-0000-000000000011' WHERE id = '00000000-0000-0000-0000-000000000001';
UPDATE branches SET manager_id = '00000000-0000-0000-0000-000000000013' WHERE id = '00000000-0000-0000-0000-000000000002';

-- Insert test customers
INSERT INTO customers (id, full_name, phone_number, email, address) VALUES
  ('00000000-0000-0000-0000-000000000020', 'James Mukasa', '+256700000020', 'james@example.com', 'Kampala, Uganda'),
  ('00000000-0000-0000-0000-000000000021', 'Mary Nakato', '+256700000021', 'mary@example.com', 'Entebbe, Uganda'),
  ('00000000-0000-0000-0000-000000000022', 'Robert Okello', '+256700000022', 'robert@example.com', 'Kampala, Uganda'),
  ('00000000-0000-0000-0000-000000000023', 'Grace Nalongo', '+256700000023', 'grace@example.com', 'Jinja, Uganda'),
  ('00000000-0000-0000-0000-000000000024', 'David Ssemakula', '+256700000024', 'david@example.com', 'Kampala, Uganda');

-- Insert test cards (PIN hash for "1234" - in production use proper bcrypt)
-- Note: Use $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy as bcrypt hash for "1234"
INSERT INTO cards (uid, customer_id, balance, status, pin_hash, daily_limit) VALUES
  ('CARD-00001', '00000000-0000-0000-0000-000000000020', 150.00, 'active', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 500.00),
  ('CARD-00002', '00000000-0000-0000-0000-000000000021', 320.50, 'active', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1000.00),
  ('CARD-00003', '00000000-0000-0000-0000-000000000022', 75.00, 'active', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 300.00),
  ('CARD-00004', '00000000-0000-0000-0000-000000000023', 500.00, 'active', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1500.00),
  ('CARD-00005', '00000000-0000-0000-0000-000000000024', 200.00, 'active', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 750.00);

-- Insert sample transactions
INSERT INTO transactions (card_uid, type, amount, balance_before, balance_after, branch_id, staff_id, status, description) VALUES
  -- Top-ups
  ('CARD-00001', 'top_up', 150.00, 0.00, 150.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'completed', 'Initial top-up'),
  ('CARD-00002', 'top_up', 500.00, 0.00, 500.00, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000013', 'completed', 'Initial top-up'),
  ('CARD-00003', 'top_up', 100.00, 0.00, 100.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'completed', 'Initial top-up'),
  -- Purchases
  ('CARD-00002', 'purchase', 45.50, 500.00, 454.50, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014', 'completed', 'Grocery purchase'),
  ('CARD-00002', 'purchase', 134.00, 454.50, 320.50, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014', 'completed', 'Electronics'),
  ('CARD-00001', 'purchase', 25.00, 150.00, 125.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'completed', 'Lunch'),
  ('CARD-00003', 'purchase', 25.00, 100.00, 75.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'completed', 'Coffee'),
  -- More top-ups
  ('CARD-00004', 'top_up', 500.00, 0.00, 500.00, '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000010', 'completed', 'Mobile app top-up'),
  ('CARD-00005', 'top_up', 200.00, 0.00, 200.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'completed', 'USSD top-up');

-- Insert corresponding top-up records
INSERT INTO top_ups (card_uid, amount, source, payment_provider, phone_number, payment_reference, status, completed_at) VALUES
  ('CARD-00001', 150.00, 'admin', 'system', '+256700000020', 'REF-001-INIT', 'completed', NOW() - INTERVAL '7 days'),
  ('CARD-00002', 500.00, 'mobile_app', 'mtn', '+256700000021', 'MTN-REF-12345', 'completed', NOW() - INTERVAL '6 days'),
  ('CARD-00003', 100.00, 'ussd', 'airtel', '+256700000022', 'AIRTEL-REF-67890', 'completed', NOW() - INTERVAL '5 days'),
  ('CARD-00004', 500.00, 'mobile_app', 'mtn', '+256700000023', 'MTN-REF-11111', 'completed', NOW() - INTERVAL '2 days'),
  ('CARD-00005', 200.00, 'ussd', 'airtel', '+256700000024', 'AIRTEL-REF-22222', 'completed', NOW() - INTERVAL '1 day');

-- Verify data
DO $$
BEGIN
  RAISE NOTICE '=== Seed Data Summary ===';
  RAISE NOTICE 'Branches: %', (SELECT COUNT(*) FROM branches);
  RAISE NOTICE 'Staff: %', (SELECT COUNT(*) FROM staff);
  RAISE NOTICE 'Customers: %', (SELECT COUNT(*) FROM customers);
  RAISE NOTICE 'Cards: %', (SELECT COUNT(*) FROM cards);
  RAISE NOTICE 'Transactions: %', (SELECT COUNT(*) FROM transactions);
  RAISE NOTICE 'Top-ups: %', (SELECT COUNT(*) FROM top_ups);
  RAISE NOTICE 'Total System Balance: $%', (SELECT SUM(balance) FROM cards WHERE status = 'active');
END $$;
