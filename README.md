# Safaritech

Product-first electronics storefront for Kenya, built with Next.js 15, React 19,
PostgreSQL, Prisma, NextAuth, Tailwind CSS, Cloudinary, and M-Pesa Daraja.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer
- PostgreSQL 14 or newer

## Local setup

```bash
npm ci --legacy-peer-deps
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and
`ADMIN_PASSWORD` before running the seed:

```bash
npm run db:seed
```

The seed only creates an admin when both admin environment variables are set.
Passwords are stored with scrypt; there are no demo or fallback credentials.

## Environment variables

Copy `.env.example` and replace every placeholder. Never commit `.env`.

Required:

- `DATABASE_URL`: PostgreSQL connection string.
- `NEXTAUTH_URL`: Canonical application URL.
- `NEXTAUTH_SECRET`: High-entropy session signing secret. Generate with
  `openssl rand -base64 32`.
- `APP_ORIGIN`: Browser origin allowed to submit state-changing requests.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Bootstrap admin credentials used by the seed.
  Remove them from the runtime environment after the admin has been created.

M-Pesa production checkout additionally requires:

- `MPESA_ENVIRONMENT`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `MPESA_CALLBACK_SECRET`

Missing M-Pesa credentials fail closed. Development mock payments work only when
`NODE_ENV` is not `production` and `MPESA_ALLOW_MOCK=true`.

Signed product-image uploads require:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Local uploads are disabled by default and cannot be enabled in production.

## Database

Development migration:

```bash
npm run db:migrate
```

Production deployment migration:

```bash
npm run db:migrate:deploy
```

Run `db:migrate:deploy` as a dedicated release step before switching production
traffic to a build. Vercel's build command intentionally does not mutate the
production database.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

## Production start

```bash
npm run build
npm start
```

`npm start` runs the standard Next.js production server on port 3000. Vercel
uses its native Next.js runtime.

## Security model

- Admin APIs authorize server-side NextAuth sessions.
- Customer order data is never searchable by email.
- Payment retry is scoped to a high-entropy per-order access token.
- Prices, discounts, shipping, stock, and totals are computed on the server.
- Inventory and coupon usage are updated in serializable transactions.
- M-Pesa callbacks require a secret callback URL and are reconciled against the
  expected checkout request, amount, phone, and unique receipt.
- Sensitive mutations use origin checks and PostgreSQL-backed rate limits.

## Storefront structure

The landing page prioritizes categories, featured products, deals, arrivals, and
brands. Trust, process, and customer-story content is available from the
secondary **Why Safaritech** destination.
