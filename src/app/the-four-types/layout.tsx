import { Metadata } from "next";
import { DefinedTermSetSchema } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "The Four Biblical Money Types — Talanthos",
  description:
    "Meet the Visionary, Guardian, Giver, and Builder — four archetypes from Scripture that name how believers relate to money, risk, rest, and responsibility.",
  alternates: {
    canonical: "/the-four-types",
  },
  openGraph: {
    title: "The Four Biblical Money Types — Talanthos",
    description:
      "Visionary, Guardian, Giver, Builder. Four archetypes from Scripture that explain how you relate to money.",
    url: "https://talanthos.com/the-four-types",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Four Biblical Money Types",
      },
    ],
  },
};

export default function FourTypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DefinedTermSetSchema
        terms={[
          {
            name: "The Visionary",
            description:
              "The Solomon archetype. Sees opportunity where others see risk. Multiplies resources through wisdom and long-horizon thinking. Risk: vision outruns counsel.",
            inDefinedTermSet: "Biblical Money Types",
          },
          {
            name: "The Guardian",
            description:
              "The Joseph archetype. Stores against famine with discipline and foresight. Protects families and futures. Risk: stewardship hardens into hoarding.",
            inDefinedTermSet: "Biblical Money Types",
          },
          {
            name: "The Giver",
            description:
              "The Macedonian church archetype. Gives out of extreme poverty with overflowing joy. Reads need before it is spoken. Risk: generosity without boundaries.",
            inDefinedTermSet: "Biblical Money Types",
          },
          {
            name: "The Builder",
            description:
              "The Nehemiah archetype. Translates vision into systems, plans, and finished work. Finishes what others abandon. Risk: systems crowd out spontaneity.",
            inDefinedTermSet: "Biblical Money Types",
          },
        ]}
      />
      {children}
    </>
  );
}
