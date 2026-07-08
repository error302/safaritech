"use client";

const STEPS = [
  {
    num: "01",
    title: "Browse the curated edit",
    desc: "Pick from authorised brands — Apple, Samsung, Sony and twenty more. Filter by category, budget, or what's just landed.",
  },
  {
    num: "02",
    title: "Pay with M-Pesa in seconds",
    desc: "Daraja STK push checkout. Approve the prompt on your phone, get an instant receipt. No card forms, no FX surprises.",
  },
  {
    num: "03",
    title: "We dispatch, you track",
    desc: "Same-day within Nairobi, 48 hours nationwide. Real-time tracking from our Westlands fulfilment centre to your door.",
  },
  {
    num: "04",
    title: "Unbox, register, enjoy",
    desc: "Verify your serial on the manufacturer's site. One-year warranty activates automatically. Returns within seven days, no questions.",
  },
];

export function Process() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30 border-y border-border">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <div className="reveal">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                How it works
              </div>
              <h2 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4vw,3rem)] leading-[1.05] mt-3 font-medium">
                From cart to doorstep,
                <br />
                <span className="italic font-normal text-accent">in four moves.</span>
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                A buying experience built for Kenya. No card friction, no
                offshore logistics, no surprises at customs. Just authentic
                tech, delivered fast.
              </p>
            </div>
          </div>

          {/* Right — steps */}
          <div className="lg:col-span-8">
            <ol className="relative space-y-px">
              {/* Vertical connector */}
              <div
                aria-hidden="true"
                className="absolute left-[2.25rem] top-2 bottom-2 w-px bg-border hidden md:block"
              />
              {STEPS.map((s, i) => (
                <li
                  key={s.num}
                  className="reveal group relative grid grid-cols-[auto_1fr] gap-5 md:gap-8 py-7 md:py-9 first:pt-0 last:pb-0 border-b border-border last:border-0"
                  data-delay={i * 80}
                >
                  {/* Step number */}
                  <div className="relative">
                    <div className="relative z-10 inline-flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-card border border-border font-display text-lg text-foreground group-hover:border-accent/40 group-hover:text-accent transition-colors duration-500">
                      {s.num}
                    </div>
                  </div>
                  {/* Copy */}
                  <div className="pt-1">
                    <h3 className="font-display text-xl md:text-2xl text-foreground tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
