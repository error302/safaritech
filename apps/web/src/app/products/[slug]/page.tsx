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
  Check,
} from "lucide-react";

type ColorVariant = { name: string; hex: string; image?: string };
type Props = { params: Promise<{ slug: string }> };

function parseColors(colorsStr: string | null | undefined): ColorVariant[] {
  if (!colorsStr) return [];
  try {
    const parsed = JSON.parse(colorsStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug });
  const { data: allProducts } = trpc.product.getAll.useQuery({ limit: 50 });
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

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

  const colors = parseColors((product as any).colors);
  // Auto-select first color if none selected
  if (colors.length > 0 && !selectedColor) {
    // We can't call setState during render, so we check in the UI
  }
  const activeColor = selectedColor || (colors.length > 0 ? colors[0].name : null);

  // If the selected color has a specific image, use it
  const colorImage = activeColor ? colors.find(c => c.name === activeColor)?.image : undefined;
  const displayImage = colorImage || imageList[selectedImage] || mainImage;

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
    addToCart.mutate({ productId, quantity, selectedColor: activeColor || undefined });
    
    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const specs = (() => {
    try { return product.specs ? JSON.parse(product.specs) : {}; } catch { return {}; }
  })();

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen pb-24 md:pb-0">
      {/* Breadcrumb */}
      <div className="md:border-b md:border-safariborder border-b border-gray-100 bg-white md:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-neon transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-neon transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={"/shop?cat=" + product.category?.slug} className="hover:text-neon transition-colors capitalize">
            {product.category?.name || ""}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="md:text-gray-300 text-gray-600 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 md:py-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="md:sticky md:top-24 self-start">
            <div 
              className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gray-50 md:bg-safarigray border border-gray-100 md:border-safariborder mb-3 cursor-zoom-in"
              onClick={() => setIsZoomed(!isZoomed)}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPosition({
                  x: (touch.clientX - rect.left) / rect.width,
                  y: (touch.clientY - rect.top) / rect.height
                });
              }}
              onTouchMove={(e) => {
                if (!isZoomed) return;
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPosition({
                  x: (touch.clientX - rect.left) / rect.width,
                  y: (touch.clientY - rect.top) / rect.height
                });
              }}
            >
              <Image
                src={displayImage}
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
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-xl font-display">
                  -{discount}% OFF
                </div>
              )}
              <div className="md:hidden absolute top-3 right-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({ title: product.name, url: window.location.href });
                    }
                  }}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
                <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm" onClick={(e) => e.stopPropagation()}>
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
                      "relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 " +
                      (i === selectedImage
                        ? "border-neon"
                        : "border-gray-200 md:border-safariborder hover:border-neon/50")
                    }
                  >
                    <Image src={img || "/placeholder.jpg"} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Stock badge */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 bg-green-50 md:bg-green-500/10 border border-green-200 md:border-green-500/20 text-green-700 md:text-green-400 text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full font-display">
                  <span className="w-1.5 h-1.5 bg-green-600 md:bg-green-400 rounded-full animate-pulse" />
                  In Stock — Ships today
                </span>
              ) : (
                <span className="bg-red-50 md:bg-red-500/10 border border-red-200 md:border-red-500/20 text-red-700 md:text-red-400 text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name & category */}
            <div>
              <p className="text-[10px] md:text-xs text-gray-400 md:text-gray-500 font-semibold tracking-wider uppercase mb-1">
                {product.category?.name}
              </p>
              <h1 className="font-display font-black text-2xl md:text-3xl lg:text-4xl md:text-white text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
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

            {/* Price */}
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

            {/* Description */}
            <p className="md:text-gray-400 text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-medium md:text-white text-gray-900 mb-3">
                  Color: <span className="text-gray-400 font-normal">{activeColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                        activeColor === color.name
                          ? "border-neon bg-neon/5 md:bg-neon/10"
                          : "border-gray-200 md:border-safariborder hover:border-gray-300 md:hover:border-gray-600"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-200 md:border-gray-600 relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        {activeColor === color.name && (
                          <Check className="w-3 h-3 absolute inset-0 m-auto text-white drop-shadow-md" />
                        )}
                      </span>
                      <span className="text-xs font-medium md:text-gray-300 text-gray-700">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium md:text-white text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-200 md:border-safariborder rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 md:text-gray-400 hover:bg-gray-50 md:hover:bg-safaridark transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-bold md:text-white text-gray-900 border-x border-gray-200 md:border-safariborder">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 md:text-gray-400 hover:bg-gray-50 md:hover:bg-safaridark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex flex-col gap-2.5 pt-1">
              <button
                className="w-full bg-neon hover:bg-neon-dim text-black font-display font-bold text-base py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
                onClick={handleAddToCart}
                disabled={addToCart.isPending || product.stock === 0}
              >
                {addToCart.isPending
                  ? "Adding..."
                  : addedToCart
                  ? "✓ Added to Cart!"
                  : product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
              <button className="w-full bg-green-600 hover:bg-green-500 text-white font-display font-bold text-base py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                Buy Now with M-Pesa
              </button>
            </div>

            {/* Trust badges */}
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
                    className="bg-white md:bg-safarigray border border-gray-100 md:border-safariborder rounded-xl p-2.5 md:p-3 text-center"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-green-600 md:text-neon/60 mx-auto mb-1" />
                    <div className="text-[10px] md:text-xs text-gray-500 font-medium">
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Specs table */}
            {Object.keys(specs).length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-bold md:text-white text-gray-900 mb-3">Specifications</h3>
                <div className="bg-white md:bg-safarigray border border-gray-100 md:border-safariborder rounded-xl overflow-hidden">
                  {Object.entries(specs).map(([key, value], i) => (
                    <div key={key} className={`flex px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-gray-50/50 md:bg-safaridark/30' : ''}`}>
                      <span className="w-1/3 text-gray-500 font-medium text-xs">{key}</span>
                      <span className="flex-1 md:text-gray-300 text-gray-700 text-xs">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12 md:mt-20">
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

      {/* Sticky bottom CTA — mobile only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 pb-safe">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || product.stock === 0}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-display font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.97] disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? "Added!" : addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-display font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
