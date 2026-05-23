import { MapPin, Clock, Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const storeLocations = [
  {
    name: 'Safaritech Westlands — Flagship Store',
    address: 'Westlands Business Centre, Waiyaki Way',
    city: 'Nairobi',
    phone: '+254 700 000 001',
    hours: 'Mon–Sat: 8am–8pm | Sun: Closed',
    type: 'Flagship',
    services: ['Product demos', 'Walk-in support', 'Warranty claims', 'M-Pesa payments', 'Same-day pickup'],
  },
  {
    name: 'Safaritech CBD',
    address: 'Moi Avenue, Pioneer House, Ground Floor',
    city: 'Nairobi',
    phone: '+254 700 000 002',
    hours: 'Mon–Sat: 8am–6pm | Sun: Closed',
    type: 'Express',
    services: ['Product pickup', 'Walk-in support', 'M-Pesa payments'],
  },
  {
    name: 'Safaritech Mombasa Road',
    address: 'Nextgen Mall, Mombasa Road',
    city: 'Nairobi',
    phone: '+254 700 000 003',
    hours: 'Mon–Sat: 9am–6pm | Sun: Closed',
    type: 'Standard',
    services: ['Product pickup', 'Walk-in support', 'M-Pesa payments'],
  },
  {
    name: 'Safaritech Mombasa',
    address: 'City Mall, Nyali',
    city: 'Mombasa',
    phone: '+254 700 000 004',
    hours: 'Mon–Sat: 9am–6pm | Sun: 10am–4pm',
    type: 'Standard',
    services: ['Product pickup', 'Warranty claims', 'M-Pesa payments'],
  },
  {
    name: 'Safaritech Kisumu',
    address: 'Mega Plaza, Oginga Odinga Street',
    city: 'Kisumu',
    phone: '+254 700 000 005',
    hours: 'Mon–Sat: 9am–6pm | Sun: Closed',
    type: 'Standard',
    services: ['Product pickup', 'Walk-in support'],
  },
  {
    name: 'Safaritech Nakuru',
    address: 'Westside Mall, Kenyatta Avenue',
    city: 'Nakuru',
    phone: '+254 700 000 006',
    hours: 'Mon–Sat: 9am–6pm | Sun: Closed',
    type: 'Pickup Point',
    services: ['Product pickup', 'Order collection'],
  },
]

export default function StoresPage() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <MapPin className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Our Stores</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Visit any of our locations for hands-on product demos, order pickups, warranty claims,
            and face-to-face support. We are expanding across Kenya — more locations coming soon.
          </p>
        </div>

        {/* Store Type Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/10 text-neon text-sm font-medium border border-neon/20">
            Flagship
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
            Express
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
            Standard
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20">
            Pickup Point
          </div>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storeLocations.map((store) => {
            const typeColorMap: Record<string, string> = {
              Flagship: 'bg-neon/10 text-neon border-neon/20',
              Express: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              Standard: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              'Pickup Point': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            }
            const typeColor = typeColorMap[store.type] || typeColorMap.Standard

            return (
              <div key={store.name} className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{store.name}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeColor}`}>
                      {store.type}
                    </span>
                  </div>
                  <MapPin className="h-5 w-5 text-neon shrink-0" />
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">{store.address}</p>
                      <p className="text-sm text-gray-500">{store.city}, Kenya</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500 shrink-0" />
                    <p className="text-sm text-gray-400">{store.hours}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-sm text-neon hover:underline">{store.phone}</a>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {store.services.map((service) => (
                      <span key={service} className="px-2.5 py-1 rounded-lg bg-safaridark text-xs text-gray-300 border border-safariborder">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Online Store Note */}
        <div className="mt-12 rounded-2xl border border-safariborder bg-safarigray p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-white">Not Near a Store?</h3>
          <p className="text-gray-500 md:text-gray-400 mb-6 max-w-lg mx-auto">
            Shop online with free delivery on orders above KSh 10,000 (Nairobi) or KSh 25,000 (nationwide).
            We deliver to all 47 counties in Kenya within 3–7 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-neon hover:bg-neon-dim text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
            >
              Shop Online
            </Link>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-safariborder text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
