"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface AdminAuthValue {
  /** NextAuth session (null if not logged in) */
  session: ReturnType<typeof useSession>["data"];
  /** True when an admin NextAuth session is active */
  isAuthed: boolean;
  /** Loading state while session is being fetched */
  loading: boolean;
  /** Login with email + password via NextAuth credentials provider */
  login: (email: string, password: string) => Promise<boolean>;
  /** Sign out of NextAuth */
  logout: () => void;
  /** Fetch wrapper for authenticated admin requests */
  adminFetch: (url: string, opts?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = React.createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const login = React.useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return Boolean(result?.ok && !result.error);
  }, []);

  const logout = React.useCallback(() => {
    void signOut({ redirect: false });
  }, []);

  const adminFetch = React.useCallback((url: string, opts?: RequestInit) => {
    return fetch(url, { ...opts, credentials: "same-origin" });
  }, []);

  const isAuthed =
    status === "authenticated" && session?.user?.role === "ADMIN";
  const loading = status === "loading";

  const value = React.useMemo(
    () => ({
      session,
      isAuthed,
      loading,
      login,
      logout,
      adminFetch,
    }),
    [session, isAuthed, loading, login, logout, adminFetch]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
