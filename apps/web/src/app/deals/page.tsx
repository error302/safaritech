'use client'

import Link from 'next/link'
import { Clock, Tag, ArrowRight, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import ProductCard from '@/components/ProductCard'

export default function Deals() {
  const { data: productsData, isLoading } = trpc.product.getAll.useQuery({ limit: 100 })

  const products = productsData?.products ?? []

  // Filter products with salePrice that is less than price
  const saleProducts = products.filter(
    (p: any) => p.salePrice && p.salePrice < p.price
  )

  // Calculate discount percentage and sort by it (highest first)
  const productsWithDiscount = saleProducts
    .map((p: any) => ({
      ...p,
      discount: Math.round(((p.price - p.salePrice) / p.price) * 100),
    }))
    .sort((a: any, b: any) => b.discount - a.discount)

  // Split into flash sales (top 4 with highest discount) and all deals
  const flashSales = productsWithDiscount.slice(0, 4)
  const allDeals = productsWithDiscount

  // Transform products for ProductCard compatibility
  // ProductCard expects price = current price, originalPrice = strikethrough price
  // Backend: price = original, salePrice = discounted
  // So we map: price -> originalPrice (for strikethrough), salePrice -> price (current)
  const transformForProductCard = (p: any) => ({
    ...p,
    originalPrice: p.price, // Original price (strikethrough)
    price: p.salePrice || p.price, // Current sale price
  })

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red/20 via-accent/20 to-electric/20 p-8 md:p-12">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-red/20 px-4 py-2 text-sm font-medium text-red mb-4">
              <Clock className="h-4 w-4" />
              Limited Time Offers
            </div>
            <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white md:text-5xl">
              Flash Sales & Deals
            </h1>
            <p className="mb-6 max-w-xl text-lg text-gray-500 md:text-gray-400">
              Grab the best deals on premium electronics. Prices so low they won&apos;t last!
            </p>
            <Link href="#flash" className="inline-flex items-center bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
              Shop Flash Sales <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-neon animate-spin mb-4" />
            <p className="text-gray-500 md:text-gray-400 text-lg">Loading deals...</p>
          </div>
        ) : (
          <>
            {/* Flash Sales */}
            {flashSales.length > 0 && (
              <section id="flash" className="mb-12">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red text-white">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-gray-900 md:text-white">Flash Sales</h2>
                  <span className="rounded-full bg-red/20 px-3 py-1 text-sm font-medium text-red animate-pulse">
                    Ending Soon
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {flashSales.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={transformForProductCard(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Deals */}
            {allDeals.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-2">
                  <Tag className="h-8 w-8 text-neon" />
                  <h2 className="text-2xl font-bold font-display text-gray-900 md:text-white">All Deals</h2>
                  <span className="text-sm text-gray-500 md:text-gray-400 ml-2">
                    ({allDeals.length} products on sale)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allDeals.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={transformForProductCard(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* No Deals Message */}
            {!isLoading && allDeals.length === 0 && (
              <div className="text-center py-20">
                <Tag className="h-16 w-16 text-gray-300 md:text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold font-display text-gray-900 md:text-white mb-2">
                  No Active Deals
                </h2>
                <p className="text-gray-500 md:text-gray-400 max-w-md mx-auto">
                  Check back soon! We&apos;re always adding new sales and promotions on our best products.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center mt-6 bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
                >
                  Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
