"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TxIcon from "@/components/tx/TxIcon";
import TxRule from "@/components/tx/TxRule";
import TxButton from "@/components/tx/TxButton";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

export default function IntroResultPage() {
  const router = useRouter();
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCta(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 min-h-[80vh]">
        <div className="flex flex-col items-center text-center gap-7 max-w-[600px] m-auto py-10 sm:py-16 lg:py-[90px]">
          <TxIcon name="olive" size={28} />
          <blockquote className="m-0">
            <p
              className="m-0"
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.4vw, 30px)",
                color: "var(--ink)",
                lineHeight: 1.5,
                textWrap: "balance",
              }}
            >
              &ldquo;Each of you should use whatever gift you have received to serve others, as
              faithful stewards of God&apos;s grace in its various forms.&rdquo;
            </p>
            <cite
              className="not-italic block mt-3.5 text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
            >
              — 1 Peter 4:10
            </cite>
          </blockquote>
          <TxRule width={80} />
          <p
            className="m-0 max-w-[540px]"
            style={{
              fontFamily: "var(--serif)",
              fontSize: 19,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              textWrap: "pretty",
            }}
          >
            Before we reveal your Biblical Money Type, one reminder.
            <br />
            <br />
            There is no <em className="text-[var(--accent)] not-italic">better</em> type. Each one
            reflects how God has uniquely wired you to handle wealth. The point of seeing it is not
            to perform it — it is to receive it, to repent of where it has bent inward, and to
            steward it with the people He has put in front of you.
          </p>
          {showCta && (
            <div
              className="transition-all duration-400"
              style={{ animation: "txFade .4s ease both" }}
            >
              <TxButton onClick={() => router.push("/quiz/result")} size="lg">
                Show me my type
              </TxButton>
            </div>
          )}
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
