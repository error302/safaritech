import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { releaseOrderReservation } from "@/lib/order-reservations";
import { rateLimitResponse } from "@/lib/request-security";
import {
  MpesaCallbackItem,
  validateMpesaPayment,
} from "@/lib/mpesa-callback";

interface StkCallback {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResultCode?: number;
  ResultDesc?: string;
  CallbackMetadata?: { Item?: MpesaCallbackItem[] };
}

function hasValidSecret(req: NextRequest): boolean {
  const expected = process.env.MPESA_CALLBACK_SECRET;
  const received = req.nextUrl.searchParams.get("token");
  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(req: NextRequest) {
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await rateLimitResponse(req, "mpesa-webhook", 120, 60_000);
  if (blocked) return blocked;

  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback as StkCallback | undefined;
    if (
      !callback?.CheckoutRequestID ||
      !callback.MerchantRequestID ||
      typeof callback.ResultCode !== "number"
    ) {
      return NextResponse.json({ error: "Invalid callback format" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { mpesaCheckoutId: callback.CheckoutRequestID },
    });
    if (!order || order.mpesaRequestId !== callback.MerchantRequestID) {
      return NextResponse.json({ ok: true });
    }

    if (callback.ResultCode !== 0) {
      await releaseOrderReservation(order.id);
      return NextResponse.json({ ok: true });
    }

    const metadata = callback.CallbackMetadata?.Item ?? [];
    const payment = validateMpesaPayment(
      metadata,
      order.total,
      order.customerPhone
    );
    if (!payment) {
      await releaseOrderReservation(order.id);
      return NextResponse.json({ ok: true });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({
        ok: order.mpesaReceiptNumber === payment.receipt,
      });
    }
    if (order.paymentStatus === "FAILED") {
      return NextResponse.json({ ok: true });
    }

    const receiptOrder = await db.order.findUnique({
      where: { mpesaReceiptNumber: payment.receipt },
      select: { id: true },
    });
    if (receiptOrder && receiptOrder.id !== order.id) {
      await releaseOrderReservation(order.id);
      return NextResponse.json({ ok: true });
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        mpesaReceiptNumber: payment.receipt,
        paidAmount: payment.amount,
        paidPhone: payment.phone,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/webhooks/mpesa]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
