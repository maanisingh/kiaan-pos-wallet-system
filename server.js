const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    services: {
      landing: 'http://localhost:3000',
      merchant: 'http://localhost:3001',
      customer: 'http://localhost:3002',
      pos: 'http://localhost:3003'
    }
  });
});

// Route to merchant dashboard
app.use('/merchant', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/merchant': '', // remove /merchant prefix when forwarding
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> merchant`);
  }
}));

// Route to customer portal
app.use('/customer', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/customer': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> customer`);
  }
}));

// Route to POS terminal
app.use('/pos', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/pos': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> pos`);
  }
}));

// Route everything else to landing page
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> landing`);
  }
}));

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Kiaan POS Wallet System - Multi-App Proxy                ║
║                                                                ║
║   Proxy Server:    http://localhost:${PORT}                        ║
║                                                                ║
║   📍 Routes:                                                   ║
║   /               → Landing Page (port 3000)                   ║
║   /merchant       → Merchant Dashboard (port 3001)             ║
║   /customer       → Customer Portal (port 3002)                ║
║   /pos            → POS Terminal (port 3003)                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
