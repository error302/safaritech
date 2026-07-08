"use client";

import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Ordered an iPhone 15 Pro on Tuesday morning, paid with M-Pesa, had it in Westlands by lunch. The serial checked out on Apple's site. This is how tech retail should work in Kenya.",
    name: "Wanjiru Kamau",
    role: "Product Designer",
    location: "Nairobi",
    rating: 5,
  },
  {
    quote:
      "Bought a MacBook for my daughter's university. The team walked me through financing, set it up in-store, and even helped with AppleCare. Five stars feels insufficient.",
    name: "David Otieno",
    role: "Parent · Kisumu",
    location: "Kisumu",
    rating: 5,
  },
  {
    quote:
      "I run a small creative agency in Mombasa. We've bought twelve devices from Safaritech over two years — every single one authentic, every warranty honoured. They've earned our trust.",
    name: "Aisha Mwinyi",
    role: "Founder, Tide Studio",
    location: "Mombasa",
    rating: 5,
  },
  {
    quote:
      "The PS5 I ordered arrived in Nakuru the next morning. Original seal, two controllers, the game I wanted. I'd given up on Kenyan retailers — Safaritech restored it.",
    name: "Brian Kiprotich",
    role: "Software Engineer",
    location: "Nakuru",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container-premium">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="reveal max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Customer stories
            </div>
            <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Fifty thousand Kenyans,
              <br />
              <span className="italic font-normal text-accent">one trusted source.</span>
            </h2>
          </div>
          <div className="reveal flex items-center gap-3" data-delay="120">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">4.9 / 5</span> · 12,400+ verified reviews
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              className="reveal group relative p-7 md:p-9 rounded-2xl border border-border bg-card hover:shadow-[var(--shadow-soft)] transition-shadow duration-500"
              data-delay={(i % 2) * 100}
            >
              <Quote className="h-7 w-7 text-accent/40 mb-5" />

              <p className="text-base md:text-lg text-foreground leading-relaxed font-display tracking-tight">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-4 pt-5 border-t border-border">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground font-display text-base font-medium">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} · {t.location}
                  </div>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
