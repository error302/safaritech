"use client";

import * as React from "react";
import { Hero } from "./hero";
import { BrandMarquee } from "./brand-marquee";
import { Collections } from "./collections";
import { FeaturedProducts } from "./featured-products";
import { DealsRow } from "./deals-row";
import { NewArrivals } from "./new-arrivals";
import { Brands } from "./brands";
import { Newsletter } from "./newsletter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Product, Brand, Category } from "./types";

interface HomeData {
  featured: Product[];
  newArrivals: Product[];
  deals: Product[];
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
      fetch("/api/products?sort=newest&take=8", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/shop?sort=newest&pageSize=24", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/brands", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/categories", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([feat, newArr, shopRes, brandRes, catRes]) => {
        if (!cancelled) {
          setData({
            featured: feat.products ?? [],
            newArrivals: (newArr.products ?? []).filter(
              (p: Product) => !p.featured
            ),
            deals: shopRes.products ?? [],
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

  // Re-trigger reveal whenever data arrives
  React.useEffect(() => {
    if (!loading) {
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
      <Collections categories={data?.categories ?? []} loading={loading} />
      <FeaturedProducts products={data?.featured ?? []} loading={loading} />
      <DealsRow products={data?.deals ?? []} loading={loading} />
      <NewArrivals products={data?.newArrivals ?? []} loading={loading} />
      <Brands brands={data?.brands ?? []} loading={loading} />
      <BrandMarquee />
      <Newsletter />
    </>
  );
}
