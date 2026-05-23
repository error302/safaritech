"use client";

import { useState, useEffect } from "react";
import { Save, Store, CreditCard, Truck, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/utils/trpc";
import ImageUploader from "@/components/admin/ImageUploader";

const sections = [
  { id: "store", label: "Store Info", icon: Store },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "contact", label: "Contact", icon: Phone },
];

// Default values for all settings
const defaults: Record<string, string> = {
  store_name: "Safaritech",
  tagline: "Tech That Moves Kenya",
  logo_url: "",
  favicon_url: "",
  mpesa_consumer_key: "",
  mpesa_consumer_secret: "",
  mpesa_shortcode: "174359",
  stripe_secret_key: "",
  paypal_client_id: "",
  free_delivery_min: "10000",
  delivery_fee: "500",
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

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("store");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [storeName, setStoreName] = useState(defaults.store_name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [logoUrl, setLogoUrl] = useState(defaults.logo_url);
  const [faviconUrl, setFaviconUrl] = useState(defaults.favicon_url);
  const [mpesaConsumerKey, setMpesaConsumerKey] = useState(defaults.mpesa_consumer_key);
  const [mpesaConsumerSecret, setMpesaConsumerSecret] = useState(defaults.mpesa_consumer_secret);
  const [mpesaShortcode, setMpesaShortcode] = useState(defaults.mpesa_shortcode);
  const [stripeSecretKey, setStripeSecretKey] = useState(defaults.stripe_secret_key);
  const [paypalClientId, setPaypalClientId] = useState(defaults.paypal_client_id);
  const [freeDeliveryMin, setFreeDeliveryMin] = useState(defaults.free_delivery_min);
  const [deliveryFee, setDeliveryFee] = useState(defaults.delivery_fee);
  const [whatsapp, setWhatsapp] = useState(defaults.whatsapp);
  const [contactEmail, setContactEmail] = useState(defaults.contact_email);
  const [location, setLocation] = useState(defaults.location);

  // Map state values to setting keys
  const stateToKey: Record<string, string> = {
    store_name: storeName,
    tagline: tagline,
    logo_url: logoUrl,
    favicon_url: faviconUrl,
    mpesa_consumer_key: mpesaConsumerKey,
    mpesa_consumer_secret: mpesaConsumerSecret,
    mpesa_shortcode: mpesaShortcode,
    stripe_secret_key: stripeSecretKey,
    paypal_client_id: paypalClientId,
    free_delivery_min: freeDeliveryMin,
    delivery_fee: deliveryFee,
    whatsapp: whatsapp,
    contact_email: contactEmail,
    location: location,
  };

  // Fetch settings from the database
  const { data: settings, isLoading } = trpc.siteSetting.getAll.useQuery();

  // Populate form fields when settings data loads
  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name ?? defaults.store_name);
      setTagline(settings.tagline ?? defaults.tagline);
      setLogoUrl(settings.logo_url ?? defaults.logo_url);
      setFaviconUrl(settings.favicon_url ?? defaults.favicon_url);
      setMpesaConsumerKey(settings.mpesa_consumer_key ?? defaults.mpesa_consumer_key);
      setMpesaConsumerSecret(settings.mpesa_consumer_secret ?? defaults.mpesa_consumer_secret);
      setMpesaShortcode(settings.mpesa_shortcode ?? defaults.mpesa_shortcode);
      setStripeSecretKey(settings.stripe_secret_key ?? defaults.stripe_secret_key);
      setPaypalClientId(settings.paypal_client_id ?? defaults.paypal_client_id);
      setFreeDeliveryMin(settings.free_delivery_min ?? defaults.free_delivery_min);
      setDeliveryFee(settings.delivery_fee ?? defaults.delivery_fee);
      setWhatsapp(settings.whatsapp ?? defaults.whatsapp);
      setContactEmail(settings.contact_email ?? defaults.contact_email);
      setLocation(settings.location ?? defaults.location);
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
      value: stateToKey[key] ?? defaults[key] ?? "",
    }));

    saveMutation.mutate({ settings: settingsToSave });
  };

  const isSaving = saveMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your store</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0 space-y-1">
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
        <div className="flex-1 bg-safarigray border border-safariborder rounded-2xl p-6">
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

              {/* Store Info Tab */}
              {activeSection === "store" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Store Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Store Name</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Store Logo</label>
                    <ImageUploader
                      value={logoUrl}
                      onChange={setLogoUrl}
                      multiple={false}
                      uploadTo="cloudinary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                    />
                    <p className="text-xs text-gray-600 mt-1">URL for the browser tab icon</p>
                  </div>
                </>
              )}

              {/* Payment Tab */}
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
                        value={mpesaConsumerKey}
                        onChange={(e) => setMpesaConsumerKey(e.target.value)}
                        placeholder="Enter consumer key"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">M-Pesa Consumer Secret</label>
                      <input
                        type="password"
                        value={mpesaConsumerSecret}
                        onChange={(e) => setMpesaConsumerSecret(e.target.value)}
                        placeholder="Enter consumer secret"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">M-Pesa Shortcode</label>
                      <input
                        type="text"
                        value={mpesaShortcode}
                        onChange={(e) => setMpesaShortcode(e.target.value)}
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
                        value={stripeSecretKey}
                        onChange={(e) => setStripeSecretKey(e.target.value)}
                        placeholder="sk_live_..."
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">PayPal Client ID</label>
                      <input
                        type="text"
                        value={paypalClientId}
                        onChange={(e) => setPaypalClientId(e.target.value)}
                        placeholder="PayPal client ID"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Shipping Tab */}
              {activeSection === "shipping" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Shipping Settings</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Free Delivery Min (KSh)</label>
                      <input
                        type="number"
                        value={freeDeliveryMin}
                        onChange={(e) => setFreeDeliveryMin(e.target.value)}
                        min="0"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                      <p className="text-xs text-gray-600 mt-1">Orders above this amount get free delivery</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Delivery Fee (KSh)</label>
                      <input
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        min="0"
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                      <p className="text-xs text-gray-600 mt-1">Standard delivery fee for orders below the minimum</p>
                    </div>
                  </div>
                </>
              )}

              {/* Contact Tab */}
              {activeSection === "contact" && (
                <>
                  <h2 className="font-display font-bold text-lg text-white">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">WhatsApp</label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
