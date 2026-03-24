import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/server/auth'
import Link from 'next/link'
import { Package, Users, BarChart3, Settings, Plus, DollarSign, ShoppingCart } from 'lucide-react'

export default async function Admin() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const stats = [
    { label: 'Total Revenue', value: 'KSh 0', icon: DollarSign, change: '+0%' },
    { label: 'Total Orders', value: '0', icon: ShoppingCart, change: '+0%' },
    { label: 'Products', value: '0', icon: Package, change: '0' },
    { label: 'Users', value: '0', icon: Users, change: '+0%' },
  ]

  const menuItems = [
    { icon: Package, label: 'Products', href: '/admin/products', desc: 'Manage product catalog' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders', desc: 'View and manage orders' },
    { icon: Users, label: 'Users', href: '/admin/users', desc: 'Manage customer accounts' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', desc: 'View sales analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', desc: 'Store configuration' },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted">Manage your store</p>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted">{stat.label}</p>
                <stat.icon className="h-5 w-5 text-electric" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-green">{stat.change}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-border bg-card p-6 transition-all hover:border-electric/50"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/10 text-electric">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{item.label}</h3>
              </div>
              <p className="text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
