"use client";

import * as React from "react";
import { Save, Check, AlertCircle, RotateCcw } from "lucide-react";
import { useAdminAuth } from "./admin-auth";
import { useSettings } from "../site/settings-context";

interface SettingsGroup {
  category: string;
  label: string;
  fields: { key: string; label: string; type: "text" | "textarea"; placeholder?: string }[];
}

const GROUPS: SettingsGroup[] = [
  {
    category: "general",
    label: "Brand identity",
    fields: [
      { key: "site.name", label: "Site name", type: "text" },
      { key: "site.tagline", label: "Tagline", type: "text" },
      { key: "site.logoUrl", label: "Logo URL (leave empty to use built-in wordmark)", type: "text", placeholder: "https://…" },
      { key: "site.faviconUrl", label: "Favicon URL", type: "text", placeholder: "/logo.svg" },
    ],
  },
  {
    category: "hero",
    label: "Homepage hero",
    fields: [
      { key: "hero.badge", label: "Badge text (above the headline)", type: "text" },
      { key: "hero.titleLine1", label: "Headline line 1", type: "text" },
      { key: "hero.titleLine2", label: "Headline line 2", type: "text" },
      { key: "hero.titleLine3", label: "Headline line 3 (italic accent)", type: "text" },
      { key: "hero.subtitle", label: "Subtitle paragraph", type: "textarea" },
      { key: "hero.ctaPrimary", label: "Primary CTA button text", type: "text" },
      { key: "hero.ctaSecondary", label: "Secondary CTA button text", type: "text" },
      { key: "hero.stat1Num", label: "Stat 1 number", type: "text" },
      { key: "hero.stat1Label", label: "Stat 1 label", type: "text" },
      { key: "hero.stat2Num", label: "Stat 2 number", type: "text" },
      { key: "hero.stat2Label", label: "Stat 2 label", type: "text" },
      { key: "hero.stat3Num", label: "Stat 3 number", type: "text" },
      { key: "hero.stat3Label", label: "Stat 3 label", type: "text" },
    ],
  },
  {
    category: "trust",
    label: "Trust badges",
    fields: [
      { key: "trust.1.title", label: "Badge 1 title", type: "text" },
      { key: "trust.1.desc", label: "Badge 1 description", type: "textarea" },
      { key: "trust.2.title", label: "Badge 2 title", type: "text" },
      { key: "trust.2.desc", label: "Badge 2 description", type: "textarea" },
      { key: "trust.3.title", label: "Badge 3 title", type: "text" },
      { key: "trust.3.desc", label: "Badge 3 description", type: "textarea" },
      { key: "trust.4.title", label: "Badge 4 title", type: "text" },
      { key: "trust.4.desc", label: "Badge 4 description", type: "textarea" },
    ],
  },
  {
    category: "contact",
    label: "Contact information",
    fields: [
      { key: "contact.address", label: "Address", type: "text" },
      { key: "contact.phone", label: "Phone", type: "text" },
      { key: "contact.email", label: "Email", type: "text" },
    ],
  },
  {
    category: "footer",
    label: "Footer",
    fields: [
      { key: "footer.tagline", label: "Footer tagline", type: "textarea" },
      { key: "footer.copyright", label: "Copyright text", type: "text" },
    ],
  },
  {
    category: "seo",
    label: "SEO metadata",
    fields: [
      { key: "seo.title", label: "Page title", type: "text" },
      { key: "seo.description", label: "Meta description", type: "textarea" },
    ],
  },
];

export function AdminSettings() {
  const { adminFetch } = useAdminAuth();
  const { settings, refresh } = useSettings();
  const [form, setForm] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [activeGroup, setActiveGroup] = React.useState<string>("general");

  // Sync form with settings from server
  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveGroup = async (group: SettingsGroup) => {
    setSaving(true);
    setError("");
    try {
      const updates: Record<string, string> = {};
      for (const f of group.fields) {
        updates[f.key] = form[f.key] ?? "";
      }
      const res = await adminFetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates, category: group.category }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const resetGroup = async (group: SettingsGroup) => {
    if (!confirm(`Reset ${group.label} to the last saved values?`)) return;
    setForm((prev) => {
      const next = { ...prev };
      for (const f of group.fields) {
        next[f.key] = settings[f.key] ?? "";
      }
      return next;
    });
    setSaved(false);
  };

  const activeGroupData = GROUPS.find((g) => g.category === activeGroup) ?? GROUPS[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-foreground tracking-tight">Site content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit your site&apos;s copy, branding, and contact details. Changes go live instantly — no code changes needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Group tabs */}
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
            {GROUPS.map((g) => (
              <button
                key={g.category}
                onClick={() => setActiveGroup(g.category)}
                className={`shrink-0 lg:w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeGroup === g.category
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-9">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-foreground tracking-tight">
                {activeGroupData.label}
              </h2>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-accent">
                    <Check className="h-3.5 w-3.5" /> Saved
                  </span>
                )}
                <button
                  onClick={() => resetGroup(activeGroupData)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
                <button
                  onClick={() => saveGroup(activeGroupData)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 h-8 px-4 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive mb-4">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <div className="space-y-4">
              {activeGroupData.fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {f.label}
                    <span className="ml-2 font-mono text-[9px] text-muted-foreground/60">{f.key}</span>
                  </span>
                  {f.type === "textarea" ? (
                    <textarea
                      value={form[f.key] ?? ""}
                      onChange={(e) => update(f.key, e.target.value)}
                      rows={3}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[f.key] ?? ""}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Changes are saved to the database and reflected on the live site immediately.
              </p>
              <button
                onClick={() => saveGroup(activeGroupData)}
                disabled={saving}
                className="inline-flex items-center gap-2 h-9 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
