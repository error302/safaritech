import { RefreshCw, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Package, CreditCard, Smartphone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const returnSteps = [
  {
    num: 1,
    title: 'Contact Support Within 7 Days',
    desc: 'Email hello@safaritech.co.ke or WhatsApp +254 700 000 000 with your order ID and the reason for your return. Provide photos of the product if there is any visible damage or defect. The more detail you provide, the faster we can process your request.',
  },
  {
    num: 2,
    title: 'Get Return Authorization',
    desc: 'Our team will review your request within 24 hours and provide a Return Merchandise Authorization (RMA) number along with detailed return instructions. Do not send any items back without an RMA number — unauthorized returns may not be processed.',
  },
  {
    num: 3,
    title: 'Package & Return',
    desc: 'Package the item securely in its original packaging with all accessories, manuals, and documentation included. Affix the RMA label to the outside of the package. We arrange free pickup within Nairobi. For locations outside Nairobi, we will provide the nearest drop-off point for our courier partner.',
  },
  {
    num: 4,
    title: 'Inspection & Refund',
    desc: 'Once we receive and inspect the returned item (typically within 2-3 business days), we will process your refund. You will receive a confirmation email with the refund details. The refund will be credited to your original payment method within the timelines listed below.',
  },
]

export default function Returns() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <RefreshCw className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Returns & Refunds</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Shop with confidence knowing you are protected. If you are not completely satisfied with
            your purchase, our straightforward return and refund policy ensures a hassle-free experience.
            We want every Safaritech customer to be happy with their order.
          </p>
        </div>

        <div className="space-y-12">
          {/* 7-Day Return Policy */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">7-Day Return Policy</h2>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <p className="text-gray-500 md:text-gray-400 mb-6 leading-relaxed">
                We want you to be completely satisfied with your purchase. If you are not happy with your
                order for any reason, you can return it within 7 days of delivery for a full refund or
                exchange. Our return policy is designed to be fair and transparent — no hidden fees, no
                complicated procedures. Simply contact our support team, and we will guide you through
                the process step by step.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-green/20 bg-green/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green" />
                    <h3 className="font-semibold text-white">Eligible for Returns</h3>
                  </div>
                  <ul className="space-y-2 text-gray-500 md:text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Unopened items in original packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Defective products with manufacturing issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Wrong items delivered (different from order)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Items damaged during transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Products not matching the website description</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green mt-0.5">•</span>
                      <span>Items with missing accessories or components</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-red/20 bg-red/5 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="h-5 w-5 text-red" />
                    <h3 className="font-semibold text-white">Non-Returnable Items</h3>
                  </div>
                  <ul className="space-y-2 text-gray-500 md:text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Opened software, games, and digital products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Personal care and hygiene products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Items without original packaging or accessories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Clearance and final sale items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Products with physical damage caused by the customer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red mt-0.5">•</span>
                      <span>Items returned after the 7-day window</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How to Initiate a Return */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">How to Initiate a Return</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              Returning a product is easy. Follow these four simple steps and our team will handle
              the rest. We aim to make the process as smooth and stress-free as possible.
            </p>
            <div className="space-y-6">
              {returnSteps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-500 md:text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Timeline */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Refund Timeline</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              Refund processing times depend on your original payment method. We start processing
              your refund as soon as we complete the inspection of the returned item.
            </p>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">M-Pesa Payments</h3>
                </div>
                <ul className="space-y-2 text-gray-500 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Refunded within 24-48 hours of approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Funds reflect directly in your M-Pesa account — no additional steps required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Both STK push and Paybill payments are refunded to the originating number</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Card Payments (Visa/MasterCard)</h3>
                </div>
                <ul className="space-y-2 text-gray-500 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Refunded within 5-7 business days after approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Your bank may take an additional 3-5 business days to process the refund</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Refund is issued to the same card used for the original purchase</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <Package className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cash on Delivery</h3>
                </div>
                <ul className="space-y-2 text-gray-500 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Store credit issued same day for faster future purchases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Or bank transfer within 5-7 business days (provide your bank details)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Store credit never expires and can be used across the entire catalog</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Exchange Policy */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Exchange Policy</h2>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <p className="text-gray-500 md:text-gray-400 mb-4 leading-relaxed">
                Prefer an exchange instead of a refund? We offer hassle-free exchanges within the
                7-day return window. You can exchange your item for a different size, color, or
                even a completely different product of equal or greater value.
              </p>
              <ul className="space-y-2 text-gray-500 md:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                  <span>Exchanges are subject to product availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                  <span>If the new item costs more, you pay the difference; if less, we refund the balance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                  <span>Exchanges are typically processed faster than refunds — often within 48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                  <span>Free delivery on exchanged items within Nairobi</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Important Conditions */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Important Conditions</h2>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-6 space-y-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Original Condition Required</p>
                  <p className="text-gray-500 md:text-gray-400">Items must be unused, in original packaging, with all tags, accessories, manuals, and documentation included. Products returned in a used or damaged state (unless the damage was present at delivery) may not qualify for a full refund.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">7-Day Window</p>
                  <p className="text-gray-500 md:text-gray-400">Return requests must be initiated within 7 calendar days of delivery. The 7-day period starts from the date you receive the item as confirmed by our courier tracking system. No exceptions can be made after this period.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CreditCard className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Original Payment Method</p>
                  <p className="text-gray-500 md:text-gray-400">Refunds are issued to the original payment method used during checkout. We cannot refund to a different account or payment method. Card payments are refunded to the same card; M-Pesa payments are refunded to the same phone number.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Shipping Fees</p>
                  <p className="text-gray-500 md:text-gray-400">Original shipping fees are non-refundable for returns due to change of mind. However, if the return is due to a defective product, wrong item, or damage during transit, we will refund the full amount including all shipping charges.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Package className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Return Shipping</p>
                  <p className="text-gray-500 md:text-gray-400">Return shipping is free for all eligible returns. We arrange pickup within Nairobi at no cost. For customers outside Nairobi, we provide a prepaid shipping label or reimburse standard courier charges upon receipt of the return.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-safariborder bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Need Help With a Return?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6 max-w-lg mx-auto">
            Our support team is available Monday to Saturday, 8 AM to 6 PM East African Time.
            We are here to make the return process as smooth as possible for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:hello@safaritech.co.ke"
              className="border border-safariborder text-gray-700 md:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-all hover:border-neon hover:text-neon"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
