# Safaritech — Tech That Moves Kenya

Kenya's premier electronics marketplace. A premium, full-stack Next.js 16 e-commerce platform with a CMS-driven admin dashboard, M-Pesa Daraja integration, product condition system (New / Ex-UK / Refurbished), and real product photography.

![Safaritech](download/logos/concept-2-s-mark.png)

## What's inside

### Storefront
- **Editorial premium design** — Fraunces serif headlines, Inter body, emerald + brass palette, light/dark mode
- **Hash-based view router** — Home, Shop, Product Detail, Cart, Admin (all on `/`)
- **Real product photography** — 21 products with real images, SVG fallback if URLs fail
- **Product conditions** — New (12-month warranty), Ex-UK (3-month), Refurbished (3-month) with color-coded badges
- **Shop filters** — Category, Brand, Condition, Price range, Search, Sort
- **Cart + checkout** — Slide-in cart drawer, customer delivery form with Kenyan phone validation, coupon codes, M-Pesa STK push

### Admin Dashboard (`#/admin`)
- **NextAuth credentials authentication** — email + password login, JWT sessions
- **Overview** — Revenue, orders, products, customers, low-stock alerts, recent orders
- **Products CRUD** — Full create/edit/delete with image upload (Cloudinary or local), condition dropdown, specs/features editors
- **Orders** — Expandable rows with line items, customer details, status management
- **Coupons** — Percentage/fixed discounts, min order, usage limits, expiry, active toggle
- **Site Settings CMS** — Edit hero copy, CTAs, trust badges, contact info, footer, SEO metadata — all live, no code changes

### Backend
- **Next.js 16 App Router** + TypeScript 5 + Tailwind CSS 4 + shadcn/ui
- **Prisma ORM** + SQLite (dev) — Brand, Category, Product, Review, Order, OrderItem, Coupon, User, SiteSetting, CartItem models
- **M-Pesa Daraja STK Push** — Full OAuth + password generation + phone normalization + webhook callback handler (mock mode fallback for dev)
- **Cloudinary image upload** — `/api/admin/upload` with local fallback to `/public/uploads/`
- **NextAuth v4** — Credentials provider, JWT strategy, role-based (ADMIN/CUSTOMER)

## Getting started

### Prerequisites
- Node.js 18+ or Bun
- SQLite (included — no external DB needed for dev)

### Installation

```bash
# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed with sample data (21 products, 12 brands, 6 categories, 3 coupons, admin user)
bun run scripts/seed.ts

# Start the dev server
bun run dev
```

Visit `http://localhost:3000`.

### Admin access

Navigate to `http://localhost:3000#/admin` (or click "Admin" in the footer).

**Demo credentials:**
- Email: `admin@safaritech.co.ke`
- Password: `safaritech-admin-2026`

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` — SQLite path (default: `file:./db/custom.db`)
- `ADMIN_TOKEN` — Simple token for admin API routes
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` (dev) or your production URL
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — NextAuth admin credentials
- `MPESA_*` — Daraja API credentials (optional — runs in mock mode without these)
- `CLOUDINARY_*` — Cloudinary credentials (optional — falls back to local uploads)

## Production deployment

### Enable real M-Pesa Daraja
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke/)
2. Create an app and get your Consumer Key + Consumer Secret
3. Set in `.env`:
   ```
   MPESA_ENV=sandbox
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=174379
   MPESA_PASSKEY=your_passkey
   MPESA_CALLBACK_URL=https://yourdomain.com/api/webhooks/mpesa
   ```

### Enable Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Create an unsigned upload preset named `safaritech_products`
3. Set in `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_UPLOAD_PRESET=safaritech_products
   ```

### Deploy to Vercel
```bash
vercel
```
Set all environment variables in the Vercel dashboard.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Prisma 6 + SQLite (dev) / PostgreSQL (prod) |
| Auth | NextAuth.js v4 (Credentials provider, JWT) |
| Payments | M-Pesa Daraja STK Push |
| Images | Cloudinary (with local fallback) |
| Icons | Lucide React |
| Fonts | Fraunces (display) + Inter (body) + JetBrains Mono |

## Project structure

```
├── prisma/
│   └── schema.prisma          # 10 models: User, Product, Order, Coupon, SiteSetting, etc.
├── scripts/
│   └── seed.ts                # Seeds 21 products, 12 brands, 3 coupons, 32 site settings
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── products/      # GET /api/products, GET /api/products/[slug]
│   │   │   ├── shop/          # GET /api/shop (paginated, filtered)
│   │   │   ├── orders/        # POST /api/orders (creates order + M-Pesa STK push)
│   │   │   ├── checkout/mpesa/# POST /api/checkout/mpesa
│   │   │   ├── webhooks/mpesa/# POST /api/webhooks/mpesa (Daraja callback)
│   │   │   ├── coupons/validate
│   │   │   ├── settings/      # GET (public) + PUT (admin) site settings
│   │   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   │   └── admin/         # Admin CRUD: products, orders, coupons, overview, upload
│   │   ├── layout.tsx         # Fonts + metadata + ThemeProvider
│   │   ├── page.tsx           # View router shell (home/shop/product/cart/admin)
│   │   └── globals.css        # Design tokens + utilities
│   ├── components/
│   │   ├── site/              # Storefront components (hero, navbar, shop, cart, etc.)
│   │   └── admin/             # Admin dashboard (shell, products, orders, coupons, settings)
│   ├── hooks/                 # use-scroll-reveal, use-mobile, use-toast
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── auth.ts            # NextAuth config
│       └── mpesa.ts           # Daraja STK Push integration
├── public/
│   ├── logo.svg               # Default logo
│   ├── logo-s-icon.png        # S-mark logo icon
│   └── uploads/               # Local image upload fallback
└── .env.example               # All environment variables documented
```

## Features

### Product conditions
Every product has a condition that automatically sets its warranty:
- **New** — 12-month warranty, emerald badge
- **Ex-UK** — 3-month warranty, blue badge (pre-owned UK imports)
- **Refurbished** — 3-month warranty, amber badge

Customers can filter by condition in the shop. The condition badge shows on every product card, the product detail page, and the trust badges update dynamically.

### CMS-driven content
Nothing is hardcoded. The admin can edit from the dashboard:
- Hero headline (3 lines), subtitle, CTAs, stat numbers
- Trust badges (4)
- Contact info (address, phone, email)
- Footer tagline + copyright
- SEO title + description
- Site name + logo URL + favicon URL

Changes go live instantly — no code deployment needed.

### M-Pesa checkout
1. Customer adds products to cart
2. Fills delivery details form (name, M-Pesa phone, address, city, county, notes)
3. Optionally applies a coupon code
4. Clicks "Place order" → order created in DB → M-Pesa STK push sent to their phone
5. Customer approves the prompt → Daraja calls the webhook → order payment status updates to PAID
6. Admin sees the order in the dashboard with customer details

In development (without Daraja credentials), the system runs in **mock mode** — simulates a successful STK push so you can test the full flow.

## License

MIT

---

Built with care for Kenya. 🇰🇪
