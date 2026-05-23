import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function GET() {
  const details: Record<string, any> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDatabaseUrlPooled: !!process.env.DATABASE_URL_POOLED,
    hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextauthUrl: !!process.env.NEXTAUTH_URL,
    databaseUrlProtocol: process.env.DATABASE_URL?.split('://')[0] || 'missing',
    pooledUrlProtocol: process.env.DATABASE_URL_POOLED?.split('://')[0] || 'missing',
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    details.status = 'healthy'
    details.database = 'connected'
    return NextResponse.json(details)
  } catch (error: any) {
    details.status = 'unhealthy'
    details.database = 'failed'
    details.dbError = error?.message || String(error)
    details.dbErrorCode = error?.code || 'unknown'
    return NextResponse.json(details, { status: 503 })
  }
}
