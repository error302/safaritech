import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <p className="mb-4 text-8xl font-bold font-display text-neon">404</p>
        <h1 className="mb-4 text-3xl font-bold font-display text-gray-900 md:text-white">Page Not Found</h1>
        <p className="text-gray-500 md:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
            <Search className="mr-2 h-5 w-5" />
            Search Products
          </Link>
          <Link href="/" className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
