"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Collection {
  name: string;
  tagline: string;
  count: string;
  accent: string;
  shape: "phone" | "laptop" | "audio" | "gaming" | "watch" | "accessory";
}

const COLLECTIONS: Collection[] = [
  {
    name: "Smartphones",
    tagline: "Flagship & mid-tier, curated for Kenya.",
    count: "320+ devices",
    accent: "oklch(0.40 0.08 165)",
    shape: "phone",
  },
  {
    name: "Laptops",
    tagline: "Work, create, and play — Mac to Windows.",
    count: "180+ models",
    accent: "oklch(0.55 0.10 75)",
    shape: "laptop",
  },
  {
    name: "Audio",
    tagline: "Studio-grade headphones, earbuds & speakers.",
    count: "240+ items",
    accent: "oklch(0.55 0.06 240)",
    shape: "audio",
  },
  {
    name: "Gaming",
    tagline: "Consoles, controllers, and the games that matter.",
    count: "90+ products",
    accent: "oklch(0.65 0.15 25)",
    shape: "gaming",
  },
  {
    name: "Wearables",
    tagline: "Smartwatches and fitness companions.",
    count: "60+ styles",
    accent: "oklch(0.50 0.10 200)",
    shape: "watch",
  },
  {
    name: "Accessories",
    tagline: "The essentials — cases, cables, chargers, more.",
    count: "500+ items",
    accent: "oklch(0.45 0.08 145)",
    shape: "accessory",
  },
];

export function Collections() {
  return (
    <section id="collections" className="py-20 md:py-28">
      <div className="container-premium">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="reveal max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The collection
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Six categories.
              <br />
              <span className="italic font-normal text-accent">Endless possibility.</span>
            </h2>
          </div>
          <div className="reveal" data-delay="120">
            <Link
              href="#brands"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              View full catalogue
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {COLLECTIONS.map((c, i) => (
            <CollectionCard key={c.name} collection={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  return (
    <Link
      href="#brands"
      className="reveal group relative block rounded-2xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 3) * 80}
    >
      {/* Top — visual */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(140deg, ${collection.accent}18 0%, ${collection.accent}08 60%, transparent 100%)`,
          }}
        />
        {/* Hairline grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <DeviceShape shape={collection.shape} accent={collection.accent} />

        {/* count chip */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70">
            {collection.count}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-sm text-foreground opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Bottom — copy */}
      <div className="p-5 md:p-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-foreground tracking-tight">
            {collection.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {collection.tagline}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
          0{index + 1}
        </span>
      </div>
    </Link>
  );
}

function DeviceShape({ shape, accent }: { shape: Collection["shape"]; accent: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g style={{ color: accent }}>
        {shape === "phone" && (
          <>
            <rect x="85" y="30" width="30" height="80" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="89" y="38" width="22" height="60" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="104" r="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
          </>
        )}
        {shape === "laptop" && (
          <>
            <rect x="60" y="40" width="80" height="50" rx="4" fill={accent} fillOpacity="0.85" />
            <rect x="66" y="46" width="68" height="38" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <rect x="50" y="90" width="100" height="6" rx="3" fill={accent} fillOpacity="0.6" />
            <rect x="92" y="90" width="16" height="3" rx="1.5" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
          </>
        )}
        {shape === "audio" && (
          <>
            <circle cx="80" cy="80" r="22" fill={accent} fillOpacity="0.85" />
            <circle cx="80" cy="80" r="10" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="130" cy="60" r="18" fill={accent} fillOpacity="0.7" />
            <circle cx="130" cy="60" r="8" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
            <path d="M75 60 Q 80 50 90 50" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}
        {shape === "gaming" && (
          <>
            <path
              d="M50 60 Q 50 50 65 50 L 135 50 Q 150 50 150 65 L 150 80 Q 150 90 140 90 L 130 90 Q 125 90 120 85 L 110 80 L 90 80 L 80 85 Q 75 90 70 90 L 60 90 Q 50 90 50 75 Z"
              fill={accent}
              fillOpacity="0.85"
            />
            <circle cx="80" cy="68" r="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="120" cy="68" r="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="100" cy="65" r="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
          </>
        )}
        {shape === "watch" && (
          <>
            <rect x="85" y="50" width="30" height="40" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="80" y="58" width="40" height="4" rx="2" fill={accent} fillOpacity="0.6" />
            <rect x="80" y="78" width="40" height="4" rx="2" fill={accent} fillOpacity="0.6" />
            <rect x="92" y="56" width="16" height="28" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="70" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.8" />
          </>
        )}
        {shape === "accessory" && (
          <>
            <rect x="70" y="55" width="60" height="40" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="76" y="61" width="48" height="28" rx="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="75" r="8" fill={accent} fillOpacity="0.9" />
            <circle cx="100" cy="75" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.8" />
            <line x1="55" y1="75" x2="68" y2="75" stroke={accent} strokeWidth="3" strokeLinecap="round" />
            <line x1="132" y1="75" x2="145" y2="75" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
