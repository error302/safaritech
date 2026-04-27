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
    if (status === 'Out for Delivery') return <Truck className="h-5 w-5 text-neon" />
    if (status === 'Delivered') return <CheckCircle className="h-5 w-5 text-green" />
    return <Clock className="h-5 w-5 text-gray-500 md:text-gray-400" />
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Track Your Order</h1>
          <p className="text-gray-500 md:text-gray-400">
            Enter your order ID and email to track your delivery in real-time.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 mb-8">
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
                  className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
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
                  className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
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
              className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all w-full py-3"
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

        <div className="mb-8 rounded-lg bg-electric/10 border border-electric/20 p-4 text-center">
          <p className="text-sm text-neon">
            Demo: Enter <strong>DEMO123</strong> to see a sample order tracking
          </p>
        </div>

        {order && (
          <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden">
            <div className="border-b border-gray-200 md:border-safariborder p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 md:text-gray-400">Order ID</p>
                  <p className="text-xl font-bold text-gray-900 md:text-white">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 md:text-gray-400">Order Date</p>
                  <p className="font-medium">{order.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900 md:text-white">Delivery Progress</h3>
              <div className="space-y-6">
                {order.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.completed, item.status)}
                      {idx < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${item.completed ? 'bg-green' : 'bg-gray-200 md:bg-safariborder'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-medium ${item.completed ? 'text-gray-900 md:text-white' : 'text-gray-500 md:text-gray-400'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-500 md:text-gray-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 md:border-safariborder p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-white">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 md:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                  </div>
                ))}
                <div className="border-t border-gray-200 md:border-safariborder pt-3 flex justify-between">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold text-neon">KSh {order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
