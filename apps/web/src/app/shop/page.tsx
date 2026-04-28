"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Smartphone, Laptop, Gamepad2, Headphones, Search, SlidersHorizontal, X } from "lucide-react";

const brands = ["Apple", "Samsung", "ASUS ROG", "Logitech", "Sony", "Lenovo"];

const staticCategories = [
  { id: "phones", label: "Phones", icon: Smartphone, count: 124 },
  { id: "laptops", label: "Laptops & PCs", icon: Laptop, count: 89 },
  { id: "gaming", label: "Gaming", icon: Gamepad2, count: 67 },
  { id: "accessories", label: "Accessories", icon: Headphones, count: 215 },
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
      list = list.filter((p: any) => selectedBrands.includes(p.category?.name || ''));
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
    <aside className="w-full md:w-64 shrink-0 space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="font-semibold text-sm text-gray-900 mb-3">Price Range</div>
        <input
          type="range"
          min={5000}
          max={400000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-neon"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>KES 5,000</span>
          <span className="text-neon font-semibold">KES {maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="font-semibold text-sm text-gray-900 mb-3">Brand</div>
        <div className="space-y-2.5">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-gray-300 accent-neon"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="font-semibold text-sm text-gray-900 mb-3">Availability</div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} className="accent-neon" />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>

      {selectedCat === "gaming" && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="font-semibold text-sm text-gray-900 mb-3">Gaming Filters</div>
          <div className="space-y-2.5">
            {["RGB Lighting", "Wireless", "Mechanical", "4K Ready"].map((f) => (
              <label key={f} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="accent-neon" />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{f}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => { setSelectedCat("all"); setSelectedBrands([]); setMaxPrice(400000); setInStockOnly(false); }}
        className="w-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 text-sm py-2.5 rounded-xl transition-all font-semibold"
      >
        Reset Filters
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile: Filter overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Filters</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-lg md:text-2xl text-gray-900">
                {selectedCat === "all" ? "All Products" : staticCategories.find((c) => c.id === selectedCat)?.label || selectedCat}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{filtered.length} products found</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="md:hidden flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs px-3 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium"
                onClick={() => setSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs md:text-sm text-gray-700 focus:outline-none focus:border-gray-400"
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Mobile: Horizontal scroll category pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCat === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCat === cat.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

<div className="max-w-7xl mx-auto px-4 py-5 md:py-8">
      <div className="flex gap-6">
        <div className="hidden md:block">
          <FilterPanel />
        </div>

        <PullToRefresh onRefresh={handleRefresh} className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl h-72 md:h-80 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <div className="font-display font-bold text-lg text-gray-900 mb-1">No products found</div>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filtered.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
)}
      </PullToRefresh>
    </div>
  </div>
</div>
);
}
