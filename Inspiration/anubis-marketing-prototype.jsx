import React, { useState } from "react";
import {
  ArrowRight, BarChart3, Check, ChevronDown, ChevronLeft, ClipboardList, GraduationCap, Layers, LayoutGrid, Moon, PlayCircle, RotateCcw, Sun, Timer, Zap,
} from "lucide-react";

/* ============================================================
   ANUBIS LEGAL — Marketing site + auth (standalone)
   Logged-out promo pages and the login/signup screen only.
   Self-contained: theme tokens, state list, and shared UI
   are bundled so this file can be dropped in on its own.

   Brand: white/warm-ivory base · yellow gold #C9A227 primary
          deep teal #0E7C6B accent · ink #1A1509 text
   Type:  DM Sans (UI) · DM Mono (IDs/metadata)
   ============================================================ */

const THEMES = {
  light: {
    mode: "light",
    base: "#FBF9F4", surface: "#FFFFFF", surfaceHi: "#F2ECDD", cardBorder: "#E6DFCC",
    primary: "#C9A227", onPrimary: "#1A1509",
    accent: "#0E7C6B", success: "#1F8A5B",
    danger: "#B03A48", warn: "#A85A0B",
    text: "#1A1509", dim: "#7A7059",
    nav: "#FFFFFF",
  },
  dark: {
    mode: "dark",
    base: "#12100A", surface: "#1D1A11", surfaceHi: "#2A2517", cardBorder: "#332C1C",
    primary: "#E0B437", onPrimary: "#16120A",
    accent: "#4FC7B0", success: "#3FBE84",
    danger: "#F0697C", warn: "#E39A3B",
    text: "#F7F3E8", dim: "#A79C82",
    nav: "#17140D",
  },
};

const STATES = [
  { code: "NC", name: "North Carolina", ready: true },
  { code: "SC", name: "South Carolina" },
  { code: "VA", name: "Virginia" },
  { code: "GA", name: "Georgia" },
  { code: "TN", name: "Tennessee" },
  { code: "FL", name: "Florida" },
  { code: "OH", name: "Ohio" },
  { code: "TX", name: "Texas" },
];

const ThemeCtx = React.createContext(THEMES.light);
const inState = (item, st) => !item.states || item.states.includes(st);
const useC = () => React.useContext(ThemeCtx);

const mono = { fontFamily: "'DM Mono', monospace" };

function Tag({ children, color }) {
  const C = useC();
  const col = color || C.accent;
  return (
    <span style={{ ...mono, color: col, border: `1px solid ${col}55`, background: `${col}14` }}
      className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">{children}</span>
  );
}

function Card({ children, className = "", onClick, style }) {
  const C = useC();
  const hover = C.mode === "dark" ? "hover:brightness-125" : "hover:brightness-95";
  return (
    <div onClick={onClick} style={{ background: C.surface, border: `1px solid ${C.cardBorder}`, ...style }}
      className={`rounded-xl p-4 ${onClick ? `cursor-pointer ${hover} transition` : ""} ${className}`}>
      {children}
    </div>
  );
}

const PLANS = [
  { name: "Free", price: "$0", cadence: "forever", cta: "Start free",
    blurb: "Enough to see whether this works for you.",
    features: ["1 video lesson", "1 flashcard set", "1 practice exam", "Basic accuracy tracking"] },
  { name: "Exam Pass", price: "$99", cadence: "one-time · 6 months access", featured: true, cta: "Get the Exam Pass",
    blurb: "Built for the stretch between application and test day.",
    features: ["Every video lesson + checkpoints", "All flashcard, quiz, and matching sets", "Unlimited practice exams", "Full readiness analytics", "Missed-question review"] },
  { name: "Monthly", price: "$19", cadence: "per month", cta: "Go monthly",
    blurb: "Same library, cancel whenever you sit the exam.",
    features: ["Everything in Exam Pass", "Month-to-month billing", "Pause anytime"] },
];

const FAQS = [
  { q: "Is this the national board exam or the state law exam?",
    a: "The state law portion. Anubis Legal covers the statutes, rules, and Board procedures specific to the state you select — the part that changes when you cross a border, and the part national study guides skip." },
  { q: "Which states are available?",
    a: "North Carolina is live today. You pick one state during signup and everything — questions, lessons, and your stats — is scoped to it. More states are in production; you can switch your state at any time from your account." },
  { q: "What makes the video lessons different?",
    a: "They stop. Each lesson is cut into short segments, and at every boundary the player pauses and asks you a checkpoint question before it will resume. You cannot passively watch your way through a lesson, which is exactly the failure mode of most video courses." },
  { q: "How is my readiness score calculated?",
    a: "It weights your overall accuracy, how much of the question bank you've actually seen, and your most recent practice exam score. It only counts practice-bank questions, so the questions reserved for graded practice exams never inflate it." },
];

function HeroDemo() {
  const D = THEMES.dark;
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${D.primary}44` }}>
      <div className="relative" style={{ background: "radial-gradient(120% 130% at 50% 0%, #2A2312 0%, #0B0906 62%)", aspectRatio: "16/10" }}>
        <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-center" style={{ background: `${D.base}E8` }}>
          <div style={{ ...mono, color: D.primary }} className="text-[10px] uppercase tracking-widest mb-2">
            Checkpoint · Trusting the funds · Q1/1
          </div>
          <p className="font-semibold mb-3 text-sm" style={{ color: D.text }}>Preneed funds must be deposited within:</p>
          <div className="space-y-1.5">
            {["24 hours", "10 business days", "30 days", "90 days"].map((c, i) => (
              <div key={c} className="px-3 py-2 rounded-lg text-xs flex items-center justify-between"
                style={{
                  background: i === 1 ? `${D.success}22` : D.surface,
                  border: `1px solid ${i === 1 ? D.success : "transparent"}`,
                  color: D.text,
                }}>
                {c}{i === 1 && <Check size={13} style={{ color: D.success }} />}
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-3" style={{ color: D.dim }}>
            <span style={{ color: D.success }} className="font-semibold">Correct. </span>
            10 business days from receipt, into trust or applied to insurance.
          </p>
        </div>
      </div>
      <div className="flex gap-1 px-3 py-2.5" style={{ background: "#0B0906" }}>
        {[18, 16, 20, 15].map((w, i) => (
          <span key={i} className="h-1.5 rounded-full overflow-hidden" style={{ flex: w, background: D.surfaceHi }}>
            <span className="block h-full rounded-full" style={{ width: i < 2 ? "100%" : i === 2 ? "62%" : "0%", background: i < 2 ? D.success : D.primary }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function Landing({ go, theme, setTheme }) {
  const C = useC();
  const [openFaq, setOpenFaq] = useState(0);
  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const links = [["features", "Features"], ["how", "How it works"], ["pricing", "Pricing"], ["faq", "FAQ"]];
  const pillars = [
    { icon: PlayCircle, title: "Video that stops and asks",
      body: "Lessons are cut into short segments. At every boundary the player pauses for a checkpoint question and won't resume until you answer." },
    { icon: BarChart3, title: "Readiness, not vibes",
      body: "A single score built from accuracy, bank coverage, and your last exam — plus weakest-topic breakdowns so you know what to open next." },
    { icon: GraduationCap, title: "One state, done properly",
      body: "Every question is tagged to the state you select. No sifting through another state's statutes to find the rule that applies to you." },
  ];
  const tools = [
    { icon: Layers, label: "Flashcards", body: "Statute and vocabulary sets you can shuffle and drill in a few minutes." },
    { icon: ClipboardList, label: "Practice exams", body: "Full forms and topic-focus exams under exam conditions — flagging, no feedback until you submit." },
    { icon: Zap, label: "Quizzes", body: "Five-question rounds with an explanation after every answer." },
    { icon: LayoutGrid, label: "Matching", body: "Pair citations with what they govern until the numbers stick." },
    { icon: RotateCcw, label: "Missed-question review", body: "Everything you got wrong last time, in one list, with the reasoning." },
    { icon: Timer, label: "Session history", body: "Every sitting logged with date, mode, volume, and accuracy." },
  ];

  return (
    <div style={{ background: C.base }}>
      {/* Nav */}
      <header className="sticky top-0 z-30" style={{ background: `${C.nav}F2`, borderBottom: `1px solid ${C.cardBorder}`, backdropFilter: "blur(8px)" }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold tracking-tight" style={{ color: C.text }}>Anubis</span>
            <span style={{ ...mono, color: C.primary, border: `1px solid ${C.primary}`, background: `${C.primary}1A` }}
              className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Legal</span>
          </div>
          <nav className="hidden md:flex gap-1 ml-4 flex-1">
            {links.map(([id, label]) => (
              <button key={id} onClick={() => jump(id)} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ color: C.dim }}>{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme" className="p-2 rounded-lg"
              style={{ background: C.surfaceHi, color: C.text }}>
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => go("login")} className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ color: C.text }}>Log in</button>
            <button onClick={() => go("signup")} className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: C.primary, color: C.onPrimary }}>Start free</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div style={{ ...mono, color: C.accent }} className="text-[11px] uppercase tracking-[0.2em] mb-3">
            State law exam prep · North Carolina
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.05] mb-4" style={{ color: C.text }}>
            Stop watching lectures.<br />
            <span style={{ color: C.primary }}>Start answering.</span>
          </h1>
          <p className="text-base mb-6 max-w-md" style={{ color: C.dim }}>
            Anubis Legal is exam prep for the state law portion of the funeral service licensing exam —
            built around video lessons that pause and quiz you before they let you keep going.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => go("signup")} className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm"
              style={{ background: C.primary, color: C.onPrimary }}>
              Start free <ArrowRight size={15} />
            </button>
            <button onClick={() => jump("features")} className="px-5 py-3 rounded-lg font-semibold text-sm"
              style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}` }}>
              See how it works
            </button>
          </div>
          <p className="text-xs" style={{ color: C.dim }}>No card required · Companion to the DEAD! exam prep platform</p>
        </div>
        <HeroDemo />
      </section>

      {/* Pillars */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-14" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: C.text }}>Why this one works</h2>
        <p className="text-sm mb-8 max-w-lg" style={{ color: C.dim }}>
          Most law-portion prep is a PDF and a page of practice questions. This is built around the part people actually fail: recall under pressure.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {pillars.map(p => {
            const Icon = p.icon;
            return (
              <Card key={p.title}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${C.primary}22`, color: C.primary }}>
                  <Icon size={19} />
                </span>
                <div className="font-bold mb-1" style={{ color: C.text }}>{p.title}</div>
                <p className="text-sm" style={{ color: C.dim }}>{p.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Everything else */}
      <section className="max-w-5xl mx-auto px-4 py-14" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
        <h2 className="text-2xl font-bold mb-8" style={{ color: C.text }}>Everything in the box</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${C.accent}1A`, color: C.accent }}>
                  <Icon size={15} />
                </span>
                <div>
                  <div className="font-semibold text-sm mb-0.5" style={{ color: C.text }}>{t.label}</div>
                  <p className="text-xs" style={{ color: C.dim }}>{t.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-14" style={{ background: C.surfaceHi }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8" style={{ color: C.text }}>Three steps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["Pick your state", "Choose the state you're sitting for. Every question, lesson, and statistic is scoped to it from that moment on."],
              ["Work the library", "Watch segmented lessons, drill flashcards, and sit full practice exams. Checkpoints catch the gaps as you go."],
              ["Watch readiness climb", "One score, updated every session, with the weakest topic named so you always know what to open next."],
            ].map(([title, body], i) => (
              <div key={title}>
                <div style={{ ...mono, color: C.primary }} className="text-3xl font-bold mb-2">0{i + 1}</div>
                <div className="font-bold mb-1" style={{ color: C.text }}>{title}</div>
                <p className="text-sm" style={{ color: C.dim }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold mb-2" style={{ color: C.text }}>Pricing</h2>
        <p className="text-sm mb-8" style={{ color: C.dim }}>One state per account. Switch states any time.</p>
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {PLANS.map(pl => (
            <Card key={pl.name} style={pl.featured ? { border: `2px solid ${C.primary}` } : undefined}>
              {pl.featured && (
                <div style={{ ...mono, background: C.primary, color: C.onPrimary }}
                  className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mb-2">Most popular</div>
              )}
              <div className="font-bold mb-1" style={{ color: C.text }}>{pl.name}</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl font-bold" style={{ color: C.text }}>{pl.price}</span>
                <span className="text-xs" style={{ color: C.dim }}>{pl.cadence}</span>
              </div>
              <p className="text-xs mb-4" style={{ color: C.dim }}>{pl.blurb}</p>
              <ul className="space-y-1.5 mb-5">
                {pl.features.map(f => (
                  <li key={f} className="flex gap-2 text-xs" style={{ color: C.text }}>
                    <Check size={13} style={{ color: C.success, flexShrink: 0, marginTop: 1 }} />{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => go("signup")} className="w-full py-2.5 rounded-lg text-sm font-semibold"
                style={pl.featured
                  ? { background: C.primary, color: C.onPrimary }
                  : { background: C.surfaceHi, color: C.text, border: `1px solid ${C.cardBorder}` }}>
                {pl.cta}
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-14" style={{ borderTop: `1px solid ${C.cardBorder}` }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: C.text }}>Questions</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="rounded-xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.cardBorder}` }}>
                <button onClick={() => setOpenFaq(open ? -1 : i)} aria-expanded={open}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left">
                  <span className="font-semibold text-sm" style={{ color: C.text }}>{f.q}</span>
                  <ChevronDown size={16} style={{ color: C.dim, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
                </button>
                {open && <p className="px-4 pb-4 text-sm" style={{ color: C.dim }}>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="rounded-2xl px-6 py-12 text-center" style={{ background: C.primary }}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: C.onPrimary }}>
            The law portion is the one you can actually study for.
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: `${C.onPrimary}CC` }}>
            Start with the free tier. Pick your state, watch one lesson, and see where your readiness score lands.
          </p>
          <button onClick={() => go("signup")} className="px-6 py-3 rounded-lg font-semibold text-sm"
            style={{ background: C.onPrimary, color: C.primary }}>
            Create your free account
          </button>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-4 py-8 flex flex-wrap gap-3 items-center justify-between text-[11px]"
        style={{ color: C.dim, borderTop: `1px solid ${C.cardBorder}` }}>
        <span style={mono}>ANUBIS LEGAL · NC EDITION · PROTOTYPE</span>
        <span>© 2026 Anubis Publications DBA DEAD!</span>
      </footer>
    </div>
  );
}

/* ---------------- AUTH ---------------- */
function Auth({ mode, go, onAuth }) {
  const C = useC();
  const signup = mode === "signup";
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const canSubmit = !signup || !!stateCode; // state is required to create an account
  const submit = () => { if (canSubmit) onAuth(signup ? stateCode : undefined); };

  const field = (label, value, setter, type, placeholder) => (
    <div className="mb-3">
      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => setter(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
        style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}`, fontFamily: "'DM Sans', sans-serif" }} />
    </div>
  );

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: C.base }}>
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between p-10" style={{ background: C.primary }}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight" style={{ color: C.onPrimary }}>Anubis</span>
          <span style={{ ...mono, color: C.onPrimary, border: `1px solid ${C.onPrimary}66` }}
            className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Legal</span>
        </div>
        <div>
          <p className="text-2xl font-bold leading-snug mb-3" style={{ color: C.onPrimary }}>
            Lessons that stop and ask, so nothing slides past you.
          </p>
          <p className="text-sm" style={{ color: `${C.onPrimary}CC` }}>
            Segmented video, full practice exams, and a readiness score that tells you the truth.
          </p>
        </div>
        <span style={{ ...mono, color: `${C.onPrimary}99` }} className="text-[10px]">
          © 2026 ANUBIS PUBLICATIONS DBA DEAD!
        </span>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <button onClick={() => go("landing")} className="flex items-center gap-1 text-sm mb-6" style={{ color: C.accent }}>
            <ChevronLeft size={15} /> Back to site
          </button>
          <h1 className="text-2xl font-bold mb-1" style={{ color: C.text }}>
            {signup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm mb-6" style={{ color: C.dim }}>
            {signup ? "Free tier, no card. Pick the state you're testing in — this is set once and can't be changed later." : "Log in to pick up where you left off."}
          </p>

          {signup && field("Full name", name, setName, "text", "Jordan Ellis")}
          {field("Email", email, setEmail, "email", "you@example.com")}
          {field(signup ? "Create a password" : "Password", pw, setPw, "password", "••••••••")}

          {signup && (
            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Your state</label>
              <div className="relative">
                <select value={stateCode} onChange={e => setStateCode(e.target.value)}
                  aria-label="Select your state"
                  className="w-full appearance-none rounded-lg px-3 py-2.5 text-sm outline-none"
                  style={{ background: C.surface, color: stateCode ? C.text : C.dim, border: `1px solid ${C.cardBorder}`, fontFamily: "'DM Sans', sans-serif" }}>
                  <option value="" disabled>Select a state…</option>
                  {STATES.map(st => (
                    <option key={st.code} value={st.code} disabled={!st.ready}>
                      {st.name}{st.ready ? "" : " — coming soon"}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.dim }} />
              </div>
              <p className="text-[11px] mt-1.5" style={{ color: C.dim }}>
                Licensing law is state-specific, so your account is locked to one state. Choose carefully.
              </p>
            </div>
          )}

          {!signup && (
            <button className="text-xs mb-4" style={{ color: C.accent }}>Forgot your password?</button>
          )}

          <button onClick={submit} disabled={!canSubmit}
            className="w-full py-2.5 rounded-lg font-semibold text-sm mt-2 disabled:opacity-40"
            style={{ background: C.primary, color: C.onPrimary }}>
            {signup ? "Create account" : "Log in"}
          </button>

          <p className="text-xs text-center mt-4" style={{ color: C.dim }}>
            {signup ? "Already have an account? " : "New here? "}
            <button onClick={() => go(signup ? "login" : "signup")} className="font-semibold" style={{ color: C.accent }}>
              {signup ? "Log in" : "Create one free"}
            </button>
          </p>
          <p className="text-[11px] text-center mt-6 px-4 py-2 rounded-lg" style={{ color: C.dim, background: C.surfaceHi }}>
            Prototype: any credentials will sign you in.
          </p>
        </div>
      </div>
    </div>
  );
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');`;

/* ---------------- SHELL ----------------
   Drives just the logged-out views: landing ↔ login ↔ signup.
   In the full product, onAuth() would hand off to the app; here
   it routes to a simple confirmation so the flow is demonstrable
   in isolation. Swap `onAuth` for your real post-auth handler. */
export default function MarketingSite() {
  const [view, setView] = useState("landing"); // landing | login | signup | done
  const [theme, setTheme] = useState("light");
  const [handoff, setHandoff] = useState(null); // { mode, state }
  const C = THEMES[theme];

  const shell = children => (
    <ThemeCtx.Provider value={C}>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          ${FONTS}
          button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
          @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
        `}</style>
        {children}
      </div>
    </ThemeCtx.Provider>
  );

  if (view === "login" || view === "signup") {
    return shell(
      <Auth mode={view} go={setView}
        onAuth={code => { setHandoff({ mode: view, state: code || "NC" }); setView("done"); }} />
    );
  }

  if (view === "done") {
    const stName = STATES.find(s => s.code === handoff?.state)?.name || handoff?.state;
    return shell(
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.base }}>
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${C.success}22`, color: C.success }}>
            <Check size={22} />
          </div>
          <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>
            {handoff?.mode === "signup" ? "Account created" : "Logged in"}
          </h1>
          <p className="text-sm mb-6" style={{ color: C.dim }}>
            {handoff?.mode === "signup"
              ? `You'd now enter the app, scoped to ${stName}.`
              : "You'd now land on your dashboard."}
            {" "}This standalone build stops here — wire <code style={{ ...mono, color: C.accent }}>onAuth</code> to your app.
          </p>
          <button onClick={() => setView("landing")} className="px-5 py-2.5 rounded-lg font-semibold text-sm"
            style={{ background: C.primary, color: C.onPrimary }}>
            Back to the site
          </button>
        </div>
      </div>
    );
  }

  return shell(<Landing go={setView} theme={theme} setTheme={setTheme} />);
}
