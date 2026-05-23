import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Only seed the admin user - no mock data
  // The admin can add products, categories, etc. through the admin panel
  const adminEmail = process.env.ADMIN_EMAIL || "mohameddosho20@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@2024";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user ensured: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
