import { Truck, Clock, MapPin, Shield, Package, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const deliveryZones = [
  {
    zone: 'Zone A — Nairobi Metro',
    areas: 'Nairobi CBD, Westlands, Kilimani, Kileleshwa, Lavington, Yaya, Hurlingham, Upper Hill, Industrial Area, Eastleigh, South B, South C',
    express: '24-48 hours',
    standard: 'Same day (if ordered before 12pm)',
    cost: 'Free above KSh 10,000 / KSh 500 below',
  },
  {
    zone: 'Zone B — Nairobi Suburbs',
    areas: 'Rongai, Kitengela, Thika Road estates, Juja, Ruai, Syokimau, Mavoko, Tigoni, Limuru',
    express: '48-72 hours',
    standard: '2-3 business days',
    cost: 'Free above KSh 15,000 / KSh 700 below',
  },
  {
    zone: 'Zone C — Major Towns',
    areas: 'Mombasa, Kisumu, Nakuru, Eldoret, Nyeri, Nanyuki, Meru, Kakamega, Bungoma, Kericho, Malindi',
    express: '3-5 business days',
    standard: '5-7 business days',
    cost: 'Free above KSh 25,000 / KSh 1,000 - KSh 1,500',
  },
  {
    zone: 'Zone D — Other Towns',
    areas: 'Garissa, Isiolo, Kitale, Voi, Lodwar, Marsabit, Wajir, Mandera and all other towns',
    express: '5-7 business days',
    standard: '7-10 business days',
    cost: 'Free above KSh 30,000 / KSh 1,500 - KSh 2,500',
  },
]

const steps = [
  {
    num: 1,
    title: 'Place Your Order',
    desc: 'Complete your purchase through our secure checkout. Choose your preferred delivery method and provide an accurate delivery address with a reachable phone number.',
  },
  {
    num: 2,
    title: 'Order Processing',
    desc: 'Our team verifies your payment and prepares your items for shipment within 24 hours. You will receive an order confirmation email with your tracking number and expected delivery date.',
  },
  {
    num: 3,
    title: 'Dispatch & Tracking',
    desc: 'Your package is handed to our courier partner. Receive real-time tracking updates via SMS and email. You can also track your order anytime on our website using your order ID.',
  },
  {
    num: 4,
    title: 'Delivery & Verification',
    desc: 'Our courier delivers your package to your doorstep. Please inspect the package for any damage before signing. For high-value orders (above KSh 50,000), have a valid ID ready for verification.',
  },
]

export default function Shipping() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Shipping Information</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Fast, reliable delivery across all 47 counties in Kenya. We partner with trusted courier
            services to ensure your electronics arrive safely and on time. Free shipping is available
            on qualifying orders — see our delivery zones below for details.
          </p>
        </div>

        <div className="space-y-12">
          {/* Delivery Options */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Delivery Options</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Express Delivery</h3>
                </div>
                <ul className="space-y-3 text-gray-500 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>24-48 hour delivery within Nairobi Metro area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Free for orders above KSh 10,000 within Nairobi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>KSh 500 flat fee for orders below KSh 10,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Real-time tracking via SMS and email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Same-day delivery available for orders placed before 12pm (Nairobi only)</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                    <Package className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Standard Delivery</h3>
                </div>
                <ul className="space-y-3 text-gray-500 md:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>3-5 business days to major towns across Kenya</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>5-7 days to remote areas and smaller towns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Shipping cost calculated at checkout based on location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Free for orders above KSh 25,000 nationwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon mt-1"><CheckCircle2 className="h-4 w-4" /></span>
                    <span>Courier depot pickup option available for remote areas</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Delivery Zones */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Delivery Zones & Pricing</h2>
            <p className="text-gray-500 md:text-gray-400 mb-6">
              Our delivery fees and timelines depend on your location. Below is a detailed breakdown
              of our delivery zones, estimated timelines, and associated costs. All prices are in
              Kenyan Shillings and include VAT.
            </p>
            <div className="space-y-4">
              {deliveryZones.map((zone) => (
                <div key={zone.zone} className="rounded-2xl border border-safariborder bg-safarigray p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon/10 text-neon flex-shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{zone.zone}</h3>
                      <p className="text-sm text-gray-500 md:text-gray-400">{zone.areas}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="rounded-lg bg-safaridark p-3">
                      <p className="text-xs text-gray-500 md:text-gray-400 mb-1">Express</p>
                      <p className="font-semibold text-white text-sm">{zone.express}</p>
                    </div>
                    <div className="rounded-lg bg-safaridark p-3">
                      <p className="text-xs text-gray-500 md:text-gray-400 mb-1">Standard</p>
                      <p className="font-semibold text-white text-sm">{zone.standard}</p>
                    </div>
                    <div className="rounded-lg bg-safaridark p-3">
                      <p className="text-xs text-gray-500 md:text-gray-400 mb-1">Cost</p>
                      <p className="font-semibold text-neon text-sm">{zone.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">How Shipping Works</h2>
            <div className="space-y-6">
              {steps.map((step) => (
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

          {/* Courier Partners */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Our Courier Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">G4S Kenya</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">Nairobi metro and major towns — express and same-day delivery</p>
              </div>
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">Fargo Courier</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">Nationwide coverage including remote towns and county headquarters</p>
              </div>
              <div className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white mb-1">Kenya Post</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">Last-mile delivery to the most remote areas across all 47 counties</p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-white">Important Notes</h2>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-6 space-y-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Delivery Times</p>
                  <p className="text-gray-500 md:text-gray-400">Delivery times are estimates and may vary during holidays, peak shopping seasons, or due to unforeseen circumstances such as weather events or civil unrest. We will keep you informed of any significant delays.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Package className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Secure Packaging</p>
                  <p className="text-gray-500 md:text-gray-400">All products are packaged securely using industrial-grade materials to prevent damage during transit. Fragile items receive additional padding and are marked accordingly. Large items such as TVs and monitors may require assembly at your location.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">ID Verification</p>
                  <p className="text-gray-500 md:text-gray-400">Please have a valid Kenyan ID or passport ready when receiving high-value orders (above KSh 50,000). The courier will verify the name on the ID matches the delivery name. This is for your protection against fraud.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-neon flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Inspect Before Signing</p>
                  <p className="text-gray-500 md:text-gray-400">We encourage you to inspect your package for visible damage before signing the delivery receipt. If the package appears damaged, please note this on the receipt and take photos. Contact us within 48 hours to report any issues — we will resolve them promptly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Truck className="h-6 w-6 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">International Shipping</p>
                  <p className="text-gray-500 md:text-gray-400">We currently ship within Kenya only. International shipping to select East African countries (Uganda, Tanzania, Rwanda) is available upon request — contact our support team for a custom quote with delivery timelines and costs.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/track-order"
            className="inline-flex items-center justify-center gap-2 bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg transition-all"
          >
            Track Your Order <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-safariborder text-gray-700 md:text-gray-300 px-6 py-2.5 rounded-lg font-medium transition-all hover:border-neon hover:text-neon"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
