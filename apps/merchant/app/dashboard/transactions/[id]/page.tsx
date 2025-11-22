'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@kiaan/ui'
import { ArrowLeft, Receipt, CheckCircle, User, CreditCard, Store, Calendar, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function TransactionDetailPage() {
  const params = useParams()
  const txnId = params.id as string

  // Mock transaction data
  const transaction = {
    id: txnId,
    date: '2024-11-22 14:30:45',
    amount: -45000,
    type: 'purchase',
    status: 'completed',
    customer: { id: 'CUST-001', name: 'John Mugisha', email: 'john.m@email.com' },
    card: { uid: 'CARD-001-KMP', balance: 245000 },
    merchant: { id: 'MER-001', name: 'Nakumatt Supermarket', location: 'Garden City, Kampala' },
    terminal: { id: 'TRM-001', serialNumber: 'KPN-2024-001-KLA' },
    receipt: 'RCP-2024-11-22-001234',
    authCode: 'AUTH-789456',
    description: 'Grocery purchase',
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/transactions" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-lg ${
                  transaction.type === 'top-up' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Receipt className={`h-8 w-8 ${transaction.type === 'top-up' ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
                  <p className="text-gray-500 mt-1 font-mono">{transaction.id}</p>
                  <p className="text-sm text-gray-500 mt-1">{transaction.date}</p>
                </div>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Amount & Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className={`text-4xl font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.amount > 0 ? '+' : ''}UGX {Math.abs(transaction.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-gray-900">{transaction.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Customer & Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/dashboard/customers/${transaction.customer.id}`} className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.customer.name}</p>
                    <p className="text-xs text-gray-500">{transaction.customer.email}</p>
                  </div>
                </div>
              </Link>
              <Link href={`/dashboard/cards/${transaction.card.uid}`} className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold font-mono text-gray-900">{transaction.card.uid}</p>
                    <p className="text-xs text-gray-500">Balance: UGX {transaction.card.balance.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Merchant & Terminal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href={`/dashboard/merchants/${transaction.merchant.id}`} className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{transaction.merchant.name}</p>
                    <p className="text-xs text-gray-500">{transaction.merchant.location}</p>
                  </div>
                </div>
              </Link>
              <Link href={`/dashboard/terminals/${transaction.terminal.id}`} className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold font-mono text-gray-900">{transaction.terminal.serialNumber}</p>
                    <p className="text-xs text-gray-500">Terminal ID: {transaction.terminal.id}</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Transaction Info</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Receipt Number:</dt>
                  <dd className="text-sm font-mono font-semibold text-gray-900">{transaction.receipt}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Authorization Code:</dt>
                  <dd className="text-sm font-mono font-semibold text-gray-900">{transaction.authCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Date & Time:</dt>
                  <dd className="text-sm font-semibold text-gray-900">{transaction.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status:</dt>
                  <dd>
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      {transaction.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
