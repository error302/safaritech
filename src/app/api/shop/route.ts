import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/shop — paginated catalog with full filter context
 * Returns products + facets (brands, categories, price range) for the filter sidebar.
 *
 * Query params:
 *   ?category=<slug>
 *   ?brand=<slug>
 *   ?q=<search>
 *   ?sort=price-asc|price-desc|rating|newest
 *   ?min=<int>&max=<int>
 *   ?page=<int>     — 1-indexed
 *   ?pageSize=<int> — default 12
 */
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const where: Record<string, unknown> = { inStock: true };

    const category = params.get("category");
    if (category) where.category = { slug: category };

    const brand = params.get("brand");
    if (brand) where.brand = { slug: brand };

    const condition = params.get("condition");
    if (condition) where.condition = condition;

    const q = params.get("q")?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
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

    const page = Math.max(1, Number(params.get("page") ?? 1));
    const pageSize = Math.min(48, Math.max(1, Number(params.get("pageSize") ?? 12)));
    const skip = (page - 1) * pageSize;

    const [products, total, brands, categories] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          brand: { select: { name: true, slug: true, accent: true } },
          category: { select: { name: true, slug: true, accent: true, shape: true } },
        },
      }),
      db.product.count({ where }),
      db.brand.findMany({
        orderBy: [{ popular: "desc" }, { name: "asc" }],
        select: { name: true, slug: true, popular: true, category: true, accent: true },
      }),
      db.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    const serialised = products.map((p) => ({
      ...p,
      features: JSON.parse(p.features) as string[],
      specs: JSON.parse(p.specs) as Record<string, string>,
    }));

    const priceAgg = await db.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    });

    return NextResponse.json({
      products: serialised,
      total,
      page,
      pageSize,
      pageCount: Math.ceil(total / pageSize),
      facets: {
        brands,
        categories,
        priceRange: {
          min: priceAgg._min.price ?? 0,
          max: priceAgg._max.price ?? 0,
        },
      },
    });
  } catch (err) {
    console.error("[/api/shop] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
