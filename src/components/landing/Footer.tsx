import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-foreground-muted">
          &copy; {new Date().getFullYear()} Talanthos. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-foreground-muted">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <a href="mailto:support@talanthos.com" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
