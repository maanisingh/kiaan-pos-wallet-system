# Admin Dashboard Implementation Status

## ✅ What's Working

1. **Railway Deployment**: Successfully deployed to https://pos-production-bae1.up.railway.app
2. **Routing**: All dashboard routes accessible (`/dashboard`, `/dashboard/customers`, etc.)
3. **UI/UX Components**: Complete design system with shadcn/ui
4. **GraphQL Infrastructure**:
   - ✅ URQL client configured (`apps/admin/lib/graphql-client.ts`)
   - ✅ All GraphQL queries defined (`apps/admin/lib/graphql-operations.ts`)
   - ✅ Hasura authentication setup

## ❌ What's NOT Working (CRITICAL)

### All Dashboard Pages Use MOCK DATA Only

**Current State**: Every page displays hardcoded arrays instead of fetching from Hasura GraphQL

**Affected Pages**:
1. `app/dashboard/page.tsx` - Main dashboard
2. `app/dashboard/customers/page.tsx` - Customer list
3. `app/dashboard/cards/page.tsx` - Card list
4. `app/dashboard/transactions/page.tsx` - Transaction list
5. `app/dashboard/merchants/page.tsx` - Merchant list
6. `app/dashboard/terminals/page.tsx` - Terminal list
7. `app/dashboard/reports/page.tsx` - Reports dashboard
8. `app/dashboard/analytics/page.tsx` - Analytics dashboard

### Example of Current Problem

**File**: `apps/admin/app/dashboard/customers/page.tsx`

```typescript
// ❌ CURRENT: Hardcoded mock data
export default function CustomersPage() {
  const customers = [
    {
      id: 'CUST-001',
      name: 'John Mugisha',
      email: 'john.m@email.com',
      // ... hardcoded values
    },
  ]

  return (
    <div>
      {customers.map(customer => (
        <div>{customer.name}</div>
      ))}
    </div>
  )
}
```

**Should Be**:
```typescript
// ✅ SHOULD BE: Using GraphQL query
import { useQuery } from 'urql'
import { GET_CUSTOMERS } from '@/lib/graphql-operations'

export default function CustomersPage() {
  const [result] = useQuery({ query: GET_CUSTOMERS })

  if (result.fetching) return <Loading />
  if (result.error) return <Error error={result.error} />

  const customers = result.data?.customers || []

  return (
    <div>
      {customers.map(customer => (
        <div>{customer.full_name}</div>
      ))}
    </div>
  )
}
```

## 🔧 What Needs to Be Implemented

### Phase 1: Connect to GraphQL (URGENT)

Replace mock data with actual GraphQL queries in:

#### 1. Main Dashboard (`app/dashboard/page.tsx`)
- [ ] Fetch dashboard statistics using GraphQL aggregations
- [ ] Recent transactions from `transactions` table
- [ ] Active cards count from `cards` table
- [ ] Total customers count from `customers` table
- [ ] Revenue metrics from `transactions` table

#### 2. Customers Page (`app/dashboard/customers/page.tsx`)
- [ ] Replace mock data with `GET_CUSTOMERS` query
- [ ] Implement pagination using GraphQL offset/limit
- [ ] Add search functionality using GraphQL where clause
- [ ] Add filters (status, date range)
- [ ] Connect "Add Customer" button to `CREATE_CUSTOMER` mutation

#### 3. Cards Page (`app/dashboard/cards/page.tsx`)
- [ ] Replace mock data with `GET_CARDS` query
- [ ] Implement pagination
- [ ] Add search by card UID
- [ ] Add filters (status, card type)
- [ ] Connect card actions (block, unblock, update balance)

#### 4. Transactions Page (`app/dashboard/transactions/page.tsx`)
- [ ] Replace mock data with `GET_TRANSACTIONS` query
- [ ] Implement pagination
- [ ] Add date range filter
- [ ] Add amount range filter
- [ ] Add transaction type filter
- [ ] Export functionality

#### 5. Merchants Page (`app/dashboard/merchants/page.tsx`)
- [ ] Replace mock data with `GET_MERCHANTS` query
- [ ] Add/edit/delete merchant functionality
- [ ] Merchant verification workflow
- [ ] Commission settings

#### 6. Terminals Page (`app/dashboard/terminals/page.tsx`)
- [ ] Replace mock data with `GET_TERMINALS` query
- [ ] Terminal registration
- [ ] Terminal status management
- [ ] Assign terminals to merchants

### Phase 2: Drill-Down Pages (MISSING)

Create detail pages that don't exist yet:

#### Customer Detail Page
**Route**: `/dashboard/customers/[id]/page.tsx`
- [ ] Customer profile information
- [ ] Customer's cards list
- [ ] Transaction history
- [ ] Balance summary
- [ ] Edit customer form
- [ ] Card issuance button

#### Card Detail Page
**Route**: `/dashboard/cards/[uid]/page.tsx`
- [ ] Card information
- [ ] Owner details
- [ ] Transaction history for this card
- [ ] Balance operations (credit/debit)
- [ ] Block/unblock controls
- [ ] Card replacement workflow

#### Transaction Detail Page
**Route**: `/dashboard/transactions/[id]/page.tsx`
- [ ] Full transaction details
- [ ] Card used
- [ ] Merchant/terminal information
- [ ] Timestamp
- [ ] Receipt download
- [ ] Refund capability

#### Merchant Detail Page
**Route**: `/dashboard/merchants/[id]/page.tsx`
- [ ] Merchant information
- [ ] Terminals assigned
- [ ] Transaction volume
- [ ] Commission reports
- [ ] Settlement history

#### Terminal Detail Page
**Route**: `/dashboard/terminals/[id]/page.tsx`
- [ ] Terminal specifications
- [ ] Status and health
- [ ] Assigned merchant
- [ ] Transaction log
- [ ] Configuration settings

### Phase 3: CRUD Operations (MISSING)

Implement create/update/delete functionality:

#### Customer Management
- [ ] Create customer form with validation
- [ ] Update customer information
- [ ] Deactivate/activate customer
- [ ] Delete customer (with safeguards)

#### Card Management
- [ ] Issue new card to customer
- [ ] Update card status
- [ ] Replace lost/damaged card
- [ ] Transfer card balance
- [ ] Permanently deactivate card

#### Merchant Management
- [ ] Register new merchant
- [ ] Update merchant details
- [ ] Verify merchant documents
- [ ] Set commission rates
- [ ] Suspend/reactivate merchant

#### Terminal Management
- [ ] Register new terminal
- [ ] Assign terminal to merchant
- [ ] Update terminal configuration
- [ ] Decommission terminal

### Phase 4: Missing Features

#### Authentication
- [ ] Login page (`/login`)
- [ ] Protected routes middleware
- [ ] Session management
- [ ] Role-based access control (admin, operator, viewer)
- [ ] Password reset flow

#### Bulk Operations
- [ ] Bulk card issuance
- [ ] Bulk balance updates
- [ ] CSV import for customers
- [ ] Bulk transaction export

#### Reports & Analytics
- [ ] Daily transaction report
- [ ] Revenue by merchant
- [ ] Top customers by transaction volume
- [ ] Card usage statistics
- [ ] Export to PDF/Excel

#### Real-time Features
- [ ] Live transaction feed
- [ ] Push notifications for large transactions
- [ ] Real-time dashboard updates
- [ ] WebSocket connection for live data

## 🚀 Immediate Next Steps

### Step 1: Set Environment Variables in Railway

**CRITICAL**: Add these in Railway dashboard → Variables:

```bash
NEXT_PUBLIC_HASURA_URL=https://your-hasura-instance.hasura.app/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_secure_admin_secret
DATABASE_URL=postgres://user:pass@host:port/kiaan_pos_wallet
JWT_SECRET=your_jwt_secret_min_32_characters
NEXT_PUBLIC_APP_URL=https://pos-production-bae1.up.railway.app
```

### Step 2: Fix Customers Page (Proof of Concept)

Update `apps/admin/app/dashboard/customers/page.tsx`:
- Replace mock data with `useQuery({ query: GET_CUSTOMERS })`
- Add loading state
- Add error handling
- Verify data displays correctly

### Step 3: Apply Same Pattern to All Pages

Once customers page works:
1. Cards page
2. Transactions page
3. Dashboard statistics
4. Merchants page
5. Terminals page

### Step 4: Implement Drill-Down Pages

Create customer detail page as template:
- Create `/dashboard/customers/[id]/page.tsx`
- Fetch customer by ID
- Display related data (cards, transactions)
- Test navigation flow

### Step 5: Add CRUD Operations

Start with customer creation:
- Create customer form component
- Wire up `CREATE_CUSTOMER` mutation
- Add validation
- Show success/error messages

## 📊 Current vs. Target State

### Current State
```
User clicks "Customers" → Sees hardcoded list of 5 fake customers
User clicks customer row → Nothing happens (no detail page)
User clicks "Add Customer" → Nothing happens (no form)
User searches → Filters hardcoded array (not real search)
```

### Target State
```
User clicks "Customers" → Sees real customers from database via GraphQL
User clicks customer row → Navigates to detail page with full info
User clicks "Add Customer" → Opens form, creates real customer in DB
User searches → GraphQL query with where clause returns filtered results
```

## 🔍 How to Test Currently

### Test GraphQL Connection Separately

```bash
# In browser console on Railway deployment
fetch('https://your-hasura.hasura.app/v1/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'your_admin_secret'
  },
  body: JSON.stringify({
    query: `{ customers { id full_name email } }`
  })
})
.then(r => r.json())
.then(console.log)
```

Expected: Real customer data from database
Current: May fail if env vars not set in Railway

## ⚠️ Blockers

1. **Environment Variables**: Not set in Railway yet
   - Cannot connect to Hasura without `NEXT_PUBLIC_HASURA_URL`
   - Cannot authenticate without `NEXT_PUBLIC_HASURA_ADMIN_SECRET`

2. **Hasura Instance**: Unknown if deployed
   - Is Hasura running?
   - Is database schema initialized?
   - Are tables tracked in Hasura?

3. **Database**: Unknown if production DB exists
   - Are migrations run?
   - Is seed data loaded?
   - Is connection string available?

## 📝 Summary

**Problem**: Admin dashboard is a **UI prototype only**. Zero backend integration.

**Root Cause**: Pages were built with static mock data, GraphQL queries exist but aren't used.

**Impact**: No functionality - can't view real data, can't create/edit/delete, no drill-down pages.

**Solution**: Connect all pages to GraphQL, implement CRUD operations, create detail pages.

**Estimated Effort**:
- Phase 1 (GraphQL connection): 4-6 hours
- Phase 2 (Drill-down pages): 6-8 hours
- Phase 3 (CRUD operations): 8-12 hours
- Phase 4 (Missing features): 12-16 hours

**Total**: ~30-42 hours to full functionality

---

**Last Updated**: 2025-11-22
**Status**: 🔴 Dashboard deployed but non-functional
**Priority**: 🚨 CRITICAL - Replace mock data with real GraphQL queries
