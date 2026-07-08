import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products/[slug] — single product with full details + reviews
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        reviews_rel: {
          orderBy: { createdAt: "desc" },
          take: 12,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Related — same category, exclude current, take 4
    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        slug: { not: product.slug },
        inStock: true,
      },
      take: 4,
      include: {
        brand: { select: { name: true, slug: true, accent: true } },
        category: { select: { name: true, slug: true, accent: true, shape: true } },
      },
    });

    const serialised = {
      ...product,
      features: JSON.parse(product.features) as string[],
      specs: JSON.parse(product.specs) as Record<string, string>,
      related: related.map((r) => ({
        ...r,
        features: JSON.parse(r.features) as string[],
        specs: JSON.parse(r.specs) as Record<string, string>,
      })),
    };

    return NextResponse.json({ product: serialised });
  } catch (err) {
    console.error("[/api/products/[slug]] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
