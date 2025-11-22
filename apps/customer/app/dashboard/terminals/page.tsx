'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Monitor,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Store,
  MapPin,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function TerminalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock terminal data
  const terminals = [
    {
      id: 'TRM-001',
      serialNumber: 'KPN-2024-001-KLA',
      merchant: 'Nakumatt Supermarket',
      location: 'Garden City, Kampala',
      status: 'online',
      transactionsToday: 89,
      lastTransaction: '2 minutes ago',
      battery: 87,
      signalStrength: 'excellent',
      softwareVersion: 'v2.4.1',
      installDate: '2024-01-15',
    },
    {
      id: 'TRM-002',
      serialNumber: 'KPN-2024-002-KLA',
      merchant: 'Shoprite',
      location: 'Lugogo Mall, Kampala',
      status: 'online',
      transactionsToday: 142,
      lastTransaction: '45 seconds ago',
      battery: 92,
      signalStrength: 'excellent',
      softwareVersion: 'v2.4.1',
      installDate: '2024-01-20',
    },
    {
      id: 'TRM-003',
      serialNumber: 'KPN-2024-003-JNJ',
      merchant: 'Java House Coffee',
      location: 'Oasis Mall, Kampala',
      status: 'online',
      transactionsToday: 34,
      lastTransaction: '5 minutes ago',
      battery: 65,
      signalStrength: 'good',
      softwareVersion: 'v2.4.1',
      installDate: '2024-02-01',
    },
    {
      id: 'TRM-004',
      serialNumber: 'KPN-2024-004-ENT',
      merchant: 'Shell Fuel Station',
      location: 'Entebbe Road',
      status: 'online',
      transactionsToday: 78,
      lastTransaction: '1 minute ago',
      battery: 100,
      signalStrength: 'excellent',
      softwareVersion: 'v2.4.1',
      installDate: '2024-01-25',
    },
    {
      id: 'TRM-005',
      serialNumber: 'KPN-2024-005-KLA',
      merchant: 'Game Stores',
      location: 'Acacia Mall, Kampala',
      status: 'idle',
      transactionsToday: 0,
      lastTransaction: '3 hours ago',
      battery: 45,
      signalStrength: 'good',
      softwareVersion: 'v2.4.0',
      installDate: '2024-02-10',
    },
    {
      id: 'TRM-006',
      serialNumber: 'KPN-2024-006-KLA',
      merchant: 'Cafe Javas',
      location: 'Kampala Road',
      status: 'online',
      transactionsToday: 56,
      lastTransaction: '8 minutes ago',
      battery: 78,
      signalStrength: 'excellent',
      softwareVersion: 'v2.4.1',
      installDate: '2024-02-05',
    },
    {
      id: 'TRM-007',
      serialNumber: 'KPN-2024-007-JNJ',
      merchant: 'Total Energies',
      location: 'Jinja Road',
      status: 'offline',
      transactionsToday: 0,
      lastTransaction: '2 days ago',
      battery: 12,
      signalStrength: 'none',
      softwareVersion: 'v2.3.8',
      installDate: '2024-01-10',
    },
    {
      id: 'TRM-008',
      serialNumber: 'KPN-2024-008-NTD',
      merchant: 'Capital Shoppers',
      location: 'Ntinda Complex',
      status: 'online',
      transactionsToday: 67,
      lastTransaction: '3 minutes ago',
      battery: 88,
      signalStrength: 'good',
      softwareVersion: 'v2.4.1',
      installDate: '2024-02-15',
    },
    {
      id: 'TRM-009',
      serialNumber: 'KPN-2024-009-KLA',
      merchant: 'Nakumatt Supermarket',
      location: 'Garden City, Kampala',
      status: 'maintenance',
      transactionsToday: 0,
      lastTransaction: '1 day ago',
      battery: 55,
      signalStrength: 'good',
      softwareVersion: 'v2.4.1',
      installDate: '2024-01-15',
    },
    {
      id: 'TRM-010',
      serialNumber: 'KPN-2024-010-KLA',
      merchant: 'Shoprite',
      location: 'Lugogo Mall, Kampala',
      status: 'online',
      transactionsToday: 95,
      lastTransaction: '30 seconds ago',
      battery: 94,
      signalStrength: 'excellent',
      softwareVersion: 'v2.4.1',
      installDate: '2024-01-20',
    },
  ]

  const stats = {
    total: terminals.length,
    online: terminals.filter((t) => t.status === 'online').length,
    offline: terminals.filter((t) => t.status === 'offline').length,
    maintenance: terminals.filter((t) => t.status === 'maintenance').length,
    totalTransactions: terminals.reduce((sum, t) => sum + t.transactionsToday, 0),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'idle':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      online: 'bg-green-100 text-green-700 border-green-200',
      offline: 'bg-red-100 text-red-700 border-red-200',
      idle: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
    }
    return styles[status as keyof typeof styles] || styles.offline
  }

  const getSignalIcon = (strength: string) => {
    switch (strength) {
      case 'excellent':
      case 'good':
        return <Wifi className="h-4 w-4 text-green-600" />
      case 'poor':
        return <Wifi className="h-4 w-4 text-orange-600" />
      default:
        return <WifiOff className="h-4 w-4 text-red-600" />
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredTerminals = terminals.filter((terminal) => {
    const matchesSearch =
      terminal.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      terminal.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || terminal.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Terminal Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage POS terminals and devices
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Register Terminal
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Terminals
              </CardTitle>
              <Monitor className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium">Online</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.online}</div>
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
              <CardTitle className="text-sm font-medium">Offline</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.offline}</div>
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
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.maintenance}</div>
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
              <CardTitle className="text-sm font-medium">Total Txns Today</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by serial number, merchant, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('online')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'online'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Online
              </button>
              <button
                onClick={() => setFilterStatus('offline')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'offline'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Offline
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terminals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Terminals</CardTitle>
          <CardDescription>
            Showing {filteredTerminals.length} of {stats.total} terminals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Serial Number
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Merchant
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Today's Txns
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Battery
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Signal
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Last Activity
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTerminals.map((terminal, index) => (
                  <motion.tr
                    key={terminal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => window.location.href = `/dashboard/terminals/${terminal.id}`}
                    className="border-b last:border-0 hover:bg-blue-50 cursor-pointer"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium">
                          {terminal.serialNumber}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {terminal.merchant}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {terminal.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          terminal.status
                        )}`}
                      >
                        {getStatusIcon(terminal.status)}
                        {terminal.status.charAt(0).toUpperCase() +
                          terminal.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {terminal.transactionsToday}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Battery
                          className={`h-4 w-4 ${getBatteryColor(terminal.battery)}`}
                        />
                        <span className="text-sm text-gray-900">
                          {terminal.battery}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        {getSignalIcon(terminal.signalStrength)}
                        <span className="text-xs text-gray-600 capitalize">
                          {terminal.signalStrength}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-600">
                        {terminal.lastTransaction}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
