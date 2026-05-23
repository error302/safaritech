import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import SiteFooter from "@/components/SiteFooter";
import { Providers } from "./providers";
import LayoutContent from "@/components/LayoutContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Safaritech — Tech That Moves Kenya",
  description: "Phones, Laptops, Gaming PCs & Accessories. Fast M-Pesa delivery across Kenya.",
  keywords: "phones nairobi, laptops kenya, gaming pc, mpesa, safaritech",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Safaritech",
  },
  openGraph: {
    title: "Safaritech",
    description: "Tech That Moves Kenya",
    siteName: "Safaritech",
  },
};

export const viewport: Viewport = {
  themeColor: "#00FF9F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="font-body antialiased md:bg-safaridark md:text-white bg-gray-50 text-gray-900">
      <Providers>
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">
          <LayoutContent>{children}</LayoutContent>
        </main>
        <SiteFooter />
        <MobileBottomNav />
      </Providers>
      </body>
    </html>
  );
}
