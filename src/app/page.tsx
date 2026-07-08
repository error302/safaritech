"use client";

import * as React from "react";
import { SiteNavbar } from "@/components/site/site-navbar";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { BrandMarquee } from "@/components/site/brand-marquee";
import { Collections } from "@/components/site/collections";
import { FeaturedProducts } from "@/components/site/featured-products";
import { Brands } from "@/components/site/brands";
import { Process } from "@/components/site/process";
import { Features } from "@/components/site/features";
import { Stats } from "@/components/site/stats";
import { Testimonials } from "@/components/site/testimonials";
import { Newsletter } from "@/components/site/newsletter";
import { SiteFooter } from "@/components/site/site-footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function Home() {
  useScrollReveal();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <BrandMarquee />
        <Collections />
        <FeaturedProducts />
        <Brands />
        <Process />
        <Features />
        <Stats />
        <Testimonials />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  );
}
