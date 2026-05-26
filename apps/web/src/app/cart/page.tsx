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
      <div className="min-h-screen bg-safaridark py-8 flex justify-center">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-7xl px-4">
          <div className="h-8 w-48 bg-safarigray rounded-xl mb-4" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-safarigray rounded-2xl" />)}
            </div>
            <div className="h-64 bg-safarigray rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 md:py-12 px-4 bg-safaridark">
        <div className="text-center bg-safarigray rounded-2xl md:border md:border-safariborder p-8 md:p-12 max-w-md w-full shadow-sm">
          <div className="w-20 h-20 bg-safaridark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="mb-3 text-2xl font-bold font-display text-white">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-block w-full bg-neon hover:bg-neon-dim text-black font-bold font-display text-sm py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-12 bg-safaridark pb-40 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <Link href="/shop" className="text-gray-500 hover:text-white transition-colors w-10 h-10 flex items-center justify-center bg-safarigray rounded-full border border-safariborder shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
            Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => {
              const images = item.product.images ? item.product.images.split(',') : [];
              const image = images[0] || '/placeholder.jpg';
              return (
                <div
                  key={item.id}
                  className="flex gap-3 md:gap-4 rounded-2xl border border-safariborder bg-safarigray p-3 md:p-5 shadow-sm md:shadow-none"
                >
                  <div className="relative h-20 w-20 md:h-28 md:w-28 flex-shrink-0 rounded-xl bg-safaridark overflow-hidden border border-safariborder">
                    <Image src={image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold font-display text-sm md:text-lg text-white line-clamp-2">
                      {item.product.name}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-gray-600 inline-block" />
                        <span className="font-medium text-gray-400">{item.selectedColor}</span>
                      </p>
                    )}
                    <p className="text-neon font-black font-display text-base md:text-lg mt-1">
                      KES {item.product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeItem.mutate({ itemId: item.id })}
                      disabled={removeItem.isPending}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center border border-safariborder rounded-lg overflow-hidden bg-safaridark">
                      <button
                        onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                        disabled={item.quantity <= 1 || updateQuantity.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-safarigray transition-colors disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3 text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white border-x border-safariborder">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        disabled={updateQuantity.isPending}
                        className="w-8 h-8 flex items-center justify-center hover:bg-safarigray transition-colors"
                      >
                        <Plus className="h-3 w-3 text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8 sticky top-24">
              <h2 className="mb-6 text-xl font-bold font-display text-white">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="text-white font-semibold">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-safariborder pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-black font-display text-neon">KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-neon hover:bg-neon-dim text-black font-bold font-display text-base py-4 rounded-xl text-center transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Sticky bottom checkout bar */}
      <div className="lg:hidden fixed bottom-[56px] left-0 right-0 z-40 bg-safaridark/95 backdrop-blur-lg border-t border-safariborder px-4 py-3 pb-safe">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-black font-display text-neon leading-tight">KES {cartTotal.toLocaleString()}</p>
          </div>
          <Link
            href="/checkout"
            className="bg-neon hover:bg-neon-dim text-black font-bold font-display text-sm py-3 px-6 rounded-xl transition-all active:scale-[0.97] shrink-0"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
