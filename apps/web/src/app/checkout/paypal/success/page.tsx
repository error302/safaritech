'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PayPalSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const token = searchParams.get('token') // PayPal order ID is passed as 'token'
  const [error, setError] = useState<string | null>(null)
  const captured = useRef(false)

  useEffect(() => {
    if (!orderId || !token) {
      router.push('/checkout')
      return
    }

    if (captured.current) return
    captured.current = true

    const capturePayment = async () => {
      try {
        const response = await fetch('/api/checkout/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paypalOrderId: token,
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Success! Redirect to the standard checkout success page
          router.push(`/checkout/success?orderId=${orderId}`)
        } else {
          setError(data.error || 'Payment capture failed')
        }
      } catch (err) {
        console.error('Capture error:', err)
        setError('Failed to contact server to verify payment')
      }
    }

    capturePayment()
  }, [orderId, token, router])

  if (error) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 max-w-sm rounded-2xl border border-red-200 md:border-red-900 bg-white md:bg-safarigray shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 md:bg-red-900/20">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-600 md:text-red-400 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 md:text-white mb-2">Payment Verification Failed</h1>
          <p className="text-red-600 md:text-red-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-neon text-black font-bold py-2.5 px-4 rounded-lg hover:bg-neon/90 transition-colors text-sm"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-sm rounded-2xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray shadow-xl backdrop-blur-md">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 md:bg-blue-900/20 mx-auto">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 md:text-white mb-2">Verifying Payment...</h1>
        <p className="text-gray-500 md:text-gray-400 text-sm">Please do not close this window while we confirm your payment with PayPal.</p>
      </div>
    </div>
  )
}
