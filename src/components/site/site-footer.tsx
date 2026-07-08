"use client";

import * as React from "react";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { useViewRouter, ViewRoute } from "./view-router";
import { useSettings } from "./settings-context";

interface FooterLink {
  label: string;
  route: ViewRoute;
}

interface FooterCol {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLS: FooterCol[] = [
  {
    title: "Shop",
    links: [
      { label: "Smartphones", route: { view: "shop", query: { category: "smartphones" } } },
      { label: "Laptops", route: { view: "shop", query: { category: "laptops" } } },
      { label: "Audio", route: { view: "shop", query: { category: "audio" } } },
      { label: "Gaming", route: { view: "shop", query: { category: "gaming" } } },
      { label: "Wearables", route: { view: "shop", query: { category: "wearables" } } },
      { label: "Accessories", route: { view: "shop", query: { category: "accessories" } } },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", route: { view: "home", query: { _scroll: "features" } } },
      { label: "Press", route: { view: "home" } },
      { label: "Careers", route: { view: "home" } },
      { label: "Stories", route: { view: "home", query: { _scroll: "testimonials" } } },
      { label: "Blog", route: { view: "home" } },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", route: { view: "home" } },
      { label: "Shipping", route: { view: "home" } },
      { label: "Returns", route: { view: "home" } },
      { label: "Track order", route: { view: "home" } },
      { label: "Warranty", route: { view: "home" } },
      { label: "Contact us", route: { view: "home", query: { _scroll: "contact" } } },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", route: { view: "home" } },
      { label: "Terms of service", route: { view: "home" } },
      { label: "Cookie policy", route: { view: "home" } },
    ],
  },
];

export function SiteFooter() {
  const { navigate, route } = useViewRouter();
  const { get } = useSettings();

  const handleClick = (link: FooterLink) => (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (link.route.view === "home" && link.route.query?._scroll) {
      if (route.view !== "home") {
        navigate({ view: "home" });
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
    <footer className="bg-foreground text-background">
      <div className="container-premium py-16 md:py-20">
        {/* Top — brand + columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <button
              onClick={() => navigate({ view: "home" })}
              className="flex items-center gap-2.5 group"
              aria-label="Safaritech home"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-background/20 bg-background/5 text-background">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
                </svg>
              </span>
              <span className="font-display text-xl tracking-display font-medium text-background">
                Safari<span className="italic font-semibold text-accent">tech</span>
              </span>
            </button>

            <p className="mt-5 text-sm text-background/70 leading-relaxed max-w-sm">
              {get("footer.tagline", "Kenya's premier electronics marketplace. Curated, authentic, delivered nationwide — since 2019.")}
            </p>

            <div className="mt-7 space-y-2 text-sm text-background/80">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Visit
                </span>
                <span>{get("contact.address", "Westlands Business Centre, Waiyaki Way, Nairobi")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Call
                </span>
                <a href={`tel:${get("contact.phone", "+254700000000").replace(/\s/g, "")}`} className="hover:text-background transition-colors link-underline">
                  {get("contact.phone", "+254 700 000 000")}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Email
                </span>
                <a href={`mailto:${get("contact.email", "hello@safaritech.co.ke")}`} className="hover:text-background transition-colors link-underline">
                  {get("contact.email", "hello@safaritech.co.ke")}
                </a>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/15 bg-background/5 text-background/70 hover:text-background hover:border-background/30 transition-all"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/50">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href="#"
                        onClick={handleClick(l)}
                        className="text-sm text-background/80 hover:text-background transition-colors link-underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Hairline */}
        <div className="my-12 h-px bg-background/10" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-background/60">
            <span>{get("footer.copyright", "© 2026 Safaritech Ltd. All rights reserved.")}</span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
              All systems operational
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-background/50">
              We accept
            </span>
            <div className="flex items-center gap-1.5">
              {["M-Pesa", "Visa", "Mastercard", "PayPal"].map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center px-2.5 py-1 rounded-md border border-background/15 bg-background/5 text-[10px] font-medium text-background/80"
                >
                  {p}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate({ view: "admin" })}
              className="ml-4 font-mono text-[10px] uppercase tracking-widest text-background/30 hover:text-background/70 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-12 md:mt-16 border-t border-background/10 pt-8">
          <div
            className="font-display tracking-tightest text-background/10 select-none"
            style={{ fontSize: "clamp(4rem, 14vw, 12rem)", lineHeight: 0.9, letterSpacing: "-0.04em" }}
            aria-hidden="true"
          >
            Safari<span className="italic">tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
