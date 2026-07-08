"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-secondary/30 border-t border-border">
      <div className="container-premium">
        <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
          {/* Soft gradient backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(40rem 24rem at 90% 10%, oklch(0.40 0.08 165 / 0.10), transparent 60%), radial-gradient(30rem 20rem at 10% 90%, oklch(0.55 0.10 75 / 0.08), transparent 60%)",
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 lg:p-16">
            {/* Left — pitch */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                The dispatch
              </div>
              <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4vw,3rem)] leading-[1.05] mt-3 font-medium">
                New arrivals, early access,
                <br />
                <span className="italic font-normal text-accent">honest prices.</span>
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl">
                One email a week. Curated drops, member-only pricing on flagship
                devices, and the occasional founder&apos;s note. No spam, no
                filler. Unsubscribe in one click.
              </p>

              <ul className="mt-7 space-y-2.5">
                {[
                  "Early access to flagship drops — iPhone, Galaxy, MacBook",
                  "Member-only M-Pesa pricing, every Tuesday",
                  "Local restock alerts for high-demand devices",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" strokeWidth={2} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-5 lg:border-l lg:border-border lg:pl-12 flex flex-col justify-center">
              {submitted ? (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-7 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent mb-4">
                    <Check className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl text-foreground">You&apos;re on the list.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Look out for our next dispatch — usually lands Tuesday morning.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-3">
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest font-mono text-muted-foreground">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 transition-all"
                  />
                  <button
                    type="submit"
                    className="group w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
                  >
                    Subscribe — it&apos;s free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    By subscribing, you agree to our Privacy Policy. We never share
                    your data — full stop.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
