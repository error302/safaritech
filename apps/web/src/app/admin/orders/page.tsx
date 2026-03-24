import Link from 'next/link'
import { Eye, Search } from 'lucide-react'

const orders = [
  { id: 'ORD-001', customer: 'John Doe', total: 139999, status: 'pending', date: '2024-01-24' },
  { id: 'ORD-002', customer: 'Sarah Kimani', total: 49999, status: 'shipped', date: '2024-01-24' },
  { id: 'ORD-003', customer: 'David Ochieng', total: 249999, status: 'delivered', date: '2024-01-23' },
]

const statusColors = {
  pending: 'text-yellow',
  processing: 'text-blue',
  shipped: 'text-purple',
  delivered: 'text-green',
}

export default function AdminOrders() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted">Manage and track all orders</p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-text placeholder:text-muted focus:border-electric focus:outline-none"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-mono font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3 text-muted">{order.date}</td>
                  <td className="px-4 py-3">KSh {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 text-muted hover:text-electric inline-flex">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
