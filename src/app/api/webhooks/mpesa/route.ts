import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/webhooks/mpesa — Daraja STK Push callback
 *
 * Daraja sends a POST with stkCallback containing:
 *  - ResultCode: 0 = success, anything else = failure
 *  - ResultDesc: human-readable description
 *  - CallbackMetadata.Item[]: amount, mpesaReceiptNumber, phoneNumber, etc.
 *
 * This endpoint updates the order's payment status based on the callback.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Daraja wraps the callback in stkCallback
    const callback = body?.Body?.stkCallback;
    if (!callback) {
      return NextResponse.json({ error: "Invalid callback format" }, { status: 400 });
    }

    const {
      MerchantRequestID: merchantRequestId,
      CheckoutRequestID: checkoutRequestId,
      ResultCode: resultCode,
      ResultDesc: resultDesc,
    } = callback;

    // Find the order by M-Pesa request IDs
    const order = await db.order.findFirst({
      where: {
        OR: [
          { mpesaRequestId: merchantRequestId },
          { mpesaCheckoutId: checkoutRequestId },
        ],
      },
    });

    if (!order) {
      console.warn("[M-Pesa webhook] Order not found for merchantRequestId:", merchantRequestId);
      return NextResponse.json({ ok: true }); // ACK to Daraja even if order not found
    }

    if (resultCode === 0) {
      // Success — extract receipt number and amount
      const metadata = callback.CallbackMetadata?.Item ?? [];
      const receiptItem = metadata.find((i: { Name: string }) => i.Name === "MpesaReceiptNumber");
      const amountItem = metadata.find((i: { Name: string }) => i.Name === "Amount");

      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
        },
      });

      console.log(
        `[M-Pesa webhook] Order ${order.orderNumber} PAID — receipt: ${receiptItem?.Value}, amount: ${amountItem?.Value}`
      );
    } else {
      // Failure
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
          notes: `${order.notes ?? ""}\n[M-Pesa failure: ${resultDesc}]`.trim(),
        },
      });

      console.log(
        `[M-Pesa webhook] Order ${order.orderNumber} FAILED — ${resultDesc}`
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/webhooks/mpesa]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
