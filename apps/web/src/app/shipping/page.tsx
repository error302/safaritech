export default function Shipping() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Shipping Information</h1>
          <p className="text-gray-500 md:text-gray-400">Fast, reliable delivery across Kenya</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Delivery Options</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Express Delivery (Nairobi)</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>24-48 hour delivery within Nairobi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Free for orders above KSh 10,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>KSh 500 for orders below KSh 10,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Real-time tracking included</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Standard Delivery (Nationwide)</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>3-5 business days to major towns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>5-7 days to remote areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Calculated at checkout based on location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Free for orders above KSh 25,000</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Place Your Order</h3>
                  <p className="text-gray-600 md:text-gray-400">Complete your purchase through our secure checkout process.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Order Processing</h3>
                  <p className="text-gray-600 md:text-gray-400">We verify your payment and prepare your items for shipment within 24 hours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Delivery & Tracking</h3>
                  <p className="text-gray-600 md:text-gray-400">Receive tracking details via SMS and email. Track your order in real-time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Receive & Enjoy</h3>
                  <p className="text-gray-600 md:text-gray-400">Your order arrives at your doorstep. Time to enjoy your new gadget!</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Important Notes</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6 space-y-4">
              <div className="flex gap-3">
                <span className="text-amber-500 text-xl">⚠️</span>
                <div>
                  <p className="font-medium">Delivery Times</p>
                  <p className="text-gray-600 md:text-gray-400">Delivery times are estimates and may vary during holidays or due to unforeseen circumstances.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-500 text-xl">📦</span>
                <div>
                  <p className="font-medium">Packaging</p>
                  <p className="text-gray-600 md:text-gray-400">All products are packaged securely to prevent damage during transit. Large items may require assembly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500 text-xl">🪪</span>
                <div>
                  <p className="font-medium">ID Verification</p>
                  <p className="text-gray-600 md:text-gray-400">Please have a valid ID ready when receiving high-value orders (above KSh 50,000).</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a href="/track-order" className="bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg transition-all">
              Track Your Order
            </a>
            <a href="/contact" className="border border-gray-200 md:border-safariborder text-gray-700 md:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-all hover:border-neon hover:text-neon">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
