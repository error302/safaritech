'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Grid, List } from 'lucide-react'

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 149999, category: 'phones', stock: 15 },
  { id: '2', name: 'MacBook Pro M3', price: 199999, category: 'laptops', stock: 8 },
  { id: '3', name: 'Sony WH-1000XM5', price: 34999, category: 'audio', stock: 25 },
  { id: '4', name: 'Samsung Galaxy S24', price: 119999, category: 'phones', stock: 20 },
  { id: '5', name: 'Dell XPS 15', price: 159999, category: 'laptops', stock: 12 },
  { id: '6', name: 'AirPods Pro 2', price: 24999, category: 'audio', stock: 50 },
  { id: '7', name: 'Apple Watch Ultra 2', price: 89999, category: 'wearables', stock: 18 },
  { id: '8', name: 'iPad Pro 12.9"', price: 139999, category: 'tablets', stock: 10 },
]

const categories = ['All', 'phones', 'laptops', 'audio', 'wearables', 'tablets']

export default function Shop() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Shop</h1>
          <p className="text-muted">Browse our collection of premium electronics</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-text placeholder:text-muted focus:border-electric focus:outline-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 rounded-lg border border-border bg-card p-1">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-md px-3 py-1.5 text-sm capitalize transition-colors ${
                    category === cat
                      ? 'bg-electric text-charcoal'
                      : 'text-muted hover:text-text'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
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

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
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
                {product.stock < 10 && (
                  <span className="absolute left-2 top-2 rounded bg-yellow/20 px-2 py-1 text-xs font-medium text-yellow">
                    Low Stock
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="mb-1 text-xs text-electric uppercase">{product.category}</p>
                <h3 className="mb-2 font-semibold">{product.name}</h3>
                <p className="text-lg font-bold text-electric">KSh {product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
