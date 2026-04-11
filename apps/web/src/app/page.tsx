import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/products";

const trustItems = [
  { icon: "✅", text: "M-Pesa Pay" },
  { icon: "🚚", text: "Free Delivery Nairobi" },
  { icon: "🔄", text: "7-Day Returns" },
  { icon: "🛡️", text: "1-Year Warranty" },
  { icon: "⭐", text: "4.9/5 from 2,847 Kenyans" },
  { icon: "📦", text: "Ships Same Day" },
];

const hotDeals = products.filter((p) => p.isHot).slice(0, 4);
const bestSellers = products.slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-safaridark">
        {/* Background glow blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-electric/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="space-y-7 animate-fade-up">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-neon/10 border border-neon/20 text-neon text-xs font-semibold px-4 py-2 rounded-full font-display tracking-wide">
                <span className="w-2 h-2 bg-neon rounded-full animate-pulse" />
                Ships same day in Nairobi
              </div>

              <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-white">
                Tech That<br />
                <span className="text-neon glow-neon-text">Moves Kenya</span>
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Phones • Laptops • Gaming PCs • Accessories<br />
                Fast M-Pesa delivery · 1-year warranty · 7-day returns
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-neon hover:bg-neon-dim text-black font-display font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 glow-neon active:scale-95"
                >
                  Shop Now →
                </Link>
                <Link
                  href="/shop?cat=gaming"
                  className="border border-electric/40 text-electric hover:bg-electric/10 font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200"
                >
                  Browse Deals
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {["🧑🏾‍💻","👩🏽‍💼","👨🏿‍🎮"].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-safarigray border border-safariborder flex items-center justify-center text-sm">{e}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs">4.9 / 5 stars</div>
                    <div className="text-[11px] text-gray-500">2,847 reviews</div>
                  </div>
                </div>
                <div className="text-xs">Free delivery over KES 10,000</div>
                <div className="text-xs">7-day easy returns</div>
              </div>
            </div>

            {/* Right: hero visual */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main image */}
                <div className="relative rounded-3xl overflow-hidden border border-safariborder bg-safarigray aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop"
                    alt="Gaming setup"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-neon text-black text-xs font-bold px-3 py-1.5 rounded-xl font-display">
                      RTX 4090 Build — KES 320,000
                    </span>
                  </div>
                </div>

                {/* Floating card: Free Delivery */}
                <div className="absolute -bottom-4 -left-4 bg-white text-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                  <div>
                    <div className="font-display font-bold text-sm">Free Delivery</div>
                    <div className="text-xs text-gray-500">Nairobi · 24 hours</div>
                  </div>
                </div>

                {/* Floating card: M-Pesa */}
                <div className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2">
                  <span className="text-xl">📱</span>
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

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <div className="border-y border-safariborder bg-safarigray/50 overflow-hidden">
        <div className="flex items-center justify-center gap-0 flex-wrap">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-400 font-medium px-6 py-3 border-r border-safariborder last:border-0">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-neon text-xs font-semibold tracking-widest font-display mb-2">BROWSE</div>
            <h2 className="font-display font-bold text-3xl text-white">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-sm text-gray-400 hover:text-neon transition-colors">View all →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.id}`}
              className="cat-card group bg-safarigray border border-safariborder rounded-2xl p-6 flex flex-col gap-4 neon-border overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at top left, ${cat.color}08, transparent 60%)` }} />
              <div className="text-4xl">{cat.icon}</div>
              <div>
                <div className="font-display font-bold text-lg text-white group-hover:text-neon transition-colors">{cat.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{cat.count}+ products</div>
              </div>
              <div className="text-xs font-semibold text-gray-500 group-hover:text-neon transition-colors flex items-center gap-1">
                Shop now <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════ BEST SELLERS ═══════════════ */}
      <section className="bg-safarigray/30 border-y border-safariborder py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-neon text-xs font-semibold tracking-widest font-display mb-2">TRENDING</div>
              <h2 className="font-display font-bold text-3xl text-white">Best Sellers 🔥</h2>
            </div>
            <Link href="/shop" className="text-sm text-gray-400 hover:text-neon transition-colors">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ GAMING BANNER ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl bg-safarigray border border-safariborder">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FF9F08] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=400&fit=crop"
              alt="Gaming setup"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-safarigray via-safarigray/70 to-transparent" />
          </div>

          <div className="relative px-8 md:px-12 py-12 max-w-lg">
            <span className="inline-block bg-neon/10 border border-neon/30 text-neon text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full font-display mb-5">
              🎮 GAMING WEEK DEALS
            </span>
            <h2 className="font-display font-black text-4xl text-white leading-tight mb-4">
              Level Up<br />Your Setup.<br />
              <span className="text-neon">Up to 25% Off.</span>
            </h2>
            <p className="text-gray-400 mb-7">
              Chairs, monitors, controllers, keyboards, gaming PCs — everything a gamer needs, all in one place.
            </p>
            <Link
              href="/shop?cat=gaming"
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-display font-bold px-7 py-4 rounded-2xl text-sm transition-all glow-neon active:scale-95"
            >
              Shop Gaming Gear →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOT DEALS ═══════════════ */}
      <section className="bg-safarigray/30 border-t border-safariborder py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-red-400 text-xs font-semibold tracking-widest font-display mb-2">LIMITED TIME</div>
              <h2 className="font-display font-bold text-3xl text-white">Hot Deals ⚡</h2>
            </div>
            <Link href="/shop?filter=deals" className="text-sm text-gray-400 hover:text-neon transition-colors">All deals →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {hotDeals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ M-PESA SECTION ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="rounded-3xl overflow-hidden bg-green-900/20 border border-green-800/30 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-green-400 text-xs font-bold tracking-widest font-display mb-4">KENYA'S PREFERRED PAYMENT</div>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-4">
                Pay with <span className="text-green-400">M-Pesa</span>,<br />Get it Tomorrow.
              </h2>
              <p className="text-gray-400 mb-6">
                Buy Goods Till No. <strong className="text-white">247891</strong> · No card needed.
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
                { icon: "⚡", title: "Instant Confirmation", desc: "M-Pesa STK push directly to your phone" },
                { icon: "🔒", title: "100% Secure", desc: "All transactions encrypted & verified" },
                { icon: "📦", title: "Same-Day Dispatch", desc: "Order before 2PM, ships today" },
                { icon: "🎧", title: "24/7 Support", desc: "WhatsApp us any time at +254 700 000 000" },
              ].map((item, i) => (
                <div key={i} className="bg-safaridark border border-safariborder rounded-2xl p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-display font-semibold text-sm text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-safariborder bg-safarigray/30">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <ellipse cx="14" cy="11" rx="7" ry="10" stroke="#00FF9F" strokeWidth="1.5" fill="none" transform="rotate(-15 14 11)"/>
                  <line x1="14" y1="3" x2="14" y2="26" stroke="#00FF9F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="font-display font-bold text-lg">Safari<span className="text-neon">tech</span></span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Kenya's premier tech destination. Phones, laptops, gaming gear & accessories.
              </p>
              <div className="flex gap-3 mt-4">
                {["Twitter", "Instagram", "TikTok"].map((s) => (
                  <a key={s} href="#" className="text-xs text-gray-500 hover:text-neon transition-colors">{s}</a>
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
                <ul className="space-y-2.5">
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
            <div>© 2026 Safaritech. Built for Kenya 🇰🇪 All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>📱 M-Pesa</span>
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}