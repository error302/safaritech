interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit({
  limit = 10,
  windowMs = 60 * 1000,
}: {
  limit?: number
  windowMs?: number
} = {}) {
  return function checkLimit(identifier: string) {
    const now = Date.now()
    const entry = store[identifier]

    if (!entry || entry.resetTime < now) {
      store[identifier] = { count: 1, resetTime: now + windowMs }
      return { success: true, remaining: limit - 1 }
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
      return { success: false, remaining: 0, retryAfter }
    }

    entry.count++
    return { success: true, remaining: limit - entry.count }
  }
}

export const authLimiter = rateLimit({ limit: 5, windowMs: 15 * 60 * 1000 })
export const apiLimiter = rateLimit({ limit: 100, windowMs: 60 * 1000 })
export const webhookLimiter = rateLimit({ limit: 50, windowMs: 60 * 1000 })
