"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Menu, X, Search, ShoppingBag, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useViewRouter, ViewRoute } from "./view-router";
import { useCart } from "./cart-context";
import { useSettings } from "./settings-context";

interface NavLink {
  label: string;
  route: ViewRoute;
}

const NAV_LINKS: NavLink[] = [
  { label: "Shop", route: { view: "shop" } },
  { label: "Brands", route: { view: "home", query: { _scroll: "brands" } } },
  { label: "Why Safaritech", route: { view: "home", query: { _scroll: "features" } } },
  { label: "Stories", route: { view: "home", query: { _scroll: "testimonials" } } },
  { label: "Contact", route: { view: "home", query: { _scroll: "contact" } } },
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { navigate, route } = useViewRouter();
  const { count, open: openCart } = useCart();
  const { get } = useSettings();
  const logoUrl = get("site.logoUrl", "");
  const siteName = get("site.name", "Safaritech");

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavClick = (link: NavLink) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpen(false);
    if (link.route.view === "home" && link.route.query?._scroll) {
      // Stay home and scroll to anchor
      if (route.view !== "home") {
        navigate({ view: "home" });
        // Wait for home to mount, then scroll
        setTimeout(() => {
          const el = document.getElementById(link.route.query!._scroll as string);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const el = document.getElementById(link.route.query._scroll as string);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(link.route);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <nav className="container-premium flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <button
          onClick={() => navigate({ view: "home" })}
          className="flex items-center gap-2.5 group"
          aria-label="Safaritech home"
        >
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-9 w-auto" />
          ) : (
            <>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
                </svg>
              </span>
              <span className="font-display text-xl tracking-display font-medium text-foreground">
                {siteName.startsWith("Safari") ? (
                  <>
                    Safari<span className="italic font-semibold text-accent">{siteName.slice(5)}</span>
                  </>
                ) : (
                  siteName
                )}
              </span>
            </>
          )}
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href="#"
              onClick={onNavClick(l)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex h-9 w-9"
            aria-label="Search"
            onClick={() => navigate({ view: "shop" })}
          >
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

          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex h-9 w-9 relative"
            aria-label={`Cart with ${count} items`}
            onClick={openCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-mono font-medium">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Button>

          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex h-9 px-4 btn-shimmer rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <a href="#" onClick={onNavClick({ label: "Shop now", route: { view: "shop" } })}>
              Shop now
            </a>
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
          open ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container-premium py-6 flex flex-col gap-1">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.label}
              href="#"
              onClick={onNavClick(l)}
              className="flex items-center justify-between py-3.5 text-base font-medium text-foreground border-b border-border/40 last:border-0"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {l.label}
              <span className="text-muted-foreground text-sm">→</span>
            </a>
          ))}
          <div className="flex items-center gap-2 mt-4">
            <Button
              asChild
              className="flex-1 h-11 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <a href="#" onClick={onNavClick({ label: "Shop now", route: { view: "shop" } })}>
                Shop now
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 rounded-full"
              aria-label="Open cart"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-mono font-medium">
                  {count}
                </span>
              )}
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
