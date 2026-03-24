import type { Metadata } from 'next'
import { Syne, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/app/providers'
import { Navbar } from '@/app/components/Navbar'
import { Footer } from '@/app/components/Footer'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Safaritech - Kenya Electronics Marketplace',
  description: 'Ultimate electronics marketplace for Kenya - Smartphones, Laptops, Audio & More',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-charcoal text-text flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
