'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Receipt,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Wallet,
  ArrowUpRight,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function BranchDashboardPage() {
  // Mock branch-specific data
  const branchInfo = {
    id: 'BRN-001',
    name: 'Kampala Main',
    location: 'Plot 45, Kampala Road, Kampala',
    manager: 'Alice Nambi',
    phone: '+256 772 111222',
    email: 'kampala@kiaan.com',
  }

  const stats = {
    activeCards: 523,
    todayRevenue: 2450000,
    transactionsToday: 342,
    staff: 12,
    pendingTopUps: 3,
    avgTransaction: 7163,
  }

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'John Mugisha',
      amount: 45000,
      type: 'purchase',
      time: '2 minutes ago',
    },
    {
      id: 'TXN-002',
      customer: 'Sarah Nakato',
      amount: 125000,
      type: 'top-up',
      time: '15 minutes ago',
    },
    {
      id: 'TXN-003',
      customer: 'Grace Nambi',
      amount: 78000,
      type: 'purchase',
      time: '1 hour ago',
    },
  ]

  const topStaff = [
    { name: 'Alice Nambi', transactions: 156, revenue: 8750000 },
    { name: 'Peter Ssemakula', transactions: 98, revenue: 5240000 },
    { name: 'Sarah Tumwine', transactions: 88, revenue: 4680000 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-bold">{branchInfo.name}</h1>
                <p className="text-purple-100">Branch Dashboard</p>
              </div>
            </div>
            <Building2 className="h-12 w-12" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Branch Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle>Branch Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700">{branchInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700">
                      Manager: {branchInfo.manager}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700">{branchInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span className="text-gray-700">{branchInfo.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Today's Revenue
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    UGX {(stats.todayRevenue / 1000000).toFixed(2)}M
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +15.3%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      from yesterday
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transactions Today
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.transactionsToday}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: UGX {stats.avgTransaction.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Cards
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeCards}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.staff} staff members
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest activities at this branch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((txn) => (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              txn.type === 'top-up'
                                ? 'bg-green-100'
                                : 'bg-blue-100'
                            }`}
                          >
                            {txn.type === 'top-up' ? (
                              <Wallet className="h-5 w-5 text-green-600" />
                            ) : (
                              <Receipt className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{txn.customer}</p>
                            <p className="text-xs text-gray-500">{txn.time}</p>
                          </div>
                        </div>
                        <p
                          className={`text-sm font-semibold ${
                            txn.type === 'top-up'
                              ? 'text-green-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {txn.type === 'top-up' ? '+' : '-'}UGX{' '}
                          {txn.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Staff */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Staff</CardTitle>
                  <CardDescription>Staff performance today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topStaff.map((staff, index) => (
                      <div
                        key={staff.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{staff.name}</p>
                            <p className="text-xs text-gray-500">
                              {staff.transactions} transactions
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold">
                          UGX {(staff.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
