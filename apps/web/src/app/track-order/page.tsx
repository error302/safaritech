'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Search, Package, Truck, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'

export default function TrackOrder() {
  const { data: session } = useSession()
  const [orderId, setOrderId] = useState('')
  const [searchedOrderId, setSearchedOrderId] = useState('')

  const { data: order, isLoading, error: queryError } = trpc.order.getById.useQuery(
    { id: searchedOrderId },
    { enabled: !!searchedOrderId && !!session }
  )

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      return
    }
    setSearchedOrderId(orderId.trim())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'PROCESSING': return <Package className="h-5 w-5 text-blue-500" />
      case 'SHIPPED': return <Truck className="h-5 w-5 text-purple-500" />
      case 'DELIVERED': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CANCELLED': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500'
      case 'PROCESSING': return 'text-blue-500'
      case 'SHIPPED': return 'text-purple-500'
      case 'DELIVERED': return 'text-green-500'
      case 'CANCELLED': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const timeline = [
    { status: 'PENDING', label: 'Order Placed' },
    { status: 'PROCESSING', label: 'Processing' },
    { status: 'SHIPPED', label: 'Shipped' },
    { status: 'DELIVERED', label: 'Delivered' },
  ]

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Track Your Order</h1>
          <p className="text-gray-500 md:text-gray-400">
            Enter your order ID to track your delivery in real-time.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 mb-8">
          {!session ? (
            <div className="text-center py-8">
              <p className="text-gray-500 md:text-gray-400 mb-4">Please sign in to track your orders</p>
              <Link
                href="/login"
                className="bg-neon hover:bg-neon-dim text-black font-bold px-6 py-3 rounded-lg text-sm transition-all"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="mb-2 block text-sm font-medium text-gray-900 md:text-white">
                  Order ID
                </label>
                <div className="flex gap-3">
                  <input
                    id="orderId"
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    className="flex-1 rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-3 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
                    placeholder="e.g., ORD-XXXXXXXX"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-neon hover:bg-neon-dim text-black font-bold px-6 py-3 rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    Track
                  </button>
                </div>
              </div>

              {queryError && (
                <div className="rounded-lg bg-red-50 md:bg-red-900/20 border border-red-200 md:border-red-800 p-3 text-sm text-red-600 md:text-red-400">
                  Order not found or you don&apos;t have permission to view it.
                </div>
              )}
            </form>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-10 w-10 text-neon animate-spin mb-4" />
            <p className="text-gray-500 md:text-gray-400">Tracking order...</p>
          </div>
        )}

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
                  <p className="font-medium text-gray-900 md:text-white">
                    {new Date(order.createdAt).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900 md:text-white">Delivery Progress</h3>
              <div className="space-y-6">
                {timeline.map((item, idx) => {
                  const isCompleted = timeline.findIndex(t => t.status === order.status) >= idx
                  const isCurrent = order.status === item.status

                  return (
                    <div key={item.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200 md:bg-safariborder'
                        }`}>
                          {isCompleted && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 md:bg-safariborder'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className={`font-medium ${isCompleted ? 'text-gray-900 md:text-white' : 'text-gray-400'}`}>
                          {item.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-neon">Current Status</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 md:border-safariborder p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-white">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900 md:text-white">{item.product.name}</p>
                      <p className="text-sm text-gray-500 md:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-neon">KSh {(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <div className="border-t border-gray-200 md:border-safariborder pt-3 flex justify-between">
                  <p className="font-semibold text-gray-900 md:text-white">Total</p>
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
