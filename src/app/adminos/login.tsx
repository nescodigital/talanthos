"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error?: string;
  loading?: boolean;
}

export default function AdminLogin({ onLogin, error, loading }: AdminLoginProps) {
  const [password, setPassword] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3ece0",
        padding: 24,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(password);
        }}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#fff",
          borderRadius: 16,
          padding: "40px 32px",
          boxShadow: "0 4px 24px rgba(28,26,20,0.08)",
          border: "1px solid rgba(28,26,20,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              letterSpacing: "0.18em",
              color: "#1c1a14",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Talanthos
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "#b88a4a",
              textTransform: "uppercase",
            }}
          >
            Admin
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7a7359",
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: "100%",
              padding: "12px 14px",
              fontSize: 15,
              borderRadius: 10,
              border: "1px solid #d4c8b0",
              background: "#faf8f4",
              color: "#1c1a14",
              outline: "none",
              fontFamily: "inherit",
            }}
            placeholder="Enter admin password"
          />
        </div>

        {error && (
          <p style={{ color: "#c45c4a", fontSize: 13, marginBottom: 16, textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            border: "none",
            background: "#1c1a14",
            color: "#f3ece0",
            cursor: "pointer",
            opacity: loading || !password ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Verifying..." : "Enter Dashboard"}
        </button>
      </form>
    </div>
  );
}
