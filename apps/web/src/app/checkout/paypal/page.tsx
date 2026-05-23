'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PayPalCheckout() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const total = searchParams.get('total')
  const initiated = useRef(false)

  useEffect(() => {
    if (!orderId || !total) {
      router.push('/checkout')
      return
    }

    if (initiated.current) return
    initiated.current = true

    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/checkout/paypal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: Number(total),
          }),
        })

        const data = await response.json()

        if (data.url) {
          // Redirect to PayPal approval page
          window.location.href = data.url
        } else {
          console.error('Failed to create PayPal session:', data.error)
          router.push(`/checkout?error=${encodeURIComponent(data.error || 'Failed to create PayPal session')}`)
        }
      } catch (error) {
        console.error('PayPal checkout error:', error)
        router.push('/checkout?error=Failed to initiate PayPal payment')
      }
    }

    createCheckoutSession()
  }, [orderId, total, router])

  return (
    <div className="bg-safaridark min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-sm rounded-2xl border border-safariborder bg-safarigray shadow-xl backdrop-blur-md">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 md:bg-blue-900/20 mx-auto">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current text-blue-500 animate-pulse" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.007 6.467c-.201-.192-.472-.341-.812-.444-.34-.104-.766-.156-1.278-.156H9.72c-.229 0-.441.139-.533.348l-3.32 7.574a.591.591 0 0 0 .533.824h2.518c.28 0 .532-.178.625-.443l.89-2.544a1.18 1.18 0 0 1 1.12-.788h1.996c1.393 0 2.47-.367 3.232-1.101.762-.734 1.143-1.789 1.143-3.167 0-.319-.047-.639-.14-.959a4.832 4.832 0 0 0-.46-1.147M16.592 12.3c-.63.535-1.503.803-2.617.803h-2.146a.592.592 0 0 0-.563.411l-.816 2.502c-.093.284.118.577.416.577h2.09c.307 0 .584-.195.684-.486l.668-1.928a.593.593 0 0 1 .564-.397h.655c1.472 0 2.613-.393 3.424-1.18.81-.787 1.215-1.912 1.215-3.376 0-.323-.024-.627-.07-.912a7.1 7.1 0 0 1-.58 2.057c-.452 1.344-1.26 2.394-2.424 3.03z"/>
          </svg>
          <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Connecting to PayPal...</h1>
        <p className="text-gray-500 md:text-gray-400 text-sm">Please wait while we secure your transaction connection.</p>
      </div>
    </div>
  )
}
