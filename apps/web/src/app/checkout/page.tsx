'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, CreditCard, Smartphone, Lock, ArrowLeft, Tag, X, CheckCircle, Loader2 } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'

export default function Checkout() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    county: '',
    notes: '',
  })

  const cartTotal = total()
  const shipping = cartTotal > 10000 ? 0 : 500
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const finalTotal = cartTotal + shipping - discount

  const validateCoupon = trpc.coupon.validate.useQuery(
    { code: couponCode.toUpperCase(), orderTotal: cartTotal },
    { enabled: false }
  )

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      clearCart()
      if (paymentMethod === 'mpesa' && data.checkoutRequestId) {
        // Redirect to M-Pesa payment page with order details
        router.push(`/checkout/payment?orderId=${data.orderId}&checkoutRequestId=${data.checkoutRequestId}&total=${data.total}`)
      } else if (paymentMethod === 'card') {
        // Redirect to Stripe checkout
        router.push(`/checkout/stripe?orderId=${data.orderId}&total=${data.total}`)
      } else {
        router.push(`/checkout/success?orderId=${data.orderId}`)
      }
    },
    onError: (error) => {
      setError(error.message || 'Failed to create order. Please try again.')
      setLoading(false)
    },
  })

  const handleApplyCoupon = async () => {
    setCouponError('')
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    try {
      const result = await validateCoupon.refetch()
      if (result.data?.valid && result.data.discount !== undefined) {
        setAppliedCoupon({ code: couponCode.toUpperCase(), discount: result.data.discount })
      } else {
        setCouponError(result.data?.error || 'Invalid coupon code')
      }
    } catch {
      setCouponError('Failed to validate coupon')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (items.length === 0) {
      setError('Your cart is empty')
      setLoading(false)
      return
    }

    if (!session?.user) {
      setError('Please sign in to place an order')
      setLoading(false)
      return
    }

    const orderItems = items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    createOrder.mutate({
      items: orderItems,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        county: formData.county,
      },
      paymentMethod,
      couponCode: appliedCoupon?.code,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center bg-white md:bg-safaridark">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 md:text-gray-500 mb-4" />
          <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-white">Your cart is empty</h1>
          <Link href="/shop" className="inline-block bg-neon text-black font-bold rounded-lg px-6 py-3 hover:bg-neon/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-8 bg-white md:bg-safaridark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="mb-4 md:mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="mb-6 md:mb-8 text-2xl md:text-3xl font-bold text-gray-900 md:text-white">Checkout</h1>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 md:bg-red-900/20 border border-red-200 md:border-red-800 text-red-700 md:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Contact Info */}
            <div className="rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6">
              <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-900 md:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                    Phone (for M-Pesa)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6">
              <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-900 md:text-white">Shipping Address</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                      City/Town
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="county" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                      County
                    </label>
                    <input
                      id="county"
                      type="text"
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 md:px-4 py-2.5 text-sm md:text-base text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6">
              <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-900 md:text-white">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'mpesa'
                  ? 'border-neon bg-neon/5 md:bg-neon/10'
                  : 'border-gray-200 md:border-safariborder bg-white md:bg-safaridark hover:border-gray-300 md:hover:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                    className="text-neon accent-neon"
                  />
                  <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 md:text-white">M-Pesa</p>
                    <p className="text-xs md:text-sm text-gray-500">Pay with M-Pesa STK Push</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                  ? 'border-neon bg-neon/5 md:bg-neon/10'
                  : 'border-gray-200 md:border-safariborder bg-white md:bg-safaridark hover:border-gray-300 md:hover:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-neon accent-neon"
                  />
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 md:text-white">Card Payment</p>
                    <p className="text-xs md:text-sm text-gray-500">Visa, Mastercard</p>
                  </div>
                </label>
              </div>

              <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6 sticky top-24">
              <h2 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-gray-900 md:text-white">Order Summary</h2>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 max-h-48 md:max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.name} x{item.quantity}</span>
                    <span className="text-gray-900 md:text-white">KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-200 md:border-safariborder pt-3 md:pt-4 mb-3 md:mb-4">
                <label className="mb-1.5 md:mb-2 block text-sm font-medium text-gray-700 md:text-gray-300">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 md:bg-green/10 border border-green-200 md:border-green/20 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 md:text-green" />
                      <span className="text-sm font-medium text-green-700 md:text-green">{appliedCoupon.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-red-500 md:text-gray-500 md:hover:text-red transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 py-2 text-sm text-gray-900 md:text-white placeholder-gray-400 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isFetching}
                        className="flex items-center justify-center rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray px-3 py-2 text-sm text-gray-700 md:text-gray-300 hover:bg-gray-100 md:hover:bg-safaridark transition-colors disabled:opacity-50"
                      >
                        {validateCoupon.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs md:text-sm text-red-500 md:text-red">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 md:border-safariborder pt-3 md:pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 md:text-white">KSh {cartTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 md:text-green text-sm">
                    <span>Discount</span>
                    <span>-KSh {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900 md:text-white">{shipping === 0 ? 'FREE' : `KSh ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="border-t border-gray-200 md:border-safariborder pt-2 flex justify-between text-lg font-bold">
                  <span className="text-gray-900 md:text-white">Total</span>
                  <span className="text-neon">KSh {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || createOrder.isPending || !session}
                className="w-full mt-4 md:mt-6 py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : !session ? (
                  'Please Sign In'
                ) : (
                  `Place Order — KSh ${finalTotal.toLocaleString()}`
                )}
              </button>

              {!session && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  <Link href="/login" className="text-neon hover:underline">Sign in</Link> to place your order
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
