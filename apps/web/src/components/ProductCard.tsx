import Image from "next/image";
import Link from "next/link";
import { Flame, Star, ShoppingCart } from "lucide-react";
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
<div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl overflow-hidden hover:border-gray-300 md:hover:border-gray-500 hover:shadow-sm transition-all duration-200">
<div className="relative aspect-square overflow-hidden bg-gray-50 md:bg-safaridark">
          <Image
            src={getProductImage(product)}
            alt={getProductName(product)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {getProductBadge(product) && (
              <span className="bg-neon text-black text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md font-display">
                {getProductBadge(product)}
              </span>
            )}
            {discount && (
              <span className="bg-red-600 text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md">
                -{discount}%
              </span>
            )}
          </div>
          {getProductIsHot(product) && (
            <div className="absolute top-2 right-2">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
            </div>
          )}
{!getProductInStock(product) && (
<div className="absolute inset-0 bg-white/70 md:bg-safaridark/70 flex items-center justify-center">
<span className="bg-gray-900 text-white text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-lg">Out of Stock</span>
</div>
)}
        </div>

<div className="p-3 md:p-4">
<div className="text-[10px] md:text-xs text-gray-400 font-medium mb-0.5">{getProductBrand(product)}</div>
<div className="font-medium text-xs md:text-sm text-gray-900 md:text-white line-clamp-2 leading-snug mb-1.5">
{getProductName(product)}
</div>

<div className="flex items-center gap-1 mb-2">
<div className="flex">
{Array.from({ length: 5 }).map((_, i) => (
<Star key={i} size={10} className={i < Math.round(getProductRating(product)) ? "fill-amber-400 text-amber-400" : "text-gray-200 md:text-gray-600"} />
))}
</div>
<span className="text-[10px] text-gray-400">({getProductReviews(product).toLocaleString()})</span>
</div>

<div className="flex items-baseline gap-1.5 mb-2.5">
<span className="font-display font-bold text-sm md:text-lg text-gray-900 md:text-white">
KES {getProductPrice(product).toLocaleString()}
</span>
            {getProductOriginalPrice(product) && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through">
                {getProductOriginalPrice(product)!.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className="w-full bg-neon hover:bg-neon-dim active:scale-[0.98] text-black font-semibold text-xs md:text-sm py-2 md:py-2.5 rounded-lg transition-all duration-150 font-display disabled:opacity-40 flex items-center justify-center gap-1.5"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !getProductInStock(product)}
          >
            <ShoppingCart size={12} />
            {addToCart.isPending ? 'Adding...' : getProductInStock(product) ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </Link>
  );
}
