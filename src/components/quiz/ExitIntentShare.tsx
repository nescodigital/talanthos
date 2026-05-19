"use client";

import { useEffect, useState, useCallback } from "react";
import { BiblicalTypeData } from "@/lib/quiz/types";

interface ExitIntentShareProps {
  typeData: BiblicalTypeData;
}

export default function ExitIntentShare({ typeData }: ExitIntentShareProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "https://talanthos.com/quiz/result";
  const fullMessage = `${typeData.shareMessage} ${url}`;
  const encodedMessage = encodeURIComponent(fullMessage);

  const showPopup = useCallback(() => {
    if (dismissed) return;
    setVisible(true);
  }, [dismissed]);

  useEffect(() => {
    // Desktop: mouse leave toward top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && e.relatedTarget === null) {
        showPopup();
      }
    };

    // Mobile: scroll up near top (back-button intent proxy)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollY;
      const nearTop = currentScrollY < 100;
      if (scrollingUp && nearTop) {
        showPopup();
      }
      lastScrollY = currentScrollY;
    };

    // Universal: 2-minute timer fallback
    const timer = setTimeout(() => {
      showPopup();
    }, 120000);

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [showPopup]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = fullMessage;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(28, 26, 20, 0.55)",
        backdropFilter: "blur(6px)",
        padding: "20px",
      }}
      onClick={handleDismiss}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: 18,
          padding: "clamp(24px, 4vw, 40px)",
          maxWidth: 460,
          width: "100%",
          position: "relative",
          animation: "txFadeInUp 0.35s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            color: "var(--muted)",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          Share the discovery
        </p>

        <h3
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(20px, 2.2vw, 26px)",
            lineHeight: 1.25,
            color: "var(--ink)",
            margin: "0 0 14px",
          }}
        >
          Who else should know their Biblical Money Type?
        </h3>

        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: 15,
            lineHeight: 1.5,
            color: "var(--ink-soft)",
            margin: "0 0 20px",
            fontStyle: "italic",
          }}
        >
          {typeData.shareMessage}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <a
            href={`https://wa.me/?text=${encodedMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-btn tx-btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 14,
              padding: "12px 16px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent("What's your Biblical Money Type?")}&body=${encodedMessage}`}
            className="tx-btn tx-btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 14,
              padding: "12px 16px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email
          </a>

          <a
            href={`sms:?body=${encodedMessage}`}
            className="tx-btn tx-btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 14,
              padding: "12px 16px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            SMS
          </a>

          <button
            onClick={handleCopy}
            className="tx-btn tx-btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 14,
              padding: "12px 16px",
              background: copied ? "var(--accent)" : undefined,
              color: copied ? "var(--surface)" : undefined,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--muted)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Or tap outside to close
        </p>
      </div>
    </div>
  );
}
