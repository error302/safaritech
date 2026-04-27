'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Registration failed')
        return
      }

      await signIn('credentials', { email, password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 md:py-12 px-4 bg-white md:bg-safaridark">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 md:p-8">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="mb-2 text-2xl md:text-3xl font-bold font-display text-gray-900 md:text-white">Create Account</h1>
            <p className="text-sm text-gray-500 md:text-gray-400">Join Safaritech and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 md:bg-red-500/10 border border-red-200 md:border-red-500/20 p-3 text-sm text-red-700 md:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Phone Number (Kenya)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="+254 7XX XXX XXX"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="8+ characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon hover:brightness-110 text-black font-display font-bold text-sm py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-200 md:border-safariborder text-center">
            <p className="text-sm text-gray-500 md:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-neon font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
