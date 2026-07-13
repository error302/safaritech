import { NextRequest, NextResponse } from "next/server";
import { calculateCouponDiscount } from "@/lib/checkout";
import { db } from "@/lib/db";
import { couponPreviewSchema } from "@/lib/order-validation";
import { mutationSecurityResponse } from "@/lib/request-security";

export async function POST(req: NextRequest) {
  const blocked = await mutationSecurityResponse(req, "coupon-validate", 30, 10 * 60_000);
  if (blocked) return blocked;

  try {
    const parsed = couponPreviewSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid coupon request" }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of parsed.data.items) {
      const quantity = (quantities.get(item.slug) ?? 0) + item.quantity;
      if (quantity > 20) {
        return NextResponse.json(
          { valid: false, reason: "Maximum product quantity exceeded" },
          { status: 400 }
        );
      }
      quantities.set(item.slug, quantity);
    }

    const products = await db.product.findMany({
      where: { slug: { in: [...quantities.keys()] } },
      select: { slug: true, price: true },
    });
    if (products.length !== quantities.size) {
      return NextResponse.json({ valid: false, reason: "A product is unavailable" });
    }

    const subtotal = products.reduce(
      (sum, product) => sum + product.price * (quantities.get(product.slug) ?? 0),
      0
    );
    const coupon = await db.coupon.findUnique({
      where: { code: parsed.data.code.toUpperCase() },
    });
    if (!coupon) {
      return NextResponse.json({ valid: false, reason: "Coupon not found" });
    }

    const result = calculateCouponDiscount(coupon, subtotal);
    return NextResponse.json({
      ...result,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      code: coupon.code,
    });
  } catch (error) {
    console.error("[/api/coupons/validate]", error);
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
