"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  GripVertical,
  ImageIcon,
} from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

// Available icons for category selection
const availableIcons = [
  "Smartphone",
  "Laptop",
  "Gamepad2",
  "Headphones",
  "Watch",
  "Tablet",
  "Camera",
  "Tv",
  "Wifi",
  "HardDrive",
  "Home",
  "Package",
  "Monitor",
  "Cpu",
  "Mouse",
  "Keyboard",
  "Speaker",
  "Battery",
  "Zap",
  "Tag",
];

// Available gradients for category selection
const availableGradients = [
  { label: "Blue → Cyan", value: "from-blue-500/20 to-cyan-500/20" },
  { label: "Purple → Blue", value: "from-purple-500/20 to-blue-500/20" },
  { label: "Cyan → Green", value: "from-cyan-500/20 to-green-500/20" },
  { label: "Red → Orange", value: "from-red-600/20 to-orange-400/20" },
  { label: "Green → Yellow", value: "from-green-500/20 to-yellow-500/20" },
  { label: "Yellow → Amber", value: "from-yellow-500/20 to-amber-400/20" },
  { label: "Purple → Red", value: "from-purple-500/20 to-red-500/20" },
  { label: "Blue → Purple", value: "from-blue-500/20 to-purple-500/20" },
  { label: "Cyan → Cyan", value: "from-cyan-600/20 to-cyan-400/20" },
  { label: "Gray → Slate", value: "from-gray-500/20 to-slate-500/20" },
];

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  gradient: string;
  sortOrder: number;
}

const defaultForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  iconName: "Smartphone",
  gradient: "from-blue-500/20 to-cyan-500/20",
  sortOrder: 0,
};

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>({ ...defaultForm });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.getAll.useQuery();

  // Auto-generate slug from name
  useEffect(() => {
    if (!editingId && form.name) {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setForm((prev) => ({ ...prev, slug }));
    }
  }, [form.name, editingId]);

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      setSuccessMessage("Category created successfully!");
      setErrorMessage("");
      resetForm();
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to create category");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const updateMutation = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      setSuccessMessage("Category updated successfully!");
      setErrorMessage("");
      resetForm();
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to update category");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.getAll.invalidate();
      setSuccessMessage("Category deleted successfully!");
      setErrorMessage("");
      setDeleteConfirm(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to delete category");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const resetForm = () => {
    setForm({ ...defaultForm });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      iconName: cat.iconName || "Smartphone",
      gradient: cat.gradient || "from-blue-500/20 to-cyan-500/20",
      sortOrder: cat.sortOrder || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      setErrorMessage("Name and slug are required");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        image: form.image || null,
        iconName: form.iconName,
        gradient: form.gradient,
        sortOrder: form.sortOrder,
      });
    } else {
      createMutation.mutate({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        image: form.image || undefined,
        iconName: form.iconName,
        gradient: form.gradient,
        sortOrder: form.sortOrder,
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories for your store</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neon/10 border border-neon/20 text-neon text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-white mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Smartphones"
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. smartphones"
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">Auto-generated from name. Used in URLs.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of this category"
                rows={2}
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category Image</label>
              <ImageUploader
                value={form.image}
                onChange={(url: string) => setForm({ ...form, image: url })}
                multiple={false}
                uploadTo="cloudinary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Icon</label>
                <select
                  value={form.iconName}
                  onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Gradient</label>
                <select
                  value={form.gradient}
                  onChange={(e) => setForm({ ...form, gradient: e.target.value })}
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                >
                  {availableGradients.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                />
                <p className="text-xs text-gray-600 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-safariborder">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-safaridark border border-safariborder transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingId ? "Update Category" : "Create Category"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-safariborder animate-pulse" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((cat: any) => {
            const productCount = cat._count?.products || 0;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-4 bg-safarigray border border-safariborder rounded-xl px-4 py-3.5 hover:border-safariborder/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-safaridark border border-safariborder flex items-center justify-center shrink-0">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white text-sm truncate">{cat.name}</h3>
                    <span className="text-[10px] font-medium bg-neon/10 text-neon px-2 py-0.5 rounded-full">
                      {productCount} product{productCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    /{cat.slug}{cat.description ? ` — ${cat.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-white transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteConfirm === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate({ id: cat.id })}
                        className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 rounded-lg text-gray-400 text-xs hover:bg-safaridark"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-safarigray border border-safariborder rounded-2xl">
          <div className="w-16 h-16 bg-safaridark rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium">No categories yet</p>
          <p className="text-gray-600 text-sm mt-1">Add your first category to organize products</p>
        </div>
      )}
    </div>
  );
}
