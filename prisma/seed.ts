import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data for clean seed
  await prisma.review.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categoriesData = [
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Audio", slug: "audio" },
    { name: "Accessories", slug: "accessories" },
    { name: "Wearables", slug: "wearables" },
    { name: "Tablets", slug: "tablets" },
    { name: "Gaming", slug: "gaming" },
    { name: "Smart Home", slug: "smart-home" },
    { name: "Storage", slug: "storage" },
    { name: "Networking", slug: "networking" },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const categories = await prisma.category.findMany();

  const getCategoryId = (slug: string) =>
    categories.find((c) => c.slug === slug)?.id ?? "";

  // Create products
  const productsData = [
    {
      name: "Safaritech S1 Phone",
      slug: "safaritech-s1-phone",
      description: "Fast, reliable smartphone for Kenya users with 5G support.",
      price: 34999,
      stock: 140,
      images: "https://via.placeholder.com/400x400?text=S1+Phone",
      specs: JSON.stringify({ ram: "8GB", storage: "128GB", battery: "5000mAh", camera: "48MP" }),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Safaritech Ultra Laptop",
      slug: "safaritech-ultra-laptop",
      description: "Powerful laptop for work and gaming with latest Intel processor.",
      price: 129999,
      stock: 85,
      images: "https://via.placeholder.com/400x400?text=Ultra+Laptop",
      specs: JSON.stringify({ cpu: "Intel i7", ram: "16GB", storage: "512GB SSD", display: "15.6inch" }),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Safaritech Bass Earbuds",
      slug: "safaritech-bass-earbuds",
      description: "High-fidelity audio with active noise reduction.",
      price: 8999,
      stock: 230,
      images: "https://via.placeholder.com/400x400?text=Bass+Earbuds",
      specs: JSON.stringify({ battery: "30h", wireless: true, noiseCancellation: true }),
      categoryId: getCategoryId("audio"),
    },
    {
      name: "Safaritech Pro Tablet",
      slug: "safaritech-pro-tablet",
      description: "Versatile tablet for productivity and entertainment.",
      price: 59999,
      stock: 65,
      images: "https://via.placeholder.com/400x400?text=Pro+Tablet",
      specs: JSON.stringify({ screen: "10.5inch", storage: "256GB", battery: "8000mAh" }),
      categoryId: getCategoryId("tablets"),
    },
    {
      name: "Safaritech Smart Watch",
      slug: "safaritech-smart-watch",
      description: "Fitness tracking smartwatch with health monitoring.",
      price: 24999,
      stock: 120,
      images: "https://via.placeholder.com/400x400?text=Smart+Watch",
      specs: JSON.stringify({ battery: "7days", gps: true, heartRate: true }),
      categoryId: getCategoryId("wearables"),
    },
    {
      name: "Safaritech Gaming Console",
      slug: "safaritech-gaming-console",
      description: "Next-gen gaming console with 4K support.",
      price: 89999,
      stock: 45,
      images: "https://via.placeholder.com/400x400?text=Gaming+Console",
      specs: JSON.stringify({ storage: "1TB", resolution: "4K", controllers: 2 }),
      categoryId: getCategoryId("gaming"),
    },
    {
      name: "Safaritech Wireless Charger",
      slug: "safaritech-wireless-charger",
      description: "Fast wireless charging pad for all devices.",
      price: 4999,
      stock: 300,
      images: "https://via.placeholder.com/400x400?text=Wireless+Charger",
      specs: JSON.stringify({ power: "15W", compatibility: "Qi standard" }),
      categoryId: getCategoryId("accessories"),
    },
    {
      name: "Safaritech External SSD",
      slug: "safaritech-external-ssd",
      description: "High-speed portable SSD for data storage.",
      price: 19999,
      stock: 90,
      images: "https://via.placeholder.com/400x400?text=External+SSD",
      specs: JSON.stringify({ capacity: "1TB", speed: "1050MB/s", interface: "USB-C" }),
      categoryId: getCategoryId("storage"),
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  const products = await prisma.product.findMany();

  // Create users
  const usersData = [
    {
      email: "admin@safaritech.co.ke",
      name: "Admin User",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
    {
      email: "customer@safaritech.co.ke",
      name: "Test Customer",
      passwordHash: await bcrypt.hash("customer123", 10),
      role: "CUSTOMER",
    },
    {
      email: "john.doe@example.com",
      name: "John Doe",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "CUSTOMER",
    },
    {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "CUSTOMER",
    },
    {
      email: "mike.johnson@example.com",
      name: "Mike Johnson",
      passwordHash: await bcrypt.hash("password123", 10),
      role: "CUSTOMER",
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const users = await prisma.user.findMany();

  // Create addresses
  const addressesData = [
    {
      userId: users[1].id, // customer
      label: "Home",
      line1: "123 Main Street",
      city: "Nairobi",
      state: "Nairobi County",
      postal: "00100",
      country: "Kenya",
      phone: "+254712345678",
    },
    {
      userId: users[1].id,
      label: "Work",
      line1: "456 Business Ave",
      city: "Nairobi",
      state: "Nairobi County",
      postal: "00200",
      country: "Kenya",
      phone: "+254712345679",
    },
    {
      userId: users[2].id, // john
      label: "Home",
      line1: "789 Residential Rd",
      city: "Mombasa",
      state: "Mombasa County",
      postal: "80100",
      country: "Kenya",
      phone: "+254723456789",
    },
  ];

  for (const address of addressesData) {
    await prisma.address.create({
      data: address,
    });
  }

  const addresses = await prisma.address.findMany();

  // Create orders
  const ordersData = [
    {
      userId: users[1].id,
      status: "DELIVERED",
      total: 43998,
      paymentStatus: "CONFIRMED",
      paymentMethod: "MPESA",
      shippingAddressId: addresses[0].id,
      createdAt: new Date("2024-01-15"),
    },
    {
      userId: users[2].id,
      status: "PROCESSING",
      total: 129999,
      paymentStatus: "PENDING",
      paymentMethod: "CARD",
      shippingAddressId: addresses[2].id,
      createdAt: new Date("2024-03-20"),
    },
    {
      userId: users[3].id,
      status: "SHIPPED",
      total: 34999,
      paymentStatus: "CONFIRMED",
      paymentMethod: "MPESA",
      createdAt: new Date("2024-02-10"),
    },
  ];

  for (const order of ordersData) {
    await prisma.order.create({
      data: order,
    });
  }

  const orders = await prisma.order.findMany();

  // Create order items
  const orderItemsData = [
    {
      orderId: orders[0].id,
      productId: products[0].id,
      quantity: 1,
      unitPrice: 34999,
    },
    {
      orderId: orders[0].id,
      productId: products[2].id,
      quantity: 1,
      unitPrice: 8999,
    },
    {
      orderId: orders[1].id,
      productId: products[1].id,
      quantity: 1,
      unitPrice: 129999,
    },
    {
      orderId: orders[2].id,
      productId: products[0].id,
      quantity: 1,
      unitPrice: 34999,
    },
  ];

  for (const item of orderItemsData) {
    await prisma.orderItem.create({
      data: item,
    });
  }

  // Create cart items
  const cartItemsData = [
    {
      userId: users[1].id,
      productId: products[3].id,
      quantity: 1,
    },
    {
      userId: users[2].id,
      productId: products[4].id,
      quantity: 2,
    },
  ];

  for (const item of cartItemsData) {
    await prisma.cartItem.create({
      data: item,
    });
  }

  // Create wishlist items
  const wishlistItemsData = [
    {
      userId: users[1].id,
      productId: products[5].id,
    },
    {
      userId: users[2].id,
      productId: products[6].id,
    },
    {
      userId: users[3].id,
      productId: products[7].id,
    },
  ];

  for (const item of wishlistItemsData) {
    await prisma.wishlistItem.create({
      data: item,
    });
  }

  // Create reviews
  const reviewsData = [
    {
      userId: users[1].id,
      productId: products[0].id,
      rating: 5,
      comment: "Excellent phone, great battery life!",
    },
    {
      userId: users[2].id,
      productId: products[1].id,
      rating: 4,
      comment: "Powerful laptop, perfect for my work.",
    },
    {
      userId: users[3].id,
      productId: products[2].id,
      rating: 5,
      comment: "Amazing sound quality, noise cancellation works great.",
    },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({
      data: review,
    });
  }

  // Create blog posts
  const blogPostsData = [
    {
      title: "Top 5 Smartphones for 2024",
      slug: "top-5-smartphones-2024",
      content: "Discover the best smartphones available in Kenya this year...",
      excerpt: "A comprehensive guide to the top smartphones of 2024.",
      authorId: users[0].id,
      published: true,
      publishedAt: new Date("2024-01-01"),
    },
    {
      title: "How to Choose the Right Laptop",
      slug: "how-to-choose-right-laptop",
      content: "Factors to consider when buying a laptop in Kenya...",
      excerpt: "Essential tips for selecting the perfect laptop.",
      authorId: users[0].id,
      published: true,
      publishedAt: new Date("2024-02-01"),
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.create({
      data: post,
    });
  }

  // Create coupons
  const couponsData = [
    {
      code: "WELCOME10",
      description: "10% off first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 10000,
      usageLimit: 100,
      expiresAt: new Date("2024-12-31"),
    },
    {
      code: "SAVE5000",
      description: "KSh 5,000 off orders over KSh 50,000",
      discountType: "FIXED",
      discountValue: 5000,
      minOrderValue: 50000,
      usageLimit: 50,
      expiresAt: new Date("2024-06-30"),
    },
  ];

  for (const coupon of couponsData) {
    await prisma.coupon.create({
      data: coupon,
    });
  }

  console.log("✅ Enhanced seed complete!");
  console.log(`Created ${categories.length} categories, ${products.length} products, ${users.length} users`);
  console.log(`Created ${orders.length} orders, ${reviewsData.length} reviews, ${blogPostsData.length} blog posts, ${couponsData.length} coupons`);
  console.log("Admin: admin@safaritech.co.ke / admin123");
  console.log("Customer: customer@safaritech.co.ke / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
