'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Building2,
  Plus,
  MapPin,
  Users,
  TrendingUp,
  CreditCard,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function BranchesPage() {
  // Mock branch data
  const branches = [
    {
      id: 'BRN-001',
      name: 'Kampala Main',
      location: 'Plot 45, Kampala Road, Kampala',
      manager: 'Alice Nambi',
      phone: '+256 772 111222',
      email: 'kampala@kiaan.com',
      staff: 12,
      activeCards: 523,
      todayRevenue: 2450000,
      monthlyRevenue: 45600000,
      transactionsToday: 342,
      status: 'active',
    },
    {
      id: 'BRN-002',
      name: 'Entebbe',
      location: 'Entebbe Road, Entebbe Town',
      manager: 'Peter Ssemakula',
      phone: '+256 772 222333',
      email: 'entebbe@kiaan.com',
      staff: 8,
      activeCards: 412,
      todayRevenue: 1820000,
      monthlyRevenue: 32400000,
      transactionsToday: 289,
      status: 'active',
    },
    {
      id: 'BRN-003',
      name: 'Jinja',
      location: 'Main Street, Jinja',
      manager: 'Moses Okello',
      phone: '+256 772 333444',
      email: 'jinja@kiaan.com',
      staff: 6,
      activeCards: 289,
      todayRevenue: 1340000,
      monthlyRevenue: 24500000,
      transactionsToday: 198,
      status: 'active',
    },
    {
      id: 'BRN-004',
      name: 'Mbarara',
      location: 'High Street, Mbarara',
      manager: 'Sarah Tumusiime',
      phone: '+256 772 444555',
      email: 'mbarara@kiaan.com',
      staff: 5,
      activeCards: 198,
      todayRevenue: 980000,
      monthlyRevenue: 18700000,
      transactionsToday: 145,
      status: 'active',
    },
    {
      id: 'BRN-005',
      name: 'Gulu',
      location: 'Churchill Drive, Gulu',
      manager: 'David Okot',
      phone: '+256 772 555666',
      email: 'gulu@kiaan.com',
      staff: 4,
      activeCards: 156,
      todayRevenue: 720000,
      monthlyRevenue: 14200000,
      transactionsToday: 98,
      status: 'maintenance',
    },
  ]

  const stats = {
    total: branches.length,
    active: branches.filter((b) => b.status === 'active').length,
    totalStaff: branches.reduce((sum, b) => sum + b.staff, 0),
    totalCards: branches.reduce((sum, b) => sum + b.activeCards, 0),
    todayRevenue: branches.reduce((sum, b) => sum + b.todayRevenue, 0),
    monthlyRevenue: branches.reduce((sum, b) => sum + b.monthlyRevenue, 0),
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Branch Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all branch locations
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Add Branch
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
                Total Branches
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
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
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCards}</div>
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

      {/* Branches Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{branch.name}</CardTitle>
                      <CardDescription>{branch.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                        branch.status === 'active'
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : 'border-orange-200 bg-orange-100 text-orange-700'
                      }`}
                    >
                      {branch.status === 'active' ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {branch.status}
                    </span>
                    <button className="rounded p-1 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location & Contact */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{branch.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Manager: {branch.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{branch.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-xs text-gray-600">Staff</p>
                    <p className="text-lg font-bold">{branch.staff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Active Cards</p>
                    <p className="text-lg font-bold">{branch.activeCards}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Today's Revenue</p>
                    <p className="text-lg font-bold">
                      {(branch.todayRevenue / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Transactions</p>
                    <p className="text-lg font-bold">
                      {branch.transactionsToday}
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
                      UGX {(branch.monthlyRevenue / 1000000).toFixed(1)}M
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
