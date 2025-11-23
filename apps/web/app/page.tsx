'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kiaan/ui'
import { Shield, Store, Smartphone, Monitor, ArrowRight, Zap, Users, CreditCard, BarChart3, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  const dashboards = [
    {
      name: 'Admin Dashboard',
      description: 'System administration and management',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      href: '/admin',
      features: ['Manage all customers & cards', 'Merchant onboarding', 'Transaction monitoring', 'Reports & analytics'],
      users: 'System Administrators',
    },
    {
      name: 'Merchant Dashboard',
      description: 'Self-service portal for business owners',
      icon: Store,
      color: 'from-green-500 to-emerald-600',
      href: '/merchant',
      features: ['View daily sales', 'Terminal management', 'Settlement reports', 'Commission tracking'],
      users: 'Retail Stores & Restaurants',
    },
    {
      name: 'Customer Portal',
      description: 'Personal wallet and account management',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600',
      href: '/customer',
      features: ['Check card balance', 'Transaction history', 'Top-up wallet', 'Report lost cards'],
      users: 'Cardholders',
    },
    {
      name: 'POS Terminal',
      description: 'Point-of-sale payment processing',
      icon: Monitor,
      color: 'from-orange-500 to-orange-600',
      href: '/pos',
      features: ['Scan NFC cards', 'Process payments', 'Print receipts', 'Offline capability'],
      users: 'Cashiers & Store Staff',
    },
  ]

  const stats = [
    { label: 'Active Customers', value: '10,234', icon: Users },
    { label: 'Active Cards', value: '15,678', icon: CreditCard },
    { label: 'Merchants', value: '234', icon: Store },
    { label: 'Daily Transactions', value: '45,123', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kiaan POS & Wallet</h1>
                <p className="text-xs text-gray-600">Digital Payment Solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            <Zap className="h-4 w-4" />
            Multi-Platform Dashboard System
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Complete Payment Ecosystem
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Four specialized dashboards designed for different users in the Kiaan POS & Wallet system. Choose your role to access the appropriate portal.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboards Grid */}
      <section className="container mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Access Your Dashboard
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {dashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={dashboard.href}>
                <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${dashboard.color} text-white`}>
                        <dashboard.icon className="h-7 w-7" />
                      </div>
                      <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{dashboard.name}</CardTitle>
                    <CardDescription className="text-base">{dashboard.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Key Features:</p>
                        <ul className="space-y-1">
                          {dashboard.features.map((feature) => (
                            <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{dashboard.users}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
            <CardContent className="p-12 text-center">
              <Lock className="h-16 w-16 mx-auto mb-6 text-blue-400" />
              <h3 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                All dashboards feature role-based access control, encrypted data transmission, and comprehensive audit logging to ensure the security of your transactions and customer data.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  256-bit Encryption
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  RBAC Authentication
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  Complete Audit Trails
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2024 Kiaan POS & Wallet System. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Documentation</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Support</a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
