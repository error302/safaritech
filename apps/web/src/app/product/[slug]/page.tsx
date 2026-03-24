'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, Share2, ShoppingCart, Star, ChevronRight, Minus, Plus, Check } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'

const product = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  slug: 'iphone-15-pro-max',
  description: 'Experience the ultimate iPhone with A17 Pro chip, titanium design, and the most powerful iPhone camera system ever. Featuring a 6.7-inch Super Retina XDR display with ProMotion technology.',
  price: 149999,
  salePrice: 139999,
  stock: 15,
  images: ['/placeholder.jpg'],
  specs: {
    'Display': '6.7" Super Retina XDR',
    'Processor': 'A17 Pro chip',
    'Storage': '256GB / 512GB / 1TB',
    'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
    'Battery': 'All-day battery life',
    'OS': 'iOS 17',
  },
  category: { name: 'Smartphones', slug: 'phones' },
  reviews: [
    { id: '1', user: 'John D.', rating: 5, comment: 'Best iPhone ever! The camera is incredible.', date: '2024-01-15' },
    { id: '2', user: 'Sarah M.', rating: 4, comment: 'Great phone but expensive. Battery life could be better.', date: '2024-01-10' },
  ],
}

export default function ProductDetail() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity,
    })
  }

  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted hover:text-electric">Home</Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <Link href="/shop" className="text-muted hover:text-electric">Shop</Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <Link href={`/shop?category=${product.category.slug}`} className="text-muted hover:text-electric">{product.category.name}</Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <span className="text-text">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl border border-border bg-card overflow-hidden">
              <div className="h-full w-full flex items-center justify-center text-muted">
                {product.name} Image
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i - 1)}
                  className={`aspect-square rounded-lg border bg-card overflow-hidden ${
                    selectedImage === i - 1 ? 'border-electric' : 'border-border'
                  }`}
                >
                  <div className="h-full w-full flex items-center justify-center text-muted text-xs">
                    Img {i}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Link href={`/shop?category=${product.category.slug}`} className="text-sm text-electric hover:underline">
                {product.category.name}
              </Link>
              <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? 'fill-yellow text-yellow' : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted">({product.reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-electric">
                KSh {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-lg text-muted line-through">
                    KSh {product.price.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-green/10 px-3 py-1 text-sm font-medium text-green">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-muted">{product.description}</p>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${product.stock > 0 ? 'text-green' : 'text-red'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">Quantity:</span>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:text-electric"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:text-electric"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary flex-1 py-3 disabled:opacity-50"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'border-red bg-red/10 text-red'
                    : 'border-border hover:border-electric'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 rounded-lg border border-border hover:border-electric">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Info */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green" />
                <span>Free delivery across Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green" />
                <span>Easy returns within 7 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green" />
                <span>Original Kenya warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Specifications</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex bg-card p-4">
                  <span className="w-1/3 text-sm text-muted">{key}</span>
                  <span className="w-2/3 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating ? 'fill-yellow text-yellow' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-muted">{review.comment}</p>
                  </div>
                  <span className="text-sm text-muted">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
