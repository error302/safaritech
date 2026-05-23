import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Products created with colliding slugs before explicit slug map */
const fixes = [
  {
    wrongSlug: "sample-samsung-galaxy-s24",
    correctSlug: "sample-samsung-galaxy-s24-plus",
    name: "Samsung Galaxy S24+",
  },
  {
    wrongSlug: "sample-samsung-galaxy-s25",
    correctSlug: "sample-samsung-galaxy-s25-plus",
    name: "Samsung Galaxy S25+",
  },
  {
    wrongSlug: "sample-samsung-galaxy-s26",
    correctSlug: "sample-samsung-galaxy-s26-plus",
    name: "Samsung Galaxy S26+",
  },
];

async function main() {
  for (const fix of fixes) {
    const product = await prisma.product.findUnique({ where: { slug: fix.wrongSlug } });
    if (!product) {
      console.log(`Skip (not found): ${fix.wrongSlug}`);
      continue;
    }
    if (product.name !== fix.name) {
      console.log(`Skip (name mismatch): ${fix.wrongSlug} is "${product.name}"`);
      continue;
    }
    const conflict = await prisma.product.findUnique({ where: { slug: fix.correctSlug } });
    if (conflict) {
      console.log(`Conflict exists: ${fix.correctSlug}`);
      continue;
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { slug: fix.correctSlug },
    });
    console.log(`Fixed slug: ${fix.wrongSlug} -> ${fix.correctSlug}`);
  }
  await prisma.$disconnect();
}

main();
