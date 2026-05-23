"use client";

import { useState } from "react";
import { Eye, Trash2, Mail, MessageSquare, Clock } from "lucide-react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  createdAt: string;
};

type StatusFilter = "" | "NEW" | "READ" | "REPLIED";

const statusColors: Record<string, string> = {
  NEW: "text-yellow bg-yellow/10 border-yellow/20",
  READ: "text-blue bg-blue/10 border-blue/20",
  REPLIED: "text-neon bg-neon/10 border-neon/20",
};

const statusLabels: Record<string, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
};

export default function AdminMessagesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactRow | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<ContactRow | null>(null);

  const utils = trpc.useUtils();

  const { data: messages, isLoading } = trpc.contact.getAll.useQuery();

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      utils.contact.getAll.invalidate();
    },
    onError: (err) => {
      console.error("Failed to update message status:", err);
    },
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.getAll.invalidate();
      setShowDeleteModal(false);
      setDeletingMessage(null);
    },
    onError: (err) => {
      console.error("Failed to delete message:", err);
    },
  });

  const allMessages = (messages ?? []) as unknown as ContactRow[];

  const filteredMessages = statusFilter
    ? allMessages.filter((m) => m.status === statusFilter)
    : allMessages;

  function openDetailModal(message: ContactRow) {
    setSelectedMessage(message);
    setShowDetailModal(true);
    // Auto-mark as READ if it's NEW
    if (message.status === "NEW") {
      updateStatusMutation.mutate({ id: message.id, status: "READ" });
    }
  }

  function closeDetailModal() {
    setShowDetailModal(false);
    setSelectedMessage(null);
  }

  function openDeleteModal(message: ContactRow) {
    setDeletingMessage(message);
    setShowDeleteModal(true);
  }

  function handleStatusUpdate(status: string) {
    if (!selectedMessage) return;
    try {
      updateStatusMutation.mutate({ id: selectedMessage.id, status });
      setSelectedMessage({ ...selectedMessage, status: status as ContactRow["status"] });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  const columns: Column<ContactRow>[] = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (row) => (
        <span className="text-white text-sm line-clamp-1 max-w-[200px]">
          {row.subject}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusColors[row.status]}`}
        >
          {statusLabels[row.status]}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openDetailModal(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
            aria-label="View message"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-red-500 transition-all"
            aria-label="Delete message"
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
        <AdminHeader title="Messages" description="Manage contact form submissions" />
        <div className="bg-safarigray border border-safariborder rounded-2xl p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-safaridark rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const newCount = allMessages.filter((m) => m.status === "NEW").length;

  return (
    <div className="space-y-6">
      <AdminHeader title="Messages" description="Manage contact form submissions" />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "", label: "All" },
            { value: "NEW", label: `New${newCount > 0 ? ` (${newCount})` : ""}` },
            { value: "READ", label: "Read" },
            { value: "REPLIED", label: "Replied" },
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
          <p className="text-2xl font-bold text-white mt-1">{allMessages.length}</p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">New</p>
          <p className="text-2xl font-bold text-yellow mt-1">{newCount}</p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Read</p>
          <p className="text-2xl font-bold text-blue mt-1">
            {allMessages.filter((m) => m.status === "READ").length}
          </p>
        </div>
        <div className="bg-safarigray border border-safariborder rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Replied</p>
          <p className="text-2xl font-bold text-neon mt-1">
            {allMessages.filter((m) => m.status === "REPLIED").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable<ContactRow>
        data={filteredMessages}
        columns={columns}
        rowKey="id"
        emptyMessage="No messages found"
      />

      {/* Message Detail Modal */}
      <Modal
        open={showDetailModal}
        onClose={closeDetailModal}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon" />
                Sender Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="text-white font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-neon hover:underline text-sm"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                    <p className="text-white text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Received</p>
                  <p className="text-white text-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {new Date(selectedMessage.createdAt).toLocaleString("en-KE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-neon" />
                Message
              </h3>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-white font-medium">{selectedMessage.subject}</p>
              </div>
              <div className="border-t border-safariborder pt-3">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-safaridark border border-safariborder rounded-xl p-4 space-y-3">
              <h3 className="font-display font-semibold text-white">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {(["NEW", "READ", "REPLIED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(s)}
                    disabled={updateStatusMutation.isPending}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                      selectedMessage.status === s
                        ? "bg-neon text-black"
                        : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
                    }`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="px-4 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              <button
                onClick={() => {
                  closeDetailModal();
                  openDeleteModal(selectedMessage);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 font-semibold text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingMessage(null);
        }}
        title="Delete Message"
        size="sm"
      >
        {deletingMessage && (
          <div className="space-y-4">
            <p className="text-gray-400">
              Are you sure you want to delete the message from{" "}
              <span className="text-white font-semibold">{deletingMessage.name}</span>? This
              action cannot be undone.
            </p>
            <div className="bg-safaridark border border-safariborder rounded-xl p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
              <p className="text-white text-sm">{deletingMessage.subject}</p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingMessage(null);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 bg-safaridark border border-safariborder hover:border-neon hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate({ id: deletingMessage.id });
                }}
                disabled={deleteMutation.isPending}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all disabled:opacity-50 active:scale-95"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Message"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
