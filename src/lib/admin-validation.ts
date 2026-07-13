import { z } from "zod";

const imageUrlSchema = z.union([
  z.string().url().max(2_000),
  z.string().regex(/^\/uploads\/[a-zA-Z0-9._-]+$/),
]);

export const productPayloadSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  brandSlug: z.string().trim().min(1).max(100),
  categorySlug: z.string().trim().min(1).max(100),
  price: z.number().int().min(1).max(100_000_000),
  originalPrice: z.number().int().min(1).max(100_000_000).nullable(),
  tag: z.string().trim().max(80).nullable(),
  summary: z.string().trim().min(1).max(300),
  description: z.string().trim().min(1).max(5_000),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0).max(1_000_000),
  featured: z.boolean(),
  shape: z.string().trim().min(1).max(40),
  accent: z.string().trim().min(1).max(80),
  imageUrl: imageUrlSchema.nullable(),
  condition: z.enum(["NEW", "EXUK", "REFURBISHED"]),
  warrantyMonths: z.number().int().min(0).max(120),
  features: z.array(z.string().trim().min(1).max(300)).max(50),
  specs: z.record(z.string().trim().min(1).max(80), z.string().trim().max(500)),
}).superRefine((product, ctx) => {
  if (product.originalPrice !== null && product.originalPrice < product.price) {
    ctx.addIssue({
      code: "custom",
      path: ["originalPrice"],
      message: "Original price cannot be lower than the sale price",
    });
  }
  if (product.inStock && product.stockCount === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["stockCount"],
      message: "In-stock products need at least one item",
    });
  }
});

export const couponPayloadSchema = z.object({
  code: z.string().trim().regex(/^[A-Z0-9_-]+$/i).min(3).max(40),
  description: z.string().trim().max(300).nullable(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive().max(10_000_000),
  minOrder: z.number().int().min(0).max(100_000_000),
  maxDiscount: z.number().int().positive().max(100_000_000).nullable(),
  active: z.boolean(),
  usageLimit: z.number().int().positive().max(10_000_000).nullable(),
  expiresAt: z.coerce.date().nullable().optional(),
}).superRefine((coupon, ctx) => {
  if (coupon.type === "percentage" && coupon.value > 100) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: "Percentage discounts cannot exceed 100%",
    });
  }
});

export const couponUpdateSchema = z.object({
  active: z.boolean(),
});

export const settingsPayloadSchema = z.object({
  category: z.string().trim().regex(/^[a-z0-9-]+$/).min(1).max(40),
  settings: z.record(
    z.string().trim().regex(/^[a-zA-Z0-9.-]+$/).max(100),
    z.string().max(2_000)
  ),
});
