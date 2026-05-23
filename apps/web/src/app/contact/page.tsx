'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Building2, Globe } from 'lucide-react'

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
      <div className="bg-safaridark min-h-screen py-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10">
            <Send className="h-10 w-10 text-green" />
          </div>
          <h1 className="mb-4 text-3xl font-bold font-display text-white">Message Sent!</h1>
          <p className="text-gray-500 md:text-gray-400 mb-8">
            Thank you for reaching out. Our team will review your message and get back to you within
            24 hours. In the meantime, feel free to reach us on WhatsApp for faster assistance.
          </p>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-safaridark min-h-screen py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Get In Touch</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Have a question about a product, need help with an order, or want to explore partnership
            opportunities? We are here to help. Reach out through any of our channels below and our
            team will respond promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-gray-500 md:text-gray-400">+254 700 000 000</p>
                  <p className="text-sm text-gray-500 md:text-gray-400 mt-1">Mon-Sat, 8am-8pm EAT</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-gray-500 md:text-gray-400">hello@safaritech.co.ke</p>
                  <p className="text-sm text-gray-500 md:text-gray-400 mt-1">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Office</h3>
                  <p className="text-gray-500 md:text-gray-400">Westlands Business Centre</p>
                  <p className="text-sm text-gray-500 md:text-gray-400">Waiyaki Way, Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Business Hours</h3>
                  <p className="text-gray-500 md:text-gray-400">Monday - Friday: 8am - 8pm</p>
                  <p className="text-sm text-gray-500 md:text-gray-400">Saturday: 9am - 6pm</p>
                  <p className="text-sm text-gray-500 md:text-gray-400">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-green/30 bg-green/10 p-4 text-green hover:bg-green/20 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="font-semibold">Chat on WhatsApp</span>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <h2 className="mb-2 text-xl font-semibold text-white">Send us a Message</h2>
              <p className="mb-6 text-sm text-gray-500 md:text-gray-400">
                Fill out the form below and our team will get back to you as soon as possible.
                For urgent inquiries, please call us directly or reach out via WhatsApp.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-white focus:border-neon focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="support">Technical Support</option>
                    <option value="warranty">Warranty Claim</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-safariborder bg-safaridark px-4 py-2.5 text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none resize-none"
                  placeholder="How can we help you? Please include relevant details such as order IDs, product names, or any other information that will help us assist you faster."
                />
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red/10 border border-red/30 p-3 text-sm text-red">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-3 rounded-lg text-sm transition-all w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold font-display text-white">Visit Our Office</h2>
          <div className="rounded-2xl border border-safariborder bg-safarigray overflow-hidden">
            <div className="aspect-[21/9] bg-safaridark relative flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon/10 text-neon">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Westlands Business Centre</h3>
                <p className="text-gray-500 md:text-gray-400">Waiyaki Way, Westlands, Nairobi, Kenya</p>
                <p className="text-sm text-gray-500 md:text-gray-400 mt-1">
                  Open Monday to Saturday — Free parking available
                </p>
                <a
                  href="https://maps.google.com/?q=Westlands+Nairobi+Kenya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-neon hover:underline text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white mb-2">WhatsApp Support</h3>
            <p className="text-sm text-gray-500 md:text-gray-400">
              Get instant help via WhatsApp. Our support team is available during business hours
              to answer your questions, process returns, and provide product recommendations.
            </p>
          </div>
          <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white mb-2">Walk-In Support</h3>
            <p className="text-sm text-gray-500 md:text-gray-400">
              Visit our Westlands office for hands-on product demos, warranty claims, and
              face-to-face assistance. Our friendly staff will guide you through every step.
            </p>
          </div>
          <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-500 md:text-gray-400">
              For detailed inquiries, warranty claims, or partnership proposals, email us at
              hello@safaritech.co.ke. We respond within 24 hours with comprehensive answers.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
