'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Check, X } from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  // Password strength indicators
  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ]
  const allPasswordRequirementsMet = passwordChecks.every(c => c.met)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        return
      }

      // Registration successful — auto sign in
      setRegistered(true)
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.ok) {
        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 500))
        const callback = searchParams.get('callback')
        if (callback) {
          router.push(callback)
        } else {
          router.push('/dashboard')
        }
      } else {
        // If auto-login fails, redirect to login page with a message
        router.push('/login?message=Account+created.+Please+sign+in.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 md:py-12 px-4 bg-safaridark">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-safariborder bg-safarigray p-6 md:p-8">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="mb-2 text-2xl md:text-3xl font-bold font-display text-white">Create Account</h1>
            <p className="text-sm text-gray-500 md:text-gray-400">Join Safaritech and start shopping</p>
          </div>

          {registered && (
            <div className="rounded-lg bg-green-50 md:bg-green-500/10 border border-green-200 md:border-green-500/20 p-3 text-sm text-green-700 md:text-green-400 mb-4">
              Account created! Signing you in...
            </div>
          )}

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
                className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
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
                className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Phone Number (Kenya) <span className="text-gray-500 text-xs">optional</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                placeholder="+254 7XX XXX XXX"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-safariborder bg-safaridark pl-4 pr-11 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                  placeholder="8+ characters"
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
              {/* Password requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      {check.met ? (
                        <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      )}
                      <span className={check.met ? 'text-green-400' : 'text-gray-500'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (password.length > 0 && !allPasswordRequirementsMet)}
              className="w-full bg-neon hover:brightness-110 text-black font-display font-bold text-sm py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-safariborder text-center">
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-safaridark">
        <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
