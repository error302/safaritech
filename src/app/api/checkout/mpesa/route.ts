import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initiateStkPush } from "@/lib/mpesa";

/**
 * POST /api/checkout/mpesa — initiate STK Push for an existing order
 *
 * Body: { orderId: string, phone?: string }
 * (phone optional — falls back to order.customerPhone)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, phone } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const phoneToUse = phone || order.customerPhone;

    const result = await initiateStkPush({
      phone: phoneToUse,
      amount: order.total,
      accountReference: order.orderNumber,
      transactionDesc: `Safaritech order ${order.orderNumber}`,
    });

    if (result.success) {
      await db.order.update({
        where: { id: order.id },
        data: {
          mpesaRequestId: result.merchantRequestId ?? null,
          mpesaCheckoutId: result.checkoutRequestId ?? null,
          paymentStatus: "INITIATED",
        },
      });
    }

    return NextResponse.json({
      success: result.success,
      mock: result.mock ?? false,
      customerMessage: result.customerMessage,
      error: result.error,
      orderNumber: order.orderNumber,
    });
  } catch (err) {
    console.error("[/api/checkout/mpesa]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "M-Pesa checkout failed" },
      { status: 500 }
    );
  }
}
