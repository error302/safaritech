"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Brand, getBrandIconUrl } from "@/lib/brands";

type Props = {
  brand: Brand;
  size?: number;
  className?: string;
};

export default function BrandLogo({ brand, size = 32, className }: Props) {
  const src = getBrandIconUrl(brand);

  if (!src) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-lg bg-safaridark text-[10px] font-bold text-gray-300",
          className
        )}
        style={{ width: size, height: size }}
      >
        {brand.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  const isLocal = src.startsWith("/");

  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={`${brand.name} logo`}
        width={size}
        height={size}
        className="object-contain max-h-full max-w-full"
        unoptimized={!isLocal}
      />
    </span>
  );
}
