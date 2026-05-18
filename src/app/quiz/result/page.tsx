"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BIBLICAL_TYPES, BiblicalTypeData } from "@/lib/quiz/types";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import TxCard from "@/components/tx/TxCard";
import TxButton from "@/components/tx/TxButton";
import TxIcon from "@/components/tx/TxIcon";

interface ResultData {
  primary_type: string;
  secondary_type: string | null;
  scores: { builder: number; steward: number; sower: number; visionary: number };
}

const tabLabels = [
  { id: "overview", label: "The shape of it" },
  { id: "strengths", label: "Strengths" },
  { id: "blind", label: "Blind spots" },
  { id: "verse", label: "Your verse" },
  { id: "next", label: "Next step" },
];

const typeGlyphs: Record<string, string> = {
  builder: "shield",
  steward: "wall",
  sower: "open-hand",
  visionary: "crown",
};

const typeMonograms: Record<string, string> = {
  builder: "I",
  steward: "II",
  sower: "III",
  visionary: "IV",
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
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

      const answers = JSON.parse(answersRaw);

      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, answers }),
        });
        const data = await res.json();
        setResult(data);
      } catch {
        router.push("/quiz");
      } finally {
        setLoading(false);
      }
    }

    computeResult();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--rule)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (!result) return null;

  const typeData: BiblicalTypeData = BIBLICAL_TYPES[result.primary_type];
  if (!typeData) return null;

  const scores = result.scores;
  const maxScore = Math.max(1, scores.builder, scores.steward, scores.sower, scores.visionary);
  const scoreOrder: { key: keyof typeof scores; label: string }[] = [
    { key: "visionary", label: "Vision" },
    { key: "builder", label: "Build" },
    { key: "sower", label: "Give" },
    { key: "steward", label: "Guard" },
  ];

  const emailHref = `/quiz/email?type=${encodeURIComponent(result.primary_type)}&session=${encodeURIComponent(localStorage.getItem("talanthos_session_id") || "")}`;

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center px-5 sm:px-6 lg:px-14 py-8 sm:py-12">
        <div className="w-full max-w-[760px] flex flex-col gap-14">
          {/* Hero */}
          <header className="flex flex-col items-center text-center gap-4 py-4 sm:py-8">
            <div className="inline-flex flex-col items-center gap-2 text-[var(--accent)]">
              <span
                className="text-[28px] tracking-[0.1em]"
                style={{ fontFamily: "var(--serif)" }}
              >
                {typeMonograms[result.primary_type] || "I"}
              </span>
              <TxIcon name={typeGlyphs[result.primary_type] || "shield"} size={28} strokeWidth={1.3} />
            </div>
            <TxEyebrow align="center">You are</TxEyebrow>
            <h1
              className="m-0 text-[var(--ink)]"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(48px, 6.4vw, 84px)",
                lineHeight: 1.05,
              }}
            >
              {typeData.name}
            </h1>
            <div className="font-[var(--mono)] text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              {typeData.archetype}
            </div>
            <TxRule width={70} />
            <p
              className="m-0 max-w-[580px] mt-2"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "clamp(18px, 1.6vw, 22px)",
                color: "var(--ink-2)",
                lineHeight: 1.55,
                textWrap: "pretty",
              }}
            >
              {typeData.shortDescription}
            </p>

            {/* Score bars */}
            <div className="w-full max-w-[480px] mt-3 grid grid-cols-2 gap-x-7 gap-y-3.5">
              {scoreOrder.map(({ key, label }) => {
                const v = scores[key];
                const pct = (v / maxScore) * 100;
                const isHi = key === result.primary_type;
                return (
                  <div key={key}>
                    <div
                      className={`flex justify-between font-[var(--mono)] text-[11px] uppercase tracking-[0.16em] mb-1.5 ${isHi ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
                    >
                      <span>{label}</span>
                      <span>{v}</span>
                    </div>
                    <div className="h-0.5 bg-[var(--rule)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-700 ease-out ${isHi ? "bg-[var(--accent)]" : "bg-[var(--ink-2)]"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </header>

          {/* Tabs */}
          <nav className="flex gap-0 border-y border-[var(--rule)] overflow-x-auto" role="tablist">
            {tabLabels.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={tab === x.id}
                className={`appearance-none border-0 bg-transparent py-[18px] px-[22px] text-[var(--ink-2)] cursor-pointer font-[var(--sans)] text-[13px] tracking-[0.04em] border-b-2 -mb-px whitespace-nowrap transition-colors duration-200 hover:text-[var(--ink)] ${tab === x.id ? "text-[var(--accent)] border-b-[var(--accent)]" : "border-b-transparent"}`}
                onClick={() => setTab(x.id)}
              >
                {x.label}
              </button>
            ))}
          </nav>

          <div className="py-2" style={{ animation: "txFade .35s ease both" }}>
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TxCard eyebrow="Strengths" icon="check" tone="warm">
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5 font-[var(--serif)] text-[17px] leading-[1.5] text-[var(--ink)]">
                    {typeData.strengths.slice(0, 3).map((s, i) => (
                      <li key={i} className="pl-[22px] relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-px before:bg-[var(--accent)]">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="appearance-none border-0 bg-transparent text-[var(--ink-2)] cursor-pointer text-xs tracking-[0.04em] pt-3.5 border-b border-transparent transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)] inline-block"
                    onClick={() => setTab("strengths")}
                  >
                    See all five →
                  </button>
                </TxCard>
                <TxCard eyebrow="Blind spots" icon="warn" tone="cool">
                  <ul className="list-none p-0 m-0 flex flex-col gap-2.5 font-[var(--serif)] text-[17px] leading-[1.5]">
                    {typeData.blindSpots.slice(0, 2).map((s, i) => (
                      <li key={i} className="pl-[22px] relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-3 before:h-px before:bg-[var(--accent)]">
                        {s}
                      </li>
                    ))}
                    <li className="blur-[5px] select-none text-[var(--muted)]">{typeData.blindSpots[2]}</li>
                  </ul>
                  <button
                    className="appearance-none border-0 bg-transparent text-[var(--ink-2)] cursor-pointer text-xs tracking-[0.04em] pt-3.5 border-b border-transparent transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)] inline-block"
                    onClick={() => setTab("blind")}
                  >
                    Reveal the rest →
                  </button>
                </TxCard>
              </div>
            )}
            {tab === "strengths" && (
              <TxCard eyebrow={`How the ${typeData.name} moves`} icon="check" tone="warm">
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5 font-[var(--serif)] text-[17px] leading-[1.5] text-[var(--ink)]">
                  {typeData.strengths.map((s, i) => (
                    <li key={i} className="pl-11 relative">
                      <span className="absolute left-0 top-0 font-[var(--mono)] text-[11px] text-[var(--muted)] tracking-[0.15em] leading-[1.7]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </TxCard>
            )}
            {tab === "blind" && (
              <TxCard eyebrow={`Where the ${typeData.name} bends`} icon="warn" tone="cool">
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5 font-[var(--serif)] text-[17px] leading-[1.5] text-[var(--ink)]">
                  {typeData.blindSpots.map((s, i) => (
                    <li key={i} className="pl-11 relative">
                      <span className="absolute left-0 top-0 font-[var(--mono)] text-[11px] text-[var(--muted)] tracking-[0.15em] leading-[1.7]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </TxCard>
            )}
            {tab === "verse" && (
              <TxCard eyebrow="Your key verse" icon="book" tone="verse">
                <blockquote className="m-0">
                  <p
                    className="m-0"
                    style={{
                      fontFamily: "var(--serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(22px, 2.4vw, 28px)",
                      lineHeight: 1.5,
                      color: "var(--ink)",
                      textWrap: "pretty",
                    }}
                  >
                    &ldquo;{typeData.keyVerse.text}&rdquo;
                  </p>
                  <cite className="not-italic block mt-3.5 font-[var(--mono)] text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    — {typeData.keyVerse.reference}
                  </cite>
                </blockquote>
              </TxCard>
            )}
            {tab === "next" && (
              <TxCard eyebrow="Your next step" icon="spark" tone="warm">
                <p
                  className="m-0"
                  style={{
                    fontFamily: "var(--serif)",
                    fontSize: 19,
                    lineHeight: 1.55,
                    color: "var(--ink)",
                    textWrap: "pretty",
                  }}
                >
                  {typeData.primaryFreeInsight}
                </p>
              </TxCard>
            )}
          </div>

          {/* Locked teaser */}
          <section className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 bg-[var(--surface)] border border-[var(--rule)] rounded-[20px] p-9 md:p-9 items-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 0% 50%, var(--accent-soft), transparent 60%)",
                opacity: 0.5,
              }}
            />
            <div className="relative h-[220px] flex items-center justify-center" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute w-[140px] h-[200px] bg-[var(--surface-2)] border border-[var(--rule)] rounded-md p-3 flex flex-col gap-1.5"
                  style={{
                    transform: `rotate(${(i - 1) * 4}deg) translateY(${Math.abs(i - 1) * 4}px)`,
                    boxShadow: "0 12px 30px -15px rgba(0,0,0,0.25)",
                    filter: "blur(2px)",
                  }}
                >
                  <div className="w-[30%] h-0.5 bg-[var(--accent)] mb-1.5" />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "78%" }} />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "92%" }} />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "68%" }} />
                  <div className="h-2 bg-transparent" />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "84%" }} />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "74%" }} />
                  <div className="w-full h-[5px] bg-[var(--rule-strong)] rounded-sm" style={{ width: "88%" }} />
                  <div className="mt-auto w-10 h-3.5 bg-[var(--accent-soft)] rounded-sm" />
                </div>
              ))}
              <div className="relative z-[2] inline-flex items-center gap-2 bg-[var(--bg)] text-[var(--accent)] px-4 py-2.5 rounded-full border border-[var(--accent-line)] font-[var(--mono)] text-[11px] uppercase tracking-[0.18em] shadow-[0_8px_24px_-10px_rgba(0,0,0,0.2)]">
                <TxIcon name="lock" size={22} />
                <span>47 pages</span>
              </div>
            </div>

            <div className="relative z-[1]">
              <TxEyebrow>Your full report</TxEyebrow>
              <h3
                className="my-3.5 mx-0 text-[var(--ink)]"
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(22px, 2.4vw, 30px)",
                  lineHeight: 1.2,
                }}
              >
                Forty-seven pages, written for the {typeData.name}.
              </h3>
              <ul className="list-none p-0 m-0 mb-5.5 grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-4 font-[var(--serif)] text-[15px] text-[var(--ink-2)]">
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">01</span>
                  Your four-dimensional stewardship score
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">02</span>
                  A 30-day action plan, paced for your type
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">03</span>
                  Thirty Scripture verses, sequenced by week
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">04</span>
                  A debt strategy specific to your wiring
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">05</span>
                  An investing philosophy you can actually hold
                </li>
                <li className="flex gap-2.5 items-baseline">
                  <span className="font-[var(--mono)] text-[10px] text-[var(--accent)] tracking-[0.18em]">06</span>
                  A giving rhythm that won&apos;t burn you out
                </li>
              </ul>

              {submitted ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-3 border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--ink)] rounded-xl text-sm">
                  <TxIcon name="check" size={18} />
                  <span>
                    Sent to <strong>{email}</strong>. Check your inbox in the next minute.
                  </span>
                </div>
              ) : (
                <form
                  className="flex gap-2 items-stretch flex-wrap"
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
                    className="flex-1 min-w-[200px] border border-[var(--rule-strong)] bg-[var(--bg)] text-[var(--ink)] rounded-full px-[18px] py-3 text-sm font-[inherit] outline-none transition-colors duration-200 focus:border-[var(--accent)]"
                  />
                  <TxButton size="md" type="submit">Send my full report</TxButton>
                </form>
              )}
              <p className="mt-3 font-[var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                No subscription. One PDF, one follow-up. Unsubscribe any time.
              </p>
            </div>
          </section>

          <div className="flex justify-between items-center border-t border-[var(--rule)] pt-6">
            <button
              className="appearance-none border-0 bg-transparent text-[var(--ink-2)] cursor-pointer text-[13px] tracking-[0.04em] py-1.5 border-b border-transparent transition-colors duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]"
              onClick={() => {
                localStorage.removeItem("talanthos_session_id");
                localStorage.removeItem("talanthos_answers");
                router.push("/quiz");
              }}
            >
              &larr; Retake the assessment
            </button>
            <span className="font-[var(--mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Share &nbsp;&middot;&nbsp; Print &nbsp;&middot;&nbsp; Save
            </span>
          </div>
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
