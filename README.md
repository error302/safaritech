# Safaritech

A full-stack e-commerce blueprint derived from `/safaritech-blueprint.html`. Monorepo structure built with Next.js App Router, Prisma, and Docker.

## Quickstart

1. Copy .env.example to .env.local and set values.
2. Start DB and Redis locally:
   - `npm run docker:up`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Start dev server:
   - `npm run dev`

## Structure

- `apps/web`: Next.js app (Tailwind + React + TypeScript)
- `prisma`: database schema and migrations
- `docker`: Docker Compose for local dev
- `nginx`: reverse proxy conf

## Notes

- The source blueprint uses Voltique naming; this repo is named `safaritech` as requested.
- Further implementation TODO: tRPC routers, Auth.js, payment integration, admin dashboard, tests.
