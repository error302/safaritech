import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function GET() {
  const checks: Record<string, { status: string; detail?: string }> = {}

  // Check 1: Environment variables
  const envVars = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '(not set)',
    DATABASE_URL: !!process.env.DATABASE_URL,
    DATABASE_URL_POOLED: !!process.env.DATABASE_URL_POOLED,
    NODE_ENV: process.env.NODE_ENV || '(not set)',
  }
  checks['environment'] = { status: 'ok', detail: JSON.stringify(envVars) }

  // Check 2: Database connectivity
  try {
    const userCount = await prisma.user.count()
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    checks['database'] = { status: 'ok', detail: `${userCount} users, ${adminCount} admins` }
  } catch (error) {
    checks['database'] = { status: 'error', detail: String(error) }
  }

  // Check 3: Admin user exists
  try {
    const adminEmail = 'mohameddosho20@gmail.com'
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (admin) {
      checks['admin_user'] = { status: 'ok', detail: `Found: ${admin.email}, role: ${admin.role}, hasPassword: ${!!admin.passwordHash}` }
    } else {
      checks['admin_user'] = { status: 'warning', detail: `Admin user ${adminEmail} not found in database` }
    }
  } catch (error) {
    checks['admin_user'] = { status: 'error', detail: String(error) }
  }

  const allOk = Object.values(checks).every(c => c.status === 'ok')

  return NextResponse.json({
    status: allOk ? 'healthy' : 'issues_found',
    timestamp: new Date().toISOString(),
    checks,
  }, { status: allOk ? 200 : 503 })
}
