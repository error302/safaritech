"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, ArrowUpRight } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Shop",
    links: [
      { label: "Smartphones", href: "#collections" },
      { label: "Laptops", href: "#collections" },
      { label: "Audio", href: "#collections" },
      { label: "Gaming", href: "#collections" },
      { label: "Wearables", href: "#collections" },
      { label: "Accessories", href: "#collections" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Press", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Stores", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Track order", href: "#" },
      { label: "Warranty", href: "#" },
      { label: "Contact us", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Cookie policy", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-premium py-16 md:py-20">
        {/* Top — brand + columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Safaritech home">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-background/20 bg-background/5 text-background">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 20 L12 4 L19 20 L12 15 Z" fill="currentColor"/>
                </svg>
              </span>
              <span className="font-display text-xl tracking-display font-medium text-background">
                Safari<span className="italic font-semibold text-accent">tech</span>
              </span>
            </Link>

            <p className="mt-5 text-sm text-background/70 leading-relaxed max-w-sm">
              Kenya&apos;s premier electronics marketplace. Curated, authentic,
              delivered nationwide — since 2019.
            </p>

            {/* Contact details */}
            <div className="mt-7 space-y-2 text-sm text-background/80">
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Visit
                </span>
                <span>Westlands Business Centre, Waiyaki Way, Nairobi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Call
                </span>
                <a href="tel:+254700000000" className="hover:text-background transition-colors link-underline">
                  +254 700 000 000
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-background/50 mt-0.5 w-16 shrink-0">
                  Email
                </span>
                <a href="mailto:hello@safaritech.co.ke" className="hover:text-background transition-colors link-underline">
                  hello@safaritech.co.ke
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-background/15 bg-background/5 text-background/70 hover:text-background hover:border-background/30 transition-all"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </Link>
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
                      <Link
                        href={l.href}
                        className="text-sm text-background/80 hover:text-background transition-colors link-underline"
                      >
                        {l.label}
                      </Link>
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
            <span>© 2026 Safaritech Ltd. All rights reserved.</span>
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
