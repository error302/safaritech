import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/settings — returns all site settings as a flat key-value map.
 * Public endpoint — no auth required. Frontend calls this on mount.
 *
 * Optionally filter by category: /api/settings?category=hero
 */
export async function GET(req: NextRequest) {
  try {
    const cat = req.nextUrl.searchParams.get("category");
    const where = cat ? { category: cat } : {};
    const rows = await db.siteSetting.findMany({ where });
    const map: Record<string, string> = {};
    for (const r of rows) {
      try {
        map[r.key] = JSON.parse(r.value);
      } catch {
        map[r.key] = r.value;
      }
    }
    return NextResponse.json({ settings: map });
  } catch (err) {
    console.error("[/api/settings GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/**
 * PUT /api/settings — bulk update site settings.
 * Admin-only (simple token check via header X-Admin-Token).
 *
 * Body: { settings: { "hero.titleLine1": "New title", ... }, category: "hero" }
 */
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get("x-admin-token");
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const settings: Record<string, unknown> = body.settings;
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Missing settings" }, { status: 400 });
    }

    const category = (body.category as string) || "general";

    for (const [key, value] of Object.entries(settings)) {
      const serialized = JSON.stringify(value);
      await db.siteSetting.upsert({
        where: { key },
        update: { value: serialized, category },
        create: { key, value: serialized, category },
      });
    }

    return NextResponse.json({ success: true, updated: Object.keys(settings).length });
  } catch (err) {
    console.error("[/api/settings PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
