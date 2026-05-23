import Link from 'next/link'
import { TrendingUp, Award, Users, Shield, Zap, Headphones, Heart, Globe, Target, Rocket, Building2, MapPin } from 'lucide-react'

const stats = [
  { label: 'Happy Customers', value: '50,000+', icon: Users },
  { label: 'Products Sold', value: '100,000+', icon: TrendingUp },
  { label: 'Years Experience', value: '5+', icon: Award },
  { label: 'Warranty Claims', value: '0.1%', icon: Shield },
]

const team = [
  { name: 'John Mwangi', role: 'CEO & Founder', image: 'JM', bio: 'Former tech executive with 15 years at Safaricom. Founded Safaritech to bridge the digital divide in Kenya.' },
  { name: 'Sarah Kimani', role: 'Head of Operations', image: 'SK', bio: 'Supply chain expert who previously led logistics at Jumia Kenya. Ensures every order reaches you on time.' },
  { name: 'David Ochieng', role: 'Head of Technology', image: 'DO', bio: 'Full-stack engineer and former Andela team lead. Built our platform from the ground up.' },
  { name: 'Grace Wanjiku', role: 'Head of Marketing', image: 'GW', bio: 'Award-winning marketer with a passion for making technology relatable to every Kenyan household.' },
  { name: 'Peter Omondi', role: 'Customer Experience Lead', image: 'PO', bio: 'Customer success champion dedicated to ensuring every interaction with Safaritech exceeds expectations.' },
  { name: 'Amina Hassan', role: 'Head of Partnerships', image: 'AH', bio: 'Builds and maintains relationships with global brands to bring authentic products to the Kenyan market.' },
  { name: 'Brian Kiprop', role: 'Finance Director', image: 'BK', bio: 'Chartered accountant with deep expertise in fintech and e-commerce financial operations across East Africa.' },
  { name: 'Faith Njeri', role: 'Product Manager', image: 'FN', bio: 'Curates our product catalog, ensuring only the best and most relevant tech reaches our shelves.' },
]

const values = [
  { icon: Zap, title: 'Innovation', desc: 'We constantly seek the latest tech to bring you cutting-edge products. Our team scouts global markets to identify emerging technologies that can transform how Kenyans live, work, and play.' },
  { icon: Shield, title: 'Trust', desc: 'Every product is genuine with full warranty support. We source exclusively from authorized distributors and manufacturers, so you never have to worry about counterfeits or grey-market goods.' },
  { icon: Headphones, title: 'Service', desc: '24/7 customer support to assist you anytime. Whether it is a question about a product, a delivery update, or a warranty claim, our dedicated team is always ready to help.' },
  { icon: Award, title: 'Quality', desc: 'Only the best brands and products make it to our shelves. Every item in our catalog undergoes rigorous vetting to ensure it meets the standards Kenyans deserve.' },
  { icon: Heart, title: 'Community', desc: 'We are deeply rooted in the Kenyan community. A portion of every sale goes toward digital literacy programs in underserved areas, helping bridge the technology gap.' },
  { icon: Globe, title: 'Accessibility', desc: 'Premium technology should not be a luxury. We work hard to negotiate the best prices and offer flexible payment options, including M-Pesa instalments, so more Kenyans can access the tech they need.' },
]

const milestones = [
  { year: '2019', title: 'Founded in Nairobi', desc: 'Safaritech was born in a small Westlands office with a team of 5 and a dream to make tech accessible.' },
  { year: '2020', title: 'M-Pesa Integration', desc: 'Became one of the first electronics stores to offer seamless M-Pesa checkout, tripling our customer base.' },
  { year: '2021', title: 'Nationwide Delivery', desc: 'Expanded delivery to all 47 counties, ensuring every Kenyan can receive their tech regardless of location.' },
  { year: '2022', title: '50,000 Customers', desc: 'Reached the milestone of 50,000 happy customers with a 98% satisfaction rating.' },
  { year: '2023', title: 'Brand Partnerships', desc: 'Signed direct partnerships with Samsung, Apple, HP, Sony, and 20+ other global brands.' },
  { year: '2024', title: 'Safaritech Care', desc: 'Launched our extended warranty program, giving customers peace of mind beyond manufacturer coverage.' },
]

export default function About() {
  return (
    <div className="bg-safaridark min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-transparent to-electric/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold font-display text-white">
              Empowering Kenya&apos;s
              <span className="bg-gradient-to-r from-neon to-blue bg-clip-text text-transparent"> Tech Future</span>
            </h1>
            <p className="text-xl text-gray-500 md:text-gray-400 mb-6">
              We&apos;re on a mission to make premium technology accessible to every Kenyan,
              with unbeatable prices, genuine products, and world-class service.
            </p>
            <p className="text-gray-500 md:text-gray-400">
              From smartphones to laptops, audio gear to wearables, Safaritech is Kenya&apos;s most trusted
              online electronics marketplace — serving over 50,000 customers across all 47 counties with
              authentic products, fast delivery, and support that truly cares.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold font-display text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 md:text-gray-400">{stat.label}</p>
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
              <h2 className="mb-6 text-3xl font-bold font-display text-white">Our Story</h2>
              <div className="space-y-4 text-gray-500 md:text-gray-400">
                <p>
                  Founded in 2019, Safaritech started with a simple vision: to bring the world&apos;s
                  best technology to Kenya without the premium price tag. Our founder, John Mwangi,
                  experienced firsthand the frustration of limited access to genuine electronics — overpriced
                  products, counterfeit goods flooding the market, and unreliable online stores that
                  offered no warranty or after-sales support.
                </p>
                <p>
                  What began as a small online shop operating out of a Westlands office has grown into
                  Kenya&apos;s trusted electronics marketplace, serving over 50,000 customers across
                  all 47 counties. Our early days were defined by long hours, hand-delivered packages,
                  and a relentless focus on earning each customer&apos;s trust.
                </p>
                <p>
                  We partner directly with global brands — Samsung, Apple, HP, Sony, and dozens more —
                  to ensure authentic products with full warranty coverage. Our local presence means
                  fast delivery and responsive support that understands the unique needs of the Kenyan
                  market. We were one of the first electronics platforms to integrate M-Pesa for seamless
                  checkout, removing a major barrier to online shopping.
                </p>
                <p>
                  Today, we offer over 1,000 products across smartphones, laptops, audio, wearables,
                  and more — all backed by our commitment to quality, authenticity, and customer satisfaction.
                  Every product is vetted, every order is tracked, and every customer is treated like family.
                  That is the Safaritech promise.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-neon/20 to-blue/20 p-8 flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="text-7xl font-bold text-neon">2019</p>
                <p className="text-gray-500 md:text-gray-400 mt-2 text-lg">Founded in Nairobi</p>
                <div className="mt-6 flex items-center justify-center gap-2 text-neon">
                  <Rocket className="h-5 w-5" />
                  <span className="font-semibold">Tech That Moves Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 border-t border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon/10 text-neon">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Our Mission</h3>
              <p className="text-gray-500 md:text-gray-400 leading-relaxed">
                To democratize access to premium technology across Kenya by offering genuine products
                at fair prices, supported by reliable delivery and exceptional customer service. We
                believe every Kenyan deserves access to the tools that power modern life — whether
                it&apos;s a student needing a laptop for their studies, an entrepreneur setting up their
                first office, or a family staying connected through smartphones.
              </p>
            </div>
            <div className="rounded-2xl border border-safariborder bg-safarigray p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon/10 text-neon">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">Our Vision</h3>
              <p className="text-gray-500 md:text-gray-400 leading-relaxed">
                To become East Africa&apos;s leading technology marketplace — a platform where innovation
                meets accessibility, and where every interaction reinforces trust. We envision a future
                where geography and income no longer determine one&apos;s access to quality technology,
                and where Safaritech is the bridge between global innovation and local aspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 border-t border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold font-display text-white">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <p className="text-2xl font-bold text-neon font-display mb-2">{milestone.year}</p>
                <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-t border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold font-display text-white">Our Values</h2>
          <p className="mb-12 text-center text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            These core principles guide every decision we make — from the products we stock to the
            way we handle customer inquiries. They are the foundation of the Safaritech experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-safariborder bg-safarigray p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neon/10 text-neon">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 border-t border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold font-display text-white">Meet Our Team</h2>
          <p className="mb-12 text-center text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Behind Safaritech is a passionate team of professionals dedicated to making technology
            accessible to every Kenyan. Together, we bring decades of experience in e-commerce,
            technology, logistics, and customer care.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-safariborder bg-safarigray p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neon/10 text-neon text-2xl font-bold">
                  {member.image}
                </div>
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-neon mb-3">{member.role}</p>
                <p className="text-xs text-gray-500 md:text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-safariborder">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4 text-3xl font-bold font-display text-white">Ready to Shop?</h2>
          <p className="mb-8 text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of electronics and experience the Safaritech difference.
            Every purchase is backed by our authenticity guarantee, fast delivery, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all">
              Browse Products
            </Link>
            <Link href="/contact" className="border border-safariborder text-gray-700 md:text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:border-neon hover:text-neon">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
