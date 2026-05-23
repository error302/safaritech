import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET || 'safaritech-dev-fallback-secret-change-in-prod'
  const token = await getToken({ req, secret })
  const path = req.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callback', 'admin')
      return NextResponse.redirect(loginUrl)
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (path.startsWith('/dashboard') || path.startsWith('/orders') || path.startsWith('/wishlist') || path.startsWith('/settings')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/orders/:path*', '/wishlist/:path*', '/settings/:path*'],
}
