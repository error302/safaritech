"use client";

import type { ReactNode } from "react";
import PageTransition from "@/components/PageTransition";

export default function LayoutContent({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
