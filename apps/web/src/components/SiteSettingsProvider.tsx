"use client";

import { createContext, useContext, type ReactNode } from "react";
import { trpc } from "@/utils/trpc";

type SiteSettings = Record<string, string> | null;

type SiteSettingsContextType = {
  settings: SiteSettings;
  isLoading: boolean;
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true,
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings, isLoading } = trpc.siteSetting.getAll.useQuery();

  return (
    <SiteSettingsContext.Provider value={{ settings: settings ?? null, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
