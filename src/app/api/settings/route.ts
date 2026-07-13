import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { mutationSecurityResponse } from "@/lib/request-security";
import { settingsPayloadSchema } from "@/lib/admin-validation";

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
 * Admin-only via the server-side NextAuth session.
 *
 * Body: { settings: { "hero.titleLine1": "New title", ... }, category: "hero" }
 */
export async function PUT(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const blocked = await mutationSecurityResponse(req, "admin-settings", 60, 60_000);
    if (blocked) return blocked;

    const parsed = settingsPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
    }

    await db.$transaction(
      Object.entries(parsed.data.settings).map(([key, value]) => {
        const serialized = JSON.stringify(value);
        return db.siteSetting.upsert({
          where: { key },
          update: { value: serialized, category: parsed.data.category },
          create: {
            key,
            value: serialized,
            category: parsed.data.category,
          },
        });
      })
    );

    return NextResponse.json({
      success: true,
      updated: Object.keys(parsed.data.settings).length,
    });
  } catch (err) {
    console.error("[/api/settings PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
