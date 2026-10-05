import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';

@Component({
  selector: 'app-quizzes',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-5 flex items-center gap-3">
        <h1 class="text-lg font-bold">Quizzes</h1>
        <span class="tag">{{ catalog.stateCode() }}</span>
      </div>
      <p class="-mt-2 mb-4 text-sm text-dim">
        Short rounds with instant feedback. Topic quizzes pull every question we have on that subject.
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        @for (quiz of catalog.quizzes(); track quiz.id) {
          <a class="library-card" [routerLink]="['/app/quizzes', quiz.id]">
            <div class="mb-2 flex items-start justify-between">
              <span class="icon-tile"><ui-icon name="zap" [size]="16" /></span>
              <span class="font-mono text-[10px] text-accent">{{ catalog.questionCount(quiz, 'practice') }} questions</span>
            </div>
            <div class="mb-0.5 font-bold">{{ quiz.title }}</div>
            <div class="text-xs text-dim">{{ quiz.desc }}</div>
          </a>
        }
      </div>
    </div>
  `,
})
export class Quizzes {
  readonly catalog = inject(Catalog);
}
