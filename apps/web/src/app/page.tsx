import Link from 'next/link'
import { ArrowRight, Smartphone, Laptop, Headphones, Watch, Zap } from 'lucide-react'

const categories = [
  { name: 'Smartphones', icon: Smartphone, href: '/shop?category=phones', count: 120 },
  { name: 'Laptops', icon: Laptop, href: '/shop?category=laptops', count: 85 },
  { name: 'Audio', icon: Headphones, href: '/shop?category=audio', count: 200 },
  { name: 'Wearables', icon: Watch, href: '/shop?category=wearables', count: 65 },
]

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 149999, image: '/placeholder.jpg', category: 'phones' },
  { id: '2', name: 'MacBook Pro M3', price: 199999, image: '/placeholder.jpg', category: 'laptops' },
  { id: '3', name: 'Sony WH-1000XM5', price: 34999, image: '/placeholder.jpg', category: 'audio' },
  { id: '4', name: 'Samsung Galaxy S24', price: 119999, image: '/placeholder.jpg', category: 'phones' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-transparent to-electric/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-4 py-2 text-sm text-electric">
              <Zap className="h-4 w-4" />
              Kenya&apos;s #1 Electronics Store
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-electric to-blue bg-clip-text text-transparent">
                Tech That Moves
              </span>
              <br />
              <span className="text-text">With You</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted">
              Premium smartphones, laptops, and accessories at unbeatable prices. 
              Fast delivery across Kenya. Shop now and experience the future.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="btn btn-primary text-lg px-8 py-3">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/deals" className="btn btn-secondary text-lg px-8 py-3">
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-bold">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-electric/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-electric/10 text-electric">
                  <cat.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">{cat.name}</h3>
                <p className="text-sm text-muted">{cat.count} products</p>
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-electric" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/shop" className="text-electric hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue/20 to-electric/20 p-8 md:p-12">
            <div className="relative z-10 max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold">Need Help Choosing?</h2>
              <p className="mb-6 text-muted">
                Our tech experts are here to help. Chat with us on WhatsApp or call us for personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn btn-primary">
                  Contact Us
                </Link>
                <Link href="/faq" className="btn btn-secondary">
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
