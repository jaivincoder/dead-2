import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';

@Component({
  selector: 'app-flashcards',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-5 flex items-center gap-3">
        <h1 class="text-lg font-bold">Flashcards</h1>
        <span class="tag">{{ catalog.stateCode() }}</span>
      </div>
      <p class="-mt-2 mb-4 text-sm text-dim">
        Pick a set. Tap a card to flip it, and shuffle before a second pass.
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        @for (set of catalog.flashcardSets(); track set.id) {
          <a class="library-card" [routerLink]="['/app/flashcards', set.id]">
            <div class="mb-2 flex items-start justify-between">
              <span class="icon-tile"><ui-icon name="layers" [size]="16" /></span>
              <span class="font-mono text-[10px] text-accent">{{ set.cards.length }} cards</span>
            </div>
            <div class="mb-0.5 font-bold">{{ set.title }}</div>
            <div class="mb-2 text-xs text-dim">{{ set.desc }}</div>
            <span class="tag">{{ set.topic }}</span>
          </a>
        }
      </div>
    </div>
  `,
})
export class Flashcards {
  readonly catalog = inject(Catalog);
}
