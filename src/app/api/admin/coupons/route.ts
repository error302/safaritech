import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/** GET /api/admin/coupons — list all coupons */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }
    body.code = body.code.toUpperCase().trim();
    const coupon = await db.coupon.create({ data: body });
    return NextResponse.json({ coupon });
  } catch (err) {
    console.error("[/api/admin/coupons POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
