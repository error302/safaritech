'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, CreditCard, Smartphone, Lock, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'

export default function Checkout() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    notes: '',
  })

  const cartTotal = total()
  const shipping = cartTotal > 10000 ? 0 : 500
  const finalTotal = cartTotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      clearCart()
      router.push('/checkout/success')
    }, 2000)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted mb-4" />
          <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/cart" className="mb-6 inline-flex items-center text-sm text-muted hover:text-electric">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                    Phone (for M-Pesa)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="mb-2 block text-sm font-medium">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="mb-2 block text-sm font-medium">
                      City/Town
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="county" className="mb-2 block text-sm font-medium">
                      County
                    </label>
                    <input
                      id="county"
                      type="text"
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                      required
                      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'mpesa' ? 'border-electric bg-electric/5' : 'border-border'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                    className="text-electric"
                  />
                  <Smartphone className="h-6 w-6 text-green" />
                  <div className="flex-1">
                    <p className="font-medium">M-Pesa</p>
                    <p className="text-sm text-muted">Pay with M-Pesa STK Push</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-electric bg-electric/5' : 'border-border'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-electric"
                  />
                  <CreditCard className="h-6 w-6 text-blue" />
                  <div className="flex-1">
                    <p className="font-medium">Card Payment</p>
                    <p className="text-sm text-muted">Visa, Mastercard</p>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Lock className="h-4 w-4" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted">{item.name} x{item.quantity}</span>
                    <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `KSh ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-electric">KSh {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-6 py-3"
              >
                {loading ? 'Processing...' : `Pay KSh ${finalTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
