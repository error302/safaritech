'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted mb-4" />
          <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Shopping Cart ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-surface flex items-center justify-center text-muted">
                  Image
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-electric font-bold">KSh {item.price.toLocaleString()}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded border border-border hover:border-electric"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded border border-border hover:border-electric"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red hover:bg-red/10 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-electric">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn btn-primary w-full py-3">
                Proceed to Checkout
              </Link>
              <Link href="/shop" className="block text-center mt-4 text-sm text-muted hover:text-electric">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
