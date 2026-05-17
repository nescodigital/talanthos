"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const messages = [
  "Analyzing your answers...",
  "Cross-referencing with Scripture...",
  "Identifying your Biblical Money Type...",
];

export default function CalculatingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= messages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    const timeout = setTimeout(() => {
      router.push("/quiz/intro-result");
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
        <p className="font-display text-xl text-foreground transition-all duration-500">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
}
