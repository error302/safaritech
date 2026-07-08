import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/brands — all brands */
export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: [{ popular: "desc" }, { name: "asc" }],
    });
    return NextResponse.json({ brands });
  } catch (err) {
    console.error("[/api/brands] error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
