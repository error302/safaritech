"use client";

import { useState } from "react";
import { Shield, UserX } from "lucide-react";
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

  const { data: users, isLoading } = trpc.user.getAll.useQuery();

  const updateRole = trpc.user.updateRole.useMutation({
    onSuccess: () => { utils.user.getAll.invalidate(); },
  });

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedUser) {
                    updateRole.mutate({ userId: selectedUser.id, role: "CUSTOMER" });
                    setShowRoleModal(false);
                  }
                }}
                disabled={updateRole.isPending}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  selectedUser.role === "CUSTOMER"
                    ? "bg-neon text-black"
                    : "bg-safarigray text-gray-400 border border-safariborder hover:border-neon hover:text-white"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  if (selectedUser) {
                    updateRole.mutate({ userId: selectedUser.id, role: "ADMIN" });
                    setShowRoleModal(false);
                  }
                }}
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
    </div>
  );
}