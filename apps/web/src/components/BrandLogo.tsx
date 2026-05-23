"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { type Brand } from "@/lib/brands";

type Props = {
  brand: Brand;
  size?: number;
  className?: string;
};

export default function BrandLogo({ brand, size = 32, className }: Props) {
  const [imgError, setImgError] = useState(false);

  // Fallback: show brand initial with iconColor background
  if (imgError) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-lg font-bold text-white",
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: `#${brand.iconColor || "00FF9F"}20`,
          fontSize: size * 0.4,
          color: `#${brand.iconColor || "00FF9F"}`,
        }}
      >
        {brand.name.charAt(0)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={brand.logoSrc}
        alt={`${brand.name} logo`}
        width={size}
        height={size}
        className="object-contain max-h-full max-w-full"
        onError={() => setImgError(true)}
      />
    </span>
  );
}
