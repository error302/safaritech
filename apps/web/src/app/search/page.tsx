'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon, X, Filter, Grid, List } from 'lucide-react'

const allProducts = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 149999, category: 'phones', stock: 15 },
  { id: '2', name: 'MacBook Pro M3', price: 199999, category: 'laptops', stock: 8 },
  { id: '3', name: 'Sony WH-1000XM5', price: 34999, category: 'audio', stock: 25 },
  { id: '4', name: 'Samsung Galaxy S24', price: 119999, category: 'phones', stock: 20 },
  { id: '5', name: 'Dell XPS 15', price: 159999, category: 'laptops', stock: 12 },
  { id: '6', name: 'AirPods Pro 2', price: 24999, category: 'audio', stock: 50 },
  { id: '7', name: 'Apple Watch Ultra 2', price: 89999, category: 'wearables', stock: 18 },
  { id: '8', name: 'iPad Pro 12.9"', price: 139999, category: 'tablets', stock: 10 },
  { id: '9', name: 'Google Pixel 8', price: 99999, category: 'phones', stock: 15 },
  { id: '10', name: 'Samsung Galaxy Buds2', price: 14999, category: 'audio', stock: 30 },
]

const categories = ['All', 'phones', 'laptops', 'audio', 'wearables', 'tablets']
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

  const [query, setQuery] = useState(initialQuery)
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [category, setCategory] = useState('All')
  const [priceRange, setPriceRange] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = allProducts
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      const matchesPrice = p.price >= priceRanges[priceRange].min && p.price < priceRanges[priceRange].max
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInput)
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
              <div>
                <h3 className="mb-3 font-semibold text-gray-900 md:text-white">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="text-neon focus:ring-neon"
                      />
                      <span className="text-sm capitalize text-gray-900 md:text-white">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

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
                onClick={() => { setCategory('All'); setPriceRange(0); setQuery(''); setSearchInput('') }}
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
                {filteredProducts.length} results
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

            {filteredProducts.length > 0 ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
                  >
                    <div className="aspect-square bg-gray-50 md:bg-safaridark relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 md:text-gray-400">
                        Product Image
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mb-1 text-xs text-neon uppercase">{product.category}</p>
                      <h3 className="mb-2 font-semibold text-gray-900 md:text-white">{product.name}</h3>
                      <p className="text-lg font-bold text-neon">KSh {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
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
        <p className="text-gray-500 md:text-gray-400">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
