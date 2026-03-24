import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  { label: 'Total Revenue', value: 'KSh 2.4M', change: '+12.5%', up: true, icon: DollarSign },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', up: true, icon: ShoppingCart },
  { label: 'Active Users', value: '5,678', change: '+23.1%', up: true, icon: Users },
  { label: 'Products', value: '456', change: '+3.2%', up: true, icon: Package },
]

const topProducts = [
  { name: 'iPhone 15 Pro Max', sales: 156, revenue: 'KSh 21.8M' },
  { name: 'MacBook Pro M3', sales: 89, revenue: 'KSh 17.8M' },
  { name: 'AirPods Pro 2', sales: 234, revenue: 'KSh 5.8M' },
  { name: 'Samsung Galaxy S24', sales: 112, revenue: 'KSh 13.4M' },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 'KSh 139,999', status: 'Delivered' },
  { id: 'ORD-002', customer: 'Sarah Kimani', amount: 'KSh 49,999', status: 'Shipped' },
  { id: 'ORD-003', customer: 'David Ochieng', amount: 'KSh 249,999', status: 'Processing' },
]

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted">Overview of your store performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-electric" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <div className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green' : 'text-red'}`}>
                {stat.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted">{product.sales} units sold</p>
                  </div>
                  <p className="font-semibold text-electric">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <p className="text-sm text-green">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue Over Time</h2>
          <div className="h-64 bg-surface rounded-lg flex items-center justify-center">
            <p className="text-muted">Chart visualization</p>
          </div>
        </div>
      </div>
    </div>
  )
}
