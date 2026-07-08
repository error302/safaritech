import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/coupons/validate
 * Body: { code: string, subtotal: number }
 * Returns: { valid, discount, type, value, description, reason }
 */
export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Missing code or subtotal" }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, reason: "Coupon not found" });
    }

    if (!coupon.active) {
      return NextResponse.json({ valid: false, reason: "Coupon is no longer active" });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, reason: "Coupon has expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, reason: "Coupon usage limit reached" });
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({
        valid: false,
        reason: `Minimum order is KSh ${coupon.minOrder.toLocaleString("en-KE")}`,
      });
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.round(coupon.value);
    }

    return NextResponse.json({
      valid: true,
      discount,
      type: coupon.type,
      value: coupon.value,
      description: coupon.description,
      code: coupon.code,
    });
  } catch (err) {
    console.error("[/api/coupons/validate]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
