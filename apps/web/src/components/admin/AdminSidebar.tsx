"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingCart, Users, BarChart3, Settings, LogOut, ChevronRight } from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Overview", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-safaridark border-r border-safariborder z-40 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-safariborder">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <ellipse cx="14" cy="11" rx="7" ry="10" stroke="#00FF9F" strokeWidth="1.5" fill="none" transform="rotate(-15 14 11)"/>
            <line x1="14" y1="3" x2="14" y2="26" stroke="#00FF9F" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-display font-bold text-lg text-white">
            Safari<span className="text-neon">tech</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-neon/10 text-neon border border-neon/20"
                  : "text-gray-400 hover:text-white hover:bg-safarigray border border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-safariborder">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@safaritech.co.ke</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-safarigray border border-transparent transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}