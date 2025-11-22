'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Wallet,
  Smartphone,
  DollarSign,
  TrendingUp,
  User,
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function TopUpsPage() {
  const [filterMethod, setFilterMethod] = useState('all')

  // Mock top-up data
  const topUps = [
    {
      id: 'TOPUP-001234',
      customer: 'Sarah Nakato',
      cardUid: 'CARD-002-ENT',
      amount: 125000,
      method: 'MTN Mobile Money',
      reference: 'MM-12345678',
      timestamp: '2025-11-22 14:15:42',
      status: 'completed',
      branch: 'Entebbe',
    },
    {
      id: 'TOPUP-001235',
      customer: 'Grace Nambi',
      cardUid: 'CARD-004-KMP',
      amount: 78000,
      method: 'Airtel Money',
      reference: 'AM-87654321',
      timestamp: '2025-11-22 12:30:10',
      status: 'completed',
      branch: 'Kampala Main',
    },
    {
      id: 'TOPUP-001236',
      customer: 'James Ochieng',
      cardUid: 'CARD-007-ENT',
      amount: 200000,
      method: 'Cash',
      reference: 'CASH-001',
      timestamp: '2025-11-22 09:45:18',
      status: 'completed',
      branch: 'Entebbe',
    },
    {
      id: 'TOPUP-001237',
      customer: 'John Mugisha',
      cardUid: 'CARD-001-KMP',
      amount: 150000,
      method: 'Bank Transfer',
      reference: 'BT-456789',
      timestamp: '2025-11-22 08:20:05',
      status: 'completed',
      branch: 'Kampala Main',
    },
    {
      id: 'TOPUP-001238',
      customer: 'Betty Namusoke',
      cardUid: 'CARD-006-KMP',
      amount: 95000,
      method: 'MTN Mobile Money',
      reference: 'MM-99887766',
      timestamp: '2025-11-22 07:15:30',
      status: 'pending',
      branch: 'Kampala Main',
    },
    {
      id: 'TOPUP-001239',
      customer: 'Michael Ssali',
      cardUid: 'CARD-005-MBR',
      amount: 50000,
      method: 'Airtel Money',
      reference: 'AM-11223344',
      timestamp: '2025-11-22 06:45:12',
      status: 'failed',
      branch: 'Mbarara',
    },
  ]

  const stats = {
    todayTotal: topUps
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    todayCount: topUps.filter((t) => t.status === 'completed').length,
    pending: topUps.filter((t) => t.status === 'pending').length,
    failed: topUps.filter((t) => t.status === 'failed').length,
    mtnTotal: topUps
      .filter((t) => t.method === 'MTN Mobile Money' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    airtelTotal: topUps
      .filter((t) => t.method === 'Airtel Money' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
  }

  const filteredTopUps = topUps.filter(
    (topup) => filterMethod === 'all' || topup.method === filterMethod
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Top-Up Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor card top-ups from all payment methods
          </p>
        </div>
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
                Today's Total
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayCount}</div>
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
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
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
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed}</div>
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
              <CardTitle className="text-sm font-medium">MTN MoMo</CardTitle>
              <Smartphone className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.mtnTotal / 1000000).toFixed(1)}M
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
              <CardTitle className="text-sm font-medium">
                Airtel Money
              </CardTitle>
              <Smartphone className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.airtelTotal / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterMethod('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterMethod === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Methods
            </button>
            <button
              onClick={() => setFilterMethod('MTN Mobile Money')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterMethod === 'MTN Mobile Money'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              MTN MoMo
            </button>
            <button
              onClick={() => setFilterMethod('Airtel Money')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterMethod === 'Airtel Money'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Airtel Money
            </button>
            <button
              onClick={() => setFilterMethod('Cash')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterMethod === 'Cash'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => setFilterMethod('Bank Transfer')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterMethod === 'Bank Transfer'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bank Transfer
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Top-Ups List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Top-Ups</CardTitle>
          <CardDescription>
            Showing {filteredTopUps.length} of {topUps.length} top-ups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTopUps.map((topup, index) => (
              <motion.div
                key={topup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {topup.id}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {topup.customer}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {topup.cardUid}
                      </span>
                      <span className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        {topup.method}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(topup.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-mono text-gray-500">
                      Ref: {topup.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    +UGX {topup.amount.toLocaleString()}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                      topup.status
                    )}`}
                  >
                    {getStatusIcon(topup.status)}
                    {topup.status.toUpperCase()}
                  </span>
                  <p className="mt-1 text-xs text-gray-500">{topup.branch}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
