"use client";

import { useState } from "react";
import { trpc } from "@/utils/trpc";

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

export default function ProductForm({ product, categories, onSuccess }: Props) {
  const utils = trpc.useUtils();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [salePrice, setSalePrice] = useState(String(product?.salePrice ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [images, setImages] = useState(product?.images ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [error, setError] = useState("");

  const slugAuto = product?.slug ?? generateSlug(name);

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.adminGetAll.invalidate();
      onSuccess();
    },
    onError: (err) => setError(String(err)),
  });

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.adminGetAll.invalidate();
      onSuccess();
    },
    onError: (err) => setError(String(err)),
  });

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
      images: images.trim(),
      categoryId: categoryId || undefined,
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
      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Product Images</label>
        <input
          type="text"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="Image URL (comma-separated for multiple)"
          className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
        />
        <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              id="product-image-input"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("file", file);
                formData.append("uploadTo", "cloudinary");
                const res = await fetch("/api/upload", { method: "POST", body: formData });
                if (res.ok) {
                  const data = await res.json();
                  setImages(images ? `${images},${data.url}` : data.url);
                }
              }}
            />
            <label
              htmlFor="product-image-input"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-safariborder text-sm text-gray-400 hover:text-white hover:border-neon cursor-pointer transition-all"
            >
              Upload Image
            </label>
        </div>
        {images && (
          <div className="flex gap-2 mt-2">
            {images.split(",").filter(Boolean).map((url, i) => (
              <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-safariborder">
                <img src={url.trim()} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Name */}
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

      {/* Slug */}
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

      {/* Description */}
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

      {/* Prices */}
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

      {/* Stock & Category */}
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

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Submit */}
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