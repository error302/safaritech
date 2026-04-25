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
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <nav className="bg-safaridark/95 backdrop-blur-xl border-b border-safariborder sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/logo.jpg"
                alt="Safaritech"
                width={32}
                height={32}
                className="rounded-lg object-cover"
              />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Safari<span className="text-neon">tech</span>
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-neon transition-colors" />
                <input
                  type="text"
                  placeholder="Search phones, laptops, gaming gear..."
                  className="w-full bg-safarigray border border-safariborder rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-400">
              <Link href="/shop?cat=phones" className="flex items-center gap-1.5 hover:text-neon transition-colors">
                <Smartphone className="w-3.5 h-3.5" /> Phones
              </Link>
              <Link href="/shop?cat=laptops" className="flex items-center gap-1.5 hover:text-neon transition-colors">
                <Laptop className="w-3.5 h-3.5" /> Laptops
              </Link>
              <Link href="/shop?cat=gaming" className="flex items-center gap-1.5 hover:text-neon transition-colors">
                <Gamepad2 className="w-3.5 h-3.5" /> Gaming
              </Link>
              <Link href="/shop?cat=accessories" className="flex items-center gap-1.5 hover:text-neon transition-colors">
                <Headphones className="w-3.5 h-3.5" /> Accessories
              </Link>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/checkout" className="hidden md:flex items-center gap-1.5 bg-green-600 hover:bg-green-500 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                <Smartphone className="w-3.5 h-3.5" />
                M-Pesa
              </Link>

              <Link href="/cart" className="relative p-2 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-display">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href="/account" className="hidden md:block p-2 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white">
                <User className="w-5 h-5" />
              </Link>

              <button
                className="md:hidden p-2 rounded-xl hover:bg-safarigray transition-colors text-gray-400"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 py-2 border-t border-safariborder text-sm overflow-x-auto">
            {[
              { label: "All Products", href: "/shop" },
              { label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
              { label: "Samsung", href: "/shop?q=samsung" },
              { label: "Apple", href: "/shop?q=apple" },
              { label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
              { label: "Gaming PCs", href: "/shop?cat=gaming", icon: Gamepad2 },
              { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
              { label: "Deals", href: "/shop?filter=deals", icon: Flame },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg text-gray-500 hover:text-neon hover:bg-neon/5 transition-all text-xs font-medium"
              >
                {item.icon && <item.icon className="w-3 h-3" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-safariborder bg-safaridark">
            <div className="px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-safarigray border border-safariborder rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon"
                />
              </div>
            </div>
            <div className="px-4 pb-4 flex flex-col gap-1">
              {[
                { label: "Phones", href: "/shop?cat=phones", icon: Smartphone },
                { label: "Laptops & PCs", href: "/shop?cat=laptops", icon: Laptop },
                { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
                { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
                { label: "Deals", href: "/shop?filter=deals", icon: Flame },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-gray-300 hover:text-neon hover:bg-neon/5 transition-all text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
