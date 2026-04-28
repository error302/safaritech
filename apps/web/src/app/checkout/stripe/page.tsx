'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function StripeCheckout() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const total = searchParams.get('total')

  useEffect(() => {
    if (!orderId || !total) {
      router.push('/checkout')
      return
    }

    // Create Stripe checkout session and redirect
    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: Number(total),
          }),
        })

        const data = await response.json()

        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else {
          console.error('Failed to create Stripe checkout session:', data.error)
          router.push(`/checkout?error=${encodeURIComponent(data.error || 'Failed to create checkout session')}`)
        }
      } catch (error) {
        console.error('Stripe checkout error:', error)
        router.push('/checkout?error=Failed to initiate card payment')
      }
    }

    createCheckoutSession()
  }, [orderId, total, router])

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 text-neon animate-spin mb-4" />
        <h1 className="text-xl font-bold text-gray-900 md:text-white mb-2">Redirecting to Stripe...</h1>
        <p className="text-gray-500 md:text-gray-400">Please wait while we set up your secure payment.</p>
      </div>
    </div>
  )
}
