"use client";

import type { ReactNode } from "react";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import PageTransition from "@/components/PageTransition";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const { completeOnboarding } = useOnboarding();

  return (
    <>
      <OnboardingOverlay onComplete={completeOnboarding} />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
