/* ==== KayG App (Tier 1 + Tier 2 Pro) =======================================
   This file is a drop-in replacement for your existing src/App.jsx.
   It preserves all Tier-1 features and adds a new "Pro" tab with eight modules.
=========================================================================== */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  // Benchmarking
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
  // Pro charts
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";

/* =========================================================
   ONE-TIME FONT INJECTION (Poppins 400/600)
   ========================================================= */
function usePoppinsFont() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "kayg-font-poppins";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);
}

/* =========================================================
   Typewriter
   ========================================================= */
function useTypewriter(text, { speed = 24, loop = false } = {}) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0, dir = 1, raf;
    let last = performance.now();
    const step = (now) => {
      if (now - last >= speed) {
        last = now;
        i += dir;
        if (i < 0) i = 0;
        if (i > text.length) {
          if (!loop) { setOut(text); return; }
          dir = -1; i = text.length;
        }
        setOut(text.slice(0, i));
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, speed, loop]);
  return out;
}

/* =========================
   Tier-1 KPI + Sentiment Datasets
   ========================= */
const kpiData = [
  { name: "AI Adoption Rate", value: 67, change: 3, icon: "🤖" },
  { name: "Remote Work Penetration", value: 54, change: -2, icon: "🏠" },
  { name: "HR Tech Investment", value: 4.2, change: 1, icon: "💼", currency: "B" },
];

const sentimentMoM = [
  { month: "Jan", sentiment: 60 },
  { month: "Feb", sentiment: 65 },
  { month: "Mar", sentiment: 58 },
  { month: "Apr", sentiment: 62 },
  { month: "May", sentiment: 68 },
  { month: "Jun", sentiment: 64 },
];

/* =========================
   Companies + Leaders (Tier 1)
   ========================= */
const companies = [
  {
    key: "MERCER",
    name: "Mercer",
    initials: "M",
    color: "#2F80ED",
    revenue: "$5.7B",
    growth: "↑ 6%",
    tags: ["Career", "Rewards", "Consulting"],
    sentimentNow: 72,
    newsVelocity: [
      { date: "2025-01-05", value: 8, source: { title: "AI-enabled skills framework", site: "PR", url: "https://example.com/mercer-ai" } },
      { date: "2025-02-12", value: 10, source: { title: "HRIS partnership", site: "News", url: "https://example.com/mercer-hris" } },
      { date: "2025-03-02", value: 7, source: { title: "Future of Work 2025", site: "Analyst", url: "https://example.com/mercer-fow" } },
      { date: "2025-04-18", value: 12, source: { title: "Global mobility update", site: "PR", url: "https://example.com/mercer-mobility" } },
      { date: "2025-05-09", value: 11, source: { title: "Skills-based pay", site: "Research", url: "https://example.com/mercer-sbp" } },
    ],
    sentimentTrend: [
      { date: "2025-01", value: 68, source: { title: "Talent marketplace", site: "Trade", url: "https://example.com/mercer-marketplace" } },
      { date: "2025-02", value: 71, source: { title: "Positive analyst note", site: "Analyst", url: "https://example.com/mercer-analyst" } },
      { date: "2025-03", value: 69, source: { title: "Competition overview", site: "News", url: "https://example.com/mercer-competition" } },
      { date: "2025-04", value: 73, source: { title: "Client case study", site: "Case", url: "https://example.com/mercer-cs" } },
      { date: "2025-05", value: 72, source: { title: "Leadership interview", site: "Podcast", url: "https://example.com/mercer-podcast" } },
    ],
    leaders: [
      {
        name: "Jason Averbook",
        title: "Senior Partner, Digital HR Strategy",
        initials: "JA",
        color: "#2F80ED",
        insight: "Driving skills-based HR transformation and digital-first operating models.",
        source: { site: "HR Executive", title: "Jason Averbook on the future of work", url: "https://hrexecutive.com/" },
      },
      {
        name: "Ravin Jesuthasan",
        title: "Global Leader, Transformation Services",
        initials: "RJ",
        color: "#2F80ED",
        insight: "Human+AI work design to augment capability and agility.",
        source: { site: "Unleash", title: "Ravin Jesuthasan on AI in HR", url: "https://www.unleash.ai/" },
      },
      {
        name: "Carmine Fernandez",
        title: "Leader, Career Products",
        initials: "CF",
        color: "#2F80ED",
        insight: "Data-led career frameworks and rewards modernization.",
        source: { site: "People Matters", title: "Career architecture & skills", url: "https://www.peoplematters.in/" },
      },
    ],
    headcountK: 250, // extra fields for Tier-2 peers
  },
  {
    key: "KF",
    name: "Korn Ferry",
    initials: "KF",
    color: "#10B981",
    revenue: "$2.76B",
    growth: "↑ 3%",
    tags: ["Talent", "Leadership", "Consulting"],
    sentimentNow: 68,
    newsVelocity: [
      { date: "2025-01-05", value: 6 },
      { date: "2025-02-12", value: 7 },
      { date: "2025-03-02", value: 5 },
      { date: "2025-04-18", value: 8 },
      { date: "2025-05-09", value: 9 },
    ],
    sentimentTrend: [
      { date: "2025-01", value: 65 },
      { date: "2025-02", value: 67 },
      { date: "2025-03", value: 64 },
      { date: "2025-04", value: 69 },
      { date: "2025-05", value: 68 },
    ],
    headcountK: 120,
  },
  {
    key: "WTW",
    name: "Willis Towers Watson",
    initials: "WTW",
    color: "#7C3AED",
    revenue: "$9.48B",
    growth: "↑ 4%",
    tags: ["Rewards", "Benefits", "People"],
    sentimentNow: 66,
    newsVelocity: [
      { date: "2025-01-05", value: 5 },
      { date: "2025-02-12", value: 6 },
      { date: "2025-03-02", value: 6 },
      { date: "2025-04-18", value: 7 },
      { date: "2025-05-09", value: 8 },
    ],
    sentimentTrend: [
      { date: "2025-01", value: 63 },
      { date: "2025-02", value: 65 },
      { date: "2025-03", value: 64 },
      { date: "2025-04", value: 66 },
      { date: "2025-05", value: 66 },
    ],
    headcountK: 460,
  },
  {
    key: "AON",
    name: "Aon",
    initials: "AON",
    color: "#EF4444",
    revenue: "$13.4B",
    growth: "↑ 5%",
    tags: ["Rewards", "Advisory", "Risk"],
    sentimentNow: 70,
    newsVelocity: [
      { date: "2025-01-05", value: 7 },
      { date: "2025-02-12", value: 8 },
      { date: "2025-03-02", value: 6 },
      { date: "2025-04-18", value: 9 },
      { date: "2025-05-09", value: 10 },
    ],
    sentimentTrend: [
      { date: "2025-01", value: 66 },
      { date: "2025-02", value: 69 },
      { date: "2025-03", value: 68 },
      { date: "2025-04", value: 71 },
      { date: "2025-05", value: 70 },
    ],
    headcountK: 500,
  },
  {
    key: "DH",
    name: "Deloitte Human Capital",
    initials: "DH",
    color: "#059669",
    revenue: "$67.2B (global, HC subset)",
    growth: "—",
    tags: ["Transformation", "HR Tech", "Consulting"],
    sentimentNow: 73,
    newsVelocity: [
      { date: "2025-01-05", value: 9 },
      { date: "2025-02-12", value: 11 },
      { date: "2025-03-02", value: 8 },
      { date: "2025-04-18", value: 12 },
      { date: "2025-05-09", value: 13 },
    ],
    sentimentTrend: [
      { date: "2025-01", value: 70 },
      { date: "2025-02", value: 72 },
      { date: "2025-03", value: 71 },
      { date: "2025-04", value: 74 },
      { date: "2025-05", value: 73 },
    ],
    headcountK: 450,
  },
];

/* =========================
   REAL-TIME NEWS (Tier 1 mock)
   ========================= */
const NEWS_SOURCES = [
  "Josh Bersin","HR Tech Feed","HR Tech Outlook","Unleash","HR Dive","HR Tech Central",
  "TecHR","HR Tech Feed Blog","HR Tech247 Blog","Factorial HR Blog",
  "People Managing People","Talent Culture","HR Zone","TLNT",
  "Human Resources Director","Workology","SmartRecruiters Blog","Link Humans",
];

const mockNews = [
  { id: "n1", source: "Josh Bersin", title: "Skills-Based Organizations: How AI Is Reshaping HR Operating Models", url: "https://example.com/jb-skills-ai", publishedAt: "2025-08-05T08:15:00Z", keywords: ["AI","Skills","Work Design"], entities: { orgs: ["Mercer","Deloitte Human Capital"], people: ["Ravin Jesuthasan","Jason Averbook"], events: ["Future of Work 2025"] } },
  { id: "n2", source: "Unleash", title: "Korn Ferry updates leadership analytics for hybrid work", url: "https://example.com/unleash-kf-analytics", publishedAt: "2025-08-04T12:00:00Z", keywords: ["Leadership","Analytics","Hybrid Work"], entities: { orgs: ["Korn Ferry"], people: [], events: [] } },
  { id: "n3", source: "HR Dive", title: "WTW launches pay equity benchmarking dataset", url: "https://example.com/hrdive-wtw-benchmark", publishedAt: "2025-08-03T07:45:00Z", keywords: ["Pay Equity","Benchmarking"], entities: { orgs: ["Willis Towers Watson"], people: [], events: [] } },
  { id: "n4", source: "HR Tech Outlook", title: "Aon introduces AI-powered rewards simulator", url: "https://example.com/aon-ai-rewards", publishedAt: "2025-08-02T16:20:00Z", keywords: ["AI","Total Rewards"], entities: { orgs: ["Aon"], people: [], events: [] } },
  { id: "n5", source: "People Managing People", title: "Deloitte HC publishes 2025 Human Capital Trends", url: "https://example.com/pmp-deloitte-trends", publishedAt: "2025-08-01T10:00:00Z", keywords: ["Trends","Transformation"], entities: { orgs: ["Deloitte Human Capital"], people: [], events: ["HC Trends 2025"] } },
];

/* ============ Helpers ============ */
function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" }); }
  catch { return "—"; }
}
function hashColor(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  const c = (h >>> 0).toString(16).slice(0, 6).padStart(6, "0");
  return `#${c}`;
}
function useNews(filters) {
  const { sources, q, sort } = filters;
  return useMemo(() => {
    let items = mockNews.slice();
    if (sources && sources.size > 0) items = items.filter(n => sources.has(n.source));
    if (q && q.trim()) {
      const s = q.toLowerCase();
      items = items.filter(n =>
        n.title.toLowerCase().includes(s) ||
        (n.keywords||[]).some(k => k.toLowerCase().includes(s)) ||
        (n.entities?.orgs||[]).some(e => e.toLowerCase().includes(s)) ||
        (n.entities?.people||[]).some(e => e.toLowerCase().includes(s)) ||
        (n.entities?.events||[]).some(e => e.toLowerCase().includes(s)));
    }
    items.sort((a,b)=> sort==="oldest"
      ? +new Date(a.publishedAt) - +new Date(b.publishedAt)
      : +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return items;
  }, [sources, q, sort]);
}

/* ============ Icons ============ */
const IconBuilding = (props) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9 9h2M13 9h2M9 13h2M13 13h2M7 20h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
const IconUser = (props) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M4 20c1.5-3.5 5-5 8-5s6.5 1.5 8 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
const IconCalendar = (props) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

/* ============ Small UI bits ============ */
function TinyTooltip({ active, payload, label, title }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0]?.payload || {};
  return (
    <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", maxWidth: 260, fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {p?.source?.url ? (
        <a href={p.source.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none" }}>
          {(p.source.site||"Source")}: {p.source.title||"Read article"}
        </a>
      ) : <span style={{ fontSize: 12, color: "#9CA3AF" }}>No source available</span>}
    </div>
  );
}
function InfoPill({ label, value }) {
  return (
    <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "6px 8px", textAlign: "center", border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.2px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value ?? "N/A"}</div>
    </div>
  );
}
function MiniChart({ color = "#111827", data = [], yKey, xKey, title }) {
  return (
    <div style={{ height: 140, border: "1px solid #E5E7EB", borderRadius: 10, padding: 8 }}>
      <div style={{ fontSize: 12, color: "#374151", marginBottom: 4, fontFamily: "'Poppins', sans-serif", fontWeight: 600, letterSpacing: "0.2px" }}>{title}</div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data}>
          <CartesianGrid stroke="#F3F4F6" />
          <XAxis dataKey={xKey} stroke="#9CA3AF" tick={{ fontSize: 10 }} />
          <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
          <Tooltip content={<TinyTooltip title={title} />} />
          <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================
   Leader + Company Cards (Tier 1)
   ========================= */
function LeaderCard({ leader = {}, colorFallback = "#111827" }) {
  const color = leader.color || colorFallback || "#111827";
  const [hover, setHover] = useState(false);
  const glow = hover
    ? `0 0 0 1px ${color}22, 0 10px 24px ${color}33, 0 1px 6px ${color}55`
    : "0 2px 6px rgba(0,0,0,0.06)";

  return (
    <div
      className="leader-card"
      style={{
        background: "white", borderRadius: "0.75rem", padding: "1rem",
        border: "1px solid #E5E7EB", boxShadow: glow,
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        height: "100%", display: "flex", flexDirection: "column", gap: 8,
        fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + "10", display: "grid", placeItems: "center", fontWeight: 700, color, border: `1px solid ${color}33` }}>
          {leader.initials || "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, letterSpacing: "0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {leader.name || "Leader"}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>{leader.title || "—"}</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#374151", marginTop: 2 }}>{leader.insight || "No recent insight available."}</p>

      {leader?.source?.url ? (
        <a href={leader.source.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color, textDecoration: "none", marginTop: "auto" }}>
          {(leader?.source?.site || "Source")}: {leader?.source?.title || "Read more"}
        </a>
      ) : <span style={{ fontSize: 12, color: "#9CA3AF", marginTop: "auto" }}>No source</span>}
    </div>
  );
}

function CompanyCard({ c = {}, onToggleFollow, followed }) {
  const [isHovered, setIsHovered] = useState(false);
  const color = c.color || "#111827";
  const newsRows = useMemo(() => (c.newsVelocity || []).map((d, i) => ({ ...d, x: i + 1 })), [c.newsVelocity]);
  const sentRows = useMemo(() => (c.sentimentTrend || []).map((d, i) => ({ ...d, x: i + 1 })), [c.sentimentTrend]);
  const hoverShadow = isHovered
    ? `0 0 0 1px ${color}22, 0 12px 28px ${color}33, 0 2px 8px ${color}55`
    : "0 2px 6px rgba(0,0,0,0.06)";

  return (
    <div
      className="company-card"
      style={{
        background: "white", padding: "1.25rem", borderRadius: "1rem",
        boxShadow: hoverShadow, display: "flex", flexDirection: "column", gap: "0.75rem",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div aria-label={`${c.name || "Company"} avatar`} style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(145deg, rgba(0,0,0,0.02), rgba(0,0,0,0.06))", border: "1px solid #E5E7EB", display: "grid", placeItems: "center", fontWeight: 800, color }}>
          <span>{c.initials || "?"}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.2px", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name || "Unknown Company"}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            {(c.tags || []).map((t) => (
              <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#F3F4F6", color: "#374151" }}>{t}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onToggleFollow && onToggleFollow(c.key)}
          style={{ border: "1px solid #E5E7EB", background: followed ? "#111827" : "white", color: followed ? "#fff" : "#111827", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          {followed ? "Following" : "Follow"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
        <InfoPill label="Revenue" value={c.revenue ?? "N/A"} />
        <InfoPill label="Growth" value={c.growth ?? "N/A"} />
        <InfoPill label="Sentiment" value={c.sentimentNow != null ? `${c.sentimentNow}%` : "N/A"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
        <MiniChart color={color} data={newsRows} yKey="value" xKey="date" title="News velocity" />
        <MiniChart color={color} data={sentRows} yKey="value" xKey="date" title="Sentiment trend" />
      </div>

      {Array.isArray(c.leaders) && c.leaders.length > 0 ? (
        <details style={{ marginTop: 6 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, letterSpacing: "0.2px" }}>Leaders ({c.leaders.length})</summary>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginTop: 8 }}>
            {c.leaders.map((L, idx) => (
              <LeaderCard key={`${c.key}-leader-${idx}`} leader={L} colorFallback={color} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

/* =========================
   Tier-1: News Page
   ========================= */
function SourceBadge({ source }) {
  const bg = hashColor(source || "source");
  const initials = (source || "?").split(" ").map(w=>w[0]).join("").slice(0,3).toUpperCase();
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 22, height: 22, borderRadius: 6, background: bg+"22", border: `1px solid ${bg}55`, color: bg, fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center" }}>{initials}</span>
      <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{source || "Source"}</span>
    </div>
  );
}
function SourceFilter({ selected, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {NEWS_SOURCES.map((s) => {
        const active = selected.has(s);
        return (
          <button key={s} onClick={() => onToggle(s)}
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, padding: "6px 10px", borderRadius: 999, border: `1px solid ${active ? "#111827" : "#E5E7EB"}`, background: active ? "#111827" : "white", color: active ? "white" : "#111827", cursor: "pointer" }}
          >{s}</button>
        );
      })}
    </div>
  );
}
function Chip({ children }) {
  return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#F3F4F6", color: "#374151", marginRight: 6, marginBottom: 6, display: "inline-block" }}>{children}</span>;
}
function EntityChip({ kind, label }) {
  const styles = {
    org: { bg: "#ECFDF5", color: "#047857", border: "#A7F3D0", Icon: IconBuilding },
    person: { bg: "#EEF2FF", color: "#3730A3", border: "#C7D2FE", Icon: IconUser },
    event: { bg: "#FFF7ED", color: "#9A3412", border: "#FED7AA", Icon: IconCalendar },
  };
  const S = styles[kind] || styles.org; const Ico = S.Icon;
  return (
    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 999, background: S.bg, color: S.color, border: `1px solid ${S.border}`, display: "inline-flex", gap: 6, alignItems: "center", marginRight: 6, marginBottom: 6, fontWeight: 600 }} title={label}>
      <Ico />{label}
    </span>
  );
}
function NewsCard({ item }) {
  const border = "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(20,184,166,0.5))";
  return (
    <div className="news-card" style={{ position: "relative", background: "rgba(255,255,255,0.9)", borderRadius: 16, padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #E5E7EB", transition: "transform .18s ease, box-shadow .18s ease" }}
      onMouseEnter={(e)=>e.currentTarget.style.boxShadow="0 16px 40px rgba(0,0,0,0.10)"} onMouseLeave={(e)=>e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.06)"}>
      <div aria-hidden style={{ pointerEvents:"none", position:"absolute", inset:0, borderRadius:16, padding:1, background:border, opacity:0, transition:"opacity .18s ease" }} className="news-glow" />
      <style>{`.news-card:hover .news-glow{opacity:1}`}</style>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <SourceBadge source={item.source} />
          <div style={{ fontSize: 12, color: "#6B7280" }}>• {formatDate(item.publishedAt)}</div>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>Open</a>
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8, letterSpacing: "0.2px" }}>{item.title || "Untitled"}</div>

      {(item.keywords?.length || 0) > 0 && (
        <div style={{ marginTop: 10 }}>{item.keywords.map((k) => <Chip key={k}>{k}</Chip>)}</div>
      )}

      {(item.entities?.orgs?.length || item.entities?.people?.length || item.entities?.events?.length) ? (
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <div><div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Organizations</div>
            <div>{(item.entities?.orgs || []).map((e) => <EntityChip key={`o-${e}`} kind="org" label={e} />)}</div></div>
          <div><div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>People</div>
            <div>{(item.entities?.people || []).map((e) => <EntityChip key={`p-${e}`} kind="person" label={e} />)}</div></div>
          <div><div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 6 }}>Events</div>
            <div>{(item.entities?.events || []).map((e) => <EntityChip key={`e-${e}`} kind="event" label={e} />)}</div></div>
        </div>
      ) : null}
    </div>
  );
}
function NewsPage() {
  const [selectedSources, setSelectedSources] = useState(new Set());
  const [query, setQuery] = useState(""); const [sort, setSort] = useState("newest");
  const [pageSize] = useState(6); const [page, setPage] = useState(1);
  const all = useNews({ sources: selectedSources, q: query, sort });
  const pages = Math.max(1, Math.ceil(all.length / pageSize)); const slice = all.slice(0, page * pageSize);
  const sentinelRef = useRef(null);
  useEffect(() => {
    const el = sentinelRef.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.some((e) => e.isIntersecting);
      if (hit && page < pages) setPage((p) => Math.min(p + 1, pages));
    }, { rootMargin: "300px 0px 0px 0px" });
    io.observe(el); return () => io.disconnect();
  }, [page, pages]);
  useEffect(() => setPage(1), [selectedSources, query, sort]);

  const toggleSource = (s) => setSelectedSources((prev) => { const next = new Set(prev); next.has(s) ? next.delete(s) : next.add(s); return next; });

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.2px", marginBottom: "0.75rem" }}>Real‑Time News</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search title, keywords, organizations, people, events…"
            style={{ flex: "1 1 280px", minWidth: 260, padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}/>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}>
            <option value="newest">Newest</option><option value="oldest">Oldest</option>
          </select>
        </div>
        <SourceFilter selected={selectedSources} onToggle={toggleSource} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
        {slice.map((n) => <NewsCard key={n.id} item={n} />)}
        {slice.length === 0 ? <div style={{ color: "#6B7280", fontSize: 14 }}>No results.</div> : null}
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
        <button onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page<=1} style={{ padding:"8px 12px", borderRadius:10, border:"1px solid #E5E7EB", background: page<=1?"#F3F4F6":"white", cursor: page<=1?"not-allowed":"pointer" }}>Prev</button>
        <div style={{ fontSize:12, color:"#6B7280" }}>Page <strong>{page}</strong> / {pages}</div>
        <button onClick={()=>setPage((p)=>Math.min(p+1,pages))} disabled={page>=pages} style={{ padding:"8px 12px", borderRadius:10, border:"1px solid #E5E7EB", background: page>=pages?"#F3F4F6":"white", cursor: page>=pages?"not-allowed":"pointer" }}>Next</button>
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}

/* =========================
   Benchmark (Tier 1) – constants & page
   ========================= */
const BENCHMARK_METRICS = [
  { key: "ai", label: "AI Adoption %", unit: "%", min: 10, max: 90 },
  { key: "remote", label: "Remote Work %", unit: "%", min: 5, max: 80 },
  { key: "invest", label: "HR Tech Invest ($B)", unit: "B", min: 0.5, max: 10 },
  { key: "sentiment", label: "Sentiment %", unit: "%", min: 40, max: 85 },
];
const INDUSTRY_BASELINES = {
  "Consulting & Advisory": { ai: 62, remote: 45, invest: 3.1, sentiment: 70 },
  "HR Tech Vendors": { ai: 68, remote: 55, invest: 4.8, sentiment: 67 },
  "Enterprise (General)": { ai: 50, remote: 40, invest: 2.0, sentiment: 63 },
};
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const pctDelta = (company, base) => (!isFinite(base) || base === 0) ? 0 : ((company - base) / base) * 100;
const estPercentile = (val, { min, max }) => {
  if (!isFinite(val)) return 0; if (max <= min) return 50;
  const p = ((val - min) / (max - min)) * 100; return clamp(Math.round(p), 0, 100);
};

function NumberField({ label, value, onChange, step = 1, suffix = "" }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input type="number" value={Number.isFinite(value) ? value : ""} onChange={(e)=>onChange(parseFloat(e.target.value))} step={step}
          style={{ flex: "1 1 auto", padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}/>
        {suffix && <span style={{ fontSize: 12, color: "#6B7280" }}>{suffix}</span>}
      </div>
    </label>
  );
}
function MetricDeltaCard({ label, unit, companyVal, baseVal }) {
  const delta = pctDelta(companyVal, baseVal);
  const up = delta > 0; const same = Math.abs(delta) < 0.001;
  const badgeBg = same ? "#F3F4F6" : up ? "#DCFCE7" : "#FEE2E2";
  const badgeFg = same ? "#374151" : up ? "#166534" : "#991B1B";
  return (
    <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{Number.isFinite(companyVal) ? companyVal : "—"}{unit === "B" ? "B" : unit === "%" ? "%" : ""}</div>
        <div style={{ fontSize: 12, color: "#6B7280" }}>vs industry {Number.isFinite(baseVal) ? baseVal : "—"}{unit === "B" ? "B" : unit === "%" ? "%" : ""}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: badgeBg, color: badgeFg }}>
          {same ? "≈ 0%" : `${up ? "↑" : "↓"} ${Math.abs(delta).toFixed(1)}%`}
        </span>
      </div>
    </div>
  );
}
function BenchmarkPage() {
  const industryNames = Object.keys(INDUSTRY_BASELINES);
  const [industry, setIndustry] = useState(industryNames[0]);
  const [companyPreset, setCompanyPreset] = useState("Custom");
  const [ai, setAi] = useState(60);
  const [remote, setRemote] = useState(45);
  const [invest, setInvest] = useState(3.0);
  const [sentiment, setSentiment] = useState(68);

  const presets = {
    Custom: null,
    Mercer: { ai: 64, remote: 48, invest: 3.6, sentiment: 72 },
    Aon: { ai: 62, remote: 46, invest: 3.4, sentiment: 70 },
    "Korn Ferry": { ai: 58, remote: 42, invest: 2.9, sentiment: 68 },
    WTW: { ai: 59, remote: 44, invest: 3.1, sentiment: 66 },
    "Deloitte HC": { ai: 66, remote: 50, invest: 4.0, sentiment: 73 },
  };
  useEffect(() => { const d = presets[companyPreset]; if (d) { setAi(d.ai); setRemote(d.remote); setInvest(d.invest); setSentiment(d.sentiment);} }, [companyPreset]);

  const base = INDUSTRY_BASELINES[industry]; const companyVector = { ai, remote, invest, sentiment };
  const radarData = BENCHMARK_METRICS.map(m => ({ metric: m.label, Company: clamp(companyVector[m.key], m.min, m.max), Industry: base[m.key] }));
  const deltaBars = BENCHMARK_METRICS.map(m => ({ name: m.label.split(" ")[0], Delta: pctDelta(companyVector[m.key], base[m.key]) }));

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.2px", marginBottom: "0.75rem" }}>Benchmarking — Compare with Industry Standards</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Industry</span>
          <select value={industry} onChange={(e)=>setIndustry(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}>
            {industryNames.map((n)=><option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Preset</span>
          <select value={companyPreset} onChange={(e)=>setCompanyPreset(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }}>
            {Object.keys(presets).map((p)=> <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        <NumberField label="AI Adoption (%)" value={ai} onChange={setAi} step={1} suffix="%" />
        <NumberField label="Remote Work (%)" value={remote} onChange={setRemote} step={1} suffix="%" />
        <NumberField label="HR Tech Investment ($B)" value={invest} onChange={setInvest} step={0.1} suffix="B" />
        <NumberField label="Sentiment (%)" value={sentiment} onChange={setSentiment} step={1} suffix="%" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {BENCHMARK_METRICS.map((m)=>(
          <MetricDeltaCard key={m.key} label={m.label} unit={m.unit} companyVal={companyVector[m.key]} baseVal={base[m.key]} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginTop: 16 }}>
        <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, marginBottom: 8 }}>Profile (Radar)</div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis />
              <Radar name="Company" dataKey="Company" stroke="#111827" fill="#111827" fillOpacity={0.3} />
              <Radar name="Industry" dataKey="Industry" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 700, marginBottom: 8 }}>Delta vs Industry (%)</div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={deltaBars} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis type="number" tickFormatter={(v)=>`${v}%`} />
              <YAxis type="category" dataKey="name" width={70} />
              <Tooltip formatter={(v)=> [`${(typeof v==="number"?v.toFixed(1):v)}%`, "Delta"]}/>
              <Bar dataKey="Delta" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* =========================
   PRO (Tier 2) – all modules
   ========================= */

/** 1) Trend Prediction (mock momentum) */
const proTopics = [
  { topic: "AI in HR", drivers: ["Aon AI rewards", "Mercer skills"], base: 0.72 },
  { topic: "Skills-Based Org", drivers: ["Josh Bersin analysis", "Mercer case study"], base: 0.66 },
  { topic: "Pay Equity", drivers: ["WTW dataset"], base: 0.58 },
  { topic: "Hybrid Work", drivers: ["Korn Ferry analytics"], base: 0.53 },
];
function trendScore(base, noise = 0.08) {
  const momentum = (Math.sin(Date.now()/5e7 + base*10) + 1)/2; // 0..1
  const score = (base*0.6 + momentum*0.4 + (Math.random()-0.5)*noise)*2 - 1; // -1..1
  const conf = 0.6 + Math.abs(base-0.5)*0.7; // 0.6..1.3 capped
  return { score: Math.max(-1, Math.min(1, score)), confidence: Math.max(0.5, Math.min(1, conf)) };
}
function TrendPrediction() {
  const rows = proTopics.map(t => {
    const { score, confidence } = trendScore(t.base);
    return { topic: t.topic, score: Math.round(score*100), confidence: Math.round(confidence*100), drivers: t.drivers };
  });
  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontWeight: 600 }}>Trend Prediction</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))", gap:12 }}>
        {rows.map(r=>(
          <div key={r.topic} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:600 }}>{r.topic}</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:8, margin:"6px 0" }}>
              <span style={{ fontSize:28, fontWeight:700 }}>{r.score}</span>
              <span style={{ fontSize:12, color:"#6B7280" }}>/ 100</span>
              <span style={{ marginLeft:"auto", fontSize:12, background:"#EEF2FF", color:"#3730A3", border:"1px solid #C7D2FE", borderRadius:999, padding:"2px 8px" }}>Confidence {r.confidence}%</span>
            </div>
            <div style={{ fontSize:12, color:"#6B7280", marginTop:4 }}>Top drivers</div>
            <ul style={{ paddingLeft:16, margin:"6px 0 0" }}>
              {r.drivers.map(d=> <li key={d} style={{ fontSize:12 }}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 2) Talent Movement Tracker (mock moves) */
const mockMoves = [
  { person:"Alex Morgan", role:"CHRO", company:"Aon", date:"2025-07-18", src:{site:"HR Dive", title:"Aon appoints CHRO", url:"#"} },
  { person:"Priya Shah", role:"Chief People Officer", company:"Korn Ferry", date:"2025-07-12", src:{site:"Unleash", title:"KF CPO announced", url:"#"} },
  { person:"Jordan Lee", role:"People Ops VP", company:"WTW", date:"2025-06-30", src:{site:"HR Executive", title:"WTW leadership change", url:"#"} },
  { person:"C. Fernandez", role:"Career Products Lead", company:"Mercer", date:"2025-06-25", src:{site:"People Matters", title:"Career products update", url:"#"} },
];
function TalentTracker() {
  const [q, setQ] = useState(""); const [role, setRole] = useState("All");
  const roles = ["All", ...Array.from(new Set(mockMoves.map(m=>m.role)))];
  const list = mockMoves.filter(m => (role==="All" || m.role===role) && (m.person+m.company+m.role).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Talent Movement Tracker</h3>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search person/company…" style={{ padding:"8px 10px", borderRadius:10, border:"1px solid #E5E7EB" }}/>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{ padding:"8px 10px", borderRadius:10, border:"1px solid #E5E7EB" }}>
          {roles.map(r=> <option key={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gap:8 }}>
        {list.map(m=>(
          <div key={`${m.person}-${m.date}`} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12, display:"grid", gridTemplateColumns:"1fr auto", gap:8 }}>
            <div>
              <div style={{ fontWeight:600 }}>{m.person}</div>
              <div style={{ fontSize:12, color:"#6B7280" }}>{m.role} • {m.company}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12, color:"#6B7280" }}>{formatDate(m.date)}</div>
              <a href={m.src.url} target="_blank" rel="noreferrer" style={{ fontSize:12, textDecoration:"none", color:"#2563EB" }}>{m.src.site}: {m.src.title}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 3) Sentiment vs Reality Analyzer */
function parsePct(str) {
  if (typeof str !== "string") return NaN;
  const m = str.match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN;
}
function SentimentVsReality() {
  // Build mock KPI delta from growth & a hiring proxy
  const pts = companies.map(c => {
    const kpi = isNaN(parsePct(c.growth)) ? (Math.random()*4-1) : parsePct(c.growth);
    const sent = (c.sentimentTrend.at(-1)?.value ?? 60) - (c.sentimentTrend[0]?.value ?? 60); // change
    return { company: c.name, x: sent, y: kpi, z: Math.max(50, (c.headcountK||100)), color: c.color };
  });
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Sentiment vs. Reality Analyzer</h3>
      <div style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="x" name="Sentiment Δ (pp)" />
            <YAxis dataKey="y" name="KPI Δ (%)" />
            <ZAxis dataKey="z" range={[60, 200]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n, p)=> n==="z" ? [`${p.payload.company} size`, "size"] : [v, n]} />
            <ReferenceLine x={0} stroke="#9CA3AF" />
            <ReferenceLine y={0} stroke="#9CA3AF" />
            <Scatter data={pts} fill="#6366F1" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div style={{ fontSize:12, color:"#6B7280", marginTop:6 }}>Quadrants: +x/+y = under‑hyped winners • −x/+y = underrated • +x/−y = over‑hyped • −x/−y = cooling.</div>
    </div>
  );
}

/** 4) Timeline Explorer (events lanes) */
const timelineEvents = [
  { lane:"News", date:"2025-05-09", label:"Aon AI rewards", url:"#"},
  { lane:"Funding", date:"2025-04-12", label:"HRIS vendor Series B", url:"#"},
  { lane:"Talent", date:"2025-06-25", label:"Mercer career products lead", url:"#"},
  { lane:"Reports", date:"2025-05-01", label:"Deloitte HC Trends 2025", url:"#"},
  { lane:"Product", date:"2025-02-15", label:"Korn Ferry suite update", url:"#"},
];
function TimelineExplorer() {
  const lanes = Array.from(new Set(timelineEvents.map(e=>e.lane)));
  const grouped = lanes.map(l => ({ lane: l, items: timelineEvents.filter(e=>e.lane===l).sort((a,b)=>+new Date(a.date)-+new Date(b.date)) }));
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Timeline Explorer</h3>
      <div style={{ display:"grid", gap:10 }}>
        {grouped.map(g=>(
          <div key={g.lane} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:600, marginBottom:6 }}>{g.lane}</div>
            <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
              {g.items.map(it=>(
                <a key={it.label} href={it.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none", color:"#111827" }}>
                  <div style={{ minWidth:200, border:"1px solid #E5E7EB", borderRadius:10, padding:10 }}>
                    <div style={{ fontSize:12, color:"#6B7280" }}>{formatDate(it.date)}</div>
                    <div style={{ fontWeight:600 }}>{it.label}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 5) Dynamic Peer Benchmarking */
function vecForCompany(c) {
  const tags = ["Career","Rewards","Consulting","Transformation","HR Tech","Leadership","Benefits","Risk","People","Talent"];
  const v = tags.map(t => (c.tags||[]).includes(t) ? 1 : 0);
  const size = (c.headcountK || 100)/500; // scale 0..1
  return v.concat([size]);
}
function cosine(a,b){ let dot=0,na=0,nb=0; for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; na+=a[i]*a[i]; nb+=b[i]*b[i]; } return dot/(Math.sqrt(na)*Math.sqrt(nb)||1); }
function DynamicPeers() {
  const [sel, setSel] = useState(companies[0].key);
  const company = companies.find(c=>c.key===sel);
  const target = vecForCompany(company);
  const peers = companies
    .filter(c=>c.key!==company.key)
    .map(c => ({ c, sim: cosine(target, vecForCompany(c)) }))
    .sort((a,b)=> b.sim - a.sim);
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Dynamic Peer Benchmarking</h3>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:12, color:"#6B7280" }}>Company</span>
        <select value={sel} onChange={(e)=>setSel(e.target.value)} style={{ padding:"8px 10px", borderRadius:10, border:"1px solid #E5E7EB" }}>
          {companies.map(c=> <option key={c.key} value={c.key}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
        {peers.map(p=>(
          <div key={p.c.key} style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700 }}>{p.c.name}</div>
            <div style={{ fontSize:12, color:"#6B7280" }}>Similarity {(p.sim*100).toFixed(0)}%</div>
            <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
              {(p.c.tags||[]).map(t=> <span key={t} style={{ fontSize:10, border:"1px solid #E5E7EB", padding:"2px 6px", borderRadius:999 }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 6) Company Heatmaps (simple heat grid) */
const geoActivity = [
  { country:"US", value:92 }, { country:"UK", value:68 }, { country:"IN", value:74 },
  { country:"DE", value:55 }, { country:"SG", value:61 }, { country:"AU", value:49 },
  { country:"CA", value:53 }, { country:"FR", value:45 }, { country:"JP", value:38 },
];
function HeatCell({ c }) {
  const bg = `rgba(99,102,241,${0.15 + c.value/140})`;
  return (
    <div style={{ background:bg, border:"1px solid #E5E7EB", borderRadius:10, padding:10 }}>
      <div style={{ fontWeight:600 }}>{c.country}</div>
      <div style={{ fontSize:12, color:"#6B7280" }}>Activity {c.value}</div>
    </div>
  );
}
function CompanyHeatmap() {
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Company Heatmaps (Activity Index)</h3>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px,1fr))", gap:10 }}>
        {geoActivity.map(g => <HeatCell key={g.country} c={g} />)}
      </div>
      <div style={{ fontSize:12, color:"#6B7280", marginTop:6 }}>Mock choropleth substitute. Hook to geo API for real map.</div>
    </div>
  );
}

/** 7) Compare Multiple Companies */
function tinySpark(data, color="#111827") {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <ComposedChart data={data}>
        <Area dataKey="value" fill={color+"22"} stroke={color} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
function CompareCompanies() {
  const [selected, setSelected] = useState(companies.slice(0,3).map(c=>c.key));
  const toggle = (k)=> setSelected(s => s.includes(k) ? s.filter(x=>x!==k) : (s.length<5 ? [...s,k] : s));
  const rows = companies.filter(c=>selected.includes(c.key));
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Compare Multiple Companies</h3>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
        {companies.map(c=>(
          <button key={c.key} onClick={()=>toggle(c.key)} style={{ padding:"6px 10px", borderRadius:999, border:"1px solid #E5E7EB", background: selected.includes(c.key)?"#111827":"white", color:selected.includes(c.key)?"#fff":"#111827", cursor:"pointer" }}>
            {c.name}
          </button>
        ))}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ borderCollapse:"separate", borderSpacing:0, width:"100%", minWidth:780 }}>
          <thead>
            <tr>
              <th style={{ textAlign:"left", padding:"10px" }}>Company</th>
              <th style={{ textAlign:"left", padding:"10px" }}>Revenue</th>
              <th style={{ textAlign:"left", padding:"10px" }}>Growth</th>
              <th style={{ textAlign:"left", padding:"10px" }}>Sentiment Now</th>
              <th style={{ textAlign:"left", padding:"10px" }}>Sentiment Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c=>(
              <tr key={c.key} style={{ background:"#fff", borderTop:"1px solid #E5E7EB" }}>
                <td style={{ padding:"10px" }}>{c.name}</td>
                <td style={{ padding:"10px" }}>{c.revenue}</td>
                <td style={{ padding:"10px" }}>{c.growth}</td>
                <td style={{ padding:"10px" }}>{c.sentimentNow}%</td>
                <td style={{ width:180, padding:"10px" }}>{tinySpark(c.sentimentTrend.map(s=>({ value:s.value })), c.color)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 8) Monthly Insight Reports */
function InsightReport() {
  const topTrend = "AI in HR"; const mover = "Aon"; const anomaly = "WTW sentiment flat vs activity ↑";
  function printReport(){ window.print(); }
  return (
    <div>
      <h3 style={{ margin:"0 0 8px", fontWeight:600 }}>Monthly Insight Reports</h3>
      <div id="report" style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:16 }}>
        <h4 style={{ margin:"0 0 10px" }}>KayG Monthly — Snapshot</h4>
        <ul>
          <li><strong>Top trend:</strong> {topTrend}</li>
          <li><strong>Company to watch:</strong> {mover}</li>
          <li><strong>Interesting anomaly:</strong> {anomaly}</li>
        </ul>
        <div style={{ marginTop:10, fontSize:12, color:"#6B7280" }}>Generated from mock data. Hook to live pipeline to automate.</div>
      </div>
      <button onClick={printReport} style={{ marginTop:10, padding:"8px 12px", borderRadius:10, border:"1px solid #E5E7EB", cursor:"pointer" }}>Download / Print</button>
    </div>
  );
}

/** ProPage container with side nav */
function ProPage() {
  const sections = [
    { id: "trends", label: "Trends", Comp: TrendPrediction },
    { id: "talent", label: "Talent Moves", Comp: TalentTracker },
    { id: "svr", label: "Sentiment vs Reality", Comp: SentimentVsReality },
    { id: "timeline", label: "Timeline", Comp: TimelineExplorer },
    { id: "peers", label: "Peers", Comp: DynamicPeers },
    { id: "heatmap", label: "Heatmap", Comp: CompanyHeatmap },
    { id: "compare", label: "Compare", Comp: CompareCompanies },
    { id: "reports", label: "Reports", Comp: InsightReport },
  ];
  const [active, setActive] = useState(sections[0].id);
  const Active = sections.find(s=>s.id===active).Comp;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:16, padding:"1.5rem" }}>
      <aside style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:12, padding:12, height:"fit-content", position:"sticky", top:16 }}>
        <div style={{ fontSize:12, color:"#6B7280", fontWeight:700, marginBottom:8 }}>PRO MODULES</div>
        <div style={{ display:"grid", gap:8 }}>
          {sections.map(s=>{
            const on = s.id===active;
            return (
              <button key={s.id} onClick={()=>setActive(s.id)}
                style={{ textAlign:"left", padding:"8px 10px", borderRadius:10, border:"1px solid #E5E7EB", background:on?"#111827":"white", color:on?"#fff":"#111827", cursor:"pointer", fontWeight:600 }}>
                {s.label}
              </button>
            );
          })}
        </div>
      </aside>
      <main style={{ display:"grid", gap:16 }}>
        <Active />
      </main>
    </div>
  );
}

/* =========================
   App (exported) – Tabs + Banner
   ========================= */
export default function App() {
  usePoppinsFont();
  const [watchlist, setWatchlist] = useState([]);
  const [tab, setTab] = useState("dashboard"); // 'dashboard' | 'news' | 'benchmark' | 'pro'

  // Banner keyframes
  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.id = "kayg-keyframes";
    style.textContent = `
      @keyframes pulseGradient {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }`;
    if (!document.getElementById("kayg-keyframes")) document.head.appendChild(style);
  }, []);

  // Persist watchlist
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("kayg_watchlist") || "[]"); if (Array.isArray(saved)) setWatchlist(saved); } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("kayg_watchlist", JSON.stringify(watchlist)); } catch {} }, [watchlist]);
  const toggleFollow = (key) => setWatchlist((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const typedHeadline = useTypewriter("Track the Future of Work, One Insight at a Time", { speed: 24, loop: false });

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#FAFAFA", color: "#111827", minHeight: "100vh" }}>
      {/* Hero Banner */}
      <div style={{ background: "linear-gradient(270deg, #89f7fe, #66a6ff, #ffdde1, #fbc2eb)", backgroundSize: "600% 600%", animation: "pulseGradient 20s ease infinite", padding: "2rem 1rem", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 16, padding: "1.25rem 1.5rem", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, border: "1px solid #E5E7EB", background: "#ffffff80", marginBottom: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-label="kayG.ai logo"><circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="1.5" /><path d="M7 12h10M12 7v10" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span style={{ fontWeight: 600, letterSpacing: "0.3px" }}>kayG.ai</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 600, letterSpacing: "0.3px", marginBottom: "0.5rem" }}>{typedHeadline}</h1>
          <p style={{ fontSize: "1rem", color: "#374151", maxWidth: 780, margin: "0 auto" }}>
            Your intelligent platform for monitoring HR Technology, HR Transformation, and Work Transformation. Get real-time insights,
            sentiment analysis, and industry intelligence that drives strategic decisions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 12, flexWrap:"wrap" }}>
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "news", label: "News" },
            { id: "benchmark", label: "Benchmark" },
            { id: "pro", label: "Pro" },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: "10px 14px", borderRadius: 999, border: "1px solid #E5E7EB", background: active ? "#111827" : "white", color: active ? "white" : "#111827", fontWeight: 600, cursor: "pointer" }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      {tab === "news" ? (
        <NewsPage />
      ) : tab === "benchmark" ? (
        <BenchmarkPage />
      ) : tab === "pro" ? (
        <ProPage />
      ) : (
        <>
          {/* KPI Dashboard */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", padding: "1.5rem" }}>
            {kpiData.map((kpi) => {
              const changeBadgeBg = kpi.change > 0 ? "#DCFCE7" : kpi.change < 0 ? "#FEE2E2" : "#F3F4F6";
              const changeBadgeColor = kpi.change > 0 ? "#166534" : kpi.change < 0 ? "#991B1B" : "#374151";
              const valueText = kpi.currency ? `${kpi.value}${kpi.currency}` : `${kpi.value}${kpi.name.includes("Rate") || kpi.name.includes("Penetration") ? "%" : ""}`;
              return (
                <div key={kpi.name} style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", padding: "1rem 1.25rem", borderRadius: 14, border: "1px solid #E5E7EB", boxShadow: "0 4px 18px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 20 }}>{kpi.icon}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", marginTop: 6, fontWeight: 600, letterSpacing: "0.2px" }}>{kpi.name}</div>
                  <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.2px", marginTop: 2 }}>{valueText}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 12, background: changeBadgeBg, color: changeBadgeColor }}>
                    {kpi.change > 0 ? `↑ ${kpi.change}%` : kpi.change < 0 ? `↓ ${Math.abs(kpi.change)}%` : "→ 0%"} vs last week
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sentiment Analysis Trends */}
          <div style={{ padding: "0 1.5rem 1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.2px", marginBottom: "0.5rem" }}>Sentiment Analysis Trends (Industry)</h2>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 12, background: "#FFFFFF" }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentMoM}>
                  <CartesianGrid stroke="#EFEFEF" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", fontFamily: "'Poppins', sans-serif" }} formatter={(v) => [`${v}%`, "Sentiment"]} />
                  <Line type="monotone" dataKey="sentiment" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry Watch */}
          <div style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "0.2px" }}>Industry Watch</h2>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Following: {watchlist.length ? watchlist.join(", ") : "—"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {companies.map((c) => (
                <CompanyCard key={c.key} c={c} onToggleFollow={(k)=>setWatchlist(prev => prev.includes(k) ? prev.filter(x=>x!==k) : [...prev, k])} followed={watchlist.includes(c.key)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
