"use client";

import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Package,
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
  ChevronRight,
  Zap,
} from "lucide-react";

const trustItems = [
  { icon: Smartphone, title: "M-Pesa Ready", desc: "Fast & secure" },
  { icon: Truck, title: "Free Delivery", desc: "Nairobi wide" },
  { icon: RotateCcw, title: "7-Day Returns", desc: "No questions asked" },
  { icon: ShieldCheck, title: "1-Year Warranty", desc: "On all devices" },
];

const categories = [
  { id: "phones", label: "Phones", icon: Smartphone, desc: "Latest smartphones" },
  { id: "laptops", label: "Laptops", icon: Laptop, desc: "Work & play" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, desc: "Next-gen consoles" },
  { id: "accessories", label: "Audio", icon: Headphones, desc: "Premium sound" },
];

export default function HomePage() {
  const { data: productsData, isLoading } = trpc.product.getAll.useQuery({ limit: 8 });
  const products = productsData?.products ?? [];

  const hotDeals = products.filter((p: any) => p.isHot).slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <div className="bg-white md:bg-safaridark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 md:pt-12 pb-12 md:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden bg-gray-50 md:bg-safarigray border border-gray-100 md:border-safariborder">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <Image
              src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2000&auto=format&fit=crop"
              alt="Premium devices"
              fill
              className="object-cover object-center scale-105"
              priority
            />
            
            <div className="relative z-20 px-6 py-16 md:p-24 w-full md:w-2/3 lg:w-1/2">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_8px_#00FF9F]" />
                Premium Tech Hub Kenya
              </div>
              
              <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white mb-6">
                Elevate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-neon-dim">
                  Digital Life.
                </span>
              </h1>
              
              <p className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed mb-8">
                Discover curated smartphones, high-performance laptops, and premium accessories. Next-day delivery across Kenya.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-8 py-4 rounded-xl text-sm md:text-base transition-all active:scale-95 text-center flex-1 md:flex-none"
                >
                  Shop Now
                </Link>
                <Link
                  href="/shop?cat=phones"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white font-display font-bold px-8 py-4 rounded-xl text-sm md:text-base transition-all active:scale-95 text-center flex-1 md:flex-none"
                >
                  View Phones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
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

      {/* Categories */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display font-black text-2xl md:text-4xl text-gray-900 md:text-white mb-2">
                Explore Categories
              </h2>
              <p className="text-sm md:text-base text-gray-500">Find exactly what you need.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-neon font-bold hover:gap-2 transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl bg-gray-50 md:bg-safarigray border border-gray-100 md:border-safariborder p-6 transition-all hover:border-gray-300 md:hover:border-gray-500 md:hover:shadow-xl md:hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-white md:bg-safaridark flex items-center justify-center mb-16 shadow-sm">
                  <cat.icon className="w-6 h-6 text-gray-900 md:text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 md:text-white mb-1 group-hover:text-neon transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
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
              <p className="text-sm md:text-base text-gray-500">The newest tech in Kenya, curated for you.</p>
            </div>
            <Link href="/shop" className="text-sm font-bold text-gray-900 md:text-white hover:text-neon transition-colors">
              See All
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
              {newArrivals.map((p: any) => {
                const images = p.images ? (Array.isArray(p.images) ? p.images : [String(p.images)]) : null;
                return (
                  <ProductCard 
                    key={p.id} 
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: p.price,
                      originalPrice: p.salePrice ?? null,
                      images: images,
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
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
