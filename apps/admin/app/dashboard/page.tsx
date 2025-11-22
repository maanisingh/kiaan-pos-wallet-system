'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  Receipt,
  TrendingDown,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  // Mock data - in production this would come from Supabase
  const stats = {
    total_cards: 1247,
    total_customers: 1189,
    total_balance: 125430500, // UGX
    today_revenue: 8745250, // UGX
    weekly_growth: 12.5,
    monthly_transactions: 12453,
  }

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'John Mugisha',
      amount: 45000,
      type: 'purchase',
      branch: 'Kampala Main',
      time: '2 minutes ago',
    },
    {
      id: 'TXN-002',
      customer: 'Sarah Nakato',
      amount: 125000,
      type: 'top-up',
      branch: 'Entebbe',
      time: '15 minutes ago',
    },
    {
      id: 'TXN-003',
      customer: 'David Okello',
      amount: 32500,
      type: 'purchase',
      branch: 'Jinja',
      time: '1 hour ago',
    },
    {
      id: 'TXN-004',
      customer: 'Grace Nambi',
      amount: 78000,
      type: 'top-up',
      branch: 'Kampala Main',
      time: '2 hours ago',
    },
    {
      id: 'TXN-005',
      customer: 'Michael Ssali',
      amount: 15000,
      type: 'purchase',
      branch: 'Mbarara',
      time: '3 hours ago',
    },
  ]

  const topBranches = [
    { name: 'Kampala Main', revenue: 12450000, transactions: 523, growth: 15.3 },
    { name: 'Entebbe', revenue: 8230000, transactions: 412, growth: 8.7 },
    { name: 'Jinja', revenue: 6780000, transactions: 289, growth: -2.1 },
    { name: 'Mbarara', revenue: 5120000, transactions: 198, growth: 12.4 },
  ]

  const statsCards = [
    {
      title: 'Total Active Cards',
      value: stats.total_cards.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      lightBg: 'bg-blue-50',
    },
    {
      title: 'Total Customers',
      value: stats.total_customers.toLocaleString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      lightBg: 'bg-green-50',
    },
    {
      title: 'System Balance',
      value: `UGX ${(stats.total_balance / 1000000).toFixed(1)}M`,
      change: '+23.1%',
      trend: 'up',
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      lightBg: 'bg-purple-50',
    },
    {
      title: "Today's Revenue",
      value: `UGX ${(stats.today_revenue / 1000000).toFixed(2)}M`,
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      lightBg: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-1">
          Real-time statistics and system performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest payment activities across all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          txn.type === 'top-up'
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                        }`}
                      >
                        {txn.type === 'top-up' ? (
                          <Wallet className="h-4 w-4 text-green-600" />
                        ) : (
                          <Receipt className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.customer}</p>
                        <p className="text-xs text-gray-500">
                          {txn.branch} • {txn.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
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
                      <p className="text-xs text-gray-500 capitalize">
                        {txn.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Branches */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performing Branches
              </CardTitle>
              <CardDescription>
                Revenue and transaction metrics by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBranches.map((branch, index) => (
                  <div
                    key={branch.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{branch.name}</p>
                        <p className="text-xs text-gray-500">
                          {branch.transactions} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        UGX {(branch.revenue / 1000000).toFixed(1)}M
                      </p>
                      <div className="flex items-center justify-end gap-1">
                        {branch.growth > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-xs ${
                            branch.growth > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {Math.abs(branch.growth)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Issue New Card</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-all hover:border-green-500 hover:bg-green-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium">Add Customer</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-500 hover:bg-purple-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium">View Reports</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 transition-all hover:border-orange-500 hover:bg-orange-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium">System Health</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
