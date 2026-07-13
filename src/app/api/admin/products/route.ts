import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";
import { productPayloadSchema } from "@/lib/admin-validation";

/**
 * GET /api/admin/products — list all products (admin)
 * POST /api/admin/products — create a new product (admin)
 */
export async function GET() {
  if (!(await requireAdmin())) {
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
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocked = await mutationSecurityResponse(req, "admin-products", 60, 60_000);
  if (blocked) return blocked;
  try {
    const parsed = productPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product details" }, { status: 400 });
    }
    const { brandSlug, categorySlug, features, specs, ...rest } = parsed.data;

    const brand = await db.brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return NextResponse.json({ error: "Brand not found" }, { status: 400 });

    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });

    const product = await db.product.create({
      data: {
        ...rest,
        inStock: rest.stockCount > 0 && rest.inStock,
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
