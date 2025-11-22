'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  Building2,
  TrendingUp,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@kiaan/ui'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cards', href: '/cards', icon: CreditCard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Branches', href: '/branches', icon: Building2 },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
  { name: 'Top-Ups', href: '/top-ups', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <h1 className="text-2xl font-bold">Kiaan POS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-4">
        <div className="mb-3 flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <span className="text-sm font-semibold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@kiaan.com</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
