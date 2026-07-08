"use client";

const STATS = [
  { num: "50,000+", label: "Customers served", sub: "Across all 47 counties" },
  { num: "100,000+", label: "Products delivered", sub: "Since 2019" },
  { num: "4.9 / 5", label: "Average rating", sub: "12,400+ verified reviews" },
  { num: "0.1%", label: "Warranty claim rate", sub: "Industry leading" },
];

export function Stats() {
  return (
    <section className="py-20 md:py-28 bg-foreground text-background relative overflow-hidden">
      {/* Soft radial highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(40rem 40rem at 80% 20%, oklch(0.65 0.10 165 / 0.4), transparent 60%), radial-gradient(30rem 30rem at 10% 90%, oklch(0.55 0.10 75 / 0.25), transparent 60%)",
        }}
      />

      <div className="container-premium relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-14">
          <div className="lg:col-span-7 reveal">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-background/50">
              The numbers
            </div>
            <h2 className="font-display tracking-tightest text-background text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Five years.
              <br />
              <span className="italic font-normal text-accent">A track record that talks.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 reveal" data-delay="120">
            <p className="text-base text-background/70 leading-relaxed">
              We don&apos;t outsource trust to marketing copy. The numbers below
              come from our own order book, our warranty register, and reviews
              left by verified customers on Trustpilot and Google.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-background/10 rounded-2xl overflow-hidden border border-background/10">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="reveal bg-foreground p-7 md:p-9"
              data-delay={i * 80}
            >
              <div className="num-display text-4xl md:text-5xl lg:text-6xl text-background font-medium tracking-tightest">
                {s.num}
              </div>
              <div className="mt-4 text-sm font-medium text-background">
                {s.label}
              </div>
              <div className="mt-1 text-xs text-background/60">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
