"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Search, ShoppingBag, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Shop", href: "#collections" },
  { label: "Brands", href: "#brands" },
  { label: "Why Safaritech", href: "#features" },
  { label: "Stories", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="container-premium flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Safaritech home">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
            </svg>
          </span>
          <span className="font-display text-xl tracking-display font-medium text-foreground">
            Safari<span className="italic font-semibold text-accent">tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex h-9 w-9" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex h-9 w-9"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <Button variant="ghost" size="icon" className="hidden md:inline-flex h-9 w-9 relative" aria-label="Cart">
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </Button>

          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex h-9 px-4 btn-shimmer rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href="#collections">Shop now</Link>
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container-premium py-6 flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3.5 text-base font-medium text-foreground border-b border-border/40 last:border-0"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
              <span className="text-muted-foreground text-sm">→</span>
            </Link>
          ))}
          <div className="flex items-center gap-2 mt-4">
            <Button
              asChild
              className="flex-1 h-11 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="#collections" onClick={() => setOpen(false)}>Shop now</Link>
            </Button>
            {mounted && (
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
