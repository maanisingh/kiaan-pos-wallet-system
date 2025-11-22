'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Wallet,
  TrendingUp,
  Users,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useQuery } from 'urql'
import { GET_CARDS } from '@/lib/graphql-operations'

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch real card data from Hasura GraphQL
  const [result] = useQuery({
    query: GET_CARDS,
    variables: {
      limit: 100,
      offset: 0,
    },
  })

  const { data, fetching, error } = result

  // Transform GraphQL data to match UI expectations
  const cards = useMemo(() => {
    if (!data?.cards) return []

    return data.cards.map((card: any) => {
      const totalSpent = card.transactions_aggregate?.aggregate?.sum?.amount || 0

      return {
        uid: card.uid,
        customer: card.customer?.full_name || 'Unknown Customer',
        balance: card.balance || 0,
        status: card.status || 'inactive',
        lastUsed: card.last_used_at
          ? new Date(card.last_used_at).toLocaleDateString()
          : 'Never',
        dailyLimit: card.daily_limit || 500000,
        todaySpent: 0, // Would need to filter today's transactions
        totalTransactions: card.transactions_aggregate?.aggregate?.count || 0,
        totalSpent,
      }
    })
  }, [data])

  const stats = useMemo(() => {
    const total = cards.length
    const active = cards.filter((c) => c.status === 'active').length
    const inactive = cards.filter((c) => c.status === 'inactive').length
    const blocked = cards.filter((c) => ['lost', 'stolen', 'blocked'].includes(c.status)).length
    const totalBalance = data?.cards_aggregate?.aggregate?.sum?.balance || 0

    return {
      total,
      active,
      inactive,
      blocked,
      totalBalance,
    }
  }, [cards, data])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'inactive':
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      case 'lost':
      case 'stolen':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      lost: 'bg-red-100 text-red-700 border-red-200',
      stolen: 'bg-red-100 text-red-700 border-red-200',
      blocked: 'bg-red-100 text-red-700 border-red-200',
    }
    return styles[status as keyof typeof styles] || styles.inactive
  }

  const filteredCards = useMemo(() => {
    if (!searchQuery && filterStatus === 'all') return cards

    return cards.filter((card) => {
      const matchesSearch =
        card.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.customer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === 'all' || card.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [cards, searchQuery, filterStatus])

  // Loading state
  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Cards</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-700 overflow-x-auto">
              {error.graphQLErrors?.[0]?.message || 'Failed to connect to GraphQL endpoint'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Card Management
          </h1>
          <p className="text-gray-600 mt-1">
            Issue, monitor, and manage NFC payment cards
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold transition-all hover:bg-blue-700 hover:shadow-lg">
          <Plus className="h-5 w-5" />
          Issue New Card
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
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
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
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-600" />
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
              <CardTitle className="text-sm font-medium">Blocked</CardTitle>
              <Lock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blocked}</div>
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
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.totalBalance / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">UGX</p>
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
                placeholder="Search by card UID or customer name..."
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
                onClick={() => setFilterStatus('active')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'inactive'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => setFilterStatus('lost')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterStatus === 'lost'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Blocked
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cards</CardTitle>
          <CardDescription>
            Showing {filteredCards.length} of {stats.total} cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Card UID
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Balance
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Daily Limit
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Today's Usage
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-semibold text-gray-700">
                    Last Used
                  </th>
                  <th className="pb-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card, index) => (
                  <motion.tr
                    key={card.uid}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium">
                          {card.uid}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {card.customer}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        UGX {card.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-600">
                        UGX {card.dailyLimit.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          UGX {card.todaySpent.toLocaleString()}
                        </div>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-blue-600"
                            style={{
                              width: `${(card.todaySpent / card.dailyLimit) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          card.status
                        )}`}
                      >
                        {getStatusIcon(card.status)}
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-600">
                        {card.lastUsed}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="rounded p-1 hover:bg-gray-100">
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
