'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import ProductCard from '@/components/ProductCard'

export default function ShopCategory() {
  const params = useParams()
  const slug = params.category as string

  // Fetch category name from categories
  const { data: categories, isLoading: isLoadingCategories } = trpc.product.adminGetCategories.useQuery()
  const categoryName = categories?.find(c => c.slug === slug)?.name || slug

  // Fetch products by category
  const { data: productsData, isLoading: isLoadingProducts } = trpc.product.getAll.useQuery(
    { category: slug },
    { enabled: !!slug }
  )

  const products = productsData?.products || []
  const isLoading = isLoadingCategories || isLoadingProducts

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-neon animate-spin mb-4" />
            <p className="text-gray-500 md:text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/shop" className="text-gray-500 md:text-gray-400 hover:text-neon">Shop</Link>
          <ChevronRight className="h-4 w-4 text-gray-500 md:text-gray-400" />
          <span className="text-gray-900 md:text-white">{categoryName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold font-display text-gray-900 md:text-white">{categoryName}</h1>
          <p className="text-gray-500 md:text-gray-400">{products.length} products available</p>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-gray-500 md:text-gray-400">No products found in this category.</p>
            <p className="text-sm text-gray-500 md:text-gray-400 mt-2">
              Check back later for new arrivals or browse other categories.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-6 px-6 py-2.5 bg-neon text-black font-semibold rounded-lg hover:bg-neon-dim transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
