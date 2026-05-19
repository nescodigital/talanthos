"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "1499";
  const type = searchParams.get("type") || "";
  const session = searchParams.get("session") || "";
  const promo = searchParams.get("promo") || "";

  const [status, setStatus] = useState<"loading" | "redirecting" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function createCheckout() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseInt(amount, 10),
            type,
            session_id: session,
            promoCode: promo,
          }),
        });

        const data = await res.json();

        if (data.url) {
          setStatus("redirecting");
          window.location.href = data.url;
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Checkout failed");
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    }

    createCheckout();
  }, [amount, type, session, promo]);

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav minimal />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-24 text-center">
        {status === "loading" && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
            <p className="mt-4 text-[var(--muted)]">Preparing your checkout...</p>
          </>
        )}
        {status === "redirecting" && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
            <p className="mt-4 text-[var(--muted)]">Redirecting to secure payment...</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-[var(--ink)]" style={{ fontFamily: "var(--serif)", fontSize: 24 }}>Something went wrong</p>
            <p className="mt-2 text-[var(--muted)]">{errorMsg}</p>
            <button
              onClick={() => router.push(`/quiz/paywall?type=${encodeURIComponent(type)}&session=${encodeURIComponent(session)}`)}
              className="mt-6 tx-btn tx-btn-primary"
            >
              Go back
            </button>
          </>
        )}
      </main>
      <TxFooter />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
