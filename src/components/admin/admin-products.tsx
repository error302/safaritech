"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, X, Save, AlertCircle } from "lucide-react";
import { useAdminAuth } from "./admin-auth";
import { ImageUpload } from "./image-upload";
import { cn } from "@/lib/utils";

interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  stockCount: number;
  inStock: boolean;
  featured: boolean;
  tag: string | null;
  brand: { name: string; slug: string };
  category: { name: string; slug: string };
  imageUrl: string | null;
  condition: string | null;
  warrantyMonths: number | null;
}

interface Brand {
  id: string; name: string; slug: string;
}
interface Category {
  id: string; name: string; slug: string;
}

function formatKsh(n: number) {
  return "KSh " + n.toLocaleString("en-KE");
}

export function AdminProducts() {
  const { adminFetch } = useAdminAuth();
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState<AdminProduct | null>(null);
  const [creating, setCreating] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, brandRes, catRes] = await Promise.all([
        adminFetch("/api/admin/products"),
        fetch("/api/brands").then((r) => r.json()),
        fetch("/api/categories").then((r) => r.json()),
      ]);
      const prodJson = await prodRes.json();
      setProducts(prodJson.products ?? []);
      setBrands(brandRes.brands ?? []);
      setCategories(catRes.categories ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const onDelete = async (slug: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await adminFetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    if (res.ok) load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} products in the catalogue.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
        >
          <Plus className="h-4 w-4" />
          New product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or brand…"
          className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-secondary/40 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Product</th>
                  <th className="text-left px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden md:table-cell">Brand</th>
                  <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Price</th>
                  <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Stock</th>
                  <th className="text-center px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Featured</th>
                  <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                           
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-secondary border border-border" />
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{p.brand.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{p.brand.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="num-display text-sm font-medium text-foreground">{formatKsh(p.price)}</div>
                      {p.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">{formatKsh(p.originalPrice)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className={cn(
                        "num-display text-sm font-medium",
                        p.stockCount < 5 ? "text-destructive" : p.stockCount < 10 ? "text-yellow-600" : "text-foreground"
                      )}>
                        {p.stockCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {p.featured && <span className="text-accent">★</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          aria-label={`Edit ${p.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(p.slug)}
                          aria-label={`Delete ${p.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create modal */}
      {(editing || creating) && (
        <ProductEditor
          product={editing}
          brands={brands}
          categories={categories}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
          adminFetch={adminFetch}
        />
      )}
    </div>
  );
}

interface ProductEditorProps {
  product: AdminProduct | null;
  brands: Brand[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}

function ProductEditor({ product, brands, categories, onClose, onSaved, adminFetch }: ProductEditorProps) {
  const isEdit = !!product;
  const [form, setForm] = React.useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    brandSlug: product?.brand.slug ?? brands[0]?.slug ?? "",
    categorySlug: product?.category.slug ?? categories[0]?.slug ?? "",
    price: product?.price ?? 0,
    originalPrice: product?.originalPrice ?? 0,
    tag: product?.tag ?? "",
    summary: "",
    description: "",
    inStock: product?.inStock ?? true,
    stockCount: product?.stockCount ?? 10,
    featured: product?.featured ?? false,
    shape: "phone",
    accent: "oklch(0.40 0.08 165)",
    imageUrl: product?.imageUrl ?? "",
    condition: product?.condition ?? "NEW",
    features: "",
    specs: "",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        originalPrice: form.originalPrice > 0 ? form.originalPrice : null,
        tag: form.tag || null,
        imageUrl: form.imageUrl || null,
        condition: form.condition || "NEW",
        warrantyMonths: (form.condition || "NEW") === "NEW" ? 12 : 3,
        features: form.features ? form.features.split("\n").filter(Boolean) : [],
        specs: form.specs ? Object.fromEntries(form.specs.split("\n").filter(Boolean).map((l) => { const [k, ...v] = l.split(":"); return [k.trim(), v.join(":").trim()]; })) : {},
      };

      const url = isEdit ? `/api/admin/products/${product!.slug}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-foreground tracking-tight">
            {isEdit ? "Edit product" : "New product"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input" />
            </Field>
            <Field label="Slug (auto from name if empty)">
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="admin-input" placeholder="iphone-15-pro" />
            </Field>
            <Field label="Brand">
              <select value={form.brandSlug} onChange={(e) => setForm({ ...form, brandSlug: e.target.value })} className="admin-input">
                {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <select value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="admin-input">
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Price (KSh)">
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="admin-input" />
            </Field>
            <Field label="Original price (KSh, 0 = none)">
              <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="admin-input" />
            </Field>
            <Field label="Tag (Best seller, Deal, etc.)">
              <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="admin-input" placeholder="Best seller" />
            </Field>
            <Field label="Condition (sets warranty period)">
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="admin-input"
              >
                <option value="NEW">New — 12-month warranty</option>
                <option value="EXUK">Ex-UK — 3-month warranty</option>
                <option value="REFURBISHED">Refurbished — 3-month warranty</option>
              </select>
            </Field>
            <Field label="Stock count">
              <input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: Number(e.target.value) })}
                className="admin-input" />
            </Field>
          </div>

          {/* Image upload — full width */}
          <div className="sm:col-span-2">
            <ImageUpload
              label="Product image"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              adminFetch={adminFetch}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Shape (for SVG fallback)">
              <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })} className="admin-input">
                {["phone", "laptop", "audio", "gaming", "watch", "accessory"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Accent color (oklch)">
              <input value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })}
                className="admin-input" />
            </Field>
          </div>

          <Field label="Summary (one line)">
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="admin-input" />
          </Field>

          <Field label="Description (full marketing copy)">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="admin-input resize-y" />
          </Field>

          <Field label="Features (one per line)">
            <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              rows={5} className="admin-input resize-y font-mono text-xs"
              placeholder={"Aerospace-grade titanium design\nA17 Pro chip with 6-core GPU\n48MP main camera"} />
          </Field>

          <Field label="Specs (Key: Value, one per line)">
            <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })}
              rows={5} className="admin-input resize-y font-mono text-xs"
              placeholder={"Display: 6.1-inch Super Retina XDR\nChip: A17 Pro\nBattery: Up to 23 hours"} />
          </Field>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="rounded" />
              In stock
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded" />
              Featured on homepage
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
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
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        :global(.admin-input) {
          width: 100%;
          height: 2.5rem;
          padding: 0 0.75rem;
          border-radius: 0.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        :global(.admin-input:focus) {
          border-color: oklch(0.40 0.08 165 / 0.4);
          box-shadow: 0 0 0 2px oklch(0.40 0.08 165 / 0.2);
        }
        :global(textarea.admin-input) {
          height: auto;
          padding: 0.5rem 0.75rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
