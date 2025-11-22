'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Receipt,
  Search,
  Filter,
  Download,
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  User,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-2025-001234',
      type: 'purchase',
      amount: 45000,
      customer: 'John Mugisha',
      cardUid: 'CARD-001-KMP',
      branch: 'Kampala Main',
      staff: 'Alice Nambi',
      timestamp: '2025-11-22 14:30:15',
      status: 'completed',
      description: 'Grocery purchase',
    },
    {
      id: 'TXN-2025-001235',
      type: 'top-up',
      amount: 125000,
      customer: 'Sarah Nakato',
      cardUid: 'CARD-002-ENT',
      branch: 'Entebbe',
      staff: 'System (MTN Mobile Money)',
      timestamp: '2025-11-22 14:15:42',
      status: 'completed',
      description: 'MTN Mobile Money top-up',
    },
    {
      id: 'TXN-2025-001236',
      type: 'purchase',
      amount: 32500,
      customer: 'David Okello',
      cardUid: 'CARD-003-JNJ',
      branch: 'Jinja',
      staff: 'Peter Okot',
      timestamp: '2025-11-22 13:45:20',
      status: 'completed',
      description: 'Restaurant payment',
    },
    {
      id: 'TXN-2025-001237',
      type: 'top-up',
      amount: 78000,
      customer: 'Grace Nambi',
      cardUid: 'CARD-004-KMP',
      branch: 'Kampala Main',
      staff: 'System (Airtel Money)',
      timestamp: '2025-11-22 12:30:10',
      status: 'completed',
      description: 'Airtel Money top-up',
    },
    {
      id: 'TXN-2025-001238',
      type: 'purchase',
      amount: 15000,
      customer: 'Michael Ssali',
      cardUid: 'CARD-005-MBR',
      branch: 'Mbarara',
      staff: 'James Byaruhanga',
      timestamp: '2025-11-22 11:20:05',
      status: 'completed',
      description: 'Fuel purchase',
    },
    {
      id: 'TXN-2025-001239',
      type: 'purchase',
      amount: 250000,
      customer: 'Betty Namusoke',
      cardUid: 'CARD-006-KMP',
      branch: 'Kampala Main',
      staff: 'Alice Nambi',
      timestamp: '2025-11-22 10:15:30',
      status: 'failed',
      description: 'Insufficient balance',
    },
    {
      id: 'TXN-2025-001240',
      type: 'top-up',
      amount: 200000,
      customer: 'James Ochieng',
      cardUid: 'CARD-007-ENT',
      branch: 'Entebbe',
      staff: 'System (Cash)',
      timestamp: '2025-11-22 09:45:18',
      status: 'completed',
      description: 'Cash top-up',
    },
    {
      id: 'TXN-2025-001241',
      type: 'purchase',
      amount: 67000,
      customer: 'Patricia Akello',
      cardUid: 'CARD-008-JNJ',
      branch: 'Jinja',
      staff: 'Peter Okot',
      timestamp: '2025-11-22 08:30:45',
      status: 'completed',
      description: 'Shopping',
    },
  ]

  const stats = {
    todayTotal: transactions
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    todayCount: transactions.filter((t) => t.status === 'completed').length,
    todayPurchases: transactions.filter(
      (t) => t.type === 'purchase' && t.status === 'completed'
    ).length,
    todayTopUps: transactions.filter(
      (t) => t.type === 'top-up' && t.status === 'completed'
    ).length,
    failedCount: transactions.filter((t) => t.status === 'failed').length,
    avgTransaction:
      transactions
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) /
      transactions.filter((t) => t.status === 'completed').length,
  }

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.cardUid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.branch.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || txn.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Transaction History
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time transaction monitoring and analytics
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md">
          <Download className="h-5 w-5" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Volume
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.todayTotal / 1000000).toFixed(2)}M
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transactions
              </CardTitle>
              <Receipt className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayCount}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
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
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayPurchases}</div>
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
              <CardTitle className="text-sm font-medium">Top-Ups</CardTitle>
              <Wallet className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayTopUps}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Amount
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.avgTransaction / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <Receipt className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failedCount}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, customer, card, or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('purchase')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterType === 'purchase'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setFilterType('top-up')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterType === 'top-up'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Top-Ups
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length}{' '}
            transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((txn, index) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      txn.type === 'top-up'
                        ? 'bg-green-100'
                        : txn.status === 'failed'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {txn.type === 'top-up' ? (
                      <ArrowDownRight
                        className={`h-6 w-6 ${
                          txn.status === 'failed'
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      />
                    ) : (
                      <ArrowUpRight
                        className={`h-6 w-6 ${
                          txn.status === 'failed'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {txn.id}
                    </p>
                    <p className="text-sm text-gray-600">{txn.description}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {txn.customer}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {txn.cardUid}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {txn.branch}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(txn.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      txn.status === 'failed'
                        ? 'text-red-600'
                        : txn.type === 'top-up'
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {txn.type === 'top-up' ? '+' : '-'}UGX{' '}
                    {txn.amount.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      txn.status === 'completed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {txn.status.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{txn.staff}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
