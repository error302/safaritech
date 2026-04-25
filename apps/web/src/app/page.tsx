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
  Zap,
  Lock,
  Clock,
  Headset,
  CreditCard,
  Globe,
} from "lucide-react";

const trustItems = [
  { icon: Smartphone, text: "M-Pesa Pay" },
  { icon: Truck, text: "Free Delivery Nairobi" },
  { icon: RotateCcw, text: "7-Day Returns" },
  { icon: ShieldCheck, text: "1-Year Warranty" },
  { icon: Star, text: "4.9/5 from 2,847 Kenyans" },
  { icon: Package, text: "Ships Same Day" },
];

const staticCategories = [
  { id: "phones", label: "Phones", icon: Smartphone, count: 124, color: "#00FF9F" },
  { id: "laptops", label: "Laptops & PCs", icon: Laptop, count: 89, color: "#00B8FF" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, count: 67, color: "#FF6B6B" },
  { id: "accessories", label: "Accessories", icon: Headphones, count: 215, color: "#FFB347" },
];

export default function HomePage() {
  const { data: productsData, isLoading: productsLoading } = trpc.product.getAll.useQuery({ limit: 50 });
  const { data: featuredData, isLoading: featuredLoading } = trpc.product.getFeatured.useQuery();

  const products = productsData?.products ?? [];
  const featured = featuredData ?? [];

  const hotDeals = products.filter((p: any) => p.isHot).slice(0, 4);
  const bestSellers = featured.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-safaridark">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-neon/[0.08] border border-neon/20 text-neon text-xs font-semibold px-4 py-2 rounded-full font-display tracking-wide">
                <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse" />
                Same-day delivery in Nairobi
              </div>

              <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white">
                Tech That<br />
                <span className="text-neon">Moves Kenya</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Phones, Laptops, Gaming PCs & Accessories.
                Fast M-Pesa delivery, 1-year warranty, 7-day returns.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 active:scale-95"
                >
                  Shop Now
                </Link>
                <Link
                  href="/shop?cat=gaming"
                  className="border border-white/10 text-white hover:border-electric/40 hover:text-electric font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200"
                >
                  Browse Deals
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-safarigray border-2 border-safaridark flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs">4.9 / 5 stars</div>
                    <div className="text-[11px] text-gray-600">2,847 reviews</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Truck className="w-3.5 h-3.5 text-neon" />
                  Free delivery over KES 10,000
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <RotateCcw className="w-3.5 h-3.5 text-neon" />
                  7-day easy returns
                </div>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative rounded-3xl overflow-hidden border border-safariborder bg-safarigray aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop"
                    alt="Gaming setup"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-neon text-black text-xs font-bold px-3 py-1.5 rounded-xl font-display">
                      RTX 4090 Build — KES 320,000
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white text-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm">Free Delivery</div>
                    <div className="text-xs text-gray-500">Nairobi, 24 hours</div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  <div>
                    <div className="font-display font-bold text-sm">M-Pesa</div>
                    <div className="text-xs opacity-80">Accepted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-safariborder bg-safarigray/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {trustItems.map((Item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500 font-medium px-6 py-3.5 border-r border-safariborder last:border-0">
                <Item.icon className="w-4 h-4 text-neon/60" />
                <span>{Item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-neon text-[11px] font-semibold tracking-[0.2em] font-display mb-2">BROWSE</div>
            <h2 className="font-display font-bold text-3xl text-white">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm text-gray-500 hover:text-neon transition-colors">View all</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {staticCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.id}`}
                className="group bg-safarigray border border-safariborder rounded-2xl p-6 flex flex-col gap-4 overflow-hidden relative hover:border-neon/20 transition-all duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at top left, ${cat.color}06, transparent 60%)` }}
                />
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-safariborder flex items-center justify-center group-hover:border-neon/20 transition-colors">
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-white group-hover:text-neon transition-colors">{cat.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{cat.count}+ products</div>
                </div>
                <div className="text-xs font-semibold text-gray-600 group-hover:text-neon transition-colors flex items-center gap-1">
                  Shop now <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-safarigray/20 border-y border-safariborder py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-neon text-[11px] font-semibold tracking-[0.2em] font-display mb-2">TRENDING</div>
              <h2 className="font-display font-bold text-3xl text-white">Best Sellers</h2>
            </div>
            <Link href="/shop" className="text-sm text-gray-500 hover:text-neon transition-colors">View all</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-safarigray border border-safariborder rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              bestSellers.map((p: any) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-safarigray border border-safariborder">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FF9F05] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=400&fit=crop"
              alt="Gaming setup"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-safarigray via-safarigray/80 to-transparent" />
          </div>

          <div className="relative px-8 md:px-12 py-12 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-neon/[0.08] border border-neon/20 text-neon text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full font-display mb-6">
              <Gamepad2 className="w-3 h-3" />
              GAMING WEEK DEALS
            </span>
            <h2 className="font-display font-black text-4xl text-white leading-tight mb-4">
              Level Up<br />Your Setup.<br />
              <span className="text-neon">Up to 25% Off.</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Chairs, monitors, controllers, keyboards, gaming PCs — everything a gamer needs.
            </p>
            <Link
              href="/shop?cat=gaming"
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-display font-bold px-7 py-4 rounded-2xl text-sm transition-all active:scale-95"
            >
              Shop Gaming Gear
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-safarigray/20 border-t border-safariborder py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-red-400 text-[11px] font-semibold tracking-[0.2em] font-display mb-2">LIMITED TIME</div>
              <h2 className="font-display font-bold text-3xl text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-red-400" /> Hot Deals
              </h2>
            </div>
            <Link href="/shop?filter=deals" className="text-sm text-gray-500 hover:text-neon transition-colors">All deals</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-safarigray border border-safariborder rounded-2xl h-80 animate-pulse" />
              ))
            ) : (
              hotDeals.map((p: any) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="rounded-3xl overflow-hidden bg-green-950/30 border border-green-900/30 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-green-400 text-[11px] font-bold tracking-[0.2em] font-display mb-4">KENYA&apos;S PREFERRED PAYMENT</div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
                Pay with <span className="text-green-400">M-Pesa</span>,<br />Get it Tomorrow.
              </h2>
              <p className="text-gray-400 mb-8">
                Buy Goods Till No. <strong className="text-white">247891</strong>. No card needed.
                Order by 2PM for same-day dispatch in Nairobi.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-display font-bold px-7 py-4 rounded-2xl text-sm transition-all"
              >
                Start Shopping
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, title: "Instant Confirmation", desc: "M-Pesa STK push directly to your phone" },
                { icon: Lock, title: "100% Secure", desc: "All transactions encrypted & verified" },
                { icon: Clock, title: "Same-Day Dispatch", desc: "Order before 2PM, ships today" },
                { icon: Headset, title: "24/7 Support", desc: "WhatsApp us any time at +254 700 000 000" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-safaridark border border-safariborder rounded-2xl p-5">
                    <Icon className="w-5 h-5 text-green-400 mb-3" />
                    <div className="font-display font-semibold text-sm text-white mb-1">{item.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-safariborder bg-safarigray/20">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <Image src="/logo.jpg" alt="Safaritech" width={28} height={28} className="rounded-lg object-cover" />
                <span className="font-display font-bold text-lg">Safari<span className="text-neon">tech</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Kenya&apos;s premier tech destination. Phones, laptops, gaming gear & accessories.
              </p>
              <div className="flex gap-4 mt-5">
                {["Twitter", "Instagram", "TikTok"].map((s) => (
                  <a key={s} href="#" className="text-xs text-gray-600 hover:text-neon transition-colors">{s}</a>
                ))}
              </div>
            </div>

            {[
              { title: "Shop", links: ["Phones", "Laptops & PCs", "Gaming", "Accessories", "Deals"] },
              { title: "Support", links: ["Contact Us", "Shipping Info", "Returns Policy", "Warranty", "Track Order"] },
              { title: "Company", links: ["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-display font-semibold text-sm text-white mb-4">{col.title}</div>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-neon transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-safariborder pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              &copy; 2026 Safaritech. Built for Kenya. All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-gray-500">
              <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> M-Pesa</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Visa</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Mastercard</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
