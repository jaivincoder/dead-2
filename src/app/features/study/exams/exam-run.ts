import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import type { Question } from '../models';
import { paramId } from '../param';
import { formatClock, markedChoice, passTone, shuffle } from '../util';

@Component({
  selector: 'app-exam-run',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './exam-run.html',
})
export class ExamRun {
  private readonly catalog = inject(Catalog);
  readonly id = paramId();
  readonly exam = signal(this.catalog.exam(this.id()));
  readonly questions = signal<readonly Question[]>([]);
  readonly phase = signal<'active' | 'results'>('active');
  readonly index = signal(0);
  readonly answers = signal<Readonly<Record<string, number>>>({});
  readonly flags = signal<ReadonlySet<string>>(new Set());
  readonly seconds = signal(0);
  readonly marked = markedChoice;
  readonly pass = passTone;
  readonly clock = formatClock;
  readonly question = computed(() => this.questions()[this.index()]);
  readonly answered = computed(() => Object.keys(this.answers()).length);
  readonly correct = computed(() =>
    this.questions().filter((question) => this.answers()[question.id] === question.answer),
  );
  readonly missed = computed(() =>
    this.questions().filter((question) => this.answers()[question.id] !== question.answer),
  );
  readonly percent = computed(() => {
    const total = this.questions().length;
    return total ? Math.round((this.correct().length / total) * 100) : 0;
  });

  constructor() {
    const timer = setInterval(() => {
      if (this.phase() === 'active' && this.questions().length) {
        this.seconds.update((value) => value + 1);
      }
    }, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));

    effect(() => {
      const exam = this.catalog.exam(this.id());
      this.exam.set(exam);
      this.questions.set(exam ? shuffle(this.catalog.examPool(exam.topic)).slice(0, exam.n) : []);
      this.phase.set('active');
      this.index.set(0);
      this.answers.set({});
      this.flags.set(new Set());
      this.seconds.set(0);
    });
  }

  choose(id: string, choice: number): void {
    this.answers.update((current) => ({ ...current, [id]: choice }));
  }

  toggleFlag(id: string): void {
    this.flags.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  jump(index: number): void {
    this.index.set(index);
  }

  step(delta: number): void {
    const next = this.index() + delta;
    if (next < 0 || next >= this.questions().length) {
      return;
    }
    this.index.set(next);
  }

  submit(): void {
    this.phase.set('results');
  }
}
