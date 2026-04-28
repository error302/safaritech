'use client'

import Link from 'next/link'
import { use } from 'react'
import { ChevronLeft, Calendar, User, Share2, Facebook, Twitter } from 'lucide-react'
import { trpc } from '@/utils/trpc'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = use(params)
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug })

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-32 bg-gray-200 md:bg-safarigray rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
            </div>
            <div className="aspect-video bg-gray-200 md:bg-safarigray rounded-xl animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 md:bg-safarigray rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 md:bg-safarigray rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 md:bg-safarigray rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 md:text-white mb-4">
              {error ? 'Error Loading Post' : 'Post Not Found'}
            </h1>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              {error ? 'Failed to load the blog post. Please try again later.' : 'The blog post you\'re looking for doesn\'t exist.'}
            </p>
            <Link
              href="/blog"
              className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <span className="mb-4 inline-block text-sm font-medium text-neon">
              {post.category || 'Tech'}
            </span>
            <h1 className="mb-4 text-4xl font-bold font-display leading-tight text-gray-900 md:text-white">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 md:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author?.name || 'Unknown'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Draft'}
              </div>
            </div>
          </header>

          <div className={`aspect-video rounded-xl ${post.featuredImage || 'bg-gradient-to-br from-blue/20 to-electric/20'} mb-8 flex items-center justify-center`}>
            <span className="text-gray-500 md:text-gray-400">Featured Image</span>
          </div>

          <div
            className="prose prose-invert max-w-none text-gray-600 md:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 border-t border-gray-200 md:border-safariborder pt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-white">Share this article</h3>
            <div className="flex gap-4">
              <a href="#" className="flex items-center gap-2 text-gray-500 md:text-gray-400 hover:text-neon">
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a href="#" className="flex items-center gap-2 text-gray-500 md:text-gray-400 hover:text-neon">
                <Twitter className="h-5 w-5" />
                Twitter
              </a>
              <button className="flex items-center gap-2 text-gray-500 md:text-gray-400 hover:text-neon">
                <Share2 className="h-5 w-5" />
                Copy Link
              </button>
            </div>
          </div>
        </article>

        <div className="mt-12 rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 md:text-white">Want to learn more?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6">Browse our full collection of tech articles and buying guides.</p>
          <Link href="/blog" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
