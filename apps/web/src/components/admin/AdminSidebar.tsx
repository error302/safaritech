"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Tag,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: BarChart3, label: "Overview", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-safariborder">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brands/safaritech-icon.svg"
            alt="Safaritech"
            width={28}
            height={28}
            className="rounded-lg object-contain"
          />
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
              onClick={() => setMobileOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-safaridark border border-safariborder text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-safaridark border-r border-safariborder z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-safaridark border-r border-safariborder z-40 flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
