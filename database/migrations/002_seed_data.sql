-- Kiaan POS & Wallet System - Seed Data
-- Test data for development and demonstration

-- Insert Branches
INSERT INTO branches (id, name, code, location, phone, email, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kampala Main Branch', 'KMP-001', 'Plot 45, Kampala Road, Kampala', '+256 772 123000', 'kampala@kiaan.ug', true),
  ('22222222-2222-2222-2222-222222222222', 'Entebbe Branch', 'ENT-002', 'Entebbe Road, Entebbe', '+256 772 123001', 'entebbe@kiaan.ug', true),
  ('33333333-3333-3333-3333-333333333333', 'Jinja Branch', 'JNJ-003', 'Main Street, Jinja', '+256 772 123002', 'jinja@kiaan.ug', true);

-- Insert Staff (password is 'password123' hashed with bcrypt)
-- Note: In production, use proper password hashing library
INSERT INTO staff (id, full_name, email, password_hash, phone, role, branch_id, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Admin User', 'admin@kiaan.ug', '$2b$10$YourHashedPasswordHere', '+256 772 100000', 'admin', NULL, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'John Manager', 'john.manager@kiaan.ug', '$2b$10$YourHashedPasswordHere', '+256 772 100001', 'branch_manager', '11111111-1111-1111-1111-111111111111', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sarah Cashier', 'sarah.cashier@kiaan.ug', '$2b$10$YourHashedPasswordHere', '+256 772 100002', 'cashier', '11111111-1111-1111-1111-111111111111', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Peter Manager', 'peter.manager@kiaan.ug', '$2b$10$YourHashedPasswordHere', '+256 772 100003', 'branch_manager', '22222222-2222-2222-2222-222222222222', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Mary Cashier', 'mary.cashier@kiaan.ug', '$2b$10$YourHashedPasswordHere', '+256 772 100004', 'cashier', '22222222-2222-2222-2222-222222222222', true);

-- Update branch managers
UPDATE branches SET manager_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE branches SET manager_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' WHERE id = '22222222-2222-2222-2222-222222222222';

-- Insert Customers
INSERT INTO customers (id, full_name, phone_number, email, date_of_birth, address) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'John Mugisha', '+256 772 123456', 'john.m@email.com', '1990-05-15', 'Kampala, Uganda'),
  ('c2222222-2222-2222-2222-222222222222', 'Sarah Nakato', '+256 772 234567', 'sarah.n@email.com', '1992-08-20', 'Entebbe, Uganda'),
  ('c3333333-3333-3333-3333-333333333333', 'David Okello', '+256 772 345678', 'david.o@email.com', '1988-03-10', 'Jinja, Uganda'),
  ('c4444444-4444-4444-4444-444444444444', 'Grace Nambi', '+256 772 456789', 'grace.n@email.com', '1995-11-25', 'Kampala, Uganda'),
  ('c5555555-5555-5555-5555-555555555555', 'Michael Ssali', '+256 772 567890', 'michael.s@email.com', '1991-07-18', 'Mbarara, Uganda'),
  ('c6666666-6666-6666-6666-666666666666', 'Betty Namusoke', '+256 772 678901', 'betty.n@email.com', '1993-02-14', 'Kampala, Uganda'),
  ('c7777777-7777-7777-7777-777777777777', 'James Ochieng', '+256 772 789012', 'james.o@email.com', '1989-09-30', 'Entebbe, Uganda'),
  ('c8888888-8888-8888-8888-888888888888', 'Patricia Akello', '+256 772 890123', 'patricia.a@email.com', '1994-12-05', 'Jinja, Uganda');

-- Insert Cards (PIN hash for '1234')
-- Note: In production, use proper PIN hashing
INSERT INTO cards (uid, customer_id, balance, status, pin_hash, daily_limit) VALUES
  ('CARD-001-KMP', 'c1111111-1111-1111-1111-111111111111', 245000.00, 'active', '$2b$10$YourHashedPinHere', 500000.00),
  ('CARD-002-ENT', 'c2222222-2222-2222-2222-222222222222', 567000.00, 'active', '$2b$10$YourHashedPinHere', 1000000.00),
  ('CARD-003-JNJ', 'c3333333-3333-3333-3333-333333333333', 0.00, 'inactive', '$2b$10$YourHashedPinHere', 500000.00),
  ('CARD-004-KMP', 'c4444444-4444-4444-4444-444444444444', 892000.00, 'active', '$2b$10$YourHashedPinHere', 1000000.00),
  ('CARD-005-MBR', 'c5555555-5555-5555-5555-555555555555', 123000.00, 'active', '$2b$10$YourHashedPinHere', 500000.00),
  ('CARD-006-KMP', 'c6666666-6666-6666-6666-666666666666', 450000.00, 'lost', '$2b$10$YourHashedPinHere', 500000.00),
  ('CARD-007-ENT', 'c7777777-7777-7777-7777-777777777777', 678000.00, 'active', '$2b$10$YourHashedPinHere', 1000000.00),
  ('CARD-008-JNJ', 'c8888888-8888-8888-8888-888888888888', 156000.00, 'stolen', '$2b$10$YourHashedPinHere', 500000.00);

-- Insert sample transactions
INSERT INTO transactions (card_uid, type, amount, balance_before, balance_after, branch_id, staff_id, status, description) VALUES
  ('CARD-001-KMP', 'top_up', 500000.00, 0.00, 500000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Initial top-up'),
  ('CARD-001-KMP', 'purchase', 255000.00, 500000.00, 245000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Purchase at Main Branch'),
  ('CARD-002-ENT', 'top_up', 600000.00, 0.00, 600000.00, '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'completed', 'Initial top-up'),
  ('CARD-002-ENT', 'purchase', 33000.00, 600000.00, 567000.00, '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'completed', 'Purchase at Entebbe Branch'),
  ('CARD-004-KMP', 'top_up', 1000000.00, 0.00, 1000000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Initial top-up'),
  ('CARD-004-KMP', 'purchase', 108000.00, 1000000.00, 892000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Purchase at Main Branch'),
  ('CARD-005-MBR', 'top_up', 200000.00, 0.00, 200000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Initial top-up'),
  ('CARD-005-MBR', 'purchase', 77000.00, 200000.00, 123000.00, '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'completed', 'Purchase at Main Branch'),
  ('CARD-007-ENT', 'top_up', 700000.00, 0.00, 700000.00, '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'completed', 'Initial top-up'),
  ('CARD-007-ENT', 'purchase', 22000.00, 700000.00, 678000.00, '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'completed', 'Purchase at Entebbe Branch');

-- Insert sample top-ups
INSERT INTO top_ups (card_uid, amount, source, payment_provider, phone_number, payment_reference, status, initiated_at, completed_at) VALUES
  ('CARD-001-KMP', 500000.00, 'mobile_app', 'mtn', '+256 772 123456', 'MTN-REF-001', 'completed', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('CARD-002-ENT', 600000.00, 'mobile_app', 'airtel', '+256 772 234567', 'AIRTEL-REF-001', 'completed', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  ('CARD-004-KMP', 1000000.00, 'admin', 'cash', '+256 772 456789', 'CASH-REF-001', 'completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('CARD-005-MBR', 200000.00, 'mobile_app', 'mtn', '+256 772 567890', 'MTN-REF-002', 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('CARD-007-ENT', 700000.00, 'mobile_app', 'airtel', '+256 772 789012', 'AIRTEL-REF-002', 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
