import Link from "next/link";

export default function PressPage() {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-gray-900 md:text-white">Press & Media</h1>
          <p className="text-gray-500 md:text-gray-400">Media resources and company information for journalists and partners.</p>
        </div>

        <div className="space-y-8 text-gray-600 md:text-gray-400">
          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">About Safaritech</h2>
            <p className="mb-4">
              Safaritech is Kenya&apos;s premier electronics marketplace, offering smartphones, laptops, gaming gear,
              and accessories with M-Pesa and PayPal checkout and nationwide delivery.
            </p>
            <p>
              Founded to make quality tech accessible across Kenya, we partner with leading brands including Samsung,
              Apple, Sony, HP, and more.
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Media Contact</h2>
            <ul className="space-y-2">
              <li>
                Email:{" "}
                <a href="mailto:press@safaritech.co.ke" className="text-neon hover:underline">
                  press@safaritech.co.ke
                </a>
              </li>
              <li>
                General inquiries:{" "}
                <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">
                  hello@safaritech.co.ke
                </a>
              </li>
              <li>Phone: +254 700 000 000</li>
              <li>Address: Westlands, Nairobi, Kenya</li>
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:text-white">Brand Assets</h2>
            <p className="mb-4">
              For logo files, product imagery, or interview requests, contact our press team. We typically respond
              within one business day.
            </p>
            <Link href="/contact" className="bg-neon hover:bg-neon-dim text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-all inline-block">
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
