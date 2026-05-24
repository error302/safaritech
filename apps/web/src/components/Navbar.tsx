"use client";

import { useState, type FormEvent } from "react";
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
  Settings,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

const categoryLinks = [
  { label: "All Products", href: "/shop", icon: Package },
  { label: "Phones", href: "/shop?cat=smartphones", icon: Smartphone },
  { label: "Laptops", href: "/shop?cat=laptops", icon: Laptop },
  { label: "Gaming", href: "/shop?cat=gaming", icon: Gamepad2 },
  { label: "Accessories", href: "/shop?cat=accessories", icon: Headphones },
  { label: "Deals", href: "/deals", icon: Flame },
] as const;

function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (session?.user) {
    const initials = session.user.name
      ? session.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : session.user.email?.[0]?.toUpperCase() || "U";

    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-safarigray transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-neon/20 border-2 border-neon/50 flex items-center justify-center text-neon text-xs font-bold shadow-[0_0_10px_rgba(0,255,159,0.2)]">
            {initials}
          </div>
          <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-safarigray border border-safariborder rounded-xl shadow-xl z-50 py-2 animate-fade-in">
              <div className="px-4 py-3 border-b border-safariborder">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neon/20 border border-neon/50 flex items-center justify-center text-neon text-xs font-bold">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-safaridark transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-safaridark transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <div className="border-t border-safariborder mt-1 pt-1">
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white text-sm font-medium"
      aria-label="Sign In"
    >
      <User className="w-5 h-5" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
}

function CartButton() {
  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-safarigray transition-colors group overflow-visible"
      aria-label={`Shopping Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
    >
      <ShoppingCart className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.8} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-neon text-black text-[10px] font-extrabold leading-none min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-[5px] shadow-[0_0_10px_rgba(0,255,159,0.5)] ring-2 ring-safaridark">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-6">
            <SiteLogo iconSize={32} textSize="text-xl" />

            <form
              className="flex-1 max-w-lg mx-4"
              onSubmit={handleSearch}
            >
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
              <CartButton />
              <UserMenu />
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
                {item.icon && (
                  <item.icon
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden bg-safaridark/95 backdrop-blur-md border-b border-safariborder sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14 gap-3">
            <SiteLogo iconSize={28} textSize="text-lg" />

            <div className="flex items-center gap-1 shrink-0">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-safarigray transition-colors"
                  aria-label="My Account"
                >
                  <div className="w-7 h-7 rounded-full bg-neon/20 border border-neon/50 flex items-center justify-center text-neon text-[10px] font-bold">
                    {session.user.name
                      ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="absolute bottom-0.5 right-1.5 w-2 h-2 bg-neon rounded-full ring-2 ring-safaridark" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-safarigray transition-colors text-gray-400 hover:text-white"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-400 hover:text-white hover:bg-safarigray transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <form className="pb-3" onSubmit={handleSearch}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4"
                aria-hidden="true"
              />
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
            {/* User greeting in mobile menu */}
            {session?.user && (
              <div className="px-4 py-3 border-b border-safariborder bg-safaridark/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon/20 border border-neon/50 flex items-center justify-center text-neon text-sm font-bold">
                    {session.user.name
                      ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-3 flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
              {categoryLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {item.icon && (
                      <item.icon
                        className="w-4 h-4 text-neon"
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 text-gray-600"
                    aria-hidden="true"
                  />
                </Link>
              ))}

              {/* Auth section in mobile menu */}
              <div className="border-t border-safariborder mt-2 pt-2">
                {session?.user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-neon" />
                      <span className="flex-1">My Dashboard</span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-neon" />
                        <span className="flex-1">Admin Panel</span>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-3 py-3.5 px-3 rounded-xl text-red-400 hover:bg-red-950/30 transition-all min-h-[48px] w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 py-3.5 px-3 rounded-xl text-gray-200 hover:bg-safaridark transition-all min-h-[48px]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4 text-neon" />
                    <span className="flex-1">Sign In</span>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
