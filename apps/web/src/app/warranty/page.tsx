export default function Warranty() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Warranty Information</h1>
          <p className="text-gray-500 md:text-gray-400">Shop with confidence knowing you're protected</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Standard Manufacturer Warranty</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
              <p className="text-gray-600 md:text-gray-400 mb-6">
                All products sold on Safaritech come with a standard manufacturer warranty. We only sell 100% genuine products sourced directly from authorized distributors.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 md:bg-safarigray/50 p-4">
                  <h3 className="font-semibold mb-3">Smartphones & Tablets</h3>
                  <p className="text-gray-600 md:text-gray-400">12 months manufacturer warranty</p>
                </div>
                <div className="rounded-lg bg-gray-50 md:bg-safarigray/50 p-4">
                  <h3 className="font-semibold mb-3">Laptops & Computers</h3>
                  <p className="text-gray-600 md:text-gray-400">12 months manufacturer warranty</p>
                </div>
                <div className="rounded-lg bg-gray-50 md:bg-safarigray/50 p-4">
                  <h3 className="font-semibold mb-3">Audio Equipment</h3>
                  <p className="text-gray-600 md:text-gray-400">6-12 months manufacturer warranty</p>
                </div>
                <div className="rounded-lg bg-gray-50 md:bg-safarigray/50 p-4">
                  <h3 className="font-semibold mb-3">Accessories</h3>
                  <p className="text-gray-600 md:text-gray-400">3-6 months manufacturer warranty</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">What&apos;s Covered</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <p className="font-medium">Manufacturing Defects</p>
                    <p className="text-gray-600 md:text-gray-400">Faulty components, assembly defects, hardware malfunctions occurring under normal use</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <p className="font-medium">Performance Issues</p>
                    <p className="text-gray-600 md:text-gray-400">Device not performing to manufacturer specifications</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✅</span>
                  <div>
                    <p className="font-medium">Power & Battery Issues</p>
                    <p className="text-gray-600 md:text-gray-400">Devices that won't power on or have severe battery degradation (for eligible items)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">What&apos;s Not Covered</h2>
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <div>
                    <p className="font-medium">Physical Damage</p>
                    <p className="text-gray-600 md:text-gray-400">Cracked screens, dents, water damage, drops, or any physical damage</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <div>
                    <p className="font-medium">Unauthorized Repairs</p>
                    <p className="text-gray-600 md:text-gray-400">Devices opened or repaired by unauthorized service providers</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <div>
                    <p className="font-medium">Normal Wear & Tear</p>
                    <p className="text-gray-600 md:text-gray-400">Cosmetic damage, minor scratches, or degradation from normal use</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <div>
                    <p className="font-medium">Software Issues</p>
                    <p className="text-gray-600 md:text-gray-400">Problems caused by unauthorized software, jailbreaking, or unsupported modifications</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">How to Claim Warranty</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Support</h3>
                  <p className="text-gray-600 md:text-gray-400">WhatsApp +254 700 000 000 or email hello@safaritech.co.ke with your order ID and product details.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Describe the Issue</h3>
                  <p className="text-gray-600 md:text-gray-400">Provide detailed description of the problem, when it started, and any troubleshooting you've done.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Receive RMA Number</h3>
                  <p className="text-gray-600 md:text-gray-400">Our team will assess your case and provide a Return Merchandise Authorization (RMA) number if eligible.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon text-black flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Free Pickup & Service</h3>
                  <p className="text-gray-600 md:text-gray-400">We'll arrange free pickup of the item. Repairs typically take 7-14 business days.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 md:text-white">Extended Warranty Options</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Safaritech Care (6 Months)</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Extended coverage for eligible devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Priority support & faster repairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>One free screen replacement (for phones)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>15% discount on accessories</span>
                  </li>
                </ul>
                <p className="font-semibold text-neon">From KSh 1,999</p>
              </div>
              <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-6">
                <h3 className="mb-3 text-lg font-semibold">Safaritech Premium (12 Months)</h3>
                <ul className="space-y-2 text-gray-600 md:text-gray-400 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Comprehensive coverage including accidental damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Express repair service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Two free repairs per year</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>Free pickup and delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1">•</span>
                    <span>20% discount on accessories</span>
                  </li>
                </ul>
                <p className="font-semibold text-neon">From KSh 3,999</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
          <h3 className="mb-2 text-xl font-semibold">Need Warranty Support?</h3>
          <p className="text-gray-600 md:text-gray-400 mb-6">
            Our warranty team is available Monday to Saturday, 8 AM to 6 PM
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
