import Link from 'next/link'
import { TrendingUp, Award, Users, Shield, Zap, Headphones } from 'lucide-react'

const stats = [
  { label: 'Happy Customers', value: '50,000+', icon: Users },
  { label: 'Products Sold', value: '100,000+', icon: TrendingUp },
  { label: 'Years Experience', value: '5+', icon: Award },
  { label: 'Warranty Claims', value: '0.1%', icon: Shield },
]

const team = [
  { name: 'John Mwangi', role: 'CEO & Founder', image: 'JM' },
  { name: 'Sarah Kimani', role: 'Head of Operations', image: 'SK' },
  { name: 'David Ochieng', role: 'Head of Technology', image: 'DO' },
  { name: 'Grace Wanjiku', role: 'Head of Marketing', image: 'GW' },
]

const values = [
  { icon: Zap, title: 'Innovation', desc: 'We constantly seek the latest tech to bring you cutting-edge products.' },
  { icon: Shield, title: 'Trust', desc: 'Every product is genuine with full warranty support.' },
  { icon: Headphones, title: 'Service', desc: '24/7 customer support to assist you anytime.' },
  { icon: Award, title: 'Quality', desc: 'Only the best brands and products make it to our shelves.' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-transparent to-electric/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold">
              Empowering Kenya&apos;s
              <span className="bg-gradient-to-r from-electric to-blue bg-clip-text text-transparent"> Tech Future</span>
            </h1>
            <p className="text-xl text-muted">
              We&apos;re on a mission to make premium technology accessible to every Kenyan, 
              with unbeatable prices, genuine products, and world-class service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted">
                <p>
                  Founded in 2019, Safaritech started with a simple vision: to bring the world&apos;s 
                  best technology to Kenya without the premium price tag.
                </p>
                <p>
                  What began as a small online shop has grown into Kenya&apos;s trusted electronics 
                  marketplace, serving over 50,000 customers across the country.
                </p>
                <p>
                  We partner directly with global brands to ensure authentic products with full warranty 
                  coverage, while our local presence means fast delivery and responsive support.
                </p>
                <p>
                  Today, we offer over 1,000 products across smartphones, laptops, audio, wearables, 
                  and more — all backed by our commitment to quality, authenticity, and customer satisfaction.
                </p>
              </div>
            </div>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-electric/20 to-blue/20 flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-electric">2019</p>
                <p className="text-muted mt-2">Founded in Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-electric/10 text-electric text-2xl font-bold">
                  {member.image}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Shop?</h2>
          <p className="mb-8 text-muted max-w-2xl mx-auto">
            Explore our wide range of electronics and experience the Safaritech difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn btn-primary">
              Browse Products
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
