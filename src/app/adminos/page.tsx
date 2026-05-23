"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminLogin from "./login";

type Period = "1" | "7" | "30" | "90";
type Tab = "overview" | "leads" | "orders" | "sessions";

interface Stats {
  totalSessions: number;
  completedSessions: number;
  totalLeads: number;
  totalOrders: number;
  revenueUsd: string;
  sessionsByDay: { date: string; sessions: number; completed: number }[];
  recentSessions: any[];
}

const ACCENT = "#b88a4a";
const BG = "#f3ece0";
const CARD = "#fff";
const BORDER = "rgba(28,26,20,0.08)";
const TXT = "#1c1a14";
const TXT_MID = "#46412f";
const TXT_SUB = "#7a7359";

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
  const [search, setSearch] = useState("");

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
      const [statsRes, leadsRes, ordersRes, sessionsRes] = await Promise.all([
        fetch(`/api/admin/stats?days=${p}`, { headers }),
        fetch(`/api/admin/leads?limit=200`, { headers }),
        fetch(`/api/admin/orders?limit=200`, { headers }),
        fetch(`/api/admin/sessions?limit=200`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders);
      if (sessionsRes.ok) setSessions((await sessionsRes.json()).sessions);
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

  const s = stats;
  const convRate = s && s.totalSessions > 0 ? ((s.completedSessions / s.totalSessions) * 100).toFixed(1) : "0";

  const filteredLeads = leads.filter((l) =>
    search ? l.email?.toLowerCase().includes(search.toLowerCase()) : true
  );
  const filteredOrders = orders.filter((o) =>
    search ? o.email?.toLowerCase().includes(search.toLowerCase()) : true
  );
  const filteredSessions = sessions.filter((s) =>
    search
      ? s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.first_name?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: CARD,
          borderBottom: `1px solid ${BORDER}`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 18,
              letterSpacing: "0.12em",
              color: TXT,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Talanthos
          </span>
          <span style={{ fontSize: 10, color: TXT_SUB, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              overflow: "hidden",
              background: BG,
            }}
          >
            {(["1", "7", "30", "90"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  background: period === p ? ACCENT : "transparent",
                  color: period === p ? "#fff" : TXT_MID,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p === "1" ? "24h" : `${p}d`}
              </button>
            ))}
          </div>
          <button
            onClick={() => fetchAll(password, period)}
            disabled={loading}
            style={{
              border: `1px solid ${BORDER}`,
              background: CARD,
              borderRadius: 10,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 14,
              color: TXT_MID,
              opacity: loading ? 0.5 : 1,
            }}
            title="Refresh"
          >
            ↻
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin_pw_talanthos");
              setAuthed(false);
              setPassword("");
            }}
            style={{
              border: `1px solid ${BORDER}`,
              background: CARD,
              borderRadius: 10,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: TXT_MID,
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
          padding: "0 24px",
          borderBottom: `1px solid ${BORDER}`,
          background: CARD,
          overflowX: "auto",
        }}
      >
        {([
          { key: "overview" as Tab, label: "Overview" },
          { key: "leads" as Tab, label: `Leads (${leads.length})` },
          { key: "orders" as Tab, label: `Orders (${orders.length})` },
          { key: "sessions" as Tab, label: `Sessions (${sessions.length})` },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "12px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: "transparent",
              color: tab === t.key ? TXT : TXT_SUB,
              borderBottom: tab === t.key ? `2px solid ${ACCENT}` : "2px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "overview" && (
          <>
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                { label: "Quiz Sessions", value: s?.totalSessions ?? 0, color: TXT },
                { label: "Completed", value: s?.completedSessions ?? 0, color: ACCENT },
                { label: "Leads", value: s?.totalLeads ?? 0, color: "#5a7d5a" },
                { label: "Orders", value: s?.totalOrders ?? 0, color: "#7a5a5a" },
                { label: "Revenue", value: `$${s?.revenueUsd ?? "0.00"}`, color: TXT },
                { label: "Completion Rate", value: `${convRate}%`, color: ACCENT },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    background: CARD,
                    borderRadius: 12,
                    padding: "18px 16px",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: TXT_SUB,
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      color: c.color,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {typeof c.value === "number" ? c.value.toLocaleString() : c.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid: chart + recent */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: 12,
              }}
            >
              {/* Chart */}
              <div
                style={{
                  gridColumn: "span 7",
                  background: CARD,
                  borderRadius: 12,
                  padding: 20,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: TXT_MID,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Sessions by Day
                </div>
                {s && s.sessionsByDay.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={s.sessionsByDay}>
                      <defs>
                        <linearGradient id="txSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: TXT_SUB }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: string) => v.slice(5)}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: TXT_SUB }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: CARD,
                          border: `1px solid ${BORDER}`,
                          borderRadius: 8,
                          fontSize: 12,
                          color: TXT,
                        }}
                        labelStyle={{ color: TXT_MID }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke={ACCENT}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#txSessions)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: "center", padding: 40, color: TXT_SUB }}>No data</div>
                )}
              </div>

              {/* Conversion mini-funnel */}
              <div
                style={{
                  gridColumn: "span 5",
                  background: CARD,
                  borderRadius: 12,
                  padding: 20,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: TXT_MID,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 16,
                  }}
                >
                  Funnel
                </div>
                {s && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Sessions", value: s.totalSessions, color: TXT },
                      { label: "Completed Quiz", value: s.completedSessions, color: ACCENT },
                      { label: "Leads", value: s.totalLeads, color: "#5a7d5a" },
                      { label: "Orders", value: s.totalOrders, color: "#7a5a5a" },
                    ].map((step, i, arr) => {
                      const prev = i > 0 ? arr[i - 1].value : step.value;
                      const pct = prev > 0 ? (step.value / prev) * 100 : 0;
                      const totalPct = s.totalSessions > 0 ? (step.value / s.totalSessions) * 100 : 0;
                      return (
                        <div key={step.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: TXT_MID, fontWeight: 500 }}>{step.label}</span>
                            <span style={{ fontSize: 12, color: step.color, fontWeight: 700 }}>
                              {step.value.toLocaleString()}
                              <span style={{ color: TXT_SUB, fontWeight: 400, marginLeft: 4 }}>
                                ({totalPct.toFixed(1)}%)
                              </span>
                            </span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "#e5dfd4", overflow: "hidden" }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: step.color,
                                borderRadius: 3,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Sessions — full width */}
              <div
                style={{
                  gridColumn: "1 / -1",
                  background: CARD,
                  borderRadius: 12,
                  padding: 20,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: TXT }}>Recent Sessions</span>
                  <span style={{ fontSize: 11, color: TXT_SUB }}>
                    {s?.recentSessions?.length ?? 0} entries
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Name", "Email", "Type", "Status", "Date"].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "left",
                              padding: "10px 12px",
                              color: TXT_SUB,
                              fontWeight: 600,
                              fontSize: 10,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(s?.recentSessions ?? []).slice(0, 20).map((row: any, i: number) => (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: `1px solid ${BORDER}`,
                            background: i % 2 === 0 ? "transparent" : "rgba(28,26,20,0.02)",
                          }}
                        >
                          <td style={{ padding: "10px 12px", color: TXT }}>{row.first_name || "—"}</td>
                          <td style={{ padding: "10px 12px", color: TXT }}>{row.email || "—"}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                textTransform: "capitalize",
                                color: ACCENT,
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              {row.primary_type || "—"}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: row.status === "completed" ? "#5a7d5a" : TXT_SUB,
                                background: row.status === "completed" ? "rgba(90,125,90,0.08)" : "transparent",
                                padding: "2px 8px",
                                borderRadius: 4,
                              }}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: TXT_SUB, fontSize: 12, whiteSpace: "nowrap" }}>
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "leads" && (
          <DataTable
            data={filteredLeads}
            columns={[
              { key: "email", label: "Email" },
              { key: "first_name", label: "Name" },
              { key: "primary_type", label: "Type", format: (v: string) => v || "—" },
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
              {
                key: "purchased",
                label: "Status",
                format: (v: boolean) => (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: v ? "#5a7d5a" : TXT_SUB,
                      background: v ? "rgba(90,125,90,0.08)" : "transparent",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {v ? "Paid" : "Pending"}
                  </span>
                ),
              },
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
              { key: "primary_type", label: "Type", format: (v: string) => v || "—" },
              { key: "builder_score", label: "B" },
              { key: "guardian_score", label: "G" },
              { key: "giver_score", label: "V" },
              { key: "visionary_score", label: "Vi" },
              {
                key: "status",
                label: "Status",
                format: (v: string) => (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: v === "completed" ? "#5a7d5a" : TXT_SUB,
                      background: v === "completed" ? "rgba(90,125,90,0.08)" : "transparent",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {v}
                  </span>
                ),
              },
              { key: "created_at", label: "Date", format: (v: string) => new Date(v).toLocaleDateString() },
            ]}
            search={search}
            onSearch={setSearch}
            searchPlaceholder="Search name or email..."
          />
        )}
      </main>
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
  columns: { key: string; label: string; format?: (v: any) => React.ReactNode }[];
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
            border: `1px solid ${BORDER}`,
            background: CARD,
            color: TXT,
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div
        style={{
          background: CARD,
          borderRadius: 12,
          padding: 16,
          border: `1px solid ${BORDER}`,
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    color: TXT_SUB,
                    fontWeight: 600,
                    fontSize: 10,
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
                <td colSpan={columns.length} style={{ padding: 32, textAlign: "center", color: TXT_SUB }}>
                  No data found
                </td>
              </tr>
            )}
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                style={{
                  borderBottom: `1px solid ${BORDER}`,
                  background: i % 2 === 0 ? "transparent" : "rgba(28,26,20,0.02)",
                }}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ padding: "10px 12px", color: TXT, whiteSpace: "nowrap" }}>
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
