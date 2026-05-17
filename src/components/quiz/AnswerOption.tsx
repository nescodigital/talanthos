"use client";

import { motion } from "framer-motion";
import { AnswerLetter } from "@/lib/quiz/questions";

interface AnswerOptionProps {
  letter: AnswerLetter;
  text: string;
  index: number;
  onSelect: (letter: AnswerLetter) => void;
}

export default function AnswerOption({ letter, text, index, onSelect }: AnswerOptionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={() => onSelect(letter)}
      className="flex w-full items-start gap-4 rounded-xl border border-border bg-bg-elevated p-6 text-left transition-all hover:border-accent hover:bg-bg-elevated/80"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground-muted">
        {letter}
      </span>
      <span className="text-base leading-relaxed text-foreground">{text}</span>
    </motion.button>
  );
}
