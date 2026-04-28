'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore()
  const cartTotal = total()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 px-4 bg-white md:bg-safaridark">
        <div className="text-center bg-white md:bg-safarigray rounded-xl md:border md:border-safariborder p-6 md:p-10 max-w-md w-full">
          <ShoppingBag className="mx-auto h-14 w-14 md:h-16 md:w-16 text-gray-400 md:text-gray-500 mb-4" />
          <h1 className="mb-2 text-xl md:text-2xl font-bold font-display text-gray-900 md:text-white">
            Your cart is empty
          </h1>
          <p className="text-sm md:text-base text-gray-500 md:text-gray-400 mb-6 font-body">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full bg-neon hover:brightness-110 text-safaridark font-bold font-display text-sm md:text-base py-3 rounded-lg transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-8 bg-white md:bg-safaridark">
      <div className="mx-auto max-w-7xl px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4 md:mb-8">
          <Link href="/shop" className="text-gray-500 md:text-gray-400 hover:text-gray-700 md:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl md:text-3xl font-bold font-display text-gray-900 md:text-white">
            Shopping Cart ({items.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 md:gap-4 rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-3 md:p-4"
              >
                <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 rounded-lg bg-gray-50 md:bg-safaridark flex items-center justify-center text-gray-400 md:text-gray-500 text-xs font-body">
                  Image
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold font-display text-sm md:text-base text-gray-900 md:text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-neon font-bold font-display text-sm md:text-base mt-0.5">
                    KSh {item.price.toLocaleString()}
                  </p>
<div className="mt-2 flex items-center gap-3 md:gap-4">
<div className="flex items-center border border-gray-200 md:border-safariborder rounded-lg overflow-hidden">
<button
onClick={() => updateQuantity(item.id, item.quantity - 1)}
className="w-10 h-10 flex items-center justify-center bg-gray-50 md:bg-safaridark hover:bg-gray-100 md:hover:bg-safariborder transition-colors touch-target"
>
<Minus className="h-4 w-4 text-gray-600 md:text-gray-300" />
</button>
<span className="w-10 md:w-12 text-center text-sm md:text-base font-semibold font-body text-gray-900 md:text-white border-x border-gray-200 md:border-safariborder">
{item.quantity}
</span>
<button
onClick={() => updateQuantity(item.id, item.quantity + 1)}
className="w-10 h-10 flex items-center justify-center bg-gray-50 md:bg-safaridark hover:bg-gray-100 md:hover:bg-safariborder transition-colors touch-target"
>
<Plus className="h-4 w-4 text-gray-600 md:text-gray-300" />
</button>
</div>
<button
onClick={() => removeItem(item.id)}
className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 md:hover:bg-red-500/10 rounded-lg transition-colors touch-target"
>
<Trash2 className="h-5 w-5" />
</button>
                  </div>
                </div>
                <div className="text-right self-center">
                  <p className="font-bold font-display text-sm md:text-base text-gray-900 md:text-white">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg md:rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-6 sticky top-20 md:top-24">
              <h2 className="mb-3 md:mb-4 text-lg md:text-xl font-bold font-display text-gray-900 md:text-white">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm md:text-base font-body">
                  <span className="text-gray-500 md:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 md:text-white font-semibold">KSh {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base font-body">
                  <span className="text-gray-500 md:text-gray-400">Shipping</span>
                  <span className="text-gray-900 md:text-white">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-gray-200 md:border-safariborder pt-3 md:pt-4 mb-4 md:mb-6">
                <div className="flex justify-between text-base md:text-lg font-bold font-display">
                  <span className="text-gray-900 md:text-white">Total</span>
                  <span className="text-neon">KSh {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-neon hover:brightness-110 text-safaridark font-bold font-display text-sm md:text-base py-3 rounded-lg text-center transition-all"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/shop"
                className="block text-center mt-3 md:mt-4 text-xs md:text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors font-body"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
