"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { Home, ShoppingCart, User, Menu, Package, X, ChevronRight, Heart, MapPin, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItemsBase = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Package },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/dashboard", icon: User },
  { label: "Menu", href: "#menu", icon: Menu },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: cart } = trpc.cart.getCart.useQuery();
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = navItemsBase.map((item) => {
    if (item.href === "/cart") {
      return { ...item, badge: cartCount };
    }
    return item;
  });

  const handleNavClick = (item: typeof navItemsBase[0]) => {
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

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = item.href !== "#menu" && pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href === "#menu" ? "#" : item.href}
                onClick={(e) => {
                  if (item.href === "#menu") {
                    e.preventDefault();
                    handleNavClick(item);
                  }
                }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative min-w-[60px]"
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${active ? "text-black" : "text-gray-400"}`} strokeWidth={active ? 2.5 : 1.8} />
                  {"badge" in item && item.badge && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center border-2 border-white px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-black" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Menu Sheet */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-display font-bold text-lg text-gray-900">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              {menuLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="flex-1 text-sm font-medium text-gray-900">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                );
              })}
            </div>

            <div className="px-4 pb-6 pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-red-600">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
