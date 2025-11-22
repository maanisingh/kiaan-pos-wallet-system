'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import { Store, TrendingUp, Receipt, CreditCard, DollarSign, Users, Clock, AlertCircle, CheckCircle, Download, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function MerchantDashboard() {
  const [timeRange, setTimeRange] = useState('today')

  // Mock merchant data
  const merchantInfo = {
    name: 'Nakumatt Supermarket',
    id: 'MER-001',
    location: 'Garden City, Kampala',
    commissionRate: 2.5,
  }

  const stats = {
    todaySales: 4560000,
    todayTransactions: 542,
    settlementPending: 4448400, // After 2.5% commission
    activeTerminals: 8,
    monthlyRevenue: 89400000,
    monthlyTransactions: 12453,
  }

  const recentTransactions = [
    { id: 'TXN-1234', time: '2 minutes ago', customer: 'Customer ending in 0234', amount: 45000, status: 'completed' },
    { id: 'TXN-1233', time: '8 minutes ago', customer: 'Customer ending in 0187', amount: 125000, status: 'completed' },
    { id: 'TXN-1232', time: '15 minutes ago', customer: 'Customer ending in 0456', amount: 67000, status: 'completed' },
    { id: 'TXN-1231', time: '23 minutes ago', customer: 'Customer ending in 0789', amount: 234000, status: 'completed' },
    { id: 'TXN-1230', time: '35 minutes ago', customer: 'Customer ending in 0321', amount: 89000, status: 'completed' },
  ]

  const terminals = [
    { id: 'TRM-001', serialNumber: 'KPN-2024-001-KLA', status: 'online', transactionsToday: 89, lastActivity: '2 minutes ago' },
    { id: 'TRM-002', serialNumber: 'KPN-2024-009-KLA', status: 'online', transactionsToday: 76, lastActivity: '5 minutes ago' },
    { id: 'TRM-003', serialNumber: 'KPN-2024-012-KLA', status: 'online', transactionsToday: 123, lastActivity: '1 minute ago' },
    { id: 'TRM-004', serialNumber: 'KPN-2024-015-KLA', status: 'offline', transactionsToday: 0, lastActivity: '2 hours ago' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{merchantInfo.name}</h1>
                <p className="text-sm text-gray-600">{merchantInfo.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Merchant ID: {merchantInfo.id}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link href="/" className="border-b-2 border-green-600 px-1 py-4 text-sm font-semibold text-green-600">
              Dashboard
            </Link>
            <Link href="/transactions" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Transactions
            </Link>
            <Link href="/terminals" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Terminals
            </Link>
            <Link href="/settlements" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Settlements
            </Link>
            <Link href="/reports" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Reports
            </Link>
            <Link href="/settings" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Today's Performance</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeRange('today')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 'today'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 'week'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                timeRange === 'month'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {(stats.todaySales / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Receipt className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayTransactions}</div>
                <p className="text-xs text-muted-foreground">+8.2% from yesterday</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Settlement</CardTitle>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">UGX {(stats.settlementPending / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">After {merchantInfo.commissionRate}% commission</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
                <CreditCard className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{terminals.filter(t => t.status === 'online').length}/{stats.activeTerminals}</div>
                <p className="text-xs text-muted-foreground">Terminals online</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest payments received at your store</CardDescription>
                  </div>
                  <Link href="/transactions" className="text-sm font-medium text-green-600 hover:text-green-700">
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((txn, index) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Receipt className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{txn.customer}</p>
                          <p className="text-sm text-gray-600">{txn.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">UGX {txn.amount.toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          {txn.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terminal Status */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Terminal Status</CardTitle>
                <CardDescription>Real-time device monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {terminals.map((terminal) => (
                    <div key={terminal.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-mono text-sm font-medium text-gray-900">{terminal.serialNumber}</p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                            terminal.status === 'online'
                              ? 'border-green-200 bg-green-100 text-green-700'
                              : 'border-red-200 bg-red-100 text-red-700'
                          }`}
                        >
                          {terminal.status === 'online' ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {terminal.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{terminal.transactionsToday} txns today</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {terminal.lastActivity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left hover:bg-gray-50">
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Download Report</span>
                </button>
                <button className="w-full flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left hover:bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Request Settlement</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
