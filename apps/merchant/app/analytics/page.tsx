'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  BarChart3,
  TrendingUp,
  ArrowLeft,
  Users,
  CreditCard,
  Wallet,
  Receipt,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  // Mock analytics data
  const weeklyData = [
    { day: 'Mon', revenue: 8.5, transactions: 234 },
    { day: 'Tue', revenue: 9.2, transactions: 256 },
    { day: 'Wed', revenue: 7.8, transactions: 212 },
    { day: 'Thu', revenue: 10.5, transactions: 289 },
    { day: 'Fri', revenue: 12.3, transactions: 342 },
    { day: 'Sat', revenue: 15.7, transactions: 412 },
    { day: 'Sun', revenue: 11.2, transactions: 298 },
  ]

  const categoryBreakdown = [
    { name: 'Groceries', value: 35, amount: 12450000, color: 'bg-blue-500' },
    { name: 'Fuel', value: 23, amount: 8230000, color: 'bg-green-500' },
    { name: 'Restaurant', value: 19, amount: 6780000, color: 'bg-purple-500' },
    { name: 'Shopping', value: 14, amount: 5120000, color: 'bg-orange-500' },
    { name: 'Other', value: 9, amount: 3450000, color: 'bg-gray-500' },
  ]

  const customerSegments = [
    { segment: 'High Value', count: 234, avgSpend: 458000, growth: 18.5 },
    { segment: 'Regular', count: 678, avgSpend: 156000, growth: 12.3 },
    { segment: 'Occasional', count: 312, avgSpend: 78000, growth: -3.2 },
    { segment: 'New', count: 156, avgSpend: 34000, growth: 45.7 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
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
                <h1 className="text-2xl font-bold">Advanced Analytics</h1>
                <p className="text-cyan-100">Business intelligence & insights</p>
              </div>
            </div>
            <BarChart3 className="h-12 w-12" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">UGX 75.2M</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +23.1%
                    </span>
                    <span className="text-xs text-muted-foreground">this week</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Transaction
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">UGX 36,428</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +8.3%
                    </span>
                    <span className="text-xs text-muted-foreground">this week</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer LTV
                  </CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">UGX 842K</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      +15.7%
                    </span>
                    <span className="text-xs text-muted-foreground">this month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Growth Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+18.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Week over week
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Weekly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Revenue Trend
                </CardTitle>
                <CardDescription>
                  Revenue and transaction volume over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-700">
                        {data.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">
                            UGX {data.revenue}M
                          </span>
                          <span className="text-xs text-gray-500">
                            {data.transactions} transactions
                          </span>
                        </div>
                        <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.revenue / 20) * 100}%` }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 0.8,
                            }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Categories</CardTitle>
                  <CardDescription>
                    Revenue distribution by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{cat.name}</span>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              UGX {(cat.amount / 1000000).toFixed(1)}M
                            </p>
                            <p className="text-xs text-gray-500">{cat.value}%</p>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full ${cat.color}`}
                            style={{ width: `${cat.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer Segments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>
                    Customer behavior and spending patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegments.map((seg) => (
                      <div
                        key={seg.segment}
                        className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{seg.segment}</p>
                          <p className="text-sm text-gray-600">
                            {seg.count} customers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            UGX {(seg.avgSpend / 1000).toFixed(0)}K
                          </p>
                          <div className="flex items-center justify-end gap-1">
                            {seg.growth > 0 ? (
                              <ArrowUpRight className="h-3 w-3 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 text-red-600" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                seg.growth > 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {Math.abs(seg.growth)}%
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
        </div>
      </main>
    </div>
  )
}
