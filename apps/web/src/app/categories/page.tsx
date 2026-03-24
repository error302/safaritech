import Link from 'next/link'
import { Smartphone, Laptop, Headphones, Watch, Tablet, Camera, Gamepad2, Wifi } from 'lucide-react'

const categories = [
  { 
    name: 'Smartphones', 
    slug: 'phones', 
    description: 'Latest smartphones from Apple, Samsung, Google & more',
    icon: Smartphone,
    count: 120,
    image: 'bg-gradient-to-br from-blue/20 to-electric/20'
  },
  { 
    name: 'Laptops', 
    slug: 'laptops', 
    description: 'MacBooks, Windows laptops, gaming rigs & ultrabooks',
    icon: Laptop,
    count: 85,
    image: 'bg-gradient-to-br from-electric/20 to-green/20'
  },
  { 
    name: 'Audio', 
    slug: 'audio', 
    description: 'Headphones, earbuds, speakers & audio accessories',
    icon: Headphones,
    count: 200,
    image: 'bg-gradient-to-br from-purple/20 to-blue/20'
  },
  { 
    name: 'Wearables', 
    slug: 'wearables', 
    description: 'Smartwatches, fitness trackers & wearable tech',
    icon: Watch,
    count: 65,
    image: 'bg-gradient-to-br from-green/20 to-yellow/20'
  },
  { 
    name: 'Tablets', 
    slug: 'tablets', 
    description: 'iPads, Android tablets & accessories',
    icon: Tablet,
    count: 45,
    image: 'bg-gradient-to-br from-yellow/20 to-orange/20'
  },
  { 
    name: 'Cameras', 
    slug: 'cameras', 
    description: 'DSLR, mirrorless, action cameras & accessories',
    icon: Camera,
    count: 38,
    image: 'bg-gradient-to-br from-red/20 to-purple/20'
  },
  { 
    name: 'Gaming', 
    slug: 'gaming', 
    description: 'Consoles, controllers, PC gaming & accessories',
    icon: Gamepad2,
    count: 72,
    image: 'bg-gradient-to-br from-purple/20 to-red/20'
  },
  { 
    name: 'Smart Home', 
    slug: 'smart-home', 
    description: 'Smart speakers, automation & IoT devices',
    icon: Wifi,
    count: 55,
    image: 'bg-gradient-to-br from-blue/20 to-purple/20'
  },
]

export default function Categories() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Shop by Category</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Browse our extensive collection of electronics across all categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
            >
              <div className={`absolute inset-0 ${category.image} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{category.name}</h3>
                <p className="mb-4 text-sm text-muted line-clamp-2">{category.description}</p>
                <p className="text-sm font-medium text-electric">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
