'use client'

import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How do I track my order?',
        a: 'You can track your order by clicking the "Track Order" link in the navigation or by visiting /track-order. Enter your order ID and email to see real-time updates on your delivery status.',
      },
      {
        q: 'What are the delivery charges?',
        a: 'Delivery is FREE for orders above KSh 10,000 within Nairobi. For orders below KSh 10,000 in Nairobi, a KSh 500 delivery fee applies. Outside Nairobi, delivery fees vary by location.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Express delivery within Nairobi takes 24-48 hours. Standard delivery outside Nairobi takes 3-5 business days. Remote areas may take an additional 2-3 days.',
      },
      {
        q: 'Do you deliver nationwide?',
        a: 'Yes! We deliver to all major cities and towns across Kenya. We also offer international shipping to select countries.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy for most products. Items must be unused, in original packaging, and with all accessories. Certain items like opened software or personal care products cannot be returned.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team via email or WhatsApp with your order ID and reason for return. We&apos;ll guide you through the process and arrange a pickup.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Products & Warranty',
    questions: [
      {
        q: 'Are all products genuine?',
        a: 'Absolutely! We only sell 100% authentic products sourced directly from manufacturers and authorized distributors. Every purchase comes with a warranty certificate.',
      },
      {
        q: 'What warranty do you offer?',
        a: 'Most products come with a 1-year manufacturer warranty. Extended warranty options are available at checkout for select items.',
      },
      {
        q: 'How do I claim warranty?',
        a: 'Contact our support team with your purchase receipt and warranty card. We&apos;ll arrange for the item to be inspected and repaired or replaced at no cost.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept M-Pesa, Visa/MasterCard, Bank Transfer, and Cash on Delivery (COD) in select areas.',
      },
      {
        q: 'Is M-Pesa payment secure?',
        a: 'Yes! We use secure M-Pesa integration. You&apos;ll receive a payment prompt on your phone and can confirm directly from your M-Pesa menu.',
      },
      {
        q: 'Can I pay on delivery?',
        a: 'Yes, Cash on Delivery is available for orders within Nairobi. A small COD fee of KSh 200 applies.',
      },
    ],
  },
  {
    category: 'Account & Orders',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Get Started" in the navigation and fill in your details. You can also register during checkout.',
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'You can modify your order within 1 hour of placing it. Contact our support immediately with your order ID and the changes you need.',
      },
      {
        q: 'How do I cancel my order?',
        a: 'Contact our support team before shipment to cancel. If the order has shipped, you&apos;ll need to refuse delivery or follow our return process.',
      },
    ],
  },
]

export default function FAQ() {
  const [search, setSearch] = useState('')
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredFaqs = search
    ? faqs.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (q) =>
            q.q.toLowerCase().includes(search.toLowerCase()) ||
            q.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.questions.length > 0)
    : faqs

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Frequently Asked Questions</h1>
          <p className="text-gray-500 md:text-gray-400">
            Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 md:text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray py-3 pl-12 pr-4 text-gray-900 md:text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqs.map((category) => (
            <div key={category.category}>
              <h2 className="mb-4 text-xl font-semibold">{category.category}</h2>
              <div className="space-y-2">
                {category.questions.map((item, idx) => {
                  const id = `${category.category}-${idx}`
                  return (
                    <div
                      key={id}
                      className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(id)}
                        className="flex w-full items-center justify-between p-4 text-left"
                      >
                        <span className="font-medium">{item.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 md:text-gray-400 transition-transform ${
                            openFaqs[id] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaqs[id] && (
                        <div className="border-t border-gray-200 md:border-safariborder p-4 text-gray-500 md:text-gray-400">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">Still have questions?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/254700000000" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
              Chat on WhatsApp
            </a>
            <a href="/contact" className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
