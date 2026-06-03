"use client";

import { Suspense, useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "1499";
  const type = searchParams.get("type") || "";
  const session = searchParams.get("session") || "";
  const promo = searchParams.get("promo") || "";

  const [errorMsg, setErrorMsg] = useState("");

  const fetchClientSecret = useCallback(async () => {
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

      if (data.clientSecret) {
        return data.clientSecret;
      }
      throw new Error(data.error || "Checkout failed");
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
      throw err;
    }
  }, [amount, type, session, promo]);

  if (errorMsg) {
    return (
      <div className="flex min-h-full flex-col relative z-[1]">
        <TxNav />
        <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-24 text-center">
          <p className="text-[var(--ink)]" style={{ fontFamily: "var(--serif)", fontSize: 24 }}>Something went wrong</p>
          <p className="mt-2 text-[var(--muted)]">{errorMsg}</p>
          <button
            onClick={() => router.push(`/quiz/paywall?type=${encodeURIComponent(type)}&session=${encodeURIComponent(session)}`)}
            className="mt-6 tx-btn tx-btn-primary"
          >
            Go back
          </button>
        </main>
        <TxFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />
      <main className="flex-1 px-5 sm:px-6 lg:px-14 py-12">
        <div className="mx-auto max-w-[600px]">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
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
