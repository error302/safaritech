export const cache = {
  default: 60 * 60,
  static: 60 * 60 * 24,
  dynamic: 60,
  private: 0,
}

export function getCacheHeaders(maxAge: number = cache.default) {
  return {
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge * 2}, stale-while-revalidate=${maxAge * 10}`,
  }
}

export function getNoCacheHeaders() {
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  }
}

export function getStaticCacheHeaders() {
  return getCacheHeaders(cache.static)
}

export function getDynamicCacheHeaders() {
  return getCacheHeaders(cache.dynamic)
}
