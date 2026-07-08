/**
 * Safaritech seed — premium electronics catalog
 * Run with: bun run db:push && bun run scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", tagline: "Flagship & mid-tier, curated for Kenya.", count: "320+ devices", accent: "oklch(0.40 0.08 165)", shape: "phone" },
  { name: "Laptops", slug: "laptops", tagline: "Work, create, and play — Mac to Windows.", count: "180+ models", accent: "oklch(0.55 0.10 75)", shape: "laptop" },
  { name: "Audio", slug: "audio", tagline: "Studio-grade headphones, earbuds & speakers.", count: "240+ items", accent: "oklch(0.55 0.06 240)", shape: "audio" },
  { name: "Gaming", slug: "gaming", tagline: "Consoles, controllers, and the games that matter.", count: "90+ products", accent: "oklch(0.65 0.15 25)", shape: "gaming" },
  { name: "Wearables", slug: "wearables", tagline: "Smartwatches and fitness companions.", count: "60+ styles", accent: "oklch(0.50 0.10 200)", shape: "watch" },
  { name: "Accessories", slug: "accessories", tagline: "The essentials — cases, cables, chargers, more.", count: "500+ items", accent: "oklch(0.45 0.08 145)", shape: "accessory" },
];

const BRANDS = [
  { name: "Apple", slug: "apple", popular: true, category: "Smartphones · Laptops · Audio", accent: "oklch(0.40 0.08 165)", description: "Designed in Cupertino. The full Apple ecosystem — iPhone, Mac, Watch, AirPods — with full warranty and serial verification." },
  { name: "Samsung", slug: "samsung", popular: true, category: "Smartphones · TVs · Audio", accent: "oklch(0.55 0.06 240)", description: "Galaxy to QLED. Authorised Samsung partner for smartphones, tablets, wearables and home audio." },
  { name: "Sony", slug: "sony", popular: true, category: "Audio · Gaming · Cameras", accent: "oklch(0.65 0.15 25)", description: "WH-series headphones, PlayStation 5, Alpha cameras. Sony's premium entertainment lineup, all authentic." },
  { name: "JBL", slug: "jbl", popular: true, category: "Speakers · Headphones", accent: "oklch(0.45 0.10 145)", description: "Portable sound that travels. Charge, Flip, and Tune series — built for the Kenyan road trip." },
  { name: "HP", slug: "hp", popular: false, category: "Laptops · Printers", accent: "oklch(0.50 0.06 240)", description: "Spectre, Envy, and Pavilion. HP's full laptop range plus DeskJet and LaserJet for the home office." },
  { name: "Dell", slug: "dell", popular: false, category: "Laptops · Monitors", accent: "oklch(0.55 0.10 75)", description: "XPS, Inspiron, and Alienware. Productivity, creativity, and gaming — all covered." },
  { name: "Lenovo", slug: "lenovo", popular: false, category: "Laptops · Tablets", accent: "oklch(0.50 0.05 240)", description: "ThinkPad for the road warrior, Yoga for the creator, Legion for the gamer." },
  { name: "Xiaomi", slug: "xiaomi", popular: true, category: "Phones · Smart home", accent: "oklch(0.55 0.12 25)", description: "Redmi and Xiaomi phones, smart home, and lifestyle products at honest prices." },
  { name: "Infinix", slug: "infinix", popular: true, category: "Smartphones", accent: "oklch(0.55 0.10 200)", description: "Built for Africa. Big batteries, big screens, big value — Infinix's full Note and Zero lines." },
  { name: "Tecno", slug: "tecno", popular: false, category: "Smartphones", accent: "oklch(0.50 0.08 165)", description: "Camon and Phantom series. Camera-first smartphones designed for emerging markets." },
  { name: "Google", slug: "google", popular: false, category: "Pixel · Nest", accent: "oklch(0.55 0.10 75)", description: "Pixel phones, Nest smart home, and Chromecast. Google's hardware, pure Android." },
  { name: "Nintendo", slug: "nintendo", popular: false, category: "Switch · Games", accent: "oklch(0.55 0.10 25)", description: "Switch OLED and Lite, plus first-party titles. Family-friendly gaming, authentic cartridges." },
];

interface SeedProduct {
  name: string;
  slug: string;
  brandSlug: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  tag?: string;
  summary: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  shape: string;
  accent: string;
}

const PRODUCTS: SeedProduct[] = [
  {
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    brandSlug: "apple",
    categorySlug: "smartphones",
    price: 192000,
    originalPrice: 210000,
    rating: 4.9,
    reviews: 1240,
    tag: "Best seller",
    summary: "Titanium. A17 Pro. The iPhone reimagined for pros.",
    description:
      "The first iPhone forged from aerospace-grade titanium. The A17 Pro chip powers next-level gaming and pro workflows, while the 48MP main camera with quad-pixel sensor delivers photos with extraordinary detail. USB-C, Action button, and a ProMotion display that goes brighter than ever — built for the way Kenya works and plays.",
    features: [
      "Aerospace-grade titanium design — lightest Pro ever",
      "A17 Pro chip with 6-core GPU, hardware-ray-traced gaming",
      "48MP main camera with 2nd-gen sensor-shift OIS",
      "5x Telephoto (Pro Max) or 3x (Pro) optical zoom",
      "USB-C with USB 3 speeds up to 10Gb/s",
      "Up to 23 hours video playback",
    ],
    specs: {
      Display: "6.1-inch Super Retina XDR, ProMotion 120Hz",
      Chip: "A17 Pro, 6-core CPU, 6-core GPU",
      Camera: "48MP main + 12MP ultra-wide + 12MP telephoto",
      Battery: "Up to 23 hours video",
      Storage: "256GB / 512GB / 1TB",
      Weight: "187 g",
    },
    inStock: true,
    stockCount: 18,
    featured: true,
    shape: "phone",
    accent: "oklch(0.40 0.08 165)",
  },
  {
    name: "MacBook Air M3",
    slug: "macbook-air-m3",
    brandSlug: "apple",
    categorySlug: "laptops",
    price: 245000,
    rating: 4.9,
    reviews: 642,
    tag: "New arrival",
    summary: "M3. 13 inches. Whisper-quiet, all-day battery.",
    description:
      "The M3 MacBook Air is the everyday laptop, perfected. Up to 18 hours of battery, a Liquid Retina display that renders colour true-to-life, and a fanless design that stays silent even under load. Two external displays when closed, MagSafe charging, and macOS Sequoia — built for designers, founders, and students across Kenya.",
    features: [
      "M3 chip with 8-core CPU and up to 10-core GPU",
      "13.6-inch Liquid Retina display, 500 nits",
      "Up to 18 hours battery — full workday, no charger",
      "8GB or 16GB unified memory",
      "Two Thunderbolt / USB 4 ports + MagSafe 3",
      "1080p FaceTime HD camera",
    ],
    specs: {
      Display: "13.6-inch Liquid Retina, 2560x1664",
      Chip: "Apple M3, 8-core CPU",
      Memory: "8GB / 16GB / 24GB unified",
      Storage: "256GB / 512GB / 1TB SSD",
      Battery: "Up to 18 hours",
      Weight: "1.24 kg",
    },
    inStock: true,
    stockCount: 9,
    featured: true,
    shape: "laptop",
    accent: "oklch(0.55 0.10 75)",
  },
  {
    name: "Galaxy S24 Ultra",
    slug: "galaxy-s24-ultra",
    brandSlug: "samsung",
    categorySlug: "smartphones",
    price: 165000,
    originalPrice: 178000,
    rating: 4.8,
    reviews: 980,
    tag: "Deal",
    summary: "Galaxy AI. 200MP. The Android flagship.",
    description:
      "The Galaxy S24 Ultra pairs a 6.8-inch QHD+ display with the snapdragon 8 Gen 3 for Galaxy and a 200MP main camera. Galaxy AI brings live translation, note summarisation, and circle-to-search. Built-in S Pen, titanium frame, and seven years of OS updates — the longest support promise on Android.",
    features: [
      "6.8-inch QHD+ AMOLED, 1-120Hz adaptive, 2600 nits peak",
      "Snapdragon 8 Gen 3 for Galaxy",
      "200MP main + 50MP 5x telephoto + 10MP 3x tele + 12MP UW",
      "Galaxy AI: Live Translate, Note Assist, Circle to Search",
      "Built-in S Pen",
      "Seven years of OS and security updates",
    ],
    specs: {
      Display: "6.8-inch QHD+ AMOLED, 120Hz",
      Chip: "Snapdragon 8 Gen 3 for Galaxy",
      Camera: "200MP main + 50MP 5x + 10MP 3x + 12MP UW",
      Battery: "5000 mAh",
      Storage: "256GB / 512GB / 1TB",
      Weight: "232 g",
    },
    inStock: true,
    stockCount: 14,
    featured: true,
    shape: "phone",
    accent: "oklch(0.55 0.06 240)",
  },
  {
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    brandSlug: "sony",
    categorySlug: "audio",
    price: 52000,
    rating: 4.9,
    reviews: 2150,
    tag: "Editor's pick",
    summary: "The noise-cancelling benchmark, refined.",
    description:
      "Sony's fifth-generation flagship headphones reset the standard for noise cancellation. Eight microphones, two processors, and a new Auto NC Optimizer adapt to your environment in real time. Crystal-clear hands-free calls, 30-hour battery, and a feather-light design — the daily companion for Nairobi traffic and the long-haul to London.",
    features: [
      "Industry-leading noise cancellation with two processors and eight mics",
      "30-hour battery with quick charge (3 min = 3 hours)",
      "Crystal-clear hands-free calling with beamforming",
      "Multi-point Bluetooth — pair two devices at once",
      "LDAC support for Hi-Res Audio Wireless",
      "Speak-to-Chat automatically pauses when you talk",
    ],
    specs: {
      Driver: "30 mm carbon fibre composite",
      Battery: "30 hours (NC on)",
      Connectivity: "Bluetooth 5.2, LDAC, AAC, SBC",
      Weight: "250 g",
      Charging: "USB-C",
      Colors: "Black, Silver, Midnight Blue",
    },
    inStock: true,
    stockCount: 22,
    featured: true,
    shape: "audio",
    accent: "oklch(0.65 0.15 25)",
  },
  {
    name: "Apple Watch Series 10",
    slug: "apple-watch-series-10",
    brandSlug: "apple",
    categorySlug: "wearables",
    price: 68000,
    rating: 4.8,
    reviews: 430,
    summary: "Thinner. Brighter. The Watch, refined.",
    description:
      "The Apple Watch Series 10 is the thinnest Apple Watch yet, with a wide-angle OLED display that's easier to read at a glance. The new depth gauge and water temperature sensor make it a true dive computer. Sleep apnea notifications, ECG, and blood oxygen — health insights that matter, on your wrist all day.",
    features: [
      "Thinnest Apple Watch design at 9.7mm",
      "Wide-angle OLED display, 40% brighter when on wrist",
      "Depth gauge and water temperature sensor — dive computer rated",
      "Sleep apnea notifications",
      "ECG, blood oxygen, heart rate, temperature sensing",
      "Up to 18 hours battery (36 in Low Power)",
    ],
    specs: {
      Display: "Wide-angle OLED, always-on",
      Case: "Aluminium or Titanium, 42mm / 46mm",
      Battery: "Up to 18 hours",
      Sensors: "ECG, SpO2, depth, temperature, heart rate",
      Water: "50m water resistance + dive computer",
      Chip: "S10 SiP",
    },
    inStock: true,
    stockCount: 16,
    featured: true,
    shape: "watch",
    accent: "oklch(0.50 0.10 200)",
  },
  {
    name: "PlayStation 5 Slim",
    slug: "playstation-5-slim",
    brandSlug: "sony",
    categorySlug: "gaming",
    price: 89000,
    rating: 4.9,
    reviews: 1820,
    tag: "Restocked",
    summary: "Same PS5 power, 30% smaller footprint.",
    description:
      "The PS5 Slim packs the full PlayStation 5 experience into a chassis 30% smaller than the original. 4K gaming at 120Hz, ray tracing, and the DualSense controller's haptic feedback deliver immersive worlds. Backwards-compatible with PS4 titles and shipping with a 1TB SSD — the next-gen console, finally in stock.",
    features: [
      "30% smaller than original PS5",
      "4K gaming at up to 120Hz, 8K-ready",
      "Ray tracing hardware acceleration",
      "1TB ultra-high-speed SSD",
      "DualSense haptic feedback + adaptive triggers",
      "Backwards compatible with PS4 games",
    ],
    specs: {
      CPU: "AMD Zen 2, 8 cores @ 3.5GHz",
      GPU: "AMD RDNA 2, 10.28 TFLOPs",
      Storage: "1TB NVMe SSD",
      Output: "4K @ 120Hz, 8K",
      Memory: "16GB GDDR6",
      Weight: "3.2 kg",
    },
    inStock: true,
    stockCount: 7,
    featured: true,
    shape: "gaming",
    accent: "oklch(0.45 0.08 145)",
  },
  {
    name: "JBL Charge 5",
    slug: "jbl-charge-5",
    brandSlug: "jbl",
    categorySlug: "audio",
    price: 28000,
    originalPrice: 32000,
    rating: 4.7,
    reviews: 1560,
    summary: "20-hour battery. IP67. Charges your phone.",
    description:
      "The JBL Charge 5 is the road-trip speaker. Bold JBL Pro Sound, a 20-hour battery, and IP67 waterproof and dustproof rating mean it survives the beach, the campsite, and the pool party. Plus a built-in powerbank — it charges your phone while it plays. PartyBoost lets you chain multiple JBL speakers for bigger sound.",
    features: [
      "JBL Pro Sound with racetrack-shaped driver",
      "20 hours of playtime",
      "IP67 waterproof and dustproof",
      "Built-in powerbank charges your devices",
      "PartyBoost — pair multiple JBL speakers",
      "Independent tweeter and dual passive radiators",
    ],
    specs: {
      Output: "30W RMS",
      Battery: "20 hours, 7500 mAh powerbank",
      Waterproof: "IP67",
      Connectivity: "Bluetooth 5.1",
      Weight: "960 g",
      Colors: "Black, Blue, Red, Teal, Camo",
    },
    inStock: true,
    stockCount: 35,
    featured: true,
    shape: "audio",
    accent: "oklch(0.40 0.08 165)",
  },
  {
    name: "Dell XPS 13 Plus",
    slug: "dell-xps-13-plus",
    brandSlug: "dell",
    categorySlug: "laptops",
    price: 195000,
    rating: 4.7,
    reviews: 312,
    summary: "Edge-to-edge display. Futuristic design.",
    description:
      "The Dell XPS 13 Plus reimagines the laptop. A 13.4-inch OLED display stretches edge-to-edge under a seamless glass palmrest. Capacitive touch function row, an invisible haptic touchpad, and Intel Core Ultra processors with built-in AI. A statement piece for designers and engineers who refuse to compromise.",
    features: [
      "13.4-inch 3.5K OLED InfinityEdge display",
      "Intel Core Ultra 7 with built-in NPU",
      "Seamless glass palmrest with capacitive touch bar",
      "Invisible haptic forcepad",
      "Backlit keyboard with zero-lattice keycaps",
      "Machined aluminium + Gorilla Glass Victus",
    ],
    specs: {
      Display: "13.4-inch 3.5K OLED, 60Hz",
      Chip: "Intel Core Ultra 7 155H",
      Memory: "16GB / 32GB LPDDR5x",
      Storage: "512GB / 1TB SSD",
      Battery: "Up to 13 hours",
      Weight: "1.24 kg",
    },
    inStock: true,
    stockCount: 5,
    featured: true,
    shape: "laptop",
    accent: "oklch(0.55 0.10 75)",
  },
  {
    name: "iPad Pro M4 11-inch",
    slug: "ipad-pro-m4-11",
    brandSlug: "apple",
    categorySlug: "smartphones",
    price: 145000,
    rating: 4.9,
    reviews: 287,
    tag: "New arrival",
    summary: "Tandem OLED. M4. The thinnest Apple product ever.",
    description:
      "The iPad Pro M4 debuts the Ultra Retina XDR display — two OLED panels stacked for jaw-dropping brightness and contrast. The M4 chip powers AI features and pro creative workflows. At just 5.1mm thin, it's the thinnest Apple product ever made. Apple Pencil Pro and Magic Keyboard transform it into a complete creative studio.",
    features: [
      "Ultra Retina XDR tandem OLED display",
      "M4 chip with new display engine",
      "5.1mm thin — thinnest Apple product ever",
      "Apple Pencil Pro with squeeze and barrel roll",
      "12MP wide camera with Center Stage",
      "Compatible with Magic Keyboard",
    ],
    specs: {
      Display: "11-inch Ultra Retina XDR tandem OLED",
      Chip: "Apple M4",
      Storage: "256GB / 512GB / 1TB / 2TB",
      Camera: "12MP wide + LiDAR",
      Battery: "Up to 10 hours",
      Weight: "444 g",
    },
    inStock: true,
    stockCount: 11,
    featured: false,
    shape: "phone",
    accent: "oklch(0.40 0.08 165)",
  },
  {
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    brandSlug: "apple",
    categorySlug: "audio",
    price: 38000,
    originalPrice: 42000,
    rating: 4.8,
    reviews: 3420,
    tag: "Deal",
    summary: "Adaptive Audio. USB-C. H2 chip magic.",
    description:
      "AirPods Pro 2 with the H2 chip deliver 2x Active Noise Cancellation and a new Adaptive Audio mode that blends transparency and noise cancellation as you move through your day. Conversation Awareness lowers your media when you speak. USB-C charging, up to 6 hours of listening, and a redesigned case with Precision Finding.",
    features: [
      "H2 chip with 2x Active Noise Cancellation",
      "Adaptive Audio dynamically blends modes",
      "Conversation Awareness lowers media when you speak",
      "Up to 6 hours listening, 30 with case",
      "USB-C charging case with Precision Finding",
      "Customisable fit with four silicone tip sizes",
    ],
    specs: {
      Chip: "Apple H2",
      Battery: "6h listening, 30h with case",
      Charging: "USB-C, MagSafe, Qi",
      Water: "IP54 sweat and dust resistant",
      Sensors: "Skin-detect, dual beamforming mics",
    },
    inStock: true,
    stockCount: 40,
    featured: false,
    shape: "audio",
    accent: "oklch(0.40 0.08 165)",
  },
  {
    name: "Samsung Galaxy Z Fold 6",
    slug: "galaxy-z-fold-6",
    brandSlug: "samsung",
    categorySlug: "smartphones",
    price: 245000,
    rating: 4.7,
    reviews: 198,
    tag: "New arrival",
    summary: "Fold open. Galaxy AI on a 7.6-inch canvas.",
    description:
      "The Galaxy Z Fold 6 is Samsung's most refined foldable yet. A slimmer, lighter hinge. A 7.6-inch main display that's brighter and more durable. Galaxy AI takes notes, translates conversations live, and edits photos with a tap. Snapdragon 8 Gen 3 for Galaxy delivers desktop-class multitasking — phone in your pocket, tablet when you need it.",
    features: [
      "7.6-inch main display, 6.3-inch cover — both 120Hz",
      "Snapdragon 8 Gen 3 for Galaxy",
      "Galaxy AI: Note Assist, Live Translate, Photo Assist",
      "Dual SIM + eSIM support",
      "Gorilla Glass Victus 2 + Armour Aluminium",
      "IP48 water resistance",
    ],
    specs: {
      Display: "7.6-inch inner / 6.3-inch outer, 120Hz",
      Chip: "Snapdragon 8 Gen 3 for Galaxy",
      Camera: "50MP main + 12MP UW + 10MP tele",
      Battery: "4400 mAh",
      Storage: "256GB / 512GB / 1TB",
      Weight: "239 g",
    },
    inStock: true,
    stockCount: 6,
    featured: false,
    shape: "phone",
    accent: "oklch(0.55 0.06 240)",
  },
  {
    name: "Sony Bravia X90L 65-inch",
    slug: "sony-bravia-x90l-65",
    brandSlug: "sony",
    categorySlug: "audio",
    price: 215000,
    originalPrice: 240000,
    rating: 4.8,
    reviews: 142,
    tag: "Deal",
    summary: "4K HDR. Cognitive Processor XR. PS5 perfect.",
    description:
      "The Sony Bravia X90L is the perfect living-room TV for the PS5 owner. Cognitive Processor XR delivers true-to-life contrast and colour. XR Triluminos Pro reproduces over a billion colours. 120Hz 4K with VRR and Auto HDR Tone Mapping optimises your PS5 in one tap. Acoustic Multi-Audio turns the screen into the speaker.",
    features: [
      "65-inch 4K HDR Full Array LED",
      "Cognitive Processor XR",
      "120Hz 4K with VRR for PS5 and Xbox",
      "Auto HDR Tone Mapping for PS5",
      "Acoustic Multi-Audio",
      "Google TV with hands-free Voice Search",
    ],
    specs: {
      Display: "65-inch 4K HDR, 120Hz",
      Processor: "Cognitive Processor XR",
      HDR: "HDR10, Dolby Vision, HLG",
      HDMI: "4x HDMI 2.1 (4K 120Hz, VRR, ALLM)",
      Audio: "Acoustic Multi-Audio, 30W",
      Weight: "22.4 kg with stand",
    },
    inStock: true,
    stockCount: 4,
    featured: false,
    shape: "audio",
    accent: "oklch(0.65 0.15 25)",
  },
  {
    name: "Nintendo Switch OLED",
    slug: "nintendo-switch-oled",
    brandSlug: "nintendo",
    categorySlug: "gaming",
    price: 52000,
    rating: 4.9,
    reviews: 890,
    summary: "7-inch OLED. Play anywhere, any way.",
    description:
      "The Nintendo Switch OLED model features a vibrant 7-inch OLED screen for vivid colours and crisp contrast in handheld mode. Dock it for 1080p on the big screen. Joy-Con controllers snap on for tabletop multiplayer anywhere. With a vast library of first-party titles and indie gems, the Switch is the family console that goes everywhere.",
    features: [
      "7-inch OLED multi-touch display",
      "64GB internal storage",
      "Enhanced audio for handheld and tabletop play",
      "Wide adjustable stand",
      "Dock for 1080p TV output",
      "Joy-Con controllers included",
    ],
    specs: {
      Display: "7-inch OLED, 1280x720",
      Storage: "64GB (expandable via microSD)",
      Battery: "4.5 to 9 hours depending on game",
      Output: "1080p via dock, 720p handheld",
      Weight: "420 g with Joy-Con",
      Colors: "White, Neon Red/Blue",
    },
    inStock: true,
    stockCount: 13,
    featured: false,
    shape: "gaming",
    accent: "oklch(0.55 0.10 25)",
  },
  {
    name: "Google Pixel 8 Pro",
    slug: "google-pixel-8-pro",
    brandSlug: "google",
    categorySlug: "smartphones",
    price: 132000,
    rating: 4.7,
    reviews: 410,
    summary: "Tensor G3. The AI phone, pure Android.",
    description:
      "The Pixel 8 Pro is Google's most AI-capable phone. Tensor G3 powers Magic Editor, Best Take, and Audio Magic Eraser. The 50MP main camera with Pro controls shoots like a DSLR. Seven years of OS and security updates. Pure Android with Gemini built in — the smartest Pixel yet.",
    features: [
      "Tensor G3 chip, purpose-built for AI",
      "50MP main + 48MP UW + 48MP 5x telephoto",
      "Magic Editor, Best Take, Audio Magic Eraser",
      "6.7-inch Super Actua display, 2-120Hz",
      "Seven years of OS updates",
      "Pure Android 14 with Gemini",
    ],
    specs: {
      Display: "6.7-inch LTPO OLED, 120Hz",
      Chip: "Google Tensor G3",
      Camera: "50MP main + 48MP UW + 48MP 5x tele",
      Battery: "5050 mAh",
      Storage: "128GB / 256GB / 512GB",
      Weight: "213 g",
    },
    inStock: true,
    stockCount: 8,
    featured: false,
    shape: "phone",
    accent: "oklch(0.55 0.10 75)",
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    slug: "xiaomi-redmi-note-13-pro",
    brandSlug: "xiaomi",
    categorySlug: "smartphones",
    price: 38000,
    originalPrice: 42000,
    rating: 4.6,
    reviews: 1820,
    tag: "Deal",
    summary: "200MP camera. Mid-tier price, flagship tricks.",
    description:
      "The Redmi Note 13 Pro packs a 200MP main camera into a phone that costs a third of the flagships. 6.67-inch AMOLED at 120Hz, 67W turbo charging that fills the battery in 44 minutes, and a sleek glass-and-aluminium body. The best value-for-money phone in Kenya, period.",
    features: [
      "200MP main camera with OIS",
      "6.67-inch AMOLED, 120Hz, 1800 nits",
      "67W turbo charging — 0 to 100% in 44 minutes",
      "Snapdragon 7s Gen 2",
      "5100 mAh battery",
      "IP54 splash resistance",
    ],
    specs: {
      Display: "6.67-inch AMOLED, 120Hz",
      Chip: "Snapdragon 7s Gen 2",
      Camera: "200MP main + 8MP UW + 2MP macro",
      Battery: "5100 mAh, 67W charging",
      Storage: "128GB / 256GB",
      Weight: "187 g",
    },
    inStock: true,
    stockCount: 50,
    featured: false,
    shape: "phone",
    accent: "oklch(0.55 0.12 25)",
  },
  {
    name: "Infinix Note 40 Pro",
    slug: "infinix-note-40-pro",
    brandSlug: "infinix",
    categorySlug: "smartphones",
    price: 32000,
    rating: 4.5,
    reviews: 670,
    summary: "Built for Africa. 70W charging, 108MP camera.",
    description:
      "The Infinix Note 40 Pro is engineered for the Kenyan user. 70W fast charging gets you to 50% in 20 minutes. A 108MP main camera captures the moments that matter. Premium vegan-leather back, dual stereo speakers tuned for African music, and a big 6.78-inch curved AMOLED. Value that punches above its weight.",
    features: [
      "70W Ultra Fast Charge — 50% in 20 minutes",
      "108MP main camera with OIS",
      "6.78-inch curved AMOLED, 120Hz",
      "Vegan leather back, premium feel",
      "Dual stereo speakers with Hi-Res certification",
      "5000 mAh battery",
    ],
    specs: {
      Display: "6.78-inch curved AMOLED, 120Hz",
      Chip: "Helio G99 Ultimate",
      Camera: "108MP main + 2MP + 2MP",
      Battery: "5000 mAh, 70W charging",
      Storage: "256GB",
      Weight: "195 g",
    },
    inStock: true,
    stockCount: 35,
    featured: false,
    shape: "phone",
    accent: "oklch(0.55 0.10 200)",
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    slug: "lenovo-thinkpad-x1-carbon-gen-12",
    brandSlug: "lenovo",
    categorySlug: "laptops",
    price: 235000,
    rating: 4.8,
    reviews: 156,
    summary: "The road warrior's choice. Carbon-light.",
    description:
      "The ThinkPad X1 Carbon Gen 12 is the business laptop, perfected. Forged from carbon fibre and magnesium alloy at just 1.09kg. Intel Core Ultra with vPro, MIL-STD-810H durability, and the legendary ThinkPad keyboard. Up to 17 hours of battery. The CEO's laptop — and the consultant's.",
    features: [
      "Carbon fibre + magnesium alloy, 1.09kg",
      "Intel Core Ultra 7 with vPro",
      "MIL-STD-810H military-spec durability",
      "Legendary ThinkPad keyboard",
      "Up to 17 hours battery",
      "Windows 11 Pro, Copilot key",
    ],
    specs: {
      Display: "14-inch 2.8K OLED, 120Hz",
      Chip: "Intel Core Ultra 7 165U vPro",
      Memory: "16GB / 32GB LPDDR5x",
      Storage: "512GB / 1TB SSD",
      Battery: "Up to 17 hours",
      Weight: "1.09 kg",
    },
    inStock: true,
    stockCount: 6,
    featured: false,
    shape: "laptop",
    accent: "oklch(0.50 0.05 240)",
  },
  {
    name: "Tecno Camon 30 Premier",
    slug: "tecno-camon-30-premier",
    brandSlug: "tecno",
    categorySlug: "smartphones",
    price: 42000,
    rating: 4.5,
    reviews: 312,
    summary: "Camera-first. Designed for emerging markets.",
    description:
      "The Tecno Camon 30 Premier pairs a 50MP Sony IMX sensor with a 50MP periscope telephoto — camera specs you'd expect at double the price. 6.77-inch LTPO AMOLED, 70W charging, and MediaTek Dimensity 8200 Ultimate. Tecno's most ambitious phone yet, built for the way Kenyans create.",
    features: [
      "50MP main + 50MP periscope 3x + 50MP UW",
      "6.77-inch LTPO AMOLED, 144Hz",
      "MediaTek Dimensity 8200 Ultimate",
      "70W Ultra Charge",
      "5000 mAh battery",
      "Premium glass-and-metal build",
    ],
    specs: {
      Display: "6.77-inch LTPO AMOLED, 144Hz",
      Chip: "MediaTek Dimensity 8200 Ultimate",
      Camera: "50MP main + 50MP periscope + 50MP UW",
      Battery: "5000 mAh, 70W charging",
      Storage: "256GB / 512GB",
      Weight: "194 g",
    },
    inStock: true,
    stockCount: 18,
    featured: false,
    shape: "phone",
    accent: "oklch(0.50 0.08 165)",
  },
  {
    name: "HP Spectre x360 14",
    slug: "hp-spectre-x360-14",
    brandSlug: "hp",
    categorySlug: "laptops",
    price: 215000,
    rating: 4.7,
    reviews: 98,
    summary: "2-in-1 convertible. OLED. MPP pen included.",
    description:
      "The HP Spectre x360 14 is a 2-in-1 that doubles as a creator's canvas. A 14-inch 2.8K OLED display flips 360 degrees, with a bundled MPP 2.0 pen for sketching and annotation. Intel Core Ultra with AI engine, machined aluminium body, and 13 hours of battery — the convertible that doesn't compromise.",
    features: [
      "14-inch 2.8K OLED touchscreen, 120Hz",
      "360-degree hinge — laptop, tablet, tent, stand",
      "Intel Core Ultra 7 with AI engine",
      "MPP 2.0 pen included",
      "Machined aluminium, diamond-cut edges",
      "Up to 13 hours battery",
    ],
    specs: {
      Display: "14-inch 2.8K OLED, 120Hz touch",
      Chip: "Intel Core Ultra 7 155H",
      Memory: "16GB / 32GB LPDDR5x",
      Storage: "1TB / 2TB SSD",
      Battery: "Up to 13 hours",
      Weight: "1.34 kg",
    },
    inStock: true,
    stockCount: 7,
    featured: false,
    shape: "laptop",
    accent: "oklch(0.50 0.06 240)",
  },
  {
    name: "Apple Magic Keyboard for iPad Pro",
    slug: "apple-magic-keyboard-ipad-pro",
    brandSlug: "apple",
    categorySlug: "accessories",
    price: 32000,
    rating: 4.7,
    reviews: 234,
    summary: "Turns your iPad Pro into a laptop, instantly.",
    description:
      "The Apple Magic Keyboard for iPad Pro delivers a laptop-grade typing experience with a built-in trackpad. Floating cantilever design adjusts to the perfect viewing angle. USB-C passthrough charging frees up the iPad's port. Backlit keys with scissor mechanism — the most capable iPad accessory ever made.",
    features: [
      "Floating cantilever design",
      "Built-in trackpad with multi-touch",
      "Backlit scissor-mechanism keys",
      "USB-C passthrough charging",
      "Smart Connector — no pairing or charging",
      "Available for 11-inch and 13-inch iPad Pro",
    ],
    specs: {
      Compatibility: "iPad Pro M4 (11-inch / 13-inch)",
      Connectivity: "Smart Connector",
      Charging: "USB-C passthrough",
      Layout: "Full-size backlit keys",
      Weight: "710 g (11-inch)",
    },
    inStock: true,
    stockCount: 14,
    featured: false,
    shape: "accessory",
    accent: "oklch(0.40 0.08 165)",
  },
  {
    name: "Anker 737 PowerCore 24K",
    slug: "anker-737-powercore-24k",
    brandSlug: "jbl",
    categorySlug: "accessories",
    price: 9800,
    originalPrice: 12000,
    rating: 4.8,
    reviews: 1240,
    tag: "Deal",
    summary: "24,000mAh. 140W. Charges a MacBook Pro.",
    description:
      "The Anker 737 PowerCore is the power bank that charges everything. 24,000mAh capacity, 140W USB-C output — enough to fast-charge a 16-inch MacBook Pro. Smart digital display shows remaining battery and time-to-empty. TSA-friendly for carry-on. The road warrior's only power bank.",
    features: [
      "24,000mAh capacity — multiple device charges",
      "140W USB-C output — fast-charges a MacBook Pro",
      "Smart digital display — battery % and time-to-empty",
      "Three ports: 2x USB-C + 1x USB-A",
      "TSA-friendly (under 100Wh) for carry-on",
      "PowerIQ 4.0 intelligent device detection",
    ],
    specs: {
      Capacity: "24,000 mAh / 86.4 Wh",
      Output: "140W max (USB-C), 140W combined",
      Ports: "2x USB-C, 1x USB-A",
      Input: "140W USB-C",
      Weight: "635 g",
    },
    inStock: true,
    stockCount: 60,
    featured: false,
    shape: "accessory",
    accent: "oklch(0.45 0.10 145)",
  },
];

const REVIEWS = [
  { author: "Wanjiru Kamau", role: "Product Designer", location: "Nairobi", rating: 5, title: "Authentic, fast, premium.", body: "Ordered on Tuesday morning, paid with M-Pesa, had it in Westlands by lunch. The serial checked out on Apple's site. This is how tech retail should work in Kenya.", productIdSlug: "iphone-15-pro" },
  { author: "David Otieno", role: "Parent", location: "Kisumu", rating: 5, title: "Best service in Kenya.", body: "Bought a MacBook for my daughter's university. The team walked me through financing, set it up in-store, and even helped with AppleCare. Five stars feels insufficient.", productIdSlug: "macbook-air-m3" },
  { author: "Aisha Mwinyi", role: "Founder, Tide Studio", location: "Mombasa", rating: 5, title: "Our go-to for studio gear.", body: "We've bought twelve devices from Safaritech over two years — every single one authentic, every warranty honoured. They've earned our trust.", productIdSlug: "sony-wh-1000xm5" },
  { author: "Brian Kiprotich", role: "Software Engineer", location: "Nakuru", rating: 5, title: "Finally, a retailer I trust.", body: "The PS5 I ordered arrived the next morning. Original seal, two controllers, the game I wanted. I'd given up on Kenyan retailers — Safaritech restored it.", productIdSlug: "playstation-5-slim" },
  { author: "Faith Nyambura", role: "Photographer", location: "Nairobi", rating: 5, title: "Camera game-changer.", body: "The 200MP sensor on this Ultra is unreal for client work. M-Pesa checkout was instant, delivery same-day. Already recommended to three photographer friends.", productIdSlug: "galaxy-s24-ultra" },
  { author: "Kevin Mwangi", role: "Student", location: "Eldoret", rating: 5, title: "Best value phone I've owned.", body: "Redmi Note 13 Pro at this price is a steal. 200MP camera, fast charging, smooth display. Came sealed with full warranty. Couldn't be happier.", productIdSlug: "xiaomi-redmi-note-13-pro" },
];

async function main() {
  console.log("Seeding Safaritech catalog...");

  await db.review.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();

  const catMap: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await db.category.create({ data: c });
    catMap[c.slug] = created.id;
  }
  console.log(`+ ${CATEGORIES.length} categories`);

  const brandMap: Record<string, string> = {};
  for (const b of BRANDS) {
    const created = await db.brand.create({ data: b });
    brandMap[b.slug] = created.id;
  }
  console.log(`+ ${BRANDS.length} brands`);

  let productCount = 0;
  const productMap: Record<string, string> = {};
  for (const p of PRODUCTS) {
    const { brandSlug, categorySlug, features, specs, ...rest } = p;
    const created = await db.product.create({
      data: {
        ...rest,
        brandId: brandMap[brandSlug],
        categoryId: catMap[categorySlug],
        features: JSON.stringify(features),
        specs: JSON.stringify(specs),
      },
    });
    productMap[p.slug] = created.id;
    productCount++;
  }
  console.log(`+ ${productCount} products`);

  for (const r of REVIEWS) {
    const productId = productMap[r.productIdSlug];
    if (!productId) continue;
    const { productIdSlug, ...reviewData } = r;
    await db.review.create({
      data: { ...reviewData, productId },
    });
  }
  console.log(`+ ${REVIEWS.length} reviews`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
