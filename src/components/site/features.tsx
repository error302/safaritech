"use client";

import { ShieldCheck, Truck, Headphones, BadgeCheck, Zap, MapPin } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Authenticity, guaranteed",
    desc: "Every device ships with original serial verification and a one-year manufacturer warranty. Direct from authorised distributors — no grey market, ever.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    desc: "Same-day within Nairobi. Forty-eight hours to every county. Real-time tracking from our Westlands fulfilment centre to your doorstep.",
  },
  {
    icon: Headphones,
    title: "Human support, in your language",
    desc: "Swahili and English. Reach a real person on WhatsApp, M-Pesa support, or in-store at our Westlands Business Centre, six days a week.",
  },
  {
    icon: BadgeCheck,
    title: "Authorised reseller",
    desc: "Officially recognised by Samsung, Apple, Sony, HP and twenty more. You get the full manufacturer promise — not a retailer's workaround.",
  },
  {
    icon: Zap,
    title: "M-Pesa in one tap",
    desc: "Daraja STK push checkout. No card friction, no foreign-exchange surprises. Pay the way Kenya already pays, in seconds.",
  },
  {
    icon: MapPin,
    title: "Built for Kenya",
    desc: "Founded in Nairobi, 2019. Pricing in shillings. Inventory matched to local demand. Returns handled in-country, not shipped abroad.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container-premium">
        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 md:mb-20">
          <div className="lg:col-span-7 reveal">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Why Safaritech
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Not another gadget store.
              <br />
              <span className="italic font-normal text-accent">A Kenyan promise.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 reveal flex items-end" data-delay="120">
            <p className="text-base text-muted-foreground leading-relaxed">
              Five years on, fifty thousand customers, and a warranty-claim rate
              below one percent. We&apos;ve built Safaritech around what Kenyans
              actually need — authentic products, honest pricing, and support
              that picks up the phone.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal bg-card p-7 md:p-8 hover:bg-secondary/40 transition-colors duration-500"
              data-delay={(i % 3) * 80}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-accent">
                <f.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-xl text-foreground tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                0{i + 1} / 06
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
