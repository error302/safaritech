"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import BrandLogo from "@/components/BrandLogo";

export default function BrandShowcase() {
  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neon mb-2">
              Authorized brands
            </p>
            <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-2">
              Shop by Brand
            </h2>
            <p className="text-sm text-gray-400 max-w-lg">
              Official products from global leaders — curated for Kenya with M-Pesa checkout.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-1 text-neon font-bold hover:gap-2 transition-all shrink-0"
          >
            All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: horizontal snap scroll — optimized for narrow phones (e.g. S22) */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="snap-start shrink-0 w-[108px] flex flex-col items-center gap-3 p-4 rounded-2xl border border-safariborder bg-safarigray/80 backdrop-blur-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-xl bg-safaridark border border-safariborder/80 flex items-center justify-center p-2.5">
                  <BrandLogo brand={brand} size={40} />
                </div>
                <span className="text-xs font-semibold text-gray-200 text-center leading-tight">
                  {brand.name}
                </span>
                {brand.popular && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neon">
                    Popular
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: premium grid */}
        <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-safariborder bg-safarigray hover:border-neon/30 hover:shadow-[0_0_30px_-12px_rgba(0,255,159,0.35)] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-xl bg-safaridark border border-safariborder flex items-center justify-center p-3 group-hover:scale-105 transition-transform">
                <BrandLogo brand={brand} size={48} />
              </div>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/shop"
          className="md:hidden mt-6 flex items-center justify-center gap-1 text-sm font-bold text-neon"
        >
          Browse all brands <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
