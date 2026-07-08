import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/** PUT /api/admin/coupons/[id] — update coupon */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    if (body.code) body.code = body.code.toUpperCase().trim();
    const coupon = await db.coupon.update({ where: { id }, data: body });
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/admin/coupons/[id] DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
