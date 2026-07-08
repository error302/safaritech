"use client";

import * as React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart, formatKsh } from "./cart-context";
import { useViewRouter } from "./view-router";
import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, setQuantity, removeItem, subtotal, count } = useCart();
  const { navigate } = useViewRouter();
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const goToCart = () => {
    close();
    navigate({ view: "cart" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background border-l border-border flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4 text-foreground" strokeWidth={1.5} />
            <h2 className="font-display text-lg tracking-tight text-foreground">
              Your cart
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-border text-muted-foreground">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-display text-xl text-foreground">Your cart is empty</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Curated tech is waiting. Browse the collection and find
                something you&apos;ll love.
              </p>
            </div>
            <button
              onClick={() => {
                close();
                navigate({ view: "shop" });
              }}
              className="mt-2 inline-flex items-center gap-2 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
            >
              Browse the shop
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => {
                const discount = item.originalPrice
                  ? Math.round((1 - item.price / item.originalPrice) * 100)
                  : 0;
                return (
                  <div
                    key={item.slug}
                    className="flex gap-4 p-3 rounded-xl border border-border bg-card hover:bg-secondary/30 transition-colors"
                  >
                    {/* Thumb */}
                    <div
                      className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border border-border"
                      style={{
                        background: `linear-gradient(140deg, ${item.accent}22 0%, ${item.accent}10 50%, transparent 100%)`,
                      }}
                    >
                      <ProductImage
                        imageUrl={null}
                        shape={item.shape}
                        accent={item.accent}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full"
                        fit="contain"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {item.brand}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-foreground leading-tight line-clamp-2">
                        {item.name}
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="num-display text-sm text-foreground font-medium">
                          {formatKsh(item.price)}
                        </span>
                      </div>

                      {/* Qty controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => setQuantity(item.slug, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="inline-flex h-7 w-7 items-center justify-center hover:bg-secondary rounded-l-full transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.slug, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="inline-flex h-7 w-7 items-center justify-center hover:bg-secondary rounded-r-full transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.slug)}
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="num-display text-lg text-foreground font-medium">
                  {formatKsh(subtotal)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>M-Pesa ready · 7-day returns · 1-year warranty</span>
              </div>
              <button
                onClick={goToCart}
                className="group w-full h-11 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors btn-shimmer"
              >
                Review cart &amp; checkout
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
