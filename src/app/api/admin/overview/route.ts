import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

/** GET /api/admin/overview — dashboard stats */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [
      productCount,
      orderCount,
      customerCount,
      couponCount,
      brandCount,
      recentOrders,
      revenueAgg,
      lowStockProducts,
    ] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.coupon.count(),
      db.brand.count(),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      db.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
      db.product.findMany({
        where: { stockCount: { lt: 10 } },
        take: 5,
        orderBy: { stockCount: "asc" },
        select: { id: true, name: true, slug: true, stockCount: true, brand: { select: { name: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        products: productCount,
        orders: orderCount,
        customers: customerCount,
        coupons: couponCount,
        brands: brandCount,
        revenue: revenueAgg._sum.total ?? 0,
        lowStock: lowStockProducts,
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          total: o.total,
          status: o.status,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt.toISOString(),
          itemCount: o.items.length,
        })),
      },
    });
  } catch (err) {
    console.error("[/api/admin/overview]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
