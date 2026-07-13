import assert from "node:assert/strict";
import test from "node:test";
import type { Coupon } from "@prisma/client";
import {
  calculateCouponDiscount,
  calculateShipping,
  STANDARD_SHIPPING_FEE,
} from "../src/lib/checkout";
import { orderRequestSchema } from "../src/lib/order-validation";

function coupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    id: "coupon",
    code: "SAVE10",
    description: null,
    type: "percentage",
    value: 10,
    minOrder: 0,
    maxDiscount: null,
    active: true,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

test("calculates capped coupon discounts and server shipping", () => {
  const result = calculateCouponDiscount(
    coupon({ value: 50, maxDiscount: 2_000 }),
    10_000
  );
  assert.deepEqual(result, { valid: true, discount: 2_000 });
  assert.equal(calculateShipping(98_000), STANDARD_SHIPPING_FEE);
  assert.equal(calculateShipping(100_001), 0);
});

test("rejects exhausted coupons", () => {
  const result = calculateCouponDiscount(
    coupon({ usageLimit: 2, usedCount: 2 }),
    10_000
  );
  assert.equal(result.valid, false);
  assert.equal(result.discount, 0);
});

test("rejects negative quantities and strips client totals", () => {
  const result = orderRequestSchema.safeParse({
    items: [{ slug: "phone", quantity: -1 }],
    customer: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "0712345678",
      address: "1 Market Street",
      city: "Nairobi",
    },
    shipping: -10_000,
    subtotal: -20_000,
  });
  assert.equal(result.success, false);
});
