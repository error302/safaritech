"use client";

import * as React from "react";
import { Filter, X, Search, ChevronDown, ArrowUpRight, Star, Plus, SlidersHorizontal } from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { ProductImage } from "./product-image";
import { Product, Brand, Category } from "./types";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface ShopResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facets: {
    brands: Pick<Brand, "name" | "slug" | "popular" | "category" | "accent">[];
    categories: Category[];
    priceRange: { min: number; max: number };
  };
}

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
  { value: "rating", label: "Top rated" },
] as const;

export function ShopView({ initialQuery }: { initialQuery?: Record<string, string> }) {
  const { navigate } = useViewRouter();
  const [data, setData] = React.useState<ShopResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  useScrollReveal([loading, data]);

  // Local filter state, initialised from URL hash query
  const [search, setSearch] = React.useState(initialQuery?.q ?? "");
  const [category, setCategory] = React.useState<string | undefined>(initialQuery?.category);
  const [brand, setBrand] = React.useState<string | undefined>(initialQuery?.brand);
  const [sort, setSort] = React.useState<string>("newest");
  const [minPrice, setMinPrice] = React.useState<number | undefined>();
  const [maxPrice, setMaxPrice] = React.useState<number | undefined>();
  const [showFilters, setShowFilters] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);

  // Build query string for fetch
  const buildQuery = React.useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (sort) params.set("sort", sort);
    if (minPrice !== undefined) params.set("min", String(minPrice));
    if (maxPrice !== undefined) params.set("max", String(maxPrice));
    params.set("pageSize", "24");
    return params.toString();
  }, [search, category, brand, sort, minPrice, maxPrice]);

  // Debounced fetch
  React.useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/shop?${buildQuery()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [buildQuery]);

  const facets = data?.facets;
  const hasActiveFilters = !!(category || brand || search || minPrice || maxPrice);

  const clearAll = () => {
    setSearch("");
    setCategory(undefined);
    setBrand(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  return (
    <div className="pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="container-premium">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-10 md:mb-14">
          <div className="reveal">
            <button
              onClick={() => navigate({ view: "home" })}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              ← Back to home
            </button>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The shop
            </div>
            <h1 className="font-display tracking-tightest text-foreground text-[clamp(2rem,5vw,4rem)] leading-[1.05] mt-3 font-medium">
              The full catalogue.
              <br />
              <span className="italic font-normal text-accent">Curated, authenticated.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
              Every device ships from our Westlands fulfilment centre with original
              accessories and a one-year warranty. Filter by brand, category, or budget.
            </p>
          </div>
        </div>

        {/* Search + sort bar */}
        <div className="reveal flex flex-col md:flex-row gap-3 mb-8" data-delay="100">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search iPhone, MacBook, headphones…"
              className="w-full h-11 pl-11 pr-4 rounded-full bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="md:hidden inline-flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-card text-sm font-medium"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-mono">
                  !
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none h-11 pl-4 pr-9 rounded-full border border-border bg-card text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer"
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="md:hidden mb-8 p-5 rounded-2xl border border-border bg-card space-y-5 reveal">
            <FilterGroup
              label="Category"
              options={(facets?.categories ?? []).map((c) => ({ value: c.slug, label: c.name }))}
              value={category}
              onChange={(v) => setCategory(v)}
            />
            <FilterGroup
              label="Brand"
              options={(facets?.brands ?? []).map((b) => ({ value: b.slug, label: b.name }))}
              value={brand}
              onChange={(v) => setBrand(v)}
            />
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Layout: sidebar + grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Sidebar */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-28 space-y-7">
              <FilterHeader onClear={hasActiveFilters ? clearAll : undefined} />

              <FilterGroup
                label="Category"
                options={(facets?.categories ?? []).map((c) => ({ value: c.slug, label: c.name }))}
                value={category}
                onChange={(v) => setCategory(v)}
              />
              <FilterGroup
                label="Brand"
                options={(facets?.brands ?? []).map((b) => ({ value: b.slug, label: b.name }))}
                value={brand}
                onChange={(v) => setBrand(v)}
              />

              {facets?.priceRange && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                    Price range
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder={`Min ${formatKsh(facets.priceRange.min)}`}
                      value={minPrice ?? ""}
                      onChange={(e) =>
                        setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                    <input
                      type="number"
                      placeholder={`Max ${formatKsh(facets.priceRange.max)}`}
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full h-9 px-3 rounded-lg bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="md:col-span-9 lg:col-span-9">
            {/* Active filter chips + count */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="text-xs text-muted-foreground">
                {loading ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  <span>
                    <span className="font-medium text-foreground">{data?.total ?? 0}</span>{" "}
                    {data?.total === 1 ? "product" : "products"}
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  {category && (
                    <FilterChip
                      label={facets?.categories.find((c) => c.slug === category)?.name ?? category}
                      onRemove={() => setCategory(undefined)}
                    />
                  )}
                  {brand && (
                    <FilterChip
                      label={facets?.brands.find((b) => b.slug === brand)?.name ?? brand}
                      onRemove={() => setBrand(undefined)}
                    />
                  )}
                  {search && (
                    <FilterChip label={`"${search}"`} onRemove={() => setSearch("")} />
                  )}
                </div>
              )}
            </div>

            {/* Grid */}
            {error ? (
              <div className="p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center">
                <p className="text-sm text-destructive">{error}</p>
                <button onClick={() => location.reload()} className="mt-3 text-xs underline">
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="aspect-square bg-secondary/40 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-20 bg-secondary/60 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-secondary/60 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-secondary/40 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (data?.products.length ?? 0) === 0 ? (
              <div className="py-20 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border text-muted-foreground mb-4">
                  <Search className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl text-foreground">No products match</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Try clearing filters or searching for something else.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-5 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {data!.products.map((p, i) => (
                  <ShopProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterHeader({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-display text-base text-foreground tracking-tight flex items-center gap-2">
        <Filter className="h-4 w-4" strokeWidth={1.5} />
        Filters
      </h3>
      {onClear && (
        <button
          onClick={onClear}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
        {label}
      </h3>
      <div className="space-y-1.5">
        <button
          onClick={() => onChange(undefined)}
          className={cn(
            "block w-full text-left text-sm py-1.5 transition-colors",
            !value ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
          )}
        >
          All {label.toLowerCase()}
        </button>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(value === o.value ? undefined : o.value)}
            className={cn(
              "block w-full text-left text-sm py-1.5 transition-colors",
              value === o.value
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {value === o.value && <span className="text-accent mr-1">→</span>}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card pl-3 pr-1.5 py-1 text-xs font-medium text-foreground">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-secondary transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function ShopProductCard({ product, index }: { product: Product; index: number }) {
  const { navigate } = useViewRouter();
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="reveal group relative rounded-xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 6) * 40}
    >
      <button
        onClick={() => navigate({ view: "product", slug: product.slug })}
        className="block w-full text-left"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-square overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
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
          {product.tag && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground/80">
              {product.tag}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest">
              −{discount}%
            </span>
          )}
        </div>
      </button>

      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate({ view: "product", slug: product.slug })}
            className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors truncate"
          >
            {product.brand?.name}
          </button>
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
            <Star className="h-2.5 w-2.5 fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating}</span>
          </div>
        </div>

        <button
          onClick={() => navigate({ view: "product", slug: product.slug })}
          className="mt-1 block w-full text-left"
        >
          <h3 className="font-display text-sm md:text-base text-foreground tracking-tight leading-tight line-clamp-2">
            {product.name}
          </h3>
        </button>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="num-display text-sm md:text-base text-foreground font-medium truncate">
              {formatKsh(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through hidden sm:inline">
                {formatKsh(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                brand: product.brand?.name ?? "",
                price: product.price,
                shape: product.shape,
                accent: product.accent,
              })
            }
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
