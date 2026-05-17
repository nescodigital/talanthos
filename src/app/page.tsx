import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Hero />
      <SocialProof />
      <HowItWorks />

      {/* Bible verse closing section */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <blockquote className="font-display text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
            &ldquo;Each one should use whatever gift he has received to serve others, faithfully
            administering God&apos;s grace in its various forms.&rdquo;
          </blockquote>
          <p className="mt-4 text-foreground-muted">— 1 Peter 4:10</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24 text-center">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-base font-medium text-bg transition-all hover:scale-[1.02] hover:bg-accent-hover"
        >
          Start the Free Quiz
        </Link>
      </section>

      <Footer />
    </div>
  );
}
