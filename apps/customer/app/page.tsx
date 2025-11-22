'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import { Wallet, CreditCard, History, TrendingUp, Plus, Send, Download, QrCode, Shield, Clock, MapPin, Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function CustomerPortal() {
  const [showQR, setShowQR] = useState(false)

  // Mock customer data
  const customerData = {
    name: 'John Kamau',
    cardNumber: 'KPN-2024-5678',
    balance: 125000,
    dailyLimit: 50000,
    spentToday: 23500,
  }

  const recentTransactions = [
    { id: 'TXN-5678', merchant: 'Nakumatt Supermarket', location: 'Garden City', amount: -12500, time: '10 minutes ago', type: 'purchase' },
    { id: 'TXN-5677', merchant: 'MTN Mobile Money', location: 'Online', amount: 50000, time: '2 hours ago', type: 'topup' },
    { id: 'TXN-5676', merchant: 'Java House', location: 'Acacia Mall', amount: -8500, time: '5 hours ago', type: 'purchase' },
    { id: 'TXN-5675', merchant: 'Carrefour', location: 'Oasis Mall', amount: -15600, time: 'Yesterday', type: 'purchase' },
    { id: 'TXN-5674', merchant: 'Airtel Money', location: 'Online', amount: 30000, time: '2 days ago', type: 'topup' },
  ]

  const quickActions = [
    { icon: Plus, label: 'Top Up', description: 'Add money to wallet', color: 'green' },
    { icon: Send, label: 'Transfer', description: 'Send to another card', color: 'blue' },
    { icon: QrCode, label: 'Show QR', description: 'Quick payment code', color: 'purple' },
    { icon: Download, label: 'Statement', description: 'Download history', color: 'orange' },
  ]

  const remainingLimit = customerData.dailyLimit - customerData.spentToday
  const limitPercentage = (customerData.spentToday / customerData.dailyLimit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
                <p className="text-sm text-gray-600">Welcome back, {customerData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Shield className="inline-block h-4 w-4 mr-2" />
                Security
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link href="/" className="border-b-2 border-blue-600 px-1 py-4 text-sm font-semibold text-blue-600">
              Dashboard
            </Link>
            <Link href="/transactions" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Transactions
            </Link>
            <Link href="/cards" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              My Cards
            </Link>
            <Link href="/topup" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Top Up
            </Link>
            <Link href="/settings" className="px-1 py-4 text-sm font-medium text-gray-600 hover:text-gray-900">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-blue-100">Available Balance</p>
                <h2 className="text-5xl font-bold">UGX {customerData.balance.toLocaleString()}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Wallet className="h-8 w-8" />
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-200" />
              <span className="font-mono text-lg">{customerData.cardNumber}</span>
            </div>

            {/* Daily Limit Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Daily Spending Limit</span>
                <span className="font-semibold">
                  UGX {customerData.spentToday.toLocaleString()} / {customerData.dailyLimit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{ width: `${limitPercentage}%` }}
                />
              </div>
              <p className="text-xs text-blue-100">
                UGX {remainingLimit.toLocaleString()} remaining today
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:border-blue-300 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${action.color}-100`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <h3 className="mb-1 font-semibold text-gray-900">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </motion.button>
          ))}
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
                    <CardDescription>Your latest wallet activity</CardDescription>
                  </div>
                  <Link href="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700">
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
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            txn.type === 'topup' ? 'bg-green-100' : 'bg-blue-100'
                          }`}
                        >
                          {txn.type === 'topup' ? (
                            <Plus className="h-5 w-5 text-green-600" />
                          ) : (
                            <Store className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{txn.merchant}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{txn.location}</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{txn.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            txn.amount > 0 ? 'text-green-600' : 'text-gray-900'
                          }`}
                        >
                          {txn.amount > 0 ? '+' : ''}UGX {Math.abs(txn.amount).toLocaleString()}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            txn.type === 'topup'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {txn.type === 'topup' ? 'Top Up' : 'Purchase'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Spending Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Insights</CardTitle>
                <CardDescription>This month's summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="font-bold text-gray-900">UGX 234,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Topped Up</span>
                  <span className="font-bold text-green-600">UGX 300,000</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-gray-700">Net Balance Change</span>
                  <span className="font-bold text-green-600">+UGX 65,500</span>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <p className="text-sm text-blue-900">
                      You're spending 15% less than last month. Great job!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Status */}
            <Card>
              <CardHeader>
                <CardTitle>Card Status</CardTitle>
                <CardDescription>Security & settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card Active</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">PIN Set</span>
                  <span className="text-sm font-medium text-gray-900">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Limit</span>
                  <span className="text-sm font-medium text-gray-900">UGX 50,000</span>
                </div>
                <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Manage Card Settings
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
