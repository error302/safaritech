'use client'

import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import ProductCard from '@/components/ProductCard'

export default function Wishlist() {
  const { data: wishlistItems, isLoading } = trpc.wishlist.get.useQuery()
  const utils = trpc.useUtils()

  const removeFromWishlist = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      utils.wishlist.get.invalidate()
    },
  })

  const handleRemove = (productId: string) => {
    removeFromWishlist.mutate({ productId })
  }

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-6 md:mb-8 font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">My Wishlist</h1>
          <div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-8 md:p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-neon" />
          </div>
        </div>
      </div>
    )
  }

  const hasItems = wishlistItems && wishlistItems.length > 0

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 md:mb-8 font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">My Wishlist</h1>

        {!hasItems ? (
          <div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-8 md:p-12 text-center">
            <Heart className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-300 md:text-gray-600 mb-4" />
            <h2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900 md:text-white">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 md:text-gray-400 mb-6">Save items you love by clicking the heart icon.</p>
            <Link
              href="/shop"
              className="inline-block bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item.product} />
                <button
                  onClick={() => handleRemove(item.productId)}
                  disabled={removeFromWishlist.isPending}
                  className="absolute top-2 right-2 z-10 bg-white/90 md:bg-safaridark/90 hover:bg-red-50 md:hover:bg-red-900/50 text-red-500 p-1.5 rounded-full shadow-sm transition-all duration-150 disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  {removeFromWishlist.isPending && removeFromWishlist.variables?.productId === item.productId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 fill-current" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
