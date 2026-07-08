"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Ticket,
  Settings,
  LogOut,
  Store,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "./admin-auth";
import { useViewRouter } from "../site/view-router";
import { AdminOverview } from "./admin-overview";
import { AdminProducts } from "./admin-products";
import { AdminOrders } from "./admin-orders";
import { AdminCoupons } from "./admin-coupons";
import { AdminSettings } from "./admin-settings";

type AdminPage = "overview" | "products" | "orders" | "coupons" | "settings";

const NAV: { key: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "settings", label: "Site Settings", icon: Settings },
];

export function AdminShell() {
  const { logout } = useAdminAuth();
  const { navigate } = useViewRouter();
  const [page, setPage] = React.useState<AdminPage>("overview");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="p-5 border-b border-border">
          <button
            onClick={() => navigate({ view: "home" })}
            className="flex items-center gap-2.5"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
              </svg>
            </span>
            <span className="font-display text-lg tracking-display font-medium text-foreground">
              Safari<span className="italic font-semibold text-accent">tech</span>
            </span>
          </button>
          <div className="mt-1 ml-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Admin Dashboard
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                page === item.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => navigate({ view: "home" })}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Store className="h-4 w-4" strokeWidth={1.5} />
            View store
            <ExternalLink className="h-3 w-3 ml-auto" />
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile nav header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => navigate({ view: "home" })}
            className="flex items-center gap-2"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
              </svg>
            </span>
            <span className="font-display text-base tracking-display font-medium text-foreground">
              Admin
            </span>
          </button>
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="text-sm font-medium text-muted-foreground"
          >
            {NAV.find((n) => n.key === page)?.label} ▾
          </button>
        </div>
        {mobileNavOpen && (
          <div className="border-t border-border bg-card p-2 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key);
                  setMobileNavOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  page === item.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            <button
              onClick={() => navigate({ view: "home" })}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <Store className="h-4 w-4" /> View store
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto">
          {page === "overview" && <AdminOverview />}
          {page === "products" && <AdminProducts />}
          {page === "orders" && <AdminOrders />}
          {page === "coupons" && <AdminCoupons />}
          {page === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}
