import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatasourceUrl(): string | undefined {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) return undefined

  // If URL already has query params, append with &, otherwise with ?
  const separator = dbUrl.includes('?') ? '&' : '?'

  // Add connection_limit for serverless environments (Vercel)
  // This prevents connection pool exhaustion
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    if (!dbUrl.includes('connection_limit')) {
      return `${dbUrl}${separator}connection_limit=1`
    }
  }

  return dbUrl
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
