'use client'

import Link from 'next/link'
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
    <header className="sticky top-0 z-50 border-b border-border bg-charcoal/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-electric to-blue bg-clip-text text-transparent transition-all hover:scale-105">
          <span className="text-3xl">⚡</span>Safaritech
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-1 text-sm font-medium text-muted">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 transition-colors ${
                  path === item.href
                    ? 'text-electric after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:bg-electric'
                    : 'hover:text-electric'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 text-muted hover:text-electric transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="relative p-2 text-muted hover:text-electric transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-electric text-xs font-bold text-charcoal">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="p-2 text-muted hover:text-electric transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-muted hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn btn-secondary text-sm px-4 py-2 h-auto"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary text-sm px-6 py-2 h-auto font-semibold shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-electric"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-charcoal">
          <nav className="flex flex-col gap-4 p-6 text-sm font-medium text-muted">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-electric ${path === item.href ? 'text-electric font-semibold' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/cart" className="flex items-center gap-2 transition-colors hover:text-electric">
              <ShoppingCart className="h-4 w-4" />
              Cart ({cartItemsCount})
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 transition-colors hover:text-electric">
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
                <Link href="/login" className="transition-colors hover:text-electric" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary text-sm px-6 py-2 font-semibold self-start" onClick={() => setIsMenuOpen(false)}>
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
