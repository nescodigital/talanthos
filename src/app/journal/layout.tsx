import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journal — Talanthos",
  description:
    "Articles on biblical money types, faithful finance, and the intersection of Scripture and stewardship.",
  alternates: {
    canonical: "/journal",
  },
  openGraph: {
    title: "The Journal — Talanthos",
    description: "Articles on biblical money types and faithful stewardship.",
    url: "https://talanthos.com/journal",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Talanthos Journal",
      },
    ],
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
