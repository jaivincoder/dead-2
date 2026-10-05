import { Routes } from '@angular/router';
import { studyGuard } from './features/study/study.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/marketing/landing').then((module) => module.Landing),
  },
  {
    path: 'login',
    title: 'Log in',
    data: { mode: 'login' },
    loadComponent: () => import('./features/auth/auth-page').then((module) => module.AuthPage),
  },
  {
    path: 'signup',
    title: 'Sign up',
    data: { mode: 'signup' },
    loadComponent: () => import('./features/auth/auth-page').then((module) => module.AuthPage),
  },
  {
    path: 'app',
    canActivate: [studyGuard],
    loadComponent: () => import('./features/study/shell/study-shell').then((module) => module.StudyShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Performance',
        loadComponent: () => import('./features/study/dashboard/dashboard').then((module) => module.Dashboard),
      },
      {
        path: 'video',
        title: 'Video Lessons',
        loadComponent: () => import('./features/study/video/video-lessons').then((module) => module.VideoLessons),
      },
      {
        path: 'video/:id',
        title: 'Video Lesson',
        loadComponent: () => import('./features/study/video/video-player').then((module) => module.VideoPlayer),
      },
      {
        path: 'flashcards',
        title: 'Flashcards',
        loadComponent: () => import('./features/study/flashcards/flashcards').then((module) => module.Flashcards),
      },
      {
        path: 'flashcards/:id',
        title: 'Flashcards',
        loadComponent: () => import('./features/study/flashcards/flash-deck').then((module) => module.FlashDeck),
      },
      {
        path: 'exams',
        title: 'Practice Exams',
        loadComponent: () => import('./features/study/exams/exams').then((module) => module.Exams),
      },
      {
        path: 'exams/:id',
        title: 'Practice Exam',
        loadComponent: () => import('./features/study/exams/exam-run').then((module) => module.ExamRun),
      },
      {
        path: 'quizzes',
        title: 'Quizzes',
        loadComponent: () => import('./features/study/quizzes/quizzes').then((module) => module.Quizzes),
      },
      {
        path: 'quizzes/:id',
        title: 'Quiz',
        loadComponent: () => import('./features/study/quizzes/quiz-run').then((module) => module.QuizRun),
      },
      {
        path: 'matching',
        title: 'Matching',
        loadComponent: () => import('./features/study/matching/matching').then((module) => module.Matching),
      },
      {
        path: 'matching/:id',
        title: 'Matching',
        loadComponent: () => import('./features/study/matching/match-game').then((module) => module.MatchGame),
      },
      {
        path: 'review',
        title: 'Missed Questions',
        loadComponent: () => import('./features/study/review/review').then((module) => module.Review),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
