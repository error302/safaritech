'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSent(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send message')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
            <Send className="h-10 w-10 text-green" />
          </div>
          <h1 className="mb-4 text-3xl font-bold font-display text-gray-900 md:text-white">Message Sent!</h1>
          <p className="text-gray-500 md:text-gray-400 mb-8">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Get In Touch</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Have a question? We&apos;re here to help. Reach out through any of our channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-500 md:text-gray-400">+254 700 000 000</p>
                  <p className="text-sm text-gray-500 md:text-gray-400 mt-1">Mon-Sat, 8am-8pm</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-500 md:text-gray-400">hello@safaritech.co.ke</p>
                  <p className="text-sm text-gray-500 md:text-gray-400 mt-1">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-gray-500 md:text-gray-400">Westlands Business Centre</p>
                  <p className="text-sm text-gray-500 md:text-gray-400">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-green/30 bg-green/10 p-4 text-green hover:bg-green/20 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="font-semibold">Chat on WhatsApp</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
              <h2 className="mb-6 text-xl font-semibold">Send us a Message</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white focus:border-neon focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all w-full py-3"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
