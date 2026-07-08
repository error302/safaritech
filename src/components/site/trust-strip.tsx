"use client";

import { Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";
import { useSettings } from "./settings-context";

const ICONS = [CreditCard, Truck, RotateCcw, ShieldCheck];

export function TrustStrip() {
  const { get } = useSettings();

  const items = [
    { title: get("trust.1.title", "M-Pesa & PayPal"), desc: get("trust.1.desc", "Pay your way — instant STK push, or secure card checkout.") },
    { title: get("trust.2.title", "Nationwide delivery"), desc: get("trust.2.desc", "Same-day Nairobi, 48-hour everywhere else across all 47 counties.") },
    { title: get("trust.3.title", "7-day returns"), desc: get("trust.3.desc", "Not the right fit? Send it back, no questions, full refund.") },
    { title: get("trust.4.title", "Warranty on every device"), desc: get("trust.4.desc", "12 months on new, 3 months on ex-UK & refurbished. Authorised service, zero hidden fees.") },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container-premium">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div
                key={i}
                className="reveal bg-card p-6 md:p-7 flex flex-col gap-3 hover:bg-secondary/40 transition-colors duration-500"
                data-delay={i * 80}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-accent">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div className="mt-1">
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
