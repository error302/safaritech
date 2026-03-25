import Link from 'next/link'
import { Search, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <p className="mb-4 text-8xl font-bold text-electric">404</p>
        <h1 className="mb-4 text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="btn btn-primary">
            <Search className="mr-2 h-5 w-5" />
            Search Products
          </Link>
          <Link href="/" className="btn btn-secondary">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
