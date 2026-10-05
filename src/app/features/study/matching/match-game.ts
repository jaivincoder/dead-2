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
import { paramId } from '../param';
import { shuffle } from '../util';

interface Tile {
  key: string;
  pair: string;
  label: string;
  kind: 'term' | 'def';
}

@Component({
  selector: 'app-match-game',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './match-game.html',
})
export class MatchGame {
  private readonly catalog = inject(Catalog);
  private wrongTimer: ReturnType<typeof setTimeout> | undefined;
  readonly id = paramId();
  readonly set = signal(this.catalog.matchSet(this.id()));
  readonly tiles = signal<readonly Tile[]>([]);
  readonly selected = signal<Tile | null>(null);
  readonly matched = signal<ReadonlySet<string>>(new Set());
  readonly wrong = signal<readonly string[] | null>(null);
  readonly moves = signal(0);
  readonly done = computed(() => {
    const set = this.set();
    return !!set && set.pairs.length > 0 && this.matched().size === set.pairs.length;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.wrongTimer) {
        clearTimeout(this.wrongTimer);
      }
    });
    effect(() => {
      const set = this.catalog.matchSet(this.id());
      this.set.set(set);
      this.tiles.set(
        set
          ? shuffle(
              set.pairs.flatMap((pair) => [
                { key: `${pair.id}-t`, pair: pair.id, label: pair.term, kind: 'term' as const },
                { key: `${pair.id}-d`, pair: pair.id, label: pair.def, kind: 'def' as const },
              ]),
            )
          : [],
      );
      this.selected.set(null);
      this.matched.set(new Set());
      this.wrong.set(null);
      this.moves.set(0);
    });
  }

  tileBackground(tile: Tile): string {
    if (this.matched().has(tile.pair)) {
      return 'color-mix(in srgb, var(--c-success) 12%, transparent)';
    }
    if (this.wrong()?.includes(tile.key)) {
      return 'color-mix(in srgb, var(--c-danger) 20%, transparent)';
    }
    if (this.selected()?.key === tile.key) {
      return 'var(--c-primary)';
    }
    return 'var(--c-surface)';
  }

  tileColor(tile: Tile): string {
    if (this.matched().has(tile.pair)) {
      return 'var(--c-success)';
    }
    if (this.selected()?.key === tile.key) {
      return 'var(--c-on-primary)';
    }
    return 'var(--c-text)';
  }

  tileBorder(tile: Tile): string {
    if (this.matched().has(tile.pair)) {
      return 'var(--c-success)';
    }
    if (this.wrong()?.includes(tile.key)) {
      return 'var(--c-danger)';
    }
    if (this.selected()?.key === tile.key) {
      return 'var(--c-accent)';
    }
    return 'var(--c-card-border)';
  }

  tap(tile: Tile): void {
    if (this.matched().has(tile.pair) || this.wrong()) {
      return;
    }
    const selected = this.selected();
    if (!selected) {
      this.selected.set(tile);
      return;
    }
    if (selected.key === tile.key) {
      this.selected.set(null);
      return;
    }
    this.moves.update((value) => value + 1);
    if (selected.pair === tile.pair && selected.kind !== tile.kind) {
      this.matched.update((current) => new Set([...current, tile.pair]));
      this.selected.set(null);
      return;
    }
    this.wrong.set([selected.key, tile.key]);
    if (this.wrongTimer) {
      clearTimeout(this.wrongTimer);
    }
    this.wrongTimer = setTimeout(() => {
      this.wrong.set(null);
      this.selected.set(null);
    }, 600);
  }
}
