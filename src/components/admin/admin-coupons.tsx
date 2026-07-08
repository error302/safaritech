"use client";

import * as React from "react";
import { Plus, Trash2, X, Save, AlertCircle, Ticket } from "lucide-react";
import { useAdminAuth } from "./admin-auth";

interface AdminCoupon {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  active: boolean;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
}

function formatKsh(n: number) {
  return "KSh " + n.toLocaleString("en-KE");
}

export function AdminCoupons() {
  const { adminFetch } = useAdminAuth();
  const [coupons, setCoupons] = React.useState<AdminCoupon[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/coupons");
      const json = await res.json();
      setCoupons(json.coupons ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  React.useEffect(() => { load(); }, [load]);

  const toggleActive = async (c: AdminCoupon) => {
    await adminFetch(`/api/admin/coupons/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await adminFetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground tracking-tight">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {coupons.length} coupons · {coupons.filter((c) => c.active).length} active.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
        >
          <Plus className="h-4 w-4" />
          New coupon
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-secondary/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-border bg-card">
          <Ticket className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No coupons yet. Create one to offer discounts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-lg font-medium text-foreground tracking-tight">{c.code}</div>
                  {c.description && <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>}
                </div>
                <button
                  onClick={() => onDelete(c.id)}
                  aria-label={`Delete ${c.code}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Discount</div>
                  <div className="num-display text-foreground">
                    {c.type === "percentage" ? `${c.value}%` : formatKsh(c.value)}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Min order</div>
                  <div className="num-display text-foreground">{formatKsh(c.minOrder)}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Used</div>
                  <div className="num-display text-foreground">
                    {c.usedCount}{c.usageLimit && ` / ${c.usageLimit}`}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Expires</div>
                  <div className="text-xs text-foreground">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "Never"}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => toggleActive(c)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    c.active
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : "bg-secondary border-border text-muted-foreground"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${c.active ? "bg-accent" : "bg-muted-foreground"}`} />
                  {c.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <CouponEditor
          onClose={() => setCreating(false)}
          onSaved={() => { setCreating(false); load(); }}
          adminFetch={adminFetch}
        />
      )}
    </div>
  );
}

function CouponEditor({ onClose, onSaved, adminFetch }: {
  onClose: () => void;
  onSaved: () => void;
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}) {
  const [form, setForm] = React.useState({
    code: "",
    description: "",
    type: "percentage",
    value: 10,
    minOrder: 0,
    maxDiscount: 0,
    active: true,
    usageLimit: 100,
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        type: form.type,
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        maxDiscount: form.type === "percentage" && form.maxDiscount > 0 ? Number(form.maxDiscount) : null,
        active: form.active,
        usageLimit: form.usageLimit > 0 ? Number(form.usageLimit) : null,
      };
      const res = await adminFetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground tracking-tight">New coupon</h2>
          <button onClick={onClose} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <label className="block">
            <span className="block text-xs font-medium text-muted-foreground mb-1.5">Coupon code</span>
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="WELCOME10" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-muted-foreground mb-1.5">Description</span>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="10% off your first order" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">Type</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (KSh)</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">Value</span>
              <input type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">Min order (KSh)</span>
              <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">Max discount {form.type === "fixed" ? "(n/a)" : "(KSh)"}</span>
              <input type="number" disabled={form.type === "fixed"} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-40" />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1.5">Usage limit (0 = unlimited)</span>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </label>
            <label className="flex items-end gap-2 pb-1">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" />
              <span className="text-sm text-foreground">Active</span>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="h-10 px-5 rounded-full border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50">
              <Save className="h-4 w-4" />
              {saving ? "Creating…" : "Create coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
