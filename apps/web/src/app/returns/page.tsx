export default function Returns() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Returns & Refunds</h1>
          <p className="text-gray-500 md:text-gray-400">Shop with confidence knowing you're protected</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">7-Day Return Policy</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
              <p className="text-gray-600 md:text-gray-400 mb-6">
                We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 7 days of delivery for a full refund or exchange.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <p className="font-medium">Eligible for Returns</p>
                    <p className="text-gray-600 md:text-gray-400">Unopened items, defective products, wrong items delivered, items damaged in transit</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <div>
                    <p className="font-medium">Non-Returnable Items</p>
                    <p className="text-gray-600 md:text-gray-400">Opened software, personal care products, items without original packaging, clearance/final sale items</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">How to Initiate a Return</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Support Within 7 Days</h3>
                  <p className="text-gray-600 md:text-gray-400">Email hello@safaritech.co.ke or WhatsApp +254 700 000 000 with your order ID and reason for return.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Get Return Authorization</h3>
                  <p className="text-gray-600 md:text-gray-400">Our team will review your request and provide a Return Merchandise Authorization (RMA) number.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Package & Return</h3>
                  <p className="text-gray-600 md:text-gray-400">Package the item securely with all original accessories and documentation. We'll arrange free pickup.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Inspection & Refund</h3>
                  <p className="text-gray-600 md:text-gray-400">Once received and inspected, we'll process your refund within 5-7 business days to your original payment method.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Refund Timeline</h2>
            <div className="grid gap-6">
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">M-Pesa Payments</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Refunded within 24-48 hours of approval</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Card Payments</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Refunded within 5-7 business days after approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Your bank may take additional 3-5 days to process</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Cash on Delivery</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Store credit issued same day (for faster future purchases)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Or bank transfer within 5-7 business days</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Important Conditions</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 space-y-4">
              <div className="flex gap-3">
                <span className="text-amber-500 text-xl">⚠️</span>
                <div>
                  <p className="font-medium">Original Condition</p>
                  <p className="text-gray-600 md:text-gray-400">Items must be unused, in original packaging, with all tags and accessories included.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-500 text-xl">📅</span>
                <div>
                  <p className="font-medium">7-Day Window</p>
                  <p className="text-gray-600 md:text-gray-400">Return requests must be initiated within 7 days of delivery. No exceptions.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500 text-xl">💳</span>
                <div>
                  <p className="font-medium">Original Payment Method</p>
                  <p className="text-gray-600 md:text-gray-400">Refunds are issued to the original payment method. No cash refunds for card payments.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-500 text-xl">🚫</span>
                <div>
                  <p className="font-medium">Shipping Fees</p>
                  <p className="text-gray-600 md:text-gray-400">Original shipping fees are non-refundable unless the product was defective or incorrect.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
          <h3 className="mb-2 text-xl font-semibold">Need Help With a Return?</h3>
          <p className="text-gray-600 md:text-gray-400 mb-6">
            Our support team is available Monday to Saturday, 8 AM to 6 PM
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a href="https://wa.me/254700000000" className="bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg transition-all">
              Chat on WhatsApp
            </a>
            <a href="mailto:hello@safaritech.co.ke" className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-all hover:border-neon hover:text-neon">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
