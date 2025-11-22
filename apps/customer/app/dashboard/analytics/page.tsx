'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Receipt,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  // Mock analytics data
  const metrics = {
    totalRevenue: 45678000,
    revenueGrowth: 12.5,
    totalTransactions: 8945,
    transactionGrowth: 8.3,
    activeCustomers: 2345,
    customerGrowth: 15.2,
    averageTransaction: 5106,
    avgTxnGrowth: -2.1,
  }

  const revenueByCategory = [
    { category: 'Retail', amount: 18500000, percentage: 40.5, color: 'bg-blue-500' },
    { category: 'Fuel', amount: 13700000, percentage: 30.0, color: 'bg-green-500' },
    { category: 'Restaurant', amount: 9120000, percentage: 20.0, color: 'bg-purple-500' },
    { category: 'Other', amount: 4358000, percentage: 9.5, color: 'bg-orange-500' },
  ]

  const topMerchants = [
    { name: 'Shoprite', transactions: 1245, revenue: 6780000, growth: 15.2 },
    { name: 'Shell Fuel Station', transactions: 892, revenue: 8920000, growth: 12.8 },
    { name: 'Nakumatt Supermarket', transactions: 1087, revenue: 4560000, growth: -3.5 },
    { name: 'Game Stores', transactions: 678, revenue: 3450000, growth: 8.9 },
    { name: 'Capital Shoppers', transactions: 756, revenue: 3890000, growth: 11.2 },
  ]

  const hourlyActivity = [
    { hour: '6 AM', transactions: 45 },
    { hour: '8 AM', transactions: 156 },
    { hour: '10 AM', transactions: 289 },
    { hour: '12 PM', transactions: 456 },
    { hour: '2 PM', transactions: 398 },
    { hour: '4 PM', transactions: 512 },
    { hour: '6 PM', transactions: 678 },
    { hour: '8 PM', transactions: 423 },
  ]

  const weeklyTrends = [
    { day: 'Mon', revenue: 6200000, transactions: 1240 },
    { day: 'Tue', revenue: 5800000, transactions: 1156 },
    { day: 'Wed', revenue: 6900000, transactions: 1389 },
    { day: 'Thu', revenue: 7200000, transactions: 1445 },
    { day: 'Fri', revenue: 8100000, transactions: 1623 },
    { day: 'Sat', revenue: 9500000, transactions: 1901 },
    { day: 'Sun', revenue: 7100000, transactions: 1421 },
  ]

  const maxHourlyTxn = Math.max(...hourlyActivity.map((h) => h.transactions))
  const maxWeeklyRevenue = Math.max(...weeklyTrends.map((w) => w.revenue))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time analytics and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <BarChart3 className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">
                  +{metrics.revenueGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
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
              <Receipt className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalTransactions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">
                  +{metrics.transactionGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
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
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.activeCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">
                  +{metrics.customerGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
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
                Avg Transaction
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.averageTransaction / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <ArrowDownRight className="h-3 w-3 text-red-600" />
                <span className="font-medium text-red-600">
                  {metrics.avgTxnGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Revenue Trend</CardTitle>
              <CardDescription>Daily revenue for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyTrends.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{day.day}</span>
                      <span className="font-semibold text-gray-900">
                        {(day.revenue / 1000000).toFixed(1)}M UGX
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(day.revenue / maxWeeklyRevenue) * 100}%`,
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>Transaction volume by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hourlyActivity.map((hour, index) => (
                  <div key={hour.hour} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{hour.hour}</span>
                      <span className="font-semibold text-gray-900">
                        {hour.transactions} txns
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(hour.transactions / maxHourlyTxn) * 100}%`,
                        }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue by Category & Top Merchants */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Distribution of revenue sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {revenueByCategory.map((item, index) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {(item.amount / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Merchants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Merchants</CardTitle>
              <CardDescription>
                Highest revenue this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMerchants.map((merchant, index) => (
                  <motion.div
                    key={merchant.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {merchant.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {merchant.transactions} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {(merchant.revenue / 1000000).toFixed(2)}M
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        {merchant.growth > 0 ? (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                            <span className="font-medium text-green-600">
                              +{merchant.growth}%
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                            <span className="font-medium text-red-600">
                              {merchant.growth}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-powered business insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">
                    Peak Performance
                  </h3>
                </div>
                <p className="text-sm text-blue-700">
                  Saturday shows 32% higher revenue than weekday average.
                  Consider staffing optimization.
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Customer Growth
                  </h3>
                </div>
                <p className="text-sm text-green-700">
                  New customer acquisition up 15.2% this month. Retention rate
                  at 87%.
                </p>
              </div>
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">
                    Usage Pattern
                  </h3>
                </div>
                <p className="text-sm text-orange-700">
                  Evening hours (6-8 PM) show 28% of daily transactions.
                  Optimize terminal availability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
