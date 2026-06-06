import { useState, useEffect } from "react";

// ── Constants ──────────────────────────────────────────────────────────────
const CONTENT_TYPES = [
  { id: "social", label: "Social Media Post", icon: "◈", platforms: ["Instagram", "Facebook", "LinkedIn", "Twitter/X"] },
  { id: "ad",     label: "Ad Copy",            icon: "◎", platforms: ["Google Ad", "Facebook Ad", "Instagram Ad"] },
  { id: "email",  label: "Email Campaign",     icon: "◇", platforms: ["Newsletter", "Promotional", "Welcome Email"] },
  { id: "blog",   label: "Blog Intro",         icon: "◉", platforms: ["SEO Blog", "Thought Leadership", "How-To"] },
];
const TONES = ["Professional", "Friendly", "Bold", "Witty", "Inspiring", "Urgent"];

const ACCT_TYPES = [
  { id: "summary",  label: "Bookkeeping Summary",   icon: "▣", desc: "Monthly transaction overview" },
  { id: "cashflow", label: "Cash Flow Analysis",    icon: "▤", desc: "Income vs expenses breakdown" },
  { id: "budget",   label: "Budget Plan",           icon: "▥", desc: "Monthly or quarterly budget" },
  { id: "report",   label: "Financial Report",      icon: "▦", desc: "Investor-ready summary report" },
];

const PLANS = [
  { id: "starter", name: "Starter", price: "$29", period: "/mo", color: "#c8a96e", features: ["50 AI generations/mo", "Marketing module", "Content history (30 days)", "Copy & export"] },
  { id: "pro",     name: "Pro",     price: "$59", period: "/mo", color: "#7eb8c9", features: ["Unlimited generations", "Marketing + Accounting", "Full history & search", "Priority support", "White-label exports"] },
];

const S = {
  bg: "#0a0a0f", surface: "#0f0f1a", border: "#2a2a3a",
  gold: "#c8a96e", goldLight: "#e8c98e", blue: "#7eb8c9",
  text: "#f0ebe0", muted: "#888", dim: "#444",
};

// ── Helpers ────────────────────────────────────────────────────────────────
const btn = (active, color = S.gold) => ({
  padding: "14px 36px", border: "none", borderRadius: 8, fontWeight: "bold",
  fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", cursor: active ? "pointer" : "not-allowed",
  background: active ? `linear-gradient(135deg, ${color}, ${color}cc)` : "#1a1a2a",
  color: active ? "#0a0a0f" : S.dim, transition: "all 0.3s",
});
const chip = (sel, color = S.gold) => ({
  padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 13, transition: "all 0.2s",
  border: sel ? `1px solid ${color}` : `1px solid ${S.border}`,
  background: sel ? `${color}20` : "transparent",
  color: sel ? color : S.muted,
});
const card = (sel, color = S.gold) => ({
  padding: "22px 20px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
  border: sel ? `1px solid ${color}` : `1px solid ${S.border}`,
  background: sel ? `${color}10` : S.surface,
});
const input = {
  width: "100%", padding: "13px 16px", background: S.surface,
  border: `1px solid ${S.border}`, borderRadius: 8, color: S.text,
  fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Georgia, serif",
};
const label = { display: "block", fontSize: 11, letterSpacing: "0.15em", color: S.muted, textTransform: "uppercase", marginBottom: 8 };

// ── Claude API call ────────────────────────────────────────────────────────
async function askClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("\n") || "Error generating content.";
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PaywallScreen({ onSubscribe }) {
  const [selected, setSelected] = useState("pro");
  return (
    <div style={{ animation: "fadeIn 0.4s ease", maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", color: S.gold, textTransform: "uppercase", marginBottom: 12 }}>Unlock Full Access</div>
        <h1 style={{ fontSize: 36, fontWeight: "normal", margin: "0 0 12px", lineHeight: 1.2 }}>
          Simple, transparent<br /><em style={{ color: S.gold }}>pricing</em>
        </h1>
        <p style={{ color: S.muted, fontSize: 15, margin: 0 }}>Cancel anytime. No hidden fees.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
        {PLANS.map(plan => (
          <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
            ...card(selected === plan.id, plan.color),
            position: "relative", overflow: "hidden",
          }}>
            {plan.id === "pro" && (
              <div style={{
                position: "absolute", top: 12, right: -20, background: S.blue,
                color: "#0a0a0f", fontSize: 10, fontWeight: "bold", padding: "4px 28px",
                transform: "rotate(35deg)", letterSpacing: "0.1em",
              }}>BEST VALUE</div>
            )}
            <div style={{ fontSize: 13, color: plan.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: "bold", color: S.text }}>{plan.price}</span>
              <span style={{ color: S.muted, fontSize: 14 }}>{plan.period}</span>
            </div>
            {plan.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ color: plan.color, fontSize: 14 }}>✦</span>
                <span style={{ fontSize: 13, color: selected === plan.id ? S.text : S.muted }}>{f}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={() => onSubscribe(selected)} style={{ ...btn(true, PLANS.find(p=>p.id===selected).color), padding: "16px 60px", fontSize: 14 }}>
          Subscribe with Stripe →
        </button>
        <div style={{ marginTop: 16, fontSize: 12, color: S.dim }}>
          Stripe checkout • Secured by 256-bit SSL • Cancel anytime
        </div>
        <div style={{ marginTop: 10 }}>
          <span onClick={() => onSubscribe("demo")} style={{ fontSize: 12, color: S.muted, cursor: "pointer", textDecoration: "underline" }}>
            Try demo (no card needed)
          </span>
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({ history, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = history.filter(h =>
    h.businessName.toLowerCase().includes(search.toLowerCase()) ||
    h.type.toLowerCase().includes(search.toLowerCase()) ||
    h.output.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: 380,
      background: "#0c0c16", borderLeft: `1px solid ${S.border}`,
      display: "flex", flexDirection: "column", zIndex: 100, animation: "slideIn 0.3s ease",
    }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: "bold", color: S.goldLight }}>Saved History</div>
          <div style={{ fontSize: 12, color: S.muted }}>{history.length} items</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: S.muted, fontSize: 20, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${S.border}` }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search history..."
          style={{ ...input, fontSize: 13, padding: "10px 14px" }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: S.dim, fontSize: 13 }}>No results found</div>
        )}
        {filtered.map((item, i) => (
          <div key={i} onClick={() => onSelect(item)} style={{
            padding: "16px", borderRadius: 10, marginBottom: 10, cursor: "pointer",
            border: `1px solid ${S.border}`, background: S.surface,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = S.gold}
            onMouseLeave={e => e.currentTarget.style.borderColor = S.border}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: S.gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.type}</span>
              <span style={{ fontSize: 11, color: S.dim }}>{item.date}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: "bold", marginBottom: 6, color: S.text }}>{item.businessName}</div>
            <div style={{ fontSize: 12, color: S.muted, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {item.output}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketingModule({ business, plan, onSave }) {
  const [step, setStep] = useState(1);
  const [contentType, setContentType] = useState(null);
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("Professional");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true); setOutput("");
    const ct = CONTENT_TYPES.find(c => c.id === contentType);
    const prompt = `You are an expert marketing copywriter. Generate ${ct.label} for:
Business: ${business.name} | Industry: ${business.industry}
Description: ${business.description} | Audience: ${business.audience}
Platform: ${platform} | Tone: ${tone} | Topic: ${topic || "General brand awareness"}
Write compelling, ready-to-use copy. No explanation — just the final copy.`;
    try {
      const text = await askClaude(prompt);
      setOutput(text);
      onSave({ type: ct.label, platform, tone, businessName: business.name, output: text, date: new Date().toLocaleDateString(), module: "marketing" });
    } catch { setOutput("Error generating content. Please try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setStep(1); setOutput(""); setTopic(""); setContentType(null); setPlatform(""); };

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, alignItems: "center" }}>
        {["Business", "Content Type", "Generate"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: "bold",
              background: step > i+1 ? `linear-gradient(135deg, ${S.gold}, ${S.goldLight})` : step === i+1 ? `linear-gradient(135deg, ${S.gold}, ${S.goldLight})` : "#1a1a2a",
              color: step >= i+1 ? "#0a0a0f" : S.dim,
              border: step < i+1 ? `1px solid ${S.border}` : "none",
            }}>{step > i+1 ? "✓" : i+1}</div>
            <span style={{ fontSize: 12, color: step === i+1 ? S.goldLight : S.muted, letterSpacing: "0.05em" }}>{s}</span>
            {i < 2 && <div style={{ width: 24, height: 1, background: step > i+1 ? S.gold : S.border }} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 28 }}>Your <em style={{ color: S.gold }}>business profile</em></h2>
          <div style={{ padding: "20px 24px", background: `${S.gold}08`, border: `1px solid ${S.gold}30`, borderRadius: 12, marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12, color: S.goldLight }}>{business.name || "—"}</div>
            {[["Industry", business.industry], ["Audience", business.audience], ["About", business.description]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: S.muted, width: 60, flexShrink: 0 }}>{k}</span>
                <span style={{ fontSize: 13, color: v ? S.text : S.dim }}>{v || "Not set"}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!business.name} style={btn(!!business.name)}>
            Continue →
          </button>
          {!business.name && <div style={{ marginTop: 12, fontSize: 12, color: S.muted }}>Complete your business profile in Settings first.</div>}
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 28 }}>What do you want to <em style={{ color: S.gold }}>create?</em></h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {CONTENT_TYPES.map(ct => (
              <div key={ct.id} onClick={() => { setContentType(ct.id); setPlatform(""); }} style={card(contentType === ct.id)}>
                <div style={{ fontSize: 26, color: S.gold, marginBottom: 10 }}>{ct.icon}</div>
                <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>{ct.label}</div>
                <div style={{ fontSize: 11, color: S.muted }}>{ct.platforms.join(" · ")}</div>
              </div>
            ))}
          </div>
          {contentType && (
            <div style={{ marginBottom: 24, animation: "fadeIn 0.3s ease" }}>
              <div style={label}>Platform</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {CONTENT_TYPES.find(c => c.id === contentType).platforms.map(p => (
                  <div key={p} onClick={() => setPlatform(p)} style={chip(platform === p)}>{p}</div>
                ))}
              </div>
              {platform && (
                <div style={{ animation: "fadeIn 0.3s ease" }}>
                  <div style={label}>Tone</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TONES.map(t => <div key={t} onClick={() => setTone(t)} style={chip(tone === t)}>{t}</div>)}
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{ ...btn(true), background: "transparent", border: `1px solid ${S.border}`, color: S.muted }}>← Back</button>
            <button onClick={() => setStep(3)} disabled={!contentType || !platform} style={btn(!!(contentType && platform))}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 20 }}>Add a topic & <em style={{ color: S.gold }}>generate</em></h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24, padding: "14px 18px", background: `${S.gold}08`, border: `1px solid ${S.gold}25`, borderRadius: 10 }}>
            {[business.name, CONTENT_TYPES.find(c=>c.id===contentType)?.label, platform, tone].map((t, i) => (
              <span key={i} style={{ fontSize: 12, color: S.gold }}>✦ {t}</span>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={label}>Topic or Focus <span style={{ color: S.dim }}>(optional)</span></div>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Summer sale, new product launch..." style={input}
              onFocus={e => e.target.style.borderColor = S.gold} onBlur={e => e.target.style.borderColor = S.border} />
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <button onClick={() => setStep(2)} style={{ ...btn(true), background: "transparent", border: `1px solid ${S.border}`, color: S.muted }}>← Back</button>
            <button onClick={generate} disabled={loading} style={btn(!loading)}>
              {loading ? "Generating..." : "✦ Generate"}
            </button>
          </div>
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 28, animation: "spin 2s linear infinite", display: "inline-block", color: S.gold }}>◈</div>
              <div style={{ marginTop: 14, color: S.muted, fontSize: 13 }}>Crafting your content...</div>
            </div>
          )}
          {output && !loading && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ padding: "24px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, marginBottom: 16, lineHeight: 1.85, fontSize: 15, whiteSpace: "pre-wrap" }}>{output}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={copy} style={{ ...btn(true), padding: "11px 24px", background: "transparent", border: `1px solid ${S.gold}`, color: S.gold }}>
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
                <button onClick={generate} style={{ ...btn(true), padding: "11px 24px", background: "transparent", border: `1px solid ${S.border}`, color: S.muted }}>↻ Retry</button>
                <button onClick={reset} style={{ ...btn(true), padding: "11px 24px", background: "transparent", border: `1px solid ${S.border}`, color: S.muted }}>New Content</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccountingModule({ business, plan, onSave }) {
  const [acctType, setAcctType] = useState(null);
  const [period, setPeriod] = useState("");
  const [details, setDetails] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const locked = plan === "starter";

  const generate = async () => {
    setLoading(true); setOutput("");
    const at = ACCT_TYPES.find(a => a.id === acctType);
    const prompt = `You are an expert accountant and financial advisor. Generate a ${at.label} for:
Business: ${business.name} | Industry: ${business.industry}
Period: ${period || "Current month"}
Details provided: ${details || "No specific details — generate a sample template."}
Format clearly with sections, numbers where appropriate, and actionable insights. Be professional and concise.`;
    try {
      const text = await askClaude(prompt);
      setOutput(text);
      onSave({ type: at.label, businessName: business.name, output: text, date: new Date().toLocaleDateString(), module: "accounting" });
    } catch { setOutput("Error generating report. Please try again."); }
    setLoading(false);
  };

  if (locked) return (
    <div style={{ textAlign: "center", padding: "60px 24px", animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>▦</div>
      <h2 style={{ fontSize: 24, fontWeight: "normal", marginBottom: 12 }}>Accounting module is <em style={{ color: S.blue }}>Pro only</em></h2>
      <p style={{ color: S.muted, maxWidth: 360, margin: "0 auto 28px" }}>Upgrade to Pro to access bookkeeping summaries, cash flow analysis, budget planning, and financial reports.</p>
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 12, alignItems: "center", padding: "24px 32px", border: `1px solid ${S.blue}40`, borderRadius: 12, background: `${S.blue}08` }}>
        {PLANS.find(p=>p.id==="pro").features.map((f,i) => <div key={i} style={{ fontSize: 13, color: S.blue }}>✦ {f}</div>)}
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <h2 style={{ fontSize: 26, fontWeight: "normal", marginBottom: 28 }}>Financial <em style={{ color: S.blue }}>tools</em></h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {ACCT_TYPES.map(at => (
          <div key={at.id} onClick={() => setAcctType(at.id)} style={card(acctType === at.id, S.blue)}>
            <div style={{ fontSize: 26, color: S.blue, marginBottom: 10 }}>{at.icon}</div>
            <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>{at.label}</div>
            <div style={{ fontSize: 11, color: S.muted }}>{at.desc}</div>
          </div>
        ))}
      </div>
      {acctType && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={label}>Time Period</div>
            <input value={period} onChange={e => setPeriod(e.target.value)} placeholder="e.g. June 2026, Q2 2026, Full Year 2025..." style={input}
              onFocus={e => e.target.style.borderColor = S.blue} onBlur={e => e.target.style.borderColor = S.border} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={label}>Financial Details <span style={{ color: S.dim }}>(optional)</span></div>
            <textarea value={details} onChange={e => setDetails(e.target.value)}
              placeholder="Paste key figures, income/expenses, notes... or leave blank for a sample template."
              rows={4} style={{ ...input, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = S.blue} onBlur={e => e.target.style.borderColor = S.border} />
          </div>
          <button onClick={generate} disabled={loading} style={btn(!loading, S.blue)}>
            {loading ? "Generating..." : "▦ Generate Report"}
          </button>
        </div>
      )}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 28, animation: "spin 2s linear infinite", display: "inline-block", color: S.blue }}>▣</div>
          <div style={{ marginTop: 14, color: S.muted, fontSize: 13 }}>Preparing your report...</div>
        </div>
      )}
      {output && !loading && (
        <div style={{ animation: "fadeIn 0.4s ease", marginTop: 28 }}>
          <div style={{ padding: "24px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, marginBottom: 16, lineHeight: 1.85, fontSize: 14, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{output}</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ ...btn(true), padding: "11px 24px", background: "transparent", border: `1px solid ${S.blue}`, color: S.blue }}>
              {copied ? "✓ Copied!" : "Copy Report"}
            </button>
            <button onClick={generate} style={{ ...btn(true), padding: "11px 24px", background: "transparent", border: `1px solid ${S.border}`, color: S.muted }}>↻ Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("paywall"); // paywall | app
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState("marketing");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [business, setBusiness] = useState({ name: "", industry: "", description: "", audience: "" });
  const [showSettings, setShowSettings] = useState(false);

  const handleSubscribe = (planId) => {
    if (planId === "demo") { setPlan("pro"); setScreen("app"); return; }
    // In production: open Stripe checkout here
    // window.open(`https://buy.stripe.com/your_link?plan=${planId}`, '_blank');
    // For demo purposes, simulate successful subscription:
    setPlan(planId);
    setScreen("app");
  };

  const saveToHistory = (item) => setHistory(prev => [item, ...prev].slice(0, 50));

  const tabs = [
    { id: "marketing", label: "Marketing", icon: "◈", color: S.gold },
    { id: "accounting", label: "Accounting", icon: "▦", color: S.blue },
  ];

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "Georgia, serif", color: S.text }}>

      {/* Paywall */}
      {screen === "paywall" && (
        <>
          <div style={{ borderBottom: `1px solid ${S.border}`, padding: "18px 40px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${S.gold}, ${S.goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold", color: S.bg }}>M</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: "bold", color: S.goldLight, letterSpacing: "0.05em" }}>MARKCRAFT</div>
              <div style={{ fontSize: 10, color: S.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>AI Business Studio</div>
            </div>
          </div>
          <PaywallScreen onSubscribe={handleSubscribe} />
        </>
      )}

      {/* Main App */}
      {screen === "app" && (
        <>
          {/* Header */}
          <div style={{ borderBottom: `1px solid ${S.border}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.015)", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${S.gold}, ${S.goldLight})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: "bold", color: S.bg }}>M</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: "bold", color: S.goldLight, letterSpacing: "0.05em" }}>MARKCRAFT</div>
                <div style={{ fontSize: 9, color: S.muted, letterSpacing: "0.15em", textTransform: "uppercase" }}>AI Business Studio</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, background: plan === "pro" ? `${S.blue}20` : `${S.gold}20`, color: plan === "pro" ? S.blue : S.gold, border: `1px solid ${plan === "pro" ? S.blue : S.gold}40`, letterSpacing: "0.1em" }}>
                {plan === "demo" || plan === "pro" ? "PRO" : "STARTER"} PLAN
              </div>
              <button onClick={() => setShowHistory(!showHistory)} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${S.border}`, borderRadius: 8, color: S.muted, fontSize: 12, cursor: "pointer", letterSpacing: "0.05em" }}>
                History {history.length > 0 && `(${history.length})`}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${S.border}`, borderRadius: 8, color: S.muted, fontSize: 12, cursor: "pointer" }}>
                ⚙ Settings
              </button>
            </div>
          </div>

          {/* Settings Drawer */}
          {showSettings && (
            <div style={{ borderBottom: `1px solid ${S.border}`, background: "#0c0c16", padding: "24px 32px", animation: "fadeIn 0.3s ease" }}>
              <div style={{ maxWidth: 600, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ fontSize: 14, color: S.goldLight, marginBottom: 4, gridColumn: "1/-1", fontWeight: "bold" }}>Business Profile</div>
                {[
                  { key: "name", label: "Business Name", placeholder: "e.g. Sunrise Bakery" },
                  { key: "industry", label: "Industry", placeholder: "e.g. Food & Beverage" },
                  { key: "audience", label: "Target Audience", placeholder: "e.g. Local families" },
                  { key: "description", label: "What You Do", placeholder: "Brief description..." },
                ].map(f => (
                  <div key={f.key}>
                    <div style={label}>{f.label}</div>
                    <input value={business[f.key]} onChange={e => setBusiness({ ...business, [f.key]: e.target.value })}
                      placeholder={f.placeholder} style={{ ...input, fontSize: 13, padding: "10px 14px" }}
                      onFocus={e => e.target.style.borderColor = S.gold} onBlur={e => e.target.style.borderColor = S.border} />
                  </div>
                ))}
                <button onClick={() => setShowSettings(false)} style={{ ...btn(true), gridColumn: "1/-1", padding: "11px 0" }}>Save Profile</button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ borderBottom: `1px solid ${S.border}`, padding: "0 32px", display: "flex", gap: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "16px 24px", background: "none", border: "none", cursor: "pointer",
                fontSize: 13, letterSpacing: "0.08em", fontFamily: "Georgia, serif",
                color: tab === t.id ? t.color : S.muted,
                borderBottom: tab === t.id ? `2px solid ${t.color}` : "2px solid transparent",
                transition: "all 0.2s",
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px", paddingRight: showHistory ? "420px" : "24px", transition: "padding 0.3s" }}>

            {/* Selected history item */}
            {selectedHistory && (
              <div style={{ marginBottom: 32, padding: "20px 24px", background: `${S.gold}08`, border: `1px solid ${S.gold}30`, borderRadius: 12, animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, color: S.gold, textTransform: "uppercase", letterSpacing: "0.1em" }}>{selectedHistory.type}</span>
                    <span style={{ fontSize: 11, color: S.dim, marginLeft: 12 }}>{selectedHistory.date}</span>
                  </div>
                  <button onClick={() => setSelectedHistory(null)} style={{ background: "none", border: "none", color: S.muted, cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <div style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{selectedHistory.output}</div>
              </div>
            )}

            {tab === "marketing" && <MarketingModule business={business} plan={plan} onSave={saveToHistory} />}
            {tab === "accounting" && <AccountingModule business={business} plan={plan} onSave={saveToHistory} />}
          </div>

          {/* History Panel */}
          {showHistory && (
            <HistoryPanel
              history={history}
              onSelect={(item) => { setSelectedHistory(item); setTab(item.module); }}
              onClose={() => setShowHistory(false)}
            />
          )}
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #333345; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0f; } ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
      `}</style>
    </div>
  );
}