# Safaritech Comprehensive Fix Design

## Overview
Full-stack audit revealed ~50 issues across security, functionality, and feature gaps. The app has solid backend infrastructure (Prisma, tRPC routers, NextAuth, M-Pesa/Stripe webhooks) but the frontend is largely disconnected — 17+ pages use hardcoded data instead of the existing tRPC procedures.

## Phased Approach

### Phase 1: Security & Critical Fixes
Priority: Ship immediately. These are security vulnerabilities and data integrity issues.

| # | Fix | File(s) | Detail |
|---|-----|---------|--------|
| 1 | Remove exposed DB creds from vercel.json | `vercel.json` | Delete `DATABASE_URL` and `NEXTAUTH_SECRET` from env block. Set via Vercel dashboard. Rotate compromised credentials. |
| 2 | Review ownership check | `src/server/routers/review.ts:34-56` | Add `if (review.userId !== ctx.session.user.id) throw new Error('Unauthorized')` before update/delete |
| 3 | Forgot-password email enumeration | `src/app/api/auth/forgot-password/route.ts:20-25` | Always return success message regardless of email existence |
| 4 | Zod validation on register | `src/app/api/auth/register/route.ts` | Add Zod schema: email format, name min 1, phone optional, password min 8 |
| 5 | Password strength validation | `src/app/api/auth/register/route.ts` | Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number |
| 6 | Cart item ownership check | `src/server/routers/cart.ts:66-77` | Verify `cartItem.userId === ctx.session.user.id` before update/remove |
| 7 | Case-insensitive search | `src/server/routers/product.ts:18-21,118-121` | Add `mode: 'insensitive'` to Prisma `contains` queries |
| 8 | Remove `as never` type hacks | `src/server/routers/order.ts:75`, `src/app/api/webhooks/mpesa/route.ts:27` | Add `mpesaRef` to Prisma Order model or use proper type casting |
| 9 | Sanitize blog HTML | `src/app/blog/[slug]/page.tsx:72` | Install DOMPurify, sanitize `dangerouslySetInnerHTML` content |
| 10 | Rate limiter note | `src/lib/rate-limit.ts` | Add comment that in-memory store is dev-only; production needs Redis/Vercel KV |

### Phase 2: Checkout, Payments & Real Orders
Priority: Makes the app actually functional for selling products.

| # | Fix | File(s) | Detail |
|---|-----|---------|--------|
| 11 | Wire checkout to orderRouter.create | `src/app/checkout/page.tsx:54-61` | Replace `setTimeout` with tRPC `order.create` mutation |
| 12 | Stock validation + decrement on order | `src/server/routers/order.ts:24-61` | Check stock > 0 for each item, decrement after order create, wrap in transaction |
| 13 | M-Pesa STK Push from checkout | `src/app/checkout/page.tsx` | Trigger `initiateSTKPush` via orderRouter, show pending state, handle callback |
| 14 | Stripe checkout session | `src/app/checkout/page.tsx`, new `src/app/api/checkout/stripe/route.ts` | Create Stripe Checkout Session, redirect to Stripe, handle webhook |
| 15 | Cart sync on login | `src/app/stores/cartStore.ts`, `src/server/routers/cart.ts` | On login: merge localStorage items into server cart, hydrate zustand from server |
| 16 | Dynamic coupon validation | `src/app/checkout/page.tsx:40-46` | Replace hardcoded coupons with `couponRouter.validate` mutation |
| 17 | Real order ID on success page | `src/app/checkout/success/page.tsx:5` | Read orderId from URL param or session, not random generation |
| 18 | Email delivery via Resend | `src/lib/email.ts:8` | Wire Resend API for: order confirmation, password reset, shipping updates, contact form |
| 19 | Shipping rate calculation | `src/app/checkout/page.tsx:29` | Location-based rates (Nairobi free >10k, other regions tiered) |
| 20 | Order cancellation flow | `src/app/orders/[id]/page.tsx` | Cancel button within 1hr window, calls `orderRouter.adminUpdateStatus` |

### Phase 3: Wire All Pages + Missing Features
Priority: Complete feature set for production.

**Wire Pages to Backend (21-33):**
- Search → `productRouter.getAll(search)`
- Track order → `orderRouter.getById`
- Wishlist → `wishlistRouter` (add/remove/get)
- Orders list → `orderRouter.getByUser`
- Order detail → `orderRouter.getById`
- Dashboard stats → real queries
- Settings → profile/address CRUD
- Blog list/detail → `blogRouter`
- Categories → `categoryRouter`
- Deals → `productRouter.getAll` with sale filter
- Shop/[category] → `productRouter.getAll(category)`
- Remove duplicate `/product/[slug]` → redirect to `/products/[slug]`
- Contact form → save to DB or email via Resend

**Admin Completeness (34-37):**
- Admin blog → wire to `blogRouter` with WYSIWYG editor
- Admin settings → `Settings` model + router
- Admin sidebar → add Blog nav item
- Admin responsive layout (collapsible sidebar)

**New Features (38-50):**
- Address management CRUD
- Dynamic sitemap with product URLs
- Structured data (Schema.org Product, BreadcrumbList, FAQ)
- Dynamic OG images via `next/og`
- PWA (manifest.json + service worker)
- Newsletter/email subscription
- Recently viewed products (localStorage + display)
- Related/cross-sell products on PDP (same category)
- Product comparison (select 2-3, side-by-side table)
- Social login (Google OAuth via NextAuth)
- Inventory alerts (low stock email to admin)
- Admin coupon management UI
- Admin review moderation UI

## Architecture Decisions
- All page wiring uses existing tRPC routers (no new routers needed for 21-33)
- Email: Resend API (already in `.env.example`)
- Payment: M-Pesa (primary, already integrated in orderRouter) + Stripe Checkout Sessions (secondary)
- Cart sync: merge on login callback, hydrate from server cart
- SEO: dynamic metadata via `generateMetadata`, sitemap via `sitemap.ts`, structured data as JSON-LD
- PWA: `next-pwa` package or manual service worker
- Social login: NextAuth Google provider addition

## Success Criteria
- Phase 1: Zero security vulnerabilities, all type hacks removed, proper auth checks on all mutations
- Phase 2: End-to-end order flow: browse → cart → checkout → pay → confirmation email
- Phase 3: All 50 items complete, every page uses real data, no hardcoded/placeholder content anywhere
