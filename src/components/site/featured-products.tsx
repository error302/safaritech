"use client";

import * as React from "react";
import { ArrowRight, Star, Plus } from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { ProductImage } from "./product-image";
import { Product } from "./types";

interface Props {
  products: Product[];
  loading?: boolean;
}

export function FeaturedProducts({ products, loading }: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const { navigate } = useViewRouter();

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container-premium">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="reveal max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The edit
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              This week&apos;s picks.
              <br />
              <span className="italic font-normal text-accent">Curated by hand.</span>
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
            <button
              onClick={() => navigate({ view: "shop" })}
              className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground ml-2 link-underline"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
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
                  <div className="p-5 space-y-2">
                    <div className="h-3 w-24 bg-secondary/60 rounded animate-pulse" />
                    <div className="h-5 w-40 bg-secondary/60 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-secondary/40 rounded animate-pulse mt-3" />
                  </div>
                </div>
              ))
            : products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { navigate } = useViewRouter();
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="reveal group relative shrink-0 w-[78vw] sm:w-[320px] lg:w-[340px] snap-start rounded-2xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 4) * 60}
    >
      {/* Visual */}
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
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "32px 32px",
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

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {product.tag ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/80">
                {product.tag}
              </span>
            ) : (
              <span />
            )}
            {discount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2 py-1 text-[10px] font-mono uppercase tracking-widest">
                −{discount}%
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Meta */}
      <div className="p-5 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => navigate({ view: "product", slug: product.slug })}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {product.brand?.name} · {product.category?.name}
          </button>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>· {product.reviews.toLocaleString()}</span>
          </div>
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
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
