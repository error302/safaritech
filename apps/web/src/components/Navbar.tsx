"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/utils/trpc";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Flame,
  MapPin,
  ChevronDown,
  ChevronRight,
  Package,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-6">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/logo.jpg" alt="Safaritech" width={32} height={32} className="rounded-lg object-cover" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Safari<span className="text-neon">tech</span>
              </span>
            </Link>

            <div className="flex-1 max-w-lg mx-4">
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gray-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search phones, laptops, gaming gear..."
                  className="w-full bg-safarigray border border-safariborder rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Category bar */}
          <div className="flex items-center gap-1 py-2 border-t border-safariborder/50 text-sm">
            {[
              { label: "All Products", href: "/shop" },
              { label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
              { label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
              { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
              { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
              { label: "Deals", href: "/shop?filter=deals", icon: Flame },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-safarigray transition-all text-xs font-medium"
              >
                {item.icon && <item.icon className="w-3.5 h-3.5" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar — clean & minimal */}
      <nav className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14 gap-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/logo.jpg" alt="Safaritech" width={28} height={28} className="rounded-lg object-cover" />
              <span className="font-display font-bold text-lg tracking-tight text-gray-900">
                Safari<span className="text-neon-dim">tech</span>
              </span>
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <Link href="/cart" className="relative p-2 rounded-lg text-gray-600">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2 rounded-lg text-gray-600"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Safaritech..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-0.5">
              {[
                { label: "All Products", href: "/shop", icon: Package },
                { label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
                { label: "Laptops & PCs", href: "/shop?cat=laptops", icon: Laptop },
                { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
                { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
                { label: "Deals", href: "/shop?filter=deals", icon: Flame },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3 px-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-4 h-4 text-gray-400" />}
                    {item.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
