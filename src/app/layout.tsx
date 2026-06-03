import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Instrument_Serif, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { OrganizationSchema, WebSiteSchema } from "@/lib/seo/json-ld";
import MetaPixel from "@/components/MetaPixel";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Talanthos. Discover Your Biblical Money Type",
  description:
    "A Scripture-grounded assessment that names the way God has uniquely wired you to relate to money, risk, rest, and responsibility.",
  metadataBase: new URL("https://talanthos.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Talanthos. Discover Your Biblical Money Type",
    description:
      "A Scripture-grounded assessment that names the way God has uniquely wired you to relate to money, risk, rest, and responsibility.",
    type: "website",
    locale: "en_US",
    siteName: "Talanthos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Talanthos — Discover Your Biblical Money Type",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talanthos. Discover Your Biblical Money Type",
    description:
      "A Scripture-grounded assessment that names the way God has uniquely wired you to relate to money, risk, rest, and responsibility.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} ${cormorant.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QVVJZH6ST9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QVVJZH6ST9');
          `}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2401459223710739');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2401459223710739&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wum00qqpqo");`,
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <OrganizationSchema />
        <WebSiteSchema />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
