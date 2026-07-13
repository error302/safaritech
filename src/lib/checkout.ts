import type { Coupon } from "@prisma/client";

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const STANDARD_SHIPPING_FEE = 650;

export function calculateShipping(subtotalAfterDiscount: number): number {
  return subtotalAfterDiscount > FREE_SHIPPING_THRESHOLD
    ? 0
    : STANDARD_SHIPPING_FEE;
}

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
  now = new Date()
): { valid: boolean; discount: number; reason?: string } {
  if (!coupon.active) {
    return { valid: false, discount: 0, reason: "Coupon is no longer active" };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { valid: false, discount: 0, reason: "Coupon has expired" };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, reason: "Coupon usage limit reached" };
  }
  if (subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      reason: `Minimum order is KSh ${coupon.minOrder.toLocaleString("en-KE")}`,
    };
  }

  const rawDiscount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.round(coupon.value);
  const cappedDiscount =
    coupon.maxDiscount !== null
      ? Math.min(rawDiscount, coupon.maxDiscount)
      : rawDiscount;

  return {
    valid: true,
    discount: Math.min(Math.max(cappedDiscount, 0), subtotal),
  };
}
