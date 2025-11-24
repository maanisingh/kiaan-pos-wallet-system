# 🚀 Kiaan POS - Complete NFC Payment System

A production-ready, self-hosted Point of Sale system with NFC card support, built with modern technologies.

## 📦 What's Included

### 🔧 Backend API (Node.js + Express + PostgreSQL)
- Full REST API with 25+ endpoints
- PostgreSQL database with optimized schema
- 10 sample customers with real data
- 10 NFC cards ready to use
- 20 transactions for testing
- JWT authentication ready
- Bcrypt password hashing for security

### 🖥️ Admin Dashboard (Refine + Ant Design)
- Dashboard with real-time analytics and charts
- Customer management with full drill-down
- NFC card management with transaction history
- Transaction monitoring with advanced filters
- Professional UI with Ant Design

### 📱 Mobile App (React Native + Expo)
- NFC card scanning
- Payment processing with PIN verification
- Top-up functionality with multiple payment methods
- Transaction history
- Offline capability

## 🚀 Quick Start

### Backend API
cd backend
npm install
npm run init-db
PORT=4500 node server.js

### Admin Dashboard
cd admin-dashboard
npm install
npm run dev

### Mobile App
cd mobile-app
npm install
npm start

## 📊 Features

✅ Complete drill-down functionality
✅ Real-time data updates
✅ Professional UI/UX
✅ Mobile-ready with NFC support
✅ Scalable architecture
✅ Security built-in

## 🔌 API Endpoints

- Health: http://localhost:4500/health
- Customers: http://localhost:4500/api/customers
- Cards: http://localhost:4500/api/cards
- Transactions: http://localhost:4500/api/transactions
- Dashboard Stats: http://localhost:4500/api/dashboard/stats

## 📱 Access Points

- Backend API: http://localhost:4500
- Admin Dashboard: http://localhost:5173

## 📚 Documentation

- [Demo Script](./DEMO_SCRIPT.md) - Complete demo walkthrough
- Database Schema: database/schema-simple.sql

Built with ❤️ for Kiaan POS
