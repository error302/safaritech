"use client";

const BRANDS = [
  "Apple",
  "Samsung",
  "Sony",
  "HP",
  "Dell",
  "Lenovo",
  "JBL",
  "Xiaomi",
  "Infinix",
  "Tecno",
  "Google",
  "Nintendo",
];

export function BrandMarquee() {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-secondary/40">
      <div className="container-premium">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Authorized partners
            </div>
            <h2 className="font-display text-xl md:text-2xl text-foreground mt-2 tracking-tight">
              Twenty-plus brands, one trusted source.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Every device ships direct from authorized distributors with full
            warranty and original accessories — no grey market, no surprises.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden no-scrollbar">
        <div className="flex w-max animate-marquee-x">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div
              key={`${b}-${i}`}
              className="shrink-0 mx-8 md:mx-12 flex items-center"
            >
              <span className="font-display text-2xl md:text-3xl text-foreground/40 hover:text-foreground transition-colors duration-500 tracking-tight">
                {b}
              </span>
            </div>
          ))}
        </div>

        {/* Edge fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
        />
      </div>
    </section>
  );
}
