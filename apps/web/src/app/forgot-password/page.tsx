'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
        return
      }

      setSent(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
              <Mail className="h-8 w-8 text-green" />
            </div>
            <h1 className="mb-2 text-2xl font-bold font-display text-gray-900 md:text-white">Check your email</h1>
            <p className="mb-6 text-gray-500 md:text-gray-400">
              We&apos;ve sent password reset instructions to <span className="text-gray-900 md:text-white font-medium">{email}</span>
            </p>
            <Link href="/login" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all w-full block text-center">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
          <Link href="/login" className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold font-display text-gray-900 md:text-white">Forgot password?</h1>
            <p className="text-gray-500 md:text-gray-400">No worries, we&apos;ll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red/10 border border-red/20 p-3 text-sm text-red">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-electric focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all w-full py-3"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
