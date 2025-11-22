'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Plus,
  Lock,
  Unlock,
  TrendingUp,
  Calendar,
  Receipt,
  Activity,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  // Mock customer data - in real app, fetch by ID
  const customerData = {
    'CUST-001': {
      id: 'CUST-001',
      name: 'John Mugisha',
      email: 'john.m@email.com',
      phone: '+256 772 123456',
      location: 'Kampala',
      joinedDate: '2024-01-15',
      status: 'active',
      cards: [
        {
          uid: 'CARD-001-KMP',
          balance: 245000,
          status: 'active',
          dailyLimit: 500000,
          issueDate: '2024-01-15',
        },
        {
          uid: 'CARD-009-KMP',
          balance: 89000,
          status: 'active',
          dailyLimit: 300000,
          issueDate: '2024-02-20',
        },
      ],
      transactions: [
        { id: 'TXN-1234', date: '2024-11-22 14:30', merchant: 'Nakumatt Supermarket', amount: -45000, type: 'purchase', status: 'completed' },
        { id: 'TXN-1233', date: '2024-11-22 10:15', merchant: 'Mobile Money', amount: 100000, type: 'top-up', status: 'completed' },
        { id: 'TXN-1232', date: '2024-11-21 18:45', merchant: 'Shell Fuel Station', amount: -80000, type: 'purchase', status: 'completed' },
        { id: 'TXN-1231', date: '2024-11-21 12:20', merchant: 'Java House Coffee', amount: -12500, type: 'purchase', status: 'completed' },
        { id: 'TXN-1230', date: '2024-11-20 16:30', merchant: 'Game Stores', amount: -156000, type: 'purchase', status: 'completed' },
      ],
    },
    'CUST-002': {
      id: 'CUST-002',
      name: 'Sarah Nakato',
      email: 'sarah.n@email.com',
      phone: '+256 772 234567',
      location: 'Entebbe',
      joinedDate: '2024-02-10',
      status: 'active',
      cards: [
        {
          uid: 'CARD-002-ENT',
          balance: 567000,
          status: 'active',
          dailyLimit: 1000000,
          issueDate: '2024-02-10',
        },
      ],
      transactions: [
        { id: 'TXN-2234', date: '2024-11-22 15:20', merchant: 'Shoprite', amount: -78000, type: 'purchase', status: 'completed' },
        { id: 'TXN-2233', date: '2024-11-22 09:00', merchant: 'Mobile Money', amount: 200000, type: 'top-up', status: 'completed' },
        { id: 'TXN-2232', date: '2024-11-21 17:30', merchant: 'Cafe Javas', amount: -23000, type: 'purchase', status: 'completed' },
      ],
    },
  }

  const customer = customerData[customerId as keyof typeof customerData] || customerData['CUST-001']

  const stats = {
    totalCards: customer.cards.length,
    activeCards: customer.cards.filter((c) => c.status === 'active').length,
    totalBalance: customer.cards.reduce((sum, c) => sum + c.balance, 0),
    totalTransactions: customer.transactions.length,
    totalSpent: customer.transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalTopUps: customer.transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      {/* Customer Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-2xl">
                  {customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {customer.name}
                  </h1>
                  <p className="text-gray-500 mt-1">{customer.id}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {customer.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${
                    customer.status === 'active'
                      ? 'border-green-200 bg-green-100 text-green-700'
                      : 'border-gray-200 bg-gray-100 text-gray-700'
                  }`}
                >
                  {customer.status === 'active' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  <Plus className="inline h-4 w-4 mr-1" />
                  Add Card
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCards}</div>
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
              <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCards}</div>
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
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalBalance / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
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
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalSpent / 1000).toFixed(0)}K
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
              <CardTitle className="text-sm font-medium">Total Top-Ups</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalTopUps / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Receipt className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>All cards linked to this customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.cards.map((card, index) => (
                <Link
                  key={card.uid}
                  href={`/dashboard/cards/${card.uid}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {card.uid}
                        </p>
                        <p className="text-xs text-gray-500">
                          Issued {new Date(card.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        UGX {card.balance.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Limit: {(card.dailyLimit / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.transactions.map((txn, index) => (
                <Link
                  key={txn.id}
                  href={`/dashboard/transactions/${txn.id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          txn.type === 'top-up'
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {txn.type === 'top-up' ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <Receipt className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {txn.merchant}
                        </p>
                        <p className="text-xs text-gray-500">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          txn.amount > 0 ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {txn.amount > 0 ? '+' : ''}
                        {txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {txn.type}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Customer journey and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Account Created
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(customer.joinedDate).toLocaleDateString()} - Customer joined
                    Kiaan POS
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    First Card Issued
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(customer.cards[0].issueDate).toLocaleDateString()} -{' '}
                    {customer.cards[0].uid}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {stats.totalTransactions} Transactions Completed
                  </p>
                  <p className="text-xs text-gray-500">
                    Total value: UGX {(stats.totalSpent + stats.totalTopUps).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
