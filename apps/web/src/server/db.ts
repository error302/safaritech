import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL

  // Build datasource URL with connection limit for serverless
  let datasourceUrl = dbUrl
  if (dbUrl && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    if (!dbUrl.includes('connection_limit')) {
      const separator = dbUrl.includes('?') ? '&' : '?'
      datasourceUrl = `${dbUrl}${separator}connection_limit=1`
    }
  }

  // Try Prisma v5+ constructor with datasourceUrl, fall back to v4 style
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      ...(datasourceUrl ? { datasourceUrl } : {}),
    } as any)
  } catch {
    // Prisma v4 doesn't support datasourceUrl in constructor
    // Set via env var instead
    if (datasourceUrl) {
      process.env.DATABASE_URL = datasourceUrl
    }
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
