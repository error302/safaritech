"use client";

import { useState } from "react";
import { Shield, UserX, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

export default function AdminUsersPage() {
  const utils = trpc.useUtils();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const { data: users, isLoading } = trpc.user.getAll.useQuery();

  const updateRole = trpc.user.updateRole.useMutation({
    onSuccess: () => { utils.user.getAll.invalidate(); },
  });

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<"ADMIN" | "CUSTOMER" | null>(null);

  const handleRoleClick = (role: "ADMIN" | "CUSTOMER") => {
    if (!selectedUser) return;
    // Prevent self-demotion
    if (selectedUser.id === currentUserId && selectedUser.role === "ADMIN" && role !== "ADMIN") {
      return;
    }
    setPendingRole(role);
    setShowConfirmModal(true);
  };

  const confirmRoleChange = () => {
    if (!selectedUser || !pendingRole) return;
    updateRole.mutate({ userId: selectedUser.id, role: pendingRole });
    setShowConfirmModal(false);
    setShowRoleModal(false);
    setPendingRole(null);
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (row: UserRow) => (
        <div>
          <p className="font-medium text-white">{row.name || "No name"}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row: UserRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          row.role === "ADMIN"
            ? "bg-neon/10 text-neon border-neon/20"
            : "bg-safarigray text-gray-400 border-safariborder"
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (row: UserRow) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString("en-KE")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row: UserRow) => (
        <button
          onClick={() => { setSelectedUser(row); setShowRoleModal(true); }}
          className="p-2 rounded-lg hover:bg-safaridark text-gray-400 hover:text-neon transition-all"
        >
          <Shield className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader title="Users" description="Manage customer accounts" />

      <DataTable
        data={(users ?? []) as unknown as Record<string, unknown>[]}
        columns={columns as any}
        rowKey="id"
        emptyMessage="No users found"
      />

      <Modal
        open={showRoleModal}
        onClose={() => { setShowRoleModal(false); setSelectedUser(null); }}
        title="Update User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-safaridark border border-safariborder rounded-xl p-4">
              <p className="text-white font-medium">{selectedUser.name || "No name"}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <p className="text-xs text-gray-600 mt-1">Current role: <span className="text-neon font-semibold">{selectedUser.role}</span></p>
            </div>

            {selectedUser.id === currentUserId && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">You cannot change your own role. Ask another admin to do this.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleRoleClick("CUSTOMER")}
                disabled={updateRole.isPending || selectedUser.id === currentUserId}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  selectedUser.role === "CUSTOMER"
                    ? "bg-neon text-black"
                    : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleClick("ADMIN")}
                disabled={updateRole.isPending}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  selectedUser.role === "ADMIN"
                    ? "bg-neon text-black"
                    : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmModal}
        onClose={() => { setShowConfirmModal(false); setPendingRole(null); }}
        title="Confirm Role Change"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Are you sure you want to change <span className="text-white font-medium">{selectedUser?.name || selectedUser?.email}</span>&apos;s role to <span className="text-neon font-semibold">{pendingRole}</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setShowConfirmModal(false); setPendingRole(null); }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-safariborder text-gray-400 hover:text-white hover:border-white transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmRoleChange}
              disabled={updateRole.isPending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-semibold text-sm transition-all disabled:opacity-50"
            >
              {updateRole.isPending ? "Updating..." : "Confirm"}
            </button>
          </div>
          {updateRole.error && (
            <p className="text-xs text-red-500">{updateRole.error.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}