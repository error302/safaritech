import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  shop: [
    { label: 'Smartphones', href: '/shop?category=phones' },
    { label: 'Laptops', href: '/shop?category=laptops' },
    { label: 'Audio', href: '/shop?category=audio' },
    { label: 'Wearables', href: '/shop?category=wearables' },
    { label: 'Tablets', href: '/shop?category=tablets' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Warranty', href: '/warranty' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 md:border-safariborder bg-white md:bg-safarigray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-black mb-4">
              <span className="text-3xl">⚡</span>
              <span className="bg-gradient-to-r from-electric to-blue bg-clip-text text-transparent">
                Safaritech
              </span>
            </Link>
            <p className="text-gray-500 md:text-gray-400 mb-6 max-w-sm">
              Kenya&apos;s premier electronics marketplace. Quality gadgets, unbeatable prices, delivered nationwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg border border-gray-200 md:border-safariborder hover:border-electric transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-gray-200 md:border-safariborder hover:border-electric transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-gray-200 md:border-safariborder hover:border-electric transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-gray-200 md:border-safariborder hover:border-electric transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 md:text-white">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 md:text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 md:text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 md:text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 md:text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 md:text-gray-400 hover:text-neon transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900 md:text-white">Contact</h3>
            <ul className="space-y-3 text-gray-500 md:text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Westlands, Nairobi<br />Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>hello@safaritech.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 md:border-safariborder">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 md:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Safaritech. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
