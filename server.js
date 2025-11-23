const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'admin-dashboard',
    url: 'http://localhost:3004'
  });
});

// Route /admin to admin dashboard
app.use('/admin', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/admin': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> admin`);
  }
}));

// Route root to admin dashboard (main page shows admin)
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> admin (root)`);
  }
}));

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 Kiaan POS Wallet System - Admin Dashboard                ║
║                                                                ║
║   Proxy Server:    http://localhost:${PORT}                        ║
║                                                                ║
║   📍 Routes:                                                   ║
║   /               → Admin Dashboard (port 3004)                ║
║   /admin          → Admin Dashboard (port 3004)                ║
║                                                                ║
║   Admin Dashboard is now on the main page!                     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
