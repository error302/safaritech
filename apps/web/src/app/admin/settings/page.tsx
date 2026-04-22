"use client";

import { useState } from "react";
import { Save, Store, CreditCard, Truck, Phone } from "lucide-react";

const sections = [
  { id: "store", label: "Store Info", icon: Store },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "contact", label: "Contact", icon: Phone },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("store");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
          <form onSubmit={handleSave} className="space-y-6">
            {activeSection === "store" && (
              <>
                <h2 className="font-display font-bold text-lg text-white">Store Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Store Name</label>
                    <input
                      type="text"
                      defaultValue="Safaritech"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Buy Goods Till</label>
                    <input
                      type="text"
                      defaultValue="247891"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tagline</label>
                  <input
                    type="text"
                    defaultValue="Tech That Moves Kenya"
                    className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                  />
                </div>
              </>
            )}

            {activeSection === "payment" && (
              <>
                <h2 className="font-display font-bold text-lg text-white">Payment Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">M-Pesa Consumer Key</label>
                    <input
                      type="password"
                      placeholder="Enter consumer key"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">M-Pesa Consumer Secret</label>
                    <input
                      type="password"
                      placeholder="Enter consumer secret"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">M-Pesa Shortcode</label>
                    <input
                      type="text"
                      defaultValue="174359"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Stripe Secret Key</label>
                    <input
                      type="password"
                      placeholder="sk_live_..."
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                </div>
              </>
            )}

            {activeSection === "shipping" && (
              <>
                <h2 className="font-display font-bold text-lg text-white">Shipping Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Free Delivery Min (KSh)</label>
                    <input
                      type="number"
                      defaultValue="10000"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Delivery Fee (KSh)</label>
                    <input
                      type="number"
                      defaultValue="500"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                </div>
              </>
            )}

            {activeSection === "contact" && (
              <>
                <h2 className="font-display font-bold text-lg text-white">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">WhatsApp</label>
                    <input
                      type="text"
                      defaultValue="+254 700 000 000"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="hello@safaritech.co.ke"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue="Nairobi, Kenya"
                      className="w-full bg-safaridark border border-safariborder rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4 border-t border-safariborder">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neon hover:bg-neon-dim text-black font-bold text-sm transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}