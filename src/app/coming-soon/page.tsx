import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-full flex-col relative z-[1]">
      <TxNav />
      <main className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-14 py-24 text-center">
        <h1 className="text-[var(--ink)] m-0" style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 48px)" }}>
          Email capture coming next
        </h1>
        <p className="mt-4 text-[var(--muted)]">This feature is in development. Check back soon.</p>
      </main>
      <TxFooter />
    </div>
  );
}
