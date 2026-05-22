"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Users, Church, Calendar, Heart, Wallet } from "lucide-react";
import TxNav from "@/components/tx/TxNav";
import TxFooter from "@/components/tx/TxFooter";
import TxButton from "@/components/tx/TxButton";
import TxRule from "@/components/tx/TxRule";

const DEMO_QUESTIONS = [
  {
    id: "gender",
    label: "You are",
    icon: Users,
    options: [
      { value: "", text: "Select…" },
      { value: "male", text: "A man" },
      { value: "female", text: "A woman" },
    ],
  },
  {
    id: "denomination",
    label: "Your faith tradition",
    icon: Church,
    options: [
      { value: "", text: "Select…" },
      { value: "catholic", text: "Roman Catholic" },
      { value: "orthodox", text: "Eastern Orthodox" },
      { value: "protestant-liturgical", text: "Protestant: Lutheran, Anglican, Presbyterian, Methodist, Reformed" },
      { value: "protestant-evangelical", text: "Protestant: Baptist, Evangelical, Non-denominational" },
      { value: "pentecostal", text: "Pentecostal / Charismatic" },
      { value: "other-christian", text: "Another Christian tradition" },
      { value: "exploring", text: "Exploring faith / Not Christian" },
    ],
  },
  {
    id: "age",
    label: "Your age",
    icon: Calendar,
    options: [
      { value: "", text: "Select…" },
      { value: "18-24", text: "18–24" },
      { value: "25-34", text: "25–34" },
      { value: "35-44", text: "35–44" },
      { value: "45-54", text: "45–54" },
      { value: "55-64", text: "55–64" },
      { value: "65+", text: "65 or older" },
    ],
  },
  {
    id: "marital",
    label: "Your marital status",
    icon: Heart,
    options: [
      { value: "", text: "Select…" },
      { value: "single", text: "Single, never married" },
      { value: "engaged", text: "Engaged" },
      { value: "married", text: "Married" },
      { value: "divorced", text: "Divorced" },
      { value: "widowed", text: "Widowed" },
    ],
  },
  {
    id: "children",
    label: "Do you have children?",
    icon: Users,
    options: [
      { value: "", text: "Select…" },
      { value: "none", text: "No children" },
      { value: "1", text: "1 child" },
      { value: "2", text: "2 children" },
      { value: "3+", text: "3 or more children" },
    ],
  },
  {
    id: "financial-situation",
    label: "Current financial situation",
    icon: Wallet,
    options: [
      { value: "", text: "Select…" },
      { value: "struggling", text: "Struggling, barely making ends meet" },
      { value: "stable", text: "Stable, covering basics with little margin" },
      { value: "comfortable", text: "Comfortable, meeting needs with some room" },
      { value: "abundant", text: "Abundant, more than enough" },
    ],
  },
];

export default function DemographicsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSkip = () => {
    router.push("/quiz/calculating");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const sessionId = localStorage.getItem("talanthos_session_id");

    if (sessionId) {
      // Save any answered demographics
      for (const [questionId, value] of Object.entries(answers)) {
        if (!value) continue;
        await fetch("/api/quiz/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            question_number: 10 + DEMO_QUESTIONS.findIndex((q) => q.id === questionId),
            question_id: questionId,
            answer_letter: null,
            answer_value: value,
          }),
        }).catch(() => {});
      }
    }

    router.push("/quiz/calculating");
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;

  return (
    <div className="tx-page">
      <TxNav />
      <div className="tx-route">
        <main className="tx-screen tx-quiz">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[560px] mx-auto"
            style={{ padding: "clamp(32px, 6vw, 64px) 16px" }}
          >
            <div className="text-center mb-8">
              <p
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                One last step
              </p>
              <h2
                className="tx-display mt-3"
                style={{ fontSize: "clamp(26px, 3.6vw, 38px)", lineHeight: 1.15 }}
              >
                Help us understand our community
              </h2>
              <p
                className="mt-3"
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(15px, 1.5vw, 17px)",
                  lineHeight: 1.55,
                  color: "var(--ink-soft)",
                }}
              >
                These questions are <strong>completely optional</strong>. They help us tailor future resources
                for believers like you. Skip them anytime.
              </p>
              <TxRule width={50} className="mt-5 mx-auto" />
            </div>

            <div className="space-y-5">
              {DEMO_QUESTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <div key={q.id}>
                    <label className="flex items-center gap-2 text-sm text-[var(--ink-2)] mb-2">
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                      {q.label}
                    </label>
                    <select
                      value={answers[q.id] || ""}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      className="w-full rounded-xl border border-[var(--rule-strong)] bg-[var(--bg)] py-3 px-4 text-[var(--ink)] outline-none transition-colors duration-200 focus:border-[var(--accent)] text-sm appearance-none"
                      style={{ fontFamily: "var(--sans)" }}
                    >
                      {q.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 space-y-4">
              <TxButton onClick={handleSubmit} size="lg" disabled={isSubmitting} icon={null}>
                {isSubmitting
                  ? "Saving..."
                  : answeredCount > 0
                    ? `See my result (${answeredCount}/6 answered)`
                    : "See my result"}
              </TxButton>

              <button
                onClick={handleSkip}
                className="w-full text-center text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors py-2 flex items-center justify-center gap-1.5"
              >
                Skip these questions
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </main>
      </div>
      <TxFooter />
    </div>
  );
}
