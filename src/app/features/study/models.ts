export type QuestionBank = 'practice' | 'test';
export type SessionMode = 'quiz' | 'exam';

export interface StateOption {
  code: string;
  name: string;
  ready: boolean;
}

export interface Question {
  id: string;
  states: readonly string[];
  topic: string;
  bank: QuestionBank;
  q: string;
  choices: readonly string[];
  answer: number;
  exp: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardSet {
  id: string;
  states: readonly string[];
  title: string;
  topic: string;
  desc: string;
  cards: readonly Flashcard[];
}

export interface ExamForm {
  id: string;
  states: readonly string[];
  title: string;
  topic: string | null;
  n: number;
  lastScore: number | null;
  desc: string;
}

export interface QuizSet {
  id: string;
  states: readonly string[];
  title: string;
  topic: string | null;
  n: number;
  desc: string;
}

export interface MatchPair {
  id: string;
  term: string;
  def: string;
}

export interface MatchSet {
  id: string;
  states: readonly string[];
  title: string;
  desc: string;
  pairs: readonly MatchPair[];
}

export interface CheckpointQuestion {
  q: string;
  choices: readonly string[];
  answer: number;
  exp: string;
}

export interface VideoSegment {
  title: string;
  duration: number;
  questions: readonly CheckpointQuestion[];
}

export interface VideoLesson {
  id: string;
  states: readonly string[];
  topic: string;
  bank: QuestionBank;
  title: string;
  segments?: readonly VideoSegment[];
  comingSoon?: boolean;
  est?: string;
}

export interface StudySession {
  date: string;
  mode: SessionMode;
  score?: number;
  results: Readonly<Record<string, 0 | 1>>;
}

export interface TrendPoint {
  date: string;
  acc: number;
  n: number;
  mode: SessionMode;
}

export interface ExamTrendPoint {
  date: string;
  score: number;
}

export interface TopicStat {
  topic: string;
  acc: number;
  n: number;
}

export interface StudyStats {
  accuracy: number;
  coverage: number;
  missed: Question[];
  topics: TopicStat[];
  trend: TrendPoint[];
  examTrend: ExamTrendPoint[];
  readiness: number;
  volume: number;
  bestExam: number | null;
  delta: number;
  modeSplit: { exam: number; quiz: number };
  sessionCount: number;
}

export interface ScoredItem {
  states?: readonly string[];
}

export function inState(item: ScoredItem, stateCode: string): boolean {
  return !item.states || item.states.includes(stateCode);
}
