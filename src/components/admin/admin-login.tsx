"use client";

import * as React from "react";
import { Lock, ArrowRight, Eye, EyeOff, Mail, AlertCircle } from "lucide-react";
import { useAdminAuth } from "./admin-auth";
import { useViewRouter } from "../site/view-router";

export function AdminLogin() {
  const { login, loginWithToken } = useAdminAuth();
  const { navigate } = useViewRouter();
  const [email, setEmail] = React.useState("admin@safaritech.co.ke");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      // Try NextAuth credentials login first
      const ok = await login(email.trim(), password);
      if (!ok) {
        // Fallback to legacy token login
        const legacyOk = loginWithToken(password);
        if (!legacyOk) {
          setError("Invalid email or password. Try the demo credentials below.");
          setPassword("");
        }
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <button
          onClick={() => navigate({ view: "home" })}
          className="flex items-center gap-2.5 mb-8 mx-auto"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
            </svg>
          </span>
          <span className="font-display text-xl tracking-display font-medium text-foreground">
            Safari<span className="italic font-semibold text-accent">tech</span>
          </span>
        </button>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-soft)]">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary text-foreground mb-5">
            <Lock className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl text-foreground tracking-tight">
            Admin access
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Sign in with your admin credentials to manage products, orders, coupons, and site content.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@safaritech.co.ke"
                  autoComplete="email"
                  autoFocus
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-flex h-3 w-3 rounded-full border-2 border-background/40 border-t-background animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
              <span className="text-accent">Demo credentials:</span><br />
              Email: admin@safaritech.co.ke<br />
              Password: safaritech-admin-2026
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate({ view: "home" })}
          className="mt-6 mx-auto block text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to store
        </button>
      </div>
    </div>
  );
}
