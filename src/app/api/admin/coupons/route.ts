import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";
import { couponPayloadSchema } from "@/lib/admin-validation";

/** GET /api/admin/coupons — list all coupons */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (err) {
    console.error("[/api/admin/coupons GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** POST /api/admin/coupons — create a coupon */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-coupons", 60, 60_000);
  if (blocked) return blocked;
  try {
    const parsed = couponPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid coupon details" }, { status: 400 });
    }
    const coupon = await db.coupon.create({
      data: { ...parsed.data, code: parsed.data.code.toUpperCase() },
    });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("[/api/admin/coupons POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
