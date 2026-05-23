import { Newspaper, Mic2, Download, Camera, Building2, Mail, Phone, ExternalLink, Calendar, Quote, Globe } from 'lucide-react'
import Link from 'next/link'

const pressReleases = [
  {
    date: 'January 15, 2026',
    title: 'Safaritech Reaches 50,000 Customers Milestone',
    excerpt: 'Kenya\'s leading online electronics marketplace celebrates serving 50,000 customers across all 47 counties, with a 98% satisfaction rating and plans to expand into East Africa.',
  },
  {
    date: 'November 20, 2025',
    title: 'Safaritech Launches Extended Warranty Program — Safaritech Care',
    excerpt: 'New extended warranty plans offer customers up to 18 months of comprehensive coverage, including accidental damage protection and priority repair service for smartphones, laptops, and more.',
  },
  {
    date: 'September 5, 2025',
    title: 'Safaritech Signs Direct Partnership with Samsung East Africa',
    excerpt: 'Exclusive direct distribution agreement ensures Kenyan consumers get genuine Samsung products at competitive prices with full manufacturer warranty coverage.',
  },
  {
    date: 'June 12, 2025',
    title: 'Safaritech Introduces M-Pesa Instalment Payments',
    excerpt: 'Customers can now split payments for orders above KSh 10,000 into 2-3 monthly instalments via M-Pesa, making premium technology more accessible to Kenyans.',
  },
  {
    date: 'March 1, 2025',
    title: 'Safaritech Expands Nationwide Delivery to All 47 Counties',
    excerpt: 'Partnership with G4S, Fargo Courier, and Kenya Post enables delivery to every corner of Kenya, including previously underserved remote areas.',
  },
]

const mediaMentions = [
  {
    outlet: 'TechWeez',
    date: 'February 2026',
    title: 'How Safaritech is Disrupting Kenya\'s Electronics Retail Market',
    quote: 'Safaritech has emerged as a serious contender in Kenya\'s e-commerce space, combining authentic products with delivery speeds that rival the best in the region.',
  },
  {
    outlet: 'Business Daily Africa',
    date: 'December 2025',
    title: 'Kenya\'s Online Electronics Market Hits KSh 50 Billion',
    quote: 'Platforms like Safaritech are driving growth in the sector by addressing trust issues that have long plagued online electronics shopping in Kenya.',
  },
  {
    outlet: 'Nation Africa',
    date: 'October 2025',
    title: 'M-Pesa Integration Drives E-Commerce Growth',
    quote: 'Safaritech\'s seamless M-Pesa checkout experience has become a benchmark for online retailers in East Africa, processing thousands of transactions daily.',
  },
  {
    outlet: 'The Star Kenya',
    date: 'July 2025',
    title: 'Extended Warranty Programs Gain Traction in Kenya',
    quote: 'Safaritech Care and Premium plans are changing how Kenyans protect their tech investments, offering coverage that was previously only available through importers.',
  },
]

const factSheet = [
  { label: 'Company', value: 'Safaritech Limited' },
  { label: 'Founded', value: '2019, Nairobi, Kenya' },
  { label: 'Tagline', value: 'Tech That Moves Kenya' },
  { label: 'CEO & Founder', value: 'John Mwangi' },
  { label: 'Headquarters', value: 'Westlands, Nairobi, Kenya' },
  { label: 'Customers Served', value: '50,000+' },
  { label: 'Products', value: '1,000+ SKUs across electronics categories' },
  { label: 'Brand Partners', value: 'Samsung, Apple, HP, Sony, and 20+ others' },
  { label: 'Delivery Coverage', value: 'All 47 counties in Kenya' },
  { label: 'Payment Methods', value: 'M-Pesa, Visa/MasterCard, PayPal, COD' },
  { label: 'Customer Satisfaction', value: '98% rating based on post-purchase surveys' },
  { label: 'Employees', value: '60+ across technology, operations, and support' },
]

export default function PressPage() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Newspaper className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Press & Media</h1>
          <p className="text-gray-500 md:text-gray-400 max-w-2xl mx-auto">
            Welcome to the Safaritech press room. Here you will find the latest news, company facts,
            and media resources for journalists, bloggers, and content creators. For interview requests
            and press inquiries, please contact our media team.
          </p>
        </div>

        <div className="space-y-8">
          {/* About Safaritech */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">About Safaritech</h2>
            </div>
            <div className="space-y-4 text-gray-500 md:text-gray-400 leading-relaxed">
              <p>
                Safaritech is Kenya&apos;s premier online electronics marketplace, offering a curated
                selection of smartphones, laptops, tablets, audio equipment, gaming gear, wearables,
                and accessories from the world&apos;s leading technology brands. Founded in 2019 in Nairobi,
                Safaritech was born from the belief that every Kenyan deserves access to genuine,
                high-quality technology at fair prices.
              </p>
              <p>
                What sets Safaritech apart is our unwavering commitment to authenticity. We source
                exclusively from manufacturers and authorized distributors, eliminating the risk of
                counterfeit products that has long plagued the Kenyan electronics market. Every product
                comes with a genuine manufacturer warranty, and our extended Safaritech Care and Premium
                plans offer additional peace of mind.
              </p>
              <p>
                With seamless M-Pesa integration, nationwide delivery to all 47 counties, and a
                dedicated customer support team available via WhatsApp, email, and phone, Safaritech
                has earned the trust of over 50,000 customers. Our 98% satisfaction rating reflects
                our commitment to making every interaction — from browsing to delivery — an exceptional
                experience. As we look to the future, we are expanding our product range, exploring
                East African markets, and investing in technology that makes shopping for electronics
                in Kenya easier and more accessible than ever.
              </p>
            </div>
          </section>

          {/* Company Fact Sheet */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-6 text-2xl font-semibold text-white">Company Fact Sheet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factSheet.map((item) => (
                <div key={item.label} className="rounded-xl bg-safaridark border border-safariborder p-4">
                  <p className="text-sm text-gray-500 md:text-gray-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Press Releases */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Newspaper className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Press Releases</h2>
            </div>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="rounded-xl bg-safaridark border border-safariborder p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-neon" />
                    <span className="text-sm text-neon font-medium">{release.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{release.title}</h3>
                  <p className="text-gray-500 md:text-gray-400 text-sm leading-relaxed">{release.excerpt}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Media Mentions */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Mic2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">In the Media</h2>
            </div>
            <div className="space-y-6">
              {mediaMentions.map((mention, index) => (
                <div key={index} className="rounded-xl bg-safaridark border border-safariborder p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-neon">{mention.outlet}</span>
                    <span className="text-sm text-gray-500 md:text-gray-400">{mention.date}</span>
                  </div>
                  <h3 className="text-white font-medium mb-3">{mention.title}</h3>
                  <div className="border-l-2 border-neon/30 pl-4">
                    <p className="text-gray-500 md:text-gray-400 text-sm italic leading-relaxed">
                      <Quote className="h-4 w-4 text-neon/50 inline mr-1" />
                      {mention.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Brand Assets */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Camera className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Brand Assets & Media Kit</h2>
            </div>
            <p className="text-gray-500 md:text-gray-400 mb-6 leading-relaxed">
              Our media kit includes high-resolution logos, brand guidelines, product imagery, executive
              headshots, and other resources for press and media use. All assets are provided under a
              limited license for editorial and news reporting purposes only. Commercial use requires
              written permission from our team.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-safaridark border border-safariborder p-5 text-center">
                <Download className="h-8 w-8 text-neon mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Logo Pack</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">SVG, PNG, and EPS formats in multiple color variations</p>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5 text-center">
                <Download className="h-8 w-8 text-neon mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Brand Guidelines</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">Color palette, typography, and usage guidelines</p>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5 text-center">
                <Download className="h-8 w-8 text-neon mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Product Imagery</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">High-resolution product photos and lifestyle images</p>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5 text-center">
                <Download className="h-8 w-8 text-neon mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">Executive Headshots</h3>
                <p className="text-sm text-gray-500 md:text-gray-400">Professional headshots of our leadership team</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 md:text-gray-400">
              For access to our full media kit or custom image requests, please contact our press team
              at <a href="mailto:press@safaritech.co.ke" className="text-neon hover:underline">press@safaritech.co.ke</a>.
            </p>
          </section>

          {/* Media Contact */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Mic2 className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Media Contact</h2>
            </div>
            <p className="text-gray-500 md:text-gray-400 mb-6 leading-relaxed">
              For press inquiries, interview requests, expert commentary on the Kenyan tech market,
              or collaboration proposals, please reach out to our communications team. We typically
              respond to media inquiries within one business day.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-safaridark border border-safariborder p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-neon" />
                  <h3 className="font-semibold text-white">Press Email</h3>
                </div>
                <a href="mailto:press@safaritech.co.ke" className="text-neon hover:underline text-sm">
                  press@safaritech.co.ke
                </a>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-neon" />
                  <h3 className="font-semibold text-white">Press Phone</h3>
                </div>
                <p className="text-sm text-gray-500 md:text-gray-400">+254 700 000 000</p>
                <p className="text-xs text-gray-500 md:text-gray-400">Mon-Fri, 9am-5pm EAT</p>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-neon" />
                  <h3 className="font-semibold text-white">General Inquiries</h3>
                </div>
                <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline text-sm">
                  hello@safaritech.co.ke
                </a>
              </div>
              <div className="rounded-xl bg-safaridark border border-safariborder p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-neon" />
                  <h3 className="font-semibold text-white">Office</h3>
                </div>
                <p className="text-sm text-gray-500 md:text-gray-400">Westlands Business Centre</p>
                <p className="text-xs text-gray-500 md:text-gray-400">Waiyaki Way, Nairobi, Kenya</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
