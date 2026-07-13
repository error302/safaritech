import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

/** GET /api/admin/orders — list all orders with items */
export async function GET() {
  if (!(await requireAdmin())) {
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
