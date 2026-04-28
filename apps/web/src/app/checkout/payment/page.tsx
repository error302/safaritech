'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Smartphone, RefreshCcw, CheckCircle, AlertCircle } from 'lucide-react'
import { trpc } from '@/utils/trpc'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const checkoutRequestId = searchParams.get('checkoutRequestId')
  const total = searchParams.get('total')

  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [pollingCount, setPollingCount] = useState(0)

  const orderQuery = trpc.order.getById.useQuery(
    { id: orderId || '' },
    { enabled: !!orderId, refetchInterval: status === 'pending' ? 5000 : false }
  )

  useEffect(() => {
    if (!orderId || !checkoutRequestId) {
      router.push('/checkout')
      return
    }
  }, [orderId, checkoutRequestId, router])

  useEffect(() => {
    if (orderQuery.data) {
      if (orderQuery.data.paymentStatus === 'PAID') {
        setStatus('completed')
        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${orderId}`)
        }, 2000)
      } else if (orderQuery.data.paymentStatus === 'FAILED') {
        setStatus('failed')
      } else if (pollingCount > 60) {
        // Stop polling after 5 minutes (60 * 5 seconds)
        setStatus('failed')
      }
      setPollingCount(prev => prev + 1)
    }
  }, [orderQuery.data, pollingCount, orderId, router])

  const handleRetry = () => {
    setStatus('pending')
    setPollingCount(0)
    orderQuery.refetch()
  }

  if (!orderId || !checkoutRequestId) {
    return null // Will redirect
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16 flex items-center justify-center">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 md:bg-green-900/20">
            <Smartphone className="h-10 w-10 text-green-600 md:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-white mb-2">Complete Payment</h1>
          <p className="text-gray-500 md:text-gray-400">
            Check your phone for the M-Pesa STK push notification
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 md:text-gray-400">Order ID</span>
            <span className="font-mono text-sm font-bold text-neon">{orderId}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 md:text-gray-400">Amount</span>
            <span className="font-bold text-neon">KSh {Number(total).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 md:text-gray-400">Status</span>
            <span className={`inline-flex items-center gap-1 text-sm font-medium ${
              status === 'completed' ? 'text-green-600 md:text-green-400' :
              status === 'failed' ? 'text-red-600 md:text-red-400' :
              'text-yellow-600 md:text-yellow-400'
            }`}>
              {status === 'pending' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === 'completed' && <CheckCircle className="h-4 w-4" />}
              {status === 'failed' && <AlertCircle className="h-4 w-4" />}
              {status === 'pending' && 'Waiting for payment...'}
              {status === 'processing' && 'Processing...'}
              {status === 'completed' && 'Payment successful!'}
              {status === 'failed' && 'Payment failed'}
            </span>
          </div>
        </div>

        {status === 'pending' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 md:bg-blue-900/20 border border-blue-200 md:border-blue-800 p-4">
              <h3 className="font-medium text-blue-900 md:text-blue-300 mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 md:text-blue-400 space-y-1">
                <li>Check your phone for M-Pesa notification</li>
                <li>Enter your M-Pesa PIN when prompted</li>
                <li>Wait for confirmation</li>
              </ol>
            </div>
            <p className="text-center text-sm text-gray-500">
              This page will update automatically when payment is received.
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 md:bg-red-900/20 border border-red-200 md:border-red-800 p-4">
              <h3 className="font-medium text-red-900 md:text-red-300 mb-2">Payment Failed</h3>
              <p className="text-sm text-red-800 md:text-red-400">
                The payment was not completed. You can try again or use a different payment method.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 bg-neon text-black font-bold px-5 py-3 rounded-lg hover:bg-neon/90 transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/checkout"
                className="text-center text-gray-500 md:text-gray-400 hover:text-neon transition-colors"
              >
                Return to checkout
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-neon hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
