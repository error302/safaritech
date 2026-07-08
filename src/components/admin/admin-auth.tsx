"use client";

import * as React from "react";

const STORAGE_KEY = "safaritech.admin.token.v1";

interface AdminAuthValue {
  token: string | null;
  isAuthed: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = React.createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setToken(stored);
    } catch {
      // ignore
    }
  }, []);

  const login = React.useCallback((password: string): boolean => {
    const envToken = "safaritech-admin-2026";
    if (password === envToken) {
      setToken(password);
      try {
        localStorage.setItem(STORAGE_KEY, password);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const adminFetch = React.useCallback(
    (url: string, opts?: RequestInit) => {
      const headers = new Headers(opts?.headers);
      if (token) headers.set("x-admin-token", token);
      return fetch(url, { ...opts, headers });
    },
    [token]
  );

  const value = React.useMemo(
    () => ({ token, isAuthed: !!token, login, logout, adminFetch }),
    [token, login, logout, adminFetch]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
