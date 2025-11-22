'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@kiaan/ui'
import { ArrowLeft, Monitor, Store, CheckCircle, Battery, Wifi, Activity, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function TerminalDetailPage() {
  const params = useParams()
  const terminalId = params.id as string

  const terminal = {
    id: terminalId,
    serialNumber: 'KPN-2024-001-KLA',
    merchant: { id: 'MER-001', name: 'Nakumatt Supermarket' },
    location: 'Garden City, Kampala',
    status: 'online',
    transactionsToday: 89,
    lastTransaction: '2 minutes ago',
    battery: 87,
    signalStrength: 'excellent',
    softwareVersion: 'v2.4.1',
    installDate: '2024-01-15',
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/terminals" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Terminals
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                  <Monitor className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-mono text-gray-900">{terminal.serialNumber}</h1>
                  <Link href={`/dashboard/merchants/${terminal.merchant.id}`} className="text-gray-600 hover:text-blue-600 mt-1 flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    {terminal.merchant.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">Installed {new Date(terminal.installDate).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <CheckCircle className="h-4 w-4" />
                {terminal.status}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Status</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{terminal.status}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Today's Transactions</p>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{terminal.transactionsToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Battery</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Battery className={`h-5 w-5 ${terminal.battery > 60 ? 'text-green-600' : 'text-orange-600'}`} />
              <div className="text-2xl font-bold">{terminal.battery}%</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Signal</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold capitalize">{terminal.signalStrength}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Terminal Information</h2>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Serial Number:</dt>
                <dd className="text-sm font-mono font-semibold">{terminal.serialNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Software Version:</dt>
                <dd className="text-sm font-semibold">{terminal.softwareVersion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Install Date:</dt>
                <dd className="text-sm font-semibold">{new Date(terminal.installDate).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Location:</dt>
                <dd className="text-sm font-semibold">{terminal.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Last Activity:</dt>
                <dd className="text-sm font-semibold">{terminal.lastTransaction}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-left hover:bg-gray-50">
              <Settings className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">Update Software</p>
                <p className="text-xs text-gray-500">Current: {terminal.softwareVersion}</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-left hover:bg-gray-50">
              <Activity className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium">View Activity Logs</p>
                <p className="text-xs text-gray-500">{terminal.transactionsToday} transactions today</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg border border-red-300 bg-white px-4 py-3 text-left hover:bg-red-50">
              <Monitor className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-600">Disable Terminal</p>
                <p className="text-xs text-gray-500">Temporarily stop accepting payments</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
