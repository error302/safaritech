"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Smartphone,
  ChevronRight,
  Star,
  Share2,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
} from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug });
  const { data: allProducts } = trpc.product.getAll.useQuery({ limit: 50 });
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const utils = trpc.useUtils();
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    },
  });

  const imageList = product?.images ? product.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
  const mainImage = imageList[0] || "/placeholder.jpg";
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });

  if (isLoading) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-80 md:h-96 bg-gray-200 md:bg-safarigray rounded-xl md:rounded-3xl" />
            <div className="space-y-3">
              <div className="h-7 w-2/3 bg-gray-200 md:bg-safarigray rounded" />
              <div className="h-5 w-1/3 bg-gray-200 md:bg-safarigray rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display font-bold text-xl md:text-2xl md:text-white text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-500 mb-5">
            The product you are looking for does not exist.
          </p>
          <Link
            href="/shop"
            className="bg-neon text-black font-bold px-5 py-2.5 rounded-lg text-sm"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const related = (allProducts?.products ?? [])
    .filter(
      (p: any) => p.category?.id === product.category?.id && p.id !== product.id
    )
    .slice(0, 4);

  const discount = product.salePrice
    ? Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      )
    : null;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce(
        (sum: number, r: any) => sum + (r.rating || 0),
        0
      ) / product.reviews.length
    : 0;

const handleAddToCart = () => {
    const productId = String(product.id);
    addToCart.mutate({ productId, quantity });
    
    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen pb-20 md:pb-0">
      <div className="md:border-b md:border-safariborder border-b border-gray-200 bg-white md:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs md:text-gray-500 text-gray-400">
          <Link href="/" className="hover:text-neon transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-neon transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={"/shop?cat=" + product.category?.slug}
            className="hover:text-neon transition-colors capitalize"
          >
            {product.category?.name || ""}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="md:text-gray-300 text-gray-700 truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 md:py-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">
          <div className="md:sticky md:top-24 self-start">
<div 
            className="relative aspect-square rounded-xl md:rounded-3xl overflow-hidden bg-gray-100 md:bg-safarigray border border-gray-200 md:border-safariborder mb-3 cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            onTouchStart={(e) => {
              const touch = e.touches[0]
              const rect = e.currentTarget.getBoundingClientRect()
              setZoomPosition({
                x: (touch.clientX - rect.left) / rect.width,
                y: (touch.clientY - rect.top) / rect.height
              })
            }}
            onTouchMove={(e) => {
              if (!isZoomed) return
              const touch = e.touches[0]
              const rect = e.currentTarget.getBoundingClientRect()
              setZoomPosition({
                x: (touch.clientX - rect.left) / rect.width,
                y: (touch.clientY - rect.top) / rect.height
              })
            }}
          >
            <Image
              src={imageList[selectedImage] || mainImage}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-200' : 'scale-100'}`}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                transform: 'scale(2)'
              } : {}}
              priority
            />
              {discount && (
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-lg md:rounded-xl font-display">
                  -{discount}% OFF
                </div>
              )}
              <div className="md:hidden absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    }
                  }}
                  className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                  <Heart className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {imageList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {imageList.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={
                      "relative w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 " +
                      (i === selectedImage
                        ? "border-neon"
                        : "border-gray-200 md:border-safariborder hover:border-neon/50")
                    }
                  >
                    <Image
                      src={img || "/placeholder.jpg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 md:bg-green-500/10 border border-green-200 md:border-green-500/20 text-green-700 md:text-green-400 text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full font-display">
                  <span className="w-1.5 h-1.5 bg-green-600 md:bg-green-400 rounded-full animate-pulse" />
                  In Stock - Ships today
                </span>
              ) : (
                <span className="bg-red-50 md:bg-red-500/10 border border-red-200 md:border-red-500/20 text-red-700 md:text-red-400 text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <div>
              <p className="text-[10px] md:text-xs text-gray-500 md:text-gray-600 font-semibold tracking-wider uppercase mb-1">
                {product.category?.name}
              </p>
              <h1 className="font-display font-black text-2xl md:text-4xl md:text-white text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 md:text-amber-400/30"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold md:text-white text-gray-900">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="font-display font-black text-3xl md:text-4xl md:text-neon text-gray-900">
                KES {(product.salePrice || product.price).toLocaleString()}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-50 md:bg-red-500/10 text-red-700 md:text-red-400 text-xs font-bold px-2 py-0.5 rounded-md">
                    Save KES{" "}
                    {(product.price - product.salePrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <p className="md:text-gray-400 text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Quantity Selector - mobile only */}
            <div className="md:hidden flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex flex-col gap-2.5 pt-1">
              <button
                className="w-full bg-neon hover:bg-neon-dim text-black font-display font-bold text-sm md:text-base py-3.5 md:py-4 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                onClick={handleAddToCart}
                disabled={addToCart.isPending || product.stock === 0}
              >
                {addToCart.isPending
                  ? "Adding..."
                  : product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
              <button className="w-full bg-green-700 hover:bg-green-800 md:bg-green-600 md:hover:bg-green-500 text-white font-display font-bold text-sm md:text-base py-3.5 md:py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
                Buy Now with M-Pesa
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3 pt-1">
              {[
                { icon: ShieldCheck, text: "1 Year Warranty" },
                { icon: RotateCcw, text: "7-Day Returns" },
                { icon: Truck, text: "Free Delivery" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-2.5 md:p-3 text-center"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-green-600 md:text-neon/60 mx-auto mb-1" />
                    <div className="text-[10px] md:text-xs text-gray-500 font-medium">
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-10 md:mt-20">
            <div className="flex items-end justify-between mb-5 md:mb-8">
              <h2 className="font-display font-bold text-lg md:text-2xl md:text-white text-gray-900">
                You May Also Like
              </h2>
              <Link
                href={"/shop?cat=" + product.category?.slug}
                className="text-xs md:text-sm text-gray-500 hover:text-neon transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom CTA - mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 pb-safe">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || product.stock === 0}
            className="flex-1 bg-neon hover:bg-neon-dim text-black font-display font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? "Added!" : addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-display font-bold text-sm py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
