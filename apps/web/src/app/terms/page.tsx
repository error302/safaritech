import { Scale, FileText, UserCheck, ShoppingBag, CreditCard, Truck, RotateCcw, ShieldCheck, AlertTriangle, Gavel, RefreshCw, Mail } from 'lucide-react'

export default function Terms() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neon/10 text-neon">
            <Scale className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Terms of Service</h1>
          <p className="text-gray-500 md:text-gray-400">Last Updated: March 4, 2026</p>
        </div>

        <div className="space-y-6 text-gray-500 md:text-gray-400">
          {/* 1. Acceptance of Terms */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              By accessing or using Safaritech&apos;s website (safaritech.co.ke), mobile applications, and
              related services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms
              of Service, our Privacy Policy, and all applicable laws and regulations of the Republic
              of Kenya. These terms constitute a legally binding agreement between you and Safaritech
              Limited.
            </p>
            <p className="leading-relaxed">
              If you do not agree with any part of these terms, you are prohibited from using our
              Services. We may modify these terms at any time by posting the updated version on our
              website. Your continued use of the Services after any changes constitutes acceptance of
              the modified terms. We will make reasonable efforts to notify registered users of
              material changes via email or website announcements.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">2. Eligibility</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              You must be at least 18 years old and capable of entering into legally binding contracts
              under Kenyan law to use our Services. By using our Services, you represent and warrant
              that you meet these eligibility requirements. If you are using our Services on behalf of
              an organization, you represent that you have the authority to bind that organization to
              these terms.
            </p>
            <p className="leading-relaxed">
              Persons under the age of 18 may only use our Services under the supervision and with the
              consent of a parent or legal guardian who agrees to be bound by these terms. The
              supervising adult assumes full responsibility for all transactions and activities conducted
              by the minor under their supervision.
            </p>
          </section>

          {/* 3. Account Registration */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. Account Registration</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Account Creation</h3>
                <p className="leading-relaxed">You must provide accurate, complete, and current registration information when creating an account. This includes your legal name, a valid email address, an active phone number, and a delivery address. Providing false information may result in account suspension and order cancellation.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Account Security</h3>
                <p className="leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at hello@safaritech.co.ke if you suspect any unauthorized access to your account. Safaritech will not be liable for losses arising from your failure to protect your account credentials.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Account Termination</h3>
                <p className="leading-relaxed">We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent or abusive activities, or pose a risk to other users or our business. Upon termination, your right to use the Services will cease immediately. Sections relating to liability, intellectual property, and dispute resolution shall survive termination.</p>
              </div>
            </div>
          </section>

          {/* 4. Products & Orders */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">4. Products & Orders</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Product Information</h3>
                <p className="leading-relaxed">We strive to provide accurate product descriptions, images, specifications, and pricing. However, errors may occasionally occur. In the event of a pricing or product information error, we reserve the right to cancel any orders placed for incorrectly listed products and will notify you promptly. We will offer you the option to purchase the product at the correct price or receive a full refund.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Pricing</h3>
                <p className="leading-relaxed">All prices are displayed in Kenyan Shillings (KSh) and include applicable VAT unless stated otherwise. Prices may change without prior notice, but changes will not affect orders that have already been confirmed and paid for. Promotional prices are subject to availability and may be limited by quantity or time period as stated in the promotion terms.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Order Confirmation</h3>
                <p className="leading-relaxed">An order confirmation email constitutes acceptance of your order but does not guarantee product availability. In rare cases where a product is unavailable after order confirmation, we will notify you and offer alternatives or a full refund. Your order is considered complete only when you receive a shipping confirmation email with tracking details.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Order Modifications</h3>
                <p className="leading-relaxed">Orders can be modified within 1 hour of placement by contacting our support team. Modifications may include changing the delivery address, adding or removing items, or updating the delivery method. After the 1-hour window, orders enter processing and cannot be modified. Cancellation requests after this period will be handled per our Returns policy.</p>
              </div>
            </div>
          </section>

          {/* 5. Payments */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">5. Payments</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Payment Methods</h3>
                <p className="leading-relaxed">We accept the following payment methods: M-Pesa (STK push and Paybill), Visa and MasterCard debit/credit cards, PayPal, bank transfers, and Cash on Delivery (COD) in select areas within Nairobi. All payments are processed through secure, PCI DSS Level 1 compliant payment gateways. We do not accept cheques, money orders, or cryptocurrency.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Payment Security</h3>
                <p className="leading-relaxed">We do not store complete payment card details on our servers. All payment information is encrypted during transmission using TLS 1.3 and processed by authorized payment service providers (Safaricom for M-Pesa, Stripe for card payments, PayPal for PayPal transactions). Our payment infrastructure undergoes regular security assessments.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Failed Payments</h3>
                <p className="leading-relaxed">Orders with failed or incomplete payments will not be processed. If your payment fails, you will have 24 hours to retry before the order is automatically cancelled. Please ensure sufficient funds and correct payment details before placing an order. Repeated payment failures may result in temporary restrictions on your account as a fraud prevention measure.</p>
              </div>
            </div>
          </section>

          {/* 6. Delivery & Shipping */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Truck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">6. Delivery & Shipping</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Delivery Options</h3>
                <p className="leading-relaxed">We offer express delivery within Nairobi (24-48 hours, same-day available for orders before 12pm) and standard delivery to other locations across Kenya (3-7 business days to major towns, 5-10 days to remote areas). Delivery times are estimates and not guaranteed, though we make every reasonable effort to meet them.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Shipping Fees</h3>
                <p className="leading-relaxed">Shipping fees are calculated at checkout based on your delivery location, package weight, and chosen delivery speed. Free shipping is available for orders above KSh 10,000 within Nairobi and KSh 25,000 for nationwide delivery. All shipping fees are clearly displayed before you confirm your order.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Delivery Issues</h3>
                <p className="leading-relaxed">We are not responsible for delays caused by incorrect addresses provided by the customer, customs clearance, road closures, or events beyond our reasonable control (natural disasters, strikes, pandemics, government actions, etc.). We will communicate any known delays proactively and work to find alternative delivery solutions.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Lost or Damaged Items</h3>
                <p className="leading-relaxed">Claims for lost or damaged items must be reported within 48 hours of the expected or actual delivery date. We will investigate the claim with our courier partner and provide a replacement or full refund as appropriate. Please retain all packaging materials and take photographs of any damage to support your claim.</p>
              </div>
            </div>
          </section>

          {/* 7. Returns & Refunds */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">7. Returns & Refunds</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Return Policy</h3>
                <p className="leading-relaxed">We accept returns within 7 days of delivery for most products. Items must be unused, in original packaging with all accessories, tags, and documentation included. Certain items are non-returnable, including opened software, personal care products, clearance/final sale items, and products with customer-caused damage. For full details, see our Returns & Refunds page.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Refund Process</h3>
                <p className="leading-relaxed">Refunds are processed within 5-7 business days after we receive and inspect returned items. M-Pesa refunds are typically processed within 24-48 hours of approval. Card payment refunds may take 5-7 business days plus additional bank processing time. All refunds are issued to the original payment method used during checkout.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Warranty Claims</h3>
                <p className="leading-relaxed">Products with manufacturer defects are covered under our warranty policy. Contact us to initiate warranty service — we offer free pickup and delivery for all warranty repairs. Physical damage, unauthorized repairs, and normal wear and tear are not covered. Extended warranty plans (Safaritech Care and Premium) offer additional coverage options.</p>
              </div>
            </div>
          </section>

          {/* 8. Intellectual Property */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">8. Intellectual Property</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Ownership</h3>
                <p className="leading-relaxed">All content on our website, including but not limited to text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Safaritech or its content suppliers and is protected by Kenyan and international intellectual property laws, including the Kenya Copyright Act and the Industrial Property Act.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Limited License</h3>
                <p className="leading-relaxed">You may access and use our website and its content for personal, non-commercial, lawful purposes only. Any other use, including reproduction, modification, distribution, transmission, display, or creation of derivative works, requires our express written permission.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Trademarks</h3>
                <p className="leading-relaxed">Safaritech, the Safaritech logo, &quot;Tech That Moves Kenya,&quot; Safaritech Care, and Safaritech Premium are trademarks of Safaritech Limited. All other brand names, product names, and trademarks mentioned on our website belong to their respective owners. You may not use our trademarks without our prior written consent.</p>
              </div>
            </div>
          </section>

          {/* 9. Prohibited Conduct */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">9. Prohibited Conduct</h2>
            </div>
            <p className="mb-4">By using our Services, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our Services for any illegal, fraudulent, or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems, networks, or other user accounts</li>
              <li>Interfere with or disrupt the proper working of our Services, servers, or networks</li>
              <li>Transmit malware, viruses, worms, trojans, or other harmful or destructive code</li>
              <li>Engage in fraudulent activities, including using stolen payment methods or false identities</li>
              <li>Harass, abuse, threaten, or harm other users, our staff, or third parties</li>
              <li>Collect or harvest personal information of other users without their consent</li>
              <li>Resell our products for commercial purposes without written authorization</li>
              <li>Circumvent, disable, or interfere with security features or digital rights management</li>
              <li>Create multiple accounts to exploit promotions, bypass restrictions, or manipulate reviews</li>
              <li>Post false, misleading, or defamatory reviews or content on our platform</li>
            </ul>
          </section>

          {/* 10. Limitation of Liability */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">10. Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="leading-relaxed">
                To the maximum extent permitted by the laws of Kenya, Safaritech Limited and its
                affiliates, directors, employees, and agents shall not be liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services</li>
                <li>Loss of profits, revenue, data, goodwill, or business opportunities</li>
                <li>Service interruptions, downtime, or unavailability of the website</li>
                <li>Unauthorized access to your data or account, except where caused by our gross negligence</li>
                <li>Actions or content of third parties, including courier partners and payment processors</li>
                <li>Any damages exceeding the total amount you paid for the specific product or service giving rise to the claim</li>
              </ul>
              <p className="leading-relaxed">
                Our total aggregate liability for any claims related to our Services shall not exceed
                the amount paid by you to Safaritech in the 12 months preceding the claim. Nothing in
                these terms excludes or limits liability for death or personal injury caused by
                negligence, fraud, or any other liability that cannot be excluded by law.
              </p>
            </div>
          </section>

          {/* 11. Indemnification */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">11. Indemnification</h2>
            <p className="mb-4 leading-relaxed">
              You agree to indemnify and hold harmless Safaritech Limited, its affiliates, and their
              respective officers, directors, employees, and agents from any claims, damages, losses,
              liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from or
              related to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of or inability to use our Services</li>
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of any applicable laws, regulations, or third-party rights</li>
              <li>Any content you submit, post, or transmit through our Services</li>
              <li>Your engagement in any fraudulent, illegal, or prohibited activities</li>
            </ul>
          </section>

          {/* 12. Dispute Resolution */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Gavel className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">12. Dispute Resolution</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Governing Law</h3>
                <p className="leading-relaxed">These Terms are governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law principles. The Kenya Consumer Protection Act, 2012, and the Kenya Data Protection Act, 2019, apply to your use of our Services.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Informal Resolution</h3>
                <p className="leading-relaxed">Before filing any formal legal claim, you agree to first contact us at hello@safaritech.co.ke and attempt to resolve the dispute informally. We will attempt to resolve the dispute within 30 days. If the dispute is not resolved within this period, either party may proceed with formal dispute resolution.</p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">Jurisdiction</h3>
                <p className="leading-relaxed">You consent to the exclusive jurisdiction of the courts of Kenya for any legal proceedings arising from or related to these terms. Any disputes shall be resolved in the courts of Nairobi, Kenya. This choice of jurisdiction does not deprive you of any consumer protection rights you may have in your country of residence.</p>
              </div>
            </div>
          </section>

          {/* 13. Changes to Terms */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <RefreshCw className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">13. Changes to Terms</h2>
            </div>
            <p className="mb-4 leading-relaxed">
              We reserve the right to revise these Terms at any time without prior notice, except as
              required by law. Material changes will be communicated through:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Email notification to registered users at least 14 days before the effective date</li>
              <li>A prominent banner on our website for 30 days following the update</li>
              <li>An updated &quot;Last Updated&quot; date at the top of this page</li>
            </ul>
            <p className="leading-relaxed">
              Continued use of our Services after the effective date of any changes constitutes your
              acceptance of the revised terms. If you do not agree with the changes, you must
              discontinue use of the Services and may request deletion of your account.
            </p>
          </section>

          {/* 14. Contact Information */}
          <section className="rounded-2xl border border-safariborder bg-safarigray p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon/10 text-neon">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white">14. Contact Information</h2>
            </div>
            <p className="mb-4">For questions, concerns, or notices regarding these Terms, please contact us:</p>
            <ul className="space-y-2">
              <li>Company: Safaritech Limited</li>
              <li>Email: <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">hello@safaritech.co.ke</a></li>
              <li>Legal inquiries: <a href="mailto:legal@safaritech.co.ke" className="text-neon hover:underline">legal@safaritech.co.ke</a></li>
              <li>WhatsApp: <a href="https://wa.me/254700000000" className="text-neon hover:underline">+254 700 000 000</a></li>
              <li>Address: Westlands Business Centre, Waiyaki Way, Nairobi, Kenya</li>
              <li>Operating Hours: Monday - Saturday, 8:00 AM - 6:00 PM East African Time</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
