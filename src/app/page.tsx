"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import TxMark from "@/components/tx/TxMark";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxButton from "@/components/tx/TxButton";
import TxRule from "@/components/tx/TxRule";
import TxIcon from "@/components/tx/TxIcon";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

const trust = [
  { stat: "12,847", label: "Assessments taken" },
  { stat: "4", label: "Biblical archetypes" },
  { stat: "47", label: "Pages per report" },
  { stat: "30", label: "Day action plan" },
];

const fourTypes = [
  { id: "visionary", figure: "Solomon", label: "Visionary", glyph: "crown" },
  { id: "builder", figure: "Joseph", label: "Builder", glyph: "shield" },
  { id: "sower", figure: "The Widow", label: "Sower", glyph: "open-hand" },
  { id: "steward", figure: "The Servant", label: "Steward", glyph: "wall" },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />

      <main className="flex flex-col items-center px-5 sm:px-6 lg:px-14">
        <div className="w-full max-w-[720px] flex flex-col items-stretch">
          {/* Hero */}
          <div className="flex flex-col items-center text-center gap-5 py-8 sm:py-12 lg:py-16">
            <TxMark size={72} />
            <TxEyebrow align="center">A Stewardship Assessment</TxEyebrow>
            <h1
              className="m-0 text-[var(--ink)] text-center"
              style={{
                fontFamily: "var(--serif)",
                fontWeight: 400,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                textWrap: "balance",
                paddingBottom: "0.08em",
              }}
            >
              Discover your
              <br />
              <em className="not-italic text-[var(--accent)]">Biblical Money Type.</em>
            </h1>
            <p
              className="m-0 max-w-[520px]"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(18px, 1.6vw, 22px)",
                lineHeight: 1.55,
                color: "var(--ink-2)",
                textWrap: "pretty",
              }}
            >
              A two-minute assessment, grounded in Scripture, that names the way God has uniquely
              wired you to relate to money — your strengths, your blind spots, and the next step
              that&apos;s yours alone.
            </p>
            <div className="flex flex-col items-center gap-3 mt-1.5">
              <Link href="/quiz">
                <TxButton size="lg">Begin the assessment</TxButton>
              </Link>
              <span className="font-[var(--mono)] text-xs text-[var(--muted)] tracking-[0.06em]">
                7 questions &middot; ~2 minutes &middot; free
              </span>
            </div>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-y border-[var(--rule)] my-6 mb-16">
            {trust.map((t, i) => (
              <div
                key={i}
                className={`py-5 px-3 text-center ${i < trust.length - 1 ? "border-r border-[var(--rule)]" : ""} ${i < 2 ? "lg:border-r" : ""}`}
              >
                <div
                  className="leading-none"
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: "clamp(24px, 2.4vw, 32px)",
                    color: "var(--ink)",
                  }}
                >
                  {t.stat}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {t.label}
                </div>
              </div>
            ))}
          </div>

          {/* Four Types */}
          <div className="flex flex-col items-center gap-6 py-6 pb-14 text-center">
            <TxEyebrow align="center">The Four Types</TxEyebrow>
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {fourTypes.map((t) => (
                <article
                  key={t.id}
                  className="bg-[var(--surface)] border border-[var(--rule)] rounded-[14px] p-5 sm:p-[22px] text-center flex flex-col items-center gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent-line)] hover:bg-[var(--surface-2)] cursor-default"
                >
                  <div className="text-[var(--accent)]">
                    <TxIcon name={t.glyph} size={28} strokeWidth={1.3} />
                  </div>
                  <div className="font-[var(--mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {t.figure}
                  </div>
                  <div
                    className="text-[22px] text-[var(--ink)]"
                    style={{ fontFamily: "var(--serif)" }}
                  >
                    The {t.label}
                  </div>
                </article>
              ))}
            </div>
            <p
              className="max-w-[540px] mt-2"
              style={{
                fontFamily: "var(--serif)",
                fontSize: 18,
                fontStyle: "italic",
                color: "var(--ink-2)",
                lineHeight: 1.5,
              }}
            >
              Each type is <em className="text-[var(--accent)] not-italic">good</em>. None is better.
              The point is not to become another — it is to become more faithfully who He already
              made you to be.
            </p>
          </div>

          {/* Verse */}
          <blockquote className="flex flex-col items-center gap-4 text-center my-0 mb-6 py-10 px-7 border-y border-[var(--rule)]">
            <TxIcon name="quote" size={22} />
            <p
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2vw, 26px)",
                lineHeight: 1.5,
                color: "var(--ink)",
                maxWidth: 580,
                margin: 0,
                textWrap: "pretty",
              }}
            >
              &ldquo;Each of you should use whatever gift you have received to serve others, as
              faithful stewards of God&apos;s grace in its various forms.&rdquo;
            </p>
            <cite className="not-italic text-[13px] text-[var(--muted)] uppercase tracking-[0.18em]">
              — 1 Peter 4:10
            </cite>
          </blockquote>
        </div>
      </main>

      <TxFooter />
    </div>
  );
}
