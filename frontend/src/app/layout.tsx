import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AKM Mehedi Hasan — Researcher & Educator",
    template: "%s — AKM Mehedi Hasan",
  },
  description:
    "The research portfolio of AKM Mehedi Hasan — papers, books, and articles on artificial intelligence and machine learning.",
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
