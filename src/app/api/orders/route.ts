import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initiateStkPush, isMpesaConfigured } from "@/lib/mpesa";

/**
 * POST /api/orders — create an order from cart items + initiate M-Pesa STK Push
 *
 * Body: {
 *   items: [{ slug, name, brand, price, quantity, shape, accent, imageUrl }],
 *   customer: { name, email, phone, address, city, county, notes },
 *   couponCode?: string,
 *   shipping: number,
 *   subtotal: number,
 * }
 *
 * Returns: { order, mpesa: { success, mock, customerMessage, checkoutRequestId } }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, couponCode, shipping, subtotal } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json({ error: "Customer name and phone are required" }, { status: 400 });
    }

    // Validate products against DB (prevent price tampering)
    const slugs = items.map((i: { slug: string }) => i.slug);
    const dbProducts = await db.product.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true, price: true, name: true, brandId: true, imageUrl: true, shape: true, accent: true, brand: { select: { name: true } } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.slug, p]));

    let computedSubtotal = 0;
    const orderItems: {
      productId: string;
      productName: string;
      brandName: string;
      unitPrice: number;
      quantity: number;
      lineTotal: number;
      imageUrl: string | null;
      shape: string;
      accent: string;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.slug);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 400 });
      }
      const unitPrice = product.price; // always use DB price
      const lineTotal = unitPrice * item.quantity;
      computedSubtotal += lineTotal;
      orderItems.push({
        product: { connect: { id: product.id } },
        productName: product.name,
        brandName: product.brand?.name ?? "",
        unitPrice,
        quantity: item.quantity,
        lineTotal,
        imageUrl: product.imageUrl,
        shape: product.shape,
        accent: product.accent,
      });
    }

    // Coupon validation
    let discount = 0;
    let couponId: string | null = null;
    let couponCodeStr: string | null = null;

    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.active) {
        const expired = coupon.expiresAt && coupon.expiresAt < new Date();
        const exhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        const meetsMin = computedSubtotal >= coupon.minOrder;

        if (!expired && !exhausted && meetsMin) {
          if (coupon.type === "percentage") {
            discount = Math.round((computedSubtotal * coupon.value) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = Math.round(coupon.value);
          }
          couponId = coupon.id;
          couponCodeStr = coupon.code;
        }
      }
    }

    const computedShipping = shipping ?? (computedSubtotal > 100000 ? 0 : 650);
    const total = computedSubtotal - discount + computedShipping;

    // Generate order number
    const orderNumber = `SFT-${Date.now().toString(36).toUpperCase().slice(-8)}`;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email || "",
        customerPhone: customer.phone,
        shippingAddress: customer.address || null,
        city: customer.city || null,
        county: customer.county || null,
        notes: customer.notes || null,
        subtotal: computedSubtotal,
        discount,
        shipping: computedShipping,
        total,
        couponCode: couponCodeStr,
        couponId,
        paymentMethod: "mpesa",
        paymentStatus: "INITIATED",
        status: "PENDING",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Increment coupon usage
    if (couponId) {
      await db.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Initiate M-Pesa STK Push
    const mpesaResult = await initiateStkPush({
      phone: customer.phone,
      amount: total,
      accountReference: orderNumber,
      transactionDesc: `Safaritech order ${orderNumber}`,
    });

    // Update order with M-Pesa request IDs
    if (mpesaResult.success) {
      await db.order.update({
        where: { id: order.id },
        data: {
          mpesaRequestId: mpesaResult.merchantRequestId ?? null,
          mpesaCheckoutId: mpesaResult.checkoutRequestId ?? null,
        },
      });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
      mpesa: {
        success: mpesaResult.success,
        mock: mpesaResult.mock ?? false,
        customerMessage: mpesaResult.customerMessage,
        error: mpesaResult.error,
      },
      mpesaConfigured: isMpesaConfigured(),
    });
  } catch (err) {
    console.error("[/api/orders POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

/** GET /api/orders — list orders (admin only, or by email for customers) */
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const token = req.headers.get("x-admin-token");
    const expected = process.env.ADMIN_TOKEN;

    const where: Record<string, unknown> = {};
    if (email) {
      where.customerEmail = email;
    } else if (!expected || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: true },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[/api/orders GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
