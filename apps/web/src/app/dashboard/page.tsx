import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/server/auth'
import Link from 'next/link'
import { Package, Heart, Settings, CreditCard, MapPin } from 'lucide-react'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: MapPin, label: 'Addresses', href: '/addresses' },
    { icon: CreditCard, label: 'Payment Methods', href: '/payment-methods' },
    { icon: Settings, label: 'Account Settings', href: '/settings' },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {session.user?.name || 'Customer'}!</h1>
          <p className="text-muted">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Total Orders</p>
            <p className="text-3xl font-bold text-electric">0</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Wishlist Items</p>
            <p className="text-3xl font-bold text-electric">0</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Reviews</p>
            <p className="text-3xl font-bold text-electric">0</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Coupons</p>
            <p className="text-3xl font-bold text-electric">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-electric/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-electric/10 text-electric">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted">View and manage</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
