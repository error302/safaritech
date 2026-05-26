"use client";

import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import ProductCard from "@/components/ProductCard";
import BrandShowcase from "@/components/BrandShowcase";
import PaymentBadges from "@/components/PaymentBadges";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  ChevronRight,
  Zap,
  Watch,
  Tag,
  PackageOpen,
  CreditCard,
  Clock,
  Star,
  Heart,
  Package,
  Flame,
  Monitor,
  Cpu,
  Mouse,
  Keyboard,
  Speaker,
  Battery,
  Camera,
  Tv,
  Wifi,
  HardDrive,
  Home,
  Tablet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map icon name strings to actual Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  Watch,
  Tablet,
  Camera,
  Tv,
  Wifi,
  HardDrive,
  Home,
  Package,
  Monitor,
  Cpu,
  Mouse,
  Keyboard,
  Speaker,
  Battery,
  Zap,
  Tag,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Clock,
  Star,
  Heart,
  Flame,
};

// Default trust badges (used when no settings are loaded yet)
const defaultTrustBadges = [
  { title: "M-Pesa & PayPal", desc: "Instant & secure", icon: "Smartphone" },
  { title: "Free Delivery", desc: "Nairobi wide", icon: "Truck" },
  { title: "7-Day Returns", desc: "No questions asked", icon: "RotateCcw" },
  { title: "1-Year Warranty", desc: "On all devices", icon: "ShieldCheck" },
];

// Default categories (used when no DB categories exist yet)
const defaultCategories = [
  { slug: "smartphones", name: "Phones", description: "Latest smartphones", iconName: "Smartphone", gradient: "from-blue-600 to-blue-400" },
  { slug: "laptops", name: "Laptops", description: "Work & play", iconName: "Laptop", gradient: "from-purple-600 to-purple-400" },
  { slug: "gaming", name: "Gaming", description: "Next-gen consoles", iconName: "Gamepad2", gradient: "from-red-600 to-orange-400" },
  { slug: "audio", name: "Audio", description: "Premium sound", iconName: "Headphones", gradient: "from-green-600 to-green-400" },
  { slug: "wearables", name: "Wearables", description: "Smart devices", iconName: "Watch", gradient: "from-yellow-500 to-amber-400" },
  { slug: "accessories", name: "Accessories", description: "Must-have extras", iconName: "Tag", gradient: "from-cyan-600 to-cyan-400" },
];

function parseImages(raw: unknown): string[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw as string);
  } catch {
    return [raw as string];
  }
}

export default function HomePage() {
  const { settings } = useSiteSettings();
  const { data: productsData, isLoading } = trpc.product.getAll.useQuery({ limit: 8 });
  const { data: hotDeals = [] } = trpc.product.getHot.useQuery();
  const { data: dbCategories } = trpc.category.getAll.useQuery();

  const newArrivals = productsData?.products ?? [];
  const hasProducts = newArrivals.length > 0;

  // Hero settings from site settings
  const heroTitle = settings?.hero_title || "Elevate Your Digital Life.";
  const heroSubtitle = settings?.hero_subtitle || "Samsung, Apple, Sony, HP and more — curated smartphones, laptops & accessories. Pay with M-Pesa or PayPal.";
  const heroImage = settings?.hero_image || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2000&auto=format&fit=crop";
  const heroBadgeText = settings?.hero_badge_text || "Kenya's Premium Tech Hub";
  const heroCtaPrimaryText = settings?.hero_cta_primary_text || "Shop All Brands";
  const heroCtaPrimaryLink = settings?.hero_cta_primary_link || "/shop";
  const heroCtaSecondaryText = settings?.hero_cta_secondary_text || "View Phones";
  const heroCtaSecondaryLink = settings?.hero_cta_secondary_link || "/shop?cat=smartphones";

  // Parse trust badges from settings JSON
  let trustBadges = defaultTrustBadges;
  try {
    const parsed = settings?.trust_badges ? JSON.parse(settings.trust_badges) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      trustBadges = parsed;
    }
  } catch { /* use defaults */ }

  // Use DB categories if available, otherwise defaults
  const categories = (dbCategories && dbCategories.length > 0)
    ? dbCategories.map((cat: any) => ({
        slug: cat.slug,
        name: cat.name,
        description: cat.description || "",
        iconName: cat.iconName || "Smartphone",
        gradient: cat.gradient || "from-blue-500/20 to-cyan-500/20",
      }))
    : defaultCategories;

  // Split hero title to apply gradient to text after the last space (like original "Digital Life.")
  const titleParts = heroTitle.split(/ (?=[^ ]+$)/); // split at last space
  const titleMain = titleParts.length > 1 ? titleParts[0] : "";
  const titleAccent = titleParts.length > 1 ? titleParts[1] : heroTitle;

  return (
    <div className="bg-safaridark min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-3 md:pt-10 pb-10 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-safariborder min-h-[380px] sm:min-h-[440px] md:min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 z-10" />
            <Image
              src={heroImage}
              alt="Premium devices at Safaritech Kenya"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />

            <div className="relative z-20 px-5 py-12 sm:py-14 md:p-20 w-full md:w-2/3 lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] sm:text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_8px_#00FF9F]" />
                {heroBadgeText}
              </div>

              <h1 className="font-display font-black text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-white mb-5 text-balance">
                {titleMain ? `${titleMain} ` : ""}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-electric">
                  {titleAccent}
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-md leading-relaxed mb-7">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={heroCtaPrimaryLink}
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all active:scale-[0.98] text-center"
                >
                  {heroCtaPrimaryText}
                </Link>
                <Link
                  href={heroCtaSecondaryLink}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/15 border border-white/15 text-white font-display font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all active:scale-[0.98] text-center"
                >
                  {heroCtaSecondaryText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 md:py-8 border-y border-safariborder bg-safarigray/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustBadges.map((item: any) => {
              const IconComp = iconMap[item.icon] || Smartphone;
              return (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-safaridark border border-safariborder flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 text-neon" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-0.5">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BrandShowcase />

      {/* Hot deals - only show if there are hot products */}
      {hotDeals.length > 0 && (
        <section className="py-10 md:py-16 px-4 border-y border-orange-900/30 bg-gradient-to-br from-orange-950/40 to-red-950/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white truncate">
                    Hot Deals
                  </h2>
                  <p className="text-sm text-gray-400">Limited time offers</p>
                </div>
              </div>
              <Link
                href="/deals"
                className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 shrink-0"
              >
                All <span className="hidden sm:inline">Deals</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {hotDeals.slice(0, 4).map((p: Record<string, unknown>) => (
                <ProductCard
                  key={p.id as string}
                  product={{
                    id: p.id as string,
                    name: p.name as string,
                    slug: p.slug as string,
                    price: (p.salePrice as number) || (p.price as number),
                    originalPrice: (p.salePrice as number) ? (p.price as number) : null,
                    images: parseImages(p.images),
                    inStock: (p.stock as number) > 0,
                    isHot: true,
                    badge: (p.badge as string) ?? "Hot Deal",
                    rating: 0,
                    reviewCount: 0,
                    description: p.description as string,
                    colors: p.colors as string,
                    brand: p.brand as string,
                    category: p.category
                      ? { id: (p.category as { id: string }).id, name: (p.category as { name: string }).name }
                      : null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-2">
                Explore Categories
              </h2>
              <p className="text-sm text-gray-400">Find exactly what you need.</p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-1 text-neon font-bold hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
            {categories.map((cat: any) => {
              const IconComp = iconMap[cat.iconName] || Smartphone;
              return (
                <Link
                  key={cat.slug}
                  href={`/shop?cat=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-safarigray border border-safariborder p-4 md:p-5 transition-all active:scale-[0.98] md:hover:border-neon/30 md:hover:-translate-y-0.5"
                >
                  <div
                    className={`w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-10 md:mb-12 shadow-lg`}
                  >
                    <IconComp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-white mb-1 group-hover:text-neon transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Arrivals / Empty State */}
      <section className="pb-8 md:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-neon" />
                <h2 className="font-display font-black text-2xl md:text-4xl text-white">
                  Latest Arrivals
                </h2>
              </div>
              <p className="text-sm text-gray-400">The newest tech in Kenya, curated for you.</p>
            </div>
            {hasProducts && (
              <Link
                href="/shop"
                className="text-sm font-bold text-neon hover:text-neon-dim transition-colors flex items-center gap-1 shrink-0"
              >
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl skeleton-shimmer" />
              ))}
            </div>
          ) : hasProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {newArrivals.map((p: Record<string, unknown>) => (
                <ProductCard
                  key={p.id as string}
                  product={{
                    id: p.id as string,
                    name: p.name as string,
                    slug: p.slug as string,
                    price: (p.salePrice as number) || (p.price as number),
                    originalPrice: (p.salePrice as number) ? (p.price as number) : null,
                    images: parseImages(p.images),
                    inStock: (p.stock as number) > 0,
                    isHot: (p.isHot as boolean) ?? null,
                    badge: (p.badge as string) ?? null,
                    rating: 0,
                    reviewCount: 0,
                    description: p.description as string,
                    colors: p.colors as string,
                    brand: p.brand as string,
                    category: p.category
                      ? { id: (p.category as { id: string }).id, name: (p.category as { name: string }).name }
                      : null,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-24 bg-safarigray/30 border border-safariborder rounded-3xl">
              <div className="w-20 h-20 bg-safaridark rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageOpen className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-3">
                Coming Soon
              </h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 px-4">
                We&apos;re curating the best tech products for Kenya. Check back soon for amazing deals on smartphones, laptops, and accessories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                <Link
                  href="/shop"
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-[0.98]"
                >
                  Browse Shop
                </Link>
                <Link
                  href="/deals"
                  className="bg-safarigray border border-safariborder text-white font-display font-bold px-6 py-3 rounded-xl text-sm transition-all hover:border-neon/30"
                >
                  View Deals
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <PaymentBadges />
    </div>
  );
}
