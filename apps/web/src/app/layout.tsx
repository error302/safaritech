import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Providers } from "./providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Safaritech — Tech That Moves Kenya",
  description: "Phones, Laptops, Gaming PCs & Accessories. Fast M-Pesa delivery across Kenya.",
  keywords: "phones nairobi, laptops kenya, gaming pc, mpesa, safaritech",
  openGraph: {
    title: "Safaritech",
    description: "Tech That Moves Kenya",
    siteName: "Safaritech",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="font-body antialiased md:bg-safaridark md:text-white bg-gray-50 text-gray-900">
      <Providers>
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <MobileBottomNav />
      </Providers>
      </body>
    </html>
  );
}