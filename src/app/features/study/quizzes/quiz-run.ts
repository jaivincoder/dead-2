import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import type { Question } from '../models';
import { paramId } from '../param';
import { feedbackChoice, shuffle } from '../util';

@Component({
  selector: 'app-quiz-run',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quiz-run.html',
})
export class QuizRun {
  private readonly catalog = inject(Catalog);
  readonly id = paramId();
  readonly quiz = signal(this.catalog.quiz(this.id()));
  readonly questions = signal<readonly Question[]>([]);
  readonly index = signal(0);
  readonly picked = signal<number | null>(null);
  readonly score = signal(0);
  readonly done = signal(false);
  readonly look = feedbackChoice;
  readonly question = computed(() => this.questions()[this.index()]);
  readonly progress = computed(() => {
    const total = this.questions().length;
    if (!total) {
      return 0;
    }
    return ((this.index() + (this.picked() !== null ? 1 : 0)) / total) * 100;
  });

  constructor() {
    effect(() => {
      const quiz = this.catalog.quiz(this.id());
      this.quiz.set(quiz);
      this.questions.set(quiz ? shuffle(this.catalog.practicePool(quiz.topic)).slice(0, quiz.n) : []);
      this.index.set(0);
      this.picked.set(null);
      this.score.set(0);
      this.done.set(false);
    });
  }

  pick(choice: number): void {
    if (this.picked() !== null) {
      return;
    }
    this.picked.set(choice);
    const question = this.question();
    if (question && choice === question.answer) {
      this.score.update((value) => value + 1);
    }
  }

  next(): void {
    if (this.index() + 1 >= this.questions().length) {
      this.done.set(true);
      return;
    }
    this.index.update((value) => value + 1);
    this.picked.set(null);
  }
}
