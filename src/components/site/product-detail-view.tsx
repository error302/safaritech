"use client";

import * as React from "react";
import {
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
} from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { ProductImage } from "./product-image";
import { ConditionBadge, WarrantyBadge, getCondition } from "./condition-badge";
import { Product } from "./types";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface ProductResponse {
  product: Product;
}

export function ProductDetailView({ slug }: { slug: string }) {
  const { navigate } = useViewRouter();
  const { addItem } = useCart();
  const [data, setData] = React.useState<ProductResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  useScrollReveal([loading, data]);
  const [error, setError] = React.useState<string | null>(null);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [tab, setTab] = React.useState<"specs" | "features" | "reviews">("features");

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setQty(1);
    setAdded(false);
    setTab("features");
    fetch(`/api/products/${slug}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Product not found");
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const onAdd = () => {
    if (!data) return;
    addItem(
      {
        slug: data.product.slug,
        name: data.product.name,
        brand: data.product.brand?.name ?? "",
        price: data.product.price,
        originalPrice: data.product.originalPrice,
        shape: data.product.shape,
        accent: data.product.accent,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-secondary/40 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-32 bg-secondary/60 rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-secondary/60 rounded animate-pulse" />
              <div className="h-6 w-24 bg-secondary/40 rounded animate-pulse" />
              <div className="h-24 w-full bg-secondary/40 rounded animate-pulse mt-6" />
              <div className="h-12 w-full bg-secondary/60 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-28 md:pt-36 pb-20">
        <div className="container-premium text-center py-16">
          <h1 className="font-display text-3xl text-foreground">Product not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate({ view: "shop" })}
            className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const p = data.product;
  const discount = p.originalPrice
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : 0;
  const reviews = p.reviews_rel ?? [];

  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="container-premium">
        {/* Breadcrumb */}
        <nav className="reveal flex items-center gap-1.5 text-xs text-muted-foreground mb-8 flex-wrap" aria-label="Breadcrumb">
          <button onClick={() => navigate({ view: "home" })} className="hover:text-foreground transition-colors">
            Home
          </button>
          <ChevronRight className="h-3 w-3" />
          <button
            onClick={() => navigate({ view: "shop" })}
            className="hover:text-foreground transition-colors"
          >
            Shop
          </button>
          {p.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={() =>
                  navigate({ view: "shop", query: { category: p.category!.slug } })
                }
                className="hover:text-foreground transition-colors"
              >
                {p.category.name}
              </button>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{p.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="reveal">
            <div className="relative aspect-square rounded-2xl border border-border bg-card overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(140deg, ${p.accent}22 0%, ${p.accent}10 50%, transparent 100%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <ProductImage
                imageUrl={p.imageUrl}
                shape={p.shape}
                accent={p.accent}
                alt={p.name}
                className="absolute inset-0 w-full h-full"
                fit="contain"
              />
              {/* Corner labels */}
              <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
                {p.brand?.name}
              </div>
              <div className="absolute top-4 right-4">
                <ConditionBadge condition={p.condition} size="md" />
              </div>
              {p.tag && (
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/80">
                    {p.tag}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">
                    Save {discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails (decorative — same image repeated for now) */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border border-border bg-card overflow-hidden relative"
                  style={{
                    background: `linear-gradient(140deg, ${p.accent}22 0%, ${p.accent}10 50%, transparent 100%)`,
                  }}
                >
                  <ProductImage
                    imageUrl={p.imageUrl}
                    shape={p.shape}
                    accent={p.accent}
                    alt={`${p.name} thumbnail ${i + 1}`}
                    className="absolute inset-0 w-full h-full"
                    fit="contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="reveal" data-delay="80">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {p.brand?.name} · {p.category?.name}
            </div>
            <h1 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4vw,3rem)] leading-[1.05] mt-3 font-medium">
              {p.name}
            </h1>

            {/* Rating + reviews */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3.5 w-3.5",
                      s <= Math.round(p.rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{p.rating}</span> · {p.reviews.toLocaleString()} reviews
              </span>
              <span className="text-muted-foreground/40">·</span>
              {p.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  In stock · {p.stockCount} available
                </span>
              ) : (
                <span className="text-xs text-destructive">Out of stock</span>
              )}
            </div>

            {/* Condition + warranty */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ConditionBadge condition={p.condition} size="md" />
              <WarrantyBadge warrantyMonths={p.warrantyMonths ?? 12} condition={p.condition} size="md" />
              <span className="text-[11px] text-muted-foreground">
                {getCondition(p.condition).description}
              </span>
            </div>

            {/* Summary */}
            <p className="mt-6 text-base md:text-lg text-foreground leading-relaxed font-display tracking-tight">
              {p.summary}
            </p>

            {/* Price */}
            <div className="mt-7 flex items-baseline gap-3">
              <span className="num-display text-3xl md:text-4xl text-foreground font-medium tracking-tightest">
                {formatKsh(p.price)}
              </span>
              {p.originalPrice && (
                <span className="text-base text-muted-foreground line-through">
                  {formatKsh(p.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs text-accent font-mono uppercase tracking-widest">
                  Save {formatKsh((p.originalPrice ?? 0) - p.price)}
                </span>
              )}
            </div>

            {/* Qty + add to cart */}
            <div className="mt-7 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="inline-flex h-11 w-11 items-center justify-center hover:bg-secondary rounded-l-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-medium tabular-nums min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="inline-flex h-11 w-11 items-center justify-center hover:bg-secondary rounded-r-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={onAdd}
                disabled={!p.inStock}
                className={cn(
                  "group flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors btn-shimmer",
                  added
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground text-background hover:bg-foreground/90",
                  !p.inStock && "opacity-50 cursor-not-allowed"
                )}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart · {formatKsh(p.price * qty)}
                  </>
                )}
              </button>
            </div>

            {/* Trust row */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, title: "Fast delivery", desc: "Same-day Nairobi" },
                { icon: RotateCcw, title: "7-day returns", desc: "No questions" },
                { icon: ShieldCheck, title: `${p.warrantyMonths ?? 12}-month warranty`, desc: getCondition(p.condition).label },
              ].map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                >
                  <t.icon className="h-4 w-4 text-accent mx-auto" strokeWidth={1.5} />
                  <div className="mt-1.5 text-xs font-medium text-foreground">{t.title}</div>
                  <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Features | Specs | Reviews */}
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto no-scrollbar">
            {([
              { v: "features", label: "Features" },
              { v: "specs", label: "Specifications" },
              { v: "reviews", label: `Reviews (${reviews.length})` },
            ] as const).map((t) => (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                  tab === t.v
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "features" && (
            <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl">
              {p.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="text-sm text-foreground leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "specs" && (
            <div className="reveal max-w-3xl">
              <dl className="divide-y divide-border border-y border-border">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 py-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pt-0.5">
                      {k}
                    </dt>
                    <dd className="col-span-2 text-sm text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {tab === "reviews" && (
            <div className="reveal max-w-4xl">
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((r) => (
                    <article
                      key={r.id}
                      className="p-5 rounded-xl border border-border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground font-display text-xs font-medium">
                          {r.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{r.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.role} · {r.location}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, s) => (
                            <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                      <h4 className="mt-3 font-display text-base text-foreground">{r.title}</h4>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        &ldquo;{r.body}&rdquo;
                      </p>
                      {r.verified && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent">
                          <Check className="h-3 w-3" /> Verified purchase
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Long description */}
        <div className="mt-16 md:mt-24 max-w-3xl">
          <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">
            About the {p.name}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            {p.description}
          </p>
        </div>

        {/* Related products */}
        {p.related && p.related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-foreground tracking-tight">
                You might also like
              </h2>
              <button
                onClick={() =>
                  navigate(
                    p.category?.slug
                      ? { view: "shop", query: { category: p.category.slug } }
                      : { view: "shop" }
                  )
                }
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                More in {p.category?.name}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {p.related.map((rel) => (
                <RelatedCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const { navigate } = useViewRouter();
  return (
    <button
      onClick={() => navigate({ view: "product", slug: product.slug })}
      className="group block w-full text-left rounded-xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(140deg, ${product.accent}22 0%, ${product.accent}10 50%, transparent 100%)`,
          }}
        />
        <ProductImage
          imageUrl={product.imageUrl}
          shape={product.shape}
          accent={product.accent}
          alt={product.name}
          className="absolute inset-0 w-full h-full"
          fit="contain"
        />
      </div>
      <div className="p-3">
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {product.brand?.name}
        </div>
        <h3 className="mt-1 font-display text-sm text-foreground tracking-tight leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-2 num-display text-sm text-foreground font-medium">
          {formatKsh(product.price)}
        </div>
      </div>
    </button>
  );
}
