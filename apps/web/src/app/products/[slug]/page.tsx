import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — Safaritech`,
    description: product.description,
  };
}

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-safaridark min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-safariborder">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-neon transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-neon transition-colors">Shop</Link>
          <span>›</span>
          <Link href={`/shop?cat=${product.category}`} className="hover:text-neon transition-colors capitalize">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── IMAGE GALLERY ── */}
          <div className="md:sticky md:top-24 self-start">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-safarigray border border-safariborder mb-4">
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl font-display">
                  -{discount}% OFF
                </div>
              )}
              {product.badge && (
                <div className="absolute top-4 right-4 bg-neon text-black text-xs font-bold px-3 py-1.5 rounded-xl font-display">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[product.img, product.img, product.img, product.img].map((img, i) => (
                <div key={i} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? "border-neon" : "border-safariborder hover:border-neon/50"}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full font-display">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  In Stock · Ships today
                </span>
              ) : (
                <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name & brand */}
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider mb-1">{product.brand}</p>
              <h1 className="font-display font-black text-3xl md:text-4xl text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? "#FFB347" : "none"} stroke="#FFB347" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-4xl text-neon">
                KES {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-600 line-through">
                    {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500/10 text-red-400 text-sm font-bold px-2 py-0.5 rounded-lg">
                    Save KES {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Storage variant */}
            {product.storageOptions && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-3">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((opt, i) => (
                    <button
                      key={opt}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        i === 1
                          ? "bg-neon text-black border-neon"
                          : "border-safariborder text-gray-300 hover:border-neon hover:text-neon"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color variant */}
            {product.colors && (
              <div>
                <p className="text-sm font-semibold text-gray-300 mb-3">Color</p>
                <div className="flex gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={color}
                      className={`w-9 h-9 rounded-xl border-2 transition-all ${i === 0 ? "border-neon scale-110" : "border-safariborder hover:border-gray-400"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>

            {/* Key specs */}
            <div className="bg-safarigray border border-safariborder rounded-2xl p-5 space-y-3">
              <p className="font-display font-semibold text-sm text-white">Key Specifications</p>
              {product.specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-neon rounded-full mt-1.5 shrink-0" />
                  <span className="text-sm text-gray-400">{spec}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button className="w-full bg-neon hover:bg-neon-dim text-black font-display font-bold text-base py-4 rounded-2xl transition-all glow-neon active:scale-95">
                Add to Cart
              </button>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-display font-bold text-base py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>📱</span> Buy Now with M-Pesa
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "🛡️", text: "1 Year Warranty" },
                { icon: "🔄", text: "7-Day Returns" },
                { icon: "🚚", text: "Free Delivery" },
              ].map((item) => (
                <div key={item.text} className="bg-safarigray border border-safariborder rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-500 font-medium">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display font-bold text-2xl text-white">You May Also Like</h2>
              <Link href={`/shop?cat=${product.category}`} className="text-sm text-gray-400 hover:text-neon transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}