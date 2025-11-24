-- Kiaan POS - Sample/Seed Data
-- For testing and development

-- Insert sample customers
INSERT INTO customers (erpnext_id, name, email, phone, city, country, status) VALUES
('CUST-00001', 'John Doe', 'john.doe@email.com', '+256700000001', 'Kampala', 'Uganda', 'active'),
('CUST-00002', 'Jane Smith', 'jane.smith@email.com', '+256700000002', 'Kampala', 'Uganda', 'active'),
('CUST-00003', 'Peter Mukasa', 'peter.mukasa@email.com', '+256700000003', 'Entebbe', 'Uganda', 'active'),
('CUST-00004', 'Sarah Nambi', 'sarah.nambi@email.com', '+256700000004', 'Kampala', 'Uganda', 'active'),
('CUST-00005', 'David Okello', 'david.okello@email.com', '+256700000005', 'Jinja', 'Uganda', 'active')
ON CONFLICT (erpnext_id) DO NOTHING;

-- Insert sample branches
INSERT INTO branches (erpnext_id, name, code, city, country, manager_name, manager_phone, status) VALUES
('BRANCH-001', 'Main Branch - Kampala', 'KB-MAIN', 'Kampala', 'Uganda', 'James Musoke', '+256700100001', 'active'),
('BRANCH-002', 'Garden City Mall', 'KB-GCM', 'Kampala', 'Uganda', 'Grace Nakato', '+256700100002', 'active'),
('BRANCH-003', 'Entebbe Road', 'KB-ENT', 'Entebbe', 'Uganda', 'Moses Wanyama', '+256700100003', 'active')
ON CONFLICT (code) DO NOTHING;

-- Insert sample NFC cards
INSERT INTO nfc_cards (card_uid, customer_id, balance, pin_hash, status) VALUES
('04A1B2C3D4E5F6', (SELECT id FROM customers WHERE erpnext_id = 'CUST-00001'), 50000.00, '$2b$10$xQZ3kY7hNjL8mP9qRsT2uO1vW4xZ6yA8bC0dE2fG4hI6jK8lM0nO2', 'active'),
('04B2C3D4E5F6A7', (SELECT id FROM customers WHERE erpnext_id = 'CUST-00002'), 75000.00, '$2b$10$yRaA4lB8iOkM9nQ0pSuT3vP2wX5yZ7aB9cD1eE3fG5hJ7kL9mM1nP3', 'active'),
('04C3D4E5F6A7B8', (SELECT id FROM customers WHERE erpnext_id = 'CUST-00003'), 25000.00, '$2b$10$zSbB5mC9jPlN0oR1qTvU4wQ3xY6zA8aC0dF2eE4fG6hK8lM0nN2oQ4', 'active'),
('04D4E5F6A7B8C9', (SELECT id FROM customers WHERE erpnext_id = 'CUST-00004'), 100000.00, '$2b$10$aTcC6nD0kQmO1pS2rUwV5xR4yZ7aB9bD1eG3fF5gG7iL9mN1oO3pR5', 'active'),
('04E5F6A7B8C9D0', (SELECT id FROM customers WHERE erpnext_id = 'CUST-00005'), 15000.00, '$2b$10$bUdD7oE1lRnP2qT3sVxW6yS5zA8bC0cE2fH4gG6hH8jM0nO2pP4qS6', 'active')
ON CONFLICT (card_uid) DO NOTHING;

-- Insert sample terminals
INSERT INTO terminals (terminal_id, branch_id, name, type, status) VALUES
('POS-KB-001', (SELECT id FROM branches WHERE code = 'KB-MAIN'), 'Main Counter 1', 'pos', 'active'),
('POS-KB-002', (SELECT id FROM branches WHERE code = 'KB-MAIN'), 'Main Counter 2', 'pos', 'active'),
('POS-GCM-001', (SELECT id FROM branches WHERE code = 'KB-GCM'), 'Mall Counter 1', 'pos', 'active'),
('POS-ENT-001', (SELECT id FROM branches WHERE code = 'KB-ENT'), 'Entebbe Counter', 'pos', 'active'),
('MOBILE-001', (SELECT id FROM branches WHERE code = 'KB-MAIN'), 'Mobile Terminal', 'mobile', 'active')
ON CONFLICT (terminal_id) DO NOTHING;

-- Insert sample transactions
INSERT INTO card_transactions (
    card_uid,
    customer_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    branch_id,
    terminal_id,
    payment_method,
    reference_number,
    description,
    status
) VALUES
-- Top-ups
(
    '04A1B2C3D4E5F6',
    (SELECT id FROM customers WHERE erpnext_id = 'CUST-00001'),
    'topup',
    50000.00,
    0.00,
    50000.00,
    (SELECT id FROM branches WHERE code = 'KB-MAIN'),
    'POS-KB-001',
    'mobile_money',
    'MTN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'MTN Mobile Money top-up',
    'completed'
),
(
    '04B2C3D4E5F6A7',
    (SELECT id FROM customers WHERE erpnext_id = 'CUST-00002'),
    'topup',
    75000.00,
    0.00,
    75000.00,
    (SELECT id FROM branches WHERE code = 'KB-MAIN'),
    'POS-KB-001',
    'mobile_money',
    'AIRT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'Airtel Money top-up',
    'completed'
),
-- Purchases
(
    '04A1B2C3D4E5F6',
    (SELECT id FROM customers WHERE erpnext_id = 'CUST-00001'),
    'purchase',
    15000.00,
    50000.00,
    35000.00,
    (SELECT id FROM branches WHERE code = 'KB-MAIN'),
    'POS-KB-001',
    'nfc',
    'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'Purchase at Main Branch',
    'completed'
),
(
    '04B2C3D4E5F6A7',
    (SELECT id FROM customers WHERE erpnext_id = 'CUST-00002'),
    'purchase',
    25000.00,
    75000.00,
    50000.00,
    (SELECT id FROM branches WHERE code = 'KB-GCM'),
    'POS-GCM-001',
    'nfc',
    'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-002',
    'Purchase at Garden City',
    'completed'
),
(
    '04C3D4E5F6A7B8',
    (SELECT id FROM customers WHERE erpnext_id = 'CUST-00003'),
    'purchase',
    8000.00,
    33000.00,
    25000.00,
    (SELECT id FROM branches WHERE code = 'KB-ENT'),
    'POS-ENT-001',
    'nfc',
    'TXN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-003',
    'Purchase at Entebbe',
    'completed'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Created: 5 customers, 3 branches, 5 NFC cards, 5 terminals, 5 transactions';
END $$;
