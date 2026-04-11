"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug });
  const { data: allProducts } = trpc.product.getAll.useQuery({ limit: 50 });

  if (isLoading) {
    return (
      <div className="bg-safaridark min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-safarigray rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-safarigray rounded" />
              <div className="h-6 w-1/3 bg-safarigray rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-safaridark min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/shop" className="bg-neon text-black font-bold px-6 py-3 rounded-xl">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const related = (allProducts?.products ?? [])
    .filter((p: any) => p.category?.id === product.category?.id && p.id !== product.id)
    .slice(0, 4);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  const utils = trpc.useUtils();
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
    },
  });

  return (
    <div className="bg-safaridark min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-safariborder">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-neon transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-neon transition-colors">Shop</Link>
          <span>›</span>
          <Link href={`/shop?cat=${product.category?.slug}`} className="hover:text-neon transition-colors capitalize">{product.category?.name || ''}</Link>
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
                src={product.images?.[0] || '/placeholder.jpg'}
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
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images ? product.images.split(',').slice(0, 4).map((img: string, i: number) => (
                <div key={i} className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? "border-neon" : "border-safariborder hover:border-neon/50"}`}>
                  <Image src={img.trim() || '/placeholder.jpg'} alt="" fill className="object-cover" />
                </div>
              )) : (
                <div className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 border-neon`}>
                  <Image src={product.images || '/placeholder.jpg'} alt="" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              {product.stock > 0 ? (
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
              <p className="text-xs text-gray-500 font-semibold tracking-wider mb-1">{product.category?.name}</p>
              <h1 className="font-display font-black text-3xl md:text-4xl text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < Math.round((product.reviews?.length ? product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / product.reviews.length : 0)) ? "#FFB347" : "none"} stroke="#FFB347" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-white">
                {product.reviews?.length ? (product.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / product.reviews.length).toFixed(1) : '0'}
              </span>
              <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-4xl text-neon">
                KES {product.price.toLocaleString()}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-lg text-gray-600 line-through">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500/10 text-red-400 text-sm font-bold px-2 py-0.5 rounded-lg">
                    Save KES {(product.price - product.salePrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed text-sm">{product.description}</p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button 
                className="w-full bg-neon hover:bg-neon-dim text-black font-display font-bold text-base py-4 rounded-2xl transition-all glow-neon active:scale-95 disabled:opacity-50"
                onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                disabled={addToCart.isPending || product.stock === 0}
              >
                {addToCart.isPending ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
              <Link href={`/shop?cat=${product.category?.slug}`} className="text-sm text-gray-400 hover:text-neon transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}