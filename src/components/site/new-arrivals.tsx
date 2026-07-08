"use client";

import * as React from "react";
import { ArrowRight, Star, Plus, ArrowUpRight } from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { ProductImage } from "./product-image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Product } from "./types";

interface Props {
  products: Product[];
  loading?: boolean;
}

/**
 * "Just landed" — newest non-featured products shown in a responsive grid.
 * Replaces the heavy testimonials section to give more catalog surface area.
 */
export function NewArrivals({ products, loading }: Props) {
  const { navigate } = useViewRouter();
  useScrollReveal([loading, products]);

  return (
    <section className="py-20 md:py-28">
      <div className="container-premium">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="reveal max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Just landed
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Fresh stock.
              <br />
              <span className="italic font-normal text-accent">Priced for Kenya.</span>
            </h2>
          </div>
          <div className="reveal" data-delay="120">
            <button
              onClick={() => navigate({ view: "shop", query: { sort: "newest" } })}
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              View all new arrivals
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">No new arrivals yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {products.slice(0, 8).map((p, i) => (
              <ArrivalCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArrivalCard({ product, index }: { product: Product; index: number }) {
  const { navigate } = useViewRouter();
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="reveal group relative rounded-xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 4) * 60}
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
