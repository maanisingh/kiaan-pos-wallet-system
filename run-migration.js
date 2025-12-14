#!/usr/bin/env node

/**
 * Run Database Migration via API
 * This script connects to the Railway PostgreSQL and runs migrations
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://kiaan-pos-wallet-system-production.up.railway.app';

// Read the migration SQL
const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'database-new/001_add_users_table.sql'),
  'utf8'
);

console.log('🔄 Running database migration via API...\n');
console.log('Migration SQL:');
console.log('=' .repeat(60));
console.log(migrationSQL);
console.log('=' .repeat(60));
console.log('\n');

// Create migration endpoint request
const postData = JSON.stringify({
  sql: migrationSQL
});

const options = {
  hostname: 'kiaan-pos-wallet-system-production.up.railway.app',
  port: 443,
  path: '/api/admin/migrate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📡 Sending migration request to:', API_URL + '/api/admin/migrate\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📥 Response Body:', data);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Migration completed successfully!');
      console.log('\n🧪 Testing authentication...\n');
      testAuth();
    } else {
      console.log('\n⚠️  Migration endpoint not available. Using direct database connection...');
      runDirectMigration();
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.log('\n⚠️  Trying direct database connection...');
  runDirectMigration();
});

req.write(postData);
req.end();

function runDirectMigration() {
  console.log('\n📊 Running migration via direct database connection...');

  const { exec } = require('child_process');
  const migrationFile = path.join(__dirname, 'database-new/001_add_users_table.sql');

  // Try to get DATABASE_URL from environment or Railway
  exec('cat backend/.env | grep DATABASE_URL || echo "No local DATABASE_URL"', (error, stdout) => {
    if (stdout.includes('DATABASE_URL')) {
      console.log('✅ Found local DATABASE_URL');
      // Run via psql if available
      exec(`which psql`, (err, psqlPath) => {
        if (psqlPath) {
          console.log('✅ psql found, running migration...');
          exec(`psql $DATABASE_URL < ${migrationFile}`, (error, stdout, stderr) => {
            if (error) {
              console.error('❌ Migration error:', stderr);
            } else {
              console.log('✅ Migration completed!');
              console.log(stdout);
              testAuth();
            }
          });
        } else {
          console.log('⚠️  psql not found. Please run migration manually in Railway dashboard.');
          showManualInstructions();
        }
      });
    } else {
      console.log('⚠️  No DATABASE_URL found locally.');
      showManualInstructions();
    }
  });
}

function testAuth() {
  console.log('🧪 Testing login with admin@kiaan.com...\n');

  const testData = JSON.stringify({
    email: 'admin@kiaan.com',
    password: 'admin123'
  });

  const testOptions = {
    hostname: 'kiaan-pos-wallet-system-production.up.railway.app',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testData)
    }
  };

  const testReq = https.request(testOptions, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Response:', data);

      if (res.statusCode === 200) {
        console.log('\n✅ ✅ ✅ SUCCESS! Authentication is working! ✅ ✅ ✅\n');
      } else {
        console.log('\n❌ Authentication still failing. Check the response above.\n');
      }
    });
  });

  testReq.on('error', (error) => {
    console.error('Test error:', error.message);
  });

  testReq.write(testData);
  testReq.end();
}

function showManualInstructions() {
  console.log('\n' + '='.repeat(70));
  console.log('📋 MANUAL MIGRATION INSTRUCTIONS');
  console.log('='.repeat(70));
  console.log('\n1. Go to: https://railway.com/project/c6b95811-8833-4a7e-9370-b171f0aeaa7e');
  console.log('2. Click PostgreSQL → Data → Query');
  console.log('3. Copy and paste the SQL from: database-new/001_add_users_table.sql');
  console.log('4. Click "Run Query"');
  console.log('\n' + '='.repeat(70) + '\n');
}
