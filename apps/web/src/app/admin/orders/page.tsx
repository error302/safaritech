"use client";

import { useState } from "react";
import { Eye, Filter } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

const statusColors: Record<string, string> = {
  PENDING: "text-yellow bg-yellow/10 border-yellow/20",
  PROCESSING: "text-blue bg-blue/10 border-blue/20",
  SHIPPED: "text-purple bg-purple/10 border-purple/20",
  DELIVERED: "text-neon bg-neon/10 border-neon/20",
  CANCELLED: "text-red-500 bg-red-500/10 border-red-500/20",
  PAID: "text-neon bg-neon/10 border-neon/20",
  FAILED: "text-red-500 bg-red-500/10 border-red-500/20",
  REFUNDED: "text-gray-500 bg-gray-500/10 border-gray-500/20",
};

type OrderRow = {
  id: string;
  total: number;
  subtotal: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
  shippingAddress: { city: string } | null;
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [viewOrder, setViewOrder] = useState(false);

  const utils = trpc.useUtils();

  const { data, isLoading, refetch } = trpc.order.adminGetAll.useQuery({
    status: statusFilter || undefined,
  });

  const orders = (data?.orders ?? []) as unknown as OrderRow[];

  const updateStatus = trpc.order.adminUpdateStatus.useMutation({
    onSuccess: () => {
      utils.order.adminGetAll.invalidate();
      setViewOrder(false);
      setSelectedOrder(null);
    },
  });

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (row: OrderRow) => (
        <span className="font-mono text-sm text-white">{row.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (row: OrderRow) => (
        <div>
          <p className="text-white font-medium">{row.user?.name || "Guest"}</p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row: OrderRow) => (
        <span className="text-white font-medium">KSh {row.total.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: OrderRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${statusColors[row.status]}`}>
          {row.status.toLowerCase()}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (row: OrderRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${statusColors[row.paymentStatus]}`}>
          {row.paymentStatus.toLowerCase()}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row: OrderRow) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString("en-KE")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: OrderRow) => (
        <button
          onClick={() => { setSelectedOrder(row); setViewOrder(true); }}
          className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders"
        description="Manage and track all orders"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !statusFilter
              ? "bg-neon text-black"
              : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
          }`}
        >
          All
        </button>
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === statusFilter ? "" : s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              s === statusFilter
                ? "bg-neon text-black"
                : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
            }`}
          >
            {s.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={orders as unknown as Record<string, unknown>[]}
        columns={columns as any}
        rowKey="id"
        emptyMessage="No orders found"
      />

      {/* Order Detail Modal */}
      <Modal
        open={viewOrder}
        onClose={() => { setViewOrder(false); setSelectedOrder(null); }}
        title={`Order ${selectedOrder?.id.slice(0, 8)}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Status Update */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Payment Status</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value })}
                  className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-2">
              <h3 className="font-display font-semibold text-white mb-3">Customer</h3>
              <p className="text-sm text-white">{selectedOrder.user?.name || "Guest"}</p>
              <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
              <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.city}</p>
            </div>

            {/* Order Summary */}
            <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-white">KSh {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="text-white font-bold">KSh {selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="text-white uppercase">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={() => {
                updateStatus.mutate({
                  orderId: selectedOrder.id,
                  status: selectedOrder.status as any,
                  paymentStatus: selectedOrder.paymentStatus as any,
                });
              }}
              disabled={updateStatus.isPending}
              className="w-full px-4 py-3 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold transition-all disabled:opacity-50"
            >
              {updateStatus.isPending ? "Updating..." : "Update Order Status"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}