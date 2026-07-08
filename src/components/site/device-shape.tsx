"use client";

import { ProductShape } from "./types";

interface Props {
  shape: ProductShape | string;
  accent: string;
  className?: string;
}

/**
 * Reusable SVG device illustration. Same visual language across cards,
 * product detail pages, and the cart drawer.
 */
export function DeviceShape({ shape, accent, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g style={{ color: accent }}>
        {shape === "phone" && (
          <>
            <rect x="85" y="30" width="30" height="80" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="89" y="38" width="22" height="60" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="104" r="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
          </>
        )}
        {shape === "laptop" && (
          <>
            <rect x="60" y="40" width="80" height="50" rx="4" fill={accent} fillOpacity="0.85" />
            <rect x="66" y="46" width="68" height="38" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <rect x="50" y="90" width="100" height="6" rx="3" fill={accent} fillOpacity="0.6" />
            <rect x="92" y="90" width="16" height="3" rx="1.5" fill="oklch(0.96 0.005 95)" fillOpacity="0.6" />
          </>
        )}
        {shape === "audio" && (
          <>
            <circle cx="80" cy="80" r="22" fill={accent} fillOpacity="0.85" />
            <circle cx="80" cy="80" r="10" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="130" cy="60" r="18" fill={accent} fillOpacity="0.7" />
            <circle cx="130" cy="60" r="8" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
            <path d="M75 60 Q 80 50 90 50" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}
        {shape === "gaming" && (
          <>
            <path
              d="M50 60 Q 50 50 65 50 L 135 50 Q 150 50 150 65 L 150 80 Q 150 90 140 90 L 130 90 Q 125 90 120 85 L 110 80 L 90 80 L 80 85 Q 75 90 70 90 L 60 90 Q 50 90 50 75 Z"
              fill={accent}
              fillOpacity="0.85"
            />
            <circle cx="80" cy="68" r="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="120" cy="68" r="4" fill="oklch(0.96 0.005 95)" fillOpacity="0.7" />
            <circle cx="100" cy="65" r="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.5" />
          </>
        )}
        {shape === "watch" && (
          <>
            <rect x="85" y="50" width="30" height="40" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="80" y="58" width="40" height="4" rx="2" fill={accent} fillOpacity="0.6" />
            <rect x="80" y="78" width="40" height="4" rx="2" fill={accent} fillOpacity="0.6" />
            <rect x="92" y="56" width="16" height="28" rx="2" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="70" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.8" />
          </>
        )}
        {shape === "accessory" && (
          <>
            <rect x="70" y="55" width="60" height="40" rx="6" fill={accent} fillOpacity="0.85" />
            <rect x="76" y="61" width="48" height="28" rx="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.4" />
            <circle cx="100" cy="75" r="8" fill={accent} fillOpacity="0.9" />
            <circle cx="100" cy="75" r="3" fill="oklch(0.96 0.005 95)" fillOpacity="0.8" />
            <line x1="55" y1="75" x2="68" y2="75" stroke={accent} strokeWidth="3" strokeLinecap="round" />
            <line x1="132" y1="75" x2="145" y2="75" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
