"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import ImageUploader from "./ImageUploader";
import { Plus, X } from "lucide-react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string;
  categoryId: string | null;
  colors?: string | null;
};

type ColorVariant = {
  name: string;
  hex: string;
  image?: string;
};

type Props = {
  product?: Product | null;
  categories: Category[];
  onSuccess: () => void;
};

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseColors(colorsStr: string | null | undefined): ColorVariant[] {
  if (!colorsStr) return [];
  try {
    const parsed = JSON.parse(colorsStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProductForm({ product, categories, onSuccess }: Props) {
  const utils = trpc.useUtils();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [salePrice, setSalePrice] = useState(String(product?.salePrice ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [images, setImages] = useState(product?.images ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [colors, setColors] = useState<ColorVariant[]>(parseColors(product?.colors));
  const [error, setError] = useState("");

  // Color form state
  const [showColorForm, setShowColorForm] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const slugAuto = product?.slug ?? generateSlug(name);

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.adminGetAll.invalidate();
      utils.product.getAll.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.adminGetAll.invalidate();
      utils.product.getAll.invalidate();
      onSuccess();
    },
    onError: (err) => setError(err.message),
  });

  const addColor = () => {
    if (!newColorName.trim()) return;
    const exists = colors.some((c) => c.name.toLowerCase() === newColorName.trim().toLowerCase());
    if (exists) {
      setError("Color already added");
      return;
    }
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
    setNewColorHex("#000000");
    setShowColorForm(false);
    setError("");
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Invalid price");
      return;
    }

    const data = {
      name: name.trim(),
      slug: slugAuto,
      description: description.trim(),
      price: priceNum,
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      stock: parseInt(stock) || 0,
      images: images.trim() || undefined,
      categoryId: categoryId || undefined,
      colors: colors.length > 0 ? JSON.stringify(colors) : undefined,
    };

    if (product) {
      updateProduct.mutate({ id: product.id, ...data });
    } else {
      createProduct.mutate(data);
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUploader value={images} onChange={setImages} multiple uploadTo="cloudinary" />

      <div>
        <label className="block text-sm font-medium text-white mb-2">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. iPhone 15 Pro 256GB"
          required
          className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Slug</label>
        <input
          type="text"
          value={slugAuto}
          readOnly
          className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-gray-500"
        />
        <p className="text-xs text-gray-600 mt-1">Auto-generated from name</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description..."
          rows={4}
          required
          className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Price (KSh) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            required
            className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Sale Price (KSh)</label>
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="Leave empty if no sale"
            min="0"
            className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="0"
            min="0"
            className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color Variants Section */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Color Variants
          <span className="text-gray-500 font-normal ml-1">({colors.length} colors)</span>
        </label>

        {/* Current colors */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map((color, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-safaridark border border-safariborder rounded-lg px-3 py-1.5 group"
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-gray-300">{color.name}</span>
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add color form */}
        {showColorForm ? (
          <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color Name</label>
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g. Midnight Black"
                  className="w-full bg-safarigray border border-safariborder rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-safariborder cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="flex-1 bg-safarigray border border-safariborder rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-neon"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 rounded-lg bg-neon hover:bg-neon-dim text-black text-xs font-bold transition-all"
              >
                Add Color
              </button>
              <button
                type="button"
                onClick={() => { setShowColorForm(false); setNewColorName(""); setNewColorHex("#000000"); }}
                className="px-4 py-2 rounded-lg border border-safariborder text-gray-400 text-xs hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowColorForm(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-neon transition-colors border border-dashed border-safariborder rounded-lg px-3 py-2 hover:border-neon/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Add color variant
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all disabled:opacity-50 active:scale-95"
        >
          {isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}