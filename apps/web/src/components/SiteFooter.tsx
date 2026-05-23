"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/Footer";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
