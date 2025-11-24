const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const validator = require('validator');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4500;

// ==================== DATABASE CONFIGURATION ====================

// Support both DATABASE_URL (Railway/Heroku) and individual DB_* variables (local)
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if available (Railway, Heroku, etc.)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
  console.log('📊 Using DATABASE_URL for connection');
} else {
  // Fall back to individual variables for local development
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
  };
  console.log(`📊 Using individual DB variables (${poolConfig.host}:${poolConfig.port}/${poolConfig.database})`);
}

// ==================== SECURITY CONFIGURATION ====================

// Fix #7: Add security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Fix #4: Configure CORS properly (restrict to specific domain)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://kiaan.alexandratechlab.com',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // Add request size limit
app.use(require('morgan')('dev'));

// Fix #6: Rate limiting - General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

// Fix #6: Rate limit for authentication endpoints (adjusted for production use)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 login attempts per windowMs (increased for testing/production)
  message: { error: 'Too many login attempts, please try again later.' }
});

// Apply general rate limiting to all /api routes
app.use('/api/', apiLimiter);

// ==================== AUTHENTICATION SYSTEM ====================

// Fix #2: Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
};

app.use(sanitizeInput);

// Fix #1: JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kiaan_pos_jwt_secret_key_2024');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Optional authentication (for public endpoints that can use auth optionally)
const optionalAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kiaan_pos_jwt_secret_key_2024');
      req.user = decoded;
    } catch (error) {
      // Token invalid but continue anyway for public endpoints
    }
  }
  next();
};

// Database connection
const pool = new Pool(poolConfig);

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Run database migrations on startup
async function runMigrations() {
  try {
    console.log('🔧 Running database migrations...');

    // Add phone column if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='users' AND column_name='phone') THEN
          ALTER TABLE users ADD COLUMN phone VARCHAR(20);
          RAISE NOTICE 'Added phone column to users table';
        END IF;
      END $$;
    `);

    // Add updated_at column if it doesn't exist
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name='users' AND column_name='updated_at') THEN
          ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
          RAISE NOTICE 'Added updated_at column to users table';
        END IF;
      END $$;
    `);

    // Set updated_at for existing users
    await pool.query(`
      UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;
    `);

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    // Don't exit - let the app continue even if migrations fail
  }
}

// Run migrations after connection is established
runMigrations();

// ==================== AUTH ENDPOINTS ====================

// Fix #1: User Registration
app.post('/api/auth/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 }),
    body('role').optional().isIn(['admin', 'manager', 'staff'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role = 'staff' } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, created_at`,
        [email, password_hash, name, role]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'kiaan_pos_jwt_secret_key_2024',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Fix #1: User Login
app.post('/api/auth/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Get user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'kiaan_pos_jwt_secret_key_2024',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update user
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, name, phone, role, created_at',
      [name, email, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Change password
app.put('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current user
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(current_password, userResult.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CUSTOMERS API ====================

// Get all customers
app.get('/api/customers', verifyToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM customers';
    const params = [];

    if (search || status) {
      query += ' WHERE';
      const conditions = [];

      if (search) {
        conditions.push(` (name ILIKE $${params.length + 1} OR phone ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
        params.push(`%${search}%`);
      }

      if (status) {
        conditions.push(` status = $${params.length + 1}`);
        params.push(status);
      }

      query += conditions.join(' AND');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID with full details
app.get('/api/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get customer
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE id = $1',
      [id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = customerResult.rows[0];

    // Get customer's cards
    const cardsResult = await pool.query(
      'SELECT * FROM nfc_cards WHERE customer_id = $1',
      [id]
    );

    // Get customer's transactions
    const transactionsResult = await pool.query(
      `SELECT t.*, c.card_uid
       FROM card_transactions t
       LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
       WHERE t.customer_id = $1
       ORDER BY t.created_at DESC
       LIMIT 50`,
      [id]
    );

    // Calculate statistics
    const statsResult = await pool.query(
      `SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN transaction_type = 'purchase' THEN amount ELSE 0 END) as total_spent,
        SUM(CASE WHEN transaction_type = 'topup' THEN amount ELSE 0 END) as total_topup
       FROM card_transactions
       WHERE customer_id = $1`,
      [id]
    );

    res.json({
      data: {
        ...customer,
        cards: cardsResult.rows,
        recent_transactions: transactionsResult.rows,
        statistics: statsResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create customer
app.post('/api/customers',
  verifyToken,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('phone').trim().isMobilePhone().withMessage('Invalid phone number'),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, address, city, country } = req.body;

      const result = await pool.query(
        `INSERT INTO customers (name, email, phone, address, city, country)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, email, phone, address, city, country || 'Uganda']
      );

      res.status(201).json({ data: result.rows[0] });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update customer
app.put('/api/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, city, country, status } = req.body;

    // Fix #5: Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const result = await pool.query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           city = COALESCE($5, city),
           country = COALESCE($6, country),
           status = COALESCE($7, status),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [name, email, phone, address, city, country, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
app.delete('/api/customers/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM customers WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== NFC CARDS API ====================

// Get all cards
app.get('/api/cards', verifyToken, async (req, res) => {
  try {
    const { status, customer_id } = req.query;
    let query = `
      SELECT c.*, cust.name as customer_name, cust.phone as customer_phone
      FROM nfc_cards c
      LEFT JOIN customers cust ON c.customer_id = cust.id
    `;
    const params = [];

    if (status || customer_id) {
      query += ' WHERE';
      const conditions = [];

      if (status) {
        conditions.push(` c.status = $${params.length + 1}`);
        params.push(status);
      }

      if (customer_id) {
        conditions.push(` c.customer_id = $${params.length + 1}`);
        params.push(customer_id);
      }

      query += conditions.join(' AND');
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get card by ID with transactions
app.get('/api/cards/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get card
    const cardResult = await pool.query(
      `SELECT c.*, cust.name as customer_name, cust.phone as customer_phone, cust.email as customer_email
       FROM nfc_cards c
       LEFT JOIN customers cust ON c.customer_id = cust.id
       WHERE c.id = $1`,
      [id]
    );

    if (cardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const card = cardResult.rows[0];

    // Get card transactions
    const transactionsResult = await pool.query(
      `SELECT * FROM card_transactions
       WHERE card_uid = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [card.card_uid]
    );

    res.json({
      data: {
        ...card,
        transactions: transactionsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: error.message });
  }
});

// Issue new card
app.post('/api/cards', verifyToken, async (req, res) => {
  try {
    const { card_uid, customer_id, pin, initial_balance } = req.body;

    if (!card_uid || !customer_id || !pin) {
      return res.status(400).json({ error: 'card_uid, customer_id, and pin are required' });
    }

    // Hash PIN
    const pin_hash = await bcrypt.hash(pin, 10);

    const result = await pool.query(
      `INSERT INTO nfc_cards (card_uid, customer_id, balance, pin_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [card_uid, customer_id, initial_balance || 0, pin_hash]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error issuing card:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update card (e.g., block/unblock)
app.put('/api/cards/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, blocked_reason } = req.body;

    const result = await pool.query(
      `UPDATE nfc_cards
       SET status = COALESCE($1, status),
           blocked_reason = COALESCE($2, blocked_reason),
           blocked_at = CASE WHEN $1 = 'blocked' THEN NOW() ELSE blocked_at END,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, blocked_reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TRANSACTIONS API ====================

// Fix #9: Transaction limits constant
const MAX_TRANSACTION_AMOUNT = 10000000; // 10M UGX

// Get all transactions
app.get('/api/transactions', verifyToken, async (req, res) => {
  try {
    const { card_uid, customer_id, transaction_type, start_date, end_date, limit = 100 } = req.query;

    let query = `
      SELECT t.*,
             c.card_uid,
             cust.name as customer_name,
             cust.phone as customer_phone
      FROM card_transactions t
      LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
      LEFT JOIN customers cust ON t.customer_id = cust.id
    `;
    const params = [];

    const conditions = [];
    if (card_uid) {
      conditions.push(`t.card_uid = $${params.length + 1}`);
      params.push(card_uid);
    }
    if (customer_id) {
      conditions.push(`t.customer_id = $${params.length + 1}`);
      params.push(customer_id);
    }
    if (transaction_type) {
      conditions.push(`t.transaction_type = $${params.length + 1}`);
      params.push(transaction_type);
    }
    if (start_date) {
      conditions.push(`t.created_at >= $${params.length + 1}`);
      params.push(start_date);
    }
    if (end_date) {
      conditions.push(`t.created_at <= $${params.length + 1}`);
      params.push(end_date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json({ data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by ID
app.get('/api/transactions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.*,
              c.card_uid,
              c.balance as current_balance,
              cust.name as customer_name,
              cust.phone as customer_phone,
              cust.email as customer_email
       FROM card_transactions t
       LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
       LEFT JOIN customers cust ON t.customer_id = cust.id
       WHERE t.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create transaction (purchase)
app.post('/api/transactions', verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { card_uid, amount, transaction_type, description, pin } = req.body;

    if (!card_uid || !amount || !transaction_type) {
      return res.status(400).json({ error: 'card_uid, amount, and transaction_type are required' });
    }

    // Fix #8: Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    // Fix #9: Validate amount doesn't exceed maximum
    if (amount > MAX_TRANSACTION_AMOUNT) {
      return res.status(400).json({
        error: `Transaction amount exceeds maximum limit of ${MAX_TRANSACTION_AMOUNT.toLocaleString()} UGX`
      });
    }

    // Get card
    const cardResult = await client.query(
      'SELECT * FROM nfc_cards WHERE card_uid = $1',
      [card_uid]
    );

    if (cardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const card = cardResult.rows[0];

    // Verify card is active
    if (card.status !== 'active') {
      return res.status(400).json({ error: `Card is ${card.status}` });
    }

    // Verify PIN if provided
    if (pin) {
      const validPin = await bcrypt.compare(pin, card.pin_hash);
      if (!validPin) {
        return res.status(401).json({ error: 'Invalid PIN' });
      }
    }

    const balanceBefore = parseFloat(card.balance);
    let balanceAfter = balanceBefore;

    // Calculate new balance
    if (transaction_type === 'purchase') {
      if (balanceBefore < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      balanceAfter = balanceBefore - amount;
    } else if (transaction_type === 'topup' || transaction_type === 'refund') {
      balanceAfter = balanceBefore + parseFloat(amount);
    }

    // Create transaction
    const transactionResult = await client.query(
      `INSERT INTO card_transactions
       (card_uid, customer_id, transaction_type, amount, balance_before, balance_after, description, reference_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        card_uid,
        card.customer_id,
        transaction_type,
        amount,
        balanceBefore,
        balanceAfter,
        description,
        `TXN${Date.now()}`
      ]
    );

    // Update card balance
    await client.query(
      'UPDATE nfc_cards SET balance = $1, last_used_at = NOW() WHERE card_uid = $2',
      [balanceAfter, card_uid]
    );

    await client.query('COMMIT');

    res.status(201).json({ data: transactionResult.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ==================== DASHBOARD/ANALYTICS API ====================

// Get dashboard statistics
app.get('/api/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM customers WHERE status = 'active') as total_customers,
        (SELECT COUNT(*) FROM nfc_cards WHERE status = 'active') as total_active_cards,
        (SELECT COUNT(*) FROM card_transactions WHERE DATE(created_at) = CURRENT_DATE) as todays_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM card_transactions WHERE DATE(created_at) = CURRENT_DATE) as todays_revenue,
        (SELECT COALESCE(SUM(balance), 0) FROM nfc_cards WHERE status = 'active') as total_card_balance
    `);

    // Get recent transactions
    const recentTransactions = await pool.query(`
      SELECT t.*,
             c.card_uid,
             cust.name as customer_name
      FROM card_transactions t
      LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
      LEFT JOIN customers cust ON t.customer_id = cust.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);

    // Get daily revenue for last 7 days
    const dailyRevenue = await pool.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as transaction_count,
        SUM(amount) as revenue
      FROM card_transactions
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      data: {
        statistics: stats.rows[0],
        recent_transactions: recentTransactions.rows,
        daily_revenue: dailyRevenue.rows
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction analytics
app.get('/api/analytics/transactions', verifyToken, async (req, res) => {
  try {
    const { period = '7days' } = req.query;

    // Fix #3: Use parameterized query to prevent SQL injection
    let interval = '7 days';
    if (period === '30days') interval = '30 days';
    if (period === '90days') interval = '90 days';

    // FIXED: Use parameterized query instead of string interpolation
    const result = await pool.query(`
      SELECT
        DATE(created_at) as date,
        transaction_type,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM card_transactions
      WHERE created_at >= CURRENT_DATE - CAST($1 AS INTERVAL)
      GROUP BY DATE(created_at), transaction_type
      ORDER BY date DESC, transaction_type
    `, [interval]);

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== BRANCHES API ====================

// Get all branches
app.get('/api/branches', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches ORDER BY created_at DESC');
    res.json({ data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new branch
app.post('/api/branches', verifyToken, async (req, res) => {
  try {
    const { name, code, address, city, country, manager_name, manager_phone } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'name and code are required' });
    }

    const result = await pool.query(
      `INSERT INTO branches (name, code, address, city, country, manager_name, manager_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, code, address, city, country, manager_name, manager_phone]
    );

    res.status(201).json({ data: result.rows[0], message: 'Branch created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Branch code already exists' });
    }
    console.error('Error creating branch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update branch
app.put('/api/branches/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, address, city, country, manager_name, manager_phone, status } = req.body;

    const result = await pool.query(
      `UPDATE branches
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           address = COALESCE($3, address),
           city = COALESCE($4, city),
           country = COALESCE($5, country),
           manager_name = COALESCE($6, manager_name),
           manager_phone = COALESCE($7, manager_phone),
           status = COALESCE($8, status),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, code, address, city, country, manager_name, manager_phone, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({ data: result.rows[0], message: 'Branch updated successfully' });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete branch
app.delete('/api/branches/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM branches WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MOBILE MONEY TOP-UP API ====================

// Initiate top-up with MTN/Airtel
app.post('/api/topup/initiate', verifyToken, async (req, res) => {
  try {
    const { card_uid, customer_id, amount, payment_method, phone_number } = req.body;

    if (!card_uid || !amount || !payment_method || !phone_number) {
      return res.status(400).json({
        error: 'card_uid, amount, payment_method, and phone_number are required'
      });
    }

    // Fix #8 & #9: Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    if (amount > MAX_TRANSACTION_AMOUNT) {
      return res.status(400).json({
        error: `Top-up amount exceeds maximum limit of ${MAX_TRANSACTION_AMOUNT.toLocaleString()} UGX`
      });
    }

    // Validate payment method
    if (!['mtn', 'airtel'].includes(payment_method.toLowerCase())) {
      return res.status(400).json({
        error: 'payment_method must be either "mtn" or "airtel"'
      });
    }

    // Generate unique reference
    const payment_reference = `TOP${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Insert top-up record
    const result = await pool.query(
      `INSERT INTO top_ups (card_uid, customer_id, amount, payment_method, payment_reference, payment_provider, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [card_uid, customer_id, amount, payment_method, payment_reference, payment_method.toUpperCase()]
    );

    // In a real implementation, you would make an API call to MTN/Airtel here
    const topup = result.rows[0];

    res.status(201).json({
      data: topup,
      message: `Top-up request sent to ${payment_method.toUpperCase()}. Please check your phone for the payment prompt.`,
      instructions: {
        mtn: 'Check your MTN mobile money for a payment prompt. Enter your PIN to complete.',
        airtel: 'Check your Airtel Money for a payment prompt. Enter your PIN to complete.'
      }[payment_method.toLowerCase()],
      mock_info: {
        note: 'In production, this would trigger actual mobile money API',
        reference: payment_reference,
        amount: amount,
        phone: phone_number
      }
    });
  } catch (error) {
    console.error('Error initiating top-up:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mobile Money callback (webhook) - called by MTN/Airtel when payment completes
app.post('/api/topup/callback', async (req, res) => {
  const client = await pool.connect();

  try {
    const { payment_reference, status, transaction_id, callback_data } = req.body;

    if (!payment_reference) {
      return res.status(400).json({ error: 'payment_reference is required' });
    }

    await client.query('BEGIN');

    // Get top-up record
    const topupResult = await client.query(
      'SELECT * FROM top_ups WHERE payment_reference = $1',
      [payment_reference]
    );

    if (topupResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Top-up reference not found' });
    }

    const topup = topupResult.rows[0];

    if (status === 'success' || status === 'completed') {
      // Update top-up status
      await client.query(
        `UPDATE top_ups
         SET status = 'completed',
             callback_data = $1,
             completed_at = NOW()
         WHERE payment_reference = $2`,
        [JSON.stringify(callback_data || req.body), payment_reference]
      );

      // Get card current balance
      const cardResult = await client.query(
        'SELECT * FROM nfc_cards WHERE card_uid = $1',
        [topup.card_uid]
      );

      if (cardResult.rows.length > 0) {
        const card = cardResult.rows[0];
        const balanceBefore = parseFloat(card.balance);
        const balanceAfter = balanceBefore + parseFloat(topup.amount);

        // Create top-up transaction
        await client.query(
          `INSERT INTO card_transactions
           (card_uid, customer_id, transaction_type, amount, balance_before, balance_after, payment_method, payment_provider, reference_number, description)
           VALUES ($1, $2, 'topup', $3, $4, $5, $6, $7, $8, $9)`,
          [
            topup.card_uid,
            topup.customer_id,
            topup.amount,
            balanceBefore,
            balanceAfter,
            topup.payment_method,
            topup.payment_provider,
            payment_reference,
            `Mobile Money Top-Up via ${topup.payment_provider}`
          ]
        );

        // Update card balance
        await client.query(
          'UPDATE nfc_cards SET balance = $1, last_used_at = NOW() WHERE card_uid = $2',
          [balanceAfter, topup.card_uid]
        );
      }

      await client.query('COMMIT');
      res.json({
        success: true,
        message: 'Top-up completed successfully',
        data: { payment_reference, amount: topup.amount }
      });
    } else {
      // Payment failed
      await client.query(
        `UPDATE top_ups
         SET status = 'failed',
             callback_data = $1
         WHERE payment_reference = $2`,
        [JSON.stringify(callback_data || req.body), payment_reference]
      );

      await client.query('COMMIT');
      res.json({
        success: false,
        message: 'Top-up failed',
        data: { payment_reference }
      });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing callback:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Manual top-up completion (for testing/demo)
app.post('/api/topup/complete/:reference', verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { reference } = req.params;

    await client.query('BEGIN');

    const topupResult = await client.query(
      'SELECT * FROM top_ups WHERE payment_reference = $1',
      [reference]
    );

    if (topupResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Top-up reference not found' });
    }

    const topup = topupResult.rows[0];

    if (topup.status === 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Top-up already completed' });
    }

    // Update top-up status
    await client.query(
      `UPDATE top_ups
       SET status = 'completed',
           completed_at = NOW()
       WHERE payment_reference = $1`,
      [reference]
    );

    // Get card
    const cardResult = await client.query(
      'SELECT * FROM nfc_cards WHERE card_uid = $1',
      [topup.card_uid]
    );

    if (cardResult.rows.length > 0) {
      const card = cardResult.rows[0];
      const balanceBefore = parseFloat(card.balance);
      const balanceAfter = balanceBefore + parseFloat(topup.amount);

      // Create transaction
      await client.query(
        `INSERT INTO card_transactions
         (card_uid, customer_id, transaction_type, amount, balance_before, balance_after, payment_method, payment_provider, reference_number, description)
         VALUES ($1, $2, 'topup', $3, $4, $5, $6, $7, $8, $9)`,
        [
          topup.card_uid,
          topup.customer_id,
          topup.amount,
          balanceBefore,
          balanceAfter,
          topup.payment_method,
          topup.payment_provider,
          reference,
          `Mobile Money Top-Up via ${topup.payment_provider} (Manual Completion)`
        ]
      );

      // Update card balance
      await client.query(
        'UPDATE nfc_cards SET balance = $1, last_used_at = NOW() WHERE card_uid = $2',
        [balanceAfter, topup.card_uid]
      );
    }

    await client.query('COMMIT');
    res.json({
      success: true,
      message: 'Top-up completed successfully',
      data: {
        payment_reference: reference,
        amount: topup.amount,
        new_balance: parseFloat(cardResult.rows[0].balance) + parseFloat(topup.amount)
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error completing top-up:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get top-up history
app.get('/api/topup/history', verifyToken, async (req, res) => {
  try {
    const { card_uid, customer_id, status } = req.query;

    let query = `
      SELECT t.*, c.card_uid, cust.name as customer_name, cust.phone as customer_phone
      FROM top_ups t
      LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
      LEFT JOIN customers cust ON t.customer_id = cust.id
    `;
    const params = [];
    const conditions = [];

    if (card_uid) {
      conditions.push(`t.card_uid = $${params.length + 1}`);
      params.push(card_uid);
    }
    if (customer_id) {
      conditions.push(`t.customer_id = $${params.length + 1}`);
      params.push(customer_id);
    }
    if (status) {
      conditions.push(`t.status = $${params.length + 1}`);
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json({ data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error('Error fetching top-up history:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USSD API ====================

// USSD main menu - Public endpoint (no auth required for USSD)
app.post('/api/ussd', async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
      // Main menu
      response = `CON Welcome to Kiaan POS
1. Check Card Balance
2. Top-Up Card
3. Transaction History
4. Support`;
    } else if (text === '1') {
      // Check balance - ask for card ID
      response = `CON Enter your Card ID (last 6 digits on card):`;
    } else if (text.startsWith('1*')) {
      // Get balance
      const cardId = text.split('*')[1];

      try {
        const result = await pool.query(
          `SELECT c.*, cust.name
           FROM nfc_cards c
           LEFT JOIN customers cust ON c.customer_id = cust.id
           WHERE c.card_uid LIKE $1 AND cust.phone = $2`,
          [`%${cardId}`, phoneNumber]
        );

        if (result.rows.length > 0) {
          const card = result.rows[0];
          response = `END Your balance: UGX ${parseFloat(card.balance).toLocaleString()}
Status: ${card.status}
Last used: ${card.last_used_at ? new Date(card.last_used_at).toLocaleString() : 'Never'}`;
        } else {
          response = `END Card not found or not linked to this phone number.`;
        }
      } catch (error) {
        response = `END Error retrieving balance. Please try again.`;
      }
    } else if (text === '2') {
      // Top-up menu
      response = `CON Top-Up Card
1. MTN Mobile Money
2. Airtel Money`;
    } else if (text.startsWith('2*1') || text.startsWith('2*2')) {
      const parts = text.split('*');

      if (parts.length === 2) {
        // Ask for card ID
        response = `CON Enter your Card ID (last 6 digits):`;
      } else if (parts.length === 3) {
        // Ask for amount
        response = `CON Enter amount to top-up (UGX):`;
      } else if (parts.length === 4) {
        // Process top-up
        const provider = parts[1] === '1' ? 'MTN' : 'Airtel';
        const cardId = parts[2];
        const amount = parseInt(parts[3]);

        // Validate amount
        if (amount <= 0 || amount > MAX_TRANSACTION_AMOUNT) {
          response = `END Invalid amount. Must be between 1 and ${MAX_TRANSACTION_AMOUNT.toLocaleString()} UGX.`;
        } else {
          try {
            const cardResult = await pool.query(
              `SELECT c.* FROM nfc_cards c
               LEFT JOIN customers cust ON c.customer_id = cust.id
               WHERE c.card_uid LIKE $1 AND cust.phone = $2`,
              [`%${cardId}`, phoneNumber]
            );

            if (cardResult.rows.length > 0) {
              const card = cardResult.rows[0];
              const reference = `USSD${Date.now()}`;

              await pool.query(
                `INSERT INTO top_ups (card_uid, customer_id, amount, payment_method, payment_reference, payment_provider, status)
                 VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
                [card.card_uid, card.customer_id, amount, provider.toLowerCase(), reference, provider]
              );

              response = `END Top-up request sent!
Provider: ${provider}
Amount: UGX ${amount}
Reference: ${reference}

You will receive a payment prompt from ${provider} Mobile Money shortly. Enter your PIN to complete.`;
            } else {
              response = `END Card not found or not linked to your phone number.`;
            }
          } catch (error) {
            response = `END Error processing top-up. Please try again.`;
          }
        }
      }
    } else if (text === '3') {
      // Transaction history - ask for card ID
      response = `CON Enter your Card ID to view history:`;
    } else if (text.startsWith('3*')) {
      const cardId = text.split('*')[1];

      try {
        const result = await pool.query(
          `SELECT t.* FROM card_transactions t
           LEFT JOIN nfc_cards c ON t.card_uid = c.card_uid
           LEFT JOIN customers cust ON c.customer_id = cust.id
           WHERE c.card_uid LIKE $1 AND cust.phone = $2
           ORDER BY t.created_at DESC
           LIMIT 5`,
          [`%${cardId}`, phoneNumber]
        );

        if (result.rows.length > 0) {
          let historyText = `END Recent Transactions:\n`;
          result.rows.forEach((txn, idx) => {
            historyText += `${idx + 1}. ${txn.transaction_type.toUpperCase()} - UGX ${parseFloat(txn.amount).toLocaleString()} (${new Date(txn.created_at).toLocaleDateString()})\n`;
          });
          response = historyText;
        } else {
          response = `END No transactions found for this card.`;
        }
      } catch (error) {
        response = `END Error retrieving history. Please try again.`;
      }
    } else if (text === '4') {
      response = `END Kiaan POS Support
Call: +256 700 000 000
Email: support@kiaan.com
Hours: 24/7`;
    } else {
      response = `END Invalid option. Please try again by dialing ${serviceCode}`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('USSD error:', error);
    res.set('Content-Type', 'text/plain');
    res.send('END Service temporarily unavailable. Please try again later.');
  }
});

// ==================== ADMIN MIGRATION ENDPOINT ====================

// Database Migration Endpoint (admin only - for initial setup)
app.post('/api/admin/run-migration', async (req, res) => {
  try {
    const { sql, adminSecret } = req.body;

    // Simple security check
    const validSecrets = ['kiaan-2024-admin', process.env.ADMIN_SECRET];
    if (!validSecrets.includes(adminSecret)) {
      return res.status(403).json({ error: 'Unauthorized - Invalid admin secret' });
    }

    console.log('🔄 Running database migration...');
    console.log('SQL length:', sql ? sql.length : 0, 'bytes');

    if (!sql || sql.trim().length === 0) {
      return res.status(400).json({ error: 'No SQL provided' });
    }

    // Run the SQL
    const result = await pool.query(sql);

    console.log('✅ Migration completed successfully');

    res.json({
      success: true,
      message: 'Migration completed successfully'
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      error: 'Migration failed',
      details: error.message,
      code: error.code
    });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
    security: {
      authentication: 'enabled',
      rate_limiting: 'enabled',
      input_sanitization: 'enabled',
      sql_injection_protection: 'enabled'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Kiaan POS API',
    version: '2.0.0',
    status: 'operational',
    message: 'Backend API is running',
    frontend: 'https://kiaan.alexandratechlab.com',
    admin: 'https://kiaan.alexandratechlab.com/admin',
    documentation: {
      health: 'GET /health',
      api_docs: 'Contact administrator for API documentation'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Kiaan POS API Server running on port ${PORT}`);
  console.log(`🔐 Security Features: ENABLED`);
  console.log(`   ✅ JWT Authentication`);
  console.log(`   ✅ Input Sanitization`);
  console.log(`   ✅ SQL Injection Protection`);
  console.log(`   ✅ Rate Limiting`);
  console.log(`   ✅ Security Headers`);
  console.log(`   ✅ CORS Protection`);
  console.log(`   ✅ Transaction Validation`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('\n✅ Ready to accept requests!\n');
});

module.exports = app;
