"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Store,
  CreditCard,
  Truck,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Layout,
  Navigation,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import ImageUploader from "@/components/admin/ImageUploader";

const sections = [
  { id: "store", label: "Store Info", icon: Store },
  { id: "homepage", label: "Homepage", icon: Layout },
  { id: "footer", label: "Footer & Nav", icon: Navigation },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "contact", label: "Contact", icon: Phone },
];

// Default values for all settings
const defaults: Record<string, string> = {
  // Store Info
  store_name: "Safaritech",
  tagline: "Tech That Moves Kenya",
  logo_url: "",
  favicon_url: "",
  // Homepage
  hero_title: "Elevate Your Digital Life.",
  hero_subtitle:
    "Samsung, Apple, Sony, HP and more — curated smartphones, laptops & accessories. Pay with M-Pesa or PayPal.",
  hero_image:
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=2000&auto=format&fit=crop",
  hero_badge_text: "Kenya's Premium Tech Hub",
  hero_cta_primary_text: "Shop All Brands",
  hero_cta_primary_link: "/shop",
  hero_cta_secondary_text: "View Phones",
  hero_cta_secondary_link: "/shop?cat=smartphones",
  trust_badges:
    '[{"title":"M-Pesa & PayPal","desc":"Instant & secure","icon":"Smartphone"},{"title":"Nationwide Delivery","desc":"Fees vary by location","icon":"Truck"},{"title":"7-Day Returns","desc":"No questions asked","icon":"RotateCcw"},{"title":"1-Year Warranty","desc":"On all devices","icon":"ShieldCheck"}]',
  // Footer & Nav
  footer_description:
    "Kenya's premier electronics marketplace. Quality gadgets, unbeatable prices, delivered nationwide.",
  footer_shop_links:
    '[{"label":"Smartphones","href":"/shop?cat=smartphones"},{"label":"Laptops","href":"/shop?cat=laptops"},{"label":"Audio","href":"/shop?cat=audio"},{"label":"Wearables","href":"/shop?cat=wearables"},{"label":"Tablets","href":"/shop?cat=tablets"}]',
  footer_company_links:
    '[{"label":"About Us","href":"/about"},{"label":"Contact","href":"/contact"},{"label":"Press","href":"/press"}]',
  footer_support_links:
    '[{"label":"FAQ","href":"/faq"},{"label":"Shipping","href":"/shipping"},{"label":"Returns","href":"/returns"},{"label":"Track Order","href":"/track-order"},{"label":"Warranty","href":"/warranty"}]',
  footer_legal_links:
    '[{"label":"Privacy Policy","href":"/privacy"},{"label":"Terms of Service","href":"/terms"},{"label":"Cookie Policy","href":"/cookies"}]',
  nav_category_links:
    '[{"label":"All Products","href":"/shop","icon":"Package"},{"label":"Phones","href":"/shop?cat=smartphones","icon":"Smartphone"},{"label":"Laptops","href":"/shop?cat=laptops","icon":"Laptop"},{"label":"Gaming","href":"/shop?cat=gaming","icon":"Gamepad2"},{"label":"Accessories","href":"/shop?cat=accessories","icon":"Headphones"},{"label":"Deals","href":"/deals","icon":"Flame"}]',
  // Payment
  mpesa_consumer_key: "",
  mpesa_consumer_secret: "",
  mpesa_shortcode: "174359",
  stripe_secret_key: "",
  paypal_client_id: "",
  // Shipping
  free_delivery_min: "10000",
  delivery_fee: "500",
  // Contact
  whatsapp: "+254 700 000 000",
  contact_email: "hello@safaritech.co.ke",
  location: "Nairobi, Kenya",
};

// All setting keys used in the form
const settingKeys = Object.keys(defaults);

function SkeletonField() {
  return (
    <div className="space-y-2">
      <div className="h-4 w-24 rounded bg-safariborder animate-pulse" />
      <div className="h-10 w-full rounded-xl bg-safariborder animate-pulse" />
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-48 rounded bg-safariborder animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonField />
      <SkeletonField />
      <SkeletonField />
    </div>
  );
}

// Reusable link editor component for JSON link arrays
function LinkEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  let links: { label: string; href: string }[] = [];
  try {
    links = JSON.parse(value || "[]");
  } catch {
    links = [];
  }

  const addLink = () => {
    const updated = [...links, { label: "", href: "" }];
    onChange(JSON.stringify(updated));
  };

  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    onChange(JSON.stringify(updated));
  };

  const updateLink = (index: number, field: "label" | "href", val: string) => {
    const updated = links.map((l, i) => (i === index ? { ...l, [field]: val } : l));
    onChange(JSON.stringify(updated));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">{label}</label>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(i, "label", e.target.value)}
              placeholder="Label"
              className="flex-1 bg-safaridark border border-safariborder rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => updateLink(i, "href", e.target.value)}
              placeholder="/path"
              className="flex-1 bg-safaridark border border-safariborder rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors shrink-0 self-end sm:self-auto"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addLink}
          className="text-sm font-medium text-neon hover:text-neon-dim transition-colors"
        >
          + Add Link
        </button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("store");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form state — simple flat key→value map
  const [formState, setFormState] = useState<Record<string, string>>({ ...defaults });

  const updateField = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch settings from the database (admin endpoint includes sensitive keys, masked)
  const { data: settings, isLoading } = trpc.siteSetting.adminGetAll.useQuery();

  // Populate form fields when settings data loads
  useEffect(() => {
    if (settings) {
      setFormState((prev) => {
        const merged = { ...prev };
        for (const key of settingKeys) {
          if (settings[key] !== undefined && settings[key] !== null) {
            merged[key] = settings[key];
          }
        }
        return merged;
      });
    }
  }, [settings]);

  // Save mutation
  const utils = trpc.useUtils();
  const saveMutation = trpc.siteSetting.bulkUpsert.useMutation({
    onSuccess: () => {
      utils.siteSetting.getAll.invalidate();
      setSuccessMessage("Settings saved successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to save settings");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Build the settings array from current state
    const settingsToSave = settingKeys.map((key) => ({
      key,
      value: formState[key] ?? defaults[key] ?? "",
    }));

    saveMutation.mutate({ settings: settingsToSave });
  };

  const isSaving = saveMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your store and website content</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Mobile: Horizontal scrollable tabs */}
        <div className="lg:hidden -mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeSection === section.id
                    ? "bg-neon/10 text-neon border border-neon/20"
                    : "text-gray-400 hover:text-white hover:bg-safarigray border border-safariborder"
                }`}
              >
                <section.icon className="w-4 h-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Vertical sidebar */}
        <div className="hidden lg:block lg:w-64 shrink-0 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeSection === section.id
                  ? "bg-neon/10 text-neon border border-neon/20"
                  : "text-gray-400 hover:text-white hover:bg-safarigray border border-transparent"
              }`}
            >
              <section.icon className="w-5 h-5 shrink-0" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-safarigray border border-safariborder rounded-2xl p-4 sm:p-6">
          {isLoading ? (
            <SkeletonSection />
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neon/10 border border-neon/20 text-neon text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* ========== Store Info Tab ========== */}
              {activeSection === "store" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Store Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Store Name</label>
                      <input
                        type="text"
                        value={formState.store_name}
                        onChange={(e) => updateField("store_name", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Tagline</label>
                      <input
                        type="text"
                        value={formState.tagline}
                        onChange={(e) => updateField("tagline", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Store Logo</label>
                    <ImageUploader
                      value={formState.logo_url}
                      onChange={(url: string) => updateField("logo_url", url)}
                      multiple={false}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={formState.favicon_url}
                      onChange={(e) => updateField("favicon_url", e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                    />
                    <p className="text-xs text-gray-600 mt-1">URL for the browser tab icon</p>
                  </div>
                </>
              )}

              {/* ========== Homepage Tab ========== */}
              {activeSection === "homepage" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Homepage Content</h2>
                  <p className="text-sm text-gray-500">
                    Control the hero section, trust badges, and other homepage content from here.
                  </p>

                  {/* Hero Section */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-semibold text-neon">Hero Banner</h3>
                    <p className="text-xs text-gray-500">
                      The large banner at the top of the homepage
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Hero Title</label>
                    <input
                      type="text"
                      value={formState.hero_title}
                      onChange={(e) => updateField("hero_title", e.target.value)}
                      placeholder="Elevate Your Digital Life."
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Use a period (.) at the end for the gradient text effect
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Hero Subtitle</label>
                    <textarea
                      value={formState.hero_subtitle}
                      onChange={(e) => updateField("hero_subtitle", e.target.value)}
                      placeholder="Description text below the title"
                      rows={2}
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Badge Text</label>
                    <input
                      type="text"
                      value={formState.hero_badge_text}
                      onChange={(e) => updateField("hero_badge_text", e.target.value)}
                      placeholder="Kenya's Premium Tech Hub"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      The small badge/pill text above the title
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Hero Background Image</label>
                    <ImageUploader
                      value={formState.hero_image}
                      onChange={(url: string) => updateField("hero_image", url)}
                      multiple={false}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Primary Button Text</label>
                      <input
                        type="text"
                        value={formState.hero_cta_primary_text}
                        onChange={(e) => updateField("hero_cta_primary_text", e.target.value)}
                        placeholder="Shop All Brands"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Primary Button Link</label>
                      <input
                        type="text"
                        value={formState.hero_cta_primary_link}
                        onChange={(e) => updateField("hero_cta_primary_link", e.target.value)}
                        placeholder="/shop"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Secondary Button Text</label>
                      <input
                        type="text"
                        value={formState.hero_cta_secondary_text}
                        onChange={(e) => updateField("hero_cta_secondary_text", e.target.value)}
                        placeholder="View Phones"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Secondary Button Link</label>
                      <input
                        type="text"
                        value={formState.hero_cta_secondary_link}
                        onChange={(e) => updateField("hero_cta_secondary_link", e.target.value)}
                        placeholder="/shop?cat=smartphones"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-1 mt-8 mb-4">
                    <h3 className="text-sm font-semibold text-neon">Trust Badges</h3>
                    <p className="text-xs text-gray-500">
                      The 4 trust badges below the hero. Edit the JSON array to change titles, descriptions, and icons.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Trust Badges (JSON)</label>
                    <textarea
                      value={formState.trust_badges}
                      onChange={(e) => updateField("trust_badges", e.target.value)}
                      rows={8}
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon font-mono"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format: [{"{"}"title":"...","desc":"...","icon":"IconName"{"}"}]. Available icons: Smartphone, Truck,
                      RotateCcw, ShieldCheck, CreditCard, Clock, Star, Heart
                    </p>
                  </div>
                </>
              )}

              {/* ========== Footer & Nav Tab ========== */}
              {activeSection === "footer" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Footer & Navigation</h2>
                  <p className="text-sm text-gray-500">
                    Manage footer content, links, and the navbar category bar.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Footer Description</label>
                    <textarea
                      value={formState.footer_description}
                      onChange={(e) => updateField("footer_description", e.target.value)}
                      placeholder="Kenya's premier electronics marketplace..."
                      rows={2}
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon resize-none"
                    />
                  </div>

                  <LinkEditor
                    label="Shop Links"
                    value={formState.footer_shop_links}
                    onChange={(val) => updateField("footer_shop_links", val)}
                  />

                  <LinkEditor
                    label="Company Links"
                    value={formState.footer_company_links}
                    onChange={(val) => updateField("footer_company_links", val)}
                  />

                  <LinkEditor
                    label="Support Links"
                    value={formState.footer_support_links}
                    onChange={(val) => updateField("footer_support_links", val)}
                  />

                  <LinkEditor
                    label="Legal Links"
                    value={formState.footer_legal_links}
                    onChange={(val) => updateField("footer_legal_links", val)}
                  />

                  <div className="space-y-1 mt-8 mb-4">
                    <h3 className="text-sm font-semibold text-neon">Navbar Category Bar</h3>
                    <p className="text-xs text-gray-500">
                      The category links shown in the desktop navbar (below the search bar)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category Links (JSON)</label>
                    <textarea
                      value={formState.nav_category_links}
                      onChange={(e) => updateField("nav_category_links", e.target.value)}
                      rows={6}
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon font-mono"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Format: [{"{"}"label":"...","href":"/path","icon":"IconName"{"}"}]
                    </p>
                  </div>
                </>
              )}

              {/* ========== Payment Tab ========== */}
              {activeSection === "payment" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Payment Settings</h2>

                  {/* M-Pesa Section */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-sm font-semibold text-neon">M-Pesa</h3>
                    <p className="text-xs text-gray-500">Safaricom Daraja API credentials</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">M-Pesa Consumer Key</label>
                      <input
                        type="password"
                        value={formState.mpesa_consumer_key}
                        onChange={(e) => updateField("mpesa_consumer_key", e.target.value)}
                        placeholder="Enter consumer key"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">M-Pesa Consumer Secret</label>
                      <input
                        type="password"
                        value={formState.mpesa_consumer_secret}
                        onChange={(e) => updateField("mpesa_consumer_secret", e.target.value)}
                        placeholder="Enter consumer secret"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">M-Pesa Shortcode</label>
                      <input
                        type="text"
                        value={formState.mpesa_shortcode}
                        onChange={(e) => updateField("mpesa_shortcode", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>

                  {/* Card / International Section */}
                  <div className="space-y-1 mt-6 mb-4">
                    <h3 className="text-sm font-semibold text-neon">Card &amp; International</h3>
                    <p className="text-xs text-gray-500">Stripe and PayPal credentials</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Stripe Secret Key</label>
                      <input
                        type="password"
                        value={formState.stripe_secret_key}
                        onChange={(e) => updateField("stripe_secret_key", e.target.value)}
                        placeholder="sk_live_..."
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">PayPal Client ID</label>
                      <input
                        type="text"
                        value={formState.paypal_client_id}
                        onChange={(e) => updateField("paypal_client_id", e.target.value)}
                        placeholder="PayPal client ID"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ========== Shipping Tab ========== */}
              {activeSection === "shipping" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Shipping Settings</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Free Delivery Min (KSh)</label>
                      <input
                        type="number"
                        value={formState.free_delivery_min}
                        onChange={(e) => updateField("free_delivery_min", e.target.value)}
                        min="0"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                      <p className="text-xs text-gray-600 mt-1">Orders above this amount get free delivery</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Delivery Fee (KSh)</label>
                      <input
                        type="number"
                        value={formState.delivery_fee}
                        onChange={(e) => updateField("delivery_fee", e.target.value)}
                        min="0"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                      <p className="text-xs text-gray-600 mt-1">Standard delivery fee for orders below the minimum</p>
                    </div>
                  </div>
                </>
              )}

              {/* ========== Contact Tab ========== */}
              {activeSection === "contact" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">WhatsApp</label>
                      <input
                        type="text"
                        value={formState.whatsapp}
                        onChange={(e) => updateField("whatsapp", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        value={formState.contact_email}
                        onChange={(e) => updateField("contact_email", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Location</label>
                      <input
                        type="text"
                        value={formState.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-safariborder">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
