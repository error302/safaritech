import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/categories — all categories */
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[/api/categories] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
