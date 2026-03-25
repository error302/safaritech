'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red/10">
          <AlertTriangle className="h-10 w-10 text-red" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn btn-primary">
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
