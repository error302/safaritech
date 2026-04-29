export default function PrivacyPolicy() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Privacy Policy</h1>
          <p className="text-gray-500 md:text-gray-400">Last Updated: April 29, 2026</p>
        </div>

        <div className="space-y-8 text-gray-600 md:text-gray-400">
          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Introduction</h2>
            <p className="mb-4">
              Safaritech ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, mobile applications, and related services (collectively, "Services").
            </p>
            <p>
              By using our Services, you agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Information We Collect</h2>

            <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-white">Personal Information</h3>
            <p className="mb-4">When you register, place an order, or contact us, we may collect:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Name and contact details (email, phone number, address)</li>
              <li>Payment information (processed securely through M-Pesa and Stripe)</li>
              <li>Account credentials and preferences</li>
              <li>Communication records with our support team</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-white">Usage Information</h3>
            <p className="mb-4">We automatically collect:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Device information (browser type, IP address, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Location information (for delivery and regional services)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-white">Order Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Product purchases and order history</li>
              <li>Delivery addresses and preferences</li>
              <li>Payment history and transaction details</li>
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">How We Use Your Information</h2>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 md:text-white">To Process Orders</h3>
                <ul className="list-disc pl-6">
                  <li>Process payments and fulfill orders</li>
                  <li>Arrange shipping and delivery</li>
                  <li>Provide order updates and tracking</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 md:text-white">To Improve Our Services</h3>
                <ul className="list-disc pl-6">
                  <li>Analyze usage patterns and preferences</li>
                  <li>Personalize your shopping experience</li>
                  <li>Develop new features and products</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 md:text-white">To Communicate With You</h3>
                <ul className="list-disc pl-6">
                  <li>Send order confirmations and updates</li>
                  <li>Respond to inquiries and support requests</li>
                  <li>Send promotional offers (with your consent)</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 md:text-white">For Security & Compliance</h3>
                <ul className="list-disc pl-6">
                  <li>Prevent fraud and protect against unauthorized access</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our terms and policies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Information Sharing</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Payment processors, delivery companies, and IT service providers who help us operate our business</li>
              <li><strong>Legal Compliance:</strong> Authorities when required by law or to protect our legal rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of sensitive data during transmission (HTTPS/TLS)</li>
              <li>Secure payment processing through PCI-compliant gateways</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data storage with industry-standard encryption</li>
            </ul>
            <p className="mt-4">
              Despite our efforts, no security measures are completely foolproof. We cannot guarantee absolute security of your information.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Your Rights</h2>
            <p className="mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Consent Withdrawal:</strong> Withdraw consent for data processing where applicable</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">hello@safaritech.co.ke</a>
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Cookies & Tracking</h2>
            <p className="mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain your shopping session and preferences</li>
              <li>Remember your login status</li>
              <li>Analyze website usage and performance</li>
              <li>Deliver personalized content and advertisements</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit some functionality.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide our Services and process orders</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-4">
              After this period, we securely delete or anonymize your data.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification (for significant changes)</li>
              <li>Requiring acceptance of the new policy before continuing to use our Services</li>
            </ul>
            <p className="mt-4">
              Your continued use of our Services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">hello@safaritech.co.ke</a></li>
              <li>WhatsApp: <a href="https://wa.me/254700000000" className="text-neon hover:underline">+254 700 000 000</a></li>
              <li>Address: Westlands, Nairobi, Kenya</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
