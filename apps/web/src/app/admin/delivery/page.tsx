"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2, Truck, Store, MapPin, AlertCircle } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";

type ZoneForm = {
  name: string;
  type: "DELIVERY" | "PICKUP";
  fee: string;
  pickupPoint: string;
  isActive: boolean;
  sortOrder: string;
};

const emptyForm: ZoneForm = {
  name: "",
  type: "DELIVERY",
  fee: "0",
  pickupPoint: "",
  isActive: true,
  sortOrder: "0",
};

export default function AdminDeliveryPage() {
  const utils = trpc.useUtils();
  const { data: zones, isLoading } = trpc.delivery.adminGetAll.useQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ZoneForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = trpc.delivery.create.useMutation({
    onSuccess: () => {
      utils.delivery.adminGetAll.invalidate();
      utils.delivery.getActive.invalidate();
      setModalOpen(false);
    },
    onError: (err) => setError(err.message),
  });

  const updateMutation = trpc.delivery.update.useMutation({
    onSuccess: () => {
      utils.delivery.adminGetAll.invalidate();
      utils.delivery.getActive.invalidate();
      setModalOpen(false);
    },
    onError: (err) => setError(err.message),
  });

  const deleteMutation = trpc.delivery.delete.useMutation({
    onSuccess: () => {
      utils.delivery.adminGetAll.invalidate();
      utils.delivery.getActive.invalidate();
      setDeleteId(null);
    },
  });

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (z: { id: string; name: string; type: string; fee: number; pickupPoint: string | null; isActive: boolean; sortOrder: number }) => {
    setEditId(z.id);
    setForm({
      name: z.name,
      type: z.type as "DELIVERY" | "PICKUP",
      fee: String(z.fee),
      pickupPoint: z.pickupPoint || "",
      isActive: z.isActive,
      sortOrder: String(z.sortOrder),
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!form.name.trim()) {
      setError("Name is required");
      setSaving(false);
      return;
    }
    if (form.type === "PICKUP" && !form.pickupPoint.trim()) {
      setError("Pickup point address is required for PICKUP zones");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      fee: parseInt(form.fee, 10) || 0,
      pickupPoint: form.type === "PICKUP" ? form.pickupPoint.trim() : null,
      isActive: form.isActive,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };

    if (editId) {
      updateMutation.mutate({ id: editId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
    setSaving(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate({ id: deleteId });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const activeCount = zones?.filter(z => z.isActive).length ?? 0;
  const pickupCount = zones?.filter(z => z.type === "PICKUP").length ?? 0;
  const deliveryCount = zones?.filter(z => z.type === "DELIVERY").length ?? 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <AdminHeader
        title="Delivery Zones"
        description="Set delivery fees per destination and configure pickup points. Changes appear instantly at checkout."
        addNewLabel="New Zone"
        onAddNew={openNew}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <div className="rounded-xl border border-safariborder bg-safarigray p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Zones</div>
          <div className="text-xl font-bold text-white">{zones?.length ?? 0}</div>
        </div>
        <div className="rounded-xl border border-safariborder bg-safarigray p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Active</div>
          <div className="text-xl font-bold text-green-400">{activeCount}</div>
        </div>
        <div className="rounded-xl border border-safariborder bg-safarigray p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pickup Points</div>
          <div className="text-xl font-bold text-neon">{pickupCount}</div>
        </div>
        <div className="rounded-xl border border-safariborder bg-safarigray p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Zones</div>
          <div className="text-xl font-bold text-white">{deliveryCount}</div>
        </div>
      </div>

      {/* Zones table */}
      <div className="mt-6 rounded-xl border border-safariborder bg-safarigray overflow-hidden">
        {zones && zones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-safariborder bg-safaridark/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Fee</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Pickup Point</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Sort</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.id} className="border-b border-safariborder hover:bg-safaridark/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-white">{z.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${z.type === "PICKUP" ? "bg-neon/10 text-neon border border-neon/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                        {z.type === "PICKUP" ? <Store className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {z.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                      {z.fee === 0 ? <span className="text-green-400">FREE</span> : `KSh ${z.fee.toLocaleString()}`}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate hidden md:table-cell">{z.pickupPoint || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${z.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-gray-500/10 text-gray-500 border border-gray-500/20"}`}>
                        {z.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-400 hidden md:table-cell">{z.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(z)}
                          className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(z.id)}
                          className="p-2 rounded-lg hover:bg-red-950/30 text-gray-400 hover:text-red-400 transition-all"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Truck className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No delivery zones yet</h3>
            <p className="text-sm text-gray-500 mb-4">Add zones to configure delivery fees and pickup points.</p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              Create First Zone
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Zone" : "New Delivery Zone"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/30 border border-red-800 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Zone Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Nairobi (Within CBD)"
              className="w-full rounded-lg border border-safariborder bg-safaridark px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">Shown to customers at checkout</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "DELIVERY" | "PICKUP" })}
                className="w-full rounded-lg border border-safariborder bg-safaridark px-3 py-2.5 text-sm text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
              >
                <option value="DELIVERY">Delivery (ship to customer)</option>
                <option value="PICKUP">Pickup (customer collects)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Fee (KSh) {form.type === "PICKUP" && "(usually 0)"}
              </label>
              <input
                type="number"
                min="0"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
                className="w-full rounded-lg border border-safariborder bg-safaridark px-3 py-2.5 text-sm text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
              />
            </div>
          </div>

          {form.type === "PICKUP" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neon" /> Pickup Point Address
              </label>
              <textarea
                value={form.pickupPoint}
                onChange={(e) => setForm({ ...form, pickupPoint: e.target.value })}
                rows={3}
                required
                placeholder="Full address, opening hours, phone number"
                className="w-full rounded-lg border border-safariborder bg-safaridark px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
              />
              <p className="mt-1 text-xs text-gray-500">This text is shown to customers at checkout and on their order confirmation.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-safariborder bg-safaridark cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-300">Active</span>
                <p className="text-xs text-gray-500">Visible at checkout</p>
              </div>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-5 h-5 accent-neon"
              />
            </label>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="w-full rounded-lg border border-safariborder bg-safaridark px-3 py-2.5 text-sm text-white focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-safariborder bg-safaridark text-gray-300 font-medium text-sm hover:bg-safarigray transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editId ? "Save Changes" : "Create Zone"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Zone?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-950/30 border border-red-800">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-300">
              Permanently delete this delivery zone? Existing orders keep their recorded zone snapshot. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl border border-safariborder bg-safaridark text-gray-300 font-medium text-sm hover:bg-safarigray transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
