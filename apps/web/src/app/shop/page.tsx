"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import ProductCard from "@/components/ProductCard";
import { PullToRefresh } from "@/components/PullToRefresh";
import {
  Smartphone, Laptop, Gamepad2, Headphones, Search,
  SlidersHorizontal, X, Tv, Camera, Watch, Tablet,
  Wifi, HardDrive, Home, Package
} from "lucide-react";

const staticCategories = [
  { id: "smartphones",  label: "Phones",       icon: Smartphone },
  { id: "laptops",      label: "Laptops",       icon: Laptop },
  { id: "tablets",      label: "Tablets",       icon: Tablet },
  { id: "audio",        label: "Audio",         icon: Headphones },
  { id: "gaming",       label: "Gaming",        icon: Gamepad2 },
  { id: "wearables",    label: "Wearables",     icon: Watch },
  { id: "cameras",      label: "Cameras",       icon: Camera },
  { id: "tvs-displays", label: "TVs",           icon: Tv },
  { id: "accessories",  label: "Accessories",   icon: Package },
  { id: "storage",      label: "Storage",       icon: HardDrive },
  { id: "networking",   label: "Networking",    icon: Wifi },
  { id: "smart-home",   label: "Smart Home",    icon: Home },
];

// Brand accent colors
const brandColors: Record<string, string> = {
  Samsung:   "#1428A0",
  Apple:     "#555555",
  HP:        "#0096D6",
  Dell:      "#007DB8",
  Sony:      "#000000",
  JBL:       "#FF6600",
  Xiaomi:    "#FF6900",
  Infinix:   "#C8102E",
  Tecno:     "#3B82F6",
  Lenovo:    "#E2231A",
  Google:    "#4285F4",
  Nintendo:  "#E4000F",
  DJI:       "#2D2D2D",
  Anker:     "#00B4D8",
  Logitech:  "#00B2FF",
  "TP-Link": "#4CAF50",
};

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initCat   = searchParams.get("cat") || searchParams.get("category") || "all";
  const initBrand = searchParams.get("brand") || "";
  const dealsOnly = searchParams.get("filter") === "deals";

  const [selectedCat,    setSelectedCat]    = useState(initCat);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initBrand ? [initBrand] : []);
  const [maxPrice,       setMaxPrice]       = useState(400000);
  const [inStockOnly,    setInStockOnly]    = useState(false);
  const [sortBy,         setSortBy]         = useState("newest");
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");

  const { data: productsData, isLoading, refetch } = trpc.product.getAll.useQuery({
    category: selectedCat !== "all" ? selectedCat : undefined,
    limit: 200,
  });

  const { data: allBrands = [] } = trpc.product.getBrands.useQuery();

  const products = productsData?.products ?? [];

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const filtered = useMemo(() => {
    let list = products as any[];
    if (dealsOnly) {
      list = list.filter((p) => p.salePrice && p.salePrice < p.price);
    }
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand || ""));
    }
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    list = list.filter((p) => p.price <= maxPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "hot")        list = [...list].sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    return list;
  }, [products, dealsOnly, selectedBrands, maxPrice, inStockOnly, sortBy, searchQuery]);

  useEffect(() => {
    const cat = searchParams.get("cat") || searchParams.get("category");
    const brand = searchParams.get("brand");
    if (cat) setSelectedCat(cat);
    if (brand) setSelectedBrands([brand]);
  }, [searchParams]);

  const resetFilters = () => {
    setSelectedCat("all");
    setSelectedBrands([]);
    setMaxPrice(400000);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedCat !== "all" ? 1 : 0) +
    selectedBrands.length +
    (maxPrice < 400000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FilterPanel = () => (
    <aside className="w-full space-y-4">
      {/* Search */}
      <div className="bg-safaridark border border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-white mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-safariborder bg-safarigray text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 transition"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-safaridark border border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-white mb-4">Price Range</h3>
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

      {/* Brands */}
      <div className="bg-safaridark border border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-white mb-4">Brand</h3>
        <div className="space-y-2.5">
          {allBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded border-gray-300 md:border-gray-600 accent-neon"
              />
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: brandColors[brand] || "#888" }}
              />
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex-1">
                {brand}
              </span>
              {selectedBrands.includes(brand) && (
                <span className="text-[10px] font-bold bg-neon/20 text-neon px-1.5 py-0.5 rounded-full">✓</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="bg-safaridark border border-safariborder rounded-2xl p-5 shadow-sm md:shadow-none">
        <h3 className="font-bold font-display text-white mb-4">Availability</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="w-4 h-4 rounded border-gray-300 md:border-gray-600 accent-neon"
          />
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      <button
        onClick={resetFilters}
        className="w-full bg-safarigray hover:bg-red-50 md:hover:bg-red-900/20 hover:text-red-600 md:hover:text-red-400 text-white text-sm font-bold py-3.5 rounded-xl transition-all border border-transparent hover:border-red-900"
      >
        Reset All Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
    </aside>
  );

  const selectedCatLabel = staticCategories.find((c) => c.id === selectedCat)?.label;

  return (
    <div className="min-h-screen bg-safaridark pb-24 md:pb-12">
      {/* Mobile filter overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-safarigray border-t border-safariborder rounded-t-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-safarigray/95 backdrop-blur-md px-5 py-4 border-b border-safariborder flex items-center justify-between">
              <h3 className="font-bold font-display text-xl text-white">
                Filters {activeFilterCount > 0 && <span className="text-neon">({activeFilterCount})</span>}
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 pb-10">
              <FilterPanel />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-safarigray border-b border-safariborder sticky md:static top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div>
              <h1 className="font-display font-black text-2xl md:text-4xl text-white capitalize">
                {selectedBrands.length === 1
                  ? selectedBrands[0]
                  : selectedCat === "all"
                  ? "All Products"
                  : selectedCatLabel || selectedCat}
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                {selectedBrands.length > 1 && ` · Brands: ${selectedBrands.join(", ")}`}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="md:hidden flex-1 flex items-center justify-center gap-2 bg-safaridark border border-safariborder text-white text-sm font-bold py-2.5 rounded-xl relative"
                onClick={() => setSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neon text-black text-[10px] font-black rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 md:flex-none bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-neon/50 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="hot">🔥 Hot Deals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 mt-5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCat("all")}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCat === "all"
                  ? "bg-white text-black shadow-md"
                  : "bg-safarigray text-gray-300 hover:bg-gray-200 md:hover:bg-safariborder"
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
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCat === cat.id
                      ? "bg-white text-black shadow-md"
                      : "bg-safarigray text-gray-300 hover:bg-gray-200 md:hover:bg-safariborder"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active brand chips */}
          {selectedBrands.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 border border-neon/30 text-neon text-xs font-bold hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition-all"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: brandColors[b] || "#888" }}
                  />
                  {b}
                  <X className="w-3 h-3 ml-0.5" />
                </button>
              ))}
              <button
                onClick={() => setSelectedBrands([])}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors px-2"
              >
                Clear brands
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-28 h-fit">
            <FilterPanel />
          </div>

          {/* Product grid */}
          <PullToRefresh onRefresh={async () => { await refetch() }} className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[3/4] rounded-2xl bg-safarigray skeleton-shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-safarigray/20 border border-safariborder rounded-3xl">
                <div className="w-20 h-20 bg-safaridark rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div className="font-display font-bold text-xl md:text-2xl text-white mb-2">
                  No products found
                </div>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={resetFilters}
                  className="text-sm font-bold text-neon hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((p: any) => {
                  let images: string[] | null = null;
                  try {
                    images = p.images
                      ? Array.isArray(p.images)
                        ? p.images
                        : JSON.parse(p.images)
                      : null;
                  } catch {
                    images = p.images ? [p.images] : null;
                  }
                  return (
                    <ProductCard
                      key={p.id}
                      product={{
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        originalPrice: p.salePrice ?? null,
                        images,
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
