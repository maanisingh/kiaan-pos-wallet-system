const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const initDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Initializing database...');

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Drop existing tables (for fresh start)
    await client.query(`
      DROP TABLE IF EXISTS audit_logs CASCADE;
      DROP TABLE IF EXISTS top_ups CASCADE;
      DROP TABLE IF EXISTS card_transactions CASCADE;
      DROP TABLE IF EXISTS terminals CASCADE;
      DROP TABLE IF EXISTS nfc_cards CASCADE;
      DROP TABLE IF EXISTS branches CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
    `);
    console.log('✅ Existing tables dropped');

    // Create customers table
    await client.query(`
      CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50) NOT NULL UNIQUE,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Uganda',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Customers table created');

    // Create branches table
    await client.query(`
      CREATE TABLE branches (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Uganda',
        phone VARCHAR(50),
        email VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Branches table created');

    // Create NFC cards table
    await client.query(`
      CREATE TABLE nfc_cards (
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
      )
    `);
    console.log('✅ NFC cards table created');

    // Create terminals table
    await client.query(`
      CREATE TABLE terminals (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        terminal_id VARCHAR(100) UNIQUE NOT NULL,
        branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
        name VARCHAR(255),
        device_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'active',
        last_online TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Terminals table created');

    // Create transactions table
    await client.query(`
      CREATE TABLE card_transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        card_uid VARCHAR(50) REFERENCES nfc_cards(card_uid) ON DELETE CASCADE,
        customer_id UUID REFERENCES customers(id),
        transaction_type VARCHAR(20) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        balance_before DECIMAL(10, 2) NOT NULL,
        balance_after DECIMAL(10, 2) NOT NULL,
        merchant_id UUID,
        branch_id UUID REFERENCES branches(id),
        terminal_id VARCHAR(100),
        payment_method VARCHAR(50),
        payment_provider VARCHAR(50),
        reference_number VARCHAR(100) UNIQUE,
        description TEXT,
        metadata JSONB,
        status VARCHAR(20) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Transactions table created');

    // Create top-ups table
    await client.query(`
      CREATE TABLE top_ups (
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
      )
    `);
    console.log('✅ Top-ups table created');

    // Create audit logs table
    await client.query(`
      CREATE TABLE audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id UUID,
        changes JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Audit logs table created');

    // Create indexes
    await client.query(`
      CREATE INDEX idx_customers_email ON customers(email);
      CREATE INDEX idx_customers_phone ON customers(phone);
      CREATE INDEX idx_nfc_cards_customer_id ON nfc_cards(customer_id);
      CREATE INDEX idx_nfc_cards_card_uid ON nfc_cards(card_uid);
      CREATE INDEX idx_transactions_card_uid ON card_transactions(card_uid);
      CREATE INDEX idx_transactions_created_at ON card_transactions(created_at);
      CREATE INDEX idx_top_ups_card_uid ON top_ups(card_uid);
    `);
    console.log('✅ Indexes created');

    // Insert sample data
    console.log('🔄 Inserting sample data...');

    // Insert sample branch
    const branchResult = await client.query(`
      INSERT INTO branches (name, code, city, phone)
      VALUES ('Main Branch', 'MAIN001', 'Kampala', '+256700000000')
      RETURNING id
    `);
    const branchId = branchResult.rows[0].id;
    console.log('✅ Sample branch created');

    // Insert sample customers
    const customers = [];
    for (let i = 1; i <= 10; i++) {
      const result = await client.query(`
        INSERT INTO customers (name, email, phone, city)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, phone
      `, [
        `Customer ${i}`,
        `customer${i}@example.com`,
        `+25670000000${i}`,
        'Kampala'
      ]);
      customers.push(result.rows[0]);
    }
    console.log(`✅ ${customers.length} sample customers created`);

    // Insert NFC cards for customers
    const bcrypt = require('bcryptjs');
    const defaultPin = await bcrypt.hash('1234', 10);

    for (let i = 0; i < customers.length; i++) {
      const cardUid = `04${Math.random().toString(16).substr(2, 12).toUpperCase()}`;
      await client.query(`
        INSERT INTO nfc_cards (card_uid, customer_id, balance, pin_hash)
        VALUES ($1, $2, $3, $4)
      `, [cardUid, customers[i].id, (i + 1) * 10000, defaultPin]);
    }
    console.log(`✅ ${customers.length} NFC cards created`);

    // Insert sample transactions
    for (let i = 0; i < 20; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const cardResult = await client.query(
        'SELECT card_uid, balance FROM nfc_cards WHERE customer_id = $1',
        [customer.id]
      );

      if (cardResult.rows.length > 0) {
        const card = cardResult.rows[0];
        const amount = Math.floor(Math.random() * 5000) + 1000;
        const balanceBefore = parseFloat(card.balance);
        const balanceAfter = balanceBefore - amount;

        await client.query(`
          INSERT INTO card_transactions
          (card_uid, customer_id, transaction_type, amount, balance_before, balance_after, branch_id, reference_number)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          card.card_uid,
          customer.id,
          'purchase',
          amount,
          balanceBefore,
          balanceAfter,
          branchId,
          `TXN${Date.now()}${i}`
        ]);

        // Update card balance
        await client.query(
          'UPDATE nfc_cards SET balance = $1, last_used_at = NOW() WHERE card_uid = $2',
          [balanceAfter, card.card_uid]
        );
      }
    }
    console.log('✅ 20 sample transactions created');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📊 Summary:');
    console.log(`   - 10 customers created`);
    console.log(`   - 10 NFC cards issued`);
    console.log(`   - 20 transactions recorded`);
    console.log(`   - 1 branch created`);
    console.log('\n✅ Ready to use!');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

initDatabase();
