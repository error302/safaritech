'use client'

import { useState, useEffect, useCallback } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
}

export function usePullToRefresh({ onRefresh, threshold = 80, disabled = false }: UsePullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    // Only start pull if at top of page
    if (window.scrollY > 0) return
    
    const touch = e.touches[0]
    const startY = touch.clientY
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const currentY = touch.clientY
      const diff = currentY - startY
      
      if (diff > 0) {
        e.preventDefault()
        // Resistance increases as pull distance grows
        const resistance = 1 + (diff / 200)
        setPullDistance(Math.min(diff / resistance, threshold * 1.5))
        setIsPulling(true)
      }
    }
    
    const handleTouchEnd = async () => {
      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        await onRefresh()
        setIsRefreshing(false)
      }
      
      setIsPulling(false)
      setPullDistance(0)
      
      document.removeEventListener('touchmove', handleTouchMove, { passive: false } as any)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false } as any)
    document.addEventListener('touchend', handleTouchEnd)
  }, [disabled, pullDistance, threshold, onRefresh])

  useEffect(() => {
    const element = document.body
    
    if (!disabled) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true })
    }
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
    }
  }, [handleTouchStart, disabled])

  return { isPulling, pullDistance, isRefreshing, threshold }
}
