import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';

@Component({
  selector: 'app-exams',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-5 flex items-center gap-3">
        <h1 class="text-lg font-bold">Practice Exams</h1>
        <span class="tag">{{ catalog.stateCode() }}</span>
      </div>
      <p class="-mt-2 mb-4 text-sm text-dim">
        Exam conditions: no feedback until you submit, flag anything to revisit, timer counts up. Full forms draw from both banks.
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        @for (exam of catalog.exams(); track exam.id) {
          <a class="library-card" [routerLink]="['/app/exams', exam.id]">
            <div class="mb-2 flex items-start justify-between">
              <span class="icon-tile"><ui-icon name="clipboard-list" [size]="16" /></span>
              <span class="font-mono text-[10px] text-accent">{{ catalog.questionCount(exam, 'exam') }} questions</span>
            </div>
            <div class="mb-0.5 font-bold">{{ exam.title }}</div>
            <div class="mb-2 text-xs text-dim">{{ exam.desc }}</div>
            <div class="flex items-center justify-between">
              @if (exam.lastScore !== null) {
                <span class="font-mono text-[10px]" [style.color]="exam.lastScore >= 75 ? 'var(--c-success)' : 'var(--c-warn)'">
                  LAST: {{ exam.lastScore }}%
                </span>
              } @else {
                <span class="font-mono text-[10px] text-dim">NOT ATTEMPTED</span>
              }
              <span class="flex items-center gap-1 text-xs font-semibold text-accent">
                Start <ui-icon name="arrow-right" [size]="12" />
              </span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class Exams {
  readonly catalog = inject(Catalog);
}
