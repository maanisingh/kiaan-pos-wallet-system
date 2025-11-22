import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kiaan/ui'
import { CreditCard, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  // In a real app, this data would come from Supabase
  const stats = {
    total_cards: 1247,
    total_customers: 1189,
    total_balance: 125430.5,
    today_revenue: 8745.25,
  }

  const statsCards = [
    {
      title: 'Total Active Cards',
      value: stats.total_cards.toLocaleString(),
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Customers',
      value: stats.total_customers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'System Balance',
      value: `$${stats.total_balance.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: "Today's Revenue",
      value: `$${stats.today_revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kiaan POS Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Closed-Loop Payment System for Big Innovation Group Ltd
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Real-time statistics and system performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated just now
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Features</CardTitle>
                <CardDescription>
                  Closed-loop payment ecosystem capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">NFC Card Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Multi-Branch Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Mobile Money Integration (MTN/Airtel)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Real-time Balance Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Customer Mobile Wallet App</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">POS Terminal Application</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">PIN Protection & Security</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Specifications</CardTitle>
                <CardDescription>
                  Meeting Big Innovation Group Ltd requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Card Registration & Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Wallet Logic with Balance Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">POS Payment Flow with PIN Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Top-Up via USSD Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Top-Up via Mobile App</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Admin Dashboard (Multi-role)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Financial Reports & Analytics</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Built with modern, open-source technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-semibold mb-2">Frontend</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Next.js 15</li>
                    <li>• React 19</li>
                    <li>• TypeScript 5.7</li>
                    <li>• Tailwind CSS 4</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Backend</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Supabase</li>
                    <li>• PostgreSQL</li>
                    <li>• REST APIs</li>
                    <li>• Real-time</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">Mobile</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Expo 52</li>
                    <li>• React Native</li>
                    <li>• Tamagui</li>
                    <li>• TypeScript</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold mb-2">POS Terminal</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Tauri v2</li>
                    <li>• Rust + React</li>
                    <li>• NFC Integration</li>
                    <li>• Offline Support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
