---
name: testing-safaritech-storefront
description: Test Safaritech storefront checkout, admin order persistence, and M-Pesa fail-closed behavior. Use for product, cart, payment, admin-auth, or production-readiness changes.
---

# Safaritech Storefront Testing

## Devin Secrets Needed

- `DATABASE_URL`: PostgreSQL database used for migrations, seed data, orders, stock, coupons, and rate limits.
- `NEXTAUTH_SECRET`: Required when testing admin sessions.
- `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, `MPESA_CALLBACK_URL`, and `MPESA_CALLBACK_SECRET`: Needed only for real Daraja STK push/callback testing.
- `MPESA_ENVIRONMENT`: Set to `sandbox` or `production` for real Daraja testing.
- No M-Pesa secrets are needed for the explicit local mock path; set `MPESA_ALLOW_MOCK=true` only with a non-production server.

Never include secret values in recordings, reports, shell output, or committed files.

## Runtime prerequisites

1. Use Node.js 20.19+ as declared by `.node-version` and `package.json`.
2. Install dependencies with `npm install --legacy-peer-deps`.
3. Generate Prisma client with `npm run db:generate`.
4. Use an isolated PostgreSQL database for E2E orders.
5. Deploy migrations with `npm run db:migrate:deploy`.
6. Seed products and a local-only admin:
   ```bash
   ADMIN_EMAIL=admin@example.test \
   ADMIN_PASSWORD='<local-only-password>' \
   npm run db:seed
   ```

The seed is expected to provide 21 products, including `dell-xps-13-plus`, plus `WELCOME10`.

## Browser success path

Start the local application with:

```bash
DATABASE_URL='<postgres-url>' \
NEXTAUTH_URL='http://localhost:3000' \
APP_ORIGIN='http://localhost:3000' \
NEXTAUTH_SECRET='<local-secret>' \
MPESA_ALLOW_MOCK='true' \
npm run dev
```

Use these hash routes:

- Storefront: `#/`
- Shop: `#/shop`
- Trust content: `#/why-safaritech`
- Cart/checkout: `#/cart`
- Admin: `#/admin`

Recommended browser flow:

1. Verify product-focused sections precede editorial/trust content on the homepage.
2. Open `Why Safaritech`, verify the secondary route, then return via `Browse products`.
3. Search for Dell XPS 13 Plus, open it, and add one item.
4. Confirm cart and checkout totals stay KSh 195,000.
5. Fill all required delivery fields except email and verify both email/form errors.
6. Correct email and submit.
7. Verify the confirmation explicitly says the development mock collected no real payment.
8. Capture the `SFT-` order reference.
9. Open `#/admin`; verify login is required.
10. Authenticate with the seeded local admin and expand the matching order.
11. Verify reference, email, phone, item, total, and payment state.

The product detail page may briefly render a skeleton while its API request completes. Wait for the product heading and price before interacting.

## Production fail-closed path

An optimized build is required before `next start`:

```bash
npm run build
```

Start a separate production server with trusted origins configured and all `MPESA_*` credentials plus `MPESA_ALLOW_MOCK` unset.

Submit a valid order with the configured origin and verify:

- HTTP 502 with `M-Pesa is not configured`
- A scoped order token is returned for retry
- The order payment state becomes `FAILED`
- Product stock returns to its pre-request value
- Coupon usage returns to its pre-request value
- Retry without `x-order-token` returns HTTP 401
- `GET /api/orders` without an admin session returns HTTP 401

Redact scoped tokens from reports. Report only token presence/length.

## Evidence and reporting

- Maximize Chrome before recording.
- Record only the primary browser flow; do not record shell-only checks.
- Add `setup`, `test_start`, and consolidated `assertion` annotations.
- Capture full-screen screenshots for product discovery, trust route, validation error, confirmation, and expanded admin order.
- Inspect browser console output after the flow.
- Report real Daraja STK push/callback/settlement as **untested** unless actual credentials and a reachable callback environment were used.
