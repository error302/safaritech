'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for error from NextAuth redirect (e.g., ?error=CredentialsSignin)
  const urlError = searchParams.get('error')
  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please check your credentials and try again.',
    SessionRequired: 'Please sign in to access this page.',
    Configuration: 'Authentication configuration error. Please try again later.',
    AccessDenied: 'Access denied. You may not have permission to sign in.',
    Verification: 'The verification link may have expired. Please try again.',
    Default: 'Something went wrong. Please try again.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        const errorMessages: Record<string, string> = {
          CredentialsSignin: 'Invalid email or password. Please check your credentials and try again.',
          SessionRequired: 'Please sign in to access this page.',
          Configuration: 'Authentication configuration error. Please try again later.',
          Default: 'Something went wrong. Please try again.',
        }
        setError(errorMessages[result.error] || errorMessages.Default)
      } else {
        const callback = searchParams.get('callback')
        if (callback === 'admin' || email.includes('admin')) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-safaridark py-8 px-4 md:py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-safariborder bg-safarigray p-6 md:p-8">
          <div className="mb-6 text-center md:mb-8">
            <h1 className="mb-1 text-2xl font-bold text-white md:mb-2 md:text-3xl">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 md:text-base md:text-gray-400">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || urlError) && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 md:border-red/20 md:bg-red/10 md:text-red">
                {error || errorMessages[urlError!] || errorMessages.Default}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700 md:mb-2 md:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-safariborder bg-safarigray px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-neon focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700 md:mb-2 md:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-safariborder bg-safarigray pl-4 pr-11 py-2.5 text-white placeholder:text-gray-500 focus:border-neon focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-neon transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-neon focus:ring-neon md:border-safariborder"
                />
                <span className="text-sm text-gray-500 md:text-gray-400">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-neon md:text-neon md:hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-neon py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-60 md:py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 border-t border-gray-200 pt-5 text-center md:mt-6 md:border-safariborder md:pt-6">
            <p className="text-sm text-gray-500 md:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-neon hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-safaridark">
        <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
