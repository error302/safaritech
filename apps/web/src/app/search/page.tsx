'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, Filter, Grid3X3, List, Loader2, SlidersHorizontal, ChevronDown, Tag } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

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

  // Track active filters for display
  const activeFilterCount = (selectedCategory ? 1 : 0) + (priceRange > 0 ? 1 : 0)

  // Fetch categories from backend
  const { data: categories } = trpc.product.getCategories.useQuery()

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
      const price = (p as any).salePrice || p.price
      return price >= priceRanges[priceRange].min && price < priceRanges[priceRange].max
    })
    .sort((a, b) => {
      const priceA = (a as any).salePrice || a.price
      const priceB = (b as any).salePrice || b.price
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

  const clearAllFilters = () => {
    setSelectedCategory('')
    setPriceRange(0)
    setQuery('')
    setSearchInput('')
  }

  return (
    <div className="bg-safaridark min-h-screen pb-24 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="py-6 md:py-8">
          <h1 className="mb-4 text-2xl md:text-3xl font-bold font-display text-white">Search</h1>

          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-xl border border-safariborder bg-safarigray py-3 pl-12 pr-12 text-white placeholder:text-gray-500 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setQuery('') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          {/* Active filters chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 border border-neon/30 text-neon text-xs font-bold">
                  <Tag className="w-3 h-3" />
                  {categories?.find((c: any) => c.slug === selectedCategory)?.name || selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="ml-0.5 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {priceRange > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 border border-neon/30 text-neon text-xs font-bold">
                  {priceRanges[priceRange].label}
                  <button onClick={() => setPriceRange(0)} className="ml-0.5 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs font-medium text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-safariborder bg-safarigray p-4 space-y-6">
              {categories && categories.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-white text-sm">Category</h3>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory('')}
                        className="accent-neon w-3.5 h-3.5"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">All Categories</span>
                    </label>
                    {categories.map((cat: any) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.slug}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="accent-neon w-3.5 h-3.5"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 font-semibold text-white text-sm">Price Range</h3>
                <div className="space-y-1.5">
                  {priceRanges.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === idx}
                        onChange={() => setPriceRange(idx)}
                        className="accent-neon w-3.5 h-3.5"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="w-full text-sm text-neon hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results header with controls */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-gray-400 text-sm">
                {isLoading ? 'Loading...' : `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}`}
                {query && <span> for &quot;<span className="text-white font-medium">{query}</span>&quot;</span>}
              </p>

              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-safariborder bg-safarigray text-white text-sm font-medium hover:border-neon/30 transition-colors relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-neon text-black text-[9px] font-extrabold leading-none min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-[3px] ring-2 ring-safaridark">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-safariborder bg-safarigray px-3 py-2 text-sm text-white focus:border-neon focus:outline-none cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>

                <div className="hidden sm:flex gap-0.5 rounded-lg border border-safariborder bg-safarigray p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-safaridark text-neon' : 'text-gray-500 hover:text-white'}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-safaridark text-neon' : 'text-gray-500 hover:text-white'}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto h-12 w-12 text-neon animate-spin mb-4" />
                <p className="text-gray-400">Searching products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {filteredProducts.map((product) => {
                      const productData: any = product;
                      const images = productData.images
                        ? (Array.isArray(productData.images) ? productData.images : [String(productData.images)])
                        : null;
                      return (
                        <ProductCard
                          key={product.id}
                          product={{
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: product.price,
                            originalPrice: productData.salePrice ?? null,
                            images: images,
                            inStock: (productData.stock ?? 0) > 0,
                            isHot: productData.isHot ?? null,
                            badge: productData.badge ?? null,
                            rating: 0,
                            reviewCount: 0,
                            description: product.description,
                            category: productData.category
                              ? { id: productData.category.id, name: productData.category.name }
                              : null,
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-3">
                    {filteredProducts.map((product) => {
                      const productData: any = product;
                      const images = productData.images
                        ? (Array.isArray(productData.images) ? productData.images : [String(productData.images)])
                        : null;
                      const image = images?.[0] || '/placeholder.jpg';
                      const discount = productData.salePrice
                        ? Math.round(((product.price - productData.salePrice) / product.price) * 100)
                        : null;

                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="flex gap-4 rounded-xl border border-safariborder bg-safarigray p-3 md:p-4 hover:border-neon/25 transition-all group"
                        >
                          <div className="relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-lg bg-safaridark overflow-hidden border border-safariborder">
                            <Image
                              src={image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="112px"
                            />
                            {productData.badge && (
                              <span className="absolute top-1 left-1 bg-neon text-black text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                                {productData.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                              {productData.brand || (productData.category?.name) || ''}
                            </p>
                            <h3 className="font-medium text-sm md:text-base text-white line-clamp-2 mb-1.5 group-hover:text-neon transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display font-bold text-sm md:text-base text-white">
                                KES {(productData.salePrice || product.price).toLocaleString()}
                              </span>
                              {productData.salePrice && (
                                <>
                                  <span className="text-xs text-gray-500 line-through">
                                    KES {product.price.toLocaleString()}
                                  </span>
                                  {discount && (
                                    <span className="text-[10px] font-bold text-red-400">
                                      -{discount}%
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            {productData.stock <= 0 && (
                              <span className="text-[10px] font-semibold text-red-400 mt-1">Out of Stock</span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-lg text-gray-400 mb-2">No products found matching your criteria.</p>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm font-bold text-neon hover:underline"
                  >
                    Clear all filters
                  </button>
                  <Link
                    href="/shop"
                    className="text-sm font-bold text-gray-400 hover:text-white"
                  >
                    Browse All Products
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {showFilters && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Search filters"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-safarigray border-t border-safariborder rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up pb-safe">
            <div className="sticky top-0 bg-safarigray/95 backdrop-blur-md px-5 py-4 border-b border-safariborder flex items-center justify-between rounded-t-2xl">
              <h2 className="font-display font-bold text-lg text-white">
                Filters {activeFilterCount > 0 && <span className="text-neon">({activeFilterCount})</span>}
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-safaridark text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {categories && categories.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-white text-sm">Category</h3>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobile-category"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory('')}
                        className="accent-neon w-4 h-4"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white">All Categories</span>
                    </label>
                    {categories.map((cat: any) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="radio"
                          name="mobile-category"
                          checked={selectedCategory === cat.slug}
                          onChange={() => handleCategoryChange(cat.slug)}
                          className="accent-neon w-4 h-4"
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 font-semibold text-white text-sm">Price Range</h3>
                <div className="space-y-1.5">
                  {priceRanges.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="mobile-priceRange"
                        checked={priceRange === idx}
                        onChange={() => setPriceRange(idx)}
                        className="accent-neon w-4 h-4"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-6 pt-2 border-t border-safariborder flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-xl border border-safariborder text-gray-300 text-sm font-bold hover:bg-safaridark transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-xl bg-neon text-black text-sm font-bold hover:bg-neon-dim transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Search() {
  return (
    <Suspense fallback={
      <div className="bg-safaridark min-h-screen py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-neon animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
