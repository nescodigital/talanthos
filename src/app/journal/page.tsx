"use client";

import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import { BlurFade } from "@/components/ui/blur-fade";
import { getAllArticles } from "@/lib/journal/articles";
import Link from "next/link";

export default function JournalPage() {
  const articles = getAllArticles();

  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen">
          <div className="tx-landing-frame" style={{ maxWidth: 720 }}>
            {/* Hero */}
            <div className="tx-landing-hero" style={{ paddingTop: 32, paddingBottom: 48 }}>
              <TxEyebrow align="center">The Journal</TxEyebrow>
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
                Thoughts on stewardship.
              </h1>
              <TxRule width={60} />
              <p className="tx-lede">
                Articles on biblical money types, faithful finance, and the intersection of faith and resources.
              </p>
            </div>

            {/* Articles */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {articles.map((article, i) => (
                <BlurFade key={article.slug} delay={0.1 + i * 0.08}>
                  <Link
                    href={`/journal/${article.slug}`}
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div
                      className="journal-card"
                      style={{
                        padding: "28px",
                        borderRadius: 14,
                        border: "1px solid var(--rule)",
                        background: "var(--surface)",
                        transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          marginBottom: 10,
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                        }}
                      >
                        <span style={{ color: "var(--accent)" }}>{article.category}</span>
                        <span>&middot;</span>
                        <span>{article.date}</span>
                        <span>&middot;</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h2
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 22,
                          fontWeight: 400,
                          color: "var(--ink)",
                          lineHeight: 1.25,
                          margin: "0 0 10px",
                        }}
                      >
                        {article.title}
                      </h2>
                      <p
                        style={{
                          fontSize: 15,
                          lineHeight: 1.55,
                          color: "var(--ink-2)",
                          margin: 0,
                        }}
                      >
                        {article.excerpt}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 14,
                          fontSize: 13,
                          color: "var(--accent)",
                          fontWeight: 500,
                        }}
                      >
                        Read article
                      </span>
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
