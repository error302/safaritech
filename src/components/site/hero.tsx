"use client";

import * as React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useViewRouter } from "./view-router";

export function Hero() {
  const { navigate } = useViewRouter();
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden grain">
      {/* Soft ambient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 60rem at 80% -10%, oklch(0.40 0.08 165 / 0.08), transparent 60%), radial-gradient(50rem 50rem at 0% 80%, oklch(0.55 0.10 75 / 0.06), transparent 55%)",
        }}
      />
      {/* Fine grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Left — Editorial copy */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Eyebrow */}
            <div className="reveal flex items-center gap-3 mb-6 md:mb-8">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-accent animate-pulse-soft" />
                <span className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
              </span>
              <span className="text-[11px] md:text-xs uppercase tracking-[0.22em] font-medium text-muted-foreground">
                Kenya&apos;s Premier Electronics Marketplace
              </span>
            </div>

            {/* H1 */}
            <h1 className="reveal font-display tracking-tightest text-foreground text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-medium" data-delay="80">
              <span className="block">Tech that</span>
              <span className="block">moves Kenya,</span>
              <span className="block italic font-normal text-accent">
                curated for the world.
              </span>
            </h1>

            {/* Subhead */}
            <p className="reveal mt-7 md:mt-9 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed" data-delay="180">
              Smartphones, laptops, audio and gaming gear from Apple, Samsung, Sony
              and twenty-plus authorized brands. Pay with M-Pesa. Delivered, nationwide,
              with a one-year warranty on every device.
            </p>

            {/* CTAs */}
            <div className="reveal mt-9 md:mt-10 flex flex-col sm:flex-row gap-3 sm:items-center" data-delay="260">
              <button
                onClick={() => navigate({ view: "shop" })}
                className={cn(
                  "group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full",
                  "bg-foreground text-background hover:bg-foreground/90 transition-all",
                  "btn-shimmer text-sm font-medium"
                )}
              >
                Explore the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate({ view: "shop" })}
                className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full border border-border bg-card/40 hover:bg-card transition-all text-sm font-medium text-foreground"
              >
                Shop by brand
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Mini stat strip */}
            <div className="reveal mt-12 md:mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-lg border-t border-border pt-6" data-delay="340">
              {[
                { num: "50K+", label: "Customers served" },
                { num: "20+", label: "Authorized brands" },
                { num: "1 yr", label: "Warranty, every device" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="num-display text-2xl md:text-3xl font-medium text-foreground">
                    {s.num}
                  </div>
                  <div className="mt-1 text-[11px] md:text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Editorial visual */}
          <div className="lg:col-span-5 xl:col-span-5 reveal" data-delay="200">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none lg:ml-auto">
      {/* Primary editorial card */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border bg-card shadow-[var(--shadow-lift)]">
        {/* Gradient field */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, oklch(0.96 0.01 95) 0%, oklch(0.92 0.02 165) 50%, oklch(0.85 0.05 165) 100%)",
          }}
        />
        {/* Inner shape — abstract device silhouette */}
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* horizon line */}
          <line x1="40" y1="380" x2="360" y2="380" stroke="oklch(0.30 0.05 165 / 0.25)" strokeWidth="1" />

          {/* abstract phone */}
          <rect x="140" y="120" width="120" height="240" rx="22" fill="oklch(0.18 0.02 240 / 0.85)" />
          <rect x="148" y="132" width="104" height="200" rx="6" fill="oklch(0.65 0.10 165 / 0.4)" />
          <circle cx="200" cy="346" r="4" fill="oklch(0.96 0.005 95 / 0.5)" />

          {/* screen content */}
          <circle cx="200" cy="180" r="22" fill="oklch(0.96 0.005 95 / 0.85)" />
          <rect x="170" y="220" width="60" height="6" rx="3" fill="oklch(0.96 0.005 95 / 0.7)" />
          <rect x="178" y="234" width="44" height="4" rx="2" fill="oklch(0.96 0.005 95 / 0.5)" />

          {/* earbuds shape */}
          <circle cx="80" cy="380" r="14" fill="oklch(0.18 0.02 240 / 0.7)" />
          <circle cx="320" cy="380" r="14" fill="oklch(0.18 0.02 240 / 0.7)" />
          <rect x="76" y="394" width="8" height="40" rx="4" fill="oklch(0.18 0.02 240 / 0.5)" />
          <rect x="316" y="394" width="8" height="40" rx="4" fill="oklch(0.18 0.02 240 / 0.5)" />

          {/* abstract watch */}
          <rect x="46" y="120" width="56" height="80" rx="10" fill="oklch(0.18 0.02 240 / 0.85)" />
          <rect x="42" y="135" width="64" height="6" rx="3" fill="oklch(0.18 0.02 240 / 0.6)" />
          <rect x="42" y="180" width="64" height="6" rx="3" fill="oklch(0.18 0.02 240 / 0.6)" />
          <circle cx="74" cy="160" r="14" fill="oklch(0.55 0.10 75 / 0.8)" />

          {/* caption markers */}
          <line x1="40" y1="50" x2="100" y2="50" stroke="oklch(0.30 0.05 165 / 0.4)" strokeWidth="1" />
          <text x="40" y="42" fontFamily="ui-monospace, monospace" fontSize="9" fill="oklch(0.30 0.05 165 / 0.7)" letterSpacing="1">
            VOL.07 — 2026
          </text>
        </svg>

        {/* corner labels */}
        <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
          Edition · Nairobi
        </div>
        <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
          N°01
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="font-display text-lg text-foreground leading-tight">The Curated Edit</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-foreground/60 mt-0.5">
              Spring/Summer 2026
            </div>
          </div>
          <button
            onClick={() => navigate({ view: "product", slug: "iphone-15-pro" })}
            aria-label="View featured product"
            className="h-8 w-8 rounded-full bg-foreground text-background inline-flex items-center justify-center hover:bg-foreground/90 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating price card */}
      <div className="absolute -left-2 md:-left-6 top-1/3 -translate-y-1/2 hidden sm:block">
        <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md px-4 py-3 shadow-[var(--shadow-soft)] w-44">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            Featured
          </div>
          <div className="mt-1 text-sm font-medium text-foreground leading-tight">
            iPhone 15 Pro · 256GB
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="num-display text-lg text-foreground">KSh 192,000</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-mono uppercase tracking-wider">In stock · M-Pesa ready</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -right-2 md:-right-5 bottom-8">
        <div className="rounded-full border border-border bg-background/95 backdrop-blur-md px-4 py-2 shadow-[var(--shadow-soft)] flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">4.9★ Trustpilot</span>
          <span className="text-muted-foreground text-[10px] font-mono">· 12,400 reviews</span>
        </div>
      </div>
    </div>
  );
}
