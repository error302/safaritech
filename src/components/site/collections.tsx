"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { useViewRouter } from "./view-router";
import { DeviceShape } from "./device-shape";
import { Category } from "./types";

interface Props {
  categories: Category[];
  loading?: boolean;
}

export function Collections({ categories, loading }: Props) {
  const { navigate } = useViewRouter();

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
            <button
              onClick={() => navigate({ view: "shop" })}
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
            >
              View full catalogue
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card overflow-hidden"
                >
                  <div className="aspect-[16/11] bg-secondary/40 animate-pulse" />
                  <div className="p-5 md:p-6 space-y-2">
                    <div className="h-5 w-32 bg-secondary/60 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-secondary/40 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : categories.map((c, i) => (
                <CollectionCard
                  key={c.id}
                  category={c}
                  index={i}
                  onClick={() =>
                    navigate({ view: "shop", query: { category: c.slug } })
                  }
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  category,
  index,
  onClick,
}: {
  category: Category;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="reveal group relative block w-full text-left rounded-2xl border border-border bg-card overflow-hidden card-lift hover:shadow-[var(--shadow-lift)]"
      data-delay={(index % 3) * 80}
    >
      {/* Top — visual */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{
            background: `linear-gradient(140deg, ${category.accent}18 0%, ${category.accent}08 60%, transparent 100%)`,
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
        <DeviceShape
          shape={category.shape}
          accent={category.accent}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70">
            {category.count}
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
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {category.tagline}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
          0{index + 1}
        </span>
      </div>
    </button>
  );
}
