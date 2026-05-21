import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

export const metadata = {
  title: "Privacy Policy — Talanthos",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />
      <main className="mx-auto max-w-[720px] px-5 sm:px-6 lg:px-14 py-16 flex-1">
        <h1 className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 42px)" }}>
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: May 17, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--ink-2)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">1. Introduction</h2>
            <p className="mt-2">
              Talanthos respects your privacy. This Privacy Policy explains how we collect, use, and
              protect your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">2. Information We Collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Email address (when you submit the quiz)</li>
              <li>Quiz answers (anonymous, linked to your session)</li>
              <li>Marketing consent preference</li>
              <li>Purchase information (processed via Stripe. We never store card details)</li>
              <li>Technical data (IP address, browser type, device type)</li>
              <li>UTM parameters and referral sources</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To deliver your personalized Biblical Money Type report</li>
              <li>To send you the report PDF and related materials</li>
              <li>To send marketing emails if you consented (you can unsubscribe anytime)</li>
              <li>To improve our quiz and product</li>
              <li>To detect fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">4. Data Sharing</h2>
            <p className="mt-2">We do not sell your personal data. We share data only with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Stripe (for payment processing)</li>
              <li>Resend (for email delivery)</li>
              <li>Supabase (for secure data storage)</li>
              <li>Meta and Google (only aggregated conversion events, never personal data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">5. Cookies and Tracking</h2>
            <p className="mt-2">
              We use cookies and similar technologies to track quiz progress, measure ad performance,
              and improve site functionality. You can disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">6. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Access your data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw marketing consent</li>
              <li>Export your data</li>
            </ul>
            <p className="mt-2">
              <a href="/contact" className="text-[var(--accent)] hover:underline">Contact us</a>{" "}
              to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">7. Data Retention</h2>
            <p className="mt-2">
              We keep your data as long as necessary to provide our services. After that, we delete it
              within 30 days unless legally required to retain it longer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">8. Children&apos;s Privacy</h2>
            <p className="mt-2">
              Our services are not intended for users under 18. We do not knowingly collect data from
              minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">9. International Data Transfers</h2>
            <p className="mt-2">
              Our servers may be located outside your country. By using Talanthos, you consent to your
              data being transferred internationally.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">10. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. The &ldquo;Last updated&rdquo; date will reflect any
              changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">11. Contact</h2>
            <p className="mt-2">
              Privacy questions?{" "}
              <a href="/contact" className="text-[var(--accent)] hover:underline">Contact us</a>.
            </p>
          </section>
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
