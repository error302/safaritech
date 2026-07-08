"use client";

import * as React from "react";
import { Hero } from "./hero";
import { TrustStrip } from "./trust-strip";
import { BrandMarquee } from "./brand-marquee";
import { Collections } from "./collections";
import { FeaturedProducts } from "./featured-products";
import { Brands } from "./brands";
import { Process } from "./process";
import { Features } from "./features";
import { Stats } from "./stats";
import { Testimonials } from "./testimonials";
import { Newsletter } from "./newsletter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Product, Brand, Category } from "./types";

interface HomeData {
  featured: Product[];
  brands: Brand[];
  categories: Category[];
}

export function HomeView() {
  useScrollReveal();
  const [data, setData] = React.useState<HomeData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/products?featured=true&take=8", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/brands", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([feat, brandRes, catRes]) => {
        if (!cancelled) {
          setData({
            featured: feat.products ?? [],
            brands: brandRes.brands ?? [],
            categories: catRes.categories ?? [],
          });
        }
      })
      .catch((e) => console.error("HomeView load failed:", e))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-trigger reveal whenever data arrives (newly rendered elements need observation)
  React.useEffect(() => {
    if (!loading) {
      // Small delay to let DOM settle, then add is-visible to any .reveal not yet observed
      const t = setTimeout(() => {
        const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
        els.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
            el.classList.add("is-visible");
          }
        });
      }, 60);
      return () => clearTimeout(t);
    }
  }, [loading, data]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <BrandMarquee />
      <Collections categories={data?.categories ?? []} loading={loading} />
      <FeaturedProducts products={data?.featured ?? []} loading={loading} />
      <Brands brands={data?.brands ?? []} loading={loading} />
      <Process />
      <Features />
      <Stats />
      <Testimonials />
      <Newsletter />
    </>
  );
}
