'use client'

import Link from 'next/link'
import { Smartphone, Laptop, Headphones, Watch, Tablet, Camera, Gamepad2, Wifi } from 'lucide-react'
import { trpc } from '@/utils/trpc'

// Map category slugs to icons and gradient backgrounds
// This keeps the UI consistent even as categories change in the database
const categoryMetadata: Record<string, { icon: React.ElementType; gradient: string; description: string }> = {
  'phones': {
    icon: Smartphone,
    gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
    description: 'Latest smartphones from Apple, Samsung, Google & more',
  },
  'laptops': {
    icon: Laptop,
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-green-500/20',
    description: 'MacBooks, Windows laptops, gaming rigs & ultrabooks',
  },
  'audio': {
    icon: Headphones,
    gradient: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
    description: 'Headphones, earbuds, speakers & audio accessories',
  },
  'wearables': {
    icon: Watch,
    gradient: 'bg-gradient-to-br from-green-500/20 to-yellow-500/20',
    description: 'Smartwatches, fitness trackers & wearable tech',
  },
  'tablets': {
    icon: Tablet,
    gradient: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
    description: 'iPads, Android tablets & accessories',
  },
  'cameras': {
    icon: Camera,
    gradient: 'bg-gradient-to-br from-red-500/20 to-purple-500/20',
    description: 'DSLR, mirrorless, action cameras & accessories',
  },
  'gaming': {
    icon: Gamepad2,
    gradient: 'bg-gradient-to-br from-purple-500/20 to-red-500/20',
    description: 'Consoles, controllers, PC gaming & accessories',
  },
  'smart-home': {
    icon: Wifi,
    gradient: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20',
    description: 'Smart speakers, automation & IoT devices',
  },
}

// Default fallback for unknown categories
const defaultMetadata = {
  icon: Smartphone,
  gradient: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
  description: 'Browse our collection of products in this category',
}

export default function Categories() {
  const { data: categories, isLoading } = trpc.category.getAll.useQuery()

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Shop by Category</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-500 md:text-gray-400">
            Browse our extensive collection of electronics across all categories
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => {
              const metadata = categoryMetadata[category.slug] || defaultMetadata
              const IconComponent = metadata.icon
              const productCount = (category as unknown as { _count: { products: number } })._count?.products || 0

              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
                >
                  <div className={`absolute inset-0 ${metadata.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neon/10 text-neon">
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold font-display text-gray-900 md:text-white">{category.name}</h3>
                    <p className="mb-4 text-sm text-gray-500 md:text-gray-400 line-clamp-2">{metadata.description}</p>
                    <p className="text-sm font-medium text-neon">{productCount} products</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!isLoading && categories?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 md:text-gray-400">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
