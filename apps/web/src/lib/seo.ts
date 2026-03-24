import { Metadata } from 'next'

interface GenerateMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
}

export function generateMetadata({
  title,
  description,
  path = '',
  image,
}: GenerateMetadataOptions): Metadata {
  const baseTitle = 'Safaritech'
  const defaultDescription = "Kenya's premier electronics marketplace. Shop smartphones, laptops, audio & more."
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://safaritech.co.ke'

  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle
  const fullDescription = description || defaultDescription
  const url = `${siteUrl}${path}`

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: baseTitle,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
      locale: 'en_KE',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
  }
}

export const productJsonLd = ({
  name,
  description,
  price,
  image,
  slug,
}: {
  name: string
  description: string
  price: number
  image?: string
  slug: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name,
  description,
  image: image || undefined,
  url: `https://safaritech.co.ke/product/${slug}`,
  offers: {
    '@type': 'Offer',
    price: price / 100,
    priceCurrency: 'KES',
    availability: 'https://schema.org/InStock',
    url: `https://safaritech.co.ke/product/${slug}`,
  },
})

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Safaritech',
  url: 'https://safaritech.co.ke',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://safaritech.co.ke/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Safaritech',
  url: 'https://safaritech.co.ke',
  logo: 'https://safaritech.co.ke/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254-700-000-000',
    contactType: 'customer service',
  },
  sameAs: [
    'https://facebook.com/safaritech',
    'https://twitter.com/safaritech',
    'https://instagram.com/safaritech',
  ],
}
