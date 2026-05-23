"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import {
  Home,
  ShoppingCart,
  User,
  Menu,
  Package,
  X,
  ChevronRight,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  LogIn,
  Settings,
} from "lucide-react";
import { useState, type MouseEvent } from "react";

const navItemsBase = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/dashboard", icon: User },
  { label: "More", href: "#menu", icon: Menu },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = navItemsBase.map((item) => {
    if (item.href === "/cart") {
      return { ...item, badge: cartCount };
    }
    return item;
  });

  const handleNavClick = (item: (typeof navItemsBase)[0]) => {
    if (item.href === "#menu") {
      setMenuOpen(true);
    }
  };

  const menuLinks = [
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Addresses", href: "/settings", icon: MapPin },
    { label: "Help & FAQ", href: "/faq", icon: HelpCircle },
  ];

  // If user is admin, add admin link
  if (session?.user?.role === "ADMIN") {
    menuLinks.push({
      label: "Admin Panel",
      href: "/admin",
      icon: Settings,
    });
  }

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-safaridark/95 backdrop-blur-lg border-t border-safariborder pb-safe"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = item.href !== "#menu" && pathname === item.href;
            const Icon = item.icon;

            // For Account tab: show different color if logged in
            const isAccount = item.href === "/dashboard";
            const isLoggedIn = !!session?.user;

            return (
              <Link
                key={item.label}
                href={item.href === "#menu" ? "#" : item.href}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  if (item.href === "#menu") {
                    e.preventDefault();
                    handleNavClick(item);
                  }
                  // If not logged in and trying to access dashboard, redirect to login
                  if (isAccount && !isLoggedIn) {
                    e.preventDefault();
                    window.location.href = "/login";
                  }
                }}
                className="flex flex-col items-center gap-0.5 px-2 py-1 relative min-w-[56px] min-h-[48px] justify-center"
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active
                        ? "text-neon"
                        : isAccount && isLoggedIn
                        ? "text-neon/70"
                        : "text-gray-500"
                    }`}
                    strokeWidth={active ? 2.5 : 1.8}
                    aria-hidden="true"
                  />
                  {"badge" in item && item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-neon text-black text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-[0_0_6px_rgba(0,255,159,0.4)]">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {isAccount && isLoggedIn && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon rounded-full" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    active
                      ? "text-neon"
                      : isAccount && isLoggedIn
                      ? "text-neon/70"
                      : "text-gray-500"
                  }`}
                >
                  {isAccount && !isLoggedIn ? "Login" : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="More menu"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-safarigray border-t border-safariborder rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up pb-safe">
            <div className="sticky top-0 bg-safarigray flex items-center justify-between px-5 py-4 border-b border-safariborder rounded-t-2xl">
              <h2 className="font-display font-bold text-lg text-white">
                Menu
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-safaridark text-gray-400"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* User info at top of menu if logged in */}
            {session?.user && (
              <div className="px-5 py-3 border-b border-safariborder">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon/20 border border-neon/40 flex items-center justify-center text-neon text-sm font-bold">
                    {session.user.name
                      ? session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
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

            <div className="p-4 space-y-1">
              {menuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-safaridark transition-colors min-h-[48px]"
                    aria-label={link.label}
                  >
                    <Icon
                      className="w-5 h-5 text-neon"
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-sm font-medium text-white">
                      {link.label}
                    </span>
                    <ChevronRight
                      className="w-4 h-4 text-gray-600"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="px-4 pb-6 pt-2 border-t border-safariborder">
              {session?.user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-950/30 transition-colors w-full min-h-[48px]"
                >
                  <LogOut
                    className="w-5 h-5 text-red-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-red-400">
                    Sign Out
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-safaridark transition-colors w-full min-h-[48px]"
                >
                  <LogIn
                    className="w-5 h-5 text-neon"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-neon">
                    Sign In
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
