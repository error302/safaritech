import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { releaseOrderReservation } from "@/lib/order-reservations";
import { mutationSecurityResponse } from "@/lib/request-security";

const updateOrderSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

const allowedTransitions = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
} as const;

/** PUT /api/admin/orders/[id] — update order status / payment status */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-orders", 60, 60_000);
  if (blocked) return blocked;
  try {
    const { id } = await params;
    const parsed = updateOrderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const existing = await db.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (parsed.data.status !== "CANCELLED" && existing.paymentStatus !== "PAID") {
      return NextResponse.json(
        { error: "Only paid orders can be fulfilled" },
        { status: 409 }
      );
    }
    if (parsed.data.status === "CANCELLED" && existing.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Paid orders must be refunded before cancellation" },
        { status: 409 }
      );
    }
    const allowed = allowedTransitions[existing.status] as readonly string[];
    if (parsed.data.status !== existing.status && !allowed.includes(parsed.data.status)) {
      return NextResponse.json(
        { error: `Cannot change order from ${existing.status} to ${parsed.data.status}` },
        { status: 409 }
      );
    }
    if (parsed.data.status === "CANCELLED") {
      await releaseOrderReservation(existing.id);
    }

    const order = await db.order.update({
      where: { id },
      data: { status: parsed.data.status },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("[/api/admin/orders/[id] PUT]", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
