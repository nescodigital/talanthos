"use client";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Talanthos",
        url: "https://talanthos.com",
        logo: "https://talanthos.com/logo.png",
        sameAs: [
          "https://twitter.com/talanthos",
        ],
        description:
          "Talanthos helps believers discover their Biblical Money Type through a Scripture-grounded assessment and personalized reports.",
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Talanthos",
        url: "https://talanthos.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://talanthos.com/journal?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function WebPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: `https://talanthos.com${path}`,
        isPartOf: {
          "@type": "WebSite",
          name: "Talanthos",
          url: "https://talanthos.com",
        },
        about: {
          "@type": "Thing",
          name: "Biblical Money Type",
          description:
            "A framework for understanding how God has wired believers to relate to money, based on four archetypes from Scripture: Visionary, Guardian, Giver, and Builder.",
        },
      }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  slug,
  date,
  category,
  readTime,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  category: string;
  readTime: string;
}) {
  const isoDate = new Date(date).toISOString();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `https://talanthos.com/journal/${slug}`,
        datePublished: isoDate,
        dateModified: isoDate,
        author: {
          "@type": "Organization",
          name: "Talanthos",
          url: "https://talanthos.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Talanthos",
          logo: {
            "@type": "ImageObject",
            url: "https://talanthos.com/logo.png",
          },
        },
        articleSection: category,
        wordCount: readTime.includes("5")
          ? 800
          : readTime.includes("6")
            ? 1000
            : readTime.includes("7")
              ? 1200
              : readTime.includes("8")
                ? 1400
                : 1000,
      }}
    />
  );
}

export function FAQPageSchema({
  questions,
}: {
  questions: { q: string; a: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        })),
      }}
    />
  );
}

export function DefinedTermSetSchema({
  terms,
}: {
  terms: { name: string; description: string; inDefinedTermSet: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Biblical Money Types",
        description:
          "Four archetypes for understanding how believers relate to money, based on figures from Scripture.",
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.name,
          description: t.description,
          inDefinedTermSet: t.inDefinedTermSet,
        })),
      }}
    />
  );
}
