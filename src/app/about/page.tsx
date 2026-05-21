import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import TxIcon from "@/components/tx/TxIcon";
import { BlurFade } from "@/components/ui/blur-fade";
import { WebPageSchema } from "@/lib/seo/json-ld";
import Link from "next/link";

export const metadata = {
  title: "About — Talanthos",
  description: "Talanthos helps believers discover their Biblical Money Type and steward money faithfully.",
  alternates: {
    canonical: "/about",
  },
};

const values = [
  {
    icon: "book",
    title: "Rooted in Scripture",
    desc: "Every framework, every question, every verse is grounded in the Bible. We do not import secular psychology and baptize it.",
  },
  {
    icon: "shield",
    title: "No Shame, No Hype",
    desc: "There is no 'best' type. No secret formula. No 7-step plan to riches. Just faithful stewardship, named and pursued.",
  },
  {
    icon: "open-hand",
    title: "Generosity as Identity",
    desc: "We believe generosity is not a line item. It is a lens. The goal is not to become rich. It is to become faithful.",
  },
  {
    icon: "spark",
    title: "Personal, Not Generic",
    desc: "Your report is not a template with your name inserted. It is written for your type, your scores, your context, your season.",
  },
];

export default function AboutPage() {
  return (
    <div className="tx-page">
      <WebPageSchema
        title="About — Talanthos"
        description="Talanthos helps believers discover their Biblical Money Type and steward money faithfully."
        path="/about"
      />
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen">
          <div className="tx-landing-frame" style={{ maxWidth: 720 }}>
            {/* Hero */}
            <div className="tx-landing-hero" style={{ paddingTop: 32, paddingBottom: 48 }}>
              <TxEyebrow align="center">Our Story</TxEyebrow>
              <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
                We name what God has already wired.
              </h1>
              <TxRule width={60} />
              <p className="tx-lede">
                Talanthos exists because most believers have never been given language for how they relate to money. We built the assessment we wished we had taken ten years ago.
              </p>
            </div>

            {/* Story */}
            <BlurFade delay={0.1}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 64 }}>
                <p className="tx-lede" style={{ textAlign: "left", maxWidth: "none", fontSize: 17 }}>
                  Talanthos began with a simple observation: the church talks about money often, but rarely talks about <em>the person holding it</em>. We preach tithing, debt freedom, and generosity — but we skip the step that makes all of those meaningful: understanding how God wired you to relate to resources in the first place.
                </p>
                <p className="tx-lede" style={{ textAlign: "left", maxWidth: "none", fontSize: 17 }}>
                  The Biblical Money Type framework emerged from years of studying how Scripture portrays financial stewardship. Solomon multiplied. Joseph protected. The Macedonians gave. Nehemiah built. Each was faithful. None was the same. The question is not "Are you good with money?" The question is "How has God wired you to be faithful with it?"
                </p>
                <p className="tx-lede" style={{ textAlign: "left", maxWidth: "none", fontSize: 17 }}>
                  Today, Talanthos helps believers name their type, understand their blind spots, and take concrete steps toward faithful stewardship. Every report is personalized. Every insight is rooted in Scripture. We reinvest what we earn into building more resources that serve the church.
                </p>
              </div>
            </BlurFade>

            {/* Values */}
            <BlurFade delay={0.2}>
              <div style={{ marginBottom: 64 }}>
                <TxEyebrow align="center">What We Believe</TxEyebrow>
                <div className="tx-four-grid" style={{ marginTop: 24 }}>
                  {values.map((v) => (
                    <div key={v.title} className="tx-four-card" style={{ textAlign: "left", alignItems: "flex-start" }}>
                      <div className="tx-four-glyph">
                        <TxIcon name={v.icon} size={24} strokeWidth={1.3} />
                      </div>
                      <div className="tx-four-label" style={{ fontSize: 18 }}>{v.title}</div>
                      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Mission */}
            <BlurFade delay={0.3}>
              <blockquote className="tx-landing-verse" style={{ marginBottom: 64 }}>
                <TxIcon name="quote" size={22} />
                <p>
                  &ldquo;Each of you should use whatever gift you have received to serve others, as faithful stewards of God&apos;s grace in its various forms.&rdquo;
                </p>
                <cite>1 Peter 4:10</cite>
              </blockquote>
            </BlurFade>

            {/* CTA */}
            <BlurFade delay={0.4}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <TxEyebrow align="center">Your Turn</TxEyebrow>
                <h2 className="tx-display" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", marginTop: 12 }}>
                  Discover your Biblical Money Type.
                </h2>
                <p className="tx-lede" style={{ marginTop: 16 }}>
                  Fifteen questions. Three to four minutes. A lifetime of clarity.
                </p>
                <div className="tx-cta-row" style={{ marginTop: 24 }}>
                  <Link href="/quiz">
                    <TxButton size="lg">Begin the assessment</TxButton>
                  </Link>
                  <span className="tx-cta-meta">Free &middot; No signup required</span>
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
