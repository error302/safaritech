"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Brand } from "@/lib/brands";

type Props = {
  brand: Brand;
  size?: number;
  className?: string;
};

export default function BrandLogo({ brand, size = 32, className }: Props) {
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
      />
    </span>
  );
}
