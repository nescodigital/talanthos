import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Talanthos",
  description: "Terms and conditions for using Talanthos and purchasing personalized reports.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Talanthos",
    description: "Terms and conditions for using Talanthos.",
    url: "https://talanthos.com/terms",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
