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
  MapPin,
  ChevronRight,
  ChevronDown,
  Search,
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
  { id: "phones", label: "Phones", icon: Smartphone, count: 124, color: "#00FF9F", bg: "bg-blue-50", textColor: "text-blue-700" },
  { id: "laptops", label: "Laptops & PCs", icon: Laptop, count: 89, color: "#00B8FF", bg: "bg-purple-50", textColor: "text-purple-700" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, count: 67, color: "#FF6B6B", bg: "bg-red-50", textColor: "text-red-700" },
  { id: "accessories", label: "Accessories", icon: Headphones, count: 215, color: "#FFB347", bg: "bg-amber-50", textColor: "text-amber-700" },
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
{/* Mobile: Location + Search Bar - sticky top */}
<div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-2.5 flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="text-gray-700 font-medium">Nairobi, Kenya</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Safaritech..."
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>
        </div>
      </div>

{/* Hero Banner - Amazon-style promo carousel */}
<section className="bg-white md:bg-safaridark">
        <div className="max-w-7xl mx-auto">
{/* Mobile: Full-width promo banner */}
<div className="md:hidden relative w-full h-56 overflow-hidden">
<Image
src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop"
alt="Gaming setup"
fill
className="object-cover"
priority
/>
<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
<div className="absolute inset-0 flex items-center px-5">
<div className="relative z-10">
<span className="inline-flex items-center gap-1 bg-neon text-black text-[10px] font-bold px-2.5 py-1 rounded-md mb-2">
SAME-DAY DELIVERY
</span>
<h1 className="text-white font-display font-bold text-2xl leading-tight mb-1">
Tech That Moves Kenya
</h1>
<p className="text-white/90 text-xs mb-3">
Phones, Laptops, Gaming & more. Pay with M-Pesa.
</p>
<Link
href="/shop"
className="inline-flex items-center gap-1.5 bg-neon text-black font-bold text-xs px-4 py-2 rounded-lg active:scale-95"
>
Shop Now <ChevronRight className="w-3.5 h-3.5" />
</Link>
</div>
</div>
</div>

          {/* Desktop: Two-column hero */}
          <div className="hidden md:block py-12 px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/20 text-neon text-xs font-semibold px-4 py-2 rounded-full font-display tracking-wide">
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
                    className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 active:scale-95"
                  >
                    Shop Now
                  </Link>
<Link
href="/shop?cat=gaming"
className="border border-safariborder text-gray-300 hover:border-gray-500 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200"
>
Browse Deals
</Link>
                </div>

<div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pt-2">
<div className="flex items-center gap-2">
<div className="flex -space-x-2">
{[0, 1, 2].map((i) => (
<div key={i} className="w-7 h-7 rounded-full bg-safarigray border-2 border-safaridark flex items-center justify-center">
<div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-500 to-gray-700" />
</div>
))}
</div>
<div>
<div className="text-white font-semibold text-xs">4.9 / 5 stars</div>
<div className="text-[11px] text-gray-500">2,847 reviews</div>
</div>
</div>
<div className="flex items-center gap-1.5 text-xs">
<Truck className="w-3.5 h-3.5 text-green-500" />
Free delivery over KES 10,000
</div>
<div className="flex items-center gap-1.5 text-xs">
<RotateCcw className="w-3.5 h-3.5 text-green-500" />
7-day easy returns
</div>
</div>
              </div>

              <div className="relative flex justify-center">
                <div className="relative w-full max-w-md">
<div className="relative rounded-2xl overflow-hidden border border-safariborder bg-safarigray aspect-[4/3]">
<Image
src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop"
alt="Gaming setup"
fill
className="object-cover"
priority
/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
<div className="absolute bottom-4 left-4">
<span className="bg-neon text-black text-xs font-bold px-3 py-1.5 rounded-lg font-display">
RTX 4090 Build — KES 320,000
</span>
</div>
</div>

<div className="absolute -bottom-4 -left-4 bg-safarigray text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-safariborder">
<div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
<Package className="w-5 h-5 text-green-400" />
</div>
<div>
<div className="font-display font-bold text-sm">Free Delivery</div>
<div className="text-xs text-gray-400">Nairobi, 24 hours</div>
</div>
</div>

<div className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
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
        </div>
      </section>

{/* Trust Bar - Amazon-style horizontal strip */}
<div className="border-y border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray">
<div className="max-w-7xl mx-auto px-4">
<div className="flex items-center justify-center gap-0 flex-wrap">
{trustItems.map((Item, i) => (
<div key={i} className="flex items-center gap-2 text-xs text-gray-600 md:text-gray-300 font-medium px-5 py-3 border-r border-gray-200 md:border-safariborder last:border-0">
<Item.icon className="w-4 h-4 text-green-600 md:text-green-400" />
                <span>{Item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Horizontal scroll category pills */}
      <section className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {staticCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.id}`}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <Icon className="w-4 h-4" style={{ color: cat.color }} />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

{/* Desktop: Category grid */}
<section className="hidden md:block max-w-7xl mx-auto px-4 py-12">
<div className="flex items-end justify-between mb-8">
<div>
<h2 className="font-display font-bold text-2xl text-white">Shop by Category</h2>
<p className="text-sm text-gray-400 mt-1">Find what you need fast</p>
</div>
<Link href="/shop" className="text-sm text-neon font-semibold hover:underline">View all</Link>
</div>

<div className="grid grid-cols-4 gap-4">
{staticCategories.map((cat) => {
const Icon = cat.icon;
return (
<Link
key={cat.id}
href={`/shop?cat=${cat.id}`}
className="group bg-safarigray border border-safariborder rounded-xl p-6 flex flex-col gap-4 hover:border-gray-500 hover:shadow-sm transition-all duration-200"
>
<div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
<Icon className="w-6 h-6" style={{ color: cat.color }} />
</div>
<div>
<div className="font-display font-bold text-base text-white group-hover:text-neon transition-colors">{cat.label}</div>
<div className="text-xs text-gray-500 mt-1">{cat.count}+ products</div>
</div>
<div className="text-xs font-semibold text-gray-500 group-hover:text-neon transition-colors flex items-center gap-1">
Shop now <ChevronRight className="w-3 h-3" />
</div>
</Link>
);
})}
</div>
</section>

{/* Best Sellers - Amazon-style white cards */}
<section className="bg-gray-50 md:bg-safaridark border-y border-gray-200 md:border-safariborder py-8 md:py-12">
<div className="max-w-7xl mx-auto px-4">
<div className="flex items-end justify-between mb-5 md:mb-8">
<div>
<h2 className="font-display font-bold text-lg md:text-2xl text-gray-900 md:text-white">Best Sellers</h2>
<p className="text-xs text-gray-500 mt-0.5 hidden md:block">Most popular items this week</p>
</div>
<Link href="/shop" className="text-xs md:text-sm text-neon font-semibold hover:underline">See more</Link>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
{productsLoading ? (
Array(4).fill(0).map((_, i) => (
<div key={i} className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl h-72 md:h-80 animate-pulse" />
))
) : (
bestSellers.map((p: any) => <ProductCard key={p.id} product={p} />)
)}
</div>
</div>
</section>

      {/* Gaming Deal Banner - Amazon-style deal card */}
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-900">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=400&fit=crop"
              alt="Gaming setup"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
          </div>

          <div className="relative px-5 md:px-10 py-8 md:py-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-neon/10 border border-neon/20 text-neon text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-md font-display mb-4 md:mb-5">
              <Gamepad2 className="w-3 h-3" />
              GAMING WEEK DEALS
            </span>
            <h2 className="font-display font-black text-2xl md:text-4xl text-white leading-tight mb-3">
              Level Up Your Setup.
              <span className="text-neon block mt-1">Up to 25% Off.</span>
            </h2>
            <p className="text-gray-400 text-sm mb-5 hidden md:block">
              Chairs, monitors, controllers, keyboards, gaming PCs — everything a gamer needs.
            </p>
            <Link
              href="/shop?cat=gaming"
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-display font-bold px-5 md:px-7 py-3 md:py-4 rounded-lg md:rounded-xl text-sm transition-all active:scale-95"
            >
              Shop Gaming Gear
            </Link>
          </div>
        </div>
      </section>

{/* Hot Deals */}
<section className="bg-white md:bg-safaridark border-y border-gray-200 md:border-safariborder py-8 md:py-12">
<div className="max-w-7xl mx-auto px-4">
<div className="flex items-end justify-between mb-5 md:mb-8">
<div>
<div className="flex items-center gap-2">
<Zap className="w-5 h-5 md:w-6 md:h-6 text-red-600 md:text-red-500" />
<h2 className="font-display font-bold text-lg md:text-2xl text-gray-900 md:text-white">Hot Deals</h2>
</div>
<p className="text-xs text-gray-500 mt-0.5 hidden md:block">Limited time offers</p>
</div>
<Link href="/shop?filter=deals" className="text-xs md:text-sm text-neon font-semibold hover:underline">All deals</Link>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
{productsLoading ? (
Array(4).fill(0).map((_, i) => (
<div key={i} className="bg-gray-50 md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl h-72 md:h-80 animate-pulse" />
))
) : (
hotDeals.map((p: any) => <ProductCard key={p.id} product={p} />)
)}
</div>
</div>
</section>

{/* M-Pesa Section - Amazon-style info card */}
<section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
<div className="rounded-xl md:rounded-2xl overflow-hidden bg-green-50 md:bg-green-900/20 border border-green-200 md:border-green-800/30 p-6 md:p-10">
<div className="grid md:grid-cols-2 gap-8 items-center">
<div>
<div className="text-green-700 md:text-green-400 text-[10px] md:text-[11px] font-bold tracking-[0.15em] font-display mb-3 md:mb-4">KENYA&apos;S PREFERRED PAYMENT</div>
<h2 className="font-display font-black text-2xl md:text-3xl text-gray-900 md:text-white mb-3 md:mb-4">
Pay with <span className="text-green-700 md:text-green-400">M-Pesa</span>, Get it Tomorrow.
</h2>
<p className="text-gray-600 md:text-gray-400 text-sm mb-5 md:mb-6">
Buy Goods Till No. <strong className="text-gray-900 md:text-white">247891</strong>. No card needed.
Order by 2PM for same-day dispatch in Nairobi.
</p>
<Link
href="/shop"
className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-display font-bold px-6 py-3 rounded-lg text-sm transition-all"
>
Start Shopping
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: Zap, title: "Instant Confirmation", desc: "M-Pesa STK push directly to your phone" },
                { icon: Lock, title: "100% Secure", desc: "All transactions encrypted & verified" },
                { icon: Clock, title: "Same-Day Dispatch", desc: "Order before 2PM, ships today" },
                { icon: Headset, title: "24/7 Support", desc: "WhatsApp us any time at +254 700 000 000" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
<div key={i} className="bg-white md:bg-safarigray border border-green-200 md:border-green-800/30 rounded-xl p-4 md:p-5">
<Icon className="w-5 h-5 text-green-700 md:text-green-400 mb-2 md:mb-3" />
<div className="font-display font-semibold text-xs md:text-sm text-gray-900 md:text-white mb-1">{item.title}</div>
<div className="text-[11px] md:text-xs text-gray-500 md:text-gray-400 leading-relaxed">{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

{/* Footer - Amazon-style clean footer */}
<footer className="border-t border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark">
<div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-10">
<div className="col-span-2 md:col-span-1">
<div className="flex items-center gap-2.5 mb-4">
<Image src="/logo.jpg" alt="Safaritech" width={28} height={28} className="rounded-lg object-cover" />
<span className="font-display font-bold text-lg text-gray-900 md:text-white">Safari<span className="text-neon">tech</span></span>
</div>
<p className="text-sm text-gray-500 md:text-gray-400 leading-relaxed">
Kenya&apos;s premier tech destination. Phones, laptops, gaming gear & accessories.
</p>
<div className="flex gap-4 mt-4">
{["Twitter", "Instagram", "TikTok"].map((s) => (
<a key={s} href="#" className="text-xs text-gray-400 hover:text-gray-700 md:hover:text-white transition-colors">{s}</a>
))}
</div>
</div>

{[
{ title: "Shop", links: ["Phones", "Laptops & PCs", "Gaming", "Accessories", "Deals"] },
{ title: "Support", links: ["Contact Us", "Shipping Info", "Returns Policy", "Warranty", "Track Order"] },
{ title: "Company", links: ["About Us", "Blog", "Careers", "Privacy Policy", "Terms of Service"] },
].map((col) => (
<div key={col.title}>
<div className="font-display font-semibold text-sm text-gray-900 md:text-white mb-3 md:mb-4">{col.title}</div>
<ul className="space-y-2.5">
{col.links.map((link) => (
<li key={link}>
<a href="#" className="text-sm text-gray-500 hover:text-gray-700 md:hover:text-gray-300 transition-colors">{link}</a>
</li>
))}
</ul>
</div>
))}
</div>

<div className="border-t border-gray-200 md:border-safariborder pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 md:text-gray-400">
<div className="flex items-center gap-1.5">
<Globe className="w-3.5 h-3.5" />
&copy; 2026 Safaritech. Built for Kenya. All rights reserved.
</div>
<div className="flex items-center gap-5 text-gray-400">
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
