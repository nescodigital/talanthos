"use client";

import { useState } from "react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";
import { BlurFade } from "@/components/ui/blur-fade";
import { Mail, Users, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen">
          <div className="tx-landing-frame" style={{ maxWidth: 960, paddingTop: 32, paddingBottom: 64 }}>
            {/* Header */}
            <BlurFade>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <TxEyebrow align="center">Get in touch</TxEyebrow>
                <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", marginTop: 12 }}>
                  We read every message
                </h1>
                <TxRule width={60} />
                <p className="tx-lede" style={{ maxWidth: 520, margin: "16px auto 0" }}>
                  Have a question about your report, a partnership idea, or just want to say hello? We are here.
                </p>
              </div>
            </BlurFade>

            <div className="grid gap-8 md:grid-cols-5">
              {/* Info cards */}
              <div className="md:col-span-2 space-y-4">
                <BlurFade delay={0.1}>
                  <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <Mail className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-medium text-[var(--ink)]">Email</span>
                    </div>
                    <p className="text-sm text-[var(--ink-2)]">
                      For questions, partnerships, or media inquiries.
                    </p>
                  </div>
                </BlurFade>

                <BlurFade delay={0.15}>
                  <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <Clock className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-medium text-[var(--ink)]">Response time</span>
                    </div>
                    <p className="text-sm text-[var(--ink-2)]">
                      We typically reply within 24-48 hours.
                    </p>
                  </div>
                </BlurFade>

                <BlurFade delay={0.2}>
                  <div className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                        <Users className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm font-medium text-[var(--ink)]">Who we are</span>
                    </div>
                    <p className="text-sm text-[var(--ink-2)]">
                      A small team of believers who believe stewardship starts with knowing how God wired you.
                    </p>
                  </div>
                </BlurFade>
              </div>

              {/* Form */}
              <div className="md:col-span-3">
                <BlurFade delay={0.1}>
                  {status === "sent" ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--accent-line)] bg-[var(--accent-soft)]/30 p-12 text-center" style={{ minHeight: 420 }}>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.5} />
                      </div>
                      <h2 className="tx-display" style={{ fontSize: 28, margin: 0 }}>
                        Thank you
                      </h2>
                      <p className="mt-3 text-[var(--ink-2)]" style={{ maxWidth: 360 }}>
                        Your message has been sent. We will get back to you as soon as possible.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-8 space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium uppercase tracking-widest text-[var(--muted)] mb-2"
                          style={{ fontFamily: "var(--mono)" }}
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full rounded-xl border border-[var(--rule-strong)] bg-[var(--bg)] px-4 py-3 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)]"
                          style={{ fontSize: 15 }}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-medium uppercase tracking-widest text-[var(--muted)] mb-2"
                          style={{ fontFamily: "var(--mono)" }}
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full rounded-xl border border-[var(--rule-strong)] bg-[var(--bg)] px-4 py-3 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)]"
                          style={{ fontSize: 15 }}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-medium uppercase tracking-widest text-[var(--muted)] mb-2"
                          style={{ fontFamily: "var(--mono)" }}
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          className="w-full rounded-xl border border-[var(--rule-strong)] bg-[var(--bg)] px-4 py-3 text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)] resize-y"
                          style={{ fontSize: 15 }}
                          placeholder="What is on your mind?"
                        />
                      </div>
                      {status === "error" && (
                        <p className="text-sm" style={{ color: "#b85a3d" }}>{errorMsg}</p>
                      )}
                      <div className="w-full">
                        <TxButton type="submit" size="lg" disabled={status === "sending"} icon={null}>
                          <span className="inline-flex items-center gap-2">
                            {status === "sending" ? "Sending..." : "Send message"}
                            <Send className="h-4 w-4" />
                          </span>
                        </TxButton>
                      </div>
                    </form>
                  )}
                </BlurFade>
              </div>
            </div>
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
