import { z } from "zod";

export const cartItemSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  quantity: z.number().int().min(1).max(20),
});

export const orderRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(10).max(20),
    address: z.string().trim().min(5).max(300),
    city: z.string().trim().min(2).max(100),
    county: z.string().trim().max(100).default(""),
    notes: z.string().trim().max(500).default(""),
  }),
  couponCode: z.string().trim().min(1).max(40).optional(),
});

export const mpesaRetrySchema = z.object({
  orderId: z.string().trim().min(1).max(80),
});

export const couponPreviewSchema = z.object({
  code: z.string().trim().min(1).max(40),
  items: z.array(cartItemSchema).min(1).max(50),
});
