"use client";

import { cn } from "@/lib/utils";

export type ProductCondition = "NEW" | "EXUK" | "REFURBISHED";

interface ConditionConfig {
  label: string;
  shortLabel: string;
  badgeClass: string;
  dotClass: string;
  description: string;
  warrantyMonths: number;
}

export const CONDITIONS: Record<ProductCondition, ConditionConfig> = {
  NEW: {
    label: "New",
    shortLabel: "New",
    badgeClass: "bg-accent/10 border-accent/30 text-accent",
    dotClass: "bg-accent",
    description: "Brand new, sealed in original packaging with full manufacturer warranty.",
    warrantyMonths: 12,
  },
  EXUK: {
    label: "Ex-UK",
    shortLabel: "Ex-UK",
    badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-600",
    dotClass: "bg-blue-500",
    description: "Pre-owned device imported from the UK. Tested, certified, and restored to excellent working condition. Excellent value for money.",
    warrantyMonths: 3,
  },
  REFURBISHED: {
    label: "Refurbished",
    shortLabel: "Refurb",
    badgeClass: "bg-amber-500/10 border-amber-500/30 text-amber-600",
    dotClass: "bg-amber-500",
    description: "Professionally refurbished to like-new condition. Fully tested, cleaned, and restored with genuine parts. Backed by our 3-month warranty.",
    warrantyMonths: 3,
  },
};

export function getCondition(condition: string | null | undefined): ConditionConfig {
  if (condition && condition in CONDITIONS) {
    return CONDITIONS[condition as ProductCondition];
  }
  return CONDITIONS.NEW;
}

interface ConditionBadgeProps {
  condition: string | null | undefined;
  size?: "sm" | "md" | "lg";
  showWarranty?: boolean;
  className?: string;
}

/**
 * Condition badge — shows "New", "Ex-UK", or "Refurbished" with color coding.
 * Optionally shows the warranty period (e.g. "12-month warranty").
 */
export function ConditionBadge({
  condition,
  size = "sm",
  showWarranty = false,
  className,
}: ConditionBadgeProps) {
  const config = getCondition(condition);

  const sizeClasses = {
    sm: "text-[9px] px-1.5 py-0.5 gap-1",
    md: "text-[10px] px-2 py-1 gap-1.5",
    lg: "text-xs px-2.5 py-1.5 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-mono uppercase tracking-widest font-medium",
        config.badgeClass,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {size === "sm" ? config.shortLabel : config.label}
      {showWarranty && (
        <span className="ml-1 opacity-70">
          · {config.warrantyMonths}mo warranty
        </span>
      )}
    </span>
  );
}

/**
 * Warranty badge — shows just the warranty period (e.g. "12-month warranty")
 */
export function WarrantyBadge({
  warrantyMonths,
  condition,
  size = "sm",
  className,
}: {
  warrantyMonths: number;
  condition?: string | null | undefined;
  size?: "sm" | "md";
  className?: string;
}) {
  const condConfig = getCondition(condition);
  const isLong = warrantyMonths >= 12;

  const sizeClasses = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] px-2 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-mono uppercase tracking-widest font-medium",
        isLong
          ? "bg-accent/10 border-accent/30 text-accent"
          : "bg-amber-500/10 border-amber-500/30 text-amber-600",
        sizeClasses[size],
        className
      )}
    >
      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7v6c0 5 3.5 9.5 9 11 5.5-1.5 9-6 9-11V7l-9-5z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {warrantyMonths}-month warranty
    </span>
  );
}
