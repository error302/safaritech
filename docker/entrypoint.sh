#!/bin/sh
set -e

echo "==> Running Prisma migrations (db push)..."
npx prisma db push --schema=prisma/schema.prisma --skip-generate

echo "==> Seeding database if empty..."
npx tsx prisma/seed.ts 2>/dev/null || echo "Seed skipped (data may already exist)"

echo "==> Starting app..."
exec "$@"