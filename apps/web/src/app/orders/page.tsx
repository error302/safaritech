import Link from 'next/link'
import { Package, ChevronRight, Clock, Truck, CheckCircle } from 'lucide-react'

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 md:text-yellow' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-600 md:text-blue' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-600 md:text-purple' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 md:text-neon' },
}

export default function Orders() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 md:mb-8 font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">My Orders</h1>

        <div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-8 md:p-12 text-center">
          <Package className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300 md:text-gray-600 mb-4" />
          <h2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900 md:text-white">No orders yet</h2>
          <p className="text-sm text-gray-500 md:text-gray-400 mb-6">Start shopping to see your orders here.</p>
          <Link
            href="/shop"
            className="inline-block bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
