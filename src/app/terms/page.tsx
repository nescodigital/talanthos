import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

export const metadata = {
  title: "Terms of Service. Talanthos",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />
      <main className="mx-auto max-w-[720px] px-5 sm:px-6 lg:px-14 py-16 flex-1">
        <h1 className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 42px)" }}>
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Last updated: May 17, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--ink-2)]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">1. Agreement</h2>
            <p className="mt-2">
              By using Talanthos, you agree to these Terms of Service. If you do not agree, please do
              not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">2. Service Description</h2>
            <p className="mt-2">
              Talanthos provides a Biblical Money Type assessment and personalized PDF reports based
              on Christian financial principles. Our content is for educational and inspirational
              purposes only and does not constitute professional financial, legal, or tax advice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">3. Account and Eligibility</h2>
            <p className="mt-2">
              You must be 18 or older to use Talanthos. You are responsible for providing accurate
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">4. Purchases and Refunds</h2>
            <p className="mt-2">
              All sales are processed in USD via Stripe. We offer a 30-day money-back guarantee on the
              main report. To request a refund, email{" "}
              <a href="mailto:support@talanthos.com" className="text-[var(--accent)] hover:underline">
                support@talanthos.com
              </a>{" "}
              with your order number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">5. Intellectual Property</h2>
            <p className="mt-2">
              All content on Talanthos (text, design, reports, Biblical Money Type framework) is our
              intellectual property. You may use your personalized report for personal purposes only.
              Redistribution, resale, or commercial use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">6. User Conduct</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Use the service for unlawful purposes</li>
              <li>Attempt to bypass our security</li>
              <li>Resell or redistribute our content</li>
              <li>Use automated tools to access our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">7. Disclaimer</h2>
            <p className="mt-2">
              Talanthos is not a financial advisor. Our content is based on biblical principles and
              general financial wisdom. You should consult a qualified financial professional for
              personalized advice. We make no guarantees about financial outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">8. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, Talanthos shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">9. Termination</h2>
            <p className="mt-2">
              We reserve the right to suspend or terminate access for any user who violates these
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">10. Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of Romania. Any disputes will be resolved in the
              courts of Bucharest.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">11. Changes to Terms</h2>
            <p className="mt-2">
              We may update these terms at any time. Continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--ink)]">12. Contact</h2>
            <p className="mt-2">
              <a href="mailto:support@talanthos.com" className="text-[var(--accent)] hover:underline">
                support@talanthos.com
              </a>
            </p>
            <p className="mt-1">DEXARA SRL, Bucharest, Romania</p>
          </section>
        </div>
      </main>
      <TxFooter />
    </div>
  );
}
