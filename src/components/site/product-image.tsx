"use client";

import * as React from "react";
import { DeviceShape } from "./device-shape";

interface Props {
  imageUrl: string | null | undefined;
  shape: string;
  accent: string;
  alt: string;
  className?: string;
  /** When true, uses object-cover for real photos; when false, uses contain for SVG */
  fit?: "cover" | "contain";
}

/**
 * Renders a real product photo if available, falls back to the SVG DeviceShape.
 * Used across product cards, product detail, cart, etc.
 */
export function ProductImage({ imageUrl, shape, accent, alt, className, fit = "cover" }: Props) {
  const [imgError, setImgError] = React.useState(false);

  if (imageUrl && !imgError) {
    return (
       
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        style={{ objectFit: fit }}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback to SVG
  return (
    <div className={className} style={{ position: "relative" }}>
      <DeviceShape shape={shape} accent={accent} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
