"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductForm from "@/components/admin/ProductForm";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  createdAt: Date;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: products, isLoading, refetch } = trpc.product.adminGetAll.useQuery({});
  const { data: categories } = trpc.product.adminGetCategories.useQuery();

  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => { utils.product.adminGetAll.invalidate(); },
  });

  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (row: ProductRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-safaridark shrink-0">
            {row.images ? (
              <img src={row.images.split(",")[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
            )}
          </div>
          <div>
            <p className="font-medium text-white">{row.name}</p>
            <p className="text-xs text-gray-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (row: ProductRow) => (
        <span className="text-gray-400">{row.category?.name || "Uncategorized"}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (row: ProductRow) => (
        <div>
          <p className="text-white font-medium">KSh {row.price.toLocaleString()}</p>
          {row.salePrice && row.salePrice < row.price && (
            <p className="text-xs text-red-500">Sale: KSh {row.salePrice.toLocaleString()}</p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (row: ProductRow) => (
        <span className={row.stock < 10 ? "text-yellow" : "text-gray-400"}>
          {row.stock}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: ProductRow) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => { setEditProduct(row); setOpenForm(true); }}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteConfirm(row.id)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-red-500 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
    <AdminHeader
      title="Products"
      description="Manage your product catalog"
      addNewLabel="Add Product"
      onAddNew={() => { setEditProduct(null); setOpenForm(true); }}
    />

      {/* Table */}
      <DataTable
        data={(products ?? []) as unknown as Record<string, unknown>[]}
        columns={columns as any}
        rowKey="id"
        emptyMessage="No products yet. Add your first product!"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={openForm}
        onClose={() => { setOpenForm(false); setEditProduct(null); }}
        title={editProduct ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <ProductForm
          product={editProduct}
          categories={(categories ?? []) as any}
          onSuccess={() => {
            setOpenForm(false);
            setEditProduct(null);
            utils.product.adminGetAll.invalidate();
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-400">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-safariborder text-gray-400 hover:text-white hover:border-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteConfirm) {
                  deleteProduct.mutate({ id: deleteConfirm });
                  setDeleteConfirm(null);
                }
              }}
              disabled={deleteProduct.isPending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50"
            >
              {deleteProduct.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}