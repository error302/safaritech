import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', price: 149999, stock: 15 },
  { id: '4', name: 'Samsung Galaxy S24', price: 119999, stock: 20 },
  { id: '9', name: 'Google Pixel 8', price: 99999, stock: 15 },
]

const categoryNames: Record<string, string> = {
  phones: 'Smartphones',
  laptops: 'Laptops',
  audio: 'Audio',
  wearables: 'Wearables',
  tablets: 'Tablets',
  cameras: 'Cameras',
  gaming: 'Gaming',
  'smart-home': 'Smart Home',
}

export default function ShopCategory({ params }: { params: { category: string } }) {
  const categoryName = categoryNames[params.category] || params.category

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/shop" className="text-muted hover:text-electric">Shop</Link>
          <ChevronRight className="h-4 w-4 text-muted" />
          <span className="text-text">{categoryName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{categoryName}</h1>
          <p className="text-muted">{products.length} products available</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h3 className="mb-2 font-semibold">{product.name}</h3>
                <p className="text-lg font-bold text-electric">KSh {product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
