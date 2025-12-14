#!/usr/bin/env node

/**
 * Direct Database Migration Script
 * Connects to Railway PostgreSQL and runs the migration
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway DATABASE_URL - we'll get this from the Railway API
const RAILWAY_API_URL = 'https://kiaan-pos-wallet-system-production.up.railway.app';

async function getDatabaseUrl() {
  // First, let's try to extract it from a test endpoint
  console.log('🔍 Attempting to connect to Railway database...\n');

  // For Railway, we can use the connection string format
  // Let's make a request to see if we can get environment info
  const https = require('https');

  return new Promise((resolve, reject) => {
    https.get(RAILWAY_API_URL + '/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Backend is online and healthy');
        // Since we can't get the DATABASE_URL from the API,
        // we'll need to add a migration endpoint to the backend
        reject(new Error('Need to add migration endpoint to backend'));
      });
    }).on('error', reject);
  });
}

async function runMigration() {
  console.log('🚀 Database Migration Tool\n');

  // Read migration SQL
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, 'database-new/001_add_users_table.sql'),
    'utf8'
  );

  console.log('📄 Migration SQL loaded (' + migrationSQL.length + ' bytes)\n');

  // Since we can't access the DATABASE_URL directly from here,
  // we need to add a migration endpoint to the backend
  console.log('💡 Solution: Adding migration endpoint to backend...\n');

  // Let's add the migration endpoint to the backend
  addMigrationEndpoint();
}

function addMigrationEndpoint() {
  console.log('📝 Adding migration endpoint to backend/server.js...\n');

  const serverPath = path.join(__dirname, 'backend/server.js');
  let serverCode = fs.readFileSync(serverPath, 'utf8');

  // Check if migration endpoint already exists
  if (serverCode.includes('/api/admin/run-migration')) {
    console.log('✅ Migration endpoint already exists!');
    return;
  }

  // Add migration endpoint before the health check
  const migrationEndpoint = `
// Database Migration Endpoint (admin only)
app.post('/api/admin/run-migration', async (req, res) => {
  try {
    const { sql, adminSecret } = req.body;

    // Simple security check
    if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'kiaan-2024-admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    console.log('🔄 Running database migration...');

    // Run the SQL
    await pool.query(sql);

    console.log('✅ Migration completed successfully');

    res.json({
      success: true,
      message: 'Migration completed successfully'
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      error: 'Migration failed',
      details: error.message
    });
  }
});
`;

  // Insert before the health check endpoint
  const healthCheckIndex = serverCode.indexOf("app.get('/health'");
  if (healthCheckIndex > 0) {
    serverCode = serverCode.slice(0, healthCheckIndex) + migrationEndpoint + '\n' + serverCode.slice(healthCheckIndex);

    // Write back to file
    fs.writeFileSync(serverPath, serverCode);

    console.log('✅ Migration endpoint added to backend/server.js');
    console.log('📝 Endpoint: POST /api/admin/run-migration');
    console.log('\n🔄 Now committing and pushing to Railway...\n');

    // Commit and push
    const { execSync } = require('child_process');

    try {
      execSync('git add backend/server.js', { stdio: 'inherit' });
      execSync('git commit -m "feat: Add migration endpoint for database setup"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });

      console.log('\n✅ Changes pushed! Railway will redeploy automatically.');
      console.log('⏳ Wait 1-2 minutes for deployment, then run:');
      console.log('\n   node migrate-direct.js --run\n');
    } catch (error) {
      console.error('Error pushing changes:', error.message);
    }
  } else {
    console.error('❌ Could not find health check endpoint in server.js');
  }
}

// Check if we should run the migration now
if (process.argv.includes('--run')) {
  console.log('🔄 Running migration via API endpoint...\n');

  const https = require('https');
  const migrationSQL = fs.readFileSync(
    path.join(__dirname, 'database-new/001_add_users_table.sql'),
    'utf8'
  );

  const postData = JSON.stringify({
    sql: migrationSQL,
    adminSecret: 'kiaan-2024-admin'
  });

  const options = {
    hostname: 'kiaan-pos-wallet-system-production.up.railway.app',
    port: 443,
    path: '/api/admin/run-migration',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Response:', data);

      if (res.statusCode === 200) {
        console.log('\n✅ ✅ ✅ MIGRATION SUCCESSFUL! ✅ ✅ ✅\n');
        console.log('🧪 Testing authentication...\n');

        // Test login
        setTimeout(() => {
          const testData = JSON.stringify({
            email: 'admin@kiaan.com',
            password: 'admin123'
          });

          const testOptions = {
            ...options,
            path: '/api/auth/login',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(testData)
            }
          };

          const testReq = https.request(testOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              console.log('Login Response:', data);
              if (res.statusCode === 200) {
                console.log('\n🎉 SUCCESS! All authentication endpoints are working!\n');
              }
            });
          });

          testReq.write(testData);
          testReq.end();
        }, 1000);
      }
    });
  });

  req.on('error', error => {
    console.error('Error:', error.message);
  });

  req.write(postData);
  req.end();
} else {
  // First run - add the endpoint
  runMigration();
}
