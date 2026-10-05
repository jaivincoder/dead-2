import { computed, inject, Injectable } from '@angular/core';
import type {
  ExamForm,
  FlashcardSet,
  MatchSet,
  Question,
  QuizSet,
  VideoLesson,
  VideoSegment,
} from './models';
import { inState } from './models';
import {
  EXAMS,
  FLASHCARD_SETS,
  MATCH_SETS,
  QUESTIONS,
  QUIZZES,
  SESSIONS,
  STATES,
  TOPICS,
  VIDEO_LESSONS,
} from './catalog.mock';
import { computeStats } from './stats';
import { StudyAccountStore } from './study-account';

export interface PlayableLesson extends VideoLesson {
  segments: readonly VideoSegment[];
}

/**
 * Study content for the signed-in state.
 *
 * BACKEND: keep these signatures and replace the mock reads with ApiClient.
 * Components should depend on this service only.
 */
@Injectable({ providedIn: 'root' })
export class Catalog {
  private readonly account = inject(StudyAccountStore);

  readonly states = STATES;
  readonly stateCode = computed(() => this.account.current()?.stateCode ?? 'NC');
  readonly stateName = computed(
    () => STATES.find((state) => state.code === this.stateCode())?.name ?? this.stateCode(),
  );
  readonly stats = computed(() => computeStats(QUESTIONS, SESSIONS, TOPICS, this.stateCode()));
  readonly flashcardSets = computed(() =>
    FLASHCARD_SETS.filter((set) => inState(set, this.stateCode())),
  );
  readonly exams = computed(() => EXAMS.filter((exam) => inState(exam, this.stateCode())));
  readonly quizzes = computed(() => QUIZZES.filter((quiz) => inState(quiz, this.stateCode())));
  readonly matchSets = computed(() => MATCH_SETS.filter((set) => inState(set, this.stateCode())));
  readonly videos = computed(() => VIDEO_LESSONS.filter((lesson) => inState(lesson, this.stateCode())));

  practicePool(topic: string | null): Question[] {
    const state = this.stateCode();
    return QUESTIONS.filter(
      (question) =>
        question.states.includes(state) &&
        question.bank === 'practice' &&
        (!topic || question.topic === topic),
    );
  }

  examPool(topic: string | null): Question[] {
    const state = this.stateCode();
    return QUESTIONS.filter(
      (question) => question.states.includes(state) && (!topic || question.topic === topic),
    );
  }

  questionCount(item: { topic: string | null; n: number }, bank: 'practice' | 'exam'): number {
    const pool = bank === 'practice' ? this.practicePool(item.topic) : this.examPool(item.topic);
    return Math.min(item.n, pool.length);
  }

  flashcardSet(id: string): FlashcardSet | undefined {
    return this.flashcardSets().find((set) => set.id === id);
  }

  exam(id: string): ExamForm | undefined {
    return this.exams().find((item) => item.id === id);
  }

  quiz(id: string): QuizSet | undefined {
    return this.quizzes().find((item) => item.id === id);
  }

  matchSet(id: string): MatchSet | undefined {
    return this.matchSets().find((item) => item.id === id);
  }

  video(id: string): VideoLesson | undefined {
    return this.videos().find((item) => item.id === id);
  }

  playableVideo(id: string): PlayableLesson | undefined {
    const lesson = this.video(id);
    if (!lesson?.segments?.length || lesson.comingSoon) {
      return undefined;
    }
    return lesson as PlayableLesson;
  }
}
