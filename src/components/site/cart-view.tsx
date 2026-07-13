"use client";

import * as React from "react";
import {
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
import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function CartView() {
  const { navigate } = useViewRouter();
  const { items, setQuantity, removeItem, subtotal, clear, count } = useCart();
  const [placed, setPlaced] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState("");
  const [mpesaMock, setMpesaMock] = React.useState(false);
  const [failedOrder, setFailedOrder] = React.useState<{
    id: string;
    orderNumber: string;
    accessToken: string;
  } | null>(null);
  const [error, setError] = React.useState("");
  const [couponCode, setCouponCode] = React.useState("");
  const [couponStatus, setCouponStatus] = React.useState<{ valid: boolean; discount: number; reason?: string } | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  useScrollReveal([items.length, placed]);

  // Customer checkout form state
  const [customer, setCustomer] = React.useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    county: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const discount = couponStatus?.valid ? couponStatus.discount : 0;
  const shipping = subtotal - discount > 100000 ? 0 : 650;
  const total = subtotal - discount + shipping;

  const validateCustomer = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customer.name.trim()) errs.name = "Full name is required";
    if (!customer.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^(\+?254|0)[17]\d{8}$/.test(customer.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid Kenyan phone (e.g. 0712345678 or +254712345678)";
    }
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errs.email = "Enter a valid email or leave blank";
    }
    if (!customer.address.trim()) errs.address = "Delivery address is required";
    if (!customer.city.trim()) errs.city = "City is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const updateCustomer = (field: keyof typeof customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    // Clear field error on edit
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponStatus(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
          })),
        }),
      });
      const json = await res.json();
      setCouponStatus(json);
    } catch {
      setCouponStatus({ valid: false, discount: 0, reason: "Failed to validate" });
    } finally {
      setCouponLoading(false);
    }
  };

  const placeOrder = async () => {
    setError("");
    if (!validateCustomer()) {
      setError("Please complete the delivery details above before placing your order.");
      // Scroll to the first error field
      setTimeout(() => {
        const firstError = document.querySelector("[data-error='true']");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            quantity: i.quantity,
          })),
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            city: customer.city.trim(),
            county: customer.county.trim(),
            notes: customer.notes.trim(),
          },
          couponCode: couponStatus?.valid ? couponCode : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.order?.id && json.order?.orderNumber && json.accessToken) {
          const pendingOrder = {
            id: json.order.id,
            orderNumber: json.order.orderNumber,
            accessToken: json.accessToken,
          };
          setFailedOrder(pendingOrder);
          sessionStorage.setItem(
            `safaritech.order.${pendingOrder.id}`,
            pendingOrder.accessToken
          );
        }
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      if (!json.mpesa.success) {
        throw new Error(json.mpesa.error || "M-Pesa STK push failed");
      }

      setMpesaMock(json.mpesa.mock ?? false);
      setOrderNumber(json.order.orderNumber);
      sessionStorage.setItem(`safaritech.order.${json.order.id}`, json.accessToken);
      setPlaced(true);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const retryPayment = async () => {
    if (!failedOrder) return;
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout/mpesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-order-token": failedOrder.accessToken,
        },
        body: JSON.stringify({ orderId: failedOrder.id }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "M-Pesa STK push failed");
      }
      setMpesaMock(json.mock ?? false);
      setOrderNumber(json.orderNumber ?? failedOrder.orderNumber);
      setFailedOrder(null);
      setPlaced(true);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "M-Pesa STK push failed");
    } finally {
      setPlacing(false);
    }
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
              <span className="italic font-normal text-accent">Approve the M-Pesa prompt.</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed reveal" data-delay="160">
              {mpesaMock
                ? "This development order used the explicitly enabled M-Pesa mock. No real payment was collected."
                : "We've sent an STK push prompt to your phone via M-Pesa. Approve the prompt to complete payment. Same-day Nairobi, 48 hours nationwide."}
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
                {orderNumber}
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
                        <ProductImage
                          imageUrl={null}
                          shape={item.shape}
                          accent={item.accent}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full"
                          fit="contain"
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

          {/* Customer delivery details form */}
          <div className="lg:col-span-8 reveal" data-delay="120">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-7">
              <div className="flex items-center gap-3 mb-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-medium">
                  1
                </span>
                <h2 className="font-display text-xl text-foreground tracking-tight">
                  Delivery details
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-6 ml-10">
                We&apos;ll send your M-Pesa STK push to this phone number. All fields marked * are required.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CheckoutField
                  label="Full name *"
                  value={customer.name}
                  onChange={(v) => updateCustomer("name", v)}
                  error={formErrors.name}
                  placeholder="Wanjiru Kamau"
                  autoComplete="name"
                />
                <CheckoutField
                  label="Phone number (M-Pesa) *"
                  value={customer.phone}
                  onChange={(v) => updateCustomer("phone", v)}
                  error={formErrors.phone}
                  placeholder="0712 345 678"
                  autoComplete="tel"
                  type="tel"
                />
                <CheckoutField
                  label="Email (optional)"
                  value={customer.email}
                  onChange={(v) => updateCustomer("email", v)}
                  error={formErrors.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  type="email"
                />
                <CheckoutField
                  label="City *"
                  value={customer.city}
                  onChange={(v) => updateCustomer("city", v)}
                  error={formErrors.city}
                  placeholder="Nairobi"
                  autoComplete="address-level2"
                />
                <div className="sm:col-span-2">
                  <CheckoutField
                    label="Delivery address *"
                    value={customer.address}
                    onChange={(v) => updateCustomer("address", v)}
                    error={formErrors.address}
                    placeholder="House no, street, estate, landmark…"
                    autoComplete="street-address"
                  />
                </div>
                <CheckoutField
                  label="County"
                  value={customer.county}
                  onChange={(v) => updateCustomer("county", v)}
                  placeholder="Nairobi County"
                />
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Delivery notes (optional)
                    </span>
                    <textarea
                      value={customer.notes}
                      onChange={(e) => updateCustomer("notes", e.target.value)}
                      rows={2}
                      placeholder="E.g. call before delivery, gate code, leave with security…"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-y"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your details are used only to fulfil this order. We never share
                  customer data with third parties. Payment is handled securely via
                  M-Pesa Daraja STK push — we never see your PIN.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 reveal" data-delay="160">
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 md:p-7">
              <div className="flex items-center gap-3 mb-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-medium">
                  2
                </span>
                <h2 className="font-display text-xl text-foreground tracking-tight">
                  Review &amp; pay
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mb-5 ml-10">
                M-Pesa STK push · No card required
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="num-display text-foreground font-medium">
                    {formatKsh(subtotal)}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <dt className="text-accent">Discount ({couponCode.toUpperCase()})</dt>
                    <dd className="num-display text-accent font-medium">
                      −{formatKsh(discount)}
                    </dd>
                  </div>
                )}
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
                    {formatKsh(Math.round((subtotal - discount) * 0.16 / 1.16))}
                  </dd>
                </div>
              </dl>

              {/* Coupon */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Coupon code
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponStatus(null); }}
                    placeholder="WELCOME10"
                    className="flex-1 h-9 px-3 rounded-lg bg-background border border-border text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    onClick={validateCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="h-9 px-4 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? "…" : "Apply"}
                  </button>
                </div>
                {couponStatus && (
                  <div className={`mt-2 text-xs ${couponStatus.valid ? "text-accent" : "text-destructive"}`}>
                    {couponStatus.valid
                      ? `✓ ${formatKsh(couponStatus.discount)} discount applied`
                      : `✗ ${couponStatus.reason ?? "Invalid coupon"}`}
                  </div>
                )}
              </div>

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
                <div>
                  <button
                    className="w-full flex items-center gap-2 p-3 rounded-xl border border-foreground/40 bg-foreground/5 text-foreground text-xs font-medium"
                  >
                    <Smartphone className="h-4 w-4 text-accent" strokeWidth={1.5} />
                    M-Pesa
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Checkout */}
              <button
                onClick={failedOrder ? retryPayment : placeOrder}
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
                    {failedOrder
                      ? `Retry M-Pesa · ${failedOrder.orderNumber}`
                      : `Place order · ${formatKsh(total)}`}
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

function CheckoutField({
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
}) {
  return (
    <label className="block" data-error={!!error}>
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full h-10 px-3 rounded-lg bg-background border text-sm focus:outline-none focus:ring-2 transition-all",
          error
            ? "border-destructive/50 focus:ring-destructive/20"
            : "border-border focus:ring-accent/30 focus:border-accent/40"
        )}
      />
      {error && (
        <span className="block mt-1 text-[11px] text-destructive">{error}</span>
      )}
    </label>
  );
}
