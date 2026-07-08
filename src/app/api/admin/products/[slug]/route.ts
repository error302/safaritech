import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function checkAuth(req: NextRequest): boolean {
  const token = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;
  return !!expected && token === expected;
}

/**
 * GET /api/admin/products/[slug] — single product (admin)
 * PUT /api/admin/products/[slug] — update product (admin)
 * DELETE /api/admin/products/[slug] — delete product (admin)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      product: {
        ...product,
        features: JSON.parse(product.features),
        specs: JSON.parse(product.specs),
      },
    });
  } catch (err) {
    console.error("[/api/admin/products/[slug] GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    const body = await req.json();
    const { brandSlug, categorySlug, features, specs, ...rest } = body;

    const existing = await db.product.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = { ...rest };
    if (features !== undefined) data.features = JSON.stringify(features);
    if (specs !== undefined) data.specs = JSON.stringify(specs);

    if (brandSlug) {
      const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
      if (brand) data.brandId = brand.id;
    }
    if (categorySlug) {
      const category = await db.category.findUnique({ where: { slug: categorySlug } });
      if (category) data.categoryId = category.id;
    }

    const product = await db.product.update({
      where: { slug },
      data,
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[/api/admin/products/[slug] PUT]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { slug } = await params;
    await db.product.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/admin/products/[slug] DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
