import Link from 'next/link'
import { Package, ChevronRight, Clock, Truck, CheckCircle } from 'lucide-react'

const orders = [
  {
    id: 'ORD-ABC123',
    date: '2024-01-20',
    status: 'delivered',
    total: 139999,
    items: [{ name: 'iPhone 15 Pro Max', quantity: 1 }],
  },
  {
    id: 'ORD-DEF456',
    date: '2024-01-22',
    status: 'shipped',
    total: 49999,
    items: [{ name: 'AirPods Pro 2', quantity: 2 }],
  },
  {
    id: 'ORD-GHI789',
    date: '2024-01-23',
    status: 'processing',
    total: 249999,
    items: [
      { name: 'MacBook Pro M3', quantity: 1 },
      { name: 'Apple Magic Mouse', quantity: 1 },
    ],
  },
]

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow' },
  processing: { label: 'Processing', icon: Package, color: 'text-blue' },
  shipped: { label: 'Shipped', icon: Truck, color: 'text-purple' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green' },
}

export default function Orders() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon

              return (
                <div key={order.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="border-b border-border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-medium">{order.id}</p>
                        <p className="text-sm text-muted">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted">{item.name} x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-electric">
                        KSh {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between p-4 border-t border-border text-sm text-electric hover:bg-surface transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-muted mb-4" />
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="text-muted mb-6">Start shopping to see your orders here.</p>
            <Link href="/shop" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
