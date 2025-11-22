'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@kiaan/ui'
import { ArrowLeft, Store, MapPin, Phone, Mail, Users, CreditCard, Receipt, TrendingUp, DollarSign, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function MerchantDetailPage() {
  const params = useParams()
  const merchantId = params.id as string

  const merchant = {
    id: merchantId,
    name: 'Nakumatt Supermarket',
    category: 'Retail',
    location: 'Garden City, Kampala',
    manager: 'John Ssemakula',
    phone: '+256 772 123456',
    email: 'manager@nakumatt.com',
    terminals: 8,
    transactionsToday: 542,
    todayRevenue: 4560000,
    monthlyRevenue: 89400000,
    commissionRate: 2.5,
    status: 'active',
  }

  const stats = {
    totalRevenue: merchant.monthlyRevenue,
    avgTransaction: merchant.todayRevenue / merchant.transactionsToday,
    commission: (merchant.todayRevenue * merchant.commissionRate) / 100,
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/merchants" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Merchants
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500">
                  <Store className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{merchant.name}</h1>
                  <p className="text-gray-500 mt-1">{merchant.category}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {merchant.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {merchant.manager}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Terminals</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.terminals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Today's Txns</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.transactionsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Today's Revenue</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(merchant.todayRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">UGX</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Commission Rate</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.commissionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Monthly Revenue</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(merchant.monthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500">UGX</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-medium">{merchant.manager}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{merchant.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{merchant.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{merchant.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Performance Metrics</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Average Transaction</p>
                <p className="text-sm font-semibold">UGX {stats.avgTransaction.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Commission Earned (Today)</p>
                <p className="text-sm font-semibold text-green-600">UGX {stats.commission.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {merchant.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
