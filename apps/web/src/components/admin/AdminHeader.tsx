"use client";

import Link from "next/link";
import { Bell, Search, Plus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  addNewHref?: string;
  addNewLabel?: string;
};

export default function AdminHeader({ title, description, addNewHref, addNewLabel }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-safarigray border border-safariborder rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon w-48 md:w-64 transition-all"
          />
        </div>
        <button className="p-2 rounded-xl hover:bg-safarigray text-gray-400 hover:text-white border border-safariborder transition-all">
          <Bell className="w-5 h-5" />
        </button>
        {addNewHref && (
          <Link
            href={addNewHref}
            className="flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-semibold px-4 py-2 rounded-xl text-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {addNewLabel || "Add New"}
          </Link>
        )}
      </div>
    </div>
  );
}