'use client'

import { useState } from 'react'
import { ChevronDown, Search, MessageCircle, HelpCircle, Truck, Shield, CreditCard, Package, User, Wrench } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Orders & Shipping',
    icon: Truck,
    questions: [
      {
        q: 'How do I track my order?',
        a: 'You can track your order by clicking the "Track Order" link in the navigation menu or by visiting our Track Order page. Enter your order ID and the email address used during checkout to see real-time updates on your delivery status. You will also receive SMS and email notifications at each stage of the delivery process.',
      },
      {
        q: 'What are the delivery charges?',
        a: 'Delivery is FREE for orders above KSh 10,000 within Nairobi. For orders below KSh 10,000 in Nairobi, a flat KSh 500 delivery fee applies. For deliveries outside Nairobi, fees are calculated at checkout based on your location and typically range from KSh 800 to KSh 2,500. Orders above KSh 25,000 qualify for free nationwide delivery.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Express delivery within Nairobi takes 24-48 hours. Standard delivery to major towns (Mombasa, Kisumu, Nakuru, Eldoret, etc.) takes 3-5 business days. Remote areas may take an additional 2-3 days. During peak seasons like Black Friday or Christmas, delivery may take slightly longer, and we will communicate any expected delays proactively.',
      },
      {
        q: 'Do you deliver nationwide?',
        a: 'Yes! We deliver to all 47 counties in Kenya. We have partnered with reliable courier services including G4S, Fargo Courier, and Kenya Post to ensure your order reaches you wherever you are. For very remote locations, delivery may take up to 7 business days, but we always provide tracking information.',
      },
      {
        q: 'Can I change my delivery address after placing an order?',
        a: 'You can change your delivery address within 1 hour of placing your order by contacting our support team. After this window, if the order has already been dispatched, we may not be able to redirect it. In such cases, you can arrange to collect the package from the courier depot in your area.',
      },
      {
        q: 'What happens if I am not home when delivery arrives?',
        a: 'Our courier partners will attempt delivery up to 3 times. If you are unavailable, they will leave a notification with instructions on how to reschedule or collect your package from the nearest depot. You can also authorize someone else to receive the package on your behalf by providing their name and ID number in advance.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: Package,
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy for most products from the date of delivery. Items must be unused, in their original packaging, and with all accessories and documentation included. Certain items like opened software, personal care products, and clearance/final sale items cannot be returned. For full details, please visit our Returns & Refunds page.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our support team via email at hello@safaritech.co.ke or WhatsApp at +254 700 000 000 with your order ID and the reason for your return. Our team will review your request and provide a Return Merchandise Authorization (RMA) number along with instructions on how to package and return the item. We arrange free pickup for returns within Nairobi.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. For M-Pesa payments, refunds are typically processed within 24-48 hours of approval. Card payment refunds may take 5-7 business days, plus an additional 3-5 days for your bank to process. Cash on Delivery orders are refunded via bank transfer or store credit.',
      },
      {
        q: 'What if I receive a damaged or wrong item?',
        a: 'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photos of the issue. We will arrange a free pickup and either send a replacement at no extra cost or issue a full refund including shipping charges. Your satisfaction is our priority, and we will resolve the issue as quickly as possible.',
      },
      {
        q: 'Are original shipping fees refundable?',
        a: 'Original shipping fees are non-refundable for returns due to change of mind. However, if the return is due to a defective product, incorrect item, or damage during transit, we will refund the full amount including shipping charges. We believe you should never pay for our mistakes.',
      },
    ],
  },
  {
    category: 'Products & Warranty',
    icon: Shield,
    questions: [
      {
        q: 'Are all products genuine?',
        a: 'Absolutely! We only sell 100% authentic products sourced directly from manufacturers and authorized distributors. Every purchase comes with a warranty certificate and proof of authenticity. We have zero tolerance for counterfeit products, and any supplier found to be providing non-genuine goods is permanently removed from our platform.',
      },
      {
        q: 'What warranty do you offer?',
        a: 'Most products come with a 1-year manufacturer warranty. Smartphones, tablets, and laptops typically have 12-month warranty coverage, audio equipment ranges from 6-12 months, and accessories carry 3-6 months of warranty. Extended warranty options (Safaritech Care and Safaritech Premium) are available at checkout for additional peace of mind.',
      },
      {
        q: 'How do I claim warranty?',
        a: 'Contact our support team with your purchase receipt and warranty details. Describe the issue you are experiencing, including when it started and any troubleshooting steps you have taken. We will provide a Return Merchandise Authorization (RMA) number and arrange free pickup. Repairs typically take 7-14 business days depending on the issue and availability of parts.',
      },
      {
        q: 'What does the warranty NOT cover?',
        a: 'Warranty does not cover physical damage (cracked screens, dents, water damage), unauthorized repairs or modifications, normal wear and tear, software issues caused by unsupported modifications (jailbreaking, rooting), or damage caused by negligence or misuse. See our Warranty page for the complete list of exclusions.',
      },
      {
        q: 'Do you offer extended warranty?',
        a: 'Yes! We offer Safaritech Care (6 months extended coverage from KSh 1,999) and Safaritech Premium (12 months comprehensive coverage including accidental damage from KSh 3,999). Both plans include priority support, free pickup and delivery for repairs, and discounts on accessories. These can be added during checkout.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept M-Pesa (STK push and Paybill), Visa and MasterCard debit/credit cards, PayPal, bank transfers, and Cash on Delivery (COD) in select areas within Nairobi. All payment methods are processed through secure, PCI-compliant gateways to protect your financial information.',
      },
      {
        q: 'Is M-Pesa payment secure?',
        a: 'Yes! We use secure M-Pesa integration with STK push technology. When you select M-Pesa at checkout, you will receive a payment prompt directly on your phone. Simply enter your M-Pesa PIN to confirm the payment. We never see or store your M-Pesa PIN. If you prefer, you can also use the M-Pesa Paybill option manually.',
      },
      {
        q: 'Can I pay on delivery?',
        a: 'Yes, Cash on Delivery (COD) is available for orders within Nairobi and select surrounding areas. A small COD fee of KSh 200 applies. Please have the exact amount ready when the delivery arrives. For orders above KSh 50,000, we may require a partial prepayment via M-Pesa before dispatch.',
      },
      {
        q: 'Do you offer instalment payments?',
        a: 'We are currently piloting an M-Pesa instalment payment option for qualifying orders above KSh 10,000. This allows you to split your payment into 2-3 monthly instalments. Check the product page or checkout for availability. Additional terms and conditions apply, and eligibility is subject to M-Pesa lending criteria.',
      },
      {
        q: 'Is my payment information safe?',
        a: 'Your payment security is our top priority. We use industry-standard encryption (SSL/TLS) for all transactions. Card details are processed by Stripe and PayPal, both PCI DSS Level 1 compliant service providers. We never store your complete card details on our servers. M-Pesa transactions are processed through Safaricom authorized channels.',
      },
    ],
  },
  {
    category: 'Account & Orders',
    icon: User,
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Get Started" or "Register" in the navigation menu and fill in your details — name, email, phone number, and password. You can also register during checkout. Having an account allows you to track orders, save wishlists, manage delivery addresses, and access exclusive member-only deals.',
      },
      {
        q: 'Can I modify my order after placing it?',
        a: 'You can modify your order within 1 hour of placing it. Contact our support immediately via WhatsApp or email with your order ID and the changes you need. After the 1-hour window, orders enter processing and may not be modifiable. In that case, you would need to wait for delivery and then initiate a return if needed.',
      },
      {
        q: 'How do I cancel my order?',
        a: 'Contact our support team before shipment to cancel your order for a full refund. If the order has already been shipped, you can refuse delivery or follow our standard return process once the item arrives. Cancellations are typically processed within 24 hours, and refunds are issued to your original payment method.',
      },
      {
        q: 'Do I need an account to place an order?',
        a: 'While you can browse our catalog without an account, you will need to register to place an order. This ensures we can track your order, send you delivery updates, and provide after-sales support. Registration is quick and free — it only takes about 30 seconds.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Login" in the navigation menu, then click "Forgot Password." Enter the email address associated with your account, and we will send you a password reset link. The link is valid for 24 hours. If you do not receive the email, check your spam folder or contact support for assistance.',
      },
    ],
  },
  {
    category: 'Technical Support',
    icon: Wrench,
    questions: [
      {
        q: 'My device is not working properly. What should I do?',
        a: 'First, check the manufacturer troubleshooting guide included with your product. Many common issues can be resolved with a simple restart or settings adjustment. If the problem persists, contact our support team with your order ID and a description of the issue. We will guide you through additional troubleshooting steps or initiate a warranty claim if needed.',
      },
      {
        q: 'Do you provide setup assistance?',
        a: 'Yes! Our support team can guide you through basic device setup over the phone or WhatsApp, including account configuration, data transfer tips, and essential app installations. For more complex setups (smart home devices, networking equipment, etc.), we can recommend certified technicians in your area.',
      },
      {
        q: 'How do I update the software on my device?',
        a: 'For smartphones and tablets, go to Settings > System > Software Update. For laptops, use the built-in update tool (Windows Update or macOS Software Update). Always download updates from official sources. If you encounter issues during an update, contact our support team for guidance. We strongly advise against installing unofficial or modified software, as this may void your warranty.',
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
    <div className="bg-safaridark min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Frequently Asked Questions</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Find answers to the most common questions about ordering, shipping, returns, warranty,
            payments, and more. If you cannot find what you are looking for, our support team is
            always happy to help.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 md:text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers... (e.g., 'delivery', 'refund', 'warranty')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-safariborder bg-safarigray py-3 pl-12 pr-4 text-white placeholder:text-gray-500 md:placeholder:text-gray-400 focus:border-neon focus:outline-none"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {filteredFaqs.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 text-neon">
                  <category.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">{category.category}</h2>
                <span className="text-sm text-gray-500 md:text-gray-400">
                  ({category.questions.length} {category.questions.length === 1 ? 'question' : 'questions'})
                </span>
              </div>
              <div className="space-y-2">
                {category.questions.map((item, idx) => {
                  const id = `${category.category}-${idx}`
                  return (
                    <div
                      key={id}
                      className="rounded-2xl border border-safariborder bg-safarigray overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(id)}
                        className="flex w-full items-center justify-between p-5 text-left hover:bg-safaridark/50 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{item.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 md:text-gray-400 transition-transform flex-shrink-0 ${
                            openFaqs[id] ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFaqs[id] && (
                        <div className="border-t border-safariborder p-5 text-gray-500 md:text-gray-400 leading-relaxed">
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

        {/* No results */}
        {search && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-500 md:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-500 md:text-gray-400">
              No questions matching &quot;{search}&quot;. Try different keywords or contact our support team directly.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl border border-safariborder bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Still have questions?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6 max-w-lg mx-auto">
            Our support team is available Monday to Saturday, 8 AM to 8 PM East African Time.
            We typically respond within a few hours during business hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="border border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
