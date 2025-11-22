# Kiaan POS & Wallet System - Implementation Guide
## Step-by-Step Setup & Code Examples

---

## PART 1: PROJECT INITIALIZATION

### Step 1: Create Turborepo Monorepo

```bash
# Install pnpm globally
npm install -g pnpm@9

# Create monorepo using Turborepo
pnpx create-turbo@latest kiaan-pos-wallet-system

cd kiaan-pos-wallet-system

# Project structure
```

### Step 2: Setup pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

### Step 3: Root Package.json

```json
{
  "name": "kiaan-pos-wallet-system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "type-check": "turbo type-check",
    "clean": "turbo clean && rm -rf node_modules",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": ">=22",
    "pnpm": ">=9"
  }
}
```

---

## PART 2: BACKEND SETUP (SUPABASE)

### Step 1: Initialize Supabase

```bash
# Install Supabase CLI
pnpm add -g supabase

# Login to Supabase
supabase login

# Initialize in project
supabase init

# Start local Supabase (Docker required)
supabase start
```

### Step 2: Database Migration

```bash
# Create first migration
supabase migration new initial_schema
```

```sql
-- supabase/migrations/20250122000000_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'branch_manager', 'cashier');
CREATE TYPE card_status AS ENUM ('active', 'inactive', 'lost', 'stolen');
CREATE TYPE transaction_type AS ENUM ('purchase', 'top_up', 'adjustment', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE payment_provider AS ENUM ('mtn', 'airtel', 'cash', 'system');

-- CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  email TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARDS
CREATE TABLE cards (
  uid TEXT PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (balance >= 0),
  status card_status DEFAULT 'active',
  pin_hash TEXT NOT NULL,
  daily_limit NUMERIC(10, 2) DEFAULT 1000.00,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANCHES
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update branches manager reference
ALTER TABLE branches ADD CONSTRAINT fk_branch_manager
  FOREIGN KEY (manager_id) REFERENCES staff(id) ON DELETE SET NULL;

-- TRANSACTIONS
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_uid TEXT REFERENCES cards(uid) NOT NULL,
  type transaction_type NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  balance_before NUMERIC(12, 2) NOT NULL,
  balance_after NUMERIC(12, 2) NOT NULL,
  branch_id UUID REFERENCES branches(id),
  staff_id UUID REFERENCES staff(id),
  payment_method payment_provider,
  payment_reference TEXT,
  status transaction_status DEFAULT 'completed',
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOP-UPS
CREATE TABLE top_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  card_uid TEXT REFERENCES cards(uid) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  source TEXT NOT NULL CHECK (source IN ('ussd', 'mobile_app', 'admin')),
  payment_provider payment_provider NOT NULL,
  phone_number TEXT NOT NULL,
  payment_reference TEXT UNIQUE,
  status transaction_status DEFAULT 'pending',
  callback_data JSONB,
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- AUDIT LOG
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_cards_customer ON cards(customer_id);
CREATE INDEX idx_cards_status ON cards(status) WHERE status = 'active';
CREATE INDEX idx_transactions_card ON transactions(card_uid);
CREATE INDEX idx_transactions_branch ON transactions(branch_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_topups_card ON top_ups(card_uid);
CREATE INDEX idx_topups_status ON top_ups(status) WHERE status = 'pending';
CREATE INDEX idx_topups_reference ON top_ups(payment_reference);
CREATE INDEX idx_staff_branch ON staff(branch_id);
CREATE INDEX idx_staff_role ON staff(role);

-- FUNCTIONS

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Process Purchase Function
CREATE OR REPLACE FUNCTION process_purchase(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_branch_id UUID,
  p_staff_id UUID,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Lock and get card
  SELECT * INTO v_card FROM cards WHERE uid = p_card_uid FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Card not found');
  END IF;

  IF v_card.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Card is not active');
  END IF;

  -- Check balance
  IF v_card.balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_card.balance,
      'required', p_amount
    );
  END IF;

  -- Calculate new balance
  v_new_balance := v_card.balance - p_amount;

  -- Insert transaction
  INSERT INTO transactions (
    card_uid, type, amount, balance_before, balance_after,
    branch_id, staff_id, status, description
  ) VALUES (
    p_card_uid, 'purchase', p_amount, v_card.balance, v_new_balance,
    p_branch_id, p_staff_id, 'completed', p_description
  ) RETURNING id INTO v_transaction_id;

  -- Update card
  UPDATE cards SET
    balance = v_new_balance,
    last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'previous_balance', v_card.balance,
    'amount_deducted', p_amount,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Process Top-Up Function
CREATE OR REPLACE FUNCTION process_top_up(
  p_card_uid TEXT,
  p_amount NUMERIC,
  p_payment_provider TEXT,
  p_payment_reference TEXT,
  p_phone_number TEXT,
  p_source TEXT DEFAULT 'mobile_app'
)
RETURNS JSON AS $$
DECLARE
  v_card cards%ROWTYPE;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
  v_topup_id UUID;
BEGIN
  -- Check for duplicate payment reference
  IF EXISTS (SELECT 1 FROM top_ups WHERE payment_reference = p_payment_reference) THEN
    RETURN json_build_object('success', false, 'error', 'Duplicate payment reference');
  END IF;

  -- Lock and get card
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
    p_payment_provider::payment_provider, p_payment_reference, 'completed'
  ) RETURNING id INTO v_transaction_id;

  -- Insert top-up record
  INSERT INTO top_ups (
    transaction_id, card_uid, amount, source, payment_provider,
    phone_number, payment_reference, status, completed_at
  ) VALUES (
    v_transaction_id, p_card_uid, p_amount, p_source,
    p_payment_provider::payment_provider, p_phone_number,
    p_payment_reference, 'success', NOW()
  ) RETURNING id INTO v_topup_id;

  -- Update card
  UPDATE cards SET
    balance = v_new_balance,
    last_used_at = NOW()
  WHERE uid = p_card_uid;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'topup_id', v_topup_id,
    'previous_balance', v_card.balance,
    'amount_added', p_amount,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql;

-- Get Dashboard Stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(
  p_branch_id UUID DEFAULT NULL,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
BEGIN
  SELECT json_build_object(
    'total_cards', (SELECT COUNT(*) FROM cards WHERE status = 'active'),
    'total_customers', (SELECT COUNT(*) FROM customers),
    'total_balance', (SELECT COALESCE(SUM(balance), 0) FROM cards WHERE status = 'active'),
    'today_transactions', (
      SELECT COUNT(*) FROM transactions
      WHERE created_at >= CURRENT_DATE
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'today_revenue', (
      SELECT COALESCE(SUM(amount), 0) FROM transactions
      WHERE type = 'purchase'
      AND created_at >= CURRENT_DATE
      AND (p_branch_id IS NULL OR branch_id = p_branch_id)
    ),
    'total_topups', (
      SELECT COALESCE(SUM(amount), 0) FROM top_ups
      WHERE status = 'success'
      AND completed_at BETWEEN p_start_date AND p_end_date
    ),
    'pending_topups', (
      SELECT COUNT(*) FROM top_ups WHERE status = 'pending'
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

-- ROW LEVEL SECURITY
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified - expand based on needs)
CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON cards
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON transactions
  FOR SELECT TO authenticated USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
```

### Step 3: Seed Data

```sql
-- supabase/seed.sql

-- Insert test branches
INSERT INTO branches (id, name, code, location, phone, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Branch', 'BR001', 'Kampala, Uganda', '+256700000001', 'main@kiaan.com'),
  ('00000000-0000-0000-0000-000000000002', 'Downtown Branch', 'BR002', 'Kampala Downtown', '+256700000002', 'downtown@kiaan.com'),
  ('00000000-0000-0000-0000-000000000003', 'Airport Branch', 'BR003', 'Entebbe', '+256700000003', 'airport@kiaan.com');

-- Insert admin user
INSERT INTO staff (id, full_name, email, phone, role, branch_id) VALUES
  ('00000000-0000-0000-0000-000000000010', 'System Admin', 'admin@kiaan.com', '+256700000010', 'admin', NULL),
  ('00000000-0000-0000-0000-000000000011', 'Main Manager', 'manager1@kiaan.com', '+256700000011', 'branch_manager', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000012', 'Cashier One', 'cashier1@kiaan.com', '+256700000012', 'cashier', '00000000-0000-0000-0000-000000000001');

-- Insert test customers
INSERT INTO customers (id, full_name, phone_number, email) VALUES
  ('00000000-0000-0000-0000-000000000020', 'John Doe', '+256700000020', 'john@example.com'),
  ('00000000-0000-0000-0000-000000000021', 'Jane Smith', '+256700000021', 'jane@example.com'),
  ('00000000-0000-0000-0000-000000000022', 'Bob Wilson', '+256700000022', 'bob@example.com');

-- Insert test cards (PIN hash for "1234" using bcrypt)
-- You'll need to generate actual bcrypt hashes
INSERT INTO cards (uid, customer_id, balance, status, pin_hash, daily_limit) VALUES
  ('CARD-00001', '00000000-0000-0000-0000-000000000020', 100.00, 'active', '$2a$10$abcdefghijklmnopqrstuvwxyz', 500.00),
  ('CARD-00002', '00000000-0000-0000-0000-000000000021', 250.00, 'active', '$2a$10$abcdefghijklmnopqrstuvwxyz', 1000.00),
  ('CARD-00003', '00000000-0000-0000-0000-000000000022', 50.00, 'active', '$2a$10$abcdefghijklmnopqrstuvwxyz', 300.00);

-- Insert sample transactions
INSERT INTO transactions (card_uid, type, amount, balance_before, balance_after, branch_id, staff_id, status) VALUES
  ('CARD-00001', 'top_up', 100.00, 0.00, 100.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'completed'),
  ('CARD-00001', 'purchase', 15.50, 100.00, 84.50, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'completed'),
  ('CARD-00002', 'top_up', 250.00, 0.00, 250.00, '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'completed');
```

### Step 4: Run Migration & Seed

```bash
# Apply migrations
supabase db reset

# Or migrate only
supabase db push

# Seed data
supabase db seed
```

### Step 5: Generate TypeScript Types

```bash
# Generate types
supabase gen types typescript --local > packages/database/src/types.ts
```

---

## PART 3: SHARED PACKAGES

### Step 1: Database Package

```bash
mkdir -p packages/database
cd packages/database
pnpm init
```

```json
// packages/database/package.json
{
  "name": "@kiaan/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types.ts",
    "./client": "./src/client.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

```typescript
// packages/database/src/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  })
}

export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
```

```typescript
// packages/database/src/index.ts
export * from './client'
export * from './types'
```

### Step 2: Shared UI Package

```bash
mkdir -p packages/ui
cd packages/ui
pnpm init
```

```json
// packages/ui/package.json
{
  "name": "@kiaan/ui",
  "version": "1.0.0",
  "main": "./src/index.tsx",
  "types": "./src/index.tsx",
  "exports": {
    ".": "./src/index.tsx",
    "./button": "./src/button.tsx",
    "./input": "./src/input.tsx",
    "./card": "./src/card.tsx"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0"
  }
}
```

```typescript
// packages/ui/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```typescript
// packages/ui/src/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

```typescript
// packages/ui/src/index.tsx
export { Button, buttonVariants } from './button'
export { cn } from './lib/utils'
// Add more components as you create them
```

---

## PART 4: ADMIN DASHBOARD (Next.js 15)

### Step 1: Create Next.js App

```bash
cd apps
pnpx create-next-app@latest admin
# Select: TypeScript, Tailwind, App Router, src directory: No
```

### Step 2: Configure Admin App

```json
// apps/admin/package.json
{
  "name": "admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@kiaan/database": "workspace:*",
    "@kiaan/ui": "workspace:*",
    "@supabase/ssr": "^0.5.2",
    "@tanstack/react-query": "^5.67.0",
    "@tanstack/react-table": "^8.21.0",
    "zustand": "^5.0.2",
    "react-hook-form": "^7.54.2",
    "zod": "^3.24.1",
    "@hookform/resolvers": "^3.10.0",
    "recharts": "^2.15.0",
    "lucide-react": "^0.468.0",
    "date-fns": "^4.1.0",
    "sonner": "^1.7.1",
    "cmdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0",
    "postcss": "^8",
    "autoprefixer": "^10.4.20"
  }
}
```

### Step 3: Environment Variables

```bash
# apps/admin/.env.local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
```

### Step 4: Supabase Client (SSR)

```typescript
// apps/admin/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@kiaan/database/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// apps/admin/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@kiaan/database/types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

### Step 5: TanStack Query Setup

```typescript
// apps/admin/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
```

```typescript
// apps/admin/app/providers.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/lib/query-client'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Step 6: Dashboard Layout

```typescript
// apps/admin/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

```typescript
// apps/admin/components/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  Building2,
  TrendingUp,
  Wallet,
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@kiaan/ui'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Cards', href: '/dashboard/cards', icon: CreditCard },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Branches', href: '/dashboard/branches', icon: Building2 },
  { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  { name: 'Top-Ups', href: '/dashboard/top-ups', icon: Wallet },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-2xl font-bold text-white">Kiaan POS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
```

### Step 7: Dashboard Home Page

```typescript
// apps/admin/app/(dashboard)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const { data: stats } = await supabase.rpc('get_dashboard_stats')

  // Fetch recent transactions
  const { data: recentTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      card:cards(uid, customer:customers(full_name, phone_number)),
      branch:branches(name),
      staff:staff(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your POS wallet system
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  )
}
```

```typescript
// apps/admin/components/dashboard/stats-cards.tsx
import { Card } from '@kiaan/ui'
import { CreditCard, Users, DollarSign, TrendingUp } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    total_cards: number
    total_customers: number
    total_balance: number
    today_revenue: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Active Cards',
      value: stats.total_cards.toLocaleString(),
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Customers',
      value: stats.total_customers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'System Balance',
      value: `$${stats.total_balance.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: "Today's Revenue",
      value: `$${stats.today_revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
```

---

## PART 5: MOBILE APP (Expo + React Native)

### Step 1: Create Expo App

```bash
cd apps
pnpx create-expo-app mobile --template tabs@latest
cd mobile
```

### Step 2: Install Dependencies

```bash
# Install Tamagui (Modern UI framework)
pnpm add tamagui @tamagui/config @tamagui/lucide-icons

# Install navigation
pnpm add expo-router

# Install Supabase
pnpm add @supabase/supabase-js

# Install secure storage
pnpm add expo-secure-store

# Install utilities
pnpm add zustand @tanstack/react-query date-fns
```

### Step 3: Configure Tamagui

```typescript
// apps/mobile/tamagui.config.ts
import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const appConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      primary: '#2563EB',
      primaryForeground: '#FFFFFF',
    },
    dark: {
      ...config.themes.dark,
      primary: '#3B82F6',
      primaryForeground: '#FFFFFF',
    },
  },
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
```

### Step 4: Supabase Client

```typescript
// apps/mobile/lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import type { Database } from '@kiaan/database/types'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

### Step 5: Wallet Home Screen

```typescript
// apps/mobile/app/(tabs)/index.tsx
import { View, ScrollView, RefreshControl } from 'react-native'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { YStack, XStack, Card, H1, H3, Text, Button } from 'tamagui'
import { Wallet, TrendingUp, TrendingDown } from '@tamagui/lucide-icons'
import { supabase } from '@/lib/supabase'

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false)

  // Fetch wallet data
  const { data: wallet, isLoading, refetch } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data } = await supabase
        .from('cards')
        .select('uid, balance, status, last_used_at, customer:customers(*)')
        .single()

      return data
    }
  })

  // Fetch recent transactions
  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      return data
    }
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (isLoading) return <Text>Loading...</Text>

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <YStack padding="$4" gap="$4">
        {/* Header */}
        <YStack>
          <Text fontSize="$2" color="$gray10">Hello,</Text>
          <H1>{wallet?.customer?.full_name}</H1>
        </YStack>

        {/* Balance Card */}
        <Card padding="$6" backgroundColor="$blue9" elevate>
          <YStack gap="$2">
            <XStack alignItems="center" gap="$2">
              <Wallet size={24} color="white" />
              <Text fontSize="$3" color="white">Current Balance</Text>
            </XStack>
            <H1 color="white" fontSize="$10">
              ${wallet?.balance?.toFixed(2)}
            </H1>
            <Text fontSize="$2" color="$gray2" opacity={0.8}>
              Card: {wallet?.uid}
            </Text>
          </YStack>
        </Card>

        {/* Quick Actions */}
        <XStack gap="$3">
          <Button flex={1} size="$5" theme="blue">
            Top-Up
          </Button>
          <Button flex={1} size="$5" variant="outlined">
            Pay with QR
          </Button>
        </XStack>

        {/* Recent Transactions */}
        <YStack gap="$3">
          <H3>Recent Transactions</H3>
          {transactions?.map((tx) => (
            <Card key={tx.id} padding="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$3" alignItems="center">
                  {tx.type === 'top_up' ? (
                    <View className="p-2 bg-green-100 rounded-full">
                      <TrendingUp size={20} color="green" />
                    </View>
                  ) : (
                    <View className="p-2 bg-red-100 rounded-full">
                      <TrendingDown size={20} color="red" />
                    </View>
                  )}
                  <YStack>
                    <Text fontSize="$4" fontWeight="600">
                      {tx.type === 'top_up' ? 'Top-Up' : 'Purchase'}
                    </Text>
                    <Text fontSize="$2" color="$gray10">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </Text>
                  </YStack>
                </XStack>
                <Text
                  fontSize="$5"
                  fontWeight="700"
                  color={tx.type === 'top_up' ? '$green10' : '$red10'}
                >
                  {tx.type === 'top_up' ? '+' : '-'}${tx.amount.toFixed(2)}
                </Text>
              </XStack>
            </Card>
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
```

---

## PART 6: POS TERMINAL (Tauri)

### Step 1: Create Tauri App

```bash
cd apps
pnpm create tauri-app pos
# Select: TypeScript + React + Vite
```

### Step 2: Configure for POS

```typescript
// apps/pos/src-tauri/tauri.conf.json
{
  "productName": "Kiaan POS Terminal",
  "version": "1.0.0",
  "identifier": "com.kiaan.pos",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build",
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Kiaan POS Terminal",
        "width": 1024,
        "height": 768,
        "resizable": true,
        "fullscreen": false,
        "theme": "Light"
      }
    ],
    "security": {
      "csp": null
    }
  }
}
```

### Step 3: NFC Reader Integration (Rust)

```rust
// apps/pos/src-tauri/src/nfc.rs
use tauri::command;
use pcsc::*;

#[command]
pub async fn read_nfc_card() -> Result<String, String> {
    let ctx = Context::establish(Scope::User)
        .map_err(|e| format!("Failed to establish context: {}", e))?;

    let readers = ctx.list_readers_owned()
        .map_err(|e| format!("Failed to list readers: {}", e))?;

    if readers.is_empty() {
        return Err("No NFC readers found".to_string());
    }

    let reader = &readers[0];

    let card = ctx.connect(reader, ShareMode::Shared, Protocols::ANY)
        .map_err(|e| format!("Failed to connect to card: {}", e))?;

    let mut uid_buf = [0u8; 64];
    let uid_len = card.transmit(&[0xFF, 0xCA, 0x00, 0x00, 0x00], &mut uid_buf)
        .map_err(|e| format!("Failed to read UID: {}", e))?;

    let uid = hex::encode(&uid_buf[..uid_len]);

    Ok(uid)
}
```

```rust
// apps/pos/src-tauri/src/main.rs
mod nfc;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            nfc::read_nfc_card
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Step 4: POS Checkout Screen

```typescript
// apps/pos/src/screens/Checkout.tsx
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { Button } from '@kiaan/ui'

export function CheckoutScreen() {
  const [amount, setAmount] = useState('')
  const [cardUid, setCardUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleReadCard = async () => {
    setLoading(true)
    try {
      const uid = await invoke<string>('read_nfc_card')
      setCardUid(uid)

      // Fetch card details from backend
      // ...
    } catch (error) {
      console.error('Failed to read card:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayment = async () => {
    if (!cardUid || !amount) return

    try {
      // Call backend API to process payment
      const response = await fetch('http://localhost:54321/rest/v1/rpc/process_purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          p_card_uid: cardUid,
          p_amount: parseFloat(amount),
          p_branch_id: 'branch-uuid',
          p_staff_id: 'staff-uuid'
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Payment successful! New balance: $${result.new_balance}`)
        // Print receipt
        // Reset for next transaction
        setAmount('')
        setCardUid(null)
      } else {
        alert(`Payment failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Payment processing error:', error)
    }
  }

  return (
    <div className="h-screen flex flex-col p-8 bg-gray-50">
      {/* Amount Entry */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <label className="text-lg text-gray-600">Amount</label>
          <div className="text-6xl font-bold my-4">
            ${amount || '0.00'}
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[1,2,3,4,5,6,7,8,9,'.',0,'←'].map((key) => (
              <Button
                key={key}
                size="lg"
                variant="outline"
                className="text-2xl h-20"
                onClick={() => {
                  if (key === '←') {
                    setAmount(amount.slice(0, -1))
                  } else {
                    setAmount(amount + key.toString())
                  }
                }}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Reading */}
      <div className="mt-8">
        {!cardUid ? (
          <Button
            size="lg"
            className="w-full h-20 text-xl"
            onClick={handleReadCard}
            disabled={loading || !amount}
          >
            {loading ? 'Reading Card...' : 'Tap Card'}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-300 rounded">
              <p className="text-green-800 font-semibold">Card Detected!</p>
              <p className="text-sm text-green-700">UID: {cardUid}</p>
            </div>
            <Button
              size="lg"
              className="w-full h-20 text-xl"
              onClick={handleProcessPayment}
            >
              Complete Payment - ${amount}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## PART 7: DEPLOYMENT

### Step 1: Railway Deployment (Admin Dashboard)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy admin dashboard
cd apps/admin
railway up
```

### Step 2: GitHub Repository Setup

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Kiaan POS Wallet System"

# Create GitHub repo (using gh CLI)
gh repo create kiaan-pos-wallet-system --public --source=. --remote=origin

# Push
git push -u origin main
```

### Step 3: CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy-admin.yml
name: Deploy Admin Dashboard

on:
  push:
    branches: [main]
    paths:
      - 'apps/admin/**'
      - 'packages/**'

jobs:
  deploy:
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

      - name: Build admin app
        run: pnpm build --filter=admin
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up --service admin
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

This implementation guide provides the foundation for building the entire system. Each section can be expanded with more detailed code as development progresses.

**Next steps:** Continue implementing specific features, add testing, and iterate on the UI/UX based on user feedback.
