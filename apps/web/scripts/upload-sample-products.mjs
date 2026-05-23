/**
 * Upload sample product images via /api/upload (same as admin ImageUploader)
 * and create catalog products in the database.
 *
 * Usage (dev server must be running on port 3000):
 *   node apps/web/scripts/upload-sample-products.mjs
 */

import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR =
  process.env.SAMPLE_IMAGES_DIR || path.resolve(WEB_ROOT, "sample-images");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

/** Map asset filename fragments to product metadata */
const PRODUCT_MAP = [
  {
    match: "iPhone_17__strong",
    slug: "sample-apple-iphone-17",
    name: "Apple iPhone 17",
    brand: "Apple",
    price: 189999,
    salePrice: 179999,
    badge: "New",
  },
  {
    match: "iPhone_17_Pro_Max",
    slug: "sample-apple-iphone-17-pro-max",
    name: "Apple iPhone 17 Pro Max",
    brand: "Apple",
    price: 249999,
    salePrice: 239999,
    badge: "Pro",
    isHot: true,
  },
  {
    match: "UNIBODY_DESIGN",
    slug: "sample-apple-iphone-17-pro",
    name: "Apple iPhone 17 Pro",
    brand: "Apple",
    price: 219999,
    badge: "Pro",
  },
  {
    match: "S25_Ultra",
    slug: "sample-samsung-galaxy-s25-ultra-5g",
    name: "Samsung Galaxy S25 Ultra 5G",
    brand: "Samsung",
    price: 184999,
    salePrice: 169999,
    isHot: true,
    badge: "Bestseller",
  },
  {
    match: "Galaxy_S24_6_2",
    slug: "sample-samsung-galaxy-s24",
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    price: 124999,
    salePrice: 114999,
  },
  {
    match: "Tant_de_style",
    slug: "sample-samsung-galaxy-s26-ultra",
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    price: 199999,
    badge: "Coming Soon",
  },
  {
    match: "Plus_d_immersion",
    slug: "sample-samsung-galaxy-s26-plus",
    name: "Samsung Galaxy S26+",
    brand: "Samsung",
    price: 159999,
  },
  {
    match: "712483603592475739",
    slug: "sample-samsung-galaxy-s23",
    name: "Samsung Galaxy S23",
    brand: "Samsung",
    price: 89999,
    salePrice: 79999,
  },
  {
    match: "202802789466100784",
    slug: "sample-samsung-galaxy-s24-plus",
    name: "Samsung Galaxy S24+",
    brand: "Samsung",
    price: 139999,
    salePrice: 129999,
  },
  {
    match: "Galaxy_S23_-f59aa5c3",
    slug: "sample-samsung-galaxy-s23-ultra",
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    price: 164999,
    isHot: true,
  },
  {
    match: "Galaxy_S23___1_",
    slug: "sample-samsung-galaxy-s23-plus",
    name: "Samsung Galaxy S23+",
    brand: "Samsung",
    price: 114999,
  },
  {
    match: "Galaxy_S24_FE",
    slug: "sample-samsung-galaxy-s24-fe-5g",
    name: "Samsung Galaxy S24 FE 5G",
    brand: "Samsung",
    price: 89999,
    salePrice: 84999,
  },
  {
    match: "Galaxy_S22",
    slug: "sample-samsung-galaxy-s22",
    name: "Samsung Galaxy S22",
    brand: "Samsung",
    price: 74999,
    salePrice: 69999,
  },
  {
    match: "701787554478565924",
    slug: "sample-samsung-galaxy-s25-plus",
    name: "Samsung Galaxy S25+",
    brand: "Samsung",
    price: 149999,
  },
  {
    match: "S24_Ultra_-_512GB",
    slug: "sample-samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 179999,
    salePrice: 169999,
    isHot: true,
  },
  {
    match: "Compacto__potente",
    slug: "sample-samsung-galaxy-s25",
    name: "Samsung Galaxy S25",
    brand: "Samsung",
    price: 129999,
    salePrice: 119999,
  },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(filePath, fileName) {
  const buffer = await readFile(filePath);
  const blob = new Blob([buffer], { type: "image/png" });
  const formData = new FormData();
  formData.append("file", blob, fileName);
  formData.append("uploadTo", "local");

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Upload failed for ${fileName}`);
  }
  return data.url;
}

function resolveProduct(fileName) {
  const entry = PRODUCT_MAP.find((p) => fileName.includes(p.match));
  if (!entry) return null;
  return {
    ...entry,
    slug: entry.slug || `sample-${slugify(entry.name)}`,
  };
}

async function main() {
  console.log(`\n📁 Reading images from:\n   ${ASSETS_DIR}\n`);
  console.log(`🌐 Upload API: ${BASE_URL}/api/upload\n`);

  let files;
  try {
    files = (await readdir(ASSETS_DIR)).filter((f) => f.endsWith(".png"));
  } catch {
    console.error("Could not read assets directory. Set SAMPLE_IMAGES_DIR to your image folder.");
    process.exit(1);
  }

  if (files.length === 0) {
    console.error("No PNG files found in assets directory.");
    process.exit(1);
  }

  // Health check
  try {
    const health = await fetch(`${BASE_URL}/api/health`);
    if (!health.ok) throw new Error("unhealthy");
  } catch {
    console.error(`Dev server not reachable at ${BASE_URL}. Run: npm run dev`);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const category = await prisma.category.findFirst({ where: { slug: "smartphones" } });
  if (!category) {
    console.error('Category "smartphones" not found. Run: npm run prisma:seed');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const meta = resolveProduct(file);
    if (!meta) {
      console.log(`⏭️  Skip (no mapping): ${file}`);
      skipped++;
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug: meta.slug } });
    if (existing) {
      console.log(`⏭️  Already exists: ${meta.name}`);
      skipped++;
      continue;
    }

    const filePath = path.join(ASSETS_DIR, file);
    process.stdout.write(`⬆️  Uploading ${meta.name}... `);

    try {
      const imageUrl = await uploadImage(filePath, `${meta.slug}.png`);
      await prisma.product.create({
        data: {
          name: meta.name,
          slug: meta.slug,
          description: `${meta.name} — sample listing uploaded via admin upload API for Safaritech catalog testing.`,
          price: meta.price,
          salePrice: meta.salePrice ?? null,
          stock: 25,
          brand: meta.brand,
          categoryId: category.id,
          images: imageUrl,
          isHot: meta.isHot ?? false,
          badge: meta.badge ?? null,
        },
      });
      console.log(`✅ ${imageUrl}`);
      created++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
  }

  await prisma.$disconnect();

  console.log(`\n✨ Done: ${created} created, ${skipped} skipped`);
  console.log(`   Admin: ${BASE_URL}/admin/products`);
  console.log(`   Shop:  ${BASE_URL}/shop?cat=smartphones\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
