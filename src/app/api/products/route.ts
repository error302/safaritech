import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products
 * Query params:
 *   ?featured=true       — only featured products
 *   ?category=<slug>     — filter by category
 *   ?brand=<slug>        — filter by brand
 *   ?q=<search>          — name/description contains
 *   ?sort=price-asc|price-desc|rating|newest
 *   ?min=<int>&max=<int> — price range
 *   ?take=<int>          — limit (default 50)
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const where: Record<string, unknown> = { inStock: true };

    if (params.get("featured") === "true") where.featured = true;

    const category = params.get("category");
    if (category) {
      where.category = { slug: category };
    }

    const brand = params.get("brand");
    if (brand) {
      where.brand = { slug: brand };
    }

    const q = params.get("q")?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { summary: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const min = params.get("min");
    const max = params.get("max");
    if (min || max) {
      where.price = {};
      if (min) (where.price as { gte?: number }).gte = Number(min);
      if (max) (where.price as { lte?: number }).lte = Number(max);
    }

    const sort = params.get("sort");
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { rating: "desc" };

    const take = Number(params.get("take") ?? 50);

    const products = await db.product.findMany({
      where,
      orderBy,
      take,
      include: {
        brand: { select: { name: true, slug: true, accent: true } },
        category: { select: { name: true, slug: true, accent: true, shape: true } },
      },
    });

    const serialised = products.map((p) => ({
      ...p,
      features: JSON.parse(p.features) as string[],
      specs: JSON.parse(p.specs) as Record<string, string>,
    }));

    return NextResponse.json({ products: serialised });
  } catch (err) {
    console.error("[/api/products] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
