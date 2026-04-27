import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

const posts = [
  {
    id: '1',
    slug: 'best-smartphones-2024',
    title: 'Best Smartphones to Buy in Kenya in 2024',
    excerpt: 'Looking for the best smartphone? We\'ve compiled the top picks across all price ranges.',
    author: 'John Mwangi',
    date: '2024-01-20',
    image: 'bg-gradient-to-br from-blue/20 to-electric/20',
    category: 'Smartphones',
  },
  {
    id: '2',
    slug: 'laptop-buying-guide',
    title: 'Complete Laptop Buying Guide for Kenya',
    excerpt: 'Whether you\'re a student, professional, or gamer, find the perfect laptop for your needs.',
    author: 'Sarah Kimani',
    date: '2024-01-18',
    image: 'bg-gradient-to-br from-purple/20 to-blue/20',
    category: 'Laptops',
  },
  {
    id: '3',
    slug: 'wireless-earbuds-comparison',
    title: 'AirPods Pro 2 vs Galaxy Buds2 Pro vs Sony WF-1000XM5',
    excerpt: 'We compare the top 3 wireless earbuds to help you make the right choice.',
    author: 'David Ochieng',
    date: '2024-01-15',
    image: 'bg-gradient-to-br from-green/20 to-electric/20',
    category: 'Audio',
  },
]

export default function Blog() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Tech Blog</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl">
            Stay updated with the latest tech trends, buying guides, and product reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
            >
              <div className={`aspect-video ${post.image} flex items-center justify-center`}>
                <span className="text-gray-500 md:text-gray-400">Blog Image</span>
              </div>
              <div className="p-6">
                <span className="mb-3 inline-block text-xs font-medium text-neon">
                  {post.category}
                </span>
                <h2 className="mb-3 text-xl font-bold group-hover:text-neon transition-colors text-gray-900 md:text-white">
                  {post.title}
                </h2>
                <p className="mb-4 text-sm text-gray-500 md:text-gray-400 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 md:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  )
}
