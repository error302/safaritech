"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { useViewRouter } from "./view-router";
import { Brand } from "./types";

interface Props {
  brands: Brand[];
  loading?: boolean;
}

export function Brands({ brands, loading }: Props) {
  const { navigate } = useViewRouter();

  return (
    <section id="brands" className="py-20 md:py-28 bg-secondary/30 border-y border-border">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left — heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="reveal">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Shop by brand
              </div>
              <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4vw,3rem)] leading-[1.05] mt-3 font-medium">
                The brands
                <br />
                <span className="italic font-normal text-accent">you trust.</span>
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-md">
                Direct partnerships with the world&apos;s leading manufacturers.
                Every product ships with original accessories, full warranty,
                and authentic serial verification.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <button
                  onClick={() => navigate({ view: "shop" })}
                  className="group inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
                >
                  Browse all brands
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6 max-w-sm">
                <div>
                  <div className="num-display text-2xl text-foreground font-medium">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">Authentic products</div>
                </div>
                <div>
                  <div className="num-display text-2xl text-foreground font-medium">0.1%</div>
                  <div className="text-xs text-muted-foreground mt-1">Warranty claim rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — brand grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl border border-border bg-card animate-pulse h-24"
                    />
                  ))
                : brands.map((b, i) => (
                    <BrandCard
                      key={b.id}
                      brand={b}
                      index={i}
                      onClick={() =>
                        navigate({ view: "shop", query: { brand: b.slug } })
                      }
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandCard({
  brand,
  index,
  onClick,
}: {
  brand: Brand;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="reveal group relative flex w-full items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-[var(--shadow-soft)] transition-all duration-500 text-left"
      data-delay={(index % 3) * 60}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg md:text-xl text-foreground tracking-tight">
            {brand.name}
          </span>
          {brand.popular && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-accent font-mono">
              Popular
            </span>
          )}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{brand.category}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-500 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </button>
  );
}
