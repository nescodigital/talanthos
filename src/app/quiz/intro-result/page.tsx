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
    <div className="tx-page">
      <TxNav minimal />
      <div className="tx-route">
        <main className="tx-screen tx-intro-result">
          <div className="tx-intro-frame">
            <TxIcon name="olive" size={28} />
            <blockquote className="tx-intro-verse">
              <p>
                &ldquo;Each of you should use whatever gift you have received to serve
                others, as faithful stewards of God&apos;s grace in its various forms.&rdquo;
              </p>
              <cite>1 Peter 4:10</cite>
            </blockquote>
            <TxRule width={80} />
            <p className="tx-intro-body">
              Before we reveal your Biblical Money Type, one reminder.
              <br /><br />
              There is no <em>better</em> type. Each one reflects how God has
              uniquely wired you to handle wealth. The point of seeing it is not
              to perform it. It is to receive it, to repent of where it has bent
              inward, and to steward it with the people He has put in front of you.
            </p>
            {showCta && (
              <TxButton onClick={() => router.push("/quiz/result")} size="lg" icon="arrow">
                Show me my type
              </TxButton>
            )}
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
