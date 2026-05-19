"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BIBLICAL_TYPES, BiblicalTypeData, BiblicalType } from "@/lib/quiz/types";
import { calculateScores } from "@/lib/quiz/scoring";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import TxCard from "@/components/tx/TxCard";
import TxButton from "@/components/tx/TxButton";
import TxIcon from "@/components/tx/TxIcon";
import ExitIntentShare from "@/components/quiz/ExitIntentShare";
import { TextEffect } from "@/components/ui/text-effect";
import { BlurFade } from "@/components/ui/blur-fade";

interface StoredAnswer {
  step: number;
  questionId: string;
  value: string;
  type?: BiblicalType;
  letter?: string;
}

const tabLabels = [
  { id: "overview", label: "The shape of it" },
  { id: "strengths", label: "Strengths" },
  { id: "blind", label: "Blind spots" },
  { id: "verse", label: "Your verse" },
  { id: "next", label: "Next step" },
];

export default function ResultPage() {
  const router = useRouter();
  const [typeId, setTypeId] = useState<BiblicalType | null>(null);
  const [scores, setScores] = useState<{ visionary: number; guardian: number; giver: number; builder: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function computeResult() {
      const sessionId = localStorage.getItem("talanthos_session_id");
      const answersRaw = localStorage.getItem("talanthos_answers");

      if (!sessionId || !answersRaw) {
        router.push("/quiz");
        return;
      }

      const answers: StoredAnswer[] = JSON.parse(answersRaw);
      const result = calculateScores(answers.map((a) => ({ type: a.type })));

      try {
        await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, answers: answers.map((a) => ({ question: a.step, question_id: a.questionId, letter: a.letter, value: a.value, type: a.type })) }),
        });
      } catch {
        // continue
      }

      setTypeId(result.primaryType);
      setScores(result.scores);
      setLoading(false);
    }

    computeResult();
  }, [router]);

  if (loading) {
    return (
      <div className="tx-page">
        <div className="tx-route" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
        </div>
      </div>
    );
  }

  if (!typeId || !scores) return null;

  const t: BiblicalTypeData = BIBLICAL_TYPES[typeId];
  if (!t) return null;

  const maxScore = Math.max(1, scores.visionary, scores.guardian, scores.giver, scores.builder);
  const scoreOrder: { key: keyof typeof scores; label: string }[] = [
    { key: "visionary", label: "Vision" },
    { key: "guardian", label: "Guard" },
    { key: "giver", label: "Give" },
    { key: "builder", label: "Build" },
  ];

  const emailHref = `/quiz/email?type=${encodeURIComponent(typeId)}&session=${encodeURIComponent(localStorage.getItem("talanthos_session_id") || "")}`;
  const paywallHref = `/quiz/paywall?type=${encodeURIComponent(typeId)}&session=${encodeURIComponent(localStorage.getItem("talanthos_session_id") || "")}`;

  return (
    <div className="tx-page">
      <TxNav minimal />
      <div className="tx-route">
        <main className="tx-screen tx-result">
          <div className="tx-result-frame">
            {/* Hero */}
            <header className="tx-result-hero">
              <div className="tx-result-monogram">
                <span className="tx-result-monogram-roman">{t.monogram}</span>
                <TxIcon name={t.glyph} size={28} strokeWidth={1.3} />
              </div>
              <TxEyebrow align="center">You are</TxEyebrow>
              <h1 className="tx-display tx-result-title">
                <TextEffect per="word" preset="blur" as="span">{t.label}</TextEffect>
              </h1>
              <div className="tx-result-figure">
                <TextEffect per="word" preset="fade" delay={0.3} as="span">
                  {`${t.figure} \u00b7 ${t.tagline}`}
                </TextEffect>
              </div>
              <TxRule width={70} />
              <BlurFade delay={0.4}>
                <p className="tx-result-blurb">{t.blurb}</p>
              </BlurFade>

              {/* Dimensional pillars */}
              <BlurFade delay={0.5}>
                <div style={{ marginTop: 32 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      gap: "clamp(8px, 2vw, 20px)",
                      height: 260,
                      padding: "0 8px",
                    }}
                  >
                    {scoreOrder.map(({ key, label }) => {
                      const v = scores[key];
                      const pct = Math.max(12, (v / maxScore) * 100);
                      const isHi = key === typeId;
                      const glyphMap: Record<string, string> = {
                        visionary: "crown",
                        guardian: "shield",
                        giver: "open-hand",
                        builder: "wall",
                      };
                      return (
                        <div
                          key={key}
                          style={{
                            flex: 1,
                            maxWidth: 90,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: `${pct * 2.2}px`,
                              minHeight: 48,
                              borderRadius: "14px 14px 4px 4px",
                              background: isHi
                                ? "linear-gradient(180deg, var(--accent) 0%, #c9a96e 100%)"
                                : "var(--bg-2)",
                              border: isHi
                                ? "1px solid var(--accent)"
                                : "1px solid var(--rule)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              paddingBottom: 16,
                              position: "relative",
                              transition: "all 0.6s ease-out",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--serif)",
                                fontSize: isHi ? "clamp(20px, 2.5vw, 26px)" : "clamp(15px, 2vw, 18px)",
                                fontWeight: 600,
                                color: isHi ? "#fff" : "var(--ink)",
                                lineHeight: 1,
                              }}
                            >
                              {v}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, marginTop: -2 }}>
                            <TxIcon name={glyphMap[key]} size={isHi ? 18 : 14} strokeWidth={1.4} />
                            <span
                              style={{
                                fontFamily: "var(--mono)",
                                fontSize: 10,
                                color: isHi ? "var(--accent)" : "var(--muted)",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontWeight: isHi ? 600 : 400,
                              }}
                            >
                              {label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </BlurFade>
            </header>

            <BlurFade delay={0.1}>
            {/* Tabs */}
            <nav className="tx-tabs" role="tablist">
              {tabLabels.map((x) => (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={tab === x.id}
                  className={"tx-tab" + (tab === x.id ? " is-on" : "")}
                  onClick={() => setTab(x.id)}
                >
                  {x.label}
                </button>
              ))}
            </nav>

            <div className="tx-tab-panel">
              {tab === "overview" && (
                <div className="tx-grid-2">
                  <TxCard eyebrow="Strengths" icon="check" tone="warm">
                    <ul className="tx-list">
                      {t.strengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                    <button className="tx-link tx-link-sm" onClick={() => setTab("strengths")}>See all five →</button>
                  </TxCard>
                  <TxCard eyebrow="Blind spots" icon="warn" tone="cool">
                    <ul className="tx-list tx-list-veil">
                      {t.blindSpots.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                      <li className="tx-veil">{t.blindSpots[2]}</li>
                    </ul>
                    <button className="tx-link tx-link-sm" onClick={() => setTab("blind")}>Reveal the rest →</button>
                  </TxCard>
                </div>
              )}
              {tab === "strengths" && (
                <TxCard eyebrow={"How the " + t.label + " moves"} icon="check" tone="warm">
                  <ul className="tx-list tx-list-numbered">
                    {t.strengths.map((s, i) => (
                      <li key={i}><span className="tx-li-num">{String(i + 1).padStart(2, "0")}</span>{s}</li>
                    ))}
                  </ul>
                </TxCard>
              )}
              {tab === "blind" && (
                <TxCard eyebrow={"Where the " + t.label + " bends"} icon="warn" tone="cool">
                  <ul className="tx-list tx-list-numbered">
                    {t.blindSpots.map((s, i) => (
                      <li key={i}><span className="tx-li-num">{String(i + 1).padStart(2, "0")}</span>{s}</li>
                    ))}
                  </ul>
                </TxCard>
              )}
              {tab === "verse" && (
                <TxCard eyebrow="Your key verse" icon="book" tone="verse">
                  <blockquote className="tx-verse-big">
                    <p>"{t.verse.text}"</p>
                    <cite>{t.verse.ref}</cite>
                  </blockquote>
                </TxCard>
              )}
              {tab === "next" && (
                <TxCard eyebrow="Your next step" icon="spark" tone="warm">
                  <p className="tx-next-body">{t.nextStep}</p>
                </TxCard>
              )}
            </div>
            </BlurFade>

            {/* Locked teaser — secondary CTA */}
            <BlurFade delay={0.2}>
            <section className="tx-locked">
              <div className="tx-locked-preview" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="tx-locked-page"
                    style={{ transform: `rotate(${(i - 1) * 4}deg) translateY(${Math.abs(i - 1) * 4}px)` }}
                  >
                    <div className="tx-locked-page-bar" />
                    <div className="tx-locked-page-line" style={{ width: "78%" }} />
                    <div className="tx-locked-page-line" style={{ width: "92%" }} />
                    <div className="tx-locked-page-line" style={{ width: "68%" }} />
                    <div className="tx-locked-page-line tx-locked-page-line-blank" />
                    <div className="tx-locked-page-line" style={{ width: "84%" }} />
                    <div className="tx-locked-page-line" style={{ width: "74%" }} />
                    <div className="tx-locked-page-line" style={{ width: "88%" }} />
                    <div className="tx-locked-page-chip" />
                  </div>
                ))}
                <div className="tx-locked-seal">
                  <TxIcon name="lock" size={22} />
                  <span>47 pages</span>
                </div>
              </div>

              <div className="tx-locked-body">
                <TxEyebrow>Your full report</TxEyebrow>
                <h3 className="tx-locked-h">Forty-seven pages, written for the {t.label}.</h3>
                <p className="tx-locked-pitch">{t.reportPitch}</p>
                <p className="tx-locked-fear">{t.reportFear}</p>
                <ul className="tx-locked-list">
                  <li><span>01</span>Your four-dimensional stewardship score</li>
                  <li><span>02</span>A 30-day action plan, paced for your type</li>
                  <li><span>03</span>Thirty Scripture verses, sequenced by week</li>
                  <li><span>04</span>A debt strategy specific to your wiring</li>
                  <li><span>05</span>An investing philosophy you can actually hold</li>
                  <li><span>06</span>A giving rhythm that won&apos;t burn you out</li>
                </ul>

                {submitted ? (
                  <div className="tx-locked-ack">
                    <TxIcon name="check" size={18} />
                    <span>Sent to <strong>{email}</strong>. Check your inbox in the next minute.</span>
                  </div>
                ) : (
                  <form
                    className="tx-locked-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (email.includes("@")) {
                        router.push(emailHref);
                      }
                    }}
                  >
                    <input
                      type="email"
                      placeholder="you@yourchurch.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <TxButton size="md">Send my full report</TxButton>
                  </form>
                )}
                <p className="tx-locked-fine">No subscription. One document, one follow-up. Unsubscribe any time.</p>
              </div>
            </section>
            </BlurFade>

            <div className="tx-result-foot">
              <button className="tx-link" onClick={() => {
                localStorage.removeItem("talanthos_session_id");
                localStorage.removeItem("talanthos_answers");
                router.push("/quiz");
              }}>← Retake the assessment</button>
              <span className="tx-result-share">Share &nbsp;&middot;&nbsp; Print &nbsp;&middot;&nbsp; Save</span>
            </div>
          </div>
        </main>
      </div>
      <ExitIntentShare typeData={t} />
      <TxFooter />
    </div>
  );
}
