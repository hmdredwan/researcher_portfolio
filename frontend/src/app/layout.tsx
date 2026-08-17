import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AKM Mehedi Hasan Research Portfolio",
  title: {
    default: "AKM Mehedi Hasan — Physicist, Researcher & Educator",
    template: "%s — AKM Mehedi Hasan",
  },
  description:
    "AKM Mehedi Hasan is a physicist and researcher exploring the universal theory of physics, theoretical science, foundational questions, and future-facing scientific discovery.",
  keywords: [
    "AKM Mehedi Hasan",
    "physicist researcher",
    "universal theory of physics",
    "theoretical physics",
    "research portfolio",
    "science researcher",
    "physics research",
    "scientific theory",
    "fundamental physics",
    "researcher website",
  ],
  authors: [{ name: "AKM Mehedi Hasan" }],
  creator: "AKM Mehedi Hasan",
  publisher: "AKM Mehedi Hasan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AKM Mehedi Hasan",
    title: "AKM Mehedi Hasan — Physicist, Researcher & Educator",
    description:
      "Exploring the universal theory of physics, fundamental scientific ideas, and research-driven understanding of the universe.",
    images: [
      {
        url: "/images/favicon/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "AKM Mehedi Hasan research portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AKM Mehedi Hasan — Physicist, Researcher & Educator",
    description:
      "Researching the universal theory of physics and advancing scientific understanding through theoretical exploration.",
    images: ["/images/favicon/android-chrome-512x512.png"],
    creator: "@AKMMehediHasan",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: "/images/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-ink-900">
        {children}
      </body>
    </html>
  );
}
