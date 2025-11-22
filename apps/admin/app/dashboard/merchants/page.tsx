'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  CreditCard,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Users,
  Receipt,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock merchant data - stores/shops that accept Kiaan POS cards
  const merchants = [
    {
      id: 'MER-001',
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
    },
    {
      id: 'MER-002',
      name: 'Shoprite',
      category: 'Retail',
      location: 'Lugogo Mall, Kampala',
      manager: 'Sarah Nambi',
      phone: '+256 772 234567',
      email: 'info@shoprite.ug',
      terminals: 12,
      transactionsToday: 789,
      todayRevenue: 6780000,
      monthlyRevenue: 124500000,
      commissionRate: 2.0,
      status: 'active',
    },
    {
      id: 'MER-003',
      name: 'Java House Coffee',
      category: 'Restaurant',
      location: 'Oasis Mall, Kampala',
      manager: 'Peter Okello',
      phone: '+256 772 345678',
      email: 'kampala@javahouse.co.ug',
      terminals: 3,
      transactionsToday: 156,
      todayRevenue: 890000,
      monthlyRevenue: 18900000,
      commissionRate: 3.0,
      status: 'active',
    },
    {
      id: 'MER-004',
      name: 'Shell Fuel Station',
      category: 'Fuel',
      location: 'Entebbe Road',
      manager: 'Grace Tumusiime',
      phone: '+256 772 456789',
      email: 'entebbe@shell.ug',
      terminals: 6,
      transactionsToday: 423,
      todayRevenue: 8920000,
      monthlyRevenue: 156700000,
      commissionRate: 1.5,
      status: 'active',
    },
    {
      id: 'MER-005',
      name: 'Game Stores',
      category: 'Retail',
      location: 'Acacia Mall, Kampala',
      manager: 'Moses Mukasa',
      phone: '+256 772 567890',
      email: 'acacia@game.co.ug',
      terminals: 10,
      transactionsToday: 345,
      todayRevenue: 3450000,
      monthlyRevenue: 67800000,
      commissionRate: 2.2,
      status: 'active',
    },
    {
      id: 'MER-006',
      name: 'Cafe Javas',
      category: 'Restaurant',
      location: 'Kampala Road',
      manager: 'Betty Nakato',
      phone: '+256 772 678901',
      email: 'info@cafejavas.com',
      terminals: 4,
      transactionsToday: 234,
      todayRevenue: 1120000,
      monthlyRevenue: 23400000,
      commissionRate: 3.0,
      status: 'active',
    },
    {
      id: 'MER-007',
      name: 'Total Energies',
      category: 'Fuel',
      location: 'Jinja Road',
      manager: 'David Ochieng',
      phone: '+256 772 789012',
      email: 'jinja@totalenergies.ug',
      terminals: 5,
      transactionsToday: 0,
      todayRevenue: 0,
      monthlyRevenue: 89000000,
      commissionRate: 1.5,
      status: 'maintenance',
    },
    {
      id: 'MER-008',
      name: 'Capital Shoppers',
      category: 'Retail',
      location: 'Ntinda Complex',
      manager: 'Alice Namusoke',
      phone: '+256 772 890123',
      email: 'ntinda@capitalshoppers.ug',
      terminals: 7,
      transactionsToday: 456,
      todayRevenue: 3890000,
      monthlyRevenue: 72300000,
      commissionRate: 2.3,
      status: 'active',
    },
  ]

  const stats = {
    total: merchants.length,
    active: merchants.filter((m) => m.status === 'active').length,
    totalTerminals: merchants.reduce((sum, m) => sum + m.terminals, 0),
    todayTransactions: merchants.reduce((sum, m) => sum + m.transactionsToday, 0),
    todayRevenue: merchants.reduce((sum, m) => sum + m.todayRevenue, 0),
    monthlyRevenue: merchants.reduce((sum, m) => sum + m.monthlyRevenue, 0),
  }

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Merchant Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage merchants and retail partners accepting Kiaan POS cards
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Add Merchant
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
                Total Merchants
              </CardTitle>
              <Store className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
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
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
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
              <CardTitle className="text-sm font-medium">Terminals</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTerminals}</div>
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
              <CardTitle className="text-sm font-medium">Today's Txns</CardTitle>
              <Receipt className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayTransactions}</div>
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
                Today's Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.todayRevenue / 1000000).toFixed(1)}M
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
                Monthly Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.monthlyRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by merchant name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Merchants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMerchants.map((merchant, index) => (
          <motion.div
            key={merchant.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{merchant.name}</CardTitle>
                      <CardDescription>{merchant.category}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                        merchant.status === 'active'
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : 'border-orange-200 bg-orange-100 text-orange-700'
                      }`}
                    >
                      {merchant.status === 'active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {merchant.status}
                    </span>
                    <button className="rounded p-1 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{merchant.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{merchant.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{merchant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{merchant.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-xs text-gray-600">Terminals</p>
                    <p className="text-lg font-bold">{merchant.terminals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Commission</p>
                    <p className="text-lg font-bold">{merchant.commissionRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Today's Txns</p>
                    <p className="text-lg font-bold">
                      {merchant.transactionsToday}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Today's Revenue</p>
                    <p className="text-lg font-bold">
                      {(merchant.todayRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Monthly Performance */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      Monthly Revenue
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      UGX {(merchant.monthlyRevenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
