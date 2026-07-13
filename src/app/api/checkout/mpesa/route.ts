import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initiateStkPush } from "@/lib/mpesa";
import { verifyOrderAccessToken } from "@/lib/order-access";
import {
  releaseOrderReservation,
  reserveOrderForRetry,
} from "@/lib/order-reservations";
import { mpesaRetrySchema } from "@/lib/order-validation";
import { mutationSecurityResponse } from "@/lib/request-security";

export async function POST(req: NextRequest) {
  const blocked = await mutationSecurityResponse(req, "mpesa-retry", 5, 10 * 60_000);
  if (blocked) return blocked;

  try {
    const parsed = mpesaRetrySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    const accessToken = req.headers.get("x-order-token");
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await db.order.findUnique({
      where: { id: parsed.data.orderId },
    });
    if (!order || !verifyOrderAccessToken(accessToken, order.accessTokenHash)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 409 });
    }
    if (order.paymentStatus === "INITIATED") {
      return NextResponse.json(
        { error: "A payment request is already in progress" },
        { status: 409 }
      );
    }

    if (order.paymentStatus === "FAILED") {
      await reserveOrderForRetry(order.id);
    }

    const result = await initiateStkPush({
      phone: order.customerPhone,
      amount: order.total,
      accountReference: order.orderNumber,
      transactionDesc: `Safaritech order ${order.orderNumber}`,
    });

    if (!result.success) {
      await releaseOrderReservation(order.id);
      return NextResponse.json(
        { error: result.error ?? "M-Pesa checkout failed" },
        { status: 502 }
      );
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        mpesaRequestId: result.merchantRequestId ?? null,
        mpesaCheckoutId: result.checkoutRequestId ?? null,
        paymentStatus: "INITIATED",
      },
    });

    return NextResponse.json({
      success: true,
      mock: result.mock ?? false,
      customerMessage: result.customerMessage,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("[/api/checkout/mpesa]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "M-Pesa checkout failed" },
      { status: 500 }
    );
  }
}
