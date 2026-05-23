import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://safaritech.co.ke'

  const staticRoutes = [
    '',
    '/shop',
    '/about',
    '/contact',
    '/faq',
    '/deals',
    '/categories',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const categories = ['phones', 'laptops', 'audio', 'wearables', 'tablets', 'cameras', 'gaming', 'smart-home']
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/shop/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes]
}
