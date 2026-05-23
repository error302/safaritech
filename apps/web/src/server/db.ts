import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma Accelerate: the prisma+postgres:// connection string in DATABASE_URL
// is automatically handled by Prisma Client v5+ which detects the protocol
// and uses the DataProxyEngine (Accelerate) instead of the LibraryEngine.
//
// We use datasourceUrl to explicitly pass the Accelerate URL so that
// it takes precedence over any system-level DATABASE_URL that might
// be set by other projects in the same environment.
function getDatasourceUrl(): string | undefined {
  // Prefer the explicit Accelerate URL variable if set
  const accelerateUrl = process.env.DATABASE_URL_ACCELERATE
  if (accelerateUrl) return accelerateUrl

  // Check if DATABASE_URL is a Prisma Accelerate URL
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
