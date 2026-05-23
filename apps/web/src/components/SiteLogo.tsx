"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

type Props = {
  href?: string;
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
};

export default function SiteLogo({
  href = "/",
  className = "",
  iconSize = 32,
  textSize = "text-xl",
  showText = true,
}: Props) {
  const { settings } = useSiteSettings();
  const logoUrl = settings?.logo_url || "/brands/safaritech-icon.svg";
  const storeName = settings?.store_name || "Safaritech";

  // Split store name to apply accent color to "tech" part if it's "Safaritech"
  const isSafaritech = storeName.toLowerCase() === "safaritech";
  const namePart = isSafaritech ? "Safari" : storeName;
  const accentPart = isSafaritech ? "tech" : "";

  return (
    <Link href={href} className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <Image
        src={logoUrl}
        alt={storeName}
        width={iconSize}
        height={iconSize}
        className="rounded-lg object-contain"
        priority
      />
      {showText && (
        <span className={`font-display font-bold ${textSize} tracking-tight text-white`}>
          {namePart}
          {accentPart && <span className="text-neon">{accentPart}</span>}
        </span>
      )}
    </Link>
  );
}
