import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take the Assessment — Talanthos",
  description:
    "Start your free Biblical Money Type assessment. 15 questions. 3–4 minutes. A personalized report grounded in Scripture.",
  alternates: {
    canonical: "/quiz",
  },
  openGraph: {
    title: "Take the Assessment — Talanthos",
    description: "15 questions. 3–4 minutes. Discover your Biblical Money Type.",
    url: "https://talanthos.com/quiz",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Take the Biblical Money Type Assessment",
      },
    ],
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
