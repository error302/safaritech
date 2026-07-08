"use client";

import * as React from "react";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import { useAdminAuth } from "./admin-auth";
import { cn } from "@/lib/utils";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  couponCode: string | null;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    brandName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    imageUrl: string | null;
  }[];
}

function formatKsh(n: number) {
  return "KSh " + n.toLocaleString("en-KE");
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
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

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "INITIATED", "PAID", "FAILED", "REFUNDED"];

export function AdminOrders() {
  const { adminFetch } = useAdminAuth();
  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>("ALL");

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/orders");
      const json = await res.json();
      setOrders(json.orders ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q);
    const matchesFilter = filter === "ALL" || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id: string, status: string) => {
    await adminFetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const updatePayment = async (id: string, paymentStatus: string) => {
    await adminFetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} total orders.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, or phone…"
            className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 px-4 rounded-full bg-card border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-secondary/40 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((o) => (
              <div key={o.id}>
                {/* Row */}
                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-4 hover:bg-secondary/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {expanded === o.id ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-foreground">{o.orderNumber}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground truncate">
                        {o.customerName} · {o.customerPhone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="num-display text-sm font-medium text-foreground">{formatKsh(o.total)}</div>
                      <div className="text-xs text-muted-foreground">{timeAgo(o.createdAt)}</div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border", STATUS_COLORS[o.status] ?? "")}>
                        {o.status}
                      </span>
                      <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border", PAYMENT_COLORS[o.paymentStatus] ?? "")}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === o.id && (
                  <div className="px-4 py-4 bg-secondary/10 border-t border-border space-y-4">
                    {/* Items */}
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                        Items ({o.items.length})
                      </div>
                      <div className="space-y-2">
                        {o.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            {item.imageUrl && (
                               
                              <img src={item.imageUrl} alt={item.productName} className="h-8 w-8 rounded object-cover border border-border" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-foreground truncate">{item.productName}</span>
                              <span className="text-muted-foreground ml-2">× {item.quantity}</span>
                            </div>
                            <span className="num-display text-foreground">{formatKsh(item.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Subtotal</div>
                        <div className="num-display text-sm text-foreground">{formatKsh(o.subtotal)}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Discount</div>
                        <div className="num-display text-sm text-foreground">
                          {o.discount > 0 ? `−${formatKsh(o.discount)}` : "—"}
                          {o.couponCode && <span className="ml-1 text-xs text-accent">{o.couponCode}</span>}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Shipping</div>
                        <div className="num-display text-sm text-foreground">
                          {o.shipping === 0 ? "Free" : formatKsh(o.shipping)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Total</div>
                        <div className="num-display text-sm font-medium text-foreground">{formatKsh(o.total)}</div>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border text-sm">
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Email</div>
                        <div className="text-foreground">{o.customerEmail || "—"}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Phone</div>
                        <div className="text-foreground">{o.customerPhone}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Payment</div>
                        <div className="text-foreground capitalize">{o.paymentMethod ?? "mpesa"}</div>
                      </div>
                    </div>

                    {/* Status controls */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Order status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="h-8 px-3 rounded-lg bg-background border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Payment:</span>
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => updatePayment(o.id, e.target.value)}
                          className="h-8 px-3 rounded-lg bg-background border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
                        >
                          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
