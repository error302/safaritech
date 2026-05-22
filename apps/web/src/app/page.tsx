"use client";

import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
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
} from "lucide-react";

const trustItems = [
  { icon: Smartphone, title: "M-Pesa & PayPal", desc: "Instant & secure" },
  { icon: Truck,      title: "Free Delivery",   desc: "Nairobi wide" },
  { icon: RotateCcw,  title: "7-Day Returns",   desc: "No questions asked" },
  { icon: ShieldCheck,title: "1-Year Warranty", desc: "On all devices" },
];

const categories = [
  { id: "smartphones",  label: "Phones",     icon: Smartphone, desc: "Latest smartphones", gradient: "from-blue-600 to-blue-400" },
  { id: "laptops",      label: "Laptops",    icon: Laptop,     desc: "Work & play",        gradient: "from-purple-600 to-purple-400" },
  { id: "gaming",       label: "Gaming",     icon: Gamepad2,   desc: "Next-gen consoles",  gradient: "from-red-600 to-orange-400" },
  { id: "audio",        label: "Audio",      icon: Headphones, desc: "Premium sound",      gradient: "from-green-600 to-green-400" },
  { id: "wearables",    label: "Wearables",  icon: Watch,      desc: "Smart devices",      gradient: "from-yellow-500 to-amber-400" },
  { id: "accessories",  label: "Accessories",icon: Tag,        desc: "Must-have extras",   gradient: "from-cyan-600 to-cyan-400" },
];

const brands = [
  { name: "Samsung",  color: "#1428A0", textColor: "#fff", logo: "S",  popular: true  },
  { name: "Apple",    color: "#1d1d1f", textColor: "#fff", logo: "🍎", popular: true  },
  { name: "Sony",     color: "#000000", textColor: "#fff", logo: "S",  popular: true  },
  { name: "HP",       color: "#0096D6", textColor: "#fff", logo: "hp", popular: false },
  { name: "Dell",     color: "#007DB8", textColor: "#fff", logo: "D",  popular: false },
  { name: "JBL",      color: "#FF6600", textColor: "#fff", logo: "J",  popular: true  },
  { name: "Xiaomi",   color: "#FF6900", textColor: "#fff", logo: "Mi", popular: true  },
  { name: "Infinix",  color: "#C8102E", textColor: "#fff", logo: "X",  popular: true  },
  { name: "Tecno",    color: "#3B82F6", textColor: "#fff", logo: "T",  popular: false },
  { name: "Lenovo",   color: "#E2231A", textColor: "#fff", logo: "L",  popular: false },
  { name: "Google",   color: "#4285F4", textColor: "#fff", logo: "G",  popular: false },
  { name: "Nintendo", color: "#E4000F", textColor: "#fff", logo: "N",  popular: false },
];

function parseImages(raw: any): string[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return [raw]; }
}

export default function HomePage() {
  const { data: productsData, isLoading } = trpc.product.getAll.useQuery({ limit: 8 });
  const { data: hotData }                 = trpc.product.getHot.useQuery();

  const newArrivals = productsData?.products ?? [];
  const hotDeals    = hotData ?? [];

  return (
    <div className="bg-white md:bg-safaridark min-h-screen">

      {/* ─── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-4 md:pt-12 pb-12 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden bg-gray-50 md:bg-safarigray border border-gray-100 md:border-safariborder min-h-[420px] md:min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2000&auto=format&fit=crop"
              alt="Premium devices at Safaritech Kenya"
              fill
              className="object-cover object-center scale-105"
              priority
            />

            <div className="relative z-20 px-6 py-16 md:p-24 w-full md:w-2/3 lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_8px_#00FF9F]" />
                Kenya's Premium Tech Hub
              </div>

              <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-6">
                Elevate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-neon-dim">
                  Digital Life.
                </span>
              </h1>

              <p className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed mb-8">
                Samsung, Apple, Sony, HP and more — curated smartphones, laptops & accessories. Pay with M-Pesa or PayPal. Next-day delivery across Kenya.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-8 py-4 rounded-xl text-sm md:text-base transition-all active:scale-95 text-center flex-1 md:flex-none"
                >
                  Shop All Brands
                </Link>
                <Link
                  href="/shop?cat=smartphones"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white font-display font-bold px-8 py-4 rounded-xl text-sm md:text-base transition-all active:scale-95 text-center flex-1 md:flex-none"
                >
                  View Phones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────────────────────────────── */}
      <section className="py-8 border-y border-gray-100 md:border-safariborder bg-gray-50/50 md:bg-safarigray/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white md:bg-safaridark border border-gray-200 md:border-safariborder flex items-center justify-center shrink-0 shadow-sm">
                  <item.icon className="w-5 h-5 text-gray-900 md:text-neon" />
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 md:text-white mb-0.5">{item.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY BRAND ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-black text-2xl md:text-4xl text-gray-900 md:text-white mb-2">
                Shop by Brand
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                Official products from the world's top brands, available in Kenya.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-1 text-neon font-bold hover:gap-2 transition-all"
            >
              All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="group relative flex flex-col items-center justify-center gap-3 p-4 md:p-5 rounded-2xl border border-gray-100 md:border-safariborder bg-white md:bg-safarigray hover:border-gray-300 md:hover:border-gray-500 hover:shadow-lg md:hover:shadow-xl md:hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                {/* Brand color dot / logo */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shadow-md group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: brand.color, color: brand.textColor }}
                >
                  {brand.logo}
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-700 md:text-gray-300 group-hover:text-gray-900 md:group-hover:text-white transition-colors text-center leading-tight">
                  {brand.name}
                </span>
                {brand.popular && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_6px_#00FF9F]" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOT DEALS ────────────────────────────────────────────────────────── */}
      {hotDeals.length > 0 && (
        <section className="py-8 md:py-16 px-4 bg-gradient-to-br from-orange-50 to-red-50 md:from-orange-900/10 md:to-red-900/10 border-y border-orange-100 md:border-orange-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 md:text-white">
                    🔥 Hot Deals
                  </h2>
                  <p className="text-sm text-gray-500">Limited time, limited stock</p>
                </div>
              </div>
              <Link
                href="/deals"
                className="text-sm font-bold text-orange-600 md:text-orange-400 hover:text-orange-700 md:hover:text-orange-300 transition-colors flex items-center gap-1"
              >
                All Deals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {hotDeals.slice(0, 4).map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    originalPrice: p.salePrice ?? null,
                    images: parseImages(p.images),
                    inStock: p.stock > 0,
                    isHot: true,
                    badge: p.badge ?? "Hot Deal",
                    rating: 0,
                    reviewCount: 0,
                    description: p.description,
                    colors: p.colors,
                    category: p.category ? { id: p.category.id, name: p.category.name } : null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-black text-2xl md:text-4xl text-gray-900 md:text-white mb-2">
                Explore Categories
              </h2>
              <p className="text-sm md:text-base text-gray-500">Find exactly what you need.</p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-1 text-neon font-bold hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl bg-gray-50 md:bg-safarigray border border-gray-100 md:border-safariborder p-5 transition-all hover:border-gray-300 md:hover:border-gray-500 md:hover:shadow-xl md:hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-12 shadow-lg`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-base text-gray-900 md:text-white mb-1 group-hover:text-neon transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST ARRIVALS ──────────────────────────────────────────────────── */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-neon" />
                <h2 className="font-display font-black text-2xl md:text-4xl text-gray-900 md:text-white">
                  Latest Arrivals
                </h2>
              </div>
              <p className="text-sm md:text-base text-gray-500">
                The newest tech in Kenya, curated for you.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-bold text-gray-900 md:text-white hover:text-neon transition-colors flex items-center gap-1"
            >
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 md:bg-safarigray skeleton-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    originalPrice: p.salePrice ?? null,
                    images: parseImages(p.images),
                    inStock: p.stock > 0,
                    isHot: p.isHot ?? null,
                    badge: p.badge ?? null,
                    rating: 0,
                    reviewCount: 0,
                    description: p.description,
                    colors: p.colors,
                    category: p.category ? { id: p.category.id, name: p.category.name } : null,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── PAYMENT METHODS STRIP ────────────────────────────────────────────── */}
      <section className="py-12 px-4 border-t border-gray-100 md:border-safariborder bg-gray-50 md:bg-safarigray/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-widest">
            Secure Payment Options
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {/* M-Pesa */}
            <div className="flex items-center gap-2 bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-xl px-5 py-3 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-gray-900 md:text-white">M-Pesa</span>
            </div>
            {/* PayPal */}
            <div className="flex items-center gap-2 bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-xl px-5 py-3 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M20.007 6.467c-.201-.192-.472-.341-.812-.444-.34-.104-.766-.156-1.278-.156H9.72c-.229 0-.441.139-.533.348l-3.32 7.574a.591.591 0 0 0 .533.824h2.518c.28 0 .532-.178.625-.443l.89-2.544a1.18 1.18 0 0 1 1.12-.788h1.996c1.393 0 2.47-.367 3.232-1.101.762-.734 1.143-1.789 1.143-3.167 0-.319-.047-.639-.14-.959a4.832 4.832 0 0 0-.46-1.147" />
                </svg>
              </div>
              <span className="font-bold text-sm text-gray-900 md:text-white">PayPal</span>
            </div>
            {/* Visa */}
            <div className="flex items-center gap-2 bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-xl px-5 py-3 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-white text-[10px] font-black tracking-tight">VISA</span>
              </div>
              <span className="font-bold text-sm text-gray-900 md:text-white">Visa</span>
            </div>
            {/* Mastercard */}
            <div className="flex items-center gap-2 bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-xl px-5 py-3 shadow-sm">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-90" />
              </div>
              <span className="font-bold text-sm text-gray-900 md:text-white">Mastercard</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
