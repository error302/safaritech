import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";
import { productPayloadSchema } from "@/lib/admin-validation";

/**
 * GET /api/admin/products/[slug] — single product (admin)
 * PUT /api/admin/products/[slug] — update product (admin)
 * DELETE /api/admin/products/[slug] — delete product (admin)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdmin())) {
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-products", 60, 60_000);
  if (blocked) return blocked;
  try {
    const { slug } = await params;
    const parsed = productPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product details" }, { status: 400 });
    }
    const { brandSlug, categorySlug, features, specs, ...rest } = parsed.data;

    const existing = await db.product.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!brand || !category) {
      return NextResponse.json({ error: "Brand or category not found" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { slug },
      data: {
        ...rest,
        inStock: rest.stockCount > 0 && rest.inStock,
        brandId: brand.id,
        categoryId: category.id,
        features: JSON.stringify(features),
        specs: JSON.stringify(specs),
      },
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-products", 60, 60_000);
  if (blocked) return blocked;
  try {
    const { slug } = await params;
    await db.product.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/admin/products/[slug] DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
