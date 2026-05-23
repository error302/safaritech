"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import SiteLogo from "@/components/SiteLogo";
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
  ChevronRight,
  Package,
} from "lucide-react";

const categoryLinks = [
  { label: "All Products", href: "/shop", icon: Package },
  { label: "Phones", href: "/shop?cat=smartphones", icon: Smartphone },
  { label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
  { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
  { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
  { label: "Deals", href: "/deals", icon: Flame },
] as const;

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setMobileOpen(false);
  };

  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-6">
            <SiteLogo iconSize={32} textSize="text-xl" />

            <form className="flex-1 max-w-lg mx-4" onSubmit={handleSearch}>
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-gray-400 transition-colors" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, laptops, gaming gear..."
                  className="w-full bg-safarigray border border-safariborder rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all"
                />
              </div>
            </form>

             <div className="flex items-center gap-1 shrink-0">
               <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white" aria-label="Shopping Cart">
                 <ShoppingCart className="w-5 h-5" />
                 {cartCount > 0 && (
                   <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                     {cartCount}
                   </span>
                 )}
               </Link>
               <Link href="/dashboard" className="p-2.5 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white" aria-label="User Dashboard">
                 <User className="w-5 h-5" />
               </Link>
             </div>
           </div>

           {/* Category bar */}
           <div className="flex items-center gap-1 py-2 border-t border-safariborder/50 text-sm">
             {categoryLinks.map((item) => (
               <Link
                 key={item.label}
                 href={item.href}
                 className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-safarigray transition-all text-xs font-medium"
               >
                 {item.icon && <item.icon className="w-3.5 h-3.5" aria-hidden="true" />}
                 {item.label}
               </Link>
             ))}
           </div>
         </div>
       </nav>

       {/* Mobile — premium dark, matches desktop */}
      <nav className="md:hidden bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
         <div className="px-4">
           <div className="flex items-center justify-between h-14 gap-3">
             <SiteLogo iconSize={28} textSize="text-lg" />

            <div className="flex items-center gap-1 shrink-0">
              <Link href="/cart" className="relative p-2.5 rounded-xl text-gray-400 hover:text-white" aria-label="Shopping Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-neon text-black text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 rounded-xl text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <form className="pb-3" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Safaritech..."
                className="w-full bg-safarigray border border-safariborder rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/40"
              />
            </div>
          </form>
        </div>

        {mobileOpen && (
          <div className="border-t border-safariborder bg-safarigray animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
              {categoryLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {item.icon && <item.icon className="w-4 h-4 text-neon" aria-hidden="true" />}
                    {item.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
