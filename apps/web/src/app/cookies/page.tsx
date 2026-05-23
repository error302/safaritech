import Link from "next/link";

export default function CookiePolicy() {
  return (
    <div className="bg-safaridark min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold font-display text-white">Cookie Policy</h1>
          <p className="text-gray-500 md:text-gray-400">Last Updated: April 29, 2026</p>
        </div>

        <div className="space-y-8 text-gray-400">
          <section className="rounded-xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit Safaritech. They help us remember your
              preferences, keep you signed in, and understand how our store is used.
            </p>
          </section>

          <section className="rounded-xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">How We Use Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential:</strong> Shopping cart, checkout, and authentication (NextAuth session)</li>
              <li><strong>Functional:</strong> Language, region, and display preferences</li>
              <li><strong>Analytics:</strong> Anonymous usage statistics to improve our website</li>
            </ul>
          </section>

          <section className="rounded-xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Managing Cookies</h2>
            <p className="mb-4">
              You can control cookies through your browser settings. Disabling essential cookies may prevent checkout,
              sign-in, or cart features from working correctly.
            </p>
            <p>
              For more on how we handle personal data, see our{" "}
              <Link href="/privacy" className="text-neon hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="rounded-xl border border-safariborder bg-safarigray p-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Contact</h2>
            <p>
              Questions about cookies? Email{" "}
              <a href="mailto:hello@safaritech.co.ke" className="text-neon hover:underline">
                hello@safaritech.co.ke
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
