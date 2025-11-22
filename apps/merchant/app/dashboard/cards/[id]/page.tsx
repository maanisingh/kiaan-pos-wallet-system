'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  ArrowLeft,
  CreditCard,
  User,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CardDetailPage() {
  const params = useParams()
  const cardId = params.id as string

  // Mock card data
  const cardData = {
    'CARD-001-KMP': {
      uid: 'CARD-001-KMP',
      customer: { id: 'CUST-001', name: 'John Mugisha', email: 'john.m@email.com' },
      balance: 245000,
      status: 'active',
      dailyLimit: 500000,
      todaySpent: 125000,
      issueDate: '2024-01-15',
      expiryDate: '2027-01-15',
      lastUsed: '2 hours ago',
      pin: '****',
      transactions: [
        { id: 'TXN-1234', date: '2024-11-22 14:30', merchant: 'Nakumatt Supermarket', amount: -45000, status: 'completed' },
        { id: 'TXN-1230', date: '2024-11-22 10:15', merchant: 'Shell Fuel Station', amount: -80000, status: 'completed' },
        { id: 'TXN-1229', date: '2024-11-21 18:45', merchant: 'Java House Coffee', amount: -12500, status: 'completed' },
        { id: 'TXN-1228', date: '2024-11-21 12:20', merchant: 'Game Stores', amount: -156000, status: 'completed' },
        { id: 'TXN-1227', date: '2024-11-20 16:30', merchant: 'Shoprite', amount: -67000, status: 'completed' },
        { id: 'TXN-1226', date: '2024-11-20 09:15', merchant: 'Cafe Javas', amount: -23000, status: 'completed' },
        { id: 'TXN-1225', date: '2024-11-19 14:00', merchant: 'Total Energies', amount: -95000, status: 'completed' },
        { id: 'TXN-1224', date: '2024-11-19 11:30', merchant: 'Capital Shoppers', amount: -34000, status: 'completed' },
      ],
    },
    'CARD-002-ENT': {
      uid: 'CARD-002-ENT',
      customer: { id: 'CUST-002', name: 'Sarah Nakato', email: 'sarah.n@email.com' },
      balance: 567000,
      status: 'active',
      dailyLimit: 1000000,
      todaySpent: 320000,
      issueDate: '2024-02-10',
      expiryDate: '2027-02-10',
      lastUsed: '15 minutes ago',
      pin: '****',
      transactions: [
        { id: 'TXN-2234', date: '2024-11-22 15:20', merchant: 'Shoprite', amount: -78000, status: 'completed' },
        { id: 'TXN-2233', date: '2024-11-22 11:45', merchant: 'Shell Fuel Station', amount: -120000, status: 'completed' },
        { id: 'TXN-2232', date: '2024-11-21 17:30', merchant: 'Cafe Javas', amount: -23000, status: 'completed' },
        { id: 'TXN-2231', date: '2024-11-21 13:00', merchant: 'Nakumatt Supermarket', amount: -89000, status: 'completed' },
        { id: 'TXN-2230', date: '2024-11-20 16:20', merchant: 'Game Stores', amount: -145000, status: 'completed' },
      ],
    },
  }

  const card = cardData[cardId as keyof typeof cardData] || cardData['CARD-001-KMP']

  const stats = {
    totalTransactions: card.transactions.length,
    totalSpent: card.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0),
    avgTransaction: card.transactions.length > 0
      ? card.transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / card.transactions.length
      : 0,
    dailyUsage: (card.todaySpent / card.dailyLimit) * 100,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'inactive':
        return <AlertCircle className="h-5 w-5 text-gray-600" />
      case 'blocked':
      case 'lost':
      case 'stolen':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      blocked: 'bg-red-100 text-red-700 border-red-200',
      lost: 'bg-red-100 text-red-700 border-red-200',
      stolen: 'bg-red-100 text-red-700 border-red-200',
    }
    return styles[status as keyof typeof styles] || styles.inactive
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/cards"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cards
      </Link>

      {/* Card Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-mono text-gray-900">
                    {card.uid}
                  </h1>
                  <Link
                    href={`/dashboard/customers/${card.customer.id}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <User className="h-4 w-4" />
                    {card.customer.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    Issued {new Date(card.issueDate).toLocaleDateString()} • Expires{' '}
                    {new Date(card.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${getStatusBadge(
                    card.status
                  )}`}
                >
                  {getStatusIcon(card.status)}
                  {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </span>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Settings className="inline h-4 w-4 mr-1" />
                  Settings
                </button>
                {card.status === 'active' ? (
                  <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Block Card
                  </button>
                ) : (
                  <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                    <Unlock className="inline h-4 w-4 mr-1" />
                    Unblock Card
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(card.balance / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
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
              <CardTitle className="text-sm font-medium">Daily Limit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(card.dailyLimit / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
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
              <CardTitle className="text-sm font-medium">Today's Spent</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(card.todaySpent / 1000).toFixed(0)}K
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${stats.dailyUsage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.dailyUsage.toFixed(1)}% of limit
              </p>
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
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
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
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <Activity className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.avgTransaction / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              All transactions for this card ({stats.totalTransactions} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {card.transactions.map((txn, index) => (
                <Link
                  key={txn.id}
                  href={`/dashboard/transactions/${txn.id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {txn.merchant}
                        </p>
                        <p className="text-xs text-gray-500">{txn.date}</p>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle className="h-3 w-3" />
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        UGX {Math.abs(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">ID: {txn.id}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Card Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
            <CardDescription>Configuration and security information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Card Information
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Card UID:</dt>
                    <dd className="text-sm font-mono font-semibold text-gray-900">
                      {card.uid}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Issue Date:</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {new Date(card.issueDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Expiry Date:</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {new Date(card.expiryDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Last Used:</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {card.lastUsed}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Security & Limits
                </h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">PIN Status:</dt>
                    <dd className="text-sm font-semibold text-green-600">Active {card.pin}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Daily Limit:</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      UGX {card.dailyLimit.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Total Spent:</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      UGX {stats.totalSpent.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Status:</dt>
                    <dd>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadge(
                          card.status
                        )}`}
                      >
                        {getStatusIcon(card.status)}
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
