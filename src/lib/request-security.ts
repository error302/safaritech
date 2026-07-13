import { createHash } from "crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RateLimitRow {
  count: number;
  resetAt: Date;
}

function clientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function rateLimitResponse(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
  identifier = clientIdentifier(req)
): Promise<NextResponse | null> {
  const result = await consumeRateLimit(scope, identifier, limit, windowMs);
  if (result.allowed) return null;

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429, headers: { "Retry-After": String(result.retryAfter) } }
  );
}

export async function consumeRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  const key = createHash("sha256")
    .update(`${scope}:${identifier}`)
    .digest("hex");
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const rows = await db.$queryRaw<RateLimitRow[]>(Prisma.sql`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${resetAt}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= ${now} THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= ${now} THEN ${resetAt}
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = ${now}
    RETURNING "count", "resetAt"
  `);
  const bucket = rows[0];
  if (!bucket || bucket.count <= limit) {
    return { allowed: true, retryAfter: 0 };
  }

  const retryAfter = Math.max(
    1,
    Math.ceil((new Date(bucket.resetAt).getTime() - now.getTime()) / 1000)
  );
  return { allowed: false, retryAfter };
}

export function hasTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const allowed = new Set<string>();
  if (process.env.NODE_ENV !== "production") {
    allowed.add(req.nextUrl.origin);
  }
  for (const value of [process.env.NEXTAUTH_URL, process.env.APP_ORIGIN]) {
    if (!value) continue;
    try {
      allowed.add(new URL(value).origin);
    } catch {
      return false;
    }
  }
  return allowed.has(origin);
}

export function invalidOriginResponse(req: NextRequest): NextResponse | null {
  return hasTrustedOrigin(req)
    ? null
    : NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
}

export async function mutationSecurityResponse(
  req: NextRequest,
  scope: string,
  limit = 60,
  windowMs = 60_000
): Promise<NextResponse | null> {
  return invalidOriginResponse(req) ?? (await rateLimitResponse(req, scope, limit, windowMs));
}
