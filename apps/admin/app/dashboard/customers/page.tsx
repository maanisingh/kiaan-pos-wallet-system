'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  MoreVertical,
  MapPin,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock customer data
  const customers = [
    {
      id: 'CUST-001',
      name: 'John Mugisha',
      email: 'john.m@email.com',
      phone: '+256 772 123456',
      location: 'Kampala',
      cardsCount: 2,
      totalBalance: 245000,
      totalSpent: 1250000,
      joinedDate: '2024-01-15',
      lastActive: '2 hours ago',
      status: 'active',
    },
    {
      id: 'CUST-002',
      name: 'Sarah Nakato',
      email: 'sarah.n@email.com',
      phone: '+256 772 234567',
      location: 'Entebbe',
      cardsCount: 1,
      totalBalance: 567000,
      totalSpent: 890000,
      joinedDate: '2024-02-10',
      lastActive: '15 minutes ago',
      status: 'active',
    },
    {
      id: 'CUST-003',
      name: 'David Okello',
      email: 'david.o@email.com',
      phone: '+256 772 345678',
      location: 'Jinja',
      cardsCount: 1,
      totalBalance: 0,
      totalSpent: 450000,
      joinedDate: '2024-01-20',
      lastActive: '3 days ago',
      status: 'inactive',
    },
    {
      id: 'CUST-004',
      name: 'Grace Nambi',
      email: 'grace.n@email.com',
      phone: '+256 772 456789',
      location: 'Kampala',
      cardsCount: 3,
      totalBalance: 892000,
      totalSpent: 2100000,
      joinedDate: '2023-12-05',
      lastActive: '1 hour ago',
      status: 'active',
    },
    {
      id: 'CUST-005',
      name: 'Michael Ssali',
      email: 'michael.s@email.com',
      phone: '+256 772 567890',
      location: 'Mbarara',
      cardsCount: 1,
      totalBalance: 123000,
      totalSpent: 670000,
      joinedDate: '2024-03-01',
      lastActive: '30 minutes ago',
      status: 'active',
    },
    {
      id: 'CUST-006',
      name: 'Betty Namusoke',
      email: 'betty.n@email.com',
      phone: '+256 772 678901',
      location: 'Kampala',
      cardsCount: 2,
      totalBalance: 450000,
      totalSpent: 1890000,
      joinedDate: '2024-01-08',
      lastActive: '1 week ago',
      status: 'active',
    },
    {
      id: 'CUST-007',
      name: 'James Ochieng',
      email: 'james.o@email.com',
      phone: '+256 772 789012',
      location: 'Entebbe',
      cardsCount: 1,
      totalBalance: 678000,
      totalSpent: 560000,
      joinedDate: '2024-02-20',
      lastActive: '5 minutes ago',
      status: 'active',
    },
    {
      id: 'CUST-008',
      name: 'Patricia Akello',
      email: 'patricia.a@email.com',
      phone: '+256 772 890123',
      location: 'Jinja',
      cardsCount: 1,
      totalBalance: 156000,
      totalSpent: 340000,
      joinedDate: '2024-03-15',
      lastActive: '2 days ago',
      status: 'active',
    },
  ]

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
    totalCards: customers.reduce((sum, c) => sum + c.cardsCount, 0),
    totalBalance: customers.reduce((sum, c) => sum + c.totalBalance, 0),
    totalSpent: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage customer accounts and profiles
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Add Customer
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
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
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
              <UserCheck className="h-4 w-4 text-green-600" />
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
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <UserX className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
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
              <CreditCard className="h-4 w-4 text-purple-600" />
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
                Total Balance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalBalance / 1000000).toFixed(1)}M
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
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalSpent / 1000000).toFixed(1)}M
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
              placeholder="Search by name, email, phone, or customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                      {customer.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>{customer.id}</CardDescription>
                    </div>
                  </div>
                  <button className="rounded p-1 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{customer.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-xs text-gray-600">Cards</p>
                    <p className="text-lg font-bold">{customer.cardsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Balance</p>
                    <p className="text-lg font-bold">
                      {(customer.totalBalance / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Spent</p>
                    <p className="text-lg font-bold">
                      {(customer.totalSpent / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p
                      className={`text-sm font-semibold ${
                        customer.status === 'active'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="text-xs text-gray-500">
                    Joined {new Date(customer.joinedDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Active {customer.lastActive}
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
