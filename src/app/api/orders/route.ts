import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { calculateCouponDiscount, calculateShipping } from "@/lib/checkout";
import { db } from "@/lib/db";
import { initiateStkPush, isMpesaConfigured, normalizePhone } from "@/lib/mpesa";
import { createOrderAccessToken } from "@/lib/order-access";
import { releaseOrderReservation } from "@/lib/order-reservations";
import { orderRequestSchema } from "@/lib/order-validation";
import { mutationSecurityResponse } from "@/lib/request-security";

class OrderInputError extends Error {}

function createOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-7);
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `SFT-${timestamp}-${suffix}`;
}

export async function POST(req: NextRequest) {
  const blocked = await mutationSecurityResponse(req, "order-create", 10, 10 * 60_000);
  if (blocked) return blocked;

  try {
    const parsed = orderRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout details", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const quantities = new Map<string, number>();
    for (const item of parsed.data.items) {
      const quantity = (quantities.get(item.slug) ?? 0) + item.quantity;
      if (quantity > 20) {
        return NextResponse.json(
          { error: `Maximum quantity exceeded for ${item.slug}` },
          { status: 400 }
        );
      }
      quantities.set(item.slug, quantity);
    }

    const slugs = [...quantities.keys()];
    const products = await db.product.findMany({
      where: { slug: { in: slugs } },
      select: {
        id: true,
        slug: true,
        price: true,
        name: true,
        imageUrl: true,
        shape: true,
        accent: true,
        brand: { select: { name: true } },
      },
    });
    if (products.length !== slugs.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    const productMap = new Map(products.map((product) => [product.slug, product]));
    const items = slugs.map((slug) => {
      const product = productMap.get(slug);
      if (!product) throw new OrderInputError(`Product not found: ${slug}`);
      const quantity = quantities.get(slug) ?? 0;
      return {
        product,
        quantity,
        lineTotal: product.price * quantity,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    if (!Number.isSafeInteger(subtotal) || subtotal <= 0) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    const customerPhone = normalizePhone(parsed.data.customer.phone);
    const { token: accessToken, hash: accessTokenHash } = createOrderAccessToken();
    const orderNumber = createOrderNumber();

    const order = await db.$transaction(
      async (tx) => {
        for (const item of items) {
          const result = await tx.product.updateMany({
            where: {
              id: item.product.id,
              inStock: true,
              stockCount: { gte: item.quantity },
            },
            data: { stockCount: { decrement: item.quantity } },
          });
          if (result.count !== 1) {
            throw new OrderInputError(`${item.product.name} does not have enough stock`);
          }
          await tx.product.updateMany({
            where: { id: item.product.id, stockCount: 0 },
            data: { inStock: false },
          });
        }

        let discount = 0;
        let couponId: string | null = null;
        let couponCode: string | null = null;
        if (parsed.data.couponCode) {
          const coupon = await tx.coupon.findUnique({
            where: { code: parsed.data.couponCode.toUpperCase() },
          });
          if (!coupon) throw new OrderInputError("Coupon not found");
          const result = calculateCouponDiscount(coupon, subtotal);
          if (!result.valid) throw new OrderInputError(result.reason ?? "Coupon is invalid");
          discount = result.discount;
          couponId = coupon.id;
          couponCode = coupon.code;
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }

        const shipping = calculateShipping(subtotal - discount);
        const total = subtotal - discount + shipping;
        if (!Number.isSafeInteger(total) || total <= 0) {
          throw new OrderInputError("Invalid order total");
        }

        const created = await tx.order.create({
          data: {
            orderNumber,
            accessTokenHash,
            customerName: parsed.data.customer.name,
            customerEmail: parsed.data.customer.email,
            customerPhone,
            shippingAddress: parsed.data.customer.address,
            city: parsed.data.customer.city,
            county: parsed.data.customer.county || null,
            notes: parsed.data.customer.notes || null,
            subtotal,
            discount,
            shipping,
            total,
            couponCode,
            couponId,
            paymentMethod: "mpesa",
            paymentStatus: "PENDING",
            status: "PENDING",
          },
        });

        await tx.orderItem.createMany({
          data: items.map((item) => ({
            orderId: created.id,
            productId: item.product.id,
            productName: item.product.name,
            brandName: item.product.brand.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            imageUrl: item.product.imageUrl,
            shape: item.product.shape,
            accent: item.product.accent,
          })),
        });

        return created;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    const mpesa = await initiateStkPush({
      phone: customerPhone,
      amount: order.total,
      accountReference: order.orderNumber,
      transactionDesc: `Safaritech order ${order.orderNumber}`,
    });

    if (!mpesa.success) {
      await releaseOrderReservation(order.id);
      return NextResponse.json(
        {
          error: mpesa.error ?? "M-Pesa checkout failed",
          order: { id: order.id, orderNumber: order.orderNumber },
          accessToken,
        },
        { status: 502 }
      );
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "INITIATED",
        mpesaRequestId: mpesa.merchantRequestId ?? null,
        mpesaCheckoutId: mpesa.checkoutRequestId ?? null,
      },
    });

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          subtotal: order.subtotal,
          discount: order.discount,
          shipping: order.shipping,
          status: order.status,
          paymentStatus: "INITIATED",
        },
        accessToken,
        mpesa: {
          success: true,
          mock: mpesa.mock ?? false,
          customerMessage: mpesa.customerMessage,
        },
        mpesaConfigured: isMpesaConfigured(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[/api/orders POST]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[/api/orders GET]", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
