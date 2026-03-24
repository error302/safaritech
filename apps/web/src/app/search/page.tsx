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
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">Search</h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-12 text-text placeholder:text-muted focus:border-electric focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setQuery('') }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-xl border border-border bg-card p-4 space-y-6">
              <div>
                <h3 className="mb-3 font-semibold">Category</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="text-electric focus:ring-electric"
                      />
                      <span className="text-sm capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === idx}
                        onChange={() => setPriceRange(idx)}
                        className="text-electric focus:ring-electric"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setCategory('All'); setPriceRange(0); setQuery(''); setSearchInput('') }}
                className="w-full text-sm text-electric hover:underline"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted">
                {filteredProducts.length} results
                {query && <span> for &quot;{query}&quot;</span>}
              </p>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-electric focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 rounded-lg border border-border"
                >
                  <Filter className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex gap-1 rounded-lg border border-border bg-card p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'text-electric' : 'text-muted'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'text-electric' : 'text-muted'}`}
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
                    className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
                  >
                    <div className="aspect-square bg-surface relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted">
                        Product Image
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="mb-1 text-xs text-electric uppercase">{product.category}</p>
                      <h3 className="mb-2 font-semibold">{product.name}</h3>
                      <p className="text-lg font-bold text-electric">KSh {product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <SearchIcon className="mx-auto h-12 w-12 text-muted mb-4" />
                <p className="text-lg text-muted">No products found matching your criteria.</p>
                <p className="text-sm text-muted mt-2">Try adjusting your search or filters.</p>
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
      <div className="min-h-screen py-8 flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
