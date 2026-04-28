'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { Loader2 } from 'lucide-react'

export default function CheckoutSuccess() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const { data: order, isLoading } = trpc.order.getById.useQuery(
    { id: orderId || '' },
    { enabled: !!orderId }
  )

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-neon animate-spin mb-4" />
          <h1 className="text-xl font-bold text-gray-900 md:text-white">Loading order details...</h1>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-white">Order Not Found</h1>
          <p className="text-gray-500 md:text-gray-400 mb-6">
            We couldn&apos;t find your order details. Please check your order confirmation email or contact support.
          </p>
          <Link href="/shop" className="inline-block bg-neon text-black font-bold rounded-lg px-6 py-3 hover:bg-neon/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16 flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 md:bg-green-900/20">
          <CheckCircle className="h-12 w-12 text-green-600 md:text-green-400" />
        </div>

        <h1 className="mb-4 text-3xl font-bold font-display text-gray-900 md:text-white">Order Confirmed!</h1>
        <p className="text-gray-500 md:text-gray-400 mb-6">
          Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
        </p>

        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 md:text-gray-400">Order ID</span>
            <span className="font-mono font-bold text-neon">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 md:text-gray-400">Status</span>
            <span className="inline-flex items-center gap-1 text-green-600 md:text-green-400">
              <CheckCircle className="h-4 w-4" />
              {order?.paymentStatus === 'PAID' ? 'Paid' : 'Pending Payment'}
            </span>
          </div>
          {order && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 md:border-safariborder">
              <span className="text-gray-500 md:text-gray-400">Total</span>
              <span className="font-bold text-neon">KSh {order.total.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 rounded-lg bg-neon/10 p-4 text-left">
            <Mail className="h-5 w-5 text-neon flex-shrink-0" />
            <p className="text-sm text-gray-700 md:text-gray-300">
              Check your email for order confirmation and delivery updates
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white md:bg-safarigray border border-gray-200 md:border-safariborder p-4 text-left">
            <Package className="h-5 w-5 text-neon flex-shrink-0" />
            <p className="text-sm text-gray-700 md:text-gray-300">
              Track your order in real-time from our warehouse to your doorstep
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href={`/orders/${orderId}`} className="flex items-center justify-center gap-2 bg-neon text-black font-bold px-5 py-3 rounded-lg hover:bg-neon/90 transition-colors">
            View Order Details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/shop" className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-5 py-3 rounded-lg font-medium transition-all hover:border-neon hover:text-neon">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
