import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";
import { couponUpdateSchema } from "@/lib/admin-validation";

/** PUT /api/admin/coupons/[id] — update coupon */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-coupons", 60, 60_000);
  if (blocked) return blocked;
  try {
    const { id } = await params;
    const parsed = couponUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid coupon update" }, { status: 400 });
    }
    const coupon = await db.coupon.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("[/api/admin/coupons/[id] PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** DELETE /api/admin/coupons/[id] — delete coupon */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-coupons", 60, 60_000);
  if (blocked) return blocked;
  try {
    const { id } = await params;
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/admin/coupons/[id] DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
