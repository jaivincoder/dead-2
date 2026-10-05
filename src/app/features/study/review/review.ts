import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';

@Component({
  selector: 'app-review',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-xl">
      <div class="mb-5 flex items-center gap-3">
        <h1 class="text-lg font-bold">Missed Questions</h1>
        <span class="tag">{{ catalog.stateCode() }}</span>
      </div>
      @if (catalog.stats().missed.length === 0) {
        <article class="panel py-10 text-center">
          <div class="mb-1 font-bold text-success">Nothing to review</div>
          <p class="text-sm text-dim">Every practice question you have seen, you got right on the last try.</p>
        </article>
      } @else {
        <p class="mb-4 flex items-start gap-2 text-sm text-dim">
          <ui-icon name="alert" [size]="15" class="mt-0.5 shrink-0 text-warn" />
          These {{ catalog.stats().missed.length }} practice-bank questions were wrong on your most recent attempt.
          Read the explanation, then run a quiz to clear them.
        </p>
        <div class="mb-4 space-y-3">
          @for (item of catalog.stats().missed; track item.id) {
            <article class="panel">
              <div class="mb-2 flex items-start justify-between">
                <span class="font-mono text-[10px] text-dim">{{ item.id }}</span>
                <span class="tag">{{ item.topic }}</span>
              </div>
              <p class="mb-2 text-sm font-semibold">{{ item.q }}</p>
              <p class="mb-2 flex items-start gap-1 text-xs text-success">
                <ui-icon name="check" [size]="11" class="mt-0.5 shrink-0" />
                {{ item.choices[item.answer] }}
              </p>
              <p class="text-xs text-dim">{{ item.exp }}</p>
            </article>
          }
        </div>
        <a routerLink="/app/quizzes" class="btn-primary flex w-full items-center justify-center gap-2 py-2.5">
          <ui-icon name="zap" [size]="15" /> Drill these with a quiz
        </a>
      }
    </div>
  `,
})
export class Review {
  readonly catalog = inject(Catalog);
}
