'use client'

import Link from 'next/link'
import { Clock, Tag, ArrowRight, Loader2, Flame, Percent, Truck, Shield, Zap, Star } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import ProductCard from '@/components/ProductCard'

const promoBanners = [
  {
    icon: Truck,
    title: 'Free Delivery Week',
    desc: 'Free shipping on all orders above KSh 5,000 this week only. No code needed — discount applied automatically at checkout.',
    color: 'from-blue/20 to-electric/10',
  },
  {
    icon: Shield,
    title: 'Extended Warranty Deal',
    desc: 'Get 50% off Safaritech Care extended warranty when you purchase any smartphone or laptop. Protect your investment for less.',
    color: 'from-neon/20 to-blue/10',
  },
  {
    icon: Percent,
    title: 'Bundle & Save',
    desc: 'Buy any smartphone with accessories and save up to 15% on the total. Mix and match cases, chargers, and earbuds.',
    color: 'from-accent/20 to-electric/10',
  },
]

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

  // Featured products: hot items with no sale (still great value)
  const featuredProducts = products
    .filter((p: any) => p.isHot && (!p.salePrice || p.salePrice >= p.price))
    .slice(0, 4)

  // Transform products for ProductCard compatibility
  const transformForProductCard = (p: any) => ({
    ...p,
    originalPrice: p.price,
    price: p.salePrice || p.price,
  })

  return (
    <div className="bg-safaridark min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-red/20 via-accent/20 to-electric/20 p-8 md:p-12">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-red/20 px-4 py-2 text-sm font-medium text-red mb-4">
              <Clock className="h-4 w-4" />
              Limited Time Offers
            </div>
            <h1 className="mb-4 text-4xl font-bold font-display text-white md:text-5xl">
              Flash Sales & Deals
            </h1>
            <p className="mb-6 max-w-xl text-lg text-gray-500 md:text-gray-400">
              Grab the best deals on premium electronics. From smartphones to laptops, audio to
              accessories — prices so low they won&apos;t last. Shop now and save big on Kenya&apos;s most
              trusted tech marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="#flash" className="inline-flex items-center bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
                Shop Flash Sales <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#featured" className="inline-flex items-center border border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
                <Star className="mr-2 h-4 w-4" /> Featured Products
              </Link>
            </div>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Promo Banners */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promoBanners.map((banner) => (
              <div
                key={banner.title}
                className={`rounded-2xl bg-gradient-to-br ${banner.color} border border-safariborder p-6`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <banner.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-white">{banner.title}</h3>
                </div>
                <p className="text-sm text-gray-500 md:text-gray-400 leading-relaxed">{banner.desc}</p>
              </div>
            ))}
          </div>
        </section>

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
                  <h2 className="text-2xl font-bold font-display text-white">Flash Sales</h2>
                  <span className="rounded-full bg-red/20 px-3 py-1 text-sm font-medium text-red animate-pulse">
                    Ending Soon
                  </span>
                </div>
                <p className="text-gray-500 md:text-gray-400 mb-6">
                  Our hottest deals with the biggest discounts. These offers are limited in quantity
                  and time — once they&apos;re gone, they&apos;re gone. Don&apos;t miss out on these incredible savings.
                </p>
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

            {/* Featured Products (Hot items) */}
            {featuredProducts.length > 0 && (
              <section id="featured" className="mb-12">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon text-black">
                    <Flame className="h-4 w-4" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-white">Featured Products</h2>
                  <span className="rounded-full bg-neon/20 px-3 py-1 text-sm font-medium text-neon">
                    Popular Right Now
                  </span>
                </div>
                <p className="text-gray-500 md:text-gray-400 mb-6">
                  Trending products that Kenyans are loving. These are our most popular items based
                  on customer demand — tried, tested, and highly rated by the Safaritech community.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product: any) => (
                    <ProductCard
                      key={product.id}
                      product={product}
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
                  <h2 className="text-2xl font-bold font-display text-white">All Deals</h2>
                  <span className="text-sm text-gray-500 md:text-gray-400 ml-2">
                    ({allDeals.length} {allDeals.length === 1 ? 'product' : 'products'} on sale)
                  </span>
                </div>
                <p className="text-gray-500 md:text-gray-400 mb-6">
                  Browse all products currently on sale. Every item comes with our authenticity
                  guarantee and full manufacturer warranty. Sale prices are limited while stock lasts.
                </p>
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
            {!isLoading && allDeals.length === 0 && featuredProducts.length === 0 && (
              <div className="text-center py-20">
                <Tag className="h-16 w-16 text-gray-300 md:text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold font-display text-white mb-2">
                  No Active Deals Right Now
                </h2>
                <p className="text-gray-500 md:text-gray-400 max-w-md mx-auto mb-6">
                  Check back soon! We are always adding new sales and promotions on our best products.
                  In the meantime, browse our full catalog for great value at everyday low prices.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
                >
                  Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            )}
          </>
        )}

        {/* Deals Info */}
        <section className="mt-16 rounded-2xl border border-safariborder bg-safarigray p-8">
          <h2 className="mb-4 text-2xl font-bold font-display text-white text-center">Why Shop Deals on Safaritech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">100% Authentic</h3>
              <p className="text-sm text-gray-500 md:text-gray-400">
                Every deal product is genuine, sourced from authorized distributors. No counterfeits,
                no grey-market goods. Full manufacturer warranty included with every purchase.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">Fast Nationwide Delivery</h3>
              <p className="text-sm text-gray-500 md:text-gray-400">
                Same-day delivery in Nairobi, 3-5 days to major towns, and delivery to all 47 counties.
                Free shipping on qualifying orders. Track your order in real time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-500 md:text-gray-400">
                Not satisfied? Our 7-day return policy and dedicated support team make returns easy.
                Free return pickup within Nairobi. Shop with confidence on every deal.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
