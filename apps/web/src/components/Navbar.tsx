"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <nav className="bg-safaridark border-b border-safariborder sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <ellipse cx="14" cy="11" rx="7" ry="10" stroke="#00FF9F" strokeWidth="1.5" fill="none" transform="rotate(-15 14 11)"/>
                <line x1="14" y1="3" x2="14" y2="26" stroke="#00FF9F" strokeWidth="1.5" strokeLinecap="round"/>
                <ellipse cx="14" cy="14" rx="6" ry="9" stroke="#00FF9F" strokeWidth="1" fill="none" transform="rotate(15 14 14)" opacity="0.4"/>
              </svg>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Safari<span className="text-neon">tech</span>
              </span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search phones, laptops, gaming gear..."
                  className="w-full bg-safarigray border border-safariborder rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon/30 transition-all"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
              <Link href="/shop?cat=phones" className="hover:text-neon transition-colors">Phones</Link>
              <Link href="/shop?cat=laptops" className="hover:text-neon transition-colors">Laptops & PCs</Link>
              <Link href="/shop?cat=gaming" className="hover:text-neon transition-colors">Gaming</Link>
              <Link href="/shop?cat=accessories" className="hover:text-neon transition-colors">Accessories</Link>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/checkout" className="hidden md:flex items-center gap-1.5 bg-green-600 hover:bg-green-500 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/>
                </svg>
                M-Pesa
              </Link>

              <Link href="/cart" className="relative p-2 rounded-xl hover:bg-safarigray transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-display">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href="/account" className="hidden md:block p-2 rounded-xl hover:bg-safarigray transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>

              <button
                className="md:hidden p-2 rounded-xl hover:bg-safarigray transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 py-2 border-t border-safariborder text-sm overflow-x-auto">
            {["All Products", "Phones", "Samsung", "Apple", "Laptops", "Gaming PCs", "Accessories", "Headphones", "Smartwatches", "Deals 🔥"].map((item) => (
              <Link
                key={item}
                href={`/shop?cat=${item.toLowerCase().replace(/ /g, "-")}`}
                className="shrink-0 px-3 py-1 rounded-lg text-gray-400 hover:text-neon hover:bg-neon/5 transition-all text-xs font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-safariborder bg-safaridark">
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-safarigray border border-safariborder rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-neon"
              />
            </div>
            <div className="px-4 pb-4 flex flex-col gap-1">
              {["Phones", "Laptops & PCs", "Gaming", "Accessories", "Deals"].map((item) => (
                <Link
                  key={item}
                  href={`/shop?cat=${item.toLowerCase()}`}
                  className="py-2.5 px-3 rounded-xl text-gray-300 hover:text-neon hover:bg-neon/5 transition-all text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}