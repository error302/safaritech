"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  LogOut,
  LayoutDashboard,
  Settings,
  Shield,
} from "lucide-react";

const categoryLinks = [
  { label: "All Products", href: "/shop", icon: Package },
  { label: "Phones", href: "/shop?cat=smartphones", icon: Smartphone },
  { label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
  { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
  { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
  { label: "Deals", href: "/deals", icon: Flame },
] as const;

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-neon text-black text-[10px] font-bold leading-none min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-[0_2px_8px_rgba(0,255,136,0.4)]">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function UserMenu({ session }: { session: ReturnType<typeof useSession>["data"] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-2"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="bg-neon hover:brightness-110 text-black font-bold text-xs px-4 py-2 rounded-full transition-all"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const isAdmin = session.user?.role === "ADMIN";
  const initial = (session.user?.name || session.user?.email || "U")[0].toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-safarigray transition-colors"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-neon/15 text-neon text-sm font-bold flex items-center justify-center ring-1 ring-neon/30">
          {initial}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-safarigray border border-safariborder rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-[70]">
          {/* User info */}
          <div className="px-4 py-3 border-b border-safariborder">
            <p className="text-sm font-medium text-white truncate">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-safaridark hover:text-white transition-colors"
              >
                <Shield className="w-4 h-4 text-neon" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-safaridark hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gray-500" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-safaridark hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Settings
            </Link>
          </div>

          <div className="border-t border-safariborder py-1">
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/30 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
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

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <CartBadge count={cartCount} />
              </Link>
              <UserMenu session={session} />
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

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14 gap-3">
            <SiteLogo iconSize={28} textSize="text-lg" />

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl text-gray-400 hover:text-white"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <CartBadge count={cartCount} />
              </Link>
              {session ? (
                <Link
                  href="/dashboard"
                  className="p-1 rounded-full"
                  aria-label="My Account"
                >
                  <div className="w-7 h-7 rounded-full bg-neon/15 text-neon text-xs font-bold flex items-center justify-center ring-1 ring-neon/30">
                    {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-neon text-black font-bold text-xs px-3.5 py-1.5 rounded-full transition-all"
                >
                  Sign In
                </Link>
              )}
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

              {/* Auth actions in mobile menu */}
              <div className="border-t border-safariborder mt-2 pt-2">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-between py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4 text-neon" />
                        Dashboard
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </Link>
                    {session.user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center justify-between py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-neon" />
                          Admin
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </Link>
                    )}
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-red-950/30 transition-all min-h-[48px] w-full"
                    >
                      <span className="flex items-center gap-3">
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Sign Out</span>
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-between py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <User className="w-4 h-4 text-neon" />
                        Sign In
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center py-3.5 px-3 rounded-xl bg-neon text-black font-bold transition-all min-h-[48px] mt-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
