"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  tag?: string;
  accent: string;
  shape: "phone" | "laptop" | "audio" | "watch" | "gaming" | "accessory";
}

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "Smartphones",
    price: 192000,
    originalPrice: 210000,
    rating: 4.9,
    reviews: 1240,
    tag: "Best seller",
    accent: "oklch(0.40 0.08 165)",
    shape: "phone",
  },
  {
    id: "p2",
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptops",
    price: 245000,
    rating: 4.9,
    reviews: 642,
    tag: "New arrival",
    accent: "oklch(0.55 0.10 75)",
    shape: "laptop",
  },
  {
    id: "p3",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    price: 165000,
    originalPrice: 178000,
    rating: 4.8,
    reviews: 980,
    tag: "Deal",
    accent: "oklch(0.55 0.06 240)",
    shape: "phone",
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    price: 52000,
    rating: 4.9,
    reviews: 2150,
    tag: "Editor's pick",
    accent: "oklch(0.65 0.15 25)",
    shape: "audio",
  },
  {
    id: "p5",
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Wearables",
    price: 68000,
    rating: 4.8,
    reviews: 430,
    accent: "oklch(0.50 0.10 200)",
    shape: "watch",
  },
  {
    id: "p6",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Gaming",
    price: 89000,
    rating: 4.9,
    reviews: 1820,
    tag: "Restocked",
    accent: "oklch(0.45 0.08 145)",
    shape: "gaming",
  },
  {
    id: "p7",
    name: "JBL Charge 5",
    brand: "JBL",
    category: "Audio",
    price: 28000,
    originalPrice: 32000,
    rating: 4.7,
    reviews: 1560,
    accent: "oklch(0.40 0.08 165)",
    shape: "audio",
  },
  {
    id: "p8",
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    category: "Laptops",
    price: 195000,
    rating: 4.7,
    reviews: 312,
    accent: "oklch(0.55 0.10 75)",
    shape: "laptop",
  },
];

function formatKsh(n: number) {
  return "KSh " + n.toLocaleString("en-KE");
}

export function FeaturedProducts() {
  const trackRef = React.useRef<HTMLDivElement>(null);

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
            <Link
              href="#collections"
              className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground ml-2 link-underline"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel — bleed slightly outside container */}
      <div className="container-premium">
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1"
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article
      className="reveal group relative shrink-0 w-[78vw] sm:w-[320px] lg:w-[340px] snap-start rounded-2xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 4) * 60}
    >
      {/* Visual */}
      <div className="relative aspect-square overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(140deg, ${product.accent}22 0%, ${product.accent}10 50%, transparent 100%)`,
          }}
        />
        {/* grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <ProductShape shape={product.shape} accent={product.accent} />

        {/* Top row */}
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

        {/* Add-to-cart quick action */}
        <button
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Meta */}
      <div className="p-5 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {product.brand} · {product.category}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>· {product.reviews.toLocaleString()}</span>
          </div>
        </div>

        <h3 className="mt-2 font-display text-lg text-foreground tracking-tight">
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="num-display text-xl text-foreground font-medium">
            {formatKsh(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatKsh(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function ProductShape({ shape, accent }: { shape: Product["shape"]; accent: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g style={{ color: accent }}>
        {shape === "phone" && (
          <>
            <rect x="75" y="40" width="50" height="120" rx="10" fill={accent} fillOpacity="0.85" />
            <rect x="82" y="52" width="36" height="92" rx="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.45" />
            <circle cx="100" cy="152" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <rect x="92" y="46" width="16" height="3" rx="1.5" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
          </>
        )}
        {shape === "laptop" && (
          <>
            <rect x="50" y="60" width="100" height="65" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="58" y="68" width="84" height="48" rx="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.45" />
            <rect x="38" y="125" width="124" height="8" rx="4" fill={accent} fillOpacity="0.7" />
            <rect x="92" y="125" width="16" height="4" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
            <circle cx="100" cy="92" r="6" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
          </>
        )}
        {shape === "audio" && (
          <>
            <ellipse cx="100" cy="110" rx="50" ry="44" fill={accent} fillOpacity="0.85" />
            <ellipse cx="100" cy="110" rx="34" ry="30" fill="oklch(0.18 0.02 240)" fillOpacity="0.4" />
            <ellipse cx="100" cy="110" rx="14" ry="12" fill={accent} fillOpacity="0.7" />
            <ellipse cx="100" cy="110" rx="5" ry="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <path d="M60 100 Q 50 70 80 60" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M140 100 Q 150 70 120 60" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {shape === "watch" && (
          <>
            <rect x="78" y="60" width="44" height="60" rx="10" fill={accent} fillOpacity="0.85" />
            <rect x="70" y="72" width="60" height="6" rx="3" fill={accent} fillOpacity="0.6" />
            <rect x="70" y="102" width="60" height="6" rx="3" fill={accent} fillOpacity="0.6" />
            <rect x="86" y="68" width="28" height="44" rx="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.45" />
            <circle cx="100" cy="90" r="6" fill="oklch(0.96 0.005 95)" fillOpacity="0.8" />
            <line x1="100" y1="90" x2="100" y2="82" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="100" y1="90" x2="106" y2="90" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        {shape === "gaming" && (
          <>
            <path
              d="M40 80 Q 40 65 60 65 L 140 65 Q 160 65 160 85 L 160 105 Q 160 120 145 120 L 130 120 Q 122 120 115 112 L 105 105 L 95 105 L 85 112 Q 78 120 70 120 L 55 120 Q 40 120 40 100 Z"
              fill={accent}
              fillOpacity="0.85"
            />
            <circle cx="75" cy="90" r="6" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="125" cy="90" r="6" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="100" cy="85" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
            <rect x="115" y="105" width="14" height="3" rx="1.5" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
            <rect x="118" y="102" width="8" height="3" rx="1.5" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
          </>
        )}
      </g>
    </svg>
  );
}
