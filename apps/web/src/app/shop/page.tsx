"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Smartphone, Laptop, Gamepad2, Headphones, Search, SlidersHorizontal, X } from "lucide-react";

const brands = ["Apple", "Samsung", "ASUS", "Logitech", "Sony", "Lenovo"];

const staticCategories = [
  { id: "phones", label: "Phones", icon: Smartphone },
  { id: "laptops", label: "Laptops & PCs", icon: Laptop },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "accessories", label: "Accessories", icon: Headphones },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initCat = searchParams.get("cat") || "all";

  const [selectedCat, setSelectedCat] = useState(initCat);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(400000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: productsData, isLoading, refetch } = trpc.product.getAll.useQuery({
    category: selectedCat !== "all" ? selectedCat : undefined,
    limit: 100,
  });

  const handleRefresh = async () => {
    await refetch()
  }

  const products = productsData?.products ?? [];

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const filtered = useMemo(() => {
    let list = products;
    if (selectedBrands.length > 0) {
      list = list.filter((p: any) => selectedBrands.includes(p.name.split(' ')[0]) || selectedBrands.some(b => p.name.includes(b)));
    }
    if (inStockOnly) {
      list = list.filter((p: any) => p.stock > 0);
    }
    list = list.filter((p: any) => p.price <= maxPrice);
    if (sortBy === "price-asc") list = [...list].sort((a: any, b: any) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a: any, b: any) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, selectedBrands, maxPrice, inStockOnly, sortBy]);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  const FilterPanel = () => (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-gray-900 md:text-white mb-4">Price Range</h3>
        <input
          type="range"
          min={5000}
          max={400000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-neon cursor-pointer"
        />
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-3">
          <span>KES 5,000</span>
          <span className="text-neon font-bold">KES {maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-gray-900 md:text-white mb-4">Brand</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 md:border-gray-600 bg-gray-50 md:bg-safarigray accent-neon"
              />
              <span className="text-sm font-medium text-gray-600 md:text-gray-400 group-hover:text-gray-900 md:group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white md:bg-safaridark border border-gray-100 md:border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-gray-900 md:text-white mb-4">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={() => setInStockOnly(!inStockOnly)} 
            className="w-4 h-4 rounded border-gray-300 md:border-gray-600 bg-gray-50 md:bg-safarigray accent-neon" 
          />
          <span className="text-sm font-medium text-gray-600 md:text-gray-400 group-hover:text-gray-900 md:group-hover:text-white transition-colors">In Stock Only</span>
        </label>
      </div>

      <button
        onClick={() => { setSelectedCat("all"); setSelectedBrands([]); setMaxPrice(400000); setInStockOnly(false); }}
        className="w-full bg-gray-100 md:bg-safarigray hover:bg-gray-200 md:hover:bg-safariborder text-gray-900 md:text-white text-sm font-bold py-3.5 rounded-xl transition-all"
      >
        Reset Filters
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:bg-[#0A0A0A] pb-24 md:pb-12">
      {/* Mobile: Filter overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h3 className="font-bold font-display text-xl text-gray-900">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 pb-safe">
              <FilterPanel />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white md:bg-safaridark md:border-b md:border-safariborder border-b border-gray-100 sticky md:static top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div>
              <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 md:text-white capitalize">
                {selectedCat === "all" ? "All Products" : staticCategories.find((c) => c.id === selectedCat)?.label || selectedCat}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">{filtered.length} items found</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="md:hidden flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 text-sm font-bold py-2.5 rounded-xl"
                onClick={() => setSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 md:flex-none bg-gray-100 md:bg-safarigray md:border border-safariborder rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 md:text-white focus:outline-none focus:ring-2 focus:ring-neon/50 appearance-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Horizontal scroll category pills */}
          <div className="flex gap-2.5 mt-5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedCat === "all"
                  ? "bg-gray-900 md:bg-white text-white md:text-black shadow-md"
                  : "bg-gray-100 md:bg-safarigray text-gray-600 md:text-gray-300 hover:bg-gray-200 md:hover:bg-safariborder"
              }`}
            >
              All
            </button>
            {staticCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedCat === cat.id
                      ? "bg-gray-900 md:bg-white text-white md:text-black shadow-md"
                      : "bg-gray-100 md:bg-safarigray text-gray-600 md:text-gray-300 hover:bg-gray-200 md:hover:bg-safariborder"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-8">
          <div className="hidden md:block w-64 shrink-0 sticky top-28 h-fit">
            <FilterPanel />
          </div>

          <PullToRefresh onRefresh={handleRefresh} className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-gray-100 md:bg-safarigray skeleton-shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white md:bg-safarigray/20 border border-gray-100 md:border-safariborder rounded-3xl">
                <div className="w-20 h-20 bg-gray-50 md:bg-safaridark rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div className="font-display font-bold text-xl md:text-2xl text-gray-900 md:text-white mb-2">No products found</div>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => { setSelectedCat("all"); setSelectedBrands([]); setMaxPrice(400000); setInStockOnly(false); }}
                  className="mt-6 text-sm font-bold text-neon hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p: any) => {
                  const images = p.images ? (Array.isArray(p.images) ? p.images : [String(p.images)]) : null;
                  return (
                    <ProductCard
                      key={p.id}
                      product={{
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        originalPrice: p.salePrice ?? null,
                        images: images,
                        inStock: p.stock > 0,
                        isHot: p.isHot ?? null,
                        badge: p.badge ?? null,
                        rating: 0,
                        reviewCount: 0,
                        description: p.description,
                        colors: p.colors,
                        category: p.category ? { id: p.category.id, name: p.category.name } : null,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </PullToRefresh>
        </div>
      </div>
    </div>
  );
}
