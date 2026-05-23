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

// Determine the correct datasource URL for Prisma Accelerate
function getDatasourceUrl(): string | undefined {
  const accelerateUrl = process.env.DATABASE_URL_ACCELERATE;
  if (accelerateUrl) return accelerateUrl;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://"))) {
    return dbUrl;
  }
  return undefined;
}

const datasourceUrl = getDatasourceUrl();
const prisma = new PrismaClient({
  ...(datasourceUrl ? { datasourceUrl } : {}),
});

async function main() {
  const email = "admin@safaritech.co.ke";
  const password = "Admin@2024";
  const name = "Safaritech Admin";

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
