"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";

type CouponRow = {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

type CouponFormData = {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minOrderValue: string;
  maxDiscount: string;
  usageLimit: string;
  expiresAt: string;
  isActive: boolean;
};

const emptyForm: CouponFormData = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  usageLimit: "",
  expiresAt: "",
  isActive: true,
};

type StatusFilter = "" | "active" | "expired" | "inactive";

const statusColors: Record<string, string> = {
  active: "text-neon bg-neon/10 border-neon/20",
  expired: "text-red-500 bg-red-500/10 border-red-500/20",
  inactive: "text-gray-500 bg-gray-500/10 border-gray-500/20",
};

function getCouponStatus(coupon: CouponRow): "active" | "expired" | "inactive" {
  if (!coupon.isActive) return "inactive";
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return "expired";
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return "expired";
  return "active";
}

export default function AdminCouponsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRow | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponRow | null>(null);
  const [form, setForm] = useState<CouponFormData>(emptyForm);
  const [formError, setFormError] = useState("");

  const utils = trpc.useUtils();

  const { data: coupons, isLoading } = trpc.coupon.getAll.useQuery();

  const createMutation = trpc.coupon.create.useMutation({
    onSuccess: () => {
      utils.coupon.getAll.invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err.message || "Failed to create coupon");
    },
  });

  const updateMutation = trpc.coupon.update.useMutation({
    onSuccess: () => {
      utils.coupon.getAll.invalidate();
      closeModal();
    },
    onError: (err) => {
      setFormError(err.message || "Failed to update coupon");
    },
  });

  const deleteMutation = trpc.coupon.delete.useMutation({
    onSuccess: () => {
      utils.coupon.getAll.invalidate();
      setShowDeleteModal(false);
      setDeletingCoupon(null);
    },
    onError: (err) => {
      console.error("Failed to delete coupon:", err);
    },
  });

  const allCoupons = (coupons ?? []) as unknown as CouponRow[];

  const filteredCoupons = statusFilter
    ? allCoupons.filter((c) => getCouponStatus(c) === statusFilter)
    : allCoupons;

  function openCreateModal() {
    setEditingCoupon(null);
    setForm(emptyForm);
    setFormError("");
    setShowFormModal(true);
  }

  function openEditModal(coupon: CouponRow) {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      expiresAt: coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : "",
      isActive: coupon.isActive,
    });
    setFormError("");
    setShowFormModal(true);
  }

  function closeModal() {
    setShowFormModal(false);
    setEditingCoupon(null);
    setForm(emptyForm);
    setFormError("");
  }

  function openDeleteModal(coupon: CouponRow) {
    setDeletingCoupon(coupon);
    setShowDeleteModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.code.trim()) {
      setFormError("Coupon code is required");
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      setFormError("Discount value must be greater than 0");
      return;
    }
    if (form.discountType === "PERCENTAGE" && Number(form.discountValue) > 100) {
      setFormError("Percentage discount cannot exceed 100%");
      return;
    }

    try {
      if (editingCoupon) {
        updateMutation.mutate({
          id: editingCoupon.id,
          code: form.code.trim(),
          description: form.description.trim() || undefined,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          expiresAt: form.expiresAt || undefined,
          isActive: form.isActive,
        });
      } else {
        createMutation.mutate({
          code: form.code.trim(),
          description: form.description.trim() || undefined,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          expiresAt: form.expiresAt || undefined,
        });
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
    }
  }

  const columns: Column<CouponRow>[] = [
    {
      key: "code",
      label: "Code",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-neon shrink-0" />
          <span className="font-mono font-semibold text-white tracking-wider">
            {row.code}
          </span>
        </div>
      ),
    },
    {
      key: "discountType",
      label: "Type",
      render: (row) => (
        <span className="flex items-center gap-1.5 text-sm text-gray-400">
          {row.discountType === "PERCENTAGE" ? (
            <Percent className="w-3.5 h-3.5" />
          ) : (
            <DollarSign className="w-3.5 h-3.5" />
          )}
          {row.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}
        </span>
      ),
    },
    {
      key: "discountValue",
      label: "Value",
      render: (row) => (
        <span className="text-white font-medium">
          {row.discountType === "PERCENTAGE"
            ? `${row.discountValue}%`
            : `KSh ${row.discountValue.toLocaleString()}`}
        </span>
      ),
    },
    {
      key: "minOrderValue",
      label: "Min Order",
      render: (row) => (
        <span className="text-gray-400 text-sm">
          {row.minOrderValue ? `KSh ${row.minOrderValue.toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      key: "usedCount",
      label: "Usage",
      render: (row) => (
        <span className="text-sm">
          <span className="text-white font-medium">{row.usedCount}</span>
          <span className="text-gray-500">
            {row.usageLimit ? ` / ${row.usageLimit}` : " / ∞"}
          </span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const status = getCouponStatus(row);
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${statusColors[status]}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "expiresAt",
      label: "Expires",
      render: (row) => (
        <span className="text-gray-500 text-sm">
          {row.expiresAt
            ? new Date(row.expiresAt).toLocaleDateString("en-KE")
            : "Never"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
            aria-label="Edit coupon"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-red-500 transition-all"
            aria-label="Delete coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Coupons" description="Manage discount coupons" />
        <div className="bg-safarigray border border-safariborder rounded-2xl p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-safaridark rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Coupons"
        description="Manage discount coupons"
        onAddNew={openCreateModal}
        addNewLabel="New Coupon"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "", label: "All" },
            { value: "active", label: "Active" },
            { value: "expired", label: "Expired" },
            { value: "inactive", label: "Inactive" },
          ] as const
        ).map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value === statusFilter ? "" : f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              f.value === statusFilter
                ? "bg-neon text-black"
                : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{allCoupons.length}</p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-neon mt-1">
            {allCoupons.filter((c) => getCouponStatus(c) === "active").length}
          </p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Expired</p>
          <p className="text-2xl font-bold text-red-500 mt-1">
            {allCoupons.filter((c) => getCouponStatus(c) === "expired").length}
          </p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Inactive</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">
            {allCoupons.filter((c) => getCouponStatus(c) === "inactive").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable<CouponRow>
        data={filteredCoupons}
        columns={columns}
        rowKey="id"
        emptyMessage="No coupons found"
      />

      {/* Create / Edit Modal */}
      <Modal
        open={showFormModal}
        onClose={closeModal}
        title={editingCoupon ? "Edit Coupon" : "Create Coupon"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-500">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SUMMER2024"
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all uppercase"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm({ ...form, discountType: e.target.value as "PERCENTAGE" | "FIXED" })
                }
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon transition-all"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (KSh)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "PERCENTAGE" ? "e.g. 15" : "e.g. 500"}
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
              />
            </div>

            {/* Min Order Value */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Min Order Value
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.minOrderValue}
                onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                placeholder="No minimum"
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
              />
            </div>

            {/* Max Discount */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Max Discount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                placeholder="No limit"
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                min="0"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Unlimited"
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon transition-all"
              />
            </div>

            {/* Is Active - only in edit mode */}
            {editingCoupon && (
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-safariborder bg-safaridark text-neon focus:ring-neon focus:ring-offset-0"
                  />
                  <span className="text-sm font-medium text-white">Active</span>
                </label>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional coupon description..."
              rows={3}
              className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-safaridark border border-safariborder hover:border-neon hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all disabled:opacity-50 active:scale-95"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingCoupon
                ? "Update Coupon"
                : "Create Coupon"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCoupon(null);
        }}
        title="Delete Coupon"
        size="sm"
      >
        {deletingCoupon && (
          <div className="space-y-4">
            <p className="text-gray-400">
              Are you sure you want to delete the coupon{" "}
              <span className="text-white font-mono font-semibold">
                {deletingCoupon.code}
              </span>
              ? This action cannot be undone.
            </p>
            {deletingCoupon.usedCount > 0 && (
              <div className="bg-yellow/10 border border-yellow/20 rounded-xl px-4 py-3 text-sm text-yellow">
                Warning: This coupon has been used {deletingCoupon.usedCount} time
                {deletingCoupon.usedCount > 1 ? "s" : ""}.
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCoupon(null);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-safaridark border border-safariborder hover:border-neon hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate({ id: deletingCoupon.id });
                }}
                disabled={deleteMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 active:scale-95"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Coupon"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
