import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

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
  category: { id: string; name: string } | null;
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
  if ('img' in product) return product.img;
  if ('images' in product && product.images) {
    const imgs = product.images as string[];
    return imgs.length > 0 ? imgs[0] : '/placeholder.jpg';
  }
  return '/placeholder.jpg';
}

function getProductPrice(product: Product): number {
  return product.price;
}

function getProductOriginalPrice(product: Product): number | undefined {
  if ('originalPrice' in product) return product.originalPrice ?? undefined;
  return undefined;
}

function getProductSlug(product: Product): string {
  return product.slug;
}

function getProductName(product: Product): string {
  return product.name;
}

function getProductInStock(product: Product): boolean {
  if ('inStock' in product) return product.inStock;
  return (product as any).stock > 0;
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
  if ('reviews' in product) return product.reviews;
  return product.reviewCount ?? 0;
}

function getProductBrand(product: Product): string {
  if ('brand' in product) return product.brand;
  return product.category?.name ?? '';
}

export default function ProductCard({ product }: { product: Product }) {
  const utils = trpc.useUtils();
  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      utils.cart.getCart.invalidate();
    },
  });

  const discount = getProductOriginalPrice(product)
    ? Math.round(((getProductOriginalPrice(product)! - getProductPrice(product)) / getProductOriginalPrice(product)!) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = typeof product.id === 'number' ? product.id.toString() : product.id;
    addToCart.mutate({ productId, quantity: 1 });
  };

  return (
    <Link href={`/products/${getProductSlug(product)}`} className="group block">
      <div className="product-card bg-safarigray border border-safariborder rounded-2xl overflow-hidden neon-border">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#0d0d0d]">
          <Image
            src={getProductImage(product)}
            alt={getProductName(product)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {getProductBadge(product) && (
              <span className="bg-neon text-black text-[10px] font-bold px-2.5 py-1 rounded-lg font-display">
                {getProductBadge(product)}
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-display">
                -{discount}%
              </span>
            )}
          </div>
          {getProductIsHot(product) && (
            <div className="absolute top-3 right-3">
              <span className="text-lg">🔥</span>
            </div>
          )}
          {!getProductInStock(product) && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 font-medium mb-1">{getProductBrand(product)}</div>
          <div className="font-semibold text-sm text-white line-clamp-2 leading-snug mb-2">
            {getProductName(product)}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(getProductRating(product)) ? "#FFB347" : "none"} stroke="#FFB347" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({getProductReviews(product).toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display font-bold text-lg text-neon">
              KES {getProductPrice(product).toLocaleString()}
            </span>
            {getProductOriginalPrice(product) && (
              <span className="text-xs text-gray-600 line-through">
                {getProductOriginalPrice(product)!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            className="w-full bg-neon hover:bg-neon-dim active:scale-95 text-black font-semibold text-sm py-2.5 rounded-xl transition-all duration-150 font-display disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !getProductInStock(product)}
          >
            {addToCart.isPending ? 'Adding...' : getProductInStock(product) ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}