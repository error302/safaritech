import Link from 'next/link'
import { Package, ChevronRight, Clock, Truck, CheckCircle } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { formatDate } from '@/lib/utils'

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: 'Pending', icon: Clock, color: 'text-amber-600 md:text-yellow' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue-600 md:text-blue' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple-600 md:text-purple' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 md:text-neon' },
}

export default function Orders() {
  const { data: orders, isLoading } = trpc.order.getByUser.useQuery()

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 md:mb-8 font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">My Orders</h1>

        {isLoading ? (
          <div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-8 md:p-12 text-center">
            <div className="mx-auto h-12 w-12 md:h-16 md:w-16 border-4 border-gray-200 md:border-gray-600 border-t-neon rounded-full animate-spin mb-4" />
            <h2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900 md:text-white">Loading orders...</h2>
            <p className="text-sm text-gray-500 md:text-gray-400">Please wait while we fetch your order history.</p>
          </div>
        ) : !orders || orders.length === 0 ? (
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
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-4 md:p-6 hover:border-neon/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 md:text-white text-sm md:text-base">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500 md:text-gray-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 md:text-white">
                        ${order.total.toFixed(2)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-neon transition-colors" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
