"use client";

import * as React from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

const LEGACY_TOKEN_KEY = "safaritech.admin.token.v1";

interface AdminAuthValue {
  /** NextAuth session (null if not logged in) */
  session: ReturnType<typeof useSession>["data"];
  /** True if authenticated via NextAuth OR legacy token */
  isAuthed: boolean;
  /** Loading state while session is being fetched */
  loading: boolean;
  /** Login with email + password via NextAuth credentials provider */
  login: (email: string, password: string) => Promise<boolean>;
  /** Login with legacy token (backward compat for existing admin APIs) */
  loginWithToken: (password: string) => boolean;
  /** Sign out of NextAuth + clear legacy token */
  logout: () => void;
  /** Legacy token (for X-Admin-Token header on admin API routes) */
  token: string | null;
  /** Fetch wrapper that auto-injects the admin token header */
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = React.createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LEGACY_TOKEN_KEY);
      if (stored) setToken(stored);
    } catch {
      // ignore
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok && !result.error) {
      // Also set the legacy token for backward compat with admin API routes
      // The admin API routes check X-Admin-Token === ADMIN_TOKEN env var
      const legacyToken = "safaritech-admin-2026";
      setToken(legacyToken);
      try {
        localStorage.setItem(LEGACY_TOKEN_KEY, legacyToken);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, []);

  const loginWithToken = React.useCallback((password: string): boolean => {
    const envToken = "safaritech-admin-2026";
    if (password === envToken) {
      setToken(password);
      try {
        localStorage.setItem(LEGACY_TOKEN_KEY, password);
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }, []);

  const logout = React.useCallback(() => {
    signOut({ redirect: false });
    setToken(null);
    try {
      localStorage.removeItem(LEGACY_TOKEN_KEY);
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

  const isAuthed = status === "authenticated" || !!token;
  const loading = status === "loading";

  const value = React.useMemo(
    () => ({
      session,
      isAuthed,
      loading,
      login,
      loginWithToken,
      logout,
      token,
      adminFetch,
    }),
    [session, isAuthed, loading, login, loginWithToken, logout, token, adminFetch]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
