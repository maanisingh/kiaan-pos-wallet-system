# Kiaan POS & Wallet System - Advanced Modern Tech Stack
## Using Cutting-Edge Open-Source Libraries & Frameworks

---

## 1. BACKEND PLATFORM OPTIONS (CRUD + More)

### Option 1: **Supabase** (Recommended for this project)
```
✅ PostgreSQL database (real-time subscriptions)
✅ Built-in authentication & authorization
✅ Row Level Security (RLS)
✅ Auto-generated REST & GraphQL APIs
✅ Real-time subscriptions via WebSockets
✅ File storage
✅ Edge functions (Deno-based)
✅ Database webhooks
✅ Free tier available
```

**Why Supabase:**
- Perfect for multi-tenant (multi-branch) systems
- Real-time balance updates
- Built-in auth for admin, staff, customers
- PostgREST auto-generates APIs from database schema
- Excellent TypeScript support
- Can host on Railway or self-host

### Option 2: **Hasura** (GraphQL-first)
```
✅ Instant GraphQL APIs from PostgreSQL
✅ Advanced permissions & RBAC
✅ Event triggers & scheduled triggers
✅ Remote schemas (connect to payment APIs)
✅ Real-time subscriptions
✅ Actions for custom business logic
✅ Can combine multiple data sources
```

### Option 3: **Pocketbase** (Go-based, single binary)
```
✅ Ultra-lightweight (single executable)
✅ Built-in admin UI
✅ Real-time subscriptions
✅ File storage
✅ Authentication
✅ Easy to self-host
✅ Perfect for embedded systems (POS terminals)
```

### Option 4: **Directus** (Headless CMS + Database)
```
✅ Auto-generates REST & GraphQL APIs
✅ Beautiful admin UI (can replace custom admin dashboard)
✅ Fine-grained permissions
✅ Workflows & automation
✅ Multi-language support
✅ File management
```

**Recommendation:** Use **Supabase** for main system + **Pocketbase** for POS terminal offline storage

---

## 2. ADVANCED FRONTEND STACK

### 2.1 Admin Dashboard - Next.js 15 with Modern Tools

```typescript
// FRAMEWORK & CORE
"next": "15.1.0",                    // Latest Next.js with Turbopack
"react": "19.0.0",                   // React 19 with compiler
"typescript": "5.7.2",               // Latest TypeScript

// STYLING & UI
"tailwindcss": "^4.0.0",            // Tailwind CSS 4 (latest)
"shadcn-ui": "latest",              // shadcn/ui component system
"@radix-ui/themes": "^3.1.6",      // Radix Themes (advanced)
"framer-motion": "^12.0.0",        // Advanced animations
"cmdk": "^1.0.0",                  // Command palette (⌘K)
"vaul": "^1.1.1",                  // Advanced drawer component
"sonner": "^1.7.1",                // Beautiful toast notifications

// STATE MANAGEMENT (Modern approach)
"zustand": "^5.0.2",               // Lightweight state management
"jotai": "^2.12.1",                // Atomic state management (alternative)
"valtio": "^2.1.2",                // Proxy-based state (alternative)
"@tanstack/react-query": "^5.67.0", // Server state management

// DATA FETCHING & REAL-TIME
"@supabase/ssr": "^0.5.2",         // Supabase with SSR support
"@supabase/supabase-js": "^2.48.1", // Supabase client
"graphql-request": "^7.1.2",       // GraphQL client (if using Hasura)
"urql": "^4.1.0",                  // Advanced GraphQL client

// FORMS & VALIDATION
"react-hook-form": "^7.54.2",      // Best form library
"zod": "^3.24.1",                  // TypeScript-first validation
"@hookform/resolvers": "^3.10.0",  // RHF + Zod integration
"conform": "^1.2.2",               // Progressive form enhancement

// TABLES & DATA GRIDS
"@tanstack/react-table": "^8.21.0", // Headless table library
"ag-grid-react": "^33.3.3",        // Advanced data grid (enterprise features)
"react-data-grid": "^7.0.0-beta.50", // Modern Excel-like grid

// CHARTS & VISUALIZATION
"recharts": "^2.15.0",             // Composable charts
"tremor": "^3.20.3",               // Dashboard-focused charts
"visx": "^3.12.2",                 // Low-level viz primitives (D3-based)
"react-chartjs-2": "^5.2.0",       // Chart.js wrapper

// DATE & TIME
"date-fns": "^4.1.0",              // Modern date library
"day.js": "^1.11.13",              // Lightweight alternative

// ICONS & ASSETS
"lucide-react": "^0.468.0",        // Modern icon library
"@tabler/icons-react": "^3.26.0", // Alternative icon set
"react-icons": "^5.4.0",           // Multi-library icons

// FILE HANDLING
"react-dropzone": "^14.3.5",       // Drag & drop file uploads
"papaparse": "^5.4.1",             // CSV parsing
"xlsx": "^0.18.5",                 // Excel file handling

// PDF GENERATION
"@react-pdf/renderer": "^4.1.7",   // PDF generation
"jspdf": "^2.5.2",                 // Alternative PDF library

// UTILITIES
"clsx": "^2.1.1",                  // Class name utility
"tailwind-merge": "^2.6.0",        // Merge Tailwind classes
"nanoid": "^5.0.9",                // Unique ID generation
"lodash-es": "^4.17.21",           // Utility functions (tree-shakeable)

// DEVELOPMENT TOOLS
"@biomejs/biome": "^1.9.4",        // Fast linter/formatter (Rust-based)
"turbo": "^2.3.3",                 // Monorepo build system
"tsup": "^8.3.5",                  // TypeScript bundler
"vitest": "^2.1.8",                // Modern test runner (Vite-powered)
"playwright": "^1.49.1",           // E2E testing

// SECURITY & AUTH
"@supabase/auth-ui-react": "^0.4.7", // Pre-built auth UI
"jose": "^5.9.6",                  // JWT operations
"bcryptjs": "^2.4.3",              // Password hashing
```

### 2.2 POS Terminal - Tauri v2 (Rust-based, modern Electron alternative)

```typescript
// DESKTOP FRAMEWORK
"@tauri-apps/api": "^2.2.0",       // Tauri v2 (smaller, faster, more secure than Electron)
"@tauri-apps/plugin-window": "^2.0.0",
"@tauri-apps/plugin-store": "^2.0.0", // Persistent storage
"@tauri-apps/plugin-sql": "^2.0.0",   // SQLite integration

// UI FRAMEWORK
"react": "19.0.0",
"vite": "^6.0.7",                  // Ultra-fast build tool
"tailwindcss": "^4.0.0",

// NFC INTEGRATION (via Tauri)
// Tauri Rust plugin for NFC - custom plugin
"@serialport/bindings": "^12.0.1", // Serial port communication
"nfc-pcsc": "^0.8.0",              // NFC/PCSC wrapper

// OFFLINE DATABASE
"@electric-sql/pglite": "^0.2.15", // PostgreSQL in browser (IndexedDB)
"dexie": "^4.0.11",                // IndexedDB wrapper
"rxdb": "^16.1.1",                 // Reactive offline-first database

// SYNC & QUEUE
"workbox": "^7.3.0",               // Service worker for offline support

// PRINTER INTEGRATION
// Custom Tauri Rust plugin for thermal printers
"escpos": "^3.0.0",                // ESC/POS printer commands

// STATE MANAGEMENT
"zustand": "^5.0.2",
"@tanstack/react-query": "^5.67.0",

// CRYPTO (for local security)
"crypto-js": "^4.2.0",
```

**Why Tauri over Electron:**
- 10x smaller app size (3MB vs 150MB)
- Lower memory usage
- Better security (no Node.js in renderer)
- Faster startup time
- Native system integration via Rust
- Cross-platform (Windows, macOS, Linux)

### 2.3 Mobile App - Expo + React Native (Latest)

```typescript
// FRAMEWORK
"expo": "~52.0.23",                // Latest Expo SDK
"expo-router": "^4.0.15",          // File-based routing
"react-native": "0.76.5",          // Latest React Native
"react-native-reanimated": "~3.16.4", // Performant animations
"react-native-gesture-handler": "~2.20.2",

// UI FRAMEWORK OPTIONS

// Option 1: Tamagui (Recommended - most advanced)
"tamagui": "^1.127.5",             // Universal UI kit (web + native)
"@tamagui/config": "^1.127.5",     // Optimized, themeable
"solito": "^4.3.2",                // Share code with Next.js

// Option 2: NativeWind (Tailwind for RN)
"nativewind": "^4.1.23",           // Tailwind CSS for React Native
"tailwindcss": "^4.0.0",

// Option 3: Gluestack UI
"@gluestack-ui/themed": "^1.1.68", // Comprehensive component library

// NAVIGATION
"expo-router": "^4.0.15",          // File-based routing (like Next.js)

// STATE MANAGEMENT
"zustand": "^5.0.2",
"@tanstack/react-query": "^5.67.0",

// API & BACKEND
"@supabase/supabase-js": "^2.48.1",
"axios": "^1.7.9",

// STORAGE
"expo-secure-store": "~14.0.0",    // Encrypted storage
"@react-native-async-storage/async-storage": "^2.1.0",
"react-native-mmkv": "^3.1.0",     // Super fast storage

// PAYMENTS (MTN/Airtel)
// Custom integration - will provide SDKs

// BIOMETRIC AUTH
"expo-local-authentication": "~14.0.1",
"react-native-biometrics": "^3.0.1",

// QR CODE
"expo-camera": "~16.0.11",
"react-native-qrcode-svg": "^6.3.13",

// FORMS
"react-hook-form": "^7.54.2",
"zod": "^3.24.1",

// ANIMATIONS
"moti": "^0.29.0",                 // Declarative animations for RN
"lottie-react-native": "^7.2.0",   // Lottie animations

// ICONS
"@expo/vector-icons": "^14.0.4",
"lucide-react-native": "^0.468.0",

// UTILITIES
"expo-updates": "~0.26.10",        // OTA updates
"expo-notifications": "~0.29.15",  // Push notifications
"expo-haptics": "~14.0.0",         // Haptic feedback

// DEVELOPMENT
"@expo/metro-runtime": "~4.0.0",
"expo-dev-client": "~5.0.6",       // Custom dev client
```

---

## 3. MODERN DEVELOPMENT TOOLS

### 3.1 Monorepo Management
```json
{
  "turborepo": "^2.3.3",           // Fastest monorepo tool (Vercel)
  "pnpm": "^9.15.4",               // Fast, disk-efficient package manager
  "nx": "^20.4.3",                 // Alternative to Turborepo (more features)
}
```

**Recommended:** Use **Turborepo** with **pnpm**

### 3.2 Linting & Formatting
```json
{
  "@biomejs/biome": "^1.9.4",      // All-in-one (replaces ESLint + Prettier)
  // OR traditional approach:
  "eslint": "^9.17.0",
  "prettier": "^3.4.2",
  "@typescript-eslint/parser": "^8.19.1"
}
```

**Recommended:** Use **Biome** (10-20x faster than ESLint)

### 3.3 Testing
```json
{
  "vitest": "^2.1.8",              // Fast unit tests (Vite-powered)
  "playwright": "^1.49.1",         // E2E testing
  "@testing-library/react": "^16.1.0",
  "msw": "^2.7.0",                 // Mock Service Worker (API mocking)
}
```

### 3.4 Type Safety
```json
{
  "typescript": "^5.7.2",
  "zod": "^3.24.1",                // Runtime validation
  "ts-pattern": "^5.5.0",          // Pattern matching for TypeScript
  "type-fest": "^4.31.0",          // Useful TypeScript types
  "supabase": "^1.207.7",          // Supabase CLI (generates types from DB)
}
```

### 3.5 API Type Generation
```json
{
  "openapi-typescript": "^7.4.3",  // Generate types from OpenAPI spec
  "graphql-codegen": "^5.0.3",     // Generate types from GraphQL schema (if using Hasura)
  "@supabase/supabase-js": "^2.48.1", // Auto-generates types
}
```

### 3.6 Documentation
```json
{
  "storybook": "^8.5.0",           // Component documentation
  "nextra": "^3.2.3",              // Next.js-based docs (like this!)
  "fumadocs": "^15.5.1",           // Modern docs framework
}
```

### 3.7 DevOps & Monitoring
```json
{
  "sentry": "^8.47.0",             // Error tracking
  "@opentelemetry/api": "^1.9.0",  // Observability
  "pino": "^9.6.0",                // Fast logging
  "plausible": "free",             // Privacy-friendly analytics
}
```

---

## 4. RECOMMENDED ARCHITECTURE

### 4.1 Tech Stack Summary

| Component | Technology |
|-----------|------------|
| **Backend** | Supabase (PostgreSQL + APIs) |
| **Admin Dashboard** | Next.js 15 + React 19 + Tailwind 4 + shadcn/ui |
| **POS Terminal** | Tauri v2 + React + SQLite (offline) |
| **Mobile App** | Expo 52 + React Native + Tamagui/NativeWind |
| **State Management** | Zustand + TanStack Query |
| **Monorepo** | Turborepo + pnpm |
| **Styling** | Tailwind CSS 4 (unified across all platforms) |
| **Forms** | React Hook Form + Zod |
| **Real-time** | Supabase Realtime / Hasura Subscriptions |
| **Testing** | Vitest + Playwright |
| **CI/CD** | GitHub Actions |
| **Deployment** | Railway (admin) + Vercel (alternative) |
| **Mobile Build** | EAS Build (Expo) |

### 4.2 Monorepo Structure (Turborepo)

```
kiaan-pos-wallet-system/
├── apps/
│   ├── admin/               # Next.js 15 admin dashboard
│   ├── pos/                 # Tauri POS terminal
│   ├── mobile/              # Expo mobile app
│   └── docs/                # Nextra documentation site
├── packages/
│   ├── ui/                  # Shared UI components (shadcn + Tamagui)
│   ├── database/            # Supabase client + types
│   ├── config/              # Shared configs (Tailwind, TS, etc.)
│   ├── utils/               # Shared utilities
│   └── types/               # Shared TypeScript types
├── tooling/
│   ├── eslint/              # Shared ESLint config (or Biome)
│   ├── typescript/          # Shared TS config
│   └── tailwind/            # Shared Tailwind config
├── supabase/                # Supabase backend
│   ├── migrations/          # Database migrations
│   ├── functions/           # Edge functions
│   └── seed.sql             # Seed data
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace config
├── package.json
└── README.md
```

---

## 5. SUPABASE BACKEND SETUP

### 5.1 Database Schema (PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-super-secret-jwt-token';

-- CUSTOMERS TABLE
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARDS TABLE
CREATE TABLE cards (
  uid TEXT PRIMARY KEY,  -- NFC card UID
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  balance NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lost')),
  pin_hash TEXT NOT NULL,  -- Hashed PIN
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANCHES TABLE
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  manager_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF/USERS TABLE
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'branch_manager', 'cashier')),
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT REFERENCES cards(uid),
  type TEXT NOT NULL CHECK (type IN ('purchase', 'top_up', 'adjustment')),
  amount NUMERIC(10, 2) NOT NULL,
  balance_before NUMERIC(10, 2) NOT NULL,
  balance_after NUMERIC(10, 2) NOT NULL,
  branch_id UUID REFERENCES branches(id),
  staff_id UUID REFERENCES staff(id),
  payment_method TEXT,  -- 'mtn', 'airtel', 'cash', 'admin_adjustment'
  payment_reference TEXT,  -- External payment reference
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata JSONB,  -- Additional transaction data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOP-UPS TABLE (separate for tracking)
CREATE TABLE top_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  card_uid TEXT REFERENCES cards(uid),
  amount NUMERIC(10, 2) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('ussd', 'mobile_app')),
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('mtn', 'airtel')),
  phone_number TEXT NOT NULL,
  payment_reference TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  callback_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- INDEXES for performance
CREATE INDEX idx_cards_customer ON cards(customer_id);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_transactions_card ON transactions(card_uid);
CREATE INDEX idx_transactions_branch ON transactions(branch_id);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_topups_card ON top_ups(card_uid);
CREATE INDEX idx_topups_status ON top_ups(status);
CREATE INDEX idx_topups_reference ON top_ups(payment_reference);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (example for customers)
-- Admins can see all
CREATE POLICY "Admins can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
      AND staff.role = 'admin'
    )
  );

-- Branch managers can see customers from their branch
CREATE POLICY "Branch managers see own branch customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff
      WHERE staff.id = auth.uid()
      AND staff.role = 'branch_manager'
      -- Add logic to filter by branch
    )
  );

-- FUNCTIONS

-- Function: Process Purchase
CREATE OR REPLACE FUNCTION process_purchase(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_branch_id UUID,
  p_staff_id UUID,
  p_pin TEXT
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Get card with lock
  SELECT * INTO v_card FROM cards WHERE uid = p_card_uid FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Card not found');
  END IF;

  -- Verify PIN (you'll need to implement bcrypt in PL/pgSQL or use edge function)
  -- IF NOT verify_pin(p_pin, v_card.pin_hash) THEN
  --   RETURN json_build_object('success', false, 'error', 'Invalid PIN');
  -- END IF;

  -- Check balance
  IF v_card.balance < p_amount THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient balance');
  END IF;

  -- Calculate new balance
  v_new_balance := v_card.balance - p_amount;

  -- Insert transaction
  INSERT INTO transactions (
    card_uid, type, amount, balance_before, balance_after,
    branch_id, staff_id, status
  ) VALUES (
    p_card_uid, 'purchase', p_amount, v_card.balance, v_new_balance,
    p_branch_id, p_staff_id, 'completed'
  ) RETURNING id INTO v_transaction_id;

  -- Update card balance
  UPDATE cards SET balance = v_new_balance, last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Process Top-Up
CREATE OR REPLACE FUNCTION process_top_up(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_payment_provider TEXT,
  p_payment_reference TEXT
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
  v_topup_id UUID;
BEGIN
  -- Get card with lock
  SELECT * INTO v_card FROM cards WHERE uid = p_card_uid FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Card not found');
  END IF;

  -- Calculate new balance
  v_new_balance := v_card.balance + p_amount;

  -- Insert transaction
  INSERT INTO transactions (
    card_uid, type, amount, balance_before, balance_after,
    payment_method, payment_reference, status
  ) VALUES (
    p_card_uid, 'top_up', p_amount, v_card.balance, v_new_balance,
    p_payment_provider, p_payment_reference, 'completed'
  ) RETURNING id INTO v_transaction_id;

  -- Insert top-up record
  INSERT INTO top_ups (
    transaction_id, card_uid, amount, source, payment_provider,
    phone_number, payment_reference, status, completed_at
  ) VALUES (
    v_transaction_id, p_card_uid, p_amount, 'mobile_app', p_payment_provider,
    '', p_payment_reference, 'success', NOW()
  ) RETURNING id INTO v_topup_id;

  -- Update card balance
  UPDATE cards SET balance = v_new_balance, last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'topup_id', v_topup_id,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5.2 Supabase Edge Functions (Deno)

```typescript
// supabase/functions/process-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { card_uid, amount, pin, branch_id, staff_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Verify PIN (using bcrypt)
  const { data: card } = await supabase
    .from('cards')
    .select('pin_hash')
    .eq('uid', card_uid)
    .single()

  // Verify PIN logic here...

  // Call PL/pgSQL function
  const { data, error } = await supabase.rpc('process_purchase', {
    p_card_uid: card_uid,
    p_amount: amount,
    p_branch_id: branch_id,
    p_staff_id: staff_id,
    p_pin: pin
  })

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 5.3 Type Generation (Auto)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Generate TypeScript types
supabase gen types typescript --project-id your-project-id > packages/database/types/supabase.ts
```

This generates fully typed client:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@kiaan/database/types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Fully typed!
const { data } = await supabase
  .from('cards')
  .select('uid, balance, customer:customers(full_name, phone_number)')
  .eq('status', 'active')
```

---

## 6. ADVANCED FEATURES TO IMPLEMENT

### 6.1 Real-time Updates (Supabase Realtime)

```typescript
// apps/admin/lib/realtime.ts
import { useEffect } from 'react'
import { supabase } from '@kiaan/database'
import { useQueryClient } from '@tanstack/react-query'

export function useRealtimeTransactions() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('transactions')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          // Invalidate transactions query
          queryClient.invalidateQueries({ queryKey: ['transactions'] })

          // Show toast notification
          toast.success('New transaction received!')
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
```

### 6.2 Offline-First POS (RxDB)

```typescript
// apps/pos/lib/database.ts
import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateRxCollection } from 'rxdb/plugins/replication'

const db = await createRxDatabase({
  name: 'kiaan_pos',
  storage: getRxStorageDexie()
})

// Add collection
await db.addCollections({
  transactions: {
    schema: transactionSchema
  }
})

// Sync with Supabase when online
const replicationState = replicateRxCollection({
  collection: db.transactions,
  replicationIdentifier: 'supabase-replication',
  live: true,
  pull: {
    async handler(lastCheckpoint) {
      // Fetch from Supabase
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .gt('updated_at', lastCheckpoint)

      return {
        documents: data,
        checkpoint: new Date().toISOString()
      }
    }
  },
  push: {
    async handler(docs) {
      // Push to Supabase
      await supabase.from('transactions').upsert(docs)
    }
  }
})
```

### 6.3 Command Palette (cmdk)

```typescript
// apps/admin/components/command-menu.tsx
import { Command } from 'cmdk'

export function CommandMenu() {
  return (
    <Command>
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => router.push('/dashboard')}>
            Dashboard
          </Command.Item>
          <Command.Item onSelect={() => router.push('/cards')}>
            Cards
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={handleIssueCard}>
            Issue New Card
          </Command.Item>
          <Command.Item onSelect={handleAddCustomer}>
            Add Customer
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  )
}
```

### 6.4 Advanced Analytics (Tremor)

```typescript
// apps/admin/components/analytics-dashboard.tsx
import { Card, AreaChart, BarChart, DonutChart } from '@tremor/react'

export function AnalyticsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3>Revenue Trend (Last 30 Days)</h3>
        <AreaChart
          data={revenueData}
          index="date"
          categories={["revenue"]}
          colors={["blue"]}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
        />
      </Card>

      <Card>
        <h3>Top-Up Sources</h3>
        <DonutChart
          data={topupSources}
          category="value"
          index="name"
          colors={["violet", "indigo"]}
        />
      </Card>

      <Card className="md:col-span-2">
        <h3>Branch Performance</h3>
        <BarChart
          data={branchData}
          index="branch"
          categories={["sales"]}
          colors={["emerald"]}
        />
      </Card>
    </div>
  )
}
```

---

## 7. DEPLOYMENT CONFIGURATION

### 7.1 Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "test": {
      "cache": false
    }
  }
}
```

### 7.2 Railway Deployment (Admin Dashboard)

```yaml
# railway.yaml (if needed)
build:
  builder: NIXPACKS
  buildCommand: pnpm turbo build --filter=admin

deploy:
  startCommand: pnpm --filter=admin start
  healthcheckPath: /api/health
  restartPolicyType: ON_FAILURE
```

### 7.3 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run Biome (lint + format check)
        run: pnpm biome ci .

      - name: Type check
        run: pnpm turbo type-check

      - name: Run tests
        run: pnpm turbo test

      - name: Build all apps
        run: pnpm turbo build

  deploy-admin:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service admin
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 8. QUICK START COMMANDS

```bash
# Initialize monorepo
pnpm create turbo@latest kiaan-pos-wallet-system
cd kiaan-pos-wallet-system

# Install dependencies
pnpm install

# Setup Supabase
pnpm dlx supabase init
pnpm dlx supabase start

# Generate types from Supabase
pnpm dlx supabase gen types typescript --local > packages/database/types/supabase.ts

# Run all apps in dev mode
pnpm dev

# Run specific app
pnpm dev --filter=admin
pnpm dev --filter=pos
pnpm dev --filter=mobile

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint & format
pnpm biome check .
pnpm biome check --write .

# Deploy admin to Railway
pnpm build --filter=admin
railway up --service admin
```

---

## 9. COST ANALYSIS (Open Source = FREE!)

| Component | Cost |
|-----------|------|
| Supabase (self-hosted) | **FREE** |
| Next.js Framework | **FREE** |
| Tauri Framework | **FREE** |
| Expo/React Native | **FREE** |
| All npm packages | **FREE** |
| GitHub (public repos) | **FREE** |
| Railway (hobby plan) | **$5/month** (or FREE tier) |
| **Total Monthly Cost** | **~$5 or FREE** |

---

## 10. SUMMARY - FINAL TECH STACK

✅ **Backend:** Supabase (PostgreSQL + APIs + Auth + Realtime)
✅ **Admin Dashboard:** Next.js 15 + React 19 + Tailwind 4 + shadcn/ui
✅ **POS Terminal:** Tauri v2 + React + RxDB (offline-first)
✅ **Mobile App:** Expo 52 + React Native + Tamagui
✅ **Monorepo:** Turborepo + pnpm
✅ **State:** Zustand + TanStack Query
✅ **Forms:** React Hook Form + Zod
✅ **Testing:** Vitest + Playwright
✅ **Linting:** Biome (all-in-one)
✅ **Deployment:** Railway + EAS Build
✅ **CI/CD:** GitHub Actions

**This is a fully modern, cutting-edge, production-ready stack using 100% open-source tools! 🚀**
