"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Flame, Send, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
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
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[720px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent)] font-bold text-sm tracking-wider uppercase">Talanthos</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[var(--muted)] italic" style={{ fontFamily: "var(--serif)" }}>
              Ask the Bible anything. Especially about money.
            </span>
            <button
              onClick={() => router.push(hasQuizSession ? "/quiz/result" : "/quiz")}
              className="text-xs font-medium text-[var(--accent)] hover:underline whitespace-nowrap"
            >
              View My Reading
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div
        className="shrink-0"
        style={{
          background: "linear-gradient(135deg, #1a1a1f 0%, #2a2620 50%, #1a1a1f 100%)",
          padding: "clamp(24px, 5vw, 48px) 16px",
          textAlign: "center",
        }}
      >
        <h1
          className="text-white m-0"
          style={{ fontFamily: "var(--serif)", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400, lineHeight: 1.2 }}
        >
          Ask the Bible Anything
        </h1>
        <p className="mt-2 text-sm text-white/60" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          Wisdom is here for you.
        </p>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-4 py-6">
          {messages.length === 0 && !limitError && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div
                className="text-center rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 max-w-md"
                style={{ boxShadow: "var(--shadow)" }}
              >
                <BookOpen className="h-6 w-6 text-[var(--accent)] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-[var(--ink)] text-sm" style={{ fontFamily: "var(--serif)" }}>
                  Ask anything from Scripture. Wisdom is here for you.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-2 text-xs text-[var(--ink)] hover:border-[var(--accent-line)] hover:bg-[var(--accent-soft)]/20 transition-colors"
                    style={{ fontFamily: "var(--serif)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[80%]">
                    <div className="mt-1 shrink-0">
                      <Flame className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-white border border-[var(--rule)]"
                      style={{ color: "var(--ink)" }}
                    >
                      <VerseText text={msg.content} />
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div
                    className="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm"
                    style={{ background: "#f5efe2", color: "var(--ink)" }}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[80%]">
                  <div className="mt-1 shrink-0">
                    <Flame className="h-4 w-4 text-[var(--accent)]" strokeWidth={1.5} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-[var(--rule)]">
                    <div className="flex gap-1">
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
                  className="w-full max-w-md rounded-2xl border border-[var(--rule)] bg-[var(--surface)] p-6 text-center"
                  style={{ boxShadow: "var(--shadow)" }}
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

      {/* Footer / Input */}
      <footer className="shrink-0 bg-[var(--surface)] border-t border-[var(--rule)]">
        <div className="mx-auto max-w-[720px] px-4 py-3">
          {limitError ? (
            <div className="text-center py-2 text-xs text-[var(--muted)]" style={{ fontFamily: "var(--serif)" }}>
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
                  className="flex-1 resize-none rounded-xl border border-[var(--rule-strong)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--ink)] placeholder-[var(--muted)]/50 outline-none transition-colors focus:border-[var(--accent)] max-h-[120px]"
                  style={{ fontFamily: "var(--sans)" }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="mb-0.5 inline-flex items-center justify-center rounded-full bg-[var(--accent)] p-3 text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_16px_-12px_rgba(40,30,10,0.5)] disabled:opacity-40"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>

              {/* Rate limit indicators */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {approachingDaily && (
                    <span className="text-[11px] text-[var(--accent)] font-medium">
                      {questionsRemaining} question{questionsRemaining !== 1 ? "s" : ""} left today
                    </span>
                  )}
                  {approachingMonthly && (
                    <span className="text-[11px] text-[var(--accent)] font-medium">
                      Approaching monthly limit — consider Companion for unlimited
                    </span>
                  )}
                  {!approachingDaily && !approachingMonthly && (
                    <span className="text-[11px] text-[var(--muted)]">
                      {emailCaptured
                        ? `${questionsRemaining} questions remaining today`
                        : `${questionsRemaining} free questions remaining`}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[var(--muted)]" style={{ fontFamily: "var(--mono)" }}>
                  {emailCaptured ? "Free tier" : "Anonymous"}
                </span>
              </div>
            </>
          )}
        </div>
      </footer>

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
