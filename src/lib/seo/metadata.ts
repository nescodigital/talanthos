import { Metadata } from "next";

export const SITE = {
  name: "Talanthos",
  url: "https://talanthos.com",
  tagline: "Discover Your Biblical Money Type",
  description:
    "A Scripture-grounded assessment that names the way God has uniquely wired you to relate to money, risk, rest, and responsibility.",
  ogImage: "https://talanthos.com/og-image.jpg",
  twitterHandle: "@talanthos",
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title.includes("Talanthos") ? title : `${title} — Talanthos`;
  const desc = description || SITE.description;
  const url = `${SITE.url}${path}`;
  const image = ogImage || SITE.ogImage;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      type,
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
      creator: SITE.twitterHandle,
    },
  };
}
