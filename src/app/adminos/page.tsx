"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLogin from "./login";

type Period = "1" | "7" | "30" | "90";
type Tab = "overview" | "leads" | "orders" | "sessions" | "messages";

interface Stats {
  totalSessions: number;
  completedSessions: number;
  totalLeads: number;
  totalOrders: number;
  revenueUsd: string;
  sessionsByDay: { date: string; sessions: number; completed: number }[];
  recentSessions: any[];
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("7");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Auto-auth from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_pw_talanthos");
    if (saved) {
      setPassword(saved);
      verifyAndFetch(saved, "7");
    }
  }, []);

  const verifyAndFetch = useCallback(async (pw: string, p: Period) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        setError("Invalid password");
        setAuthed(false);
        return;
      }
      setAuthed(true);
      localStorage.setItem("admin_pw_talanthos", pw);
      fetchAll(pw, p);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  async function fetchAll(pw: string, p: Period) {
    const headers = { "x-admin-password": pw };
    try {
      const [statsRes, leadsRes, ordersRes, sessionsRes, messagesRes] = await Promise.all([
        fetch(`/api/admin/stats?days=${p}`, { headers }),
        fetch(`/api/admin/leads?limit=100`, { headers }),
        fetch(`/api/admin/orders?limit=100`, { headers }),
        fetch(`/api/admin/sessions?limit=100`, { headers }),
        fetch(`/api/admin/contact-messages`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
      if (sessionsRes.ok) setSessions((await sessionsRes.json()).sessions);
      if (messagesRes.ok) setMessages((await messagesRes.json()).messages);
    } catch (err) {
      console.error("[admin fetch]", err);
    }
  }

  function handleLogin(pw: string) {
    verifyAndFetch(pw, period);
  }

  function handlePeriodChange(p: Period) {
    setPeriod(p);
    if (authed && password) fetchAll(password, p);
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} error={error} loading={loading} />;
  }

  const filteredLeads = leads.filter((l) =>
    search ? l.email?.toLowerCase().includes(search.toLowerCase()) : true
  );
  const filteredOrders = orders.filter((o) =>
    search ? o.email?.toLowerCase().includes(search.toLowerCase()) : true
  );
  const filteredSessions = sessions.filter((s) =>
    search ? s.email?.toLowerCase().includes(search.toLowerCase()) || s.first_name?.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f3ece0", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <header
        style={{
          background: "#1c1a14",
          color: "#f3ece0",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 18, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Talanthos
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b88a4a" }}>
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as Period)}
            style={{
              background: "transparent",
              color: "#f3ece0",
              border: "1px solid rgba(243,236,224,0.2)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <option value="1" style={{ color: "#1c1a14" }}>Last 24h</option>
            <option value="7" style={{ color: "#1c1a14" }}>Last 7 days</option>
            <option value="30" style={{ color: "#1c1a14" }}>Last 30 days</option>
            <option value="90" style={{ color: "#1c1a14" }}>Last 90 days</option>
          </select>
          <button
            onClick={() => {
              localStorage.removeItem("admin_pw_talanthos");
              setAuthed(false);
              setPassword("");
            }}
            style={{
              background: "transparent",
              border: "1px solid rgba(243,236,224,0.2)",
              color: "#f3ece0",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav
        style={{
          display: "flex",
          gap: 4,
          padding: "12px 24px 0",
          borderBottom: "1px solid rgba(28,26,20,0.08)",
          background: "#f3ece0",
        }}
      >
        {([
          { key: "overview", label: "Overview" },
          { key: "leads", label: `Leads (${leads.length})` },
          { key: "orders", label: `Orders (${orders.length})` },
          { key: "sessions", label: `Sessions (${sessions.length})` },
          { key: "messages", label: `Messages (${messages.length})` },
        ] as { key: Tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: "transparent",
              color: tab === t.key ? "#1c1a14" : "#7a7359",
              borderBottom: tab === t.key ? "2px solid #b88a4a" : "2px solid transparent",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab stats={stats} />}
        {tab === "leads" && (
          <DataTable
            data={filteredLeads}
            columns={[
              { key: "email", label: "Email" },
              { key: "first_name", label: "Name" },
              { key: "primary_type", label: "Type" },
              { key: "marketing_consent", label: "Consent", format: (v: boolean) => (v ? "✓" : "—") },
              { key: "created_at", label: "Date", format: (v: string) => new Date(v).toLocaleDateString() },
            ]}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search email..."
          />
        )}
        {tab === "orders" && (
          <DataTable
            data={filteredOrders}
            columns={[
              { key: "email", label: "Email" },
              { key: "amount_total_cents", label: "Amount", format: (v: number) => `$${((v || 0) / 100).toFixed(2)}` },
              { key: "purchased", label: "Status", format: (v: boolean) => (v ? "Paid" : "Pending") },
              { key: "pdf_generated", label: "PDF", format: (v: boolean) => (v ? "✓" : "—") },
              { key: "created_at", label: "Date", format: (v: string) => new Date(v).toLocaleDateString() },
            ]}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search email..."
          />
        )}
        {tab === "sessions" && (
          <DataTable
            data={filteredSessions}
            columns={[
              { key: "first_name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "primary_type", label: "Type" },
              { key: "builder_score", label: "B" },
              { key: "guardian_score", label: "G" },
              { key: "giver_score", label: "V" },
              { key: "visionary_score", label: "Vi" },
              { key: "status", label: "Status" },
              { key: "created_at", label: "Date", format: (v: string) => new Date(v).toLocaleDateString() },
            ]}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name or email..."
          />
        )}
        {tab === "messages" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              textAlign: "center",
              color: "#7a7359",
            }}
          >
            <p style={{ fontSize: 15, marginBottom: 8 }}>
              Contact messages are currently sent via email only.
            </p>
            <p style={{ fontSize: 13 }}>
              To store them here, add a <code>contact_messages</code> table to Supabase.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#7a7359" }}>Loading stats...</div>
    );
  }

  const cards = [
    { label: "Quiz Sessions", value: stats.totalSessions.toLocaleString(), color: "#1c1a14" },
    { label: "Completed", value: stats.completedSessions.toLocaleString(), color: "#b88a4a" },
    { label: "Leads", value: stats.totalLeads.toLocaleString(), color: "#5a7d5a" },
    { label: "Orders", value: stats.totalOrders.toLocaleString(), color: "#7a5a5a" },
    { label: "Revenue", value: `$${stats.revenueUsd}`, color: "#1c1a14" },
  ];

  const maxDay = Math.max(...stats.sessionsByDay.map((d) => d.sessions), 1);

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "20px 16px",
              border: "1px solid rgba(28,26,20,0.06)",
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a7359", marginBottom: 8 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: c.color, letterSpacing: "-0.02em" }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Daily bar chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          border: "1px solid rgba(28,26,20,0.06)",
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a7359", marginBottom: 16 }}>
          Sessions by Day
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 120 }}>
          {stats.sessionsByDay.map((d, i) => {
            const h = maxDay > 0 ? Math.max(4, Math.round((d.sessions / maxDay) * 120)) : 4;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  title={`${d.date}: ${d.sessions} sessions, ${d.completed} completed`}
                  style={{
                    width: "100%",
                    height: h,
                    borderRadius: 4,
                    background: d.sessions > 0 ? "#b88a4a" : "#e5dfd4",
                    transition: "height 0.3s ease",
                    minHeight: 4,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {stats.sessionsByDay.map((d, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#9c9689" }}>
              {d.date.slice(5)}
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid rgba(28,26,20,0.06)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a7359", marginBottom: 16 }}>
          Recent Sessions
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5dfd4" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#7a7359", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#7a7359", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#7a7359", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#7a7359", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#7a7359", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSessions.slice(0, 20).map((s: any) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f3ece0" }}>
                  <td style={{ padding: "10px 12px", color: "#1c1a14" }}>{s.first_name || "—"}</td>
                  <td style={{ padding: "10px 12px", color: "#1c1a14" }}>{s.email || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ textTransform: "capitalize", color: "#b88a4a", fontWeight: 600 }}>{s.primary_type || "—"}</span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: s.status === "completed" ? "#5a7d5a" : "#7a7359",
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#7a7359", fontSize: 12 }}>
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DataTable({
  data,
  columns,
  search,
  onSearch,
  searchPlaceholder,
}: {
  data: any[];
  columns: { key: string; label: string; format?: (v: any) => string }[];
  search: string;
  onSearch: (s: string) => void;
  searchPlaceholder: string;
}) {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={searchPlaceholder}
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "10px 14px",
            fontSize: 14,
            borderRadius: 10,
            border: "1px solid #d4c8b0",
            background: "#fff",
            color: "#1c1a14",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid rgba(28,26,20,0.06)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5dfd4" }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: "#7a7359",
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: "#7a7359" }}>
                  No data found
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr key={row.id || i} style={{ borderBottom: "1px solid #f3ece0" }}>
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: "10px 12px", color: "#1c1a14", whiteSpace: "nowrap" }}>
                    {c.format ? c.format(row[c.key]) : row[c.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
