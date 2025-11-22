'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function ReportsPage() {
  // Mock report data
  const monthlyData = [
    { month: 'Jan', revenue: 42.5, transactions: 1234, customers: 156 },
    { month: 'Feb', revenue: 45.2, transactions: 1456, customers: 189 },
    { month: 'Mar', revenue: 48.8, transactions: 1678, customers: 212 },
    { month: 'Apr', revenue: 52.3, transactions: 1891, customers: 245 },
    { month: 'May', revenue: 56.7, transactions: 2103, customers: 278 },
    { month: 'Jun', revenue: 61.2, transactions: 2345, customers: 312 },
  ]

  const topProducts = [
    { name: 'Groceries', sales: 12450000, count: 523, growth: 15.3 },
    { name: 'Fuel', sales: 8230000, count: 412, growth: 8.7 },
    { name: 'Restaurant', sales: 6780000, count: 289, growth: -2.1 },
    { name: 'Shopping', sales: 5120000, count: 198, growth: 12.4 },
    { name: 'Services', sales: 3450000, count: 145, growth: 7.8 },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Business insights and performance metrics
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md">
          <Download className="h-5 w-5" />
          Export All Reports
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">UGX 314.7M</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +23.1%
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
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
              <div className="text-2xl font-bold">10,707</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +18.5%
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
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
              <div className="text-2xl font-bold">1,392</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +12.3%
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
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
                Avg. Transaction
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">UGX 29,389</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  +3.8%
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-700">
                    {data.month}
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
                        animate={{ width: `${(data.revenue / 70) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Products/Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              Best performing product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.count} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      UGX {(product.sales / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {product.growth > 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          product.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {Math.abs(product.growth)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Download Reports</CardTitle>
            <CardDescription>
              Export detailed reports for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Daily Sales Report',
                  description: 'Transactions and revenue by day',
                  icon: Calendar,
                },
                {
                  title: 'Customer Activity',
                  description: 'Customer transactions and balances',
                  icon: Users,
                },
                {
                  title: 'Card Usage Report',
                  description: 'Card activity and status',
                  icon: CreditCard,
                },
                {
                  title: 'Branch Performance',
                  description: 'Revenue by branch location',
                  icon: TrendingUp,
                },
                {
                  title: 'Financial Summary',
                  description: 'Complete financial overview',
                  icon: DollarSign,
                },
                {
                  title: 'Transaction Log',
                  description: 'Detailed transaction history',
                  icon: Receipt,
                },
              ].map((report) => (
                <button
                  key={report.title}
                  className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                >
                  <report.icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{report.title}</p>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-600">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
