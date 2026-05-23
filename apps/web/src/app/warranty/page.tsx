import { Shield, CheckCircle2, XCircle, Clock, Wrench, Star, ArrowRight, MessageCircle, Package, Smartphone, Laptop, Headphones, Cable } from 'lucide-react'
import Link from 'next/link'

const warrantyCategories = [
  { icon: Smartphone, title: 'Smartphones & Tablets', period: '12 months manufacturer warranty', detail: 'Covers hardware defects, battery issues under normal use, and manufacturing faults.' },
  { icon: Laptop, title: 'Laptops & Computers', period: '12 months manufacturer warranty', detail: 'Covers hardware malfunctions, display defects, keyboard failures, and motherboard issues.' },
  { icon: Headphones, title: 'Audio Equipment', period: '6-12 months manufacturer warranty', detail: 'Covers speaker defects, connectivity issues, and hardware malfunctions depending on brand.' },
  { icon: Cable, title: 'Accessories & Peripherals', period: '3-6 months manufacturer warranty', detail: 'Covers manufacturing defects in chargers, cables, cases, and other accessories.' },
]

const claimSteps = [
  {
    num: 1,
    title: 'Contact Support',
    desc: 'WhatsApp +254 700 000 000 or email hello@safaritech.co.ke with your order ID and product details. Provide your purchase receipt or order confirmation number so we can verify your warranty status quickly.',
  },
  {
    num: 2,
    title: 'Describe the Issue',
    desc: 'Provide a detailed description of the problem — when it started, how it manifests, and any troubleshooting steps you have already taken. Include photos or videos if possible, as this helps our technical team diagnose the issue faster.',
  },
  {
    num: 3,
    title: 'Receive RMA Number',
    desc: 'Our team will assess your case within 24 hours and provide a Return Merchandise Authorization (RMA) number if your claim is eligible. You will receive detailed instructions on how to package and return the item.',
  },
  {
    num: 4,
    title: 'Free Pickup & Service',
    desc: 'We arrange free pickup of the item from your location. Our certified technicians inspect and repair the product. Repairs typically take 7-14 business days depending on the issue and availability of parts. You will receive status updates throughout the process.',
  },
  {
    num: 5,
    title: 'Return or Replacement',
    desc: 'Once repaired, we deliver the item back to you free of charge. If the product cannot be repaired, we will offer a replacement of equal or greater value, or a full refund at your preference.',
  },
]

export default function Warranty() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Warranty Information</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Shop with confidence knowing every product from Safaritech is backed by a genuine
            manufacturer warranty. We only sell 100% authentic products sourced directly from
            authorized distributors, and we stand behind every item we sell with comprehensive
            warranty support and hassle-free claims processing.
          </p>
        </div>

        <div className="space-y-12">
          {/* Standard Warranty */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Standard Manufacturer Warranty</h2>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <p className="text-gray-500 md:text-gray-400 mb-6 leading-relaxed">
                All products sold on Safaritech come with a standard manufacturer warranty. We only sell
                100% genuine products sourced directly from authorized distributors and brand partners.
                This means your warranty is valid and can be serviced at any authorized service center
                across Kenya, not just through Safaritech. However, we recommend going through our
                dedicated warranty support team for the fastest and most convenient service.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {warrantyCategories.map((cat) => (
                  <div key={cat.title} className="rounded-xl bg-safaridark p-5 border border-safariborder">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{cat.title}</h3>
                        <p className="text-sm text-neon">{cat.period}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 md:text-gray-400">{cat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What's Covered */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">What&apos;s Covered</h2>
            <div className="rounded-2xl border border-green/20 bg-green/5 p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Manufacturing Defects</p>
                    <p className="text-gray-500 md:text-gray-400">Faulty components, assembly defects, hardware malfunctions occurring under normal use. This includes issues like dead pixels on displays, non-responsive buttons, and faulty ports that were present at the time of manufacture.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Performance Issues</p>
                    <p className="text-gray-500 md:text-gray-400">Device not performing to manufacturer specifications, including unexpected shutdowns, overheating under normal conditions, and connectivity failures that are not caused by user action or environmental factors.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Power & Battery Issues</p>
                    <p className="text-gray-500 md:text-gray-400">Devices that will not power on, experience rapid battery drain under normal use, or fail to charge properly with the original charger. Battery degradation beyond normal wear is covered within the first 6 months for smartphones.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Software Failures</p>
                    <p className="text-gray-500 md:text-gray-400">Operating system crashes, boot loops, and firmware failures caused by manufacturer software — not by user-installed apps or unauthorized modifications.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What's Not Covered */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">What&apos;s Not Covered</h2>
            <div className="rounded-2xl border border-red/20 bg-red/5 p-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <XCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Physical Damage</p>
                    <p className="text-gray-500 md:text-gray-400">Cracked screens, dents, scratches, water damage, drops, or any physical damage caused by accidents, misuse, or negligence. Consider Safaritech Premium coverage for accidental damage protection.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Unauthorized Repairs</p>
                    <p className="text-gray-500 md:text-gray-400">Devices opened, modified, or repaired by unauthorized service providers. This includes third-party screen replacements, battery swaps, and any internal modifications. Only manufacturer-authorized service centers are covered.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Normal Wear & Tear</p>
                    <p className="text-gray-500 md:text-gray-400">Cosmetic damage, minor scratches, paint chipping, or gradual performance degradation from normal use over time. Batteries naturally degrade with use and are only covered for premature failure within the first 6 months.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Software Issues from Modifications</p>
                    <p className="text-gray-500 md:text-gray-400">Problems caused by unauthorized software, jailbreaking, rooting, or unsupported modifications. Installing custom ROMs, unlocking bootloaders, or sideloading unverified apps may void your warranty.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <XCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Environmental Damage</p>
                    <p className="text-gray-500 md:text-gray-400">Damage caused by extreme temperatures, humidity, dust, insect infestation, or exposure to corrosive substances. Products used outside their specified operating conditions are not covered.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Claim */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">How to Claim Warranty</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              Filing a warranty claim with Safaritech is straightforward. Our dedicated warranty
              support team handles every claim personally, ensuring you receive prompt and fair service.
              Most claims are assessed within 24 hours.
            </p>
            <div className="space-y-6">
              {claimSteps.map((step) => (
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

          {/* Extended Warranty */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Extended Warranty Options</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              Want extra peace of mind? Our Safaritech Care plans extend your coverage beyond the
              standard manufacturer warranty, giving you comprehensive protection for your valuable
              electronics. Add a plan during checkout for instant coverage.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-neon" />
                  <h3 className="text-lg font-semibold text-white">Safaritech Care (6 Months)</h3>
                </div>
                <ul className="space-y-3 text-gray-500 md:text-gray-400 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>6 months extended coverage after manufacturer warranty expires</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Priority support queue — your claim is handled first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>One free screen replacement for smartphones (most models)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Faster repair turnaround — typically 5-7 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>15% discount on accessories purchased during coverage period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Free pickup and delivery for all warranty repairs</span>
                  </li>
                </ul>
                <p className="font-semibold text-neon text-lg">From KSh 1,999</p>
              </div>
              <div className="rounded-2xl border-2 border-neon/30 bg-safarigray p-6 relative">
                <div className="absolute -top-3 right-4 bg-neon text-black text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-neon" />
                  <h3 className="text-lg font-semibold text-white">Safaritech Premium (12 Months)</h3>
                </div>
                <ul className="space-y-3 text-gray-500 md:text-gray-400 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>12 months comprehensive coverage including accidental damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Express repair service — typically 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Two free repairs per year (including accidental damage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Free pickup and delivery with real-time tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>20% discount on accessories purchased during coverage period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Dedicated premium support line with priority handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 flex-shrink-0" />
                    <span>Loaner device provided if repair exceeds 5 business days</span>
                  </li>
                </ul>
                <p className="font-semibold text-neon text-lg">From KSh 3,999</p>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-safariborder bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Need Warranty Support?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6 max-w-lg mx-auto">
            Our warranty team is available Monday to Saturday, 8 AM to 6 PM East African Time.
            Most claims are assessed within 24 hours.
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
