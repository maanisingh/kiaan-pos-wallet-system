'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Smartphone,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Lock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Building2,
  LayoutDashboard,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-gray-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">Kiaan POS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/branch-dashboard"
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Branch View
              </Link>
              <Link
                href="/analytics"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-2 backdrop-blur-sm"
            >
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                Enterprise-Grade Security • Bank-Level Encryption
              </span>
            </motion.div>

            <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Next-Generation
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                POS & Wallet System
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              Revolutionize your business with our closed-loop payment ecosystem.
              NFC cards, digital wallets, and real-time analytics powered by
              advanced technology.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-2xl hover:shadow-blue-500/50"
              >
                Launch Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/analytics"
                className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View Analytics
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview Grid */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mt-20 grid gap-6 lg:grid-cols-2"
          >
            {/* Main Dashboard Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-2 shadow-2xl backdrop-blur-xl">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20 blur-3xl" />
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Admin Dashboard</h3>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Active Cards', value: '1,234', icon: CreditCard, color: 'blue' },
                      { label: 'Total Users', value: '5,678', icon: Users, color: 'green' },
                      { label: 'Revenue', value: 'UGX 45M', icon: TrendingUp, color: 'purple' },
                      { label: 'Transactions', value: '12.5K', icon: Zap, color: 'orange' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="rounded-lg border border-white/10 bg-gray-800/50 p-3 backdrop-blur-sm"
                      >
                        <stat.icon className="mb-1 h-6 w-6 text-blue-400" />
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Dashboard Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-2 shadow-2xl backdrop-blur-xl">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 blur-3xl" />
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="flex flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Branch View</h3>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-white/10 bg-gray-800/50 p-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Current Branch</p>
                          <p className="font-bold text-white">Kampala Main</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-white/10 bg-gray-800/50 p-3">
                        <p className="text-xs text-gray-400">Today's Sales</p>
                        <p className="text-lg font-bold text-white">UGX 2.4M</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-gray-800/50 p-3">
                        <p className="text-xs text-gray-400">Transactions</p>
                        <p className="text-lg font-bold text-white">342</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to manage your payment ecosystem
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CreditCard,
                title: 'NFC Card Payments',
                description: 'Tap-to-pay technology with secure PIN verification and daily limits',
                color: 'blue',
              },
              {
                icon: Smartphone,
                title: 'Mobile Wallet',
                description: 'iOS and Android app for balance checks and mobile money top-ups',
                color: 'green',
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'End-to-end encryption, fraud detection, and audit logging',
                color: 'purple',
              },
              {
                icon: Building2,
                title: 'Multi-Branch Support',
                description: 'Manage unlimited locations with centralized control',
                color: 'cyan',
              },
              {
                icon: Zap,
                title: 'Real-Time Updates',
                description: 'Instant transaction notifications and balance synchronization',
                color: 'orange',
              },
              {
                icon: TrendingUp,
                title: 'Advanced Analytics',
                description: 'Revenue reports, transaction trends, and business insights',
                color: 'pink',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-gray-900/80"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <feature.icon className="mb-4 h-12 w-12 text-blue-400" />
                <h3 className="mb-2 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<100ms', label: 'Transaction Speed' },
              { value: '24/7', label: 'Support' },
              { value: '256-bit', label: 'Encryption' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Requirements */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-white">
              Built to Specification
            </h2>
            <p className="text-lg text-gray-400">
              Every feature designed and tested for Big Innovation Group Ltd
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'NFC card payments with PIN verification',
              'Multi-branch management system',
              'Real-time balance updates',
              'Mobile money integration (MTN/Airtel)',
              'Comprehensive transaction history',
              'Daily spending limits and controls',
              'Admin dashboard with analytics',
              'Secure card activation process',
            ].map((requirement, i) => (
              <motion.div
                key={requirement}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/50 p-4 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                <span className="text-gray-300">{requirement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600 to-cyan-600 p-12 text-center"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="mb-4 text-4xl font-bold text-white">
                Ready to Transform Your Business?
              </h2>
              <p className="mb-8 text-lg text-blue-100">
                Access multiple dashboards for complete control
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-gray-100 hover:shadow-xl"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/analytics"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-blue-600"
                >
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold text-white">Kiaan POS</span>
            </div>
            <p className="text-gray-400">
              © 2025 Big Innovation Group Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Lock className="h-5 w-5 text-gray-400" />
              <Shield className="h-5 w-5 text-gray-400" />
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
