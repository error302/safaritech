import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/** PUT /api/admin/orders/[id] — update order status / payment status */
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
    const { status, paymentStatus } = body;

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const order = await db.order.update({
      where: { id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("[/api/admin/orders/[id] PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
