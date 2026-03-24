'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<{
    id: string
    status: string
    items: { name: string; quantity: number; price: number }[]
    total: number
    createdAt: string
    timeline: { status: string; date: string; completed: boolean }[]
  } | null>(null)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (orderId === 'DEMO123') {
        setOrder({
          id: 'DEMO123',
          status: 'shipped',
          items: [
            { name: 'iPhone 15 Pro Max', quantity: 1, price: 139999 },
          ],
          total: 139999,
          createdAt: '2024-01-20',
          timeline: [
            { status: 'Order Placed', date: 'Jan 20, 2024 - 10:30 AM', completed: true },
            { status: 'Payment Confirmed', date: 'Jan 20, 2024 - 10:35 AM', completed: true },
            { status: 'Processing', date: 'Jan 21, 2024 - 9:00 AM', completed: true },
            { status: 'Shipped', date: 'Jan 22, 2024 - 2:00 PM', completed: true },
            { status: 'Out for Delivery', date: 'Jan 23, 2024 - 8:00 AM', completed: false },
            { status: 'Delivered', date: 'Expected by Jan 24', completed: false },
          ],
        })
      } else {
        setError('Order not found. Try DEMO123 for a demo.')
      }
      setLoading(false)
    }, 1000)
  }

  const getStatusIcon = (completed: boolean, status: string) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green" />
    if (status === 'Out for Delivery') return <Truck className="h-5 w-5 text-electric" />
    if (status === 'Delivered') return <CheckCircle className="h-5 w-5 text-green" />
    return <Clock className="h-5 w-5 text-muted" />
  }

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Track Your Order</h1>
          <p className="text-muted">
            Enter your order ID and email to track your delivery in real-time.
          </p>
        </div>

        {/* Search Form */}
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderId" className="mb-2 block text-sm font-medium">
                  Order ID
                </label>
                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                  placeholder="e.g., DEMO123"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red/10 border border-red/20 p-3 text-sm text-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Tracking...' : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Hint */}
        <div className="mb-8 rounded-lg bg-electric/10 border border-electric/20 p-4 text-center">
          <p className="text-sm text-electric">
            Demo: Enter <strong>DEMO123</strong> to see a sample order tracking
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Order ID</p>
                  <p className="text-xl font-bold">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Order Date</p>
                  <p className="font-medium">{order.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="mb-6 text-lg font-semibold">Delivery Progress</h3>
              <div className="space-y-6">
                {order.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.completed, item.status)}
                      {idx < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${item.completed ? 'bg-green' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-medium ${item.completed ? 'text-text' : 'text-muted'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-muted">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-border p-6">
              <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex justify-between">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold text-electric">KSh {order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
