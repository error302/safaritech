"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Check,
  Smartphone,
} from "lucide-react";
import { useViewRouter } from "./view-router";
import { useCart, formatKsh } from "./cart-context";
import { DeviceShape } from "./device-shape";
import { cn } from "@/lib/utils";

export function CartView() {
  const { navigate } = useViewRouter();
  const { items, setQuantity, removeItem, subtotal, clear, count } = useCart();
  const [placed, setPlaced] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);

  const shipping = subtotal > 100000 ? 0 : 650;
  const total = subtotal + shipping;

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      clear();
    }, 1400);
  };

  if (placed) {
    return (
      <div className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container-premium">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent mb-6 reveal">
              <Check className="h-7 w-7" strokeWidth={2} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground reveal">
              Order received
            </div>
            <h1 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium reveal" data-delay="80">
              Asante sana.
              <br />
              <span className="italic font-normal text-accent">Your order is on its way.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed reveal" data-delay="160">
              We&apos;ve sent a confirmation to your phone via M-Pesa. Our team will
              call within the hour to confirm delivery details. Same-day Nairobi,
              48 hours nationwide.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 reveal" data-delay="240">
              <button
                onClick={() => navigate({ view: "shop" })}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
              >
                Continue shopping
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate({ view: "home" })}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors"
              >
                Back to home
              </button>
            </div>

            <div className="mt-10 p-5 rounded-2xl border border-border bg-card text-left reveal" data-delay="320">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Order reference
              </div>
              <div className="mt-1 font-mono text-base text-foreground">
                SFT-{Date.now().toString(36).toUpperCase().slice(-8)}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 text-accent" />
                <span>Tracking link will be sent within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="container-premium">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border text-muted-foreground mb-6">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Your cart
            </div>
            <h1 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
              Empty, for now.
              <br />
              <span className="italic font-normal text-accent">Let&apos;s fix that.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Browse the curated edit of phones, laptops, audio and gaming.
              Pay with M-Pesa. Delivered nationwide.
            </p>
            <button
              onClick={() => navigate({ view: "shop" })}
              className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
            >
              Browse the shop
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="container-premium">
        {/* Header */}
        <div className="reveal mb-8">
          <button
            onClick={() => navigate({ view: "shop" })}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            ← Continue shopping
          </button>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Your cart
          </div>
          <h1 className="font-display tracking-tightest text-foreground text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] mt-3 font-medium">
            Review &amp; checkout.
            <br />
            <span className="italic font-normal text-accent">M-Pesa in one tap.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {count} {count === 1 ? "item" : "items"} in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items */}
          <div className="lg:col-span-8 reveal" data-delay="80">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-secondary/30">
                <div className="col-span-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Product
                </div>
                <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                  Quantity
                </div>
                <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
                  Price
                </div>
                <div className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right">
                  Subtotal
                </div>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    className="grid grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center"
                  >
                    {/* Product */}
                    <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                      <div
                        className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-border"
                        style={{
                          background: `linear-gradient(140deg, ${item.accent}22 0%, ${item.accent}10 50%, transparent 100%)`,
                        }}
                      >
                        <DeviceShape
                          shape={item.shape}
                          accent={item.accent}
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          {item.brand}
                        </div>
                        <button
                          onClick={() => navigate({ view: "product", slug: item.slug })}
                          className="block text-left hover:text-accent transition-colors"
                        >
                          <h3 className="font-display text-base text-foreground tracking-tight leading-tight line-clamp-2">
                            {item.name}
                          </h3>
                        </button>
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="md:hidden mt-1 text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Qty */}
                    <div className="col-span-6 md:col-span-2 flex md:justify-center">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQuantity(item.slug, item.quantity - 1)}
                          aria-label="Decrease"
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary rounded-l-full transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-medium tabular-nums min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.slug, item.quantity + 1)}
                          aria-label="Increase"
                          className="inline-flex h-8 w-8 items-center justify-center hover:bg-secondary rounded-r-full transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className="num-display text-sm text-foreground">
                        {formatKsh(item.price)}
                      </span>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2">
                      <span className="num-display text-sm font-medium text-foreground">
                        {formatKsh(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.slug)}
                        aria-label={`Remove ${item.name}`}
                        className="hidden md:inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={clear}
                className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear cart
              </button>
              <button
                onClick={() => navigate({ view: "shop" })}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                + Add more items
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 reveal" data-delay="160">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 md:p-7">
              <h2 className="font-display text-xl text-foreground tracking-tight">
                Order summary
              </h2>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="num-display text-foreground font-medium">
                    {formatKsh(subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="num-display text-foreground">
                    {shipping === 0 ? (
                      <span className="text-accent font-medium">Free</span>
                    ) : (
                      formatKsh(shipping)
                    )}
                  </dd>
                </div>
                {shipping === 0 && (
                  <div className="text-[11px] text-muted-foreground">
                    Free shipping on orders over KSh 100,000.
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">VAT (incl.)</dt>
                  <dd className="num-display text-muted-foreground">
                    {formatKsh(Math.round(subtotal * 0.16 / 1.16))}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 pt-5 border-t border-border flex items-baseline justify-between">
                <span className="font-display text-base text-foreground">Total</span>
                <span className="num-display text-2xl text-foreground font-medium tracking-tightest">
                  {formatKsh(total)}
                </span>
              </div>

              {/* Payment method */}
              <div className="mt-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Payment method
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="flex items-center gap-2 p-3 rounded-xl border border-foreground/40 bg-foreground/5 text-foreground text-xs font-medium"
                  >
                    <Smartphone className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    M-Pesa
                  </button>
                  <button
                    className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card text-muted-foreground text-xs font-medium"
                  >
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
                    Card
                  </button>
                </div>
              </div>

              {/* Checkout */}
              <button
                onClick={placeOrder}
                disabled={placing}
                className={cn(
                  "mt-6 group w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer",
                  placing && "opacity-70 cursor-wait"
                )}
              >
                {placing ? (
                  <>
                    <span className="inline-flex h-3 w-3 rounded-full border-2 border-background/40 border-t-background animate-spin" />
                    Sending STK push…
                  </>
                ) : (
                  <>
                    Place order · {formatKsh(total)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  <span>1-year warranty on every device</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Truck className="h-3.5 w-3.5 text-accent" />
                  <span>Same-day Nairobi · 48hr nationwide</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>7-day no-questions returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
