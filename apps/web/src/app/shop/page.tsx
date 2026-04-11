"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";

const brands = ["Apple", "Samsung", "ASUS ROG", "Logitech", "Sony", "Lenovo"];

const staticCategories = [
  { id: "phones", label: "Phones", icon: "📱", count: 124 },
  { id: "laptops", label: "Laptops & PCs", icon: "💻", count: 89 },
  { id: "gaming", label: "Gaming", icon: "🎮", count: 67 },
  { id: "accessories", label: "Accessories", icon: "🎧", count: 215 },
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

  const { data: productsData, isLoading } = trpc.product.getAll.useQuery({
    category: selectedCat !== "all" ? selectedCat : undefined,
    limit: 100,
  });

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
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      {/* Price Range */}
      <div className="bg-safarigray border border-safariborder rounded-2xl p-5">
        <div className="font-display font-semibold text-sm text-white mb-4">Price Range</div>
        <input
          type="range"
          min={5000}
          max={400000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>KES 5,000</span>
          <span className="text-neon font-semibold">KES {maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Brand */}
      <div className="bg-safarigray border border-safariborder rounded-2xl p-5">
        <div className="font-display font-semibold text-sm text-white mb-4">Brand</div>
        <div className="space-y-2.5">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded"
              />
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="bg-safarigray border border-safariborder rounded-2xl p-5">
        <div className="font-display font-semibold text-sm text-white mb-4">Availability</div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
          />
          <span className="text-sm text-gray-400">In Stock Only</span>
        </label>
      </div>

      {/* Gaming-specific */}
      {selectedCat === "gaming" && (
        <div className="bg-safarigray border border-safariborder rounded-2xl p-5">
          <div className="font-display font-semibold text-sm text-white mb-4">Gaming Filters</div>
          <div className="space-y-2.5">
            {["RGB Lighting", "Wireless", "Mechanical", "4K Ready"].map((f) => (
              <label key={f} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{f}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => { setSelectedCat("all"); setSelectedBrands([]); setMaxPrice(400000); setInStockOnly(false); }}
        className="w-full border border-safariborder text-gray-400 hover:border-neon hover:text-neon text-sm py-2.5 rounded-xl transition-all font-semibold"
      >
        Reset Filters
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-safaridark">
      {/* Header */}
      <div className="bg-safarigray border-b border-safariborder">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                {selectedCat === "all" ? "All Products" : staticCategories.find((c) => c.id === selectedCat)?.label || selectedCat}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{filtered.length} products found</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                className="md:hidden flex items-center gap-2 border border-safariborder text-gray-400 text-sm px-4 py-2 rounded-xl hover:border-neon transition-all"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/>
                </svg>
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-safarigray border border-safariborder rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-neon"
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCat === "all" ? "bg-neon text-black" : "bg-safaridark border border-safariborder text-gray-400 hover:border-neon hover:text-neon"
              }`}
            >
              All
            </button>
            {staticCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedCat === cat.id ? "bg-neon text-black" : "bg-safaridark border border-safariborder text-gray-400 hover:border-neon hover:text-neon"
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop always visible, mobile overlay */}
          <div className={`md:block ${sidebarOpen ? "block" : "hidden"}`}>
            <FilterPanel />
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-safarigray border border-safariborder rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-display font-bold text-xl text-white mb-2">No products found</div>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}