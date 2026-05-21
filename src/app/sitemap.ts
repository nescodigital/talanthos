import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/journal/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://talanthos.com";

  // Static public pages
  const staticPages = [
    "/",
    "/about",
    "/contact",
    "/journal",
    "/the-four-types",
    "/privacy",
    "/terms",
    "/quiz",
  ];

  const staticRoutes = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.8,
  }));

  // Journal articles
  const articles = getAllArticles();
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
