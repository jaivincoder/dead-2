import type {
  ExamForm,
  Flashcard,
  FlashcardSet,
  MatchPair,
  MatchSet,
  Question,
  QuizSet,
  StateOption,
  StudySession,
  VideoLesson,
} from './models';

/**
 * TEMPORARY MOCK. The study API is not available.
 * Catalog reads this module. Swap the service implementation, not the templates.
 */

export const STATES: readonly StateOption[] = [
  { code: 'NC', name: 'North Carolina', ready: true },
  { code: 'SC', name: 'South Carolina', ready: false },
  { code: 'VA', name: 'Virginia', ready: false },
  { code: 'GA', name: 'Georgia', ready: false },
  { code: 'TN', name: 'Tennessee', ready: false },
  { code: 'FL', name: 'Florida', ready: false },
  { code: 'OH', name: 'Ohio', ready: false },
  { code: 'TX', name: 'Texas', ready: false },
];

export const TOPICS: readonly string[] = [
  'Licensing & Permits',
  'Preneed Contracts',
  'Disposition Authority',
  'Recordkeeping & Reporting',
  'Board Rules & Discipline',
];

export const QUESTIONS: readonly Question[] = [
  {
    id: 'DEAD-LAW-001',
    states: ['NC'],
    topic: 'Licensing & Permits',
    bank: 'practice',
    q: 'In North Carolina, which body issues funeral establishment permits?',
    choices: [
      'NC Department of Health and Human Services',
      'NC Board of Funeral Service',
      'County Register of Deeds',
      'NC Secretary of State',
    ],
    answer: 1,
    exp: 'The NC Board of Funeral Service licenses individuals and issues establishment permits under G.S. Chapter 90, Article 13A.',
  },
  {
    id: 'DEAD-LAW-002',
    states: ['NC'],
    topic: 'Licensing & Permits',
    bank: 'practice',
    q: 'A funeral service licensee in NC must complete how many hours of continuing education per year?',
    choices: ['3 hours', '5 hours', '8 hours', '12 hours'],
    answer: 1,
    exp: 'NC requires 5 hours of Board-approved continuing education annually for license renewal.',
  },
  {
    id: 'DEAD-LAW-003',
    states: ['NC'],
    topic: 'Licensing & Permits',
    bank: 'practice',
    q: 'A resident trainee permit in NC is generally valid for what period before renewal?',
    choices: ['6 months', '12 months', '24 months', '36 months'],
    answer: 1,
    exp: 'Trainee permits are issued on a 12-month basis and renewed as the traineeship continues.',
  },
  {
    id: 'DEAD-LAW-004',
    states: ['NC'],
    topic: 'Licensing & Permits',
    bank: 'test',
    q: 'Operating a funeral establishment without a valid permit in NC is punishable as:',
    choices: ['A Class 1 misdemeanor', 'A civil infraction only', 'A Class H felony', 'License suspension only'],
    answer: 0,
    exp: 'Unlicensed practice provisions classify this as a Class 1 misdemeanor.',
  },
  {
    id: 'DEAD-LAW-010',
    states: ['NC'],
    topic: 'Preneed Contracts',
    bank: 'practice',
    q: 'NC preneed funeral contracts are governed primarily by which statutory article?',
    choices: ['Article 13A', 'Article 13D', 'Article 13F', 'Article 9'],
    answer: 2,
    exp: 'Article 13F of G.S. Chapter 90 governs preneed funeral contracts and preneed licensing.',
  },
  {
    id: 'DEAD-LAW-011',
    states: ['NC'],
    topic: 'Preneed Contracts',
    bank: 'practice',
    q: 'Funds from a standard preneed contract in NC must be deposited within how many days of receipt?',
    choices: ['5 business days', '10 business days', '30 calendar days', '60 calendar days'],
    answer: 1,
    exp: 'Preneed funds must be deposited into trust (or applied to insurance) within 10 business days.',
  },
  {
    id: 'DEAD-LAW-012',
    states: ['NC'],
    topic: 'Preneed Contracts',
    bank: 'practice',
    q: "A purchaser's right to cancel a revocable preneed contract entitles them to:",
    choices: [
      'Nothing after 30 days',
      'Trust principal only',
      'Trust principal plus earned interest, less permitted fees',
      'Original payment minus 50%',
    ],
    answer: 2,
    exp: 'On revocation, the purchaser receives principal and accrued earnings less any statutorily permitted fees.',
  },
  {
    id: 'DEAD-LAW-013',
    states: ['NC'],
    topic: 'Preneed Contracts',
    bank: 'test',
    q: 'Who must hold a preneed sales license to sell preneed contracts in NC?',
    choices: [
      'Any establishment employee',
      'Only the establishment owner',
      'Individuals licensed as preneed sales licensees',
      'Attorneys only',
    ],
    answer: 2,
    exp: 'Preneed sales require an individual preneed sales license issued by the Board.',
  },
  {
    id: 'DEAD-LAW-020',
    states: ['NC'],
    topic: 'Disposition Authority',
    bank: 'practice',
    q: 'Under NC law, who holds first priority to authorize disposition when the decedent left no written directive?',
    choices: ['Adult children', 'Surviving spouse', 'Parents', 'Executor of the estate'],
    answer: 1,
    exp: 'Absent a directive or appointed agent, the surviving spouse holds first priority under G.S. 130A-420.',
  },
  {
    id: 'DEAD-LAW-021',
    states: ['NC'],
    topic: 'Disposition Authority',
    bank: 'practice',
    q: 'A cremation authorization in NC generally requires a waiting period of:',
    choices: ['No waiting period', '24 hours after death', '48 hours after death', '72 hours after death'],
    answer: 1,
    exp: 'Cremation may not occur until 24 hours after death unless a waiver applies.',
  },
  {
    id: 'DEAD-LAW-022',
    states: ['NC'],
    topic: 'Disposition Authority',
    bank: 'practice',
    q: 'If equal-priority next of kin disagree about disposition, the funeral establishment may:',
    choices: [
      'Choose the first request received',
      'Rely on a majority of the class or seek court direction',
      'Defer to the eldest member',
      'Proceed with burial by default',
    ],
    answer: 1,
    exp: 'Statute permits reliance on a majority of the priority class; unresolved disputes go to the clerk of court.',
  },
  {
    id: 'DEAD-LAW-030',
    states: ['NC'],
    topic: 'Recordkeeping & Reporting',
    bank: 'practice',
    q: 'A death certificate in NC must be filed with the local registrar within how many days of death?',
    choices: ['3 days', '5 days', '10 days', '15 days'],
    answer: 1,
    exp: 'The funeral director must file the certificate within 5 days and before final disposition.',
  },
  {
    id: 'DEAD-LAW-031',
    states: ['NC'],
    topic: 'Recordkeeping & Reporting',
    bank: 'practice',
    q: 'Preneed contract records must be retained by the establishment for at least:',
    choices: ['1 year after performance', '3 years after performance or cancellation', '5 years from signing', 'Permanently'],
    answer: 1,
    exp: 'Records must be kept for 3 years following performance, cancellation, or transfer.',
  },
  {
    id: 'DEAD-LAW-032',
    states: ['NC'],
    topic: 'Recordkeeping & Reporting',
    bank: 'test',
    q: 'Which record must be available for Board inspection at the funeral establishment?',
    choices: [
      'Employee tax filings',
      'Itemized statements of goods and services',
      'Family correspondence',
      'Vehicle maintenance logs',
    ],
    answer: 1,
    exp: 'Itemized statements and related transaction records must be open to Board inspection.',
  },
  {
    id: 'DEAD-LAW-040',
    states: ['NC'],
    topic: 'Board Rules & Discipline',
    bank: 'practice',
    q: 'Which of the following is grounds for license discipline by the NC Board of Funeral Service?',
    choices: ['Advertising prices', 'Solicitation of dead human bodies', 'Offering preneed contracts', 'Employing trainees'],
    answer: 1,
    exp: 'Solicitation of bodies (directly or through agents) is enumerated as grounds for discipline.',
  },
  {
    id: 'DEAD-LAW-041',
    states: ['NC'],
    topic: 'Board Rules & Discipline',
    bank: 'practice',
    q: 'Before revoking a license, the Board must generally provide the licensee:',
    choices: ['Nothing — revocation is summary', 'Notice and an opportunity for a hearing', 'A 5-year probation first', 'A jury trial'],
    answer: 1,
    exp: 'Due process under the Administrative Procedure Act requires notice and a hearing opportunity.',
  },
  {
    id: 'DEAD-LAW-042',
    states: ['NC'],
    topic: 'Board Rules & Discipline',
    bank: 'practice',
    q: 'The maximum civil penalty the Board may assess per violation is:',
    choices: ['$500', '$1,000', '$5,000', '$10,000'],
    answer: 2,
    exp: 'The Board may assess civil penalties up to $5,000 per violation.',
  },
];

const CORE_CARDS: readonly Flashcard[] = [
  {
    id: 'DEAD-FC-001',
    front: 'NC Board of Funeral Service',
    back: 'The licensing authority for funeral directors, embalmers, funeral service licensees, establishments, and preneed licensees in North Carolina.',
  },
  {
    id: 'DEAD-FC-002',
    front: 'Article 13F',
    back: 'The article of G.S. Chapter 90 governing preneed funeral contracts, preneed licensing, and preneed trust requirements.',
  },
  {
    id: 'DEAD-FC-003',
    front: 'G.S. 130A-420',
    back: "NC statute establishing the priority order of persons authorized to direct disposition of a decedent's body.",
  },
  {
    id: 'DEAD-FC-004',
    front: 'Death certificate filing window',
    back: '5 days from death — and always before final disposition — filed by the funeral director with the local registrar.',
  },
  {
    id: 'DEAD-FC-005',
    front: 'Civil penalty ceiling',
    back: '$5,000 per violation, assessable by the Board in addition to other disciplinary action.',
  },
  {
    id: 'DEAD-FC-006',
    front: 'Preneed deposit deadline',
    back: '10 business days from receipt — preneed funds must reach trust or be applied to a funded insurance policy.',
  },
];

export const FLASHCARD_SETS: readonly FlashcardSet[] = [
  {
    id: 'DEAD-SET-001',
    states: ['NC'],
    title: 'Core Statutes & Citations',
    topic: 'Mixed review',
    desc: 'The numbers and cites that anchor everything else.',
    cards: CORE_CARDS,
  },
  {
    id: 'DEAD-SET-002',
    states: ['NC'],
    title: 'Preneed Contracts',
    topic: 'Preneed Contracts',
    desc: 'Trusting, funding, cancelling, and reporting.',
    cards: [
      {
        id: 'DEAD-FC-010',
        front: 'Revocable vs. irrevocable',
        back: 'Revocable contracts can be cancelled by the purchaser for principal plus earnings, less permitted fees. Irrevocable contracts (commonly used for benefits eligibility) may only be transferred to another provider.',
      },
      {
        id: 'DEAD-FC-011',
        front: 'Insurance-funded preneed',
        back: 'A life insurance policy assigned to fund the contract may be used in lieu of a trust deposit.',
      },
      {
        id: 'DEAD-FC-012',
        front: 'Annual preneed report',
        back: 'Preneed establishments report contracts written, performed, and cancelled to the Board each year.',
      },
      {
        id: 'DEAD-FC-013',
        front: 'Merchandise substitution',
        back: 'If contracted merchandise is unavailable at need, the establishment must substitute merchandise of equal or greater quality at no additional cost.',
      },
      {
        id: 'DEAD-FC-014',
        front: 'Preneed sales license',
        back: "Required for any individual selling preneed contracts — separate from the establishment's own preneed permit.",
      },
    ],
  },
  {
    id: 'DEAD-SET-003',
    states: ['NC'],
    title: 'Disposition & Cremation',
    topic: 'Disposition Authority',
    desc: 'Who decides, in what order, and when cremation can proceed.',
    cards: [
      {
        id: 'DEAD-FC-020',
        front: 'Authorizing agent',
        back: 'The person with legal priority to direct disposition under G.S. 130A-420 — directive, appointed agent, spouse, then descending kinship classes.',
      },
      {
        id: 'DEAD-FC-021',
        front: 'Written directive',
        back: "A decedent's own signed disposition instructions control over the wishes of any next of kin.",
      },
      {
        id: 'DEAD-FC-022',
        front: '24-hour rule',
        back: 'Cremation may not occur until 24 hours after death, absent a statutory waiver.',
      },
      {
        id: 'DEAD-FC-023',
        front: 'Medical examiner release',
        back: 'When a death falls under medical examiner jurisdiction, cremation requires ME authorization before proceeding.',
      },
      {
        id: 'DEAD-FC-024',
        front: 'Class disagreement',
        back: 'If equal-priority kin disagree, the establishment may rely on a majority of the class; unresolved disputes go to the clerk of court.',
      },
    ],
  },
  {
    id: 'DEAD-SET-004',
    states: ['NC'],
    title: 'Licensing, CE & Discipline',
    topic: 'Licensing & Permits',
    desc: 'Credentials, traineeship, renewal, and how licenses are lost.',
    cards: [
      { id: 'DEAD-FC-030', front: 'FSL', back: 'Funeral Service Licensee — the combined credential covering both funeral directing and embalming.' },
      {
        id: 'DEAD-FC-031',
        front: 'Resident traineeship',
        back: 'A supervised, permitted traineeship with required case reports, completed under a licensed supervisor before examination.',
      },
      { id: 'DEAD-FC-032', front: 'CE requirement', back: '5 hours of Board-approved continuing education each year to renew.' },
      {
        id: 'DEAD-FC-033',
        front: 'Establishment manager',
        back: 'Every funeral establishment must designate a licensed manager who is answerable to the Board for its operation.',
      },
      {
        id: 'DEAD-FC-034',
        front: 'Civil penalty ceiling',
        back: '$5,000 per violation, in addition to any suspension, revocation, or probation.',
      },
    ],
  },
];

export const EXAMS: readonly ExamForm[] = [
  {
    id: 'DEAD-EX-A',
    states: ['NC'],
    title: 'Full Practice Exam — Form A',
    topic: null,
    n: 10,
    lastScore: 78,
    desc: '10 questions across all five topics under exam conditions. Draws from both banks.',
  },
  {
    id: 'DEAD-EX-B',
    states: ['NC'],
    title: 'Full Practice Exam — Form B',
    topic: null,
    n: 10,
    lastScore: null,
    desc: 'A second mixed form with a fresh draw. Take it cold to check retention.',
  },
  {
    id: 'DEAD-EX-PRE',
    states: ['NC'],
    title: 'Focus Exam — Preneed Contracts',
    topic: 'Preneed Contracts',
    n: 4,
    lastScore: null,
    desc: 'Every preneed question in the bank. The heaviest-weighted topic on the NC exam.',
  },
  {
    id: 'DEAD-EX-LIC',
    states: ['NC'],
    title: 'Focus Exam — Licensing & Permits',
    topic: 'Licensing & Permits',
    n: 4,
    lastScore: 50,
    desc: 'Credentials, permits, and unlicensed-practice questions only.',
  },
];

export const QUIZZES: readonly QuizSet[] = [
  { id: 'DEAD-QZ-MIX', states: ['NC'], title: 'Quick 5 — Mixed', topic: null, n: 5, desc: 'Five random practice-bank questions, instant feedback.' },
  { id: 'DEAD-QZ-PRE', states: ['NC'], title: 'Preneed Contracts', topic: 'Preneed Contracts', n: 5, desc: 'Trusts, deposits, cancellation, and sales licensing.' },
  { id: 'DEAD-QZ-DIS', states: ['NC'], title: 'Disposition Authority', topic: 'Disposition Authority', n: 5, desc: 'Priority order, directives, and cremation timing.' },
  { id: 'DEAD-QZ-LIC', states: ['NC'], title: 'Licensing & Permits', topic: 'Licensing & Permits', n: 5, desc: 'Who needs which credential, and for how long.' },
  { id: 'DEAD-QZ-REC', states: ['NC'], title: 'Recordkeeping & Reporting', topic: 'Recordkeeping & Reporting', n: 5, desc: 'Filing windows, retention, and Board inspection.' },
  { id: 'DEAD-QZ-BRD', states: ['NC'], title: 'Board Rules & Discipline', topic: 'Board Rules & Discipline', n: 5, desc: 'Grounds for discipline, due process, and penalties.' },
];

const NUMBER_PAIRS: readonly MatchPair[] = [
  { id: 'm1', term: 'Article 13F', def: 'Preneed contracts' },
  { id: 'm2', term: 'G.S. 130A-420', def: 'Disposition priority' },
  { id: 'm3', term: '5 days', def: 'Death certificate filing' },
  { id: 'm4', term: '24 hours', def: 'Cremation waiting period' },
  { id: 'm5', term: '$5,000', def: 'Max civil penalty' },
  { id: 'm6', term: '5 hours', def: 'Annual CE requirement' },
];

export const MATCH_SETS: readonly MatchSet[] = [
  {
    id: 'DEAD-MG-001',
    states: ['NC'],
    title: 'Numbers & Deadlines',
    desc: 'Hours, days, and dollar amounts you have to know cold.',
    pairs: NUMBER_PAIRS,
  },
  {
    id: 'DEAD-MG-002',
    states: ['NC'],
    title: 'Statutes & What They Govern',
    desc: 'Match each citation to its subject.',
    pairs: [
      { id: 's1', term: 'Article 13A', def: 'Practice of funeral service' },
      { id: 's2', term: 'Article 13F', def: 'Preneed contracts' },
      { id: 's3', term: 'G.S. 130A-420', def: 'Disposition priority' },
      { id: 's4', term: 'G.S. 130A-115', def: 'Death registration' },
      { id: 's5', term: 'Chapter 90', def: 'Medicine & allied occupations' },
      { id: 's6', term: '21 NCAC 34', def: 'Board administrative rules' },
    ],
  },
  {
    id: 'DEAD-MG-003',
    states: ['NC'],
    title: 'Vocabulary',
    desc: 'Core terms of art from the statutes.',
    pairs: [
      { id: 'v1', term: 'FSL', def: 'Directing + embalming license' },
      { id: 'v2', term: 'Authorizing agent', def: 'Holds disposition priority' },
      { id: 'v3', term: 'At-need', def: 'Arranged after death' },
      { id: 'v4', term: 'Preneed', def: 'Funded before death' },
      { id: 'v5', term: 'Resident trainee', def: 'Supervised pre-licensure permit' },
      { id: 'v6', term: 'ME release', def: 'Required before some cremations' },
    ],
  },
];

export const VIDEO_LESSONS: readonly VideoLesson[] = [
  {
    id: 'DEAD-VID-001',
    states: ['NC'],
    topic: 'Preneed Contracts',
    bank: 'practice',
    title: 'Preneed Contracts in North Carolina',
    segments: [
      {
        title: "What makes a contract 'preneed'",
        duration: 18,
        questions: [
          {
            q: "A contract is 'preneed' when funeral goods or services are:",
            choices: ['Paid at the time of death', 'Arranged and funded before death', 'Provided at no charge', 'Sold only by insurers'],
            answer: 1,
            exp: 'Preneed means arranged and paid for in advance of need.',
          },
        ],
      },
      {
        title: 'Licensing: who can sell',
        duration: 16,
        questions: [
          {
            q: 'Selling preneed contracts in NC requires:',
            choices: ['No special license', 'A preneed sales license', 'A real estate license', 'Board membership'],
            answer: 1,
            exp: 'Individual sellers must hold a preneed sales license from the Board.',
          },
          {
            q: 'The establishment itself must hold:',
            choices: ['A preneed establishment permit', 'A notary commission', 'A bank charter', 'Nothing additional'],
            answer: 0,
            exp: 'Establishments need their own preneed permit in addition to individual sales licenses.',
          },
        ],
      },
      {
        title: 'Trusting the funds',
        duration: 20,
        questions: [
          {
            q: 'Preneed funds must be deposited within:',
            choices: ['24 hours', '10 business days', '30 days', '90 days'],
            answer: 1,
            exp: '10 business days from receipt, into trust or applied to insurance.',
          },
        ],
      },
      {
        title: 'Cancellation & purchaser rights',
        duration: 15,
        questions: [
          {
            q: 'On revoking a revocable contract, the purchaser recovers:',
            choices: ['Nothing', 'Principal plus earnings, less permitted fees', '50% of payments', 'Merchandise only'],
            answer: 1,
            exp: 'Principal and accrued earnings, minus statutorily permitted fees.',
          },
        ],
      },
    ],
  },
  {
    id: 'DEAD-VID-002',
    states: ['NC'],
    topic: 'Disposition Authority',
    bank: 'practice',
    title: 'Disposition Authority Basics',
    segments: [
      {
        title: 'The priority list',
        duration: 15,
        questions: [
          {
            q: 'With no directive or appointed agent, first priority goes to:',
            choices: ['Adult children', 'The surviving spouse', 'The executor', 'Parents'],
            answer: 1,
            exp: 'The surviving spouse holds first priority under G.S. 130A-420.',
          },
        ],
      },
      {
        title: 'Written directives & appointed agents',
        duration: 14,
        questions: [
          {
            q: "A decedent's signed written directive:",
            choices: ['Is advisory only', 'Controls over next-of-kin wishes', 'Requires spousal consent', 'Expires at death'],
            answer: 1,
            exp: "The decedent's own directive outranks every kinship class.",
          },
        ],
      },
      {
        title: 'Cremation timing',
        duration: 16,
        questions: [
          {
            q: 'Absent a waiver, cremation may not occur until:',
            choices: ['Immediately after death', '24 hours after death', '72 hours after death', 'The death certificate is amended'],
            answer: 1,
            exp: 'The 24-hour waiting period applies unless statutorily waived.',
          },
        ],
      },
    ],
  },
  {
    id: 'DEAD-VID-003',
    states: ['NC'],
    topic: 'Recordkeeping & Reporting',
    bank: 'practice',
    title: 'Recordkeeping Essentials',
    segments: [
      {
        title: 'Filing the death certificate',
        duration: 14,
        questions: [
          {
            q: 'The death certificate must be filed within:',
            choices: ['3 days', '5 days', '10 days', '30 days'],
            answer: 1,
            exp: '5 days from death, and always before final disposition.',
          },
        ],
      },
      {
        title: 'What the Board can inspect',
        duration: 15,
        questions: [
          {
            q: 'Which must be open to Board inspection at the establishment?',
            choices: ['Employee tax filings', 'Itemized statements of goods and services', 'Personal correspondence', 'Vehicle titles'],
            answer: 1,
            exp: 'Transaction records, including itemized statements, are inspectable.',
          },
        ],
      },
      {
        title: 'Retention windows',
        duration: 13,
        questions: [
          {
            q: 'Preneed contract records must be kept for:',
            choices: ['1 year', '3 years after performance or cancellation', '7 years', 'Permanently'],
            answer: 1,
            exp: '3 years following performance, cancellation, or transfer.',
          },
        ],
      },
    ],
  },
  {
    id: 'DEAD-VID-004',
    states: ['NC'],
    topic: 'Board Rules & Discipline',
    bank: 'practice',
    title: 'Licensing & the Board: Complaint to Hearing',
    comingSoon: true,
    est: '≈6 min · 4 segments',
  },
];

export const SESSIONS: readonly StudySession[] = [
  { date: 'Jun 8', mode: 'quiz', results: { 'DEAD-LAW-001': 0, 'DEAD-LAW-010': 0, 'DEAD-LAW-020': 1, 'DEAD-LAW-030': 1, 'DEAD-LAW-040': 0 } },
  {
    date: 'Jun 12',
    mode: 'exam',
    score: 58,
    results: {
      'DEAD-LAW-001': 1,
      'DEAD-LAW-002': 0,
      'DEAD-LAW-010': 0,
      'DEAD-LAW-011': 1,
      'DEAD-LAW-020': 1,
      'DEAD-LAW-021': 0,
      'DEAD-LAW-030': 1,
      'DEAD-LAW-031': 0,
      'DEAD-LAW-040': 1,
      'DEAD-LAW-041': 0,
    },
  },
  { date: 'Jun 16', mode: 'quiz', results: { 'DEAD-LAW-002': 1, 'DEAD-LAW-011': 1, 'DEAD-LAW-012': 0, 'DEAD-LAW-021': 1, 'DEAD-LAW-031': 1 } },
  {
    date: 'Jun 20',
    mode: 'exam',
    score: 67,
    results: {
      'DEAD-LAW-001': 1,
      'DEAD-LAW-003': 1,
      'DEAD-LAW-010': 1,
      'DEAD-LAW-012': 0,
      'DEAD-LAW-020': 1,
      'DEAD-LAW-022': 0,
      'DEAD-LAW-030': 1,
      'DEAD-LAW-032': 1,
      'DEAD-LAW-041': 1,
      'DEAD-LAW-042': 0,
    },
  },
  { date: 'Jun 24', mode: 'quiz', results: { 'DEAD-LAW-003': 1, 'DEAD-LAW-012': 1, 'DEAD-LAW-013': 1, 'DEAD-LAW-022': 1, 'DEAD-LAW-042': 0 } },
  {
    date: 'Jun 29',
    mode: 'exam',
    score: 78,
    results: {
      'DEAD-LAW-002': 1,
      'DEAD-LAW-010': 1,
      'DEAD-LAW-011': 1,
      'DEAD-LAW-020': 1,
      'DEAD-LAW-021': 1,
      'DEAD-LAW-030': 1,
      'DEAD-LAW-031': 1,
      'DEAD-LAW-040': 0,
      'DEAD-LAW-041': 1,
      'DEAD-LAW-042': 0,
    },
  },
];
