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

  console.log("🧹 Cleared all existing data...");

  // ─── CATEGORIES ──────────────────────────────────────────────────────────────
  const categoriesData = [
    { name: "Smartphones", slug: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop" },
    { name: "Laptops", slug: "laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop" },
    { name: "Audio", slug: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop" },
    { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop" },
    { name: "Wearables", slug: "wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop" },
    { name: "Tablets", slug: "tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop" },
    { name: "Gaming", slug: "gaming", image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=400&auto=format&fit=crop" },
    { name: "Smart Home", slug: "smart-home", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop" },
    { name: "Storage", slug: "storage", image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&auto=format&fit=crop" },
    { name: "Networking", slug: "networking", image: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&auto=format&fit=crop" },
    { name: "Cameras", slug: "cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop" },
    { name: "TVs & Displays", slug: "tvs-displays", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=400&auto=format&fit=crop" },
  ];

  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { image: category.image },
      create: category,
    });
  }

  const categories = await prisma.category.findMany();
  const getCategoryId = (slug: string) => categories.find((c) => c.slug === slug)?.id ?? "";

  console.log(`✅ Created ${categories.length} categories`);

  // ─── PRODUCTS ────────────────────────────────────────────────────────────────
  const productsData = [
    // ─── SAMSUNG ───────────────────────────────────────────────────────────────
    {
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "The ultimate Samsung flagship with 200MP camera, built-in S Pen, and Snapdragon 8 Gen 3. Titanium frame, 6.8-inch QHD+ display. Made for those who demand the absolute best.",
      price: 179999,
      salePrice: 169999,
      stock: 45,
      brand: "Samsung",
      isHot: true,
      badge: "Bestseller",
      images: JSON.stringify(["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.8\" QHD+ 120Hz", processor: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB", camera: "200MP + 12MP + 10MP", battery: "5000mAh", os: "Android 14" }),
      colors: JSON.stringify(["Titanium Black", "Titanium Gray", "Titanium Violet"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Samsung Galaxy S24+",
      slug: "samsung-galaxy-s24-plus",
      description: "Samsung's premium mid-flagship with a 6.7-inch ProVisual Engine display, 50MP triple camera, and AI-powered Galaxy features. Ideal everyday powerhouse.",
      price: 134999,
      salePrice: 124999,
      stock: 60,
      brand: "Samsung",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.7\" QHD+ 120Hz", processor: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB", camera: "50MP + 12MP + 10MP", battery: "4900mAh" }),
      colors: JSON.stringify(["Onyx Black", "Marble Gray", "Cobalt Violet"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Samsung Galaxy A55 5G",
      slug: "samsung-galaxy-a55-5g",
      description: "5G-ready mid-ranger with a stunning 6.6-inch Super AMOLED display, 50MP OIS camera, and 5000mAh battery. Perfect value for Kenyan users.",
      price: 54999,
      stock: 120,
      brand: "Samsung",
      badge: "5G Ready",
      images: JSON.stringify(["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.6\" Super AMOLED 120Hz", processor: "Exynos 1480", ram: "8GB", storage: "128GB", camera: "50MP OIS + 12MP + 5MP", battery: "5000mAh" }),
      colors: JSON.stringify(["Awesome Navy", "Awesome Lilac", "Awesome Iceblue"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Samsung Galaxy Book4 Pro",
      slug: "samsung-galaxy-book4-pro",
      description: "Ultra-slim 16-inch laptop with Intel Core Ultra 7, AMOLED display, and seamless Galaxy ecosystem integration. Built for creative professionals.",
      price: 189999,
      stock: 25,
      brand: "Samsung",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "16\" 3K AMOLED 120Hz", processor: "Intel Core Ultra 7 155H", ram: "16GB LPDDR5", storage: "512GB NVMe SSD", gpu: "Intel Arc Graphics", battery: "76Wh" }),
      colors: JSON.stringify(["Moonstone Gray"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Samsung Galaxy Tab S9 FE",
      slug: "samsung-galaxy-tab-s9-fe",
      description: "Fan Edition tablet with IP68 water resistance, 10.9-inch LCD, and S Pen included. Excellent for students and productivity on-the-go.",
      price: 64999,
      salePrice: 58999,
      stock: 55,
      brand: "Samsung",
      badge: "S Pen Included",
      images: JSON.stringify(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "10.9\" LCD TFT", processor: "Exynos 1380", ram: "6GB", storage: "128GB", battery: "8000mAh", spen: true }),
      colors: JSON.stringify(["Gray", "Silver", "Mint", "Lavender"]),
      categoryId: getCategoryId("tablets"),
    },

    // ─── APPLE ─────────────────────────────────────────────────────────────────
    {
      name: "Apple iPhone 15 Pro Max",
      slug: "apple-iphone-15-pro-max",
      description: "Apple's most powerful iPhone ever. Titanium design, A17 Pro chip, 48MP main camera with 5x optical zoom, and Action button. The pinnacle of smartphone engineering.",
      price: 219999,
      stock: 30,
      brand: "Apple",
      isHot: true,
      badge: "Premium",
      images: JSON.stringify(["https://images.unsplash.com/photo-1696446702183-cbd596f4c555?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.7\" Super Retina XDR ProMotion 120Hz", processor: "Apple A17 Pro", storage: "256GB", camera: "48MP + 12MP + 12MP (5x zoom)", battery: "4422mAh" }),
      colors: JSON.stringify(["Natural Titanium", "Black Titanium", "White Titanium", "Blue Titanium"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Apple iPhone 15",
      slug: "apple-iphone-15",
      description: "Dynamic Island, 48MP camera, USB-C connector, and A16 Bionic chip. The everyday iPhone that does everything beautifully.",
      price: 139999,
      salePrice: 129999,
      stock: 75,
      brand: "Apple",
      images: JSON.stringify(["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.1\" Super Retina XDR", processor: "Apple A16 Bionic", storage: "128GB", camera: "48MP + 12MP", battery: "3349mAh" }),
      colors: JSON.stringify(["Pink", "Yellow", "Green", "Blue", "Black"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Apple MacBook Air M3",
      slug: "apple-macbook-air-m3",
      description: "Impossibly thin, powered by Apple M3 chip. 18-hour battery life, 13.6-inch Liquid Retina display, fanless design. The world's best thin-and-light laptop.",
      price: 179999,
      stock: 35,
      brand: "Apple",
      isHot: true,
      badge: "M3 Chip",
      images: JSON.stringify(["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "13.6\" Liquid Retina 2560x1664", processor: "Apple M3 8-core CPU", ram: "8GB Unified Memory", storage: "256GB SSD", battery: "52.6Wh (18hr)" }),
      colors: JSON.stringify(["Midnight", "Starlight", "Space Gray", "Sky Blue"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Apple MacBook Pro 14\" M3 Pro",
      slug: "apple-macbook-pro-14-m3-pro",
      description: "Professional powerhouse with M3 Pro chip, stunning Liquid Retina XDR display, and all-day battery. Built for developers, editors, and creators who need maximum performance.",
      price: 289999,
      stock: 20,
      brand: "Apple",
      badge: "Pro",
      images: JSON.stringify(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "14.2\" Liquid Retina XDR ProMotion 120Hz", processor: "Apple M3 Pro 11-core CPU", ram: "18GB Unified Memory", storage: "512GB SSD", battery: "70Wh" }),
      colors: JSON.stringify(["Space Black", "Silver"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Apple iPad Pro 12.9\" M2",
      slug: "apple-ipad-pro-12-m2",
      description: "The ultimate iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil Pro support. Thin as a pencil, powerful as a Mac.",
      price: 154999,
      stock: 28,
      brand: "Apple",
      images: JSON.stringify(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "12.9\" Liquid Retina XDR", processor: "Apple M2", storage: "256GB", camera: "12MP Wide + 10MP Ultra Wide", battery: "40.88Wh" }),
      colors: JSON.stringify(["Silver", "Space Gray"]),
      categoryId: getCategoryId("tablets"),
    },
    {
      name: "Apple Watch Series 9",
      slug: "apple-watch-series-9",
      description: "The most capable Apple Watch yet with S9 chip, double tap gesture, Always-On Retina display, and advanced health sensors including ECG and blood oxygen.",
      price: 64999,
      stock: 60,
      brand: "Apple",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "45mm Always-On Retina LTPO", processor: "Apple S9 SiP", gps: true, waterResistance: "WR50", ecg: true }),
      colors: JSON.stringify(["Midnight", "Starlight", "Silver", "Red", "Pink"]),
      categoryId: getCategoryId("wearables"),
    },
    {
      name: "Apple AirPods Pro 2nd Gen",
      slug: "apple-airpods-pro-2nd-gen",
      description: "Industry-leading Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio. H2 chip delivers up to 30 hours battery with the case.",
      price: 39999,
      salePrice: 34999,
      stock: 95,
      brand: "Apple",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ anc: true, battery: "6hr (30hr with case)", chip: "H2", spatialAudio: true, waterResistance: "IPX4" }),
      colors: JSON.stringify(["White"]),
      categoryId: getCategoryId("audio"),
    },

    // ─── HP ────────────────────────────────────────────────────────────────────
    {
      name: "HP Spectre x360 14",
      slug: "hp-spectre-x360-14",
      description: "HP's flagship 2-in-1 convertible with OLED touchscreen, Intel Core Ultra 7, and gem-cut design. Use it as a laptop, tent, or tablet.",
      price: 209999,
      stock: 18,
      brand: "HP",
      badge: "2-in-1",
      images: JSON.stringify(["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "14\" 2.8K OLED Touchscreen 120Hz", processor: "Intel Core Ultra 7 155H", ram: "32GB LPDDR5", storage: "1TB SSD", battery: "66Wh" }),
      colors: JSON.stringify(["Nightfall Black"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "HP Victus 15 Gaming",
      slug: "hp-victus-15-gaming",
      description: "Affordable gaming laptop with Ryzen 5 7535HS, RTX 4060 GPU, and 144Hz IPS display. Dominate every game without breaking the bank.",
      price: 119999,
      salePrice: 109999,
      stock: 40,
      brand: "HP",
      isHot: true,
      badge: "Gaming",
      images: JSON.stringify(["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "15.6\" FHD IPS 144Hz", processor: "AMD Ryzen 5 7535HS", ram: "16GB DDR5", storage: "512GB NVMe", gpu: "RTX 4060 8GB" }),
      colors: JSON.stringify(["Orca Silver", "Performance Blue"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "HP EliteBook 840 G11",
      slug: "hp-elitebook-840-g11",
      description: "Enterprise-grade business laptop with Intel Core Ultra 5, military-grade durability, and HP Sure View privacy screen. Built for professionals who need security.",
      price: 159999,
      stock: 22,
      brand: "HP",
      images: JSON.stringify(["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "14\" WUXGA IPS", processor: "Intel Core Ultra 5 125U", ram: "16GB", storage: "512GB SSD", battery: "51Wh", mil_spec: "MIL-STD-810H" }),
      colors: JSON.stringify(["Silver"]),
      categoryId: getCategoryId("laptops"),
    },

    // ─── DELL ──────────────────────────────────────────────────────────────────
    {
      name: "Dell XPS 15 (2024)",
      slug: "dell-xps-15-2024",
      description: "Dell's iconic XPS lineup redefined. 15.6-inch 3.5K OLED display, Intel Core Ultra 9, RTX 4060, and CNC-machined aluminum chassis. A masterpiece of engineering.",
      price: 259999,
      stock: 15,
      brand: "Dell",
      badge: "Premium",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "15.6\" 3.5K OLED 60Hz", processor: "Intel Core Ultra 9 185H", ram: "32GB DDR5", storage: "1TB NVMe", gpu: "RTX 4060 8GB", battery: "86Wh" }),
      colors: JSON.stringify(["Platinum Silver"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Dell Inspiron 15 3000",
      slug: "dell-inspiron-15-3000",
      description: "Reliable everyday laptop with AMD Ryzen 5, 15.6-inch FHD display, and fast SSD storage. Perfect for students and everyday computing in Kenya.",
      price: 69999,
      salePrice: 62999,
      stock: 80,
      brand: "Dell",
      images: JSON.stringify(["https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "15.6\" FHD IPS Anti-glare", processor: "AMD Ryzen 5 7520U", ram: "8GB DDR5", storage: "256GB SSD", battery: "54Wh" }),
      colors: JSON.stringify(["Carbon Black"]),
      categoryId: getCategoryId("laptops"),
    },

    // ─── SONY ──────────────────────────────────────────────────────────────────
    {
      name: "Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description: "Sony's best noise-cancelling headphones. 30-hour battery, multipoint connection, Speak-to-Chat, and LDAC Hi-Res Wireless. Silence the world, find your flow.",
      price: 44999,
      salePrice: 38999,
      stock: 70,
      brand: "Sony",
      isHot: true,
      badge: "Best ANC",
      images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ type: "Over-ear", anc: true, battery: "30hr", codec: "LDAC, AAC, SBC", multipoint: true, foldable: true }),
      colors: JSON.stringify(["Black", "Silver"]),
      categoryId: getCategoryId("audio"),
    },
    {
      name: "Sony WF-1000XM5",
      slug: "sony-wf-1000xm5",
      description: "World's best true wireless ANC earbuds. Smallest and lightest in class, with 8 hours playback + 24hrs from case and Integrated Processor V2.",
      price: 34999,
      stock: 85,
      brand: "Sony",
      images: JSON.stringify(["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ type: "True Wireless In-ear", anc: true, battery: "8hr (24hr with case)", codec: "LDAC, AAC", ipx4: true }),
      colors: JSON.stringify(["Black", "Silver"]),
      categoryId: getCategoryId("audio"),
    },
    {
      name: "Sony PlayStation 5 Slim",
      slug: "sony-playstation-5-slim",
      description: "The new, slimmer PS5 with the same incredible performance. 4K gaming, ray tracing, 120fps support, and access to PlayStation's world-class exclusive titles.",
      price: 84999,
      stock: 32,
      brand: "Sony",
      isHot: true,
      badge: "Next-Gen",
      images: JSON.stringify(["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ processor: "AMD Zen 2 8-core 3.5GHz", gpu: "AMD RDNA 2 10.28 TFLOPs", storage: "1TB NVMe SSD", resolution: "Up to 8K", fps: "Up to 120fps" }),
      colors: JSON.stringify(["White"]),
      categoryId: getCategoryId("gaming"),
    },
    {
      name: "Sony Alpha ZV-E10 Camera",
      slug: "sony-alpha-zv-e10",
      description: "APS-C mirrorless camera designed for vloggers. 24.2MP sensor, 4K video, directional 3-capsule mic, and 180° flip screen. Perfect for Kenyan content creators.",
      price: 74999,
      salePrice: 68999,
      stock: 25,
      brand: "Sony",
      images: JSON.stringify(["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ sensor: "24.2MP APS-C", video: "4K 30fps / 1080p 120fps", autofocus: "Real-time Eye AF", screen: "3\" 180° Flip Touchscreen", mic: "3-capsule directional" }),
      colors: JSON.stringify(["Black", "White"]),
      categoryId: getCategoryId("cameras"),
    },

    // ─── JBL ───────────────────────────────────────────────────────────────────
    {
      name: "JBL Charge 5",
      slug: "jbl-charge-5",
      description: "Portable Bluetooth speaker with bold JBL Pro Sound, IP67 waterproof, 20-hour battery, and power bank feature. The party goes wherever you go.",
      price: 18999,
      salePrice: 16499,
      stock: 110,
      brand: "JBL",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ battery: "20hr", waterproof: "IP67", bluetooth: "5.1", powerBank: true, sound: "JBL Pro Sound" }),
      colors: JSON.stringify(["Black", "Blue", "Red", "Teal", "Squad"]),
      categoryId: getCategoryId("audio"),
    },
    {
      name: "JBL Flip 6",
      slug: "jbl-flip-6",
      description: "Compact and portable JBL speaker with IP67 protection and 12-hour battery. Richer bass and clearer treble with the all-new racetrack-shaped driver.",
      price: 12999,
      stock: 140,
      brand: "JBL",
      images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ battery: "12hr", waterproof: "IP67", bluetooth: "5.1", partyboost: true }),
      colors: JSON.stringify(["Black", "Blue", "Pink", "Red", "Gray"]),
      categoryId: getCategoryId("audio"),
    },
    {
      name: "JBL Tune 770NC",
      slug: "jbl-tune-770nc",
      description: "Wireless ANC headphones with Adaptive Noise Cancelling, Ambient Aware, and 70-hour battery life. Foldable, comfortable, and affordable.",
      price: 14999,
      salePrice: 12499,
      stock: 95,
      brand: "JBL",
      images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ type: "Over-ear", anc: true, battery: "70hr (ANC on: 50hr)", multipoint: true, foldable: true }),
      colors: JSON.stringify(["Black", "White", "Blue"]),
      categoryId: getCategoryId("audio"),
    },

    // ─── XIAOMI ────────────────────────────────────────────────────────────────
    {
      name: "Xiaomi 14 Ultra",
      slug: "xiaomi-14-ultra",
      description: "Leica-engineered quad camera system, Snapdragon 8 Gen 3, and a 1-inch main sensor. The most serious camera phone from Xiaomi yet.",
      price: 159999,
      stock: 30,
      brand: "Xiaomi",
      isHot: true,
      badge: "Leica Camera",
      images: JSON.stringify(["https://images.unsplash.com/photo-1581795669633-91ef7c9699a8?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.73\" LTPO AMOLED 120Hz", processor: "Snapdragon 8 Gen 3", ram: "16GB", storage: "512GB", camera: "50MP 1\" Leica + 50MP periscope", battery: "5000mAh 90W" }),
      colors: JSON.stringify(["Black", "White", "Dragon Crystal"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Xiaomi Redmi Note 13 Pro+",
      slug: "xiaomi-redmi-note-13-pro-plus",
      description: "200MP main camera, IP68 water resistance, and 120W HyperCharge — 0 to 100% in 19 minutes. Exceptional value for your money.",
      price: 49999,
      salePrice: 44999,
      stock: 130,
      brand: "Xiaomi",
      badge: "200MP",
      images: JSON.stringify(["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.67\" AMOLED 120Hz", processor: "MediaTek Dimensity 7200 Ultra", ram: "12GB", storage: "256GB", camera: "200MP + 8MP + 2MP", battery: "5000mAh 120W" }),
      colors: JSON.stringify(["Aurora Purple", "Moonlight White", "Fusion Black"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Xiaomi Smart Band 8",
      slug: "xiaomi-smart-band-8",
      description: "Lightweight fitness tracker with AMOLED display, 16 days battery, 150+ workout modes, and SpO2/heart rate monitoring. Kenya's best value fitness band.",
      price: 4999,
      stock: 250,
      brand: "Xiaomi",
      badge: "Best Value",
      images: JSON.stringify(["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "1.62\" AMOLED", battery: "16 days", workoutModes: 150, gps: true, heartRate: true, spo2: true }),
      colors: JSON.stringify(["Black", "Silver", "Pink"]),
      categoryId: getCategoryId("wearables"),
    },

    // ─── INFINIX ───────────────────────────────────────────────────────────────
    {
      name: "Infinix Zero 40 5G",
      slug: "infinix-zero-40-5g",
      description: "Kenya's hottest 5G phone under KSh 45,000. Dimensity 8200 Ultimate, 50MP OIS main camera, and 90W fast charging. Built for Kenyan streets.",
      price: 39999,
      salePrice: 36999,
      stock: 160,
      brand: "Infinix",
      isHot: true,
      badge: "5G",
      images: JSON.stringify(["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.78\" AMOLED 144Hz", processor: "MediaTek Dimensity 8200 Ultimate", ram: "12GB", storage: "256GB", camera: "50MP OIS + 13MP + 2MP", battery: "4600mAh 90W" }),
      colors: JSON.stringify(["Misty Violet", "Volcanic Black", "Starfall Gold"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Infinix NOTE 40 Pro",
      slug: "infinix-note-40-pro",
      description: "MagCharge wireless charging, 100W wired charging, and a beautiful AMOLED display. The most feature-packed budget phone in Kenya.",
      price: 29999,
      stock: 200,
      brand: "Infinix",
      images: JSON.stringify(["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.78\" AMOLED 120Hz", processor: "MediaTek Helio G99 Ultimate", ram: "8GB", storage: "256GB", battery: "5000mAh 100W" }),
      colors: JSON.stringify(["Titan Gold", "Racing Black", "Starshine Silver"]),
      categoryId: getCategoryId("smartphones"),
    },

    // ─── TECNO ─────────────────────────────────────────────────────────────────
    {
      name: "Tecno Phantom V Fold 5G",
      slug: "tecno-phantom-v-fold-5g",
      description: "Africa's most affordable foldable phone. 7.85-inch inner display, Dimensity 9000, and a quad-camera system. Experience foldable innovation without the flagship price.",
      price: 109999,
      salePrice: 99999,
      stock: 20,
      brand: "Tecno",
      isHot: true,
      badge: "Foldable",
      images: JSON.stringify(["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "7.85\" LTPO AMOLED Foldable + 6.42\" Cover", processor: "MediaTek Dimensity 9000", ram: "12GB", storage: "256GB", camera: "50MP + 50MP + 13MP + 10MP" }),
      colors: JSON.stringify(["Iconic Black", "Pearly White"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Tecno Spark 20 Pro",
      slug: "tecno-spark-20-pro",
      description: "Entry-level powerhouse with a 6.78-inch 120Hz display, 108MP main camera, and 5000mAh battery. The best starter smartphone for Kenyans.",
      price: 19999,
      stock: 300,
      brand: "Tecno",
      images: JSON.stringify(["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.78\" IPS LCD 120Hz", processor: "MediaTek Helio G85", ram: "8GB", storage: "128GB", camera: "108MP + 2MP + AI", battery: "5000mAh" }),
      colors: JSON.stringify(["Magic Skin", "Midnight Shadow", "Misty Green"]),
      categoryId: getCategoryId("smartphones"),
    },

    // ─── LENOVO ────────────────────────────────────────────────────────────────
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 12",
      slug: "lenovo-thinkpad-x1-carbon-gen-12",
      description: "The gold standard in business laptops. Under 1.12kg, Intel Core Ultra 7, and military-grade durability. Used by professionals across the globe.",
      price: 229999,
      stock: 15,
      brand: "Lenovo",
      badge: "Business",
      images: JSON.stringify(["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "14\" 2.8K OLED 120Hz", processor: "Intel Core Ultra 7 165U", ram: "32GB LPDDR5", storage: "1TB SSD", weight: "1.12kg", mil_spec: "MIL-STD-810H" }),
      colors: JSON.stringify(["Deep Black"]),
      categoryId: getCategoryId("laptops"),
    },
    {
      name: "Lenovo IdeaPad Gaming 3",
      slug: "lenovo-ideapad-gaming-3",
      description: "Entry-level gaming laptop with Ryzen 5 7535HS, RTX 4050, and 144Hz display. Built for gamers who want performance at an accessible price.",
      price: 95999,
      salePrice: 88999,
      stock: 45,
      brand: "Lenovo",
      badge: "Gaming",
      images: JSON.stringify(["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "15.6\" FHD IPS 144Hz", processor: "AMD Ryzen 5 7535HS", ram: "16GB DDR5", storage: "512GB NVMe", gpu: "RTX 4050 6GB" }),
      colors: JSON.stringify(["Onyx Grey"]),
      categoryId: getCategoryId("laptops"),
    },

    // ─── ACCESSORIES & PERIPHERALS ─────────────────────────────────────────────
    {
      name: "Anker 737 Power Bank 24000mAh",
      slug: "anker-737-power-bank-24000mah",
      description: "Industry-leading 140W bidirectional charging. Charge a MacBook from 0-50% in 36 minutes. The only power bank you'll ever need for travel.",
      price: 18999,
      salePrice: 16499,
      stock: 75,
      brand: "Anker",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ capacity: "24000mAh", maxOutput: "140W", ports: "2x USB-C + 1x USB-A", inputOutput: "Bidirectional 140W", display: "Smart LED display" }),
      colors: JSON.stringify(["Black"]),
      categoryId: getCategoryId("accessories"),
    },
    {
      name: "Logitech MX Master 3S",
      slug: "logitech-mx-master-3s",
      description: "The world's most advanced mouse. 8K DPI MagSpeed scroll wheel, ultra-precise tracking on any surface, and ergonomic perfection for all-day work.",
      price: 14999,
      stock: 80,
      brand: "Logitech",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ dpi: "200-8000 DPI", battery: "70 days", connection: "Bolt USB receiver / Bluetooth", scroll: "MagSpeed Electromagnetic", buttons: 7 }),
      colors: JSON.stringify(["Graphite", "Pale Gray"]),
      categoryId: getCategoryId("accessories"),
    },
    {
      name: "Samsung 1TB T7 Shield Portable SSD",
      slug: "samsung-1tb-t7-shield-ssd",
      description: "IP65 dust/water resistance, shock-resistant frame, 1050MB/s read speed. The toughest portable SSD for Kenyan adventures and travel.",
      price: 16999,
      salePrice: 14499,
      stock: 90,
      brand: "Samsung",
      images: JSON.stringify(["https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ capacity: "1TB", readSpeed: "1050MB/s", writeSpeed: "1000MB/s", interface: "USB 3.2 Gen 2 (USB-C)", protection: "IP65" }),
      colors: JSON.stringify(["Beige", "Blue", "Black"]),
      categoryId: getCategoryId("storage"),
    },
    {
      name: "TP-Link Archer AXE75 Wi-Fi 6E Router",
      slug: "tp-link-archer-axe75-wifi6e",
      description: "Tri-band Wi-Fi 6E router with 6GHz band support. Covers up to 230 sqm with 4804+1201+574 Mbps combined speed. Future-proof your Kenyan home network.",
      price: 22999,
      stock: 35,
      brand: "TP-Link",
      images: JSON.stringify(["https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ bands: "Tri-band (2.4+5+6GHz)", speed: "6575 Mbps combined", coverage: "230 sqm", ports: "4x Gigabit LAN + 1x WAN + 1x USB 3.0" }),
      colors: JSON.stringify(["Black"]),
      categoryId: getCategoryId("networking"),
    },
    {
      name: "Samsung 55\" 4K QLED Smart TV",
      slug: "samsung-55-4k-qled-smart-tv",
      description: "QLED Quantum Dot technology, Tizen OS with Netflix/YouTube built-in, and Object Tracking Sound. Transform your living room into a cinema.",
      price: 89999,
      salePrice: 79999,
      stock: 20,
      brand: "Samsung",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ size: "55\"", resolution: "4K UHD 3840x2160", displayTech: "QLED Quantum Dot", hdr: "HDR10+", os: "Tizen Smart TV", hdmi: "4x HDMI 2.1" }),
      colors: JSON.stringify(["Black"]),
      categoryId: getCategoryId("tvs-displays"),
    },
    {
      name: "Google Pixel 8 Pro",
      slug: "google-pixel-8-pro",
      description: "Google's smartest phone. Tensor G3 chip with Magic Eraser, Best Take, and 7 years of OS updates. The AI-powered smartphone that thinks for you.",
      price: 134999,
      stock: 40,
      brand: "Google",
      badge: "AI Phone",
      images: JSON.stringify(["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "6.7\" LTPO OLED 1-120Hz", processor: "Google Tensor G3", ram: "12GB", storage: "128GB", camera: "50MP + 48MP + 48MP", battery: "5050mAh" }),
      colors: JSON.stringify(["Obsidian", "Porcelain", "Bay"]),
      categoryId: getCategoryId("smartphones"),
    },
    {
      name: "Nintendo Switch OLED",
      slug: "nintendo-switch-oled",
      description: "Enhanced OLED screen, wide adjustable stand, and 64GB internal storage. Play your favourite Nintendo titles at home or on the go across Kenya.",
      price: 54999,
      stock: 42,
      brand: "Nintendo",
      images: JSON.stringify(["https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ display: "7\" OLED 720p", storage: "64GB", battery: "4.5-9hr", modes: "TV, Tabletop, Handheld" }),
      colors: JSON.stringify(["White", "Neon Blue/Red"]),
      categoryId: getCategoryId("gaming"),
    },
    {
      name: "DJI Mini 4 Pro Drone",
      slug: "dji-mini-4-pro-drone",
      description: "Under 249g, no registration required. 4K/60fps video, omnidirectional obstacle sensing, and 34-minute flight time. The perfect drone for Kenyan content creators.",
      price: 119999,
      stock: 15,
      brand: "DJI",
      badge: "No License",
      isHot: true,
      images: JSON.stringify(["https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop"]),
      specs: JSON.stringify({ weight: "249g", video: "4K 60fps HDR", range: "20km", flightTime: "34 min", obstacle: "Omnidirectional sensing" }),
      colors: JSON.stringify(["Gray"]),
      categoryId: getCategoryId("cameras"),
    },
  ];

  let createdCount = 0;
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    createdCount++;
  }

  const products = await prisma.product.findMany();
  console.log(`✅ Created ${createdCount} products`);

  // ─── USERS ───────────────────────────────────────────────────────────────────
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
  console.log(`✅ Created ${users.length} users`);

  // ─── ADDRESSES ───────────────────────────────────────────────────────────────
  const addressesData = [
    {
      userId: users[1].id,
      label: "Home",
      line1: "123 Kimathi Street",
      city: "Nairobi",
      state: "Nairobi County",
      postal: "00100",
      country: "Kenya",
      phone: "+254712345678",
    },
    {
      userId: users[2].id,
      label: "Home",
      line1: "456 Digo Road",
      city: "Mombasa",
      state: "Mombasa County",
      postal: "80100",
      country: "Kenya",
      phone: "+254723456789",
    },
  ];

  for (const address of addressesData) {
    await prisma.address.create({ data: address });
  }

  // ─── ORDERS ──────────────────────────────────────────────────────────────────
  const ordersData = [
    {
      userId: users[1].id,
      status: "DELIVERED",
      total: 219999,
      subtotal: 219999,
      paymentStatus: "PAID",
      paymentMethod: "MPESA",
      createdAt: new Date("2026-01-15"),
    },
    {
      userId: users[2].id,
      status: "PROCESSING",
      total: 134999,
      subtotal: 134999,
      paymentStatus: "PAID",
      paymentMethod: "PAYPAL",
      createdAt: new Date("2026-03-20"),
    },
    {
      userId: users[3].id,
      status: "SHIPPED",
      total: 44999,
      subtotal: 44999,
      paymentStatus: "PAID",
      paymentMethod: "MPESA",
      createdAt: new Date("2026-04-10"),
    },
  ];

  for (const order of ordersData) {
    await prisma.order.create({
      data: {
        user: { connect: { id: order.userId } },
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
      },
    });
  }

  const orders = await prisma.order.findMany();

  // ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
  const orderItemsData = [
    { orderId: orders[0].id, productId: products[5].id,  quantity: 1, unitPrice: 219999 }, // iPhone 15 Pro Max
    { orderId: orders[1].id, productId: products[6].id,  quantity: 1, unitPrice: 134999 }, // iPhone 15
    { orderId: orders[2].id, productId: products[11].id, quantity: 1, unitPrice: 44999 },  // Sony WH-1000XM5
  ];

  for (const item of orderItemsData) {
    await prisma.orderItem.create({ data: item });
  }

  // ─── REVIEWS ─────────────────────────────────────────────────────────────────
  const reviewsData = [
    { userId: users[1].id, productId: products[0].id,  rating: 5, title: "Best phone in Kenya!", comment: "Samsung Galaxy S24 Ultra is an absolute beast. Camera is incredible, S Pen is smooth. Worth every shilling!" },
    { userId: users[2].id, productId: products[5].id,  rating: 5, title: "iPhone at its finest", comment: "The titanium design is premium. Camera zoom is amazing, great for content creation." },
    { userId: users[3].id, productId: products[11].id, rating: 5, title: "ANC is unreal", comment: "Sony WH-1000XM5 silences everything — matatu noise, office noise. Worth it!" },
    { userId: users[4].id, productId: products[7].id,  rating: 5, title: "MacBook Air M3 - Incredible", comment: "18 hour battery life is no joke. Silent, fast, and beautiful display. Best laptop purchase!" },
    { userId: users[1].id, productId: products[15].id, rating: 4, title: "JBL Charge 5 - Great sound", comment: "Waterproof, loud, and the power bank feature saved my phone twice on safari. Highly recommend!" },
    { userId: users[2].id, productId: products[20].id, rating: 5, title: "Infinix Zero 40 - Amazing value", comment: "5G, 144Hz AMOLED, 90W charging for under 40k? Infinix has outdone themselves." },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({ data: review });
  }

  console.log(`✅ Created ${reviewsData.length} reviews`);

  // ─── BLOG POSTS ──────────────────────────────────────────────────────────────
  const blogPostsData = [
    {
      title: "Top 10 Smartphones to Buy in Kenya (2026)",
      slug: "top-10-smartphones-kenya-2026",
      content: "With so many options flooding the Kenyan market, choosing the right smartphone can be overwhelming. Here's our expert guide to the best phones available right now...\n\n**1. Samsung Galaxy S24 Ultra** - The absolute best Android phone money can buy in Kenya. With a 200MP camera, S Pen, and Snapdragon 8 Gen 3, it's in a class of its own.\n\n**2. Apple iPhone 15 Pro Max** - For iOS loyalists, the titanium iPhone 15 Pro Max offers the best camera system and A17 Pro performance.\n\n**3. Xiaomi 14 Ultra** - Leica-engineered cameras at a relatively competitive price point.\n\n**4. Google Pixel 8 Pro** - The best AI photography experience with guaranteed 7 years of updates.\n\n**5. Infinix Zero 40 5G** - The best budget 5G phone for Kenyans who want flagship features without flagship prices.",
      excerpt: "Our comprehensive guide to the best smartphones available in Kenya right now — from flagship beasts to budget champions.",
      authorId: users[0].id,
      published: true,
      publishedAt: new Date("2026-01-01"),
    },
    {
      title: "M-Pesa vs PayPal: Which is Better for Online Shopping in Kenya?",
      slug: "mpesa-vs-paypal-online-shopping-kenya",
      content: "Kenya is uniquely positioned in the fintech world. While most countries rely on credit cards, Kenyans have embraced M-Pesa with unparalleled enthusiasm. But with more international platforms entering the market, PayPal is becoming increasingly relevant.\n\n**M-Pesa Advantages:**\n- Works for all Kenyans with a phone\n- Instant STK Push - no card details needed\n- Widely trusted and familiar\n- Lower transaction fees for local payments\n\n**PayPal Advantages:**\n- Accepted globally\n- Strong buyer protection\n- Great for international purchases\n- Easy to use for diaspora sending money\n\nAt Safaritech, we support both — and M-Pesa payments are settled instantly!",
      excerpt: "An in-depth comparison of M-Pesa and PayPal for online shopping in Kenya — and why Safaritech supports both.",
      authorId: users[0].id,
      published: true,
      publishedAt: new Date("2026-02-15"),
    },
    {
      title: "Best Laptops for Kenyan Students and Professionals (2026)",
      slug: "best-laptops-kenya-students-professionals-2026",
      content: "Whether you're a university student in Nairobi or a professional working remotely from Mombasa, finding the right laptop matters. Here's our curated guide...\n\n**For Students:**\n- Dell Inspiron 15 3000 (KSh 62,999) — Reliable, affordable, great SSD storage\n- Lenovo IdeaPad Gaming 3 (KSh 88,999) — Gaming + studying in one machine\n\n**For Professionals:**\n- Apple MacBook Air M3 (KSh 179,999) — Best all-around laptop for Mac users\n- HP EliteBook 840 G11 (KSh 159,999) — Enterprise security for serious work\n- Lenovo ThinkPad X1 Carbon (KSh 229,999) — Business class durability\n\n**For Creatives:**\n- Apple MacBook Pro 14\" M3 Pro (KSh 289,999) — Video editing powerhouse",
      excerpt: "Find the perfect laptop for your needs — whether you're a student, professional, or creative in Kenya.",
      authorId: users[0].id,
      published: true,
      publishedAt: new Date("2026-03-01"),
    },
  ];

  for (const post of blogPostsData) {
    await prisma.blogPost.create({ data: post });
  }

  console.log(`✅ Created ${blogPostsData.length} blog posts`);

  // ─── COUPONS ─────────────────────────────────────────────────────────────────
  const couponsData = [
    {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 10000,
      maxDiscount: 15000,
      usageLimit: 500,
      expiresAt: new Date("2026-12-31"),
    },
    {
      code: "SAVE5000",
      description: "KSh 5,000 off orders over KSh 50,000",
      discountType: "FIXED",
      discountValue: 5000,
      minOrderValue: 50000,
      usageLimit: 200,
      expiresAt: new Date("2026-12-31"),
    },
    {
      code: "SAFARI15",
      description: "15% off for loyal customers",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minOrderValue: 20000,
      maxDiscount: 20000,
      usageLimit: 100,
      expiresAt: new Date("2026-09-30"),
    },
    {
      code: "IPHONE20K",
      description: "KSh 20,000 off any iPhone",
      discountType: "FIXED",
      discountValue: 20000,
      minOrderValue: 100000,
      usageLimit: 50,
      expiresAt: new Date("2026-06-30"),
    },
    {
      code: "BACK2SCHOOL",
      description: "Back to school 12% discount",
      discountType: "PERCENTAGE",
      discountValue: 12,
      minOrderValue: 30000,
      maxDiscount: 10000,
      usageLimit: 300,
      expiresAt: new Date("2026-08-31"),
    },
  ];

  for (const coupon of couponsData) {
    await prisma.coupon.create({ data: coupon });
  }

  console.log(`✅ Created ${couponsData.length} coupons`);

  console.log("\n🚀 ═══════════════════════════════════════════════");
  console.log("   SAFARITECH SEED COMPLETE!");
  console.log("═══════════════════════════════════════════════");
  console.log(`📱 ${products.length} products across ${categories.length} categories`);
  console.log("🏷️  Brands: Samsung, Apple, HP, Dell, Sony, JBL, Xiaomi, Infinix, Tecno, Lenovo, Google, Nintendo, DJI, Anker, Logitech, TP-Link");
  console.log(`👤 ${users.length} users seeded`);
  console.log(`🎟️  ${couponsData.length} active coupons`);
  console.log("\n🔑 Admin Login:");
  console.log("   Email: admin@safaritech.co.ke");
  console.log("   Password: admin123");
  console.log("\n🛍️  Test Customer:");
  console.log("   Email: customer@safaritech.co.ke");
  console.log("   Password: customer123");
  console.log("\n🎁 Coupon Codes: WELCOME10, SAVE5000, SAFARI15, IPHONE20K, BACK2SCHOOL");
  console.log("═══════════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
