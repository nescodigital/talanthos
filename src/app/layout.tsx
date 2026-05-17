import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Talanthos — Discover Your Biblical Money Type",
  description:
    "A free 90-second quiz reveals the financial archetype God wired into you — and the personalized path forward for your money.",
  openGraph: {
    title: "Talanthos — Discover Your Biblical Money Type",
    description:
      "A free 90-second quiz reveals the financial archetype God wired into you — and the personalized path forward for your money.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
