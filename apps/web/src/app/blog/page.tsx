'use client'

import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { trpc } from '@/utils/trpc'

export default function Blog() {
  const { data, isLoading, error } = trpc.blog.getAll.useQuery({ limit: 50 })
  const posts = data?.posts || []

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="h-10 w-64 bg-gray-200 md:bg-safarigray rounded animate-pulse mb-4" />
            <div className="h-5 w-96 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden">
                <div className="aspect-video bg-gray-200 md:bg-safarigray animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-20 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 md:bg-safarigray rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 md:bg-safarigray rounded animate-pulse" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-4 w-24 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 md:text-white mb-4">Error Loading Posts</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">Failed to load blog posts. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Tech Blog</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl">
            Stay updated with the latest tech trends, buying guides, and product reviews.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 md:text-white mb-4">No Posts Yet</h2>
            <p className="text-gray-500 md:text-gray-400">Check back soon for new articles!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden transition-all hover:border-electric/50 hover:shadow-lg hover:shadow-electric/10"
                >
                  <div className={`aspect-video ${post.featuredImage || 'bg-gradient-to-br from-blue/20 to-electric/20'} flex items-center justify-center`}>
                    <span className="text-gray-500 md:text-gray-400">Blog Image</span>
                  </div>
                  <div className="p-6">
                    <span className="mb-3 inline-block text-xs font-medium text-neon">
                      {post.category || 'Tech'}
                    </span>
                    <h2 className="mb-3 text-xl font-bold group-hover:text-neon transition-colors text-gray-900 md:text-white">
                      {post.title}
                    </h2>
                    <p className="mb-4 text-sm text-gray-500 md:text-gray-400 line-clamp-2">{post.excerpt || ''}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 md:text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'Draft'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data?.nextCursor && (
              <div className="mt-12 flex justify-center">
                <button className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
