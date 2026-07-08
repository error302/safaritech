import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/**
 * GET /api/admin/products — list all products (admin)
 * POST /api/admin/products — create a new product (admin)
 */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
      },
    });
    const serialised = products.map((p) => ({
      ...p,
      features: JSON.parse(p.features),
      specs: JSON.parse(p.specs),
    }));
    return NextResponse.json({ products: serialised });
  } catch (err) {
    console.error("[/api/admin/products GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { brandSlug, categorySlug, features, specs, ...rest } = body;

    if (!rest.name || !rest.slug || !brandSlug || !categorySlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 400 });

    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });

    const product = await db.product.create({
      data: {
        ...rest,
        brandId: brand.id,
        categoryId: category.id,
        features: JSON.stringify(features ?? []),
        specs: JSON.stringify(specs ?? {}),
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[/api/admin/products POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
