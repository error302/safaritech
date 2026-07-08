"use client";

import { Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";

const TRUST = [
  {
    icon: CreditCard,
    title: "M-Pesa & PayPal",
    desc: "Pay your way — instant STK push, or secure card checkout.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    desc: "Same-day Nairobi, 48-hour everywhere else across all 47 counties.",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    desc: "Not the right fit? Send it back, no questions, full refund.",
  },
  {
    icon: ShieldCheck,
    title: "1-year warranty",
    desc: "Every device covered. Authorised service, zero hidden fees.",
  },
];

export function TrustStrip() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-premium">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {TRUST.map((item, i) => (
            <div
              key={item.title}
              className="reveal bg-card p-6 md:p-7 flex flex-col gap-3 hover:bg-secondary/40 transition-colors duration-500"
              data-delay={i * 80}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-accent">
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div className="mt-1">
                <div className="text-sm font-semibold text-foreground">{item.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
