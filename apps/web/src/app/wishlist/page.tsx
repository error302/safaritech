'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'

const wishlistItems = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 149999, salePrice: 139999, category: 'phones' },
  { id: '3', name: 'Sony WH-1000XM5', price: 34999, salePrice: null, category: 'audio' },
  { id: '7', name: 'Apple Watch Ultra 2', price: 89999, salePrice: null, category: 'wearables' },
]

export default function Wishlist() {
  const [items, setItems] = useState(wishlistItems)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (item: typeof wishlistItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.salePrice || item.price,
      quantity: 1,
    })
  }

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">My Wishlist ({items.length})</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group">
                <Link href={`/product/${item.id}`} className="block">
                  <div className="aspect-square bg-surface relative">
                    <div className="absolute inset-0 flex items-center justify-center text-muted">
                      Product Image
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item.id}`}>
                    <p className="mb-1 text-xs text-electric uppercase">{item.category}</p>
                    <h3 className="mb-2 font-semibold hover:text-electric transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-electric">
                      KSh {(item.salePrice || item.price).toLocaleString()}
                    </span>
                    {item.salePrice && (
                      <span className="text-sm text-muted line-through">
                        KSh {item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-primary flex-1 py-2"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-lg border border-border hover:border-red hover:bg-red/10 text-muted hover:text-red transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted mb-4" />
            <h2 className="mb-2 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="text-muted mb-6">Save items you love by clicking the heart icon.</p>
            <Link href="/shop" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
