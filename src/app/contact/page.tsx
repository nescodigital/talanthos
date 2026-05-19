"use client";

import { useState } from "react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import TxEyebrow from "@/components/tx/TxEyebrow";
import TxRule from "@/components/tx/TxRule";

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
          <div className="tx-intro-frame" style={{ maxWidth: 560 }}>
            <TxEyebrow align="center">Get in touch</TxEyebrow>
            <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", textAlign: "center" }}>
              Contact
            </h1>
            <TxRule width={60} />
            <p className="tx-lede" style={{ textAlign: "center" }}>
              Have a question, partnership idea, or just want to say hello? We read every message.
            </p>

            {status === "sent" ? (
              <div
                className="tx-card tx-card-warm"
                style={{ textAlign: "center", marginTop: 24 }}
              >
                <p style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink)", margin: 0 }}>
                  Thank you. Your message has been sent.
                </p>
                <p style={{ fontSize: 14, color: "var(--muted)", margin: "8px 0 0" }}>
                  We will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="tx-card" style={{ marginTop: 24, gap: 16 }}>
                <div>
                  <label
                    htmlFor="name"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "var(--muted)",
                    }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      border: "1px solid var(--rule-strong)",
                      background: "var(--bg)",
                      color: "var(--ink)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 15,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "var(--muted)",
                    }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      border: "1px solid var(--rule-strong)",
                      background: "var(--bg)",
                      color: "var(--ink)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 15,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "var(--muted)",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      border: "1px solid var(--rule-strong)",
                      background: "var(--bg)",
                      color: "var(--ink)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 15,
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                {status === "error" && (
                  <p style={{ color: "#b85a3d", fontSize: 14, margin: 0 }}>{errorMsg}</p>
                )}
                <TxButton type="submit" size="lg" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message"}
                </TxButton>
              </form>
            )}
          </div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
