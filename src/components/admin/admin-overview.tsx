"use client";

import * as React from "react";
import { Package, ShoppingCart, Users, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { useAdminAuth } from "./admin-auth";

interface OverviewData {
  products: number;
  orders: number;
  customers: number;
  coupons: number;
  brands: number;
  revenue: number;
  lowStock: { id: string; name: string; slug: string; stockCount: number; brand: { name: string } }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    itemCount: number;
  }[];
}

function formatKsh(n: number) {
  return "KSh " + n.toLocaleString("en-KE");
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  CONFIRMED: "text-blue-600 bg-blue-50 border-blue-200",
  PROCESSING: "text-blue-600 bg-blue-50 border-blue-200",
  SHIPPED: "text-purple-600 bg-purple-50 border-purple-200",
  DELIVERED: "text-accent bg-accent/10 border-accent/20",
  CANCELLED: "text-destructive bg-destructive/5 border-destructive/20",
};

const PAYMENT_COLORS: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  INITIATED: "text-blue-600 bg-blue-50 border-blue-200",
  PAID: "text-accent bg-accent/10 border-accent/20",
  FAILED: "text-destructive bg-destructive/5 border-destructive/20",
  REFUNDED: "text-muted-foreground bg-secondary border-border",
};

export function AdminOverview() {
  const { adminFetch } = useAdminAuth();
  const [data, setData] = React.useState<OverviewData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    adminFetch("/api/admin/overview")
      .then((r) => r.json())
      .then((json) => setData(json.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [adminFetch]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-secondary/60 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-secondary/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Revenue (paid)", value: formatKsh(data.revenue), icon: DollarSign, accent: "text-accent" },
    { label: "Orders", value: String(data.orders), icon: ShoppingCart, accent: "text-blue-500" },
    { label: "Products", value: String(data.products), icon: Package, accent: "text-foreground" },
    { label: "Customers", value: String(data.customers), icon: Users, accent: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-foreground tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Store performance at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <s.icon className={`h-5 w-5 ${s.accent}`} strokeWidth={1.5} />
            </div>
            <div className="mt-3 num-display text-2xl md:text-3xl text-foreground font-medium tracking-tight">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground tracking-tight">Recent orders</h2>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          {data.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No orders yet. They&apos;ll appear here as customers check out.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-foreground">{o.orderNumber}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground truncate">
                      {o.customerName} · {o.itemCount} {o.itemCount === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="num-display text-sm font-medium text-foreground">
                      {formatKsh(o.total)}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 justify-end">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border ${STATUS_COLORS[o.status] ?? ""}`}>
                        {o.status}
                      </span>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border ${PAYMENT_COLORS[o.paymentStatus] ?? ""}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-lg text-foreground tracking-tight">Low stock</h2>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          {data.lowStock.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              All products well-stocked.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data.lowStock.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.brand.name}</div>
                  </div>
                  <span className={`num-display text-sm font-medium shrink-0 ${p.stockCount < 5 ? "text-destructive" : "text-yellow-600"}`}>
                    {p.stockCount} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
