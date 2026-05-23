"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import SiteLogo from "@/components/SiteLogo";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LayoutDashboard,
  Settings,
  LogOut,
  FileText,
  Tag,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
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
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "admin@safaritech.co.ke";
  const userInitial = userName.charAt(0).toUpperCase();

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-safariborder">
        <SiteLogo href="/" iconSize={28} textSize="text-lg" />
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
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-safarigray border border-transparent transition-all"
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          Back to Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent transition-all w-full mt-1"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
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
