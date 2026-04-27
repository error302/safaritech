'use client'

import Link from 'next/link'
import { Clock, Tag, ArrowRight } from 'lucide-react'

const deals = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 149999,
    salePrice: 129999,
    category: 'phones',
    endsIn: '2 days',
    discount: 13
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    price: 199999,
    salePrice: 179999,
    category: 'laptops',
    endsIn: '3 days',
    discount: 10
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    price: 34999,
    salePrice: 24999,
    category: 'audio',
    endsIn: '5 hours',
    discount: 29
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    price: 119999,
    salePrice: 99999,
    category: 'phones',
    endsIn: '1 day',
    discount: 17
  },
]

const flashSales = [
  { id: '5', name: 'AirPods Pro 2', price: 24999, salePrice: 17999, category: 'audio', endsIn: '30 min', discount: 28 },
  { id: '6', name: 'Apple Watch Ultra 2', price: 89999, salePrice: 74999, category: 'wearables', endsIn: '1 hour', discount: 17 },
]

export default function Deals() {
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
            <Link href="#flash" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
              Shop Flash Sales <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Flash Sales */}
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
            {flashSales.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden transition-all hover:border-electric/50"
              >
                <div className="absolute left-2 top-2 z-10 rounded-full bg-red px-2 py-1 text-xs font-bold text-white">
                  {product.discount}% OFF
                </div>
                <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-charcoal/80 px-2 py-1 text-xs text-red">
                  <Clock className="h-3 w-3" />
                  {product.endsIn}
                </div>
                <div className="aspect-square bg-gray-50 md:bg-safaridark flex items-center justify-center text-gray-500 md:text-gray-400">
                  Product Image
                </div>
                <div className="p-4">
                  <p className="mb-1 text-xs text-neon uppercase">{product.category}</p>
                  <h3 className="mb-2 font-semibold text-gray-900 md:text-white">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-neon">
                      KSh {product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 md:text-gray-400 line-through">
                      KSh {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Deals */}
        <section>
          <div className="mb-6 flex items-center gap-2">
            <Tag className="h-8 w-8 text-neon" />
            <h2 className="text-2xl font-bold font-display text-gray-900 md:text-white">All Deals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deals.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group relative rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
              >
                <div className="absolute left-2 top-2 z-10 rounded-full bg-green px-2 py-1 text-xs font-bold text-white">
                  {product.discount}% OFF
                </div>
                <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-charcoal/80 px-2 py-1 text-xs text-gray-500 md:text-gray-400">
                  <Clock className="h-3 w-3" />
                  {product.endsIn}
                </div>
                <div className="aspect-square bg-gray-50 md:bg-safaridark flex items-center justify-center text-gray-500 md:text-gray-400">
                  Product Image
                </div>
                <div className="p-4">
                  <p className="mb-1 text-xs text-neon uppercase">{product.category}</p>
                  <h3 className="mb-2 font-semibold text-gray-900 md:text-white">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-neon">
                      KSh {product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 md:text-gray-400 line-through">
                      KSh {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
