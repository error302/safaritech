const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      slug: true,
      brand: true,
      price: true,
      images: true,
    }
  });
  console.log(`Total products: ${products.length}`);
  console.log("Products:");
  products.forEach(p => {
    console.log(`- [${p.brand}] ${p.name} (${p.slug}): Price ${p.price}, Images: ${p.images}`);
  });
}
main().finally(()=>prisma.$disconnect());
