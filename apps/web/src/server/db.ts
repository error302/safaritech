import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use the pooled connection for runtime queries (better for serverless/Vercel)
// Fall back to DATABASE_URL if DATABASE_URL_POOLED is not set
function getDatasourceUrl(): string | undefined {
  const pooledUrl = process.env.DATABASE_URL_POOLED
  if (pooledUrl) return pooledUrl

  // Also support legacy Accelerate URLs
  const accelerateUrl = process.env.DATABASE_URL_ACCELERATE
  if (accelerateUrl) return accelerateUrl

  const dbUrl = process.env.DATABASE_URL
  if (dbUrl && (dbUrl.startsWith('prisma://') || dbUrl.startsWith('prisma+postgres://'))) {
    return dbUrl
  }

  // Fall back to undefined (Prisma will use the URL from schema.prisma)
  return undefined
}

const datasourceUrl = getDatasourceUrl()

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
