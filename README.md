# Kiaan Closed-Loop POS & Digital Wallet System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB)](https://reactnative.dev/)
[![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131)](https://tauri.app/)

A complete, modern, open-source closed-loop payment ecosystem for retail businesses. Built with the latest web technologies and deployed to GitHub + Railway.

---

## 🚀 Features

### Admin Web Dashboard
- 📊 **Real-time Analytics** - Live transaction monitoring and dashboard
- 💳 **Card Management** - Issue, activate, deactivate cards
- 👥 **Customer Management** - Full customer lifecycle management
- 🏢 **Multi-Branch Support** - Centralized management across all locations
- 📈 **Advanced Reporting** - Daily, weekly, monthly financial reports
- 🔐 **Role-Based Access Control** - Admin, Branch Manager, Cashier roles
- 🎨 **Modern UI** - Built with Next.js 15 + shadcn/ui

### POS Terminal Application
- 💻 **Desktop App** - Native Windows/Mac/Linux support via Tauri v2
- 📱 **NFC Card Reading** - Tap-to-pay functionality
- ⚡ **Offline Mode** - Queue transactions when internet is down
- 🖨️ **Receipt Printing** - Thermal printer integration
- 🔒 **PIN Verification** - Secure customer authentication
- 🚀 **Fast & Lightweight** - Only 3MB app size (vs 150MB with Electron)

### Customer Mobile App
- 📱 **Native iOS & Android** - Built with Expo + React Native
- 💰 **Digital Wallet** - Check balance, view transactions
- 💳 **Mobile Top-Ups** - MTN & Airtel Money integration
- 📊 **Transaction History** - Full spending analytics
- 🔔 **Push Notifications** - Real-time balance updates
- 🎨 **Beautiful UI** - Modern design with Tamagui

---

## 🏗️ Tech Stack

### Frontend
- **Admin Dashboard:** Next.js 15 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **POS Terminal:** Tauri v2 + React + TypeScript + Tailwind CSS
- **Mobile App:** Expo 52 + React Native + Tamagui + TypeScript

### Backend
- **Database:** Supabase (PostgreSQL)
- **APIs:** Auto-generated REST + GraphQL APIs
- **Auth:** Supabase Auth with Row-Level Security
- **Real-time:** Supabase Realtime (WebSocket subscriptions)
- **Edge Functions:** Deno-based serverless functions

### DevOps
- **Monorepo:** Turborepo + pnpm workspaces
- **Linting:** Biome (10-20x faster than ESLint)
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions
- **Deployment:** Railway + EAS Build (Expo)

---

## 📁 Project Structure

```
kiaan-pos-wallet-system/
├── apps/
│   ├── admin/              # Next.js 15 admin dashboard
│   ├── pos/                # Tauri v2 POS terminal
│   ├── mobile/             # Expo React Native app
│   └── docs/               # Documentation site
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── database/           # Supabase client + types
│   ├── config/             # Shared configs
│   ├── utils/              # Shared utilities
│   └── types/              # TypeScript types
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge functions
│   └── seed.sql            # Seed data
├── .github/
│   └── workflows/          # CI/CD pipelines
├── turbo.json              # Turborepo config
├── pnpm-workspace.yaml     # pnpm workspace
├── biome.json              # Biome config
└── README.md
```

---

## 🚦 Quick Start

### Prerequisites
- Node.js 22+
- pnpm 9+
- Docker (for local Supabase)
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/kiaan-pos-wallet-system.git
cd kiaan-pos-wallet-system
```

### 2. Install Dependencies

```bash
# Install pnpm globally
npm install -g pnpm@9

# Install all dependencies
pnpm install
```

### 3. Setup Supabase

```bash
# Install Supabase CLI
pnpm add -g supabase

# Start local Supabase (requires Docker)
supabase start

# Apply migrations
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > packages/database/src/types.ts
```

### 4. Configure Environment Variables

```bash
# Copy example env files
cp apps/admin/.env.example apps/admin/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp apps/pos/.env.example apps/pos/.env

# Update with your Supabase credentials
# (Get from `supabase status` output)
```

### 5. Run Development Servers

```bash
# Run all apps concurrently
pnpm dev

# Or run individually
pnpm dev --filter=admin    # Admin dashboard on http://localhost:3000
pnpm dev --filter=mobile   # Mobile app with Expo
pnpm dev --filter=pos      # POS terminal
```

### 6. Build for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=admin
```

---

## 📚 Documentation

- **[Frontend Plan](./FRONTEND_PLAN.md)** - Complete UI/UX specifications
- **[Advanced Tech Stack](./ADVANCED_TECH_STACK.md)** - Detailed technology choices
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Step-by-step code examples
- **[API Documentation](./docs/API.md)** - Backend API reference
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Railway + GitHub setup

---

## 🌐 System Architecture

```
┌─────────────────┐
│  Admin Dashboard│ (Next.js)
│  localhost:3000 │
└────────┬────────┘
         │
         │  HTTPS
         ▼
┌─────────────────────────────────┐
│      Supabase Backend           │
│  - PostgreSQL Database          │
│  - REST/GraphQL APIs            │
│  - Real-time Subscriptions      │
│  - Authentication & RLS         │
└────────┬──────────┬─────────────┘
         │          │
    HTTPS│          │HTTPS
         │          │
┌────────▼─────┐   ┌▼────────────┐
│ POS Terminal │   │ Mobile App  │
│   (Tauri)    │   │   (Expo)    │
│  + NFC Reader│   │  + MTN/Airtel│
└──────────────┘   └─────────────┘
```

---

## 🔧 Key Commands

```bash
# Development
pnpm dev                    # Run all apps
pnpm dev --filter=admin     # Run admin only
pnpm dev --filter=mobile    # Run mobile only

# Building
pnpm build                  # Build all
pnpm build --filter=admin   # Build admin only

# Testing
pnpm test                   # Run all tests
pnpm test:watch             # Watch mode

# Linting
pnpm lint                   # Check all files
pnpm lint:fix               # Fix auto-fixable issues

# Type Checking
pnpm type-check             # Check all TypeScript

# Database
supabase db reset           # Reset database
supabase db push            # Push migrations
supabase db pull            # Pull remote schema
supabase gen types typescript --local > packages/database/src/types.ts

# Deployment
railway up                  # Deploy to Railway
```

---

## 🚀 Deployment

### Admin Dashboard (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd apps/admin
railway up
```

### Mobile App (Expo)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

### POS Terminal (Desktop)

```bash
# Build for current platform
cd apps/pos
pnpm tauri build

# Build for all platforms (CI/CD)
pnpm tauri build --target all
```

---

## 🔐 Security Features

- ✅ **End-to-end Encryption** - All data encrypted in transit (HTTPS/SSL)
- ✅ **Row-Level Security** - Database-level access control
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **PIN Protection** - Customer PIN for card transactions
- ✅ **Audit Logging** - Complete audit trail of all operations
- ✅ **Role-Based Access** - Admin, Manager, Cashier permissions
- ✅ **Secure Storage** - Encrypted local storage for sensitive data

---

## 💰 Payment Integration

### MTN Mobile Money

```typescript
// Example: Initiate MTN top-up
const response = await fetch('/api/payments/mtn/initiate', {
  method: 'POST',
  body: JSON.stringify({
    card_uid: 'CARD-12345',
    amount: 100.00,
    phone_number: '+256700000000'
  })
})
```

### Airtel Money

```typescript
// Example: Initiate Airtel top-up
const response = await fetch('/api/payments/airtel/initiate', {
  method: 'POST',
  body: JSON.stringify({
    card_uid: 'CARD-12345',
    amount: 50.00,
    phone_number: '+256750000000'
  })
})
```

---

## 📱 Screenshots

### Admin Dashboard
![Dashboard](./docs/screenshots/admin-dashboard.png)
![Cards Management](./docs/screenshots/admin-cards.png)

### POS Terminal
![Checkout](./docs/screenshots/pos-checkout.png)

### Mobile App
![Wallet](./docs/screenshots/mobile-wallet.png)
![Top-Up](./docs/screenshots/mobile-topup.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Big Innovation Group Ltd**
- Client: Kiaan
- Built with ❤️ using 100% open-source tools

---

## 🆘 Support

For support, email support@kiaan.com or join our [Discord community](https://discord.gg/kiaan).

---

## 🗺️ Roadmap

### Phase 1: Core Features (Current)
- [x] Admin dashboard
- [x] POS terminal
- [x] Mobile app
- [x] Card management
- [x] Basic reporting

### Phase 2: Advanced Features (Q2 2025)
- [ ] QR Code payments
- [ ] Loyalty program
- [ ] Advanced analytics with ML
- [ ] Multi-currency support
- [ ] Web-based POS (browser)

### Phase 3: Expansion (Q3 2025)
- [ ] iOS mobile app
- [ ] Merchant API for third-party integration
- [ ] Webhook system
- [ ] Advanced fraud detection
- [ ] White-label solution

---

## ⚡ Performance

- **Admin Dashboard:** Lighthouse Score > 90
- **Mobile App:** Launch time < 2s, 60 FPS animations
- **POS Terminal:** Transaction processing < 3s
- **Database:** Optimized queries with proper indexing
- **API:** Response time < 200ms average

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

---

## 📊 System Requirements

### Admin Dashboard
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### POS Terminal
- Windows 10+, macOS 11+, or Linux
- 4GB RAM minimum
- USB NFC reader (supported models listed in docs)
- Thermal printer (optional)

### Mobile App
- Android 8.0+ or iOS 13+
- 50MB free storage
- Internet connection for top-ups

---

**Built with cutting-edge open-source technologies 🚀**

Made with ❤️ by the Kiaan team
