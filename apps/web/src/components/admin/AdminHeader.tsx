"use client";

import { Plus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  addNewLabel?: string;
  onAddNew?: () => void;
};

export default function AdminHeader({ title, description, addNewLabel, onAddNew }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {addNewLabel || "Add New"}
          </button>
        )}
      </div>
    </div>
  );
}