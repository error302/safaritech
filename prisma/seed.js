const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create categories first
  const categoriesData = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Audio', slug: 'audio' },
  ];

  await prisma.category.createMany({
    skipDuplicates: true,
    data: categoriesData,
  });

  // Get categories
  const categories = await prisma.category.findMany({
    where: {
      slug: { in: categoriesData.map(c => c.slug) }
    }
  });

  const smartphoneCat = categories.find(c => c.slug === 'smartphones');
  const laptopCat = categories.find(c => c.slug === 'laptops');
  const audioCat = categories.find(c => c.slug === 'audio');

  // Create products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Safaritech S1 Phone',
        slug: 'safaritech-s1-phone',
        description: 'Fast, reliable smartphone for Kenya users.',
        price: 34999,
        stock: 140,
        images: ['/phone1.jpg', '/phone2.jpg'],
        categoryId: smartphoneCat?.id || '',
      },
      {
        name: 'Safaritech Ultra Laptop',
        slug: 'safaritech-ultra-laptop',
        description: 'Powerful laptop for work and gaming.',
        price: 129999,
        stock: 85,
        images: ['/laptop1.jpg', '/laptop2.jpg'],
        categoryId: laptopCat?.id || '',
      },
      {
        name: 'Safaritech Bass Earbuds',
        slug: 'safaritech-bass-earbuds',
        description: 'High-fidelity audio with noise reduction.',
        price: 8999,
        stock: 230,
        images: ['/earbuds1.jpg', '/earbuds2.jpg'],
        categoryId: audioCat?.id || '',
      },
    ],
  });

  // Create admin user
  const hashedPassword = await require('bcryptjs').hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@safaritech.co.ke' },
    update: {},
    create: {
      email: 'admin@safaritech.co.ke',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create test customer
  const customerHash = await require('bcryptjs').hash('customer123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@safaritech.co.ke' },
    update: {},
    create: {
      email: 'customer@safaritech.co.ke',
      name: 'Test Customer',
      passwordHash: customerHash,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Seed complete! Admin: admin@safaritech.co.ke / admin123 | Customer: customer@safaritech.co.ke / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

