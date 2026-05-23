import { Cookie, Shield, Settings, BarChart3, Megaphone, Lock, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

const cookieTypes = [
  {
    icon: Lock,
    category: 'Essential Cookies',
    status: 'Always Active',
    statusColor: 'text-green',
    description: 'These cookies are strictly necessary for the website to function properly. They enable core functionality such as shopping cart management, user authentication, and secure checkout. You cannot opt out of these cookies as the website cannot function without them.',
    examples: [
      { name: 'next-auth.session-token', purpose: 'Maintains your logged-in session across page reloads', duration: '24 hours or until logout' },
      { name: 'cart_session', purpose: 'Preserves items in your shopping cart between visits', duration: '30 days' },
      { name: 'csrf_token', purpose: 'Protects against Cross-Site Request Forgery attacks', duration: 'Session' },
      { name: 'checkout_state', purpose: 'Maintains progress through the multi-step checkout process', duration: 'Session' },
    ],
  },
  {
    icon: Settings,
    category: 'Functional Cookies',
    status: 'Optional',
    statusColor: 'text-amber-400',
    description: 'These cookies enable enhanced functionality and personalization. They remember your preferences and choices (such as language, region, and display settings) to provide a more tailored shopping experience. Disabling these cookies may result in a less personalized experience, but the website will still function.',
    examples: [
      { name: 'preferred_language', purpose: 'Remembers your selected language preference', duration: '1 year' },
      { name: 'region_settings', purpose: 'Stores your delivery region for accurate pricing and availability', duration: '1 year' },
      { name: 'recently_viewed', purpose: 'Tracks recently viewed products for quick access', duration: '30 days' },
      { name: 'theme_preference', purpose: 'Remembers your light/dark mode preference', duration: '1 year' },
    ],
  },
  {
    icon: BarChart3,
    category: 'Analytics Cookies',
    status: 'Optional',
    statusColor: 'text-amber-400',
    description: 'These cookies collect anonymous statistical data about how visitors use our website. They help us understand which pages are most popular, how users navigate the site, and where we can make improvements. All data collected is aggregated and anonymized — we cannot identify individual users from analytics data.',
    examples: [
      { name: '_ga', purpose: 'Google Analytics — distinguishes unique visitors', duration: '2 years' },
      { name: '_ga_*', purpose: 'Google Analytics — maintains session state', duration: '2 years' },
      { name: 'page_view_count', purpose: 'Counts page views to identify popular content', duration: '30 minutes' },
      { name: 'session_duration', purpose: 'Measures time spent on the website per visit', duration: 'Session' },
    ],
  },
  {
    icon: Megaphone,
    category: 'Marketing Cookies',
    status: 'Optional',
    statusColor: 'text-amber-400',
    description: 'These cookies are used to deliver personalized advertisements and track the effectiveness of our marketing campaigns. They may be set by us or by our advertising partners through our website. They build a profile of your interests to show you relevant ads on other websites. These cookies are only placed with your explicit consent.',
    examples: [
      { name: '_fbp', purpose: 'Facebook Pixel — tracks conversions for Facebook ad campaigns', duration: '3 months' },
      { name: '_gcl_au', purpose: 'Google Ads — measures conversion rates for Google Ads', duration: '3 months' },
      { name: 'ad_targeting', purpose: 'Stores preferences for personalized ad delivery', duration: '1 year' },
      { name: 'campaign_source', purpose: 'Tracks which marketing campaign brought you to our site', duration: '30 days' },
    ],
  },
]

export default function CookiePolicy() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Cookie className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Cookie Policy</h1>
          <p className="text-gray-500 md:text-gray-400">Last Updated: March 4, 2026</p>
        </div>

        <div className="space-y-6 text-gray-500 md:text-gray-400">
          {/* Introduction */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">What Are Cookies?</h2>
            <p className="mb-4 leading-relaxed">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile
              phone) when you visit a website. They are widely used to make websites work more
              efficiently, provide a better browsing experience, and supply information to the site
              owners. Cookies can be &quot;persistent&quot; (stored until they expire or you delete them) or
              &quot;session&quot; (deleted when you close your browser).
            </p>
            <p className="leading-relaxed">
              At Safaritech, we use cookies and similar tracking technologies (such as web beacons,
              pixel tags, and local storage) to operate our online store, protect your account,
              personalize your shopping experience, analyze website traffic, and deliver relevant
              marketing content. This policy explains each type of cookie we use, what it does,
              and how you can manage your preferences.
            </p>
          </section>

          {/* Why We Use Cookies */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Why We Use Cookies</h2>
            <p className="mb-4 leading-relaxed">
              We use cookies for several important reasons that are essential to providing you with
              a safe, functional, and enjoyable shopping experience on Safaritech:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Security:</strong> To verify your identity, protect your account from unauthorized access, and prevent fraud during the checkout process</li>
              <li><strong className="text-white">Functionality:</strong> To keep items in your shopping cart, remember your place in the checkout process, and maintain your logged-in session across pages</li>
              <li><strong className="text-white">Personalization:</strong> To remember your language, region, and display preferences so you do not have to set them every time you visit</li>
              <li><strong className="text-white">Performance:</strong> To analyze how visitors interact with our website so we can identify and fix issues, improve page load times, and optimize the user experience</li>
              <li><strong className="text-white">Marketing:</strong> To measure the effectiveness of our advertising campaigns and show you products and offers that are relevant to your interests</li>
            </ul>
          </section>

          {/* Detailed Cookie Types */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-6 text-2xl font-semibold text-white">Types of Cookies We Use</h2>
            <p className="mb-6 leading-relaxed">
              Below is a detailed breakdown of every category of cookie used on Safaritech, along
              with specific examples, their purposes, and how long they remain on your device.
            </p>
            <div className="space-y-8">
              {cookieTypes.map((type) => (
                <div key={type.category} className="rounded-xl border border-safariborder bg-safaridark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{type.category}</h3>
                      <span className={`text-xs font-medium ${type.statusColor}`}>
                        {type.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 md:text-gray-400 mb-4 text-sm leading-relaxed">{type.description}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-safariborder">
                          <th className="text-left py-2 pr-4 text-white font-medium">Cookie Name</th>
                          <th className="text-left py-2 pr-4 text-white font-medium">Purpose</th>
                          <th className="text-left py-2 text-white font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.examples.map((example) => (
                          <tr key={example.name} className="border-b border-safariborder/50">
                            <td className="py-2 pr-4"><code className="text-neon text-xs">{example.name}</code></td>
                            <td className="py-2 pr-4">{example.purpose}</td>
                            <td className="py-2 text-xs">{example.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Third-Party Cookies</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              Some cookies on our website are placed by third-party services that we use to operate
              and improve our platform. These third parties have their own privacy policies governing
              their use of cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong className="text-white">Safaricom (M-Pesa):</strong> Places cookies during the M-Pesa checkout flow to process payments securely. These cookies are essential and cannot be disabled.</li>
              <li><strong className="text-white">Stripe:</strong> Our card payment processor may place cookies for fraud detection and payment security during checkout.</li>
              <li><strong className="text-white">PayPal:</strong> Places cookies during the PayPal checkout process for authentication and payment processing.</li>
              <li><strong className="text-white">Google Analytics:</strong> Places cookies to collect anonymous usage statistics. Data is aggregated and we cannot identify individual users.</li>
              <li><strong className="text-white">Facebook (Meta Pixel):</strong> Places cookies for conversion tracking and ad optimization. Only activated with your marketing consent.</li>
              <li><strong className="text-white">Google Ads:</strong> Places cookies to measure the effectiveness of our Google advertising campaigns. Only activated with your marketing consent.</li>
            </ul>
            <p className="leading-relaxed">
              We carefully vet all third-party services to ensure they meet our security and privacy
              standards. We do not allow third parties to use cookies on our site for purposes other
              than those we have specifically authorized.
            </p>
          </section>

          {/* Managing Cookies */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Settings className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Managing Your Cookie Preferences</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              You have the right to decide whether to accept or reject cookies. Here are the different
              ways you can manage your cookie preferences:
            </p>
            <div className="space-y-4 mb-4">
              <div className="rounded-lg bg-safaridark p-4 border border-safariborder">
                <h3 className="font-semibold text-white mb-2">Cookie Consent Banner</h3>
                <p className="text-sm">When you first visit our website, a cookie consent banner allows you to accept or customize your cookie preferences. You can choose to accept all cookies, reject optional cookies, or selectively enable specific categories.</p>
              </div>
              <div className="rounded-lg bg-safaridark p-4 border border-safariborder">
                <h3 className="font-semibold text-white mb-2">Browser Settings</h3>
                <p className="text-sm">Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all cookies, accept only certain cookies, or notify you when a cookie is being set. Visit your browser&apos;s help page for specific instructions:</p>
                <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                  <li>Chrome: Settings &gt; Privacy and Security &gt; Cookies</li>
                  <li>Firefox: Settings &gt; Privacy & Security &gt; Cookies</li>
                  <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
                  <li>Edge: Settings &gt; Cookies and Site Permissions</li>
                </ul>
              </div>
              <div className="rounded-lg bg-safaridark p-4 border border-safariborder">
                <h3 className="font-semibold text-white mb-2">Opt-Out Links</h3>
                <p className="text-sm">You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on. For Facebook Pixel, use the Facebook Ad Preferences page. For Google Ads, visit Google Ads Settings.</p>
              </div>
            </div>
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4">
              <p className="text-sm text-amber-200">
                <strong>Important:</strong> Disabling essential cookies will prevent critical features
                like checkout, sign-in, and cart functionality from working correctly. We recommend
                keeping essential cookies enabled at all times for the best shopping experience.
              </p>
            </div>
          </section>

          {/* What Happens When You Disable Cookies */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">What Happens When You Disable Cookies</h2>
            <p className="mb-4 leading-relaxed">
              While we respect your right to manage cookies, please be aware that disabling certain
              types of cookies may affect your experience on our website:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Disabling Essential Cookies:</strong> You will not be able to log in, add items to your cart, complete a purchase, or access your account. The website will be largely non-functional for shopping purposes.</li>
              <li><strong className="text-white">Disabling Functional Cookies:</strong> The website will still work, but you will need to re-enter your preferences (language, region, etc.) each time you visit. Product recommendations will be less relevant.</li>
              <li><strong className="text-white">Disabling Analytics Cookies:</strong> This will not affect your experience at all — analytics cookies only help us improve the website behind the scenes. We will simply have less data to inform our improvements.</li>
              <li><strong className="text-white">Disabling Marketing Cookies:</strong> You will still see advertisements, but they will be less relevant to your interests. You may see more generic ads rather than products you might actually be interested in.</li>
            </ul>
          </section>

          {/* Changes to This Policy */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Changes to This Cookie Policy</h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in the cookies we
              use, changes in technology, or for other operational, legal, or regulatory reasons. When
              we make material changes, we will update the &quot;Last Updated&quot; date at the top of this page
              and, for significant changes, display a new cookie consent banner so you can review and
              update your preferences. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              If you have questions about our use of cookies, want to exercise your right to withdraw
              consent, or need help managing your cookie preferences, please contact us:
            </p>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:privacy@safaritech.co.ke" className="text-neon hover:underline">privacy@safaritech.co.ke</a></li>
              <li>General inquiries: <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">hello@safaritech.co.ke</a></li>
              <li>WhatsApp: <a href="https://wa.me/254700000000" className="text-neon hover:underline">+254 700 000 000</a></li>
            </ul>
            <p className="mt-4">
              For more on how we handle personal data, see our{' '}
              <Link href="/privacy" className="text-neon hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
