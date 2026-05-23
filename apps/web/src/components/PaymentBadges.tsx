import Image from "next/image";

const payments = [
  { name: "M-Pesa", src: "/brands/mpesa.svg", w: 88, h: 28 },
  { name: "PayPal", src: "/brands/paypal.svg", w: 72, h: 28 },
  { name: "Visa", src: "/brands/visa.svg", w: 56, h: 28 },
  { name: "Mastercard", src: "/brands/mastercard.svg", w: 48, h: 28 },
];

export default function PaymentBadges() {
  return (
    <section className="py-10 md:py-12 px-4 border-t border-safariborder bg-safaridark/50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[11px] font-semibold text-gray-500 mb-5 uppercase tracking-[0.2em]">
          Secure checkout
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {payments.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-center h-11 px-4 rounded-xl bg-safarigray border border-safariborder"
            >
              <Image
                src={p.src}
                alt={p.name}
                width={p.w}
                height={p.h}
                className="object-contain h-6 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
