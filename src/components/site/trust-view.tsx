"use client";

import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Features } from "./features";
import { Process } from "./process";
import { Testimonials } from "./testimonials";
import { TrustStrip } from "./trust-strip";
import { useViewRouter } from "./view-router";

export function TrustView() {
  const { navigate } = useViewRouter();
  useScrollReveal();

  return (
    <div className="pt-24 md:pt-32">
      <section className="pb-14 md:pb-20">
        <div className="container-premium">
          <div className="max-w-3xl reveal">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Why Safaritech
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-tightest text-foreground">
              Buy with confidence.
              <br />
              <span className="italic font-normal text-accent">Shop without distraction.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Everything about authenticity, payment, delivery, returns, and warranty lives here,
              away from the product-first storefront.
            </p>
            <button
              onClick={() => navigate({ view: "shop" })}
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Browse products
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      <TrustStrip />
      <Features />
      <Process />
      <Testimonials />
    </div>
  );
}
