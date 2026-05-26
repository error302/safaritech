"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ open, onClose, title, children, size = "md" }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClasses[size]} bg-safarigray border border-safariborder sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col animate-slide-up`}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-safariborder shrink-0">
          <h2 className="font-display font-bold text-lg text-white truncate pr-4">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-safaridark text-gray-400 hover:text-white transition-all shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-4 overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
