'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [invalidToken, setInvalidToken] = useState(false)

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold font-display text-gray-900 md:text-white">Invalid Link</h1>
          <p className="mb-6 text-gray-500 md:text-gray-400">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
            Request New Link
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
            <Lock className="h-8 w-8 text-green" />
          </div>
          <h1 className="mb-2 text-2xl font-bold font-display text-gray-900 md:text-white">Password reset</h1>
          <p className="mb-6 text-gray-500 md:text-gray-400">
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
        <Link href="/login" className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold font-display text-gray-900 md:text-white">Reset password</h1>
          <p className="text-gray-500 md:text-gray-400">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red/10 border border-red/20 p-3 text-sm text-red">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 pr-10 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all w-full py-3"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
            <p className="text-gray-500 md:text-gray-400">Loading...</p>
          </div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
