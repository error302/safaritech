import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/server/auth'
import { prisma } from '@/server/db'
import Link from 'next/link'
import { Package, Heart, Settings, CreditCard, MapPin } from 'lucide-react'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const userId = session.user.id

  // Fetch real stats from database
  const [totalOrders, wishlistItems, reviews] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ where: { userId } }),
    prisma.review.count({ where: { userId } }),
  ])

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: MapPin, label: 'Addresses', href: '/settings' },
    { icon: CreditCard, label: 'Payment Methods', href: '/settings' },
    { icon: Settings, label: 'Account Settings', href: '/settings' },
  ]

  const stats = [
    { label: 'Total Orders', value: totalOrders.toString() },
    { label: 'Wishlist Items', value: wishlistItems.toString() },
    { label: 'Reviews', value: reviews.toString() },
    { label: 'Coupons', value: '0' }, // Hardcoded - no user coupons model yet
  ]

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">
            Welcome back, {session.user?.name || 'Customer'}!
          </h1>
          <p className="text-sm text-gray-500 md:text-gray-400 mt-1">Manage your account and orders</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6">
              <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-neon mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6 transition-all hover:border-neon/50"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-green-50 md:bg-neon/10 text-green-600 md:text-neon">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 md:text-white">{item.label}</h3>
                  <p className="text-xs text-gray-500 md:text-gray-400">View and manage</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}
