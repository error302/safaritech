'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, Filter, Grid, List, Loader2 } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { ProductCard } from '@/components/ProductCard'

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under KSh 20,000', min: 0, max: 20000 },
  { label: 'KSh 20,000 - 50,000', min: 20000, max: 50000 },
  { label: 'KSh 50,000 - 100,000', min: 50000, max: 100000 },
  { label: 'KSh 100,000 - 150,000', min: 100000, max: 150000 },
  { label: 'Over KSh 150,000', min: 150000, max: Infinity },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch categories from backend
  const { data: categories } = trpc.product.adminGetCategories.useQuery()

  // Fetch products with search
  const { data: productsData, isLoading } = trpc.product.getAll.useQuery(
    {
      search: query || undefined,
      category: selectedCategory || undefined,
      limit: 50,
    },
    {
      enabled: true,
    }
  )

  // Filter products by price range
  const filteredProducts = (productsData?.products || [])
    .filter(p => {
      const price = p.salePrice || p.price
      return price >= priceRanges[priceRange].min && price < priceRanges[priceRange].max
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.price
      const priceB = b.salePrice || b.price
      switch (sortBy) {
        case 'price-low': return priceA - priceB
        case 'price-high': return priceB - priceA
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
  }

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug)
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold font-display text-gray-900 md:text-white">Search</h1>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 md:text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray py-3 pl-12 pr-12 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setQuery('') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 md:text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-4 space-y-6">
              {categories && categories.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900 md:text-white">Category</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory('')}
                        className="text-neon focus:ring-neon"
                      />
                      <span className="text-sm text-gray-900 md:text-white">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.slug}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="text-neon focus:ring-neon"
                        />
                        <span className="text-sm text-gray-900 md:text-white">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 font-semibold text-gray-900 md:text-white">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === idx}
                        onChange={() => setPriceRange(idx)}
                        className="text-neon focus:ring-neon"
                      />
                      <span className="text-sm text-gray-900 md:text-white">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategory(''); setPriceRange(0); setQuery(''); setSearchInput('') }}
                className="w-full text-sm text-neon hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-500 md:text-gray-400">
                {isLoading ? 'Loading...' : `${filteredProducts.length} results`}
                {query && <span> for &quot;{query}&quot;</span>}
              </p>

              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safarigray px-3 py-2 text-sm text-gray-900 md:text-white focus:border-electric focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 rounded-lg border border-gray-200 md:border-safariborder text-gray-900 md:text-white"
                >
                  <Filter className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex gap-1 rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'text-neon' : 'text-gray-500 md:text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'text-neon' : 'text-gray-500 md:text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-neon animate-spin mb-4" />
                <p className="text-gray-500 md:text-gray-400">Searching products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-500 md:text-gray-400 mb-4" />
                <p className="text-lg text-gray-500 md:text-gray-400">No products found matching your criteria.</p>
                <p className="text-sm text-gray-500 md:text-gray-400 mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Search() {
  return (
    <Suspense fallback={
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-neon animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
