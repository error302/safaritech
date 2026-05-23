/**
 * Seed script: creates an admin user for Safaritech.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Or via package.json script:
 *   bun run seed:admin
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Determine the correct datasource URL
// Use non-pooled URL for CLI/seed operations, pooled for runtime
function getDatasourceUrl(): string | undefined {
  // For seed scripts, prefer the direct (non-pooled) connection
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) return dbUrl;
  // Fall back to pooled URL
  const pooledUrl = process.env.DATABASE_URL_POOLED;
  if (pooledUrl) return pooledUrl;
  // Support legacy Accelerate URLs
  const accelerateUrl = process.env.DATABASE_URL_ACCELERATE;
  if (accelerateUrl) return accelerateUrl;
  return undefined;
}

const datasourceUrl = getDatasourceUrl();
const prisma = new PrismaClient({
  ...(datasourceUrl ? { datasourceUrl } : {}),
});

async function main() {
  const email = process.env.ADMIN_EMAIL || "mohameddosho20@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@2024";
  const name = process.env.ADMIN_NAME || "Safaritech Admin";

  console.log(`Seeding admin user: ${email}`);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Update password and role in case they changed
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        role: "ADMIN",
        name,
      },
    });
    console.log(`✅ Updated existing admin user: ${email}`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`✅ Created admin user: ${email}`);
  }

  console.log(`   Password: ${password}`);
  console.log(`   Role: ADMIN`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
