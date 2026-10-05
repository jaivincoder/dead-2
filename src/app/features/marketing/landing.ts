import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Theme } from '@app/core/theme/theme';
import { Icon, type IconName } from '@app/shared/ui/icon/icon';

interface Plan {
  name: string;
  price: string;
  cadence: string;
  cta: string;
  blurb: string;
  features: readonly string[];
  featured?: boolean;
}

interface Faq {
  q: string;
  a: string;
}

interface Pillar {
  icon: IconName;
  title: string;
  body: string;
}

interface Tool {
  icon: IconName;
  label: string;
  body: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Icon],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-base text-ink' },
})
export class Landing {
  readonly theme = inject(Theme);
  readonly openFaq = signal(0);
  readonly links = [
    ['features', 'Features'],
    ['how', 'How it works'],
    ['pricing', 'Pricing'],
    ['faq', 'FAQ'],
  ] as const;
  readonly pillars: readonly Pillar[] = [
    {
      icon: 'play-circle',
      title: 'Video that stops and asks',
      body: 'Lessons are cut into short segments. At every boundary the player pauses for a checkpoint question and won\'t resume until you answer.',
    },
    {
      icon: 'bar-chart',
      title: 'Readiness, not vibes',
      body: 'A single score built from accuracy, bank coverage, and your last exam — plus weakest-topic breakdowns so you know what to open next.',
    },
    {
      icon: 'graduation-cap',
      title: 'One state, done properly',
      body: 'Every question is tagged to the state you select. No sifting through another state\'s statutes to find the rule that applies to you.',
    },
  ];
  readonly tools: readonly Tool[] = [
    { icon: 'layers', label: 'Flashcards', body: 'Statute and vocabulary sets you can shuffle and drill in a few minutes.' },
    { icon: 'clipboard-list', label: 'Practice exams', body: 'Full forms and topic-focus exams under exam conditions — flagging, no feedback until you submit.' },
    { icon: 'zap', label: 'Quizzes', body: 'Five-question rounds with an explanation after every answer.' },
    { icon: 'layout-grid', label: 'Matching', body: 'Pair citations with what they govern until the numbers stick.' },
    { icon: 'rotate-ccw', label: 'Missed-question review', body: 'Everything you got wrong last time, in one list, with the reasoning.' },
    { icon: 'timer', label: 'Session history', body: 'Every sitting logged with date, mode, volume, and accuracy.' },
  ];
  readonly steps = [
    ['Pick your state', 'Choose the state you\'re sitting for. Every question, lesson, and statistic is scoped to it from that moment on.'],
    ['Work the library', 'Watch segmented lessons, drill flashcards, and sit full practice exams. Checkpoints catch the gaps as you go.'],
    ['Watch readiness climb', 'One score, updated every session, with the weakest topic named so you always know what to open next.'],
  ] as const;
  readonly plans: readonly Plan[] = [
    {
      name: 'Free',
      price: '$0',
      cadence: 'forever',
      cta: 'Start free',
      blurb: 'Enough to see whether this works for you.',
      features: ['1 video lesson', '1 flashcard set', '1 practice exam', 'Basic accuracy tracking'],
    },
    {
      name: 'Exam Pass',
      price: '$99',
      cadence: 'one-time · 6 months access',
      featured: true,
      cta: 'Get the Exam Pass',
      blurb: 'Built for the stretch between application and test day.',
      features: [
        'Every video lesson + checkpoints',
        'All flashcard, quiz, and matching sets',
        'Unlimited practice exams',
        'Full readiness analytics',
        'Missed-question review',
      ],
    },
    {
      name: 'Monthly',
      price: '$19',
      cadence: 'per month',
      cta: 'Go monthly',
      blurb: 'Same library, cancel whenever you sit the exam.',
      features: ['Everything in Exam Pass', 'Month-to-month billing', 'Pause anytime'],
    },
  ];
  readonly faqs: readonly Faq[] = [
    {
      q: 'Is this the national board exam or the state law exam?',
      a: 'The state law portion. Anubis Legal covers the statutes, rules, and Board procedures specific to the state you select — the part that changes when you cross a border, and the part national study guides skip.',
    },
    {
      q: 'Which states are available?',
      a: 'North Carolina is live today. You pick one state during signup and everything — questions, lessons, and your stats — is scoped to it. More states are in production; you can switch your state at any time from your account.',
    },
    {
      q: 'What makes the video lessons different?',
      a: 'They stop. Each lesson is cut into short segments, and at every boundary the player pauses and asks you a checkpoint question before it will resume. You cannot passively watch your way through a lesson, which is exactly the failure mode of most video courses.',
    },
    {
      q: 'How is my readiness score calculated?',
      a: "It weights your overall accuracy, how much of the question bank you've actually seen, and your most recent practice exam score. It only counts practice-bank questions, so the questions reserved for graded practice exams never inflate it.",
    },
  ];
  readonly heroChoices = ['24 hours', '10 business days', '30 days', '90 days'] as const;
  readonly heroSegments = [
    { flex: 18, width: '100%', done: true },
    { flex: 16, width: '100%', done: true },
    { flex: 20, width: '62%', done: false },
    { flex: 15, width: '0%', done: false },
  ] as const;

  scrollTo(id: string): void {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  toggleFaq(index: number): void {
    this.openFaq.set(this.openFaq() === index ? -1 : index);
  }
}
