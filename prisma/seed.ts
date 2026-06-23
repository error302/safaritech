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

  // Seed delivery zones — realistic Kenya courier rates.
  // Mombasa is pickup-only at a specific point; other towns have delivery fees.
  const zones = [
    { name: "Nairobi (Within CBD)", type: "DELIVERY", fee: 250, sortOrder: 1 },
    { name: "Nairobi (Outskirts)", type: "DELIVERY", fee: 400, sortOrder: 2 },
    { name: "Mombasa (Pickup)", type: "PICKUP", fee: 0, pickupPoint: "Safaritech Mombasa Pickup Point — Nyali Centre, Shop 12, Links Road, Nyali, Mombasa. Open Mon-Sat 9AM-6PM. Phone: +254 700 111 222.", sortOrder: 3 },
    { name: "Kisumu", type: "DELIVERY", fee: 600, sortOrder: 4 },
    { name: "Nakuru", type: "DELIVERY", fee: 550, sortOrder: 5 },
    { name: "Eldoret", type: "DELIVERY", fee: 650, sortOrder: 6 },
    { name: "Thika", type: "DELIVERY", fee: 350, sortOrder: 7 },
    { name: "Other (Major Towns)", type: "DELIVERY", fee: 800, sortOrder: 8 },
  ];
  for (const z of zones) {
    await prisma.deliveryZone.upsert({
      where: { name: z.name },
      update: {},
      create: z,
    });
  }
  console.log(`✅ ${zones.length} delivery zones seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
