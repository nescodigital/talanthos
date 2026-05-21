import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Talanthos",
  description: "How Talanthos collects, uses, and protects your personal data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Talanthos",
    description: "How Talanthos collects, uses, and protects your personal data.",
    url: "https://talanthos.com/privacy",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
