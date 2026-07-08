import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/** GET /api/admin/orders — list all orders with items */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[/api/admin/orders GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
