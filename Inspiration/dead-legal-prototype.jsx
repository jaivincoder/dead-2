import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sun, Moon, Play, Pause, Flag, Shuffle, ChevronLeft, ChevronRight,
  LayoutDashboard, Layers, ClipboardList, Zap, LayoutGrid, Video,
  Check, ArrowRight, RotateCcw, AlertTriangle, MapPin,
  ChevronDown, LogOut, PlayCircle, BarChart3, Timer, GraduationCap,
} from "lucide-react";

/* ============================================================
   DEAD! LEGAL — NC Law Exam Prep Prototype
   Brand: white/warm-ivory base · yellow gold #C9A227 primary
          deep teal #0E7C6B accent · ink #1A1509 text
   Type:  DM Sans (UI) · DM Mono (IDs/metadata)
   Scope: one state at a time, chosen in onboarding (NC live)
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
const StateCtx = React.createContext("NC");
const useSt = () => React.useContext(StateCtx);
const inState = (item, st) => !item.states || item.states.includes(st);
const useC = () => React.useContext(ThemeCtx);

/* ---------------- MOCK DATA ----------------
   Data model: every question carries
   - states: state applicability (NC only for now)
   - topic: subject tag
   - bank: 'practice' | 'test'  (dashboard stats use practice only)
   Admin UI not built yet — fields exist so it can be. */

const TOPICS = [
  "Licensing & Permits",
  "Preneed Contracts",
  "Disposition Authority",
  "Recordkeeping & Reporting",
  "Board Rules & Discipline",
];

const QUESTIONS = [
  // --- Licensing & Permits ---
  { id: "DEAD-LAW-001", states: ["NC"], topic: "Licensing & Permits", bank: "practice",
    q: "In North Carolina, which body issues funeral establishment permits?",
    choices: ["NC Department of Health and Human Services", "NC Board of Funeral Service", "County Register of Deeds", "NC Secretary of State"],
    answer: 1,
    exp: "The NC Board of Funeral Service licenses individuals and issues establishment permits under G.S. Chapter 90, Article 13A." },
  { id: "DEAD-LAW-002", states: ["NC"], topic: "Licensing & Permits", bank: "practice",
    q: "A funeral service licensee in NC must complete how many hours of continuing education per year?",
    choices: ["3 hours", "5 hours", "8 hours", "12 hours"],
    answer: 1,
    exp: "NC requires 5 hours of Board-approved continuing education annually for license renewal." },
  { id: "DEAD-LAW-003", states: ["NC"], topic: "Licensing & Permits", bank: "practice",
    q: "A resident trainee permit in NC is generally valid for what period before renewal?",
    choices: ["6 months", "12 months", "24 months", "36 months"],
    answer: 1,
    exp: "Trainee permits are issued on a 12-month basis and renewed as the traineeship continues." },
  { id: "DEAD-LAW-004", states: ["NC"], topic: "Licensing & Permits", bank: "test",
    q: "Operating a funeral establishment without a valid permit in NC is punishable as:",
    choices: ["A Class 1 misdemeanor", "A civil infraction only", "A Class H felony", "License suspension only"],
    answer: 0,
    exp: "Unlicensed practice provisions classify this as a Class 1 misdemeanor." },

  // --- Preneed Contracts ---
  { id: "DEAD-LAW-010", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
    q: "NC preneed funeral contracts are governed primarily by which statutory article?",
    choices: ["Article 13A", "Article 13D", "Article 13F", "Article 9"],
    answer: 2,
    exp: "Article 13F of G.S. Chapter 90 governs preneed funeral contracts and preneed licensing." },
  { id: "DEAD-LAW-011", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
    q: "Funds from a standard preneed contract in NC must be deposited within how many days of receipt?",
    choices: ["5 business days", "10 business days", "30 calendar days", "60 calendar days"],
    answer: 1,
    exp: "Preneed funds must be deposited into trust (or applied to insurance) within 10 business days." },
  { id: "DEAD-LAW-012", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
    q: "A purchaser's right to cancel a revocable preneed contract entitles them to:",
    choices: ["Nothing after 30 days", "Trust principal only", "Trust principal plus earned interest, less permitted fees", "Original payment minus 50%"],
    answer: 2,
    exp: "On revocation, the purchaser receives principal and accrued earnings less any statutorily permitted fees." },
  { id: "DEAD-LAW-013", states: ["NC"], topic: "Preneed Contracts", bank: "test",
    q: "Who must hold a preneed sales license to sell preneed contracts in NC?",
    choices: ["Any establishment employee", "Only the establishment owner", "Individuals licensed as preneed sales licensees", "Attorneys only"],
    answer: 2,
    exp: "Preneed sales require an individual preneed sales license issued by the Board." },

  // --- Disposition Authority ---
  { id: "DEAD-LAW-020", states: ["NC"], topic: "Disposition Authority", bank: "practice",
    q: "Under NC law, who holds first priority to authorize disposition when the decedent left no written directive?",
    choices: ["Adult children", "Surviving spouse", "Parents", "Executor of the estate"],
    answer: 1,
    exp: "Absent a directive or appointed agent, the surviving spouse holds first priority under G.S. 130A-420." },
  { id: "DEAD-LAW-021", states: ["NC"], topic: "Disposition Authority", bank: "practice",
    q: "A cremation authorization in NC generally requires a waiting period of:",
    choices: ["No waiting period", "24 hours after death", "48 hours after death", "72 hours after death"],
    answer: 1,
    exp: "Cremation may not occur until 24 hours after death unless a waiver applies." },
  { id: "DEAD-LAW-022", states: ["NC"], topic: "Disposition Authority", bank: "practice",
    q: "If equal-priority next of kin disagree about disposition, the funeral establishment may:",
    choices: ["Choose the first request received", "Rely on a majority of the class or seek court direction", "Defer to the eldest member", "Proceed with burial by default"],
    answer: 1,
    exp: "Statute permits reliance on a majority of the priority class; unresolved disputes go to the clerk of court." },

  // --- Recordkeeping & Reporting ---
  { id: "DEAD-LAW-030", states: ["NC"], topic: "Recordkeeping & Reporting", bank: "practice",
    q: "A death certificate in NC must be filed with the local registrar within how many days of death?",
    choices: ["3 days", "5 days", "10 days", "15 days"],
    answer: 1,
    exp: "The funeral director must file the certificate within 5 days and before final disposition." },
  { id: "DEAD-LAW-031", states: ["NC"], topic: "Recordkeeping & Reporting", bank: "practice",
    q: "Preneed contract records must be retained by the establishment for at least:",
    choices: ["1 year after performance", "3 years after performance or cancellation", "5 years from signing", "Permanently"],
    answer: 1,
    exp: "Records must be kept for 3 years following performance, cancellation, or transfer." },
  { id: "DEAD-LAW-032", states: ["NC"], topic: "Recordkeeping & Reporting", bank: "test",
    q: "Which record must be available for Board inspection at the funeral establishment?",
    choices: ["Employee tax filings", "Itemized statements of goods and services", "Family correspondence", "Vehicle maintenance logs"],
    answer: 1,
    exp: "Itemized statements and related transaction records must be open to Board inspection." },

  // --- Board Rules & Discipline ---
  { id: "DEAD-LAW-040", states: ["NC"], topic: "Board Rules & Discipline", bank: "practice",
    q: "Which of the following is grounds for license discipline by the NC Board of Funeral Service?",
    choices: ["Advertising prices", "Solicitation of dead human bodies", "Offering preneed contracts", "Employing trainees"],
    answer: 1,
    exp: "Solicitation of bodies (directly or through agents) is enumerated as grounds for discipline." },
  { id: "DEAD-LAW-041", states: ["NC"], topic: "Board Rules & Discipline", bank: "practice",
    q: "Before revoking a license, the Board must generally provide the licensee:",
    choices: ["Nothing — revocation is summary", "Notice and an opportunity for a hearing", "A 5-year probation first", "A jury trial"],
    answer: 1,
    exp: "Due process under the Administrative Procedure Act requires notice and a hearing opportunity." },
  { id: "DEAD-LAW-042", states: ["NC"], topic: "Board Rules & Discipline", bank: "practice",
    q: "The maximum civil penalty the Board may assess per violation is:",
    choices: ["$500", "$1,000", "$5,000", "$10,000"],
    answer: 2,
    exp: "The Board may assess civil penalties up to $5,000 per violation." },
];

const FLASHCARDS = [
  { id: "DEAD-FC-001", states: ["NC"], topic: "Licensing & Permits", bank: "practice",
    front: "NC Board of Funeral Service", back: "The licensing authority for funeral directors, embalmers, funeral service licensees, establishments, and preneed licensees in North Carolina." },
  { id: "DEAD-FC-002", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
    front: "Article 13F", back: "The article of G.S. Chapter 90 governing preneed funeral contracts, preneed licensing, and preneed trust requirements." },
  { id: "DEAD-FC-003", states: ["NC"], topic: "Disposition Authority", bank: "practice",
    front: "G.S. 130A-420", back: "NC statute establishing the priority order of persons authorized to direct disposition of a decedent's body." },
  { id: "DEAD-FC-004", states: ["NC"], topic: "Recordkeeping & Reporting", bank: "practice",
    front: "Death certificate filing window", back: "5 days from death — and always before final disposition — filed by the funeral director with the local registrar." },
  { id: "DEAD-FC-005", states: ["NC"], topic: "Board Rules & Discipline", bank: "practice",
    front: "Civil penalty ceiling", back: "$5,000 per violation, assessable by the Board in addition to other disciplinary action." },
  { id: "DEAD-FC-006", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
    front: "Preneed deposit deadline", back: "10 business days from receipt — preneed funds must reach trust or be applied to a funded insurance policy." },
];

const MATCH_PAIRS = [
  { id: "m1", term: "Article 13F", def: "Preneed contracts" },
  { id: "m2", term: "G.S. 130A-420", def: "Disposition priority" },
  { id: "m3", term: "5 days", def: "Death certificate filing" },
  { id: "m4", term: "24 hours", def: "Cremation waiting period" },
  { id: "m5", term: "$5,000", def: "Max civil penalty" },
  { id: "m6", term: "5 hours", def: "Annual CE requirement" },
];

const VIDEO_LESSON = {
  id: "DEAD-VID-001", states: ["NC"], topic: "Preneed Contracts", bank: "practice",
  title: "Preneed Contracts in North Carolina",
  segments: [
    { title: "What makes a contract 'preneed'", duration: 18,
      questions: [
        { q: "A contract is 'preneed' when funeral goods or services are:",
          choices: ["Paid at the time of death", "Arranged and funded before death", "Provided at no charge", "Sold only by insurers"],
          answer: 1, exp: "Preneed means arranged and paid for in advance of need." },
      ] },
    { title: "Licensing: who can sell", duration: 16,
      questions: [
        { q: "Selling preneed contracts in NC requires:",
          choices: ["No special license", "A preneed sales license", "A real estate license", "Board membership"],
          answer: 1, exp: "Individual sellers must hold a preneed sales license from the Board." },
        { q: "The establishment itself must hold:",
          choices: ["A preneed establishment permit", "A notary commission", "A bank charter", "Nothing additional"],
          answer: 0, exp: "Establishments need their own preneed permit in addition to individual sales licenses." },
      ] },
    { title: "Trusting the funds", duration: 20,
      questions: [
        { q: "Preneed funds must be deposited within:",
          choices: ["24 hours", "10 business days", "30 days", "90 days"],
          answer: 1, exp: "10 business days from receipt, into trust or applied to insurance." },
      ] },
    { title: "Cancellation & purchaser rights", duration: 15,
      questions: [
        { q: "On revoking a revocable contract, the purchaser recovers:",
          choices: ["Nothing", "Principal plus earnings, less permitted fees", "50% of payments", "Merchandise only"],
          answer: 1, exp: "Principal and accrued earnings, minus statutorily permitted fees." },
      ] },
  ],
};

const FLASHCARD_SETS = [
  { id: "DEAD-SET-001", states: ["NC"], title: "Core Statutes & Citations", topic: "Mixed review",
    desc: "The numbers and cites that anchor everything else.", cards: FLASHCARDS },
  { id: "DEAD-SET-002", states: ["NC"], title: "Preneed Contracts", topic: "Preneed Contracts",
    desc: "Trusting, funding, cancelling, and reporting.", cards: [
    { id: "DEAD-FC-010", front: "Revocable vs. irrevocable", back: "Revocable contracts can be cancelled by the purchaser for principal plus earnings, less permitted fees. Irrevocable contracts (commonly used for benefits eligibility) may only be transferred to another provider." },
    { id: "DEAD-FC-011", front: "Insurance-funded preneed", back: "A life insurance policy assigned to fund the contract may be used in lieu of a trust deposit." },
    { id: "DEAD-FC-012", front: "Annual preneed report", back: "Preneed establishments report contracts written, performed, and cancelled to the Board each year." },
    { id: "DEAD-FC-013", front: "Merchandise substitution", back: "If contracted merchandise is unavailable at need, the establishment must substitute merchandise of equal or greater quality at no additional cost." },
    { id: "DEAD-FC-014", front: "Preneed sales license", back: "Required for any individual selling preneed contracts — separate from the establishment's own preneed permit." },
  ]},
  { id: "DEAD-SET-003", states: ["NC"], title: "Disposition & Cremation", topic: "Disposition Authority",
    desc: "Who decides, in what order, and when cremation can proceed.", cards: [
    { id: "DEAD-FC-020", front: "Authorizing agent", back: "The person with legal priority to direct disposition under G.S. 130A-420 — directive, appointed agent, spouse, then descending kinship classes." },
    { id: "DEAD-FC-021", front: "Written directive", back: "A decedent's own signed disposition instructions control over the wishes of any next of kin." },
    { id: "DEAD-FC-022", front: "24-hour rule", back: "Cremation may not occur until 24 hours after death, absent a statutory waiver." },
    { id: "DEAD-FC-023", front: "Medical examiner release", back: "When a death falls under medical examiner jurisdiction, cremation requires ME authorization before proceeding." },
    { id: "DEAD-FC-024", front: "Class disagreement", back: "If equal-priority kin disagree, the establishment may rely on a majority of the class; unresolved disputes go to the clerk of court." },
  ]},
  { id: "DEAD-SET-004", states: ["NC"], title: "Licensing, CE & Discipline", topic: "Licensing & Permits",
    desc: "Credentials, traineeship, renewal, and how licenses are lost.", cards: [
    { id: "DEAD-FC-030", front: "FSL", back: "Funeral Service Licensee — the combined credential covering both funeral directing and embalming." },
    { id: "DEAD-FC-031", front: "Resident traineeship", back: "A supervised, permitted traineeship with required case reports, completed under a licensed supervisor before examination." },
    { id: "DEAD-FC-032", front: "CE requirement", back: "5 hours of Board-approved continuing education each year to renew." },
    { id: "DEAD-FC-033", front: "Establishment manager", back: "Every funeral establishment must designate a licensed manager who is answerable to the Board for its operation." },
    { id: "DEAD-FC-034", front: "Civil penalty ceiling", back: "$5,000 per violation, in addition to any suspension, revocation, or probation." },
  ]},
];

const EXAMS = [
  { id: "DEAD-EX-A", states: ["NC"], title: "Full Practice Exam — Form A", topic: null, n: 10, lastScore: 78,
    desc: "10 questions across all five topics under exam conditions. Draws from both banks." },
  { id: "DEAD-EX-B", states: ["NC"], title: "Full Practice Exam — Form B", topic: null, n: 10, lastScore: null,
    desc: "A second mixed form with a fresh draw. Take it cold to check retention." },
  { id: "DEAD-EX-PRE", states: ["NC"], title: "Focus Exam — Preneed Contracts", topic: "Preneed Contracts", n: 4, lastScore: null,
    desc: "Every preneed question in the bank. The heaviest-weighted topic on the NC exam." },
  { id: "DEAD-EX-LIC", states: ["NC"], title: "Focus Exam — Licensing & Permits", topic: "Licensing & Permits", n: 4, lastScore: 50,
    desc: "Credentials, permits, and unlicensed-practice questions only." },
];

const QUIZZES = [
  { id: "DEAD-QZ-MIX", states: ["NC"], title: "Quick 5 — Mixed", topic: null, n: 5, desc: "Five random practice-bank questions, instant feedback." },
  { id: "DEAD-QZ-PRE", states: ["NC"], title: "Preneed Contracts", topic: "Preneed Contracts", n: 5, desc: "Trusts, deposits, cancellation, and sales licensing." },
  { id: "DEAD-QZ-DIS", states: ["NC"], title: "Disposition Authority", topic: "Disposition Authority", n: 5, desc: "Priority order, directives, and cremation timing." },
  { id: "DEAD-QZ-LIC", states: ["NC"], title: "Licensing & Permits", topic: "Licensing & Permits", n: 5, desc: "Who needs which credential, and for how long." },
  { id: "DEAD-QZ-REC", states: ["NC"], title: "Recordkeeping & Reporting", topic: "Recordkeeping & Reporting", n: 5, desc: "Filing windows, retention, and Board inspection." },
  { id: "DEAD-QZ-BRD", states: ["NC"], title: "Board Rules & Discipline", topic: "Board Rules & Discipline", n: 5, desc: "Grounds for discipline, due process, and penalties." },
];

const MATCH_SETS = [
  { id: "DEAD-MG-001", states: ["NC"], title: "Numbers & Deadlines", desc: "Hours, days, and dollar amounts you have to know cold.", pairs: MATCH_PAIRS },
  { id: "DEAD-MG-002", states: ["NC"], title: "Statutes & What They Govern", desc: "Match each citation to its subject.", pairs: [
    { id: "s1", term: "Article 13A", def: "Practice of funeral service" },
    { id: "s2", term: "Article 13F", def: "Preneed contracts" },
    { id: "s3", term: "G.S. 130A-420", def: "Disposition priority" },
    { id: "s4", term: "G.S. 130A-115", def: "Death registration" },
    { id: "s5", term: "Chapter 90", def: "Medicine & allied occupations" },
    { id: "s6", term: "21 NCAC 34", def: "Board administrative rules" },
  ]},
  { id: "DEAD-MG-003", states: ["NC"], title: "Vocabulary", desc: "Core terms of art from the statutes.", pairs: [
    { id: "v1", term: "FSL", def: "Directing + embalming license" },
    { id: "v2", term: "Authorizing agent", def: "Holds disposition priority" },
    { id: "v3", term: "At-need", def: "Arranged after death" },
    { id: "v4", term: "Preneed", def: "Funded before death" },
    { id: "v5", term: "Resident trainee", def: "Supervised pre-licensure permit" },
    { id: "v6", term: "ME release", def: "Required before some cremations" },
  ]},
];

const VIDEO_LESSONS = [
  VIDEO_LESSON,
  { id: "DEAD-VID-002", states: ["NC"], topic: "Disposition Authority", bank: "practice",
    title: "Disposition Authority Basics",
    segments: [
      { title: "The priority list", duration: 15,
        questions: [
          { q: "With no directive or appointed agent, first priority goes to:",
            choices: ["Adult children", "The surviving spouse", "The executor", "Parents"],
            answer: 1, exp: "The surviving spouse holds first priority under G.S. 130A-420." },
        ] },
      { title: "Written directives & appointed agents", duration: 14,
        questions: [
          { q: "A decedent's signed written directive:",
            choices: ["Is advisory only", "Controls over next-of-kin wishes", "Requires spousal consent", "Expires at death"],
            answer: 1, exp: "The decedent's own directive outranks every kinship class." },
        ] },
      { title: "Cremation timing", duration: 16,
        questions: [
          { q: "Absent a waiver, cremation may not occur until:",
            choices: ["Immediately after death", "24 hours after death", "72 hours after death", "The death certificate is amended"],
            answer: 1, exp: "The 24-hour waiting period applies unless statutorily waived." },
        ] },
    ] },
  { id: "DEAD-VID-003", states: ["NC"], topic: "Recordkeeping & Reporting", bank: "practice",
    title: "Recordkeeping Essentials",
    segments: [
      { title: "Filing the death certificate", duration: 14,
        questions: [
          { q: "The death certificate must be filed within:",
            choices: ["3 days", "5 days", "10 days", "30 days"],
            answer: 1, exp: "5 days from death, and always before final disposition." },
        ] },
      { title: "What the Board can inspect", duration: 15,
        questions: [
          { q: "Which must be open to Board inspection at the establishment?",
            choices: ["Employee tax filings", "Itemized statements of goods and services", "Personal correspondence", "Vehicle titles"],
            answer: 1, exp: "Transaction records, including itemized statements, are inspectable." },
        ] },
      { title: "Retention windows", duration: 13,
        questions: [
          { q: "Preneed contract records must be kept for:",
            choices: ["1 year", "3 years after performance or cancellation", "7 years", "Permanently"],
            answer: 1, exp: "3 years following performance, cancellation, or transfer." },
        ] },
    ] },
  { id: "DEAD-VID-004", states: ["NC"], topic: "Board Rules & Discipline", bank: "practice",
    title: "Licensing & the Board: Complaint to Hearing",
    comingSoon: true, est: "≈6 min · 4 segments" },
];

/* Mock attempt history — practice-bank stats derive from this.
   Each session: date, mode, and per-question results. */
const SESSIONS = [
  { date: "Jun 8",  mode: "quiz", results: { "DEAD-LAW-001": 0, "DEAD-LAW-010": 0, "DEAD-LAW-020": 1, "DEAD-LAW-030": 1, "DEAD-LAW-040": 0 } },
  { date: "Jun 12", mode: "exam", score: 58, results: { "DEAD-LAW-001": 1, "DEAD-LAW-002": 0, "DEAD-LAW-010": 0, "DEAD-LAW-011": 1, "DEAD-LAW-020": 1, "DEAD-LAW-021": 0, "DEAD-LAW-030": 1, "DEAD-LAW-031": 0, "DEAD-LAW-040": 1, "DEAD-LAW-041": 0 } },
  { date: "Jun 16", mode: "quiz", results: { "DEAD-LAW-002": 1, "DEAD-LAW-011": 1, "DEAD-LAW-012": 0, "DEAD-LAW-021": 1, "DEAD-LAW-031": 1 } },
  { date: "Jun 20", mode: "exam", score: 67, results: { "DEAD-LAW-001": 1, "DEAD-LAW-003": 1, "DEAD-LAW-010": 1, "DEAD-LAW-012": 0, "DEAD-LAW-020": 1, "DEAD-LAW-022": 0, "DEAD-LAW-030": 1, "DEAD-LAW-032": 1, "DEAD-LAW-041": 1, "DEAD-LAW-042": 0 } },
  { date: "Jun 24", mode: "quiz", results: { "DEAD-LAW-003": 1, "DEAD-LAW-012": 1, "DEAD-LAW-013": 1, "DEAD-LAW-022": 1, "DEAD-LAW-042": 0 } },
  { date: "Jun 29", mode: "exam", score: 78, results: { "DEAD-LAW-002": 1, "DEAD-LAW-010": 1, "DEAD-LAW-011": 1, "DEAD-LAW-020": 1, "DEAD-LAW-021": 1, "DEAD-LAW-030": 1, "DEAD-LAW-031": 1, "DEAD-LAW-040": 0, "DEAD-LAW-041": 1, "DEAD-LAW-042": 0 } },
];

/* ---------------- STATS (practice bank only) ---------------- */
function computeStats() {
  const practiceIds = new Set(QUESTIONS.filter(q => q.bank === "practice").map(q => q.id));
  const byId = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));

  let total = 0, correct = 0;
  const topicTally = {}; // topic -> [correct, total]
  const latest = {};     // qid -> last result
  const attempted = new Set();
  const trend = [];

  SESSIONS.forEach(s => {
    let sc = 0, st = 0;
    Object.entries(s.results).forEach(([qid, r]) => {
      if (!practiceIds.has(qid)) return; // test-only bank excluded from stats
      const t = byId[qid].topic;
      topicTally[t] = topicTally[t] || [0, 0];
      topicTally[t][1]++; if (r) topicTally[t][0]++;
      total++; if (r) correct++;
      sc += r; st++;
      latest[qid] = r;
      attempted.add(qid);
    });
    if (st) trend.push({ date: s.date, acc: Math.round((sc / st) * 100), n: st, mode: s.mode });
  });

  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const coverage = Math.round((attempted.size / practiceIds.size) * 100);
  const missed = Object.entries(latest).filter(([, r]) => !r).map(([qid]) => byId[qid]);
  const topics = TOPICS.map(t => {
    const [c, n] = topicTally[t] || [0, 0];
    return { topic: t, acc: n ? Math.round((c / n) * 100) : 0, n };
  }).sort((a, b) => a.acc - b.acc); // weakest first
  const examTrend = SESSIONS.filter(s => s.mode === "exam").map(s => ({ date: s.date, score: s.score }));
  const readiness = Math.round(accuracy * 0.6 + coverage * 0.25 + (examTrend.at(-1)?.score || 0) * 0.15);
  const bestExam = examTrend.length ? Math.max(...examTrend.map(e => e.score)) : null;
  const delta = trend.length > 1 ? trend.at(-1).acc - trend[0].acc : 0;
  const modeSplit = trend.reduce((a, t) => { a[t.mode] = (a[t.mode] || 0) + t.n; return a; }, {});

  return { accuracy, coverage, missed, topics, trend, examTrend, readiness, volume: total, bestExam, delta, modeSplit };
}

/* ---------------- SHARED UI ---------------- */
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

function BackBar({ title }) {
  const C = useC();
  const st = useSt();
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-lg font-bold" style={{ color: C.text }}>{title}</h2>
      <Tag>{st}</Tag>
    </div>
  );
}

function LineChart({ data, valueKey, color, refValue, refLabel }) {
  const C = useC();
  const col = color || C.accent;
  if (!data.length) return null;
  const w = 300, h = 120, padL = 26, padR = 8, padT = 10, padB = 18;
  const x = i => padL + (i * (w - padL - padR)) / Math.max(1, data.length - 1);
  const y = v => padT + (1 - v / 100) * (h - padT - padB);
  const vals = data.map(d => d[valueKey]);
  const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${x(0)},${y(0) + (h - padT - padB)} ${pts} ${x(vals.length - 1)},${h - padB}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block w-full" role="img">
      {[0, 25, 50, 75, 100].map(g => (
        <g key={g}>
          <line x1={padL} x2={w - padR} y1={y(g)} y2={y(g)} stroke={C.surfaceHi} strokeWidth="1" />
          <text x={padL - 4} y={y(g) + 3} textAnchor="end" fontSize="7" fill={C.dim} fontFamily="DM Mono, monospace">{g}</text>
        </g>
      ))}
      {refValue != null && (
        <g>
          <line x1={padL} x2={w - padR} y1={y(refValue)} y2={y(refValue)} stroke={C.warn} strokeWidth="1" strokeDasharray="3 3" />
          <text x={w - padR} y={y(refValue) - 3} textAnchor="end" fontSize="7" fill={C.warn} fontFamily="DM Mono, monospace">{refLabel}</text>
        </g>
      )}
      <polygon points={area.replace(/^[^ ]+ /, `${x(0)},${h - padB} `)} fill={`${col}22`} />
      <polyline points={pts} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" />
      {vals.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="2.5" fill={col} />
          <text x={x(i)} y={h - 6} textAnchor="middle" fontSize="6.5" fill={C.dim} fontFamily="DM Mono, monospace">{data[i].date}</text>
        </g>
      ))}
    </svg>
  );
}

function SessionBars({ data }) {
  const C = useC();
  const w = 300, h = 110, padB = 18, padT = 14, gap = 10;
  const bw = (w - gap * (data.length + 1)) / data.length;
  const maxN = Math.max(...data.map(d => d.n));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block w-full" role="img">
      {data.map((d, i) => {
        const bh = (d.n / maxN) * (h - padT - padB);
        const bx = gap + i * (bw + gap);
        const col = d.mode === "exam" ? C.primary : C.accent;
        return (
          <g key={i}>
            <rect x={bx} y={h - padB - bh} width={bw} height={bh} rx="3" fill={col} opacity={d.mode === "exam" ? 1 : 0.65} />
            <text x={bx + bw / 2} y={h - padB - bh - 4} textAnchor="middle" fontSize="7.5" fill={C.text} fontFamily="DM Mono, monospace">{d.n}</text>
            <text x={bx + bw / 2} y={h - 6} textAnchor="middle" fontSize="6.5" fill={C.dim} fontFamily="DM Mono, monospace">{d.date}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SubBack({ label, onClick }) {
  const C = useC();
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-sm mb-4"
      style={{ color: C.accent }}>
      <ChevronLeft size={15} /> {label}
    </button>
  );
}

const shuffled = a => [...a].sort(() => Math.random() - 0.5);
// Test-only bank is reserved for practice exams — quizzes and topic drills never draw from it.
const poolFor = (topic, st) => QUESTIONS.filter(q =>
  q.states.includes(st) && q.bank === "practice" && (!topic || q.topic === topic));
const examPool = (topic, st) => QUESTIONS.filter(q =>
  q.states.includes(st) && (!topic || q.topic === topic));

/* ---------------- DASHBOARD ---------------- */
function Dashboard({ go, stats }) {
  const C = useC();
  const st = useSt();
  const ringColor = stats.readiness >= 75 ? C.success : stats.readiness >= 50 ? C.warn : C.danger;
  const weakest = stats.topics[0];
  const tools = [
    { key: "video", label: "Video Lessons", icon: Video },
    { key: "flashcards", label: "Flashcards", icon: Layers },
    { key: "exam", label: "Practice Exams", icon: ClipboardList },
    { key: "quiz", label: "Quizzes", icon: Zap },
    { key: "match", label: "Matching", icon: LayoutGrid },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold" style={{ color: C.text }}>Performance</h1>
        <p className="text-sm mt-1" style={{ color: C.dim }}>
          {STATES.find(x => x.code === st)?.name} Law Exam · practice bank only, test-bank items excluded.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
        <Card className="flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="relative w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.surfaceHi} strokeWidth="3.5" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={ringColor} strokeWidth="3.5"
                strokeDasharray={`${stats.readiness} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ color: ringColor }}>
              {stats.readiness}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: C.text }}>Readiness</div>
            <div className="text-[10px]" style={{ color: C.dim }}>accuracy · coverage · last exam</div>
          </div>
        </Card>
        <Card>
          <div className="text-[11px] mb-1" style={{ color: C.dim }}>Overall accuracy</div>
          <div className="text-xl font-bold" style={{ color: C.text }}>
            {stats.accuracy}%
            <span className="text-xs font-medium ml-1.5" style={{ color: stats.delta >= 0 ? C.success : C.danger }}>
              {stats.delta >= 0 ? "+" : ""}{stats.delta} pts
            </span>
          </div>
          <div className="text-[10px]" style={{ ...mono, color: C.dim }}>since first session</div>
        </Card>
        <Card>
          <div className="text-[11px] mb-1" style={{ color: C.dim }}>Questions answered</div>
          <div className="text-xl font-bold" style={{ color: C.text }}>{stats.volume}</div>
          <div className="text-[10px]" style={{ ...mono, color: C.dim }}>{SESSIONS.length} sessions</div>
        </Card>
        <Card>
          <div className="text-[11px] mb-1" style={{ color: C.dim }}>Topic coverage</div>
          <div className="text-xl font-bold" style={{ color: C.text }}>{stats.coverage}%</div>
          <div className="text-[10px]" style={{ ...mono, color: C.dim }}>of practice bank seen</div>
        </Card>
        <Card onClick={() => go("review")} style={{ border: `1px solid ${C.danger}44` }}>
          <div className="text-[11px] mb-1" style={{ color: C.dim }}>Missed — needs review</div>
          <div className="text-xl font-bold" style={{ color: C.danger }}>{stats.missed.length}</div>
          <div className="text-[10px] flex items-center gap-1" style={{ color: C.danger }}>
            Review now <ArrowRight size={10} />
          </div>
        </Card>
      </div>

      {/* Trend charts */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Card>
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-sm font-semibold" style={{ color: C.text }}>Accuracy over time</div>
            <span style={{ ...mono, color: C.primary }} className="text-[10px]">LATEST {stats.trend.at(-1).acc}%</span>
          </div>
          <LineChart data={stats.trend} valueKey="acc" color={C.primary} />
        </Card>
        <Card>
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-sm font-semibold" style={{ color: C.text }}>Practice exam scores</div>
            <span style={{ ...mono, color: C.success }} className="text-[10px]">BEST {stats.bestExam}%</span>
          </div>
          <LineChart data={stats.examTrend} valueKey="score" color={C.accent} refValue={75} refLabel="PASS 75" />
        </Card>
      </div>

      {/* Topic performance + activity */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Card>
          <div className="text-sm font-semibold mb-1" style={{ color: C.text }}>Topic performance — weakest first</div>
          <p className="text-[11px] mb-3" style={{ color: C.dim }}>
            Weakest right now: <span className="font-semibold" style={{ color: C.danger }}>{weakest.topic}</span> at {weakest.acc}%.
          </p>
          <div className="space-y-2.5">
            {stats.topics.map(t => (
              <div key={t.topic}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: C.text }}>{t.topic}</span>
                  <span style={{ ...mono, color: C.dim }}>
                    <span style={{ color: t.acc < 60 ? C.danger : t.acc < 80 ? C.warn : C.success }}>{t.acc}%</span>
                    {" "}· {t.n} attempts
                  </span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: C.surfaceHi }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${t.acc}%`, background: t.acc < 60 ? C.danger : t.acc < 80 ? C.warn : C.success }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex justify-between items-baseline mb-2">
            <div className="text-sm font-semibold" style={{ color: C.text }}>Practice volume by session</div>
            <span className="flex gap-3 text-[10px]" style={{ ...mono, color: C.dim }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: C.primary }} />EXAM {stats.modeSplit.exam || 0}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: C.accent, opacity: 0.65 }} />QUIZ {stats.modeSplit.quiz || 0}</span>
            </span>
          </div>
          <SessionBars data={stats.trend} />
        </Card>
      </div>

      {/* Session log */}
      <Card className="mb-3">
        <div className="text-sm font-semibold mb-2" style={{ color: C.text }}>Recent sessions</div>
        <div className="grid grid-cols-4 gap-2 text-[10px] uppercase tracking-wider pb-1.5 mb-1"
          style={{ ...mono, color: C.dim, borderBottom: `1px solid ${C.cardBorder}` }}>
          <span>Date</span><span>Mode</span><span className="text-right">Questions</span><span className="text-right">Accuracy</span>
        </div>
        {[...stats.trend].reverse().map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 items-center py-1.5 text-xs"
            style={{ borderBottom: i < stats.trend.length - 1 ? `1px solid ${C.cardBorder}` : "none" }}>
            <span style={{ ...mono, color: C.dim }}>{row.date}</span>
            <span><Tag color={row.mode === "exam" ? C.primary : undefined}>{row.mode}</Tag></span>
            <span className="text-right" style={{ ...mono, color: C.text }}>{row.n}</span>
            <span className="text-right font-semibold"
              style={{ ...mono, color: row.acc < 60 ? C.danger : row.acc < 80 ? C.warn : C.success }}>{row.acc}%</span>
          </div>
        ))}
      </Card>

      {/* Compact tool strip */}
      <div className="flex gap-2 flex-wrap">
        {tools.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => go(t.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
              style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}` }}>
              <Icon size={13} style={{ color: C.accent }} /> {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- FLASHCARDS ---------------- */
function FlashDeck({ set, onExit }) {
  const C = useC();
  const [deck, setDeck] = useState(set.cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck[i];

  const shuffle = () => { setDeck(shuffled(deck)); setI(0); setFlipped(false); };
  const step = d => { setI((i + d + deck.length) % deck.length); setFlipped(false); };

  const face = {
    position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
    borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
    textAlign: "center", padding: "2rem",
  };

  return (
    <div className="max-w-xl mx-auto">
      <SubBack label="All flashcard sets" onClick={onExit} />
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="font-bold" style={{ color: C.text }}>{set.title}</div>
          <span style={{ ...mono, color: C.dim }} className="text-xs">{card.id}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Tag>{set.topic}</Tag>
          <span style={{ ...mono, color: C.dim }} className="text-xs">{i + 1} / {deck.length}</span>
        </div>
      </div>

      <div style={{ perspective: "1200px" }} className="h-[240px] select-none">
        <div onClick={() => setFlipped(!flipped)} role="button" tabIndex={0}
          aria-label={flipped ? "Show term" : "Show answer"}
          onKeyDown={e => (e.key === " " || e.key === "Enter") && setFlipped(!flipped)}
          className="relative w-full h-full cursor-pointer"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none", transition: "transform .45s cubic-bezier(.4,.1,.2,1)" }}>
          <div style={{ ...face, background: C.surface, border: `1px solid ${C.accent}44` }}>
            <div>
              <div style={{ ...mono, color: C.accent }} className="text-[10px] uppercase tracking-widest mb-3">Term — tap to flip</div>
              <div className="text-xl font-bold" style={{ color: C.text }}>{card.front}</div>
            </div>
          </div>
          <div style={{ ...face, background: C.primary, transform: "rotateY(180deg)" }}>
            <div>
              <div style={{ ...mono, color: `${C.onPrimary}AA` }} className="text-[10px] uppercase tracking-widest mb-3">Answer</div>
              <div className="text-base" style={{ color: C.onPrimary }}>{card.back}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={() => step(-1)} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm"
          style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}` }}>
          <ChevronLeft size={15} /> Prev
        </button>
        <button onClick={shuffle} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm"
          style={{ background: C.surface, color: C.accent, border: `1px solid ${C.cardBorder}` }}>
          <Shuffle size={14} /> Shuffle
        </button>
        <button onClick={() => step(1)} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm"
          style={{ background: C.primary, color: C.onPrimary }}>
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Flashcards() {
  const C = useC();
  const st = useSt();
  const [sel, setSel] = useState(null);
  if (sel) return <FlashDeck key={sel.id} set={sel} onExit={() => setSel(null)} />;
  return (
    <div className="max-w-2xl mx-auto">
      <BackBar title="Flashcards" />
      <p className="text-sm mb-4 -mt-2" style={{ color: C.dim }}>Pick a set. Tap a card to flip it, and shuffle before a second pass.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {FLASHCARD_SETS.filter(f => inState(f, st)).map(set => (
          <Card key={set.id} onClick={() => setSel(set)} style={{ border: `1px solid ${C.primary}55` }}>
            <div className="flex justify-between items-start mb-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.primary}22`, color: C.accent }}>
                <Layers size={16} />
              </span>
              <span style={{ ...mono, color: C.accent }} className="text-[10px]">{set.cards.length} cards</span>
            </div>
            <div className="font-bold mb-0.5" style={{ color: C.text }}>{set.title}</div>
            <div className="text-xs mb-2" style={{ color: C.dim }}>{set.desc}</div>
            <Tag>{set.topic}</Tag>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- QUIZZES ---------------- */
function QuizGame({ quiz, onExit }) {
  const C = useC();
  const st = useSt();
  const qs = useMemo(() => shuffled(poolFor(quiz.topic, st)).slice(0, quiz.n), [quiz, st]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = qs[i];

  const pick = c => {
    if (picked !== null) return;
    setPicked(c);
    if (c === q.answer) setScore(s => s + 1);
  };
  const next = () => {
    if (i + 1 >= qs.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  };

  if (done) return (
    <div className="max-w-xl mx-auto">
      <SubBack label="All quizzes" onClick={onExit} />
      <Card className="text-center py-10">
        <div className="text-4xl font-bold mb-2" style={{ color: score / qs.length >= 0.8 ? C.success : C.warn }}>{score} / {qs.length}</div>
        <div className="text-sm mb-6" style={{ color: C.dim }}>{quiz.title} · {score / qs.length >= 0.8 ? "Strong round." : "Review the misses and run it again."}</div>
        <button onClick={onExit} className="px-5 py-2 rounded-lg" style={{ background: C.primary, color: C.onPrimary }}>Back to quizzes</button>
      </Card>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <SubBack label="All quizzes" onClick={onExit} />
      <div className="flex justify-between items-center mb-2">
        <span style={{ ...mono, color: C.dim }} className="text-xs">{q.id} · {q.topic}</span>
        <span style={{ ...mono, color: C.accent }} className="text-xs">{i + 1} / {qs.length}</span>
      </div>
      <div className="h-1 rounded-full mb-3" style={{ background: C.surfaceHi }}>
        <div className="h-1 rounded-full transition-all" style={{ width: `${((i + (picked !== null ? 1 : 0)) / qs.length) * 100}%`, background: C.accent }} />
      </div>
      <Card>
        <p className="font-semibold mb-4" style={{ color: C.text }}>{q.q}</p>
        <div className="space-y-2">
          {q.choices.map((c, ci) => {
            let bg = C.surfaceHi, border = "transparent";
            if (picked !== null) {
              if (ci === q.answer) { bg = `${C.success}22`; border = C.success; }
              else if (ci === picked) { bg = `${C.danger}22`; border = C.danger; }
            }
            return (
              <button key={ci} onClick={() => pick(ci)} disabled={picked !== null}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition"
                style={{ background: bg, color: C.text, border: `1px solid ${border}` }}>
                {c}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-4 p-3 rounded-lg text-sm" style={{ background: C.base, color: C.dim }}>
            <span style={{ color: picked === q.answer ? C.success : C.danger }} className="font-semibold">
              {picked === q.answer ? "Correct. " : "Not quite. "}
            </span>
            {q.exp}
          </div>
        )}
      </Card>
      {picked !== null && (
        <button onClick={next} className="mt-4 w-full py-2.5 rounded-lg font-semibold" style={{ background: C.primary, color: C.onPrimary }}>
          {i + 1 >= qs.length ? "See results" : "Next question →"}
        </button>
      )}
    </div>
  );
}

function Quiz() {
  const C = useC();
  const st = useSt();
  const [sel, setSel] = useState(null);
  if (sel) return <QuizGame key={sel.id} quiz={sel} onExit={() => setSel(null)} />;
  return (
    <div className="max-w-2xl mx-auto">
      <BackBar title="Quizzes" />
      <p className="text-sm mb-4 -mt-2" style={{ color: C.dim }}>Short rounds with instant feedback. Topic quizzes pull every question we have on that subject.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {QUIZZES.filter(q => inState(q, st)).map(qz => {
          const available = Math.min(qz.n, poolFor(qz.topic, st).length);
          return (
            <Card key={qz.id} onClick={() => setSel(qz)} style={{ border: `1px solid ${C.primary}55` }}>
              <div className="flex justify-between items-start mb-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.primary}22`, color: C.accent }}>
                  <Zap size={16} />
                </span>
                <span style={{ ...mono, color: C.accent }} className="text-[10px]">{available} questions</span>
              </div>
              <div className="font-bold mb-0.5" style={{ color: C.text }}>{qz.title}</div>
              <div className="text-xs" style={{ color: C.dim }}>{qz.desc}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- PRACTICE EXAMS ---------------- */
function ExamRun({ exam, onExit }) {
  const C = useC();
  const st = useSt();
  const qs = useMemo(() => shuffled(examPool(exam.topic, st)).slice(0, exam.n), [exam, st]);
  const [phase, setPhase] = useState("active");
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState(new Set());
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (phase !== "active") return;
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const q = qs[i];
  const answered = Object.keys(answers).length;

  if (phase === "results") {
    const correct = qs.filter(x => answers[x.id] === x.answer);
    const missed = qs.filter(x => answers[x.id] !== x.answer);
    const pct = Math.round((correct.length / qs.length) * 100);
    return (
      <div className="max-w-xl mx-auto">
        <SubBack label="All exams" onClick={onExit} />
        <Card className="text-center py-8 mb-4">
          <div style={{ ...mono, color: C.dim }} className="text-[10px] uppercase tracking-widest mb-1">{exam.title}</div>
          <div className="text-5xl font-bold mb-1" style={{ color: pct >= 75 ? C.success : pct >= 50 ? C.warn : C.danger }}>{pct}%</div>
          <div className="text-sm" style={{ color: C.dim }}>{correct.length} of {qs.length} correct · {fmt(secs)} elapsed</div>
        </Card>
        {missed.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold" style={{ color: C.danger }}>Missed questions ({missed.length})</div>
            {missed.map(m => (
              <Card key={m.id} style={{ border: `1px solid ${C.danger}44` }}>
                <div style={{ ...mono, color: C.dim }} className="text-[10px] mb-1">{m.id} · {m.topic}</div>
                <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>{m.q}</p>
                <p className="text-xs mb-1" style={{ color: C.danger }}>
                  Your answer: {answers[m.id] != null ? m.choices[answers[m.id]] : "— skipped"}
                </p>
                <p className="text-xs mb-2" style={{ color: C.success }}>Correct: {m.choices[m.answer]}</p>
                <p className="text-xs" style={{ color: C.dim }}>{m.exp}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <SubBack label="All exams" onClick={onExit} />
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold" style={{ color: C.text }}>{exam.title}</span>
        <div className="flex gap-3">
          <span style={{ ...mono, color: C.accent }} className="text-xs">{fmt(secs)}</span>
          <span style={{ ...mono, color: C.dim }} className="text-xs">{answered} / {qs.length}</span>
        </div>
      </div>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {qs.map((x, xi) => {
          const isCur = xi === i, has = answers[x.id] != null, flg = flags.has(x.id);
          return (
            <button key={x.id} onClick={() => setI(xi)} aria-label={`Question ${xi + 1}`}
              className="w-8 h-8 rounded-md text-xs font-semibold"
              style={{
                background: isCur ? C.primary : has ? `${C.success}33` : C.surface,
                color: isCur ? C.onPrimary : has ? C.success : C.dim,
                border: flg ? `2px solid ${C.warn}` : `2px solid ${isCur || has ? "transparent" : C.cardBorder}`,
                fontFamily: "'DM Mono', monospace",
              }}>{xi + 1}</button>
          );
        })}
      </div>
      <Card>
        <div className="flex justify-between items-start mb-3">
          <span style={{ ...mono, color: C.dim }} className="text-[10px]">{q.id} · {q.topic}{q.bank === "test" ? " · TEST BANK" : ""}</span>
          <button onClick={() => {
            const f = new Set(flags); f.has(q.id) ? f.delete(q.id) : f.add(q.id); setFlags(f);
          }} className="flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ background: flags.has(q.id) ? `${C.warn}33` : C.surfaceHi, color: flags.has(q.id) ? C.warn : C.dim }}>
            <Flag size={11} fill={flags.has(q.id) ? "currentColor" : "none"} />
            {flags.has(q.id) ? "Flagged" : "Flag"}
          </button>
        </div>
        <p className="font-semibold mb-4" style={{ color: C.text }}>{q.q}</p>
        <div className="space-y-2">
          {q.choices.map((c, ci) => (
            <button key={ci} onClick={() => setAnswers({ ...answers, [q.id]: ci })}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm"
              style={{
                background: answers[q.id] === ci ? `${C.primary}44` : C.surfaceHi,
                border: `1px solid ${answers[q.id] === ci ? C.accent : "transparent"}`,
                color: C.text,
              }}>{c}</button>
          ))}
        </div>
      </Card>
      <div className="flex justify-between mt-4 gap-2">
        <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}
          className="px-4 py-2 rounded-lg text-sm disabled:opacity-40" style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}` }}>← Prev</button>
        {i < qs.length - 1 ? (
          <button onClick={() => setI(i + 1)} className="px-4 py-2 rounded-lg text-sm" style={{ background: C.surface, color: C.text, border: `1px solid ${C.cardBorder}` }}>Next →</button>
        ) : null}
        <button onClick={() => setPhase("results")}
          className="px-4 py-2 rounded-lg text-sm font-semibold ml-auto"
          style={{ background: answered === qs.length ? C.success : C.surface, color: answered === qs.length ? "#FFFFFF" : C.warn }}>
          Submit exam
        </button>
      </div>
    </div>
  );
}

function Exam() {
  const C = useC();
  const st = useSt();
  const [sel, setSel] = useState(null);
  if (sel) return <ExamRun key={sel.id} exam={sel} onExit={() => setSel(null)} />;
  return (
    <div className="max-w-2xl mx-auto">
      <BackBar title="Practice Exams" />
      <p className="text-sm mb-4 -mt-2" style={{ color: C.dim }}>
        Exam conditions: no feedback until you submit, flag anything to revisit, timer counts up. Full forms draw from both banks.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {EXAMS.filter(e => inState(e, st)).map(ex => {
          const available = Math.min(ex.n, examPool(ex.topic, st).length);
          return (
            <Card key={ex.id} onClick={() => setSel(ex)} style={{ border: `1px solid ${C.primary}55` }}>
              <div className="flex justify-between items-start mb-2">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.primary}22`, color: C.accent }}>
                  <ClipboardList size={16} />
                </span>
                <span style={{ ...mono, color: C.accent }} className="text-[10px]">{available} questions</span>
              </div>
              <div className="font-bold mb-0.5" style={{ color: C.text }}>{ex.title}</div>
              <div className="text-xs mb-2" style={{ color: C.dim }}>{ex.desc}</div>
              <div className="flex items-center justify-between">
                {ex.lastScore != null
                  ? <span style={{ ...mono, color: ex.lastScore >= 75 ? C.success : C.warn }} className="text-[10px]">LAST: {ex.lastScore}%</span>
                  : <span style={{ ...mono, color: C.dim }} className="text-[10px]">NOT ATTEMPTED</span>}
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.accent }}>
                  Start <ArrowRight size={12} />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MATCHING GAME ---------------- */
function MatchGame({ set, onExit }) {
  const C = useC();
  const tiles = useMemo(() =>
    shuffled(set.pairs.flatMap(p => [
      { key: p.id + "-t", pair: p.id, label: p.term, kind: "term" },
      { key: p.id + "-d", pair: p.id, label: p.def, kind: "def" },
    ])), [set]);
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(null);
  const [moves, setMoves] = useState(0);
  const done = matched.size === set.pairs.length;

  const tap = t => {
    if (matched.has(t.pair) || wrong) return;
    if (!sel) { setSel(t); return; }
    if (sel.key === t.key) { setSel(null); return; }
    setMoves(m => m + 1);
    if (sel.pair === t.pair && sel.kind !== t.kind) {
      setMatched(new Set([...matched, t.pair]));
      setSel(null);
    } else {
      setWrong([sel.key, t.key]);
      setTimeout(() => { setWrong(null); setSel(null); }, 600);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <SubBack label="All matching sets" onClick={onExit} />
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold" style={{ color: C.text }}>{set.title}</span>
        <span style={{ ...mono, color: C.dim }} className="text-xs">{matched.size} / {set.pairs.length} · {moves} moves</span>
      </div>
      {done ? (
        <Card className="text-center py-10">
          <div className="text-3xl font-bold mb-2" style={{ color: C.success }}>All matched</div>
          <div className="text-sm mb-6" style={{ color: C.dim }}>{moves} moves. Perfect is {set.pairs.length}.</div>
          <button onClick={onExit} className="px-5 py-2 rounded-lg" style={{ background: C.primary, color: C.onPrimary }}>Pick another set</button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tiles.map(t => {
            const isMatched = matched.has(t.pair);
            const isSel = sel?.key === t.key;
            const isWrong = wrong?.includes(t.key);
            return (
              <button key={t.key} onClick={() => tap(t)} disabled={isMatched}
                className="rounded-lg p-3 text-xs min-h-[64px] transition"
                style={{
                  background: isMatched ? `${C.success}1E` : isWrong ? `${C.danger}33` : isSel ? C.primary : C.surface,
                  color: isMatched ? C.success : isSel ? C.onPrimary : C.text,
                  border: `1px solid ${isMatched ? C.success : isWrong ? C.danger : isSel ? C.accent : C.cardBorder}`,
                  opacity: isMatched ? 0.6 : 1,
                  fontFamily: t.kind === "term" ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
                }}>{t.label}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Matching() {
  const C = useC();
  const st = useSt();
  const [sel, setSel] = useState(null);
  if (sel) return <MatchGame key={sel.id} set={sel} onExit={() => setSel(null)} />;
  return (
    <div className="max-w-2xl mx-auto">
      <BackBar title="Matching Game" />
      <p className="text-sm mb-4 -mt-2" style={{ color: C.dim }}>Pair each term with its definition. Fewest moves wins.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {MATCH_SETS.filter(m => inState(m, st)).map(set => (
          <Card key={set.id} onClick={() => setSel(set)} style={{ border: `1px solid ${C.primary}55` }}>
            <div className="flex justify-between items-start mb-2">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.primary}22`, color: C.accent }}>
                <LayoutGrid size={16} />
              </span>
              <span style={{ ...mono, color: C.accent }} className="text-[10px]">{set.pairs.length} pairs</span>
            </div>
            <div className="font-bold mb-0.5" style={{ color: C.text }}>{set.title}</div>
            <div className="text-xs" style={{ color: C.dim }}>{set.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- VIDEO LESSONS ---------------- */
function VideoPlayer({ lesson, onExit }) {
  const C = useC();
  const D = THEMES.dark; // player interior is always dark, like a real video player
  const segs = lesson.segments;
  const totalDur = segs.reduce((a, s) => a + s.duration, 0);
  const segStart = si => segs.slice(0, si).reduce((a, s) => a + s.duration, 0);

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [checkpoint, setCheckpoint] = useState(null);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [passedSegs, setPassedSegs] = useState(new Set());

  const segAt = time => {
    let acc = 0;
    for (let i = 0; i < segs.length; i++) { acc += segs[i].duration; if (time < acc) return i; }
    return segs.length - 1;
  };
  const curSeg = segAt(Math.min(t, totalDur - 0.01));

  useEffect(() => {
    if (!playing || checkpoint !== null) return;
    const iv = setInterval(() => {
      setT(prev => {
        const next = prev + 0.1;
        const si = segAt(prev);
        const boundary = segStart(si) + segs[si].duration;
        if (next >= boundary) {
          if (!passedSegs.has(si) && segs[si].questions.length) {
            setPlaying(false);
            setCheckpoint(si);
            setQi(0); setPicked(null);
            return boundary - 0.01;
          }
          if (next >= totalDur) { setPlaying(false); return totalDur; }
        }
        return next;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [playing, checkpoint, passedSegs]);

  const jumpTo = si => {
    setCheckpoint(null); setPicked(null);
    setT(segStart(si));
    setPlaying(true);
  };

  const answerCheckpoint = ci => { if (picked === null) setPicked(ci); };
  const continueFromCheckpoint = () => {
    const seg = segs[checkpoint];
    if (qi + 1 < seg.questions.length) {
      setQi(qi + 1); setPicked(null);
    } else {
      setPassedSegs(new Set([...passedSegs, checkpoint]));
      const nextStart = segStart(checkpoint) + seg.duration;
      setCheckpoint(null); setPicked(null);
      if (nextStart < totalDur) { setT(nextStart); setPlaying(true); }
      else setT(totalDur);
    }
  };

  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const cq = checkpoint !== null ? segs[checkpoint].questions[qi] : null;

  return (
    <div className="max-w-2xl mx-auto">
      <SubBack label="All lessons" onClick={onExit} />
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span style={{ ...mono, color: C.dim }} className="text-xs">{lesson.id}</span>
        <Tag>{lesson.topic}</Tag>
        <Tag color={C.success}>Practice bank</Tag>
      </div>
      <h3 className="text-lg font-bold mb-3" style={{ color: C.text }}>{lesson.title}</h3>

      {/* Player */}
      <div className="relative rounded-xl overflow-hidden mb-1"
        style={{ background: "radial-gradient(120% 130% at 50% 0%, #2A2312 0%, #0B0906 62%)", aspectRatio: "16/9", border: `1px solid ${D.primary}44` }}>
        {checkpoint === null ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div style={{ ...mono, color: D.accent }} className="text-[10px] uppercase tracking-widest mb-2">
              Segment {curSeg + 1} of {segs.length}
            </div>
            <div className="text-xl font-bold mb-6 px-6 text-center" style={{ color: D.text }}>
              {segs[curSeg].title}
            </div>
            <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}
              className="w-14 h-14 rounded-full flex items-center justify-center transition hover:scale-105"
              style={{ background: D.primary, color: D.onPrimary, boxShadow: `0 0 32px ${D.primary}66` }}>
              {playing ? <Pause size={22} fill={D.onPrimary} /> : <Play size={22} fill={D.onPrimary} style={{ marginLeft: 3 }} />}
            </button>
            <div style={{ ...mono, color: D.dim }} className="text-xs mt-4">{fmt(t)} / {fmt(totalDur)} · simulated playback</div>
          </div>
        ) : (
          <div className="absolute inset-0 p-5 overflow-y-auto" style={{ background: `${D.base}F2` }}>
            <div style={{ ...mono, color: D.warn }} className="text-[10px] uppercase tracking-widest mb-2">
              Checkpoint · {segs[checkpoint].title} · Q{qi + 1}/{segs[checkpoint].questions.length}
            </div>
            <p className="font-semibold mb-3 text-sm" style={{ color: D.text }}>{cq.q}</p>
            <div className="space-y-2">
              {cq.choices.map((c, ci) => {
                let bg = D.surface, border = "transparent";
                if (picked !== null) {
                  if (ci === cq.answer) { bg = `${D.success}22`; border = D.success; }
                  else if (ci === picked) { bg = `${D.danger}22`; border = D.danger; }
                }
                return (
                  <button key={ci} onClick={() => answerCheckpoint(ci)} disabled={picked !== null}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs"
                    style={{ background: bg, color: D.text, border: `1px solid ${border}` }}>{c}</button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <p className="text-xs mt-3" style={{ color: D.dim }}>
                  <span style={{ color: picked === cq.answer ? D.success : D.danger }} className="font-semibold">
                    {picked === cq.answer ? "Correct. " : "Not quite. "}
                  </span>{cq.exp}
                </p>
                <button onClick={continueFromCheckpoint}
                  className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: D.primary, color: D.onPrimary }}>
                  {qi + 1 < segs[checkpoint].questions.length ? "Next question" : "Resume video →"}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Chapter scrubber with segment boundaries */}
      <div className="flex gap-1 mb-1" role="group" aria-label="Chapter scrubber">
        {segs.map((sg, si) => {
          const start = segStart(si);
          const prog = Math.min(1, Math.max(0, (t - start) / sg.duration));
          return (
            <button key={si} onClick={() => jumpTo(si)} title={sg.title}
              className="h-2 rounded-full overflow-hidden relative"
              style={{ flex: sg.duration, background: C.surfaceHi }}>
              <span className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${prog * 100}%`, background: passedSegs.has(si) ? C.success : C.accent }} />
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] mb-4" style={{ ...mono, color: C.dim }}>
        <span>{fmt(t)}</span><span>{fmt(totalDur)}</span>
      </div>

      {/* Chapter list for rewatching */}
      <div className="space-y-1.5">
        {segs.map((sg, si) => (
          <button key={si} onClick={() => jumpTo(si)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm"
            style={{ background: si === curSeg ? C.surfaceHi : C.surface, color: C.text, border: `1px solid ${si === curSeg ? C.accent + "66" : C.cardBorder}` }}>
            <span className="flex items-center gap-2">
              <span style={{ ...mono, color: passedSegs.has(si) ? C.success : C.dim }} className="text-xs flex items-center">
                {passedSegs.has(si) ? <Check size={13} /> : String(si + 1).padStart(2, "0")}
              </span>
              {sg.title}
            </span>
            <span style={{ ...mono, color: C.dim }} className="text-xs">
              {fmt(sg.duration)} · {sg.questions.length} Q
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoLesson() {
  const C = useC();
  const st = useSt();
  const [sel, setSel] = useState(null);
  const fmtTotal = lesson => {
    const d = lesson.segments.reduce((a, s) => a + s.duration, 0);
    return `${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`;
  };
  if (sel) return <VideoPlayer key={sel.id} lesson={sel} onExit={() => setSel(null)} />;
  return (
    <div className="max-w-2xl mx-auto">
      <BackBar title="Video Lessons" />
      <p className="text-sm mb-4 -mt-2" style={{ color: C.dim }}>
        Short lessons that pause at each segment for a checkpoint question. Answer to keep watching.
      </p>
      <div className="space-y-3">
        {VIDEO_LESSONS.filter(v => inState(v, st)).map(lesson => {
          const soon = lesson.comingSoon;
          const qCount = soon ? null : lesson.segments.reduce((a, s) => a + s.questions.length, 0);
          return (
            <Card key={lesson.id} onClick={soon ? undefined : () => setSel(lesson)}
              className="flex gap-4 items-stretch" style={{ opacity: soon ? 0.6 : 1, border: `1px solid ${C.primary}55` }}>
              <div className="w-32 sm:w-40 shrink-0 rounded-lg flex items-center justify-center"
                style={{ background: "radial-gradient(120% 130% at 50% 0%, #2A2312 0%, #0B0906 70%)", aspectRatio: "16/9" }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: soon ? THEMES.dark.surfaceHi : C.primary, color: C.onPrimary }}>
                  <Play size={15} fill={soon ? THEMES.dark.dim : C.onPrimary} style={{ marginLeft: 2 }} />
                </span>
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span style={{ ...mono, color: C.dim }} className="text-[10px]">{lesson.id}</span>
                  <Tag>{lesson.topic}</Tag>
                  {soon && <Tag color={C.warn}>Coming soon</Tag>}
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: C.text }}>{lesson.title}</div>
                <div style={{ ...mono, color: C.dim }} className="text-[10px]">
                  {soon ? lesson.est : `${fmtTotal(lesson)} · ${lesson.segments.length} segments · ${qCount} checkpoint questions`}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MISSED-QUESTION REVIEW ---------------- */
function Review({ stats, go }) {
  const C = useC();
  return (
    <div className="max-w-xl mx-auto">
      <BackBar title="Missed Questions" />
      {stats.missed.length === 0 ? (
        <Card className="text-center py-10">
          <div className="font-bold mb-1" style={{ color: C.success }}>Nothing to review</div>
          <div className="text-sm" style={{ color: C.dim }}>Every practice question you have seen, you got right on the last try.</div>
        </Card>
      ) : (
        <>
          <p className="text-sm mb-4 flex items-start gap-2" style={{ color: C.dim }}>
            <AlertTriangle size={15} style={{ color: C.warn, marginTop: 2, flexShrink: 0 }} />
            These {stats.missed.length} practice-bank questions were wrong on your most recent attempt.
            Read the explanation, then run a quiz to clear them.
          </p>
          <div className="space-y-3 mb-4">
            {stats.missed.map(m => (
              <Card key={m.id}>
                <div className="flex justify-between items-start mb-2">
                  <span style={{ ...mono, color: C.dim }} className="text-[10px]">{m.id}</span>
                  <Tag>{m.topic}</Tag>
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: C.text }}>{m.q}</p>
                <p className="text-xs mb-2" style={{ color: C.success }}>
                  <Check size={11} className="inline mr-1" style={{ verticalAlign: "-1px" }} />
                  {m.choices[m.answer]}
                </p>
                <p className="text-xs" style={{ color: C.dim }}>{m.exp}</p>
              </Card>
            ))}
          </div>
          <button onClick={() => go("quiz")} className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
            style={{ background: C.primary, color: C.onPrimary }}>
            <Zap size={15} /> Drill these with a quiz
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------- MARKETING SITE (LOGGED OUT) ---------------- */
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

/* ---------------- APP SHELL ---------------- */
const NAV = [
  { key: "video", label: "Video Lessons", icon: Video, featured: true },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "flashcards", label: "Flashcards", icon: Layers },
  { key: "exam", label: "Practice Exam", icon: ClipboardList },
  { key: "quiz", label: "Quizzes", icon: Zap },
  { key: "match", label: "Matching", icon: LayoutGrid },
];

function NavBar({ screen, go, theme, setTheme, stateCode, onSignOut }) {
  const C = THEMES[theme];
  return (
    <header className="sticky top-0 z-20" style={{ background: C.nav, borderBottom: `1px solid ${C.cardBorder}` }}>
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-3 h-14">
        <button onClick={() => go("dashboard")} className="flex items-center gap-2 shrink-0" aria-label="DEAD! Legal home">
          <span className="text-lg font-bold tracking-tight" style={{ color: C.text }}>Anubis</span>
          <span style={{ ...mono, color: C.accent, border: `1px solid ${C.accent}55`, background: `${C.accent}14` }}
            className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">Legal</span>
        </button>
        <nav aria-label="Primary" className="flex gap-0.5 overflow-x-auto flex-1 justify-end">
          {NAV.map(n => {
            const active = screen === n.key;
            const Icon = n.icon;
            return (
              <button key={n.key} onClick={() => go(n.key)} aria-current={active ? "page" : undefined}
                title={n.label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm whitespace-nowrap font-medium transition"
                style={{
                  background: active ? C.primary : n.featured ? `${C.primary}1A` : "transparent",
                  color: active ? C.onPrimary : n.featured ? C.accent : C.dim,
                  border: n.featured && !active ? `1px solid ${C.accent}55` : "1px solid transparent",
                }}>
                <Icon size={15} strokeWidth={2.25} />
                <span className={n.featured ? "" : "hidden md:inline"}>{n.label}</span>
                {n.featured && !active && (
                  <span style={{ ...mono, background: C.accent, color: "#FFFFFF" }}
                    className="text-[9px] px-1 py-px rounded font-medium leading-none">NEW</span>
                )}
              </button>
            );
          })}
        </nav>
        <span title="Your state (set at signup)"
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs shrink-0"
          style={{ ...mono, background: `${C.primary}22`, color: C.text, border: `1px solid ${C.primary}66` }}>
          <MapPin size={12} style={{ color: C.primary }} /> {stateCode}
        </span>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="p-2 rounded-lg shrink-0"
          style={{ background: C.surfaceHi, color: C.text }}>
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button onClick={onSignOut} aria-label="Sign out" title="Sign out"
          className="p-2 rounded-lg shrink-0"
          style={{ background: C.surfaceHi, color: C.dim }}>
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');`;

export default function App() {
  const [view, setView] = useState("landing"); // landing | login | signup | app
  const [screen, setScreen] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [stateCode, setStateCode] = useState(null);
  const stats = useMemo(() => computeStats(), []);
  const C = THEMES[theme];
  const go = s => setScreen(s);

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

  if (view === "landing") return shell(<Landing go={setView} theme={theme} setTheme={setTheme} />);

  if (view === "login" || view === "signup") {
    return shell(
      <Auth mode={view} go={setView}
        onAuth={code => {
          // Signup: state is chosen here, once. Login: returning user keeps their state
          // (mocked as NC for this prototype since there's no persisted account).
          setStateCode(code || stateCode || "NC");
          setView("app");
          setScreen("dashboard");
        }} />
    );
  }

  return shell(
     <StateCtx.Provider value={stateCode}>
      <div className="min-h-screen" style={{ background: C.base, fontFamily: "'DM Sans', sans-serif" }}>
        <NavBar screen={screen} go={go} theme={theme} setTheme={setTheme}
          stateCode={stateCode}
          onSignOut={() => { setStateCode(null); setView("landing"); }} />
        <div className="max-w-4xl mx-auto px-4 py-6">
          {screen === "dashboard" && <Dashboard go={go} stats={stats} />}
          {screen === "flashcards" && <Flashcards />}
          {screen === "quiz" && <Quiz />}
          {screen === "exam" && <Exam />}
          {screen === "match" && <Matching />}
          {screen === "video" && <VideoLesson />}
          {screen === "review" && <Review stats={stats} go={go} />}
        </div>
        <footer className="max-w-4xl mx-auto px-4 py-6 mt-4 flex items-center justify-between text-[11px]"
          style={{ color: C.dim, borderTop: `1px solid ${C.cardBorder}` }}>
          <span style={mono}>DEAD! LEGAL · NC EDITION · PROTOTYPE</span>
          <span>© 2026 Anubis Publications DBA DEAD!</span>
        </footer>
      </div>
     </StateCtx.Provider>
  );
}
