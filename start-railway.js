#!/usr/bin/env node

/**
 * Simplified Railway Startup Script
 * Runs the backend API server directly without PM2
 * Railway handles process management automatically
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Kiaan POS Backend API for Railway...\n');

// Start the backend server
const backend = spawn('node', ['backend/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    // Ensure PORT is passed through from Railway
    PORT: process.env.PORT || 4500,
    NODE_ENV: process.env.NODE_ENV || 'production'
  }
});

backend.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});

backend.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`❌ Backend exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`);
    process.exit(code || 1);
  }
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('📛 Received SIGTERM, shutting down gracefully...');
  backend.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📛 Received SIGINT, shutting down gracefully...');
  backend.kill('SIGINT');
});
