"use client";

import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import TxIcon from "@/components/tx/TxIcon";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";

const types = [
  {
    id: "visionary",
    figure: "Solomon",
    label: "The Visionary",
    tagline: "The Wisdom-Wealth Builder",
    glyph: "crown",
    color: "#8b6bb1",
    blurb: "You see what others miss. Resources, in your hand, become engines for what's next: a business, a movement, a legacy. You don't fear wealth; you steward its multiplication.",
    strengths: [
      "Reads opportunity where others read risk",
      "Multiplies what's been entrusted to you",
      "Naturally long-horizon; thinks in decades",
      "Connects wisdom to capital allocation",
      "Inspires others to dream practically",
    ],
    blindSpots: [
      "Can let the vision outrun the people around you",
      "Wisdom without governance becomes ambition",
      "Tendency to defer rest in pursuit of the build",
      "May confuse God's blessing with personal genius",
      "Risk of treating relationships as resources",
    ],
    verse: { text: "Moreover, I will give you what you have not asked for: both riches and honor, so that in your lifetime you will have no equal among kings.", ref: "1 Kings 3:13" },
  },
  {
    id: "guardian",
    figure: "Joseph",
    label: "The Guardian",
    tagline: "The Steward-Protector",
    glyph: "shield",
    color: "#b88a4a",
    blurb: "You see the lean years coming. While others spend the harvest, you store it: quietly, faithfully, with a discipline that protects families, businesses, and futures from the famine no one else is preparing for.",
    strengths: [
      "Disciplined saver; runway is your love language",
      "Long-memory; learns from past scarcity",
      "Calm in volatility; you've already modeled it",
      "Protective instinct for dependents and team",
      "Trusted with other people's resources",
    ],
    blindSpots: [
      "Stewardship can quietly harden into hoarding",
      "Fear of loss may eclipse calling to give",
      "Slow to deploy capital even when it's time",
      "May read God's provision as your own caution",
      "Can withhold from generosity in plenty",
    ],
    verse: { text: "Joseph stored up huge quantities of grain, like the sand of the sea; it was so much that he stopped keeping records because it was beyond measure.", ref: "Genesis 41:49" },
  },
  {
    id: "giver",
    figure: "The Macedonians",
    label: "The Giver",
    tagline: "The Generous Heart",
    glyph: "open-hand",
    color: "#5a9a6e",
    blurb: "Generosity isn't a line item for you. It's the lens. You give early, you give first, you give past comfort. People feel seen because you make a way for them with what's in your hand.",
    strengths: [
      "Generous beyond your own balance sheet",
      "Reads the unspoken need in a room",
      "Frees money from idolatry by sending it out",
      "Builds trust through unconditional giving",
      "Anchors your identity outside accumulation",
    ],
    blindSpots: [
      "Giving can outrun your own household's needs",
      "May enable rather than empower",
      "Hides from budgeting under the cover of grace",
      "Says yes to good causes and no to better ones",
      "Risk of using giving to manage guilt",
    ],
    verse: { text: "In the midst of a very severe trial, their overflowing joy and their extreme poverty welled up in rich generosity.", ref: "2 Corinthians 8:2" },
  },
  {
    id: "builder",
    figure: "Nehemiah",
    label: "The Builder",
    tagline: "The Systematic Restorer",
    glyph: "wall",
    color: "#6b7b8c",
    blurb: "You don't chase the new. You restore what's broken and finish what others abandoned. Brick by brick, system by system, your money builds walls that protect what matters for a generation.",
    strengths: [
      "Patient compounder; you finish what you start",
      "Translates conviction into systems and plans",
      "Resilient against opposition and delay",
      "Builds for the city, not just the self",
      "Money obeys the blueprint, not the mood",
    ],
    blindSpots: [
      "Systems can crowd out spontaneity and gift",
      "Plans become identity; deviation feels like loss",
      "Slow to celebrate; quick to start the next phase",
      "May undervalue rest in the rhythm of the work",
      "Builds walls others were never asked to scale",
    ],
    verse: { text: "So we rebuilt the wall till all of it reached half its height, for the people worked with all their heart.", ref: "Nehemiah 4:6" },
  },
];

export default function FourTypesPage() {
  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen">
          <div className="tx-landing-frame" style={{ maxWidth: 720 }}>
            {/* Hero */}
            <div className="tx-landing-hero" style={{ paddingTop: 32, paddingBottom: 48 }}>
              <TxEyebrow align="center">The Framework</TxEyebrow>
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
                Four Types. One Calling.
              </h1>
              <TxRule width={60} />
              <p className="tx-lede">
                Each Biblical Money Type reflects a distinct way God wires people to steward resources. None is better. All are needed. The question is not which type to become. It is which type you already are.
              </p>
            </div>

            {/* Types */}
            {types.map((t, i) => (
              <BlurFade key={t.id} delay={0.1 + i * 0.1}>
                <div
                  style={{
                    marginBottom: 64,
                    padding: "36px 28px",
                    borderRadius: 16,
                    border: "1px solid var(--rule)",
                    background: "var(--surface)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 4,
                      height: "100%",
                      background: t.color,
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: `${t.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: t.color,
                      }}
                    >
                      <TxIcon name={t.glyph} size={22} strokeWidth={1.4} />
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "var(--serif)",
                          fontSize: 26,
                          fontWeight: 400,
                          color: "var(--ink)",
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {t.label}
                      </h2>
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--muted)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          margin: "4px 0 0",
                        }}
                      >
                        {t.figure} &middot; {t.tagline}
                      </p>
                    </div>
                  </div>

                  <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.55, color: "var(--ink-2)", margin: "0 0 20px" }}>
                    {t.blurb}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          marginBottom: 10,
                        }}
                      >
                        Strengths
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {t.strengths.map((s, j) => (
                          <li
                            key={j}
                            style={{
                              fontSize: 14,
                              lineHeight: 1.45,
                              color: "var(--ink)",
                              paddingLeft: 14,
                              position: "relative",
                            }}
                          >
                            <span style={{ position: "absolute", left: 0, top: 8, width: 8, height: 1, background: t.color }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 10,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          marginBottom: 10,
                        }}
                      >
                        Blind spots
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {t.blindSpots.map((s, j) => (
                          <li
                            key={j}
                            style={{
                              fontSize: 14,
                              lineHeight: 1.45,
                              color: "var(--ink-2)",
                              paddingLeft: 14,
                              position: "relative",
                            }}
                          >
                            <span style={{ position: "absolute", left: 0, top: 8, width: 8, height: 1, background: "var(--rule-strong)" }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "16px 20px",
                      background: "var(--bg-2)",
                      borderRadius: 10,
                      borderLeft: `2px solid ${t.color}`,
                    }}
                  >
                    <p style={{ fontStyle: "italic", fontSize: 15, lineHeight: 1.5, color: "var(--ink)", margin: "0 0 6px" }}>
                      &ldquo;{t.verse.text}&rdquo;
                    </p>
                    <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", margin: 0 }}>
                      {t.verse.ref}
                    </p>
                  </div>
                </div>
              </BlurFade>
            ))}

            {/* CTA */}
            <BlurFade delay={0.1}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <TxEyebrow align="center">Which one are you?</TxEyebrow>
                <h2 className="tx-display" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", marginTop: 12 }}>
                  Find out in under four minutes.
                </h2>
                <p className="tx-lede" style={{ marginTop: 16 }}>
                  The assessment is free. The clarity is lasting.
                </p>
                <div className="tx-cta-row" style={{ marginTop: 24 }}>
                  <Link href="/quiz">
                    <TxButton size="lg">Begin the assessment</TxButton>
                  </Link>
                  <span className="tx-cta-meta">15 questions &middot; ~3-4 minutes &middot; free</span>
                </div>
              </div>
            </BlurFade>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
