'use client'

import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { Loader2 } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export function PullToRefresh({ onRefresh, children, className = '', disabled = false }: PullToRefreshProps) {
  const { isPulling, pullDistance, isRefreshing, threshold } = usePullToRefresh({ onRefresh, disabled })

  const opacity = Math.min(pullDistance / threshold, 1)
  const scale = Math.min(pullDistance / threshold, 1)

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-center pointer-events-none md:hidden"
        style={{
          height: `${pullDistance}px`,
          opacity: isPulling ? 1 : 0,
          transition: isPulling ? 'none' : 'opacity 0.2s ease',
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg"
          style={{
            transform: `scale(${scale})`,
            transition: isPulling ? 'none' : 'transform 0.2s ease',
          }}
        >
          {isRefreshing ? (
            <Loader2 className="w-5 h-5 text-neon animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              style={{
                transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)`,
                transition: isPulling ? 'none' : 'transform 0.2s ease',
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}
