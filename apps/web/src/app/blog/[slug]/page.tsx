import Link from 'next/link'
import { ChevronLeft, Calendar, User, Share2, Facebook, Twitter } from 'lucide-react'

const post = {
  title: 'Best Smartphones to Buy in Kenya in 2024',
  content: `
    <p class="text-lg mb-6">Looking for a new smartphone? Kenya's smartphone market is more exciting than ever, with flagship devices and budget-friendly options that don't compromise on quality.</p>
    
    <h2 class="text-2xl font-bold mb-4 mt-8">Flagship Phones (KSh 100,000+)</h2>
    <p class="mb-4">If budget isn't a concern, these premium phones offer the best experience:</p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>iPhone 15 Pro Max</strong> - The ultimate iPhone experience with A17 Pro chip</li>
      <li><strong>Samsung Galaxy S24 Ultra</strong> - Best Android phone with AI features</li>
      <li><strong>Google Pixel 8 Pro</strong> - Pure Android with incredible cameras</li>
    </ul>
    
    <h2 class="text-2xl font-bold mb-4 mt-8">Mid-Range Phones (KSh 30,000-70,000)</h2>
    <p class="mb-4">Great value without breaking the bank:</p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Samsung Galaxy A54</strong> - Perfect balance of features and price</li>
      <li><strong>Google Pixel 7a</strong> - Stock Android at a great price</li>
      <li><strong>Xiaomi 13 Lite</strong> - Great camera and fast charging</li>
    </ul>
    
    <h2 class="text-2xl font-bold mb-4 mt-8">Budget Phones (Under KSh 30,000)</h2>
    <p class="mb-4">Best phones for tight budgets:</p>
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Samsung Galaxy A14</strong> - Samsung quality on a budget</li>
      <li><strong>Redmi Note 12</strong> - Incredible specs for the price</li>
      <li><strong>Tecno Camon 20</strong> - Great camera phone</li>
    </ul>
  `,
  author: 'John Mwangi',
  date: 'January 20, 2024',
  category: 'Smartphones',
  image: 'bg-gradient-to-br from-blue/20 to-electric/20',
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-6 inline-flex items-center text-sm text-muted hover:text-electric">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <span className="mb-4 inline-block text-sm font-medium text-electric">
              {post.category}
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </div>
            </div>
          </header>

          <div className={`aspect-video rounded-xl ${post.image} mb-8 flex items-center justify-center`}>
            <span className="text-muted">Featured Image</span>
          </div>

          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 border-t border-border pt-8">
            <h3 className="mb-4 text-lg font-semibold">Share this article</h3>
            <div className="flex gap-4">
              <a href="#" className="flex items-center gap-2 text-muted hover:text-electric">
                <Facebook className="h-5 w-5" />
                Facebook
              </a>
              <a href="#" className="flex items-center gap-2 text-muted hover:text-electric">
                <Twitter className="h-5 w-5" />
                Twitter
              </a>
              <button className="flex items-center gap-2 text-muted hover:text-electric">
                <Share2 className="h-5 w-5" />
                Copy Link
              </button>
            </div>
          </div>
        </article>

        <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Want to learn more?</h3>
          <p className="text-muted mb-6">Browse our full collection of tech articles and buying guides.</p>
          <Link href="/blog" className="btn btn-primary">
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  )
}
