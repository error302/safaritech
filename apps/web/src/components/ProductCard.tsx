import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="product-card bg-safarigray border border-safariborder rounded-2xl overflow-hidden neon-border">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#0d0d0d]">
          <Image
            src={product.img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="bg-neon text-black text-[10px] font-bold px-2.5 py-1 rounded-lg font-display">
                {product.badge}
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-display">
                -{discount}%
              </span>
            )}
          </div>
          {product.isHot && (
            <div className="absolute top-3 right-3">
              <span className="text-lg">🔥</span>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">{product.brand}</div>
          <div className="font-semibold text-sm text-white line-clamp-2 leading-snug mb-2">
            {product.name}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(product.rating) ? "#FFB347" : "none"} stroke="#FFB347" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display font-bold text-lg text-neon">
              KES {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-600 line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            className="w-full bg-neon hover:bg-neon-dim active:scale-95 text-black font-semibold text-sm py-2.5 rounded-xl transition-all duration-150 font-display"
            onClick={(e) => {
              e.preventDefault();
              alert(`Added ${product.name} to cart!`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}