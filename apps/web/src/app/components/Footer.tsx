"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

// Default footer links (used when no settings are loaded yet)
const defaultShopLinks = [
  { label: "Smartphones", href: "/shop?cat=smartphones" },
  { label: "Laptops", href: "/shop?cat=laptops" },
  { label: "Audio", href: "/shop?cat=audio" },
  { label: "Wearables", href: "/shop?cat=wearables" },
  { label: "Tablets", href: "/shop?cat=tablets" },
];
const defaultCompanyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Press", href: "/press" },
];
const defaultSupportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Track Order", href: "/track-order" },
  { label: "Warranty", href: "/warranty" },
];
const defaultLegalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

function parseLinks(json: string | undefined, defaults: { label: string; href: string }[]) {
  if (!json) return defaults;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch { /* use defaults */ }
  return defaults;
}

export function Footer() {
  const { settings } = useSiteSettings();

  // Parse footer settings
  const footerDescription = settings?.footer_description || "Kenya's premier electronics marketplace. Quality gadgets, unbeatable prices, delivered nationwide.";
  const whatsapp = settings?.whatsapp || "+254 700 000 000";
  const contactEmail = settings?.contact_email || "hello@safaritech.co.ke";
  const location = settings?.location || "Westlands, Nairobi\nKenya";

  const shopLinks = useMemo(() => parseLinks(settings?.footer_shop_links, defaultShopLinks), [settings?.footer_shop_links]);
  const companyLinks = useMemo(() => parseLinks(settings?.footer_company_links, defaultCompanyLinks), [settings?.footer_company_links]);
  const supportLinks = useMemo(() => parseLinks(settings?.footer_support_links, defaultSupportLinks), [settings?.footer_support_links]);
  const legalLinks = useMemo(() => parseLinks(settings?.footer_legal_links, defaultLegalLinks), [settings?.footer_legal_links]);

  return (
    <footer className="border-t border-safariborder bg-safarigray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <SiteLogo href="/" iconSize={32} textSize="text-2xl" className="mb-4" />
            <p className="text-gray-400 mb-6 max-w-sm">
              {footerDescription}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg border border-safariborder hover:border-neon transition-colors text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-safariborder hover:border-neon transition-colors text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-safariborder hover:border-neon transition-colors text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-safariborder hover:border-neon transition-colors text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link: any) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span style={{ whiteSpace: "pre-line" }}>{location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>{whatsapp}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-safariborder">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Safaritech. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link: any) => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-400 hover:text-neon transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
