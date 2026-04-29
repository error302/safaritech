"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { trpc } from "@/utils/trpc";
import Image from "next/image";

export default function Cart() {
  const utils = trpc.useUtils();
  const { data: cart, isLoading } = trpc.cart.getCart.useQuery();
  const items = cart?.items ?? [];

  const updateQuantity = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const removeItem = trpc.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white md:bg-safaridark py-8 flex justify-center">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-7xl px-4">
          <div className="h-8 w-48 bg-gray-200 md:bg-safarigray rounded-xl mb-4" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 md:bg-safarigray rounded-2xl" />)}
            </div>
            <div className="h-64 bg-gray-200 md:bg-safarigray rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 px-4 bg-white md:bg-safaridark">
        <div className="text-center bg-white md:bg-safarigray rounded-2xl md:border md:border-safariborder p-8 md:p-12 max-w-md w-full shadow-sm">
          <div className="w-20 h-20 bg-gray-50 md:bg-safaridark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="mb-3 text-2xl font-bold font-display text-gray-900 md:text-white">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full bg-gray-900 md:bg-neon hover:bg-gray-800 md:hover:bg-neon-dim text-white md:text-black font-bold font-display text-sm py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-12 bg-gray-50 md:bg-safaridark pb-32 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <Link href="/shop" className="text-gray-500 hover:text-gray-900 md:hover:text-white transition-colors w-10 h-10 flex items-center justify-center bg-white md:bg-safarigray rounded-full border border-gray-200 md:border-safariborder">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 md:text-white">
            Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const images = item.product.images ? item.product.images.split(',') : [];
              const image = images[0] || '/placeholder.jpg';
              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-gray-100 md:border-safariborder bg-white md:bg-safarigray p-4 md:p-5 shadow-sm md:shadow-none"
                >
                  <div className="relative h-24 w-24 md:h-28 md:w-28 flex-shrink-0 rounded-xl bg-gray-50 md:bg-safaridark overflow-hidden border border-gray-100 md:border-safariborder">
                    <Image src={image} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold font-display text-base md:text-lg text-gray-900 md:text-white truncate">
                      {item.product.name}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-gray-200 md:border-gray-600 inline-block bg-gray-200" />
                        Color: <span className="font-medium text-gray-700 md:text-gray-300">{item.selectedColor}</span>
                      </p>
                    )}
                    <p className="text-neon font-black font-display text-lg mt-2">
                      KES {item.product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem.mutate({ itemId: item.id })}
                      disabled={removeItem.isPending}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 md:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center border border-gray-200 md:border-safariborder rounded-lg overflow-hidden bg-white md:bg-safaridark">
                      <button
                        onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || updateQuantity.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 md:hover:bg-safarigray transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3 text-gray-600 md:text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900 md:text-white border-x border-gray-200 md:border-safariborder">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        disabled={updateQuantity.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 md:hover:bg-safarigray transition-colors"
                      >
                        <Plus className="h-3 w-3 text-gray-600 md:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 md:border-safariborder bg-white md:bg-safarigray p-6 md:p-8 sticky top-24 shadow-sm md:shadow-none">
              <h2 className="mb-6 text-xl font-bold font-display text-gray-900 md:text-white">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="text-gray-900 md:text-white font-semibold">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900 md:text-white">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-gray-100 md:border-safariborder pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 md:text-white font-bold">Total</span>
                  <span className="text-2xl font-black font-display text-neon">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-gray-900 md:bg-neon hover:bg-gray-800 md:hover:bg-neon-dim text-white md:text-black font-bold font-display text-base py-4 rounded-xl text-center transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
