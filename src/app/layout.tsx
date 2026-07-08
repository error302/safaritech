import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Safaritech — Tech That Moves Kenya",
  description:
    "Kenya's premier electronics marketplace. Curated smartphones, laptops, audio and gaming gear from Apple, Samsung, Sony and 20+ authorized brands. Pay with M-Pesa, delivered nationwide.",
  keywords: [
    "Safaritech",
    "Kenya electronics",
    "M-Pesa shopping",
    "smartphones Kenya",
    "laptops Nairobi",
    "premium tech Africa",
    "Apple Samsung Sony",
  ],
  authors: [{ name: "Safaritech" }],
  metadataBase: new URL("https://safaritech.co.ke"),
  alternates: { canonical: "https://safaritech.co.ke" },
  openGraph: {
    title: "Safaritech — Tech That Moves Kenya",
    description:
      "Curated premium electronics from the world's leading brands. M-Pesa checkout, nationwide delivery, one-year warranty.",
    url: "https://safaritech.co.ke",
    siteName: "Safaritech",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safaritech — Tech That Moves Kenya",
    description:
      "Kenya's premier electronics marketplace. Curated, authentic, delivered.",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#fafaf8" media="(prefers-color-scheme: light)" />
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
