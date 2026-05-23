"use client";
import Image from "next/image";
import Link from "next/link";
import { Flame, Star, ShoppingCart } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { motion } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { findBrandByName } from "@/lib/brands";

type ColorVariant = { name: string; hex: string; image?: string };

type ProductFromServer = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  images?: string[] | null;
  inStock: boolean;
  isHot?: boolean | null;
  badge?: string | null;
  rating: number;
  reviewCount: number;
  description: string;
  brand?: string | null;
  category: { id: string; name: string } | null;
  colors?: string | null;
};

type ProductFromStatic = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  img: string;
  inStock: boolean;
  isHot?: boolean;
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
};

type Product = ProductFromServer | ProductFromStatic;

function getProductImage(product: Product): string {
  if ("img" in product) return product.img;
  if ("images" in product && product.images) {
    const imgs = product.images as string[];
    return imgs.length > 0 ? imgs[0] : "/placeholder.jpg";
  }
  return "/placeholder.jpg";
}

function getProductPrice(product: Product): number {
  return product.price;
}

function getProductOriginalPrice(product: Product): number | undefined {
  if ("originalPrice" in product) return product.originalPrice ?? undefined;
  return undefined;
}

function getProductSlug(product: Product): string {
  return product.slug;
}

function getProductName(product: Product): string {
  return product.name;
}

function getProductInStock(product: Product): boolean {
  if ("inStock" in product) return product.inStock;
  return (product as { stock: number }).stock > 0;
}

function getProductIsHot(product: Product): boolean {
  return product.isHot ?? false;
}

function getProductBadge(product: Product): string | undefined {
  return product.badge ?? undefined;
}

function getProductRating(product: Product): number {
  return product.rating;
}

function getProductReviews(product: Product): number {
  if ("reviews" in product) return product.reviews;
  return product.reviewCount ?? 0;
}

function getProductBrand(product: Product): string {
  if ("brand" in product && product.brand) return product.brand;
  if ("category" in product && typeof product.category === "object" && product.category) {
    return product.category.name;
  }
  if ("category" in product && typeof product.category === "string") {
    return product.category;
  }
  return "";
}

function getProductColors(product: Product): ColorVariant[] {
  if ("colors" in product && product.colors) {
    try {
      const parsed = JSON.parse(product.colors as string);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function ProductCard({ product }: { product: Product }) {
  const utils = trpc.useUtils();
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === 'UNAUTHORIZED') {
        // Redirect to login if not authenticated
        window.location.href = '/login?message=Please+sign+in+to+add+items+to+cart';
      }
    },
  });

  const discount = getProductOriginalPrice(product)
    ? Math.round(
        ((getProductOriginalPrice(product)! - getProductPrice(product)) /
          getProductOriginalPrice(product)!) *
          100
      )
    : null;

  const colors = getProductColors(product);
  const brandName = getProductBrand(product);
  const brandMeta = findBrandByName(brandName);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = typeof product.id === "number" ? product.id.toString() : product.id;
    addToCart.mutate({ productId, quantity: 1 });
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="product-card h-full"
    >
      <Link href={`/products/${getProductSlug(product)}`} className="group block h-full">
        <div className="h-full bg-safarigray border border-safariborder rounded-2xl overflow-hidden hover:border-neon/25 transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-safaridark">
            <Image
              src={getProductImage(product)}
              alt={getProductName(product)}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {getProductBadge(product) && (
                <span className="bg-neon text-black text-[9px] font-bold px-2 py-0.5 rounded-md font-display">
                  {getProductBadge(product)}
                </span>
              )}
              {discount && (
                <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                  -{discount}%
                </span>
              )}
            </div>
            {getProductIsHot(product) && (
              <div className="absolute top-2 right-2">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
            )}
            {!getProductInStock(product) && (
              <div className="absolute inset-0 bg-safaridark/75 flex items-center justify-center">
                <span className="bg-safarigray border border-safariborder text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="p-3 md:p-4">
            <div className="flex items-center gap-1.5 mb-1 min-h-[20px]">
              {brandMeta ? (
                <BrandLogo brand={brandMeta} size={16} />
              ) : null}
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase truncate">
                {brandName}
              </span>
            </div>
            <div className="font-medium text-xs md:text-sm text-white line-clamp-2 leading-snug mb-2">
              {getProductName(product)}
            </div>
            {colors.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-safariborder"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-[9px] text-gray-500">+{colors.length - 4}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={
                      i < Math.round(getProductRating(product))
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-700"
                    }
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500">
                ({getProductReviews(product).toLocaleString()})
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="font-display font-bold text-sm md:text-base text-white">
                KES {getProductPrice(product).toLocaleString()}
              </span>
              {getProductOriginalPrice(product) && (
                <span className="text-[10px] text-gray-500 line-through">
                  {getProductOriginalPrice(product)!.toLocaleString()}
                </span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-neon hover:bg-neon-dim text-black font-semibold text-xs py-2.5 rounded-xl transition-all duration-200 font-display disabled:opacity-40 flex items-center justify-center gap-1.5 min-h-[44px]"
              onClick={handleAddToCart}
              disabled={addToCart.isPending || !getProductInStock(product)}
            >
              <ShoppingCart size={14} />
              {addToCart.isPending ? "Adding..." : getProductInStock(product) ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
