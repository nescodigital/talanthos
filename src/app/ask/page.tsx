"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Flame, Send, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxEyebrow from "@/components/tx/TxEyebrow";
import EmailGateModal from "@/components/ask/EmailGateModal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface LimitError {
  type: "daily_cap" | "monthly_cap" | "abuse" | "global_cap";
  message: string;
  ctaText: string;
  ctaUrl: string;
  ctaSecondary?: string;
}

const EXAMPLE_QUESTIONS = [
  "What does the Bible say about debt?",
  "How should I think about tithing?",
  "Why does money make me anxious?",
  "Is it wrong to want to be wealthy?",
];

const STORAGE_KEY = "talanthos_ask_messages";
const COOKIE_KEY = "talanthos_ask_session";

function getSessionIdFromCookie(): string | null {
  try {
    const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_KEY + "=([^;]*)"));
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[1]));
      return parsed.sessionId || null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function AskContent() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(3);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const [limitError, setLimitError] = useState<LimitError | null>(null);
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const [hasQuizSession, setHasQuizSession] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load persisted messages
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      /* ignore */
    }

    // Check if user has quiz session
    const sessionId = localStorage.getItem("talanthos_session_id");
    setHasQuizSession(!!sessionId);

    // Check cookie for email capture state
    try {
      const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_KEY + "=([^;]*)"));
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed.email) setEmailCaptured(true);
        setQuestionsRemaining(Math.max(0, (parsed.email ? 10 : 3) - (parsed.anonymousQuestions || 0)));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || limitError) return;
    const question = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          conversationHistory: messages.slice(-10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "rate_limit") {
          setLimitError({
            type: data.type,
            message: data.message,
            ctaText: data.ctaText,
            ctaUrl: data.ctaUrl,
            ctaSecondary: data.ctaSecondary,
          });
          if (data.type === "daily_cap" && !emailCaptured) {
            setEmailGateOpen(true);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.error || "Something went wrong. Please try again." },
          ]);
        }
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      setQuestionsRemaining(data.questionsRemaining ?? 0);

      if (data.emailRequired && !emailCaptured) {
        setEmailGateOpen(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (email: string) => {
    // Create lead via existing API
    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          primary_type: "unknown",
          session_id: getSessionIdFromCookie() || crypto.randomUUID(),
          marketing_consent: false,
        }),
      });
      if (res.ok) {
        // Update cookie with email
        try {
          const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_KEY + "=([^;]*)"));
          const parsed = match ? JSON.parse(decodeURIComponent(match[1])) : {};
          parsed.email = email;
          document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(parsed))}; path=/; max-age=${60 * 60 * 24}; sameSite=lax`;
        } catch {
          /* ignore */
        }
        setEmailCaptured(true);
        setQuestionsRemaining(10);
        setLimitError(null);
        setEmailGateOpen(false);
      } else {
        setEmailGateOpen(false);
      }
    } catch {
      setEmailGateOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const dailyLimit = emailCaptured ? 10 : 3;
  const approachingDaily = questionsRemaining <= 2 && questionsRemaining > 0;
  const approachingMonthly = false;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--bg)]" style={{ fontFamily: "var(--sans)" }}>
      <TxNav />

      {/* Intro */}
      <div className="tx-screen" style={{ paddingBottom: 0 }}>
        <div className="tx-landing-frame">
          <div className="tx-landing-hero" style={{ paddingBottom: 16, gap: 14 }}>
            <TxEyebrow align="center">Ask the Bible Anything</TxEyebrow>
            <h1 className="tx-display" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
              Wisdom is here for you.
            </h1>
            <p className="tx-lede">
              Ask anything from Scripture. Especially about money.
            </p>
            <button
              onClick={() => router.push(hasQuizSession ? "/quiz/result" : "/quiz")}
              className="tx-link tx-link-sm"
              style={{ marginTop: 4 }}
            >
              View My Reading →
            </button>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div
          className="mx-auto w-full"
          style={{ maxWidth: "var(--maxw)", padding: "0 clamp(20px, 5vw, 56px)" }}
        >
          {messages.length === 0 && !limitError && (
            <div className="flex flex-col items-center gap-6 py-6">
              <div
                className="text-center w-full"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--rule)",
                  borderRadius: 14,
                  padding: "28px 24px",
                  boxShadow: "var(--shadow)",
                  maxWidth: 480,
                }}
              >
                <BookOpen className="h-6 w-6 text-[var(--accent)] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-[var(--ink)] text-sm" style={{ fontFamily: "var(--serif)" }}>
                  Ask anything from Scripture. Wisdom is here for you.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5 max-w-md">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="transition-all duration-200 hover:-translate-y-px"
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 13,
                      background: "var(--surface)",
                      border: "1px solid var(--rule)",
                      borderRadius: 999,
                      padding: "10px 18px",
                      color: "var(--ink)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-line)";
                      e.currentTarget.style.background = "var(--surface-2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--rule)";
                      e.currentTarget.style.background = "var(--surface)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 pb-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[82%]">
                    <div className="mt-2 shrink-0">
                      <Flame className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                    </div>
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--rule)",
                        borderRadius: 14,
                        padding: "16px 20px",
                        color: "var(--ink)",
                        boxShadow: "var(--shadow)",
                      }}
                    >
                      <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--serif)" }}>
                        <VerseText text={msg.content} />
                      </p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div
                    className="max-w-[90%] sm:max-w-[82%] text-sm"
                    style={{
                      fontFamily: "var(--serif)",
                      color: "var(--ink)",
                      borderLeft: "2px solid var(--accent)",
                      paddingLeft: 12,
                      lineHeight: 1.6,
                      textAlign: "right",
                    }}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[82%]">
                  <div className="mt-2 shrink-0">
                    <Flame className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  </div>
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--rule)",
                      borderRadius: 14,
                      padding: "16px 20px",
                      boxShadow: "var(--shadow)",
                    }}
                  >
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {limitError && (
              <div className="flex justify-center py-4">
                <div
                  className="w-full text-center"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--rule)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    boxShadow: "var(--shadow)",
                    maxWidth: 480,
                  }}
                >
                  <AlertTriangle className="h-6 w-6 text-[var(--accent)] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-[var(--ink)]" style={{ fontFamily: "var(--serif)" }}>
                    {limitError.message}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {limitError.ctaUrl.startsWith("http") || limitError.ctaUrl.startsWith("/") ? (
                      <button
                        onClick={() => router.push(limitError.ctaUrl)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(40,30,10,0.6)]"
                      >
                        {limitError.ctaText}
                      </button>
                    ) : (
                      <button
                        onClick={() => setEmailGateOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_12px_24px_-16px_rgba(40,30,10,0.6)]"
                      >
                        {limitError.ctaText}
                      </button>
                    )}
                    {limitError.ctaSecondary && (
                      <button
                        onClick={() => setLimitError(null)}
                        className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                      >
                        {limitError.ctaSecondary}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </main>

      {/* Input bar */}
      <footer
        className="shrink-0"
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--rule)",
        }}
      >
        <div
          className="mx-auto w-full"
          style={{ maxWidth: "var(--maxw)", padding: "12px clamp(20px, 5vw, 56px)" }}
        >
          {limitError ? (
            <div
              className="text-center py-2"
              style={{
                fontFamily: "var(--serif)",
                fontSize: 13,
                color: "var(--muted)",
                fontStyle: "italic",
              }}
            >
              Conversation paused. {limitError.ctaText} to continue.
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything from Scripture..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl outline-none transition-colors max-h-[120px]"
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 15,
                    background: "var(--bg)",
                    border: "1px solid var(--rule-strong)",
                    padding: "12px 16px",
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--rule-strong)";
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="mb-0.5 inline-flex items-center justify-center rounded-full text-white transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "var(--accent)",
                    padding: "12px 14px",
                    boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 12px 24px -16px rgba(40,30,10,0.6)",
                  }}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>

              {/* Rate limit indicators */}
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {approachingDaily && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "var(--accent)",
                      }}
                    >
                      {questionsRemaining} question{questionsRemaining !== 1 ? "s" : ""} left today
                    </span>
                  )}
                  {approachingMonthly && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "var(--accent)",
                      }}
                    >
                      Approaching monthly limit — consider Companion for unlimited
                    </span>
                  )}
                  {!approachingDaily && !approachingMonthly && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        color: "var(--muted)",
                      }}
                    >
                      {emailCaptured
                        ? `${questionsRemaining} questions remaining today`
                        : `${questionsRemaining} free questions remaining`}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "var(--muted)",
                  }}
                >
                  {emailCaptured ? "Free tier" : "Anonymous"}
                </span>
              </div>
            </>
          )}
        </div>
      </footer>

      <TxFooter />

      <EmailGateModal
        isOpen={emailGateOpen}
        onClose={() => setEmailGateOpen(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
}

function VerseText({ text }: { text: string }) {
  const parts = text.split(/(\([A-Za-z]+\s+\d+[:\d\-]+\)|\b[A-Za-z]+\s+\d+[:\d\-]+\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\([A-Za-z]+\s+\d+[:\d\-]+\)$/.test(part) || /^[A-Za-z]+\s+\d+[:\d\-]+$/.test(part)) {
          return (
            <span
              key={i}
              className="text-[var(--accent)] font-medium"
              style={{ fontVariant: "small-caps", fontSize: "0.95em" }}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--bg)]">
          <div className="h-10 w-10 animate-spin rounded-full border-2" style={{ borderColor: "var(--rule)", borderTopColor: "var(--accent)" }} />
        </div>
      }
    >
      <AskContent />
    </Suspense>
  );
}
