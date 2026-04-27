'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        setError('Invalid email or password')
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white py-8 px-4 md:bg-safaridark md:py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-6 md:rounded-xl md:border-safariborder md:bg-safarigray md:p-8">
          <div className="mb-6 text-center md:mb-8">
            <h1 className="mb-1 text-2xl font-bold text-gray-900 md:mb-2 md:text-3xl md:text-white">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 md:text-base md:text-gray-400">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 md:border-red/20 md:bg-red/10 md:text-red">
                {error}
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
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-neon focus:outline-none md:border-safariborder md:bg-safarigray md:text-white md:placeholder:text-gray-500 md:focus:border-electric"
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-neon focus:outline-none md:border-safariborder md:bg-safarigray md:text-white md:placeholder:text-gray-500 md:focus:border-electric"
                placeholder="••••••••"
              />
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
                className="font-medium text-gray-900 hover:text-gray-700 md:text-neon md:hover:underline"
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
