"use client";

import * as React from "react";

type Settings = Record<string, string>;

interface SettingsValue {
  settings: Settings;
  loading: boolean;
  /** Get a setting value with a fallback default */
  get: (key: string, fallback?: string) => string;
  /** Force refresh settings from server (used after admin saves) */
  refresh: () => Promise<void>;
}

const SettingsContext = React.createContext<SettingsValue | null>(null);

const STORAGE_KEY = "safaritech.settings.cache.v1";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>({});
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSettings(json.settings ?? {});
      // Cache for instant subsequent loads
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.settings ?? {}));
      } catch {
        // ignore
      }
    } catch (e) {
      console.error("SettingsProvider load failed:", e);
      // Fall back to cached version if available
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setSettings(JSON.parse(cached));
      } catch {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Load cached version first for instant render
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setSettings(JSON.parse(cached));
        setLoading(false);
      }
    } catch {
      // ignore
    }
    // Always fetch fresh from server
    load();
  }, [load]);

  const get = React.useCallback(
    (key: string, fallback?: string) => {
      const v = settings[key];
      if (v !== undefined && v !== null && v !== "") return String(v);
      return fallback ?? "";
    },
    [settings]
  );

  const value = React.useMemo(
    () => ({ settings, loading, get, refresh: load }),
    [settings, loading, get, load]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
