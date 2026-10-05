import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';

@Component({
  selector: 'app-matching',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-5 flex items-center gap-3">
        <h1 class="text-lg font-bold">Matching Game</h1>
        <span class="tag">{{ catalog.stateCode() }}</span>
      </div>
      <p class="-mt-2 mb-4 text-sm text-dim">Pair each term with its definition. Fewest moves wins.</p>
      <div class="grid gap-3 sm:grid-cols-2">
        @for (set of catalog.matchSets(); track set.id) {
          <a class="library-card" [routerLink]="['/app/matching', set.id]">
            <div class="mb-2 flex items-start justify-between">
              <span class="icon-tile"><ui-icon name="layout-grid" [size]="16" /></span>
              <span class="font-mono text-[10px] text-accent">{{ set.pairs.length }} pairs</span>
            </div>
            <div class="mb-0.5 font-bold">{{ set.title }}</div>
            <div class="text-xs text-dim">{{ set.desc }}</div>
          </a>
        }
      </div>
    </div>
  `,
})
export class Matching {
  readonly catalog = inject(Catalog);
}
