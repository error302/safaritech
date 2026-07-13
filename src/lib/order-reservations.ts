import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { calculateCouponDiscount } from "@/lib/checkout";

export async function releaseOrderReservation(orderId: string): Promise<void> {
  await db.$transaction(
    async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.paymentStatus === "PAID" || order.paymentStatus === "FAILED") {
        return;
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockCount: { increment: item.quantity }, inStock: true },
        });
      }

      if (order.couponId) {
        await tx.coupon.updateMany({
          where: { id: order.couponId, usedCount: { gt: 0 } },
          data: { usedCount: { decrement: 1 } },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: "FAILED" },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

export async function reserveOrderForRetry(orderId: string): Promise<void> {
  await db.$transaction(
    async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.paymentStatus !== "FAILED") {
        throw new Error("Order is not eligible for payment retry");
      }

      for (const item of order.items) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            inStock: true,
            stockCount: { gte: item.quantity },
          },
          data: { stockCount: { decrement: item.quantity } },
        });
        if (result.count !== 1) {
          throw new Error(`${item.productName} no longer has enough stock`);
        }
        await tx.product.updateMany({
          where: { id: item.productId, stockCount: 0 },
          data: { inStock: false },
        });
      }

      if (order.couponId) {
        const coupon = await tx.coupon.findUnique({ where: { id: order.couponId } });
        if (!coupon || !calculateCouponDiscount(coupon, order.subtotal).valid) {
          throw new Error("The coupon on this order is no longer available");
        }
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PENDING" },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}
