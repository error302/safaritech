'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/app/stores/cartStore'
import { useState } from 'react'

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'Deals', href: '/deals' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const path = usePathname()
  const { data: session } = useSession()
  const cartItemsCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))

  return (
    <header className="sticky top-0 z-50 border-b border-safariborder bg-charcoal/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-all hover:scale-105">
          <Image src="/brands/safaritech-icon.svg" alt="Safaritech" width={28} height={28} className="rounded-lg object-contain" />
          <span className="font-display font-bold text-2xl tracking-tight text-white">
            Safari<span className="text-neon">tech</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-1 text-sm font-medium text-gray-500 md:text-gray-400">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 transition-colors ${
                  path === item.href
                    ? 'text-neon after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:bg-neon'
                    : 'hover:text-neon'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 text-gray-500 md:text-gray-400 hover:text-neon transition-colors" aria-label="Search">
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link href="/cart" className="relative p-2 text-gray-500 md:text-gray-400 hover:text-neon transition-colors" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-electric text-xs font-bold text-charcoal">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="p-2 text-gray-500 md:text-gray-400 hover:text-neon transition-colors" aria-label="Dashboard">
                  <User className="h-5 w-5" aria-hidden="true" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-gray-500 md:text-gray-400 hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon text-sm px-4 py-2 h-auto"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all text-sm px-6 py-2 h-auto font-semibold shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 text-gray-500 md:text-gray-400 hover:text-neon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 md:border-safariborder/50 bg-charcoal">
          <nav className="flex flex-col gap-4 p-6 text-sm font-medium text-gray-500 md:text-gray-400">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-neon ${path === item.href ? 'text-neon font-semibold' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/cart" className="flex items-center gap-2 transition-colors hover:text-neon">
              <ShoppingCart className="h-4 w-4" />
              Cart ({cartItemsCount})
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 transition-colors hover:text-neon">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    setIsMenuOpen(false)
                  }}
                  className="text-left transition-colors hover:text-accent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="transition-colors hover:text-neon" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all text-sm px-6 py-2 font-semibold self-start" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
