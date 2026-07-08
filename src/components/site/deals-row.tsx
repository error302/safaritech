"use client";

import * as React from "react";
import { ArrowRight, Star, Plus, ArrowUpRight, Tag } from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { ProductImage } from "./product-image";
import { ConditionBadge } from "./condition-badge";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Product } from "./types";

interface Props {
  products: Product[];
  loading?: boolean;
}

/**
 * "On sale" — products with an originalPrice (i.e. discounted) shown in a
 * horizontal scroll carousel. Adds another catalog surface to the landing page.
 */
export function DealsRow({ products, loading }: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { navigate } = useViewRouter();
  useScrollReveal([loading, products]);

  const deals = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  };

  if (!loading && deals.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-secondary/30 border-y border-border">
      <div className="container-premium">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="reveal max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
              On sale now
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Honest discounts.
              <br />
              <span className="italic font-normal text-accent">No fake markdowns.</span>
            </h2>
          </div>
          <div className="reveal flex items-center gap-3" data-delay="120">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-premium">
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[78vw] sm:w-[320px] lg:w-[340px] snap-start rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <div className="aspect-square bg-secondary/40 animate-pulse" />
                </div>
              ))
            : deals.map((p, i) => (
                <DealCard key={p.id} product={p} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ product, index }: { product: Product; index: number }) {
  const { navigate } = useViewRouter();
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const savings = (product.originalPrice ?? 0) - product.price;

  return (
    <article
      className="reveal group relative shrink-0 w-[78vw] sm:w-[320px] lg:w-[340px] snap-start rounded-2xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
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
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest">
            −{discount}%
          </span>
        </div>
      </button>

      <div className="p-5 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate({ view: "product", slug: product.slug })}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {product.brand?.name} · {product.category?.name}
          </button>
          <ConditionBadge condition={product.condition} size="sm" />
        </div>

        <button
          onClick={() => navigate({ view: "product", slug: product.slug })}
          className="mt-2 block w-full text-left"
        >
          <h3 className="font-display text-lg text-foreground tracking-tight">
            {product.name}
          </h3>
        </button>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="num-display text-xl text-foreground font-medium">
              {formatKsh(product.price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatKsh(product.originalPrice ?? 0)}
            </span>
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-accent">
          Save {formatKsh(savings)}
        </div>
      </div>
    </article>
  );
}
