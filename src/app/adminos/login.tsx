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
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
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
          <div style={{ fontSize: 13, color: "#7a7359" }}>Admin Panel</div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(password);
          }}
          style={{
            background: "#fff",
            border: "1px solid rgba(28,26,20,0.08)",
            borderRadius: 16,
            padding: "28px 24px",
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "rgba(196,92,74,0.08)",
                border: "1px solid rgba(196,92,74,0.2)",
                borderRadius: 8,
                fontSize: 13,
                color: "#c45c4a",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "#7a7359",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
                fontWeight: 600,
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
                padding: "11px 14px",
                fontSize: 14,
                borderRadius: 10,
                border: "1px solid rgba(28,26,20,0.12)",
                background: "#faf8f4",
                color: "#1c1a14",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              background: "#b88a4a",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? "default" : "pointer",
              opacity: loading || !password ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
