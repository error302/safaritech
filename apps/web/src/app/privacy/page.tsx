import { Shield, Lock, Eye, Database, Bell, UserCheck, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Privacy Policy</h1>
          <p className="text-gray-500 md:text-gray-400">Last Updated: March 4, 2026</p>
        </div>

        <div className="space-y-6 text-gray-500 md:text-gray-400">
          {/* Introduction */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Introduction</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              Safaritech (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy and personal
              data. This Privacy Policy explains how we collect, use, disclose, and protect your personal
              information when you use our website (safaritech.co.ke), mobile applications, and related
              services (collectively, the &quot;Services&quot;). We are committed to complying with the Kenya Data
              Protection Act, 2019, and international best practices for data privacy.
            </p>
            <p className="leading-relaxed">
              By using our Services, you agree to the collection and use of information in accordance
              with this Privacy Policy. If you do not agree with the terms of this policy, please
              discontinue use of our Services. We encourage you to read this policy carefully and
              contact us if you have any questions about our data practices.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
            </div>

            <h3 className="mb-3 text-lg font-semibold text-white">Personal Information</h3>
            <p className="mb-4">When you register, place an order, or contact us, we may collect the following personal data:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Full name and contact details (email address, phone number, physical address)</li>
              <li>Payment information (processed securely through M-Pesa, Stripe, and PayPal — we never store complete card details on our servers)</li>
              <li>Account credentials (encrypted password), profile preferences, and communication history</li>
              <li>Identification documents (for high-value orders above KSh 50,000, as required by Kenyan law)</li>
              <li>Communication records with our support team, including chat transcripts and email correspondence</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-white">Usage Information</h3>
            <p className="mb-4">We automatically collect certain technical and usage data when you interact with our Services:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Device information (browser type and version, operating system, screen resolution, device identifiers)</li>
              <li>Usage data (pages visited, time spent on each page, features used, click patterns)</li>
              <li>Location information (approximate location based on IP address, for delivery estimation and regional services)</li>
              <li>Cookies, web beacons, and similar tracking technologies (see our Cookie Policy for details)</li>
              <li>Referral source (how you found our website, search terms used)</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-white">Order Information</h3>
            <p className="mb-4">When you make a purchase, we collect transaction-related data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Product purchases, quantities, and complete order history</li>
              <li>Delivery addresses and saved address preferences</li>
              <li>Payment history, transaction amounts, and payment method details</li>
              <li>Warranty registration information and service records</li>
              <li>Return and refund history</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">How We Use Your Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">To Process Orders & Deliver Products</h3>
                <ul className="list-disc pl-6">
                  <li>Process payments securely and fulfill your orders</li>
                  <li>Arrange shipping, coordinate delivery with courier partners, and provide tracking information</li>
                  <li>Send order confirmations, shipping updates, and delivery notifications via SMS and email</li>
                  <li>Handle returns, exchanges, and warranty claims efficiently</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">To Improve Our Services</h3>
                <ul className="list-disc pl-6">
                  <li>Analyze usage patterns and shopping preferences to optimize our platform</li>
                  <li>Personalize your shopping experience with relevant product recommendations</li>
                  <li>Develop new features, products, and services based on customer needs</li>
                  <li>Conduct research and analytics to understand market trends and improve offerings</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">To Communicate With You</h3>
                <ul className="list-disc pl-6">
                  <li>Send order confirmations, delivery updates, and transactional notifications</li>
                  <li>Respond to inquiries, support requests, and feedback</li>
                  <li>Send promotional offers, newsletters, and product announcements (with your explicit consent)</li>
                  <li>Notify you about changes to our services, policies, or terms</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">For Security & Compliance</h3>
                <ul className="list-disc pl-6">
                  <li>Prevent fraud, unauthorized transactions, and protect against security threats</li>
                  <li>Verify identity for high-value orders as required by Kenyan anti-money laundering regulations</li>
                  <li>Comply with legal obligations, court orders, and regulatory requirements</li>
                  <li>Enforce our terms of service and protect our legal rights and the safety of our users</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Information Sharing</h2>
            <p className="mb-4 leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for their
              marketing purposes. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Service Providers:</strong> We share data with trusted partners who help us operate our business — payment processors (M-Pesa/Safaricom, Stripe, PayPal), delivery companies (G4S, Fargo Courier), and IT service providers. These partners are contractually bound to protect your data and use it only for the specified purpose.</li>
              <li><strong className="text-white">Legal Compliance:</strong> We may disclose information to law enforcement authorities, regulators, or other government entities when required by Kenyan law, court order, or to protect our legal rights, safety, or the safety of our users.</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred to the acquiring entity, subject to the same privacy protections.</li>
              <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share your information with a specific third party for a stated purpose.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Data Security</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              We implement robust, industry-standard security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Encryption of all sensitive data during transmission using HTTPS/TLS 1.3 protocols</li>
              <li>Secure payment processing through PCI DSS Level 1 compliant gateways (Stripe, PayPal)</li>
              <li>Regular security audits, penetration testing, and vulnerability assessments by independent firms</li>
              <li>Strict access controls and multi-factor authentication for all internal systems</li>
              <li>Secure data storage with AES-256 encryption at rest in ISO 27001 certified data centers</li>
              <li>Employee training on data protection and confidentiality obligations</li>
              <li>Incident response procedures for timely detection and mitigation of security breaches</li>
            </ul>
            <p className="leading-relaxed">
              Despite our best efforts, no security measures are completely infallible. We cannot
              guarantee absolute security of your information, but we are committed to promptly
              investigating and addressing any security incidents. In the event of a data breach
              affecting your personal information, we will notify you within 72 hours as required
              by the Kenya Data Protection Act.
            </p>
          </section>

          {/* Your Rights */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
            </div>
            <p className="mb-4">Under the Kenya Data Protection Act, 2019, and applicable international regulations, you have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong className="text-white">Right of Access:</strong> Request a copy of all personal data we hold about you, free of charge, within 30 days of your request</li>
              <li><strong className="text-white">Right to Correction:</strong> Update inaccurate or incomplete personal information at any time through your account settings or by contacting us</li>
              <li><strong className="text-white">Right to Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements (e.g., financial records must be retained for 7 years under Kenyan tax law)</li>
              <li><strong className="text-white">Right to Data Portability:</strong> Receive your data in a machine-readable format (JSON or CSV) for transfer to another service provider</li>
              <li><strong className="text-white">Right to Object:</strong> Object to the processing of your data for direct marketing purposes at any time</li>
              <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent for data processing where consent was the legal basis, without affecting the lawfulness of processing before withdrawal</li>
              <li><strong className="text-white">Right to Lodge a Complaint:</strong> File a complaint with the Office of the Data Protection Commissioner (ODPC) in Kenya if you believe your data rights have been violated</li>
            </ul>
            <p>
              To exercise any of these rights, contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@safaritech.co.ke" className="text-neon hover:underline">privacy@safaritech.co.ke</a>.
              We will respond to all requests within 30 days.
            </p>
          </section>

          {/* Cookies & Tracking */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Cookies & Tracking</h2>
            <p className="mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience
              and analyze how our Services are used. Here is a summary of the cookies we use:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong className="text-white">Essential Cookies:</strong> Required for the website to function — shopping cart, checkout process, and authentication (NextAuth session tokens)</li>
              <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences such as language, region, display settings, and recently viewed products</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Collect anonymous usage statistics to help us understand how visitors interact with our site and identify areas for improvement</li>
              <li><strong className="text-white">Marketing Cookies:</strong> Used to deliver personalized advertisements and track the effectiveness of our marketing campaigns (only with your consent)</li>
            </ul>
            <p className="leading-relaxed">
              You can manage your cookie preferences at any time through your browser settings or our
              cookie consent banner. Disabling essential cookies may prevent critical features like
              checkout and login from working correctly. For more details, please read our{' '}
              <Link href="/cookies" className="text-neon hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          {/* Data Retention */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Data Retention</h2>
            <p className="mb-4 leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy, or as required by law:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong className="text-white">Account Data:</strong> Retained for the duration of your account plus 2 years after deletion, unless you request earlier deletion</li>
              <li><strong className="text-white">Order & Transaction Data:</strong> Retained for 7 years as required by Kenyan tax and financial regulations (KRA requirements)</li>
              <li><strong className="text-white">Marketing Consent Records:</strong> Retained for 3 years from the date consent was given or last updated</li>
              <li><strong className="text-white">Support Communication Records:</strong> Retained for 2 years after the last interaction</li>
              <li><strong className="text-white">Usage & Analytics Data:</strong> Anonymized after 26 months; anonymized data is retained indefinitely for trend analysis</li>
            </ul>
            <p className="leading-relaxed">
              After the applicable retention period, we securely delete or anonymize your data using
              industry-standard data destruction methods. We maintain audit logs to ensure compliance
              with our retention schedule.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Children&apos;s Privacy</h2>
            <p className="leading-relaxed">
              Our Services are not directed at individuals under the age of 18. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              personal data from a person under 18 without parental consent, we will take steps to
              delete that information promptly. If you believe your child has provided us with personal
              data, please contact us at{' '}
              <a href="mailto:privacy@safaritech.co.ke" className="text-neon hover:underline">privacy@safaritech.co.ke</a>.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">International Data Transfers</h2>
            </div>
            <p className="leading-relaxed">
              Your data is primarily stored and processed in data centers located in Kenya and the
              European Union. Some of our service providers (such as cloud hosting and analytics
              platforms) may process data in other jurisdictions. In such cases, we ensure appropriate
              safeguards are in place, including Standard Contractual Clauses approved by the relevant
              data protection authorities, to ensure your data receives the same level of protection
              as it would in Kenya.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Changes to This Policy</h2>
            <p className="mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices,
              technology, legal requirements, or other factors. When we make material changes, we will
              notify you by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Posting the updated policy on our website with a revised &quot;Last Updated&quot; date</li>
              <li>Sending an email notification to registered users for significant changes</li>
              <li>Displaying a prominent notice on our website for 30 days after the update</li>
              <li>Requiring acceptance of the new policy before you can continue using our Services (for major changes)</li>
            </ul>
            <p className="leading-relaxed">
              Your continued use of our Services after any changes constitutes acceptance of the updated
              policy. We encourage you to review this page periodically for the latest information on
              our privacy practices.
            </p>
          </section>

          {/* Contact Us */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              If you have questions about this Privacy Policy, wish to exercise your data rights,
              or need to report a privacy concern, please contact us through any of the following channels:
            </p>
            <ul className="space-y-2">
              <li>Email: <a href="mailto:privacy@safaritech.co.ke" className="text-neon hover:underline">privacy@safaritech.co.ke</a> (for privacy and data protection inquiries)</li>
              <li>General inquiries: <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">hello@safaritech.co.ke</a></li>
              <li>WhatsApp: <a href="https://wa.me/254700000000" className="text-neon hover:underline">+254 700 000 000</a></li>
              <li>Address: Westlands Business Centre, Waiyaki Way, Nairobi, Kenya</li>
              <li>Data Protection Officer: Available at <a href="mailto:dpo@safaritech.co.ke" className="text-neon hover:underline">dpo@safaritech.co.ke</a></li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 md:text-gray-400">
              You may also lodge a complaint with the Office of the Data Protection Commissioner (ODPC)
              of Kenya at <a href="https://www.odpc.go.ke" className="text-neon hover:underline" target="_blank" rel="noopener noreferrer">www.odpc.go.ke</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
