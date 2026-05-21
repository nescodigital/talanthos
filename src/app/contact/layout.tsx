import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Talanthos",
  description:
    "Get in touch with the Talanthos team. Questions about your report, partnerships, or media inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact — Talanthos",
    description: "Get in touch with the Talanthos team.",
    url: "https://talanthos.com/contact",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Talanthos",
      },
    ],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
