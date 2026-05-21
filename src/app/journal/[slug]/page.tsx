import { Metadata } from "next";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import { BlurFade } from "@/components/ui/blur-fade";
import { getArticleBySlug, getAllArticles } from "@/lib/journal/articles";
import { ArticleSchema } from "@/lib/seo/json-ld";
import Link from "next/link";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {
      title: "Article Not Found — Talanthos",
    };
  }
  return {
    title: `${article.title} — Talanthos`,
    description: article.excerpt,
    alternates: {
      canonical: `/journal/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://talanthos.com/journal/${slug}`,
      type: "article",
      publishedTime: new Date(article.date).toISOString(),
      authors: ["Talanthos"],
      section: article.category,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="tx-page">
        <TxNav />
        <div className="tx-route">
          <main className="tx-screen">
            <div className="tx-landing-frame" style={{ maxWidth: 600, textAlign: "center" }}>
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>Article not found</h1>
              <p className="tx-lede">The article you are looking for does not exist.</p>
              <Link href="/journal">
                <TxButton size="md">Back to Journal</TxButton>
              </Link>
            </div>
          </main>
        </div>
        <TxFooter />
      </div>
    );
  }

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div className="tx-page">
      <ArticleSchema
        title={article.title}
        description={article.excerpt}
        slug={slug}
        date={article.date}
        category={article.category}
        readTime={article.readTime}
      />
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen">
          <div className="tx-landing-frame" style={{ maxWidth: 680 }}>
            {/* Header */}
            <div style={{ paddingTop: 16, paddingBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 14,
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                <Link href="/journal" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  Journal
                </Link>
                <span>/</span>
                <span style={{ color: "var(--accent)" }}>{article.category}</span>
              </div>
              <h1
                className="tx-display"
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  lineHeight: 1.15,
                  marginBottom: 16,
                }}
              >
                {article.title}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                }}
              >
                <span>{article.date}</span>
                <span>&middot;</span>
                <span>{article.readTime}</span>
              </div>
              <TxRule width={50} />
            </div>

            {/* Content */}
            <BlurFade delay={0.1}>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "var(--ink)",
                }}
              />
            </BlurFade>

            {/* CTA */}
            <BlurFade delay={0.2}>
              <div
                style={{
                  marginTop: 48,
                  padding: "32px",
                  borderRadius: 14,
                  background: "var(--surface)",
                  border: "1px solid var(--rule)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 20,
                    color: "var(--ink)",
                    margin: "0 0 16px",
                    lineHeight: 1.4,
                  }}
                >
                  Want to apply what you just read?
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--ink-2)",
                    margin: "0 0 20px",
                    lineHeight: 1.5,
                  }}
                >
                  Discover your Biblical Money Type and get a personalized 30-day action plan.
                </p>
                <Link href="/quiz">
                  <TxButton size="lg" icon="arrow">Take the free assessment</TxButton>
                </Link>
              </div>
            </BlurFade>

            {/* Navigation */}
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid var(--rule)",
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {prevArticle ? (
                <Link href={`/journal/${prevArticle.slug}`} style={{ textDecoration: "none", maxWidth: "45%" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Previous
                  </span>
                  <p style={{ fontSize: 15, color: "var(--ink)", margin: "4px 0 0", lineHeight: 1.35 }}>
                    {prevArticle.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextArticle ? (
                <Link href={`/journal/${nextArticle.slug}`} style={{ textDecoration: "none", maxWidth: "45%", textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Next
                  </span>
                  <p style={{ fontSize: 15, color: "var(--ink)", margin: "4px 0 0", lineHeight: 1.35 }}>
                    {nextArticle.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
