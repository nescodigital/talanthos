"use client";

import Link from "next/link";
import TxMark from "@/components/tx/TxMark";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxButton from "@/components/tx/TxButton";
import TxRule from "@/components/tx/TxRule";
import TxIcon from "@/components/tx/TxIcon";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import LiveCounter from "@/components/ui/LiveCounter";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TextEffect } from "@/components/ui/text-effect";
import { BlurFade } from "@/components/ui/blur-fade";

const trust = [
  { stat: "believers", label: "Believers assessed", live: true, start: 12847 },
  { stat: "3-4 min", label: "To complete", live: false },
  { stat: "47 pp", label: "Personalized report", live: false },
  { stat: "4.9★", label: "Average rating", live: false },
];

const fourTypes = [
  { id: "visionary", figure: "Solomon", label: "Visionary", glyph: "crown" },
  { id: "guardian", figure: "Joseph", label: "Guardian", glyph: "shield" },
  { id: "giver", figure: "Macedonians", label: "Giver", glyph: "open-hand" },
  { id: "builder", figure: "Nehemiah", label: "Builder", glyph: "wall" },
];

export default function Home() {
  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen tx-landing">
          <div className="tx-landing-frame">
            <AuroraBackground className="min-h-[60vh] rounded-3xl" showRadialGradient>
              <div className="tx-landing-hero relative z-10">
                <TxMark size={56} />
                <TxEyebrow align="center">A Stewardship Assessment</TxEyebrow>
                <h1 className="tx-display">
                  <TextEffect per="word" preset="blur" as="span">
                    Discover your Biblical Money Type.
                  </TextEffect>
                </h1>
                <p className="tx-lede">
                  <TextEffect per="word" preset="slide" delay={0.4} as="span">
                    A 3-4 minute assessment, grounded in Scripture, that names the way God has uniquely wired you to relate to money.
                  </TextEffect>
                </p>
                <div className="tx-cta-row">
                  <Link href="/quiz">
                    <TxButton size="lg">Begin the assessment</TxButton>
                  </Link>
                  <span className="tx-cta-meta">15 questions &middot; ~3-4 minutes &middot; free</span>
                </div>
              </div>
            </AuroraBackground>

            <BlurFade delay={0.2}>
              <div className="tx-trust">
                {trust.map((t, i) => (
                  <div className="tx-trust-cell" key={i}>
                    <div className="tx-trust-stat">
                      {t.live ? <LiveCounter start={t.start || 12847} /> : t.stat}
                    </div>
                    <div className="tx-trust-label">{t.label}</div>
                  </div>
                ))}
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="tx-four">
                <TxEyebrow align="center">The Four Types</TxEyebrow>
                <div className="tx-four-grid">
                  {fourTypes.map((t, i) => (
                    <BlurFade key={t.id} delay={0.3 + i * 0.1}>
                      <article className="tx-four-card">
                        <div className="tx-four-glyph">
                          <TxIcon name={t.glyph} size={28} strokeWidth={1.3} />
                        </div>
                        <div className="tx-four-figure">{t.figure}</div>
                        <div className="tx-four-label">The {t.label}</div>
                      </article>
                    </BlurFade>
                  ))}
                </div>
                <p className="tx-four-note">
                  Each type is <em>good</em>. None is better. The point is not to become
                  another. It is to become more faithfully who He already made you to be.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={0.4}>
              <blockquote className="tx-landing-verse">
                <TxIcon name="quote" size={22} />
                <p>
                  &ldquo;Each of you should use whatever gift you have received to serve
                  others, as faithful stewards of God&apos;s grace in its various forms.&rdquo;
                </p>
                <cite>1 Peter 4:10</cite>
              </blockquote>
            </BlurFade>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
