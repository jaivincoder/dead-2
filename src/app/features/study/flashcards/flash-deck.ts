import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '@app/shared/ui/icon/icon';
import { Catalog } from '../catalog';
import type { Flashcard } from '../models';
import { paramId } from '../param';
import { shuffle } from '../util';

@Component({
  selector: 'app-flash-deck',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-xl">
      <a routerLink="/app/flashcards" class="sub-back">
        <ui-icon name="chevron-left" [size]="15" /> All flashcard sets
      </a>
      @if (set(); as current) {
        @if (card(); as face) {
          <div class="mb-3 flex items-center justify-between">
            <div>
              <div class="font-bold">{{ current.title }}</div>
              <span class="font-mono text-xs text-dim">{{ face.id }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="tag">{{ current.topic }}</span>
              <span class="font-mono text-xs text-dim">{{ index() + 1 }} / {{ deck().length }}</span>
            </div>
          </div>
          <div class="flip-scene select-none">
            <div
              class="flip-card cursor-pointer"
              role="button"
              tabindex="0"
              [class.is-flipped]="flipped()"
              [attr.aria-label]="flipped() ? 'Show term' : 'Show answer'"
              [attr.aria-pressed]="flipped()"
              (click)="flipped.set(!flipped())"
              (keydown)="onKey($event)"
            >
              <div class="flip-face border border-accent/30 bg-surface">
                <div>
                  <div class="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent">Term — tap to flip</div>
                  <div class="text-xl font-bold">{{ face.front }}</div>
                </div>
              </div>
              <div class="flip-face flip-face-back bg-primary text-on-primary">
                <div>
                  <div class="mb-3 font-mono text-[10px] uppercase tracking-widest text-on-primary-dim">
                    Answer
                  </div>
                  <div class="text-base">{{ face.back }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-between">
            <button type="button" class="btn-surface inline-flex items-center gap-1 px-4 py-2" (click)="step(-1)">
              <ui-icon name="chevron-left" [size]="15" /> Prev
            </button>
            <button type="button" class="btn-surface inline-flex items-center gap-1.5 px-4 py-2 text-accent" (click)="reshuffle()">
              <ui-icon name="shuffle" [size]="14" /> Shuffle
            </button>
            <button type="button" class="btn-primary inline-flex items-center gap-1 px-4 py-2 text-sm" (click)="step(1)">
              Next <ui-icon name="chevron-right" [size]="15" />
            </button>
          </div>
        }
      } @else {
        <p class="text-sm text-dim">That flashcard set isn't in the catalog.</p>
      }
    </div>
  `,
})
export class FlashDeck {
  private readonly catalog = inject(Catalog);
  readonly id = paramId();
  readonly set = signal(this.catalog.flashcardSet(this.id()));
  readonly deck = signal<readonly Flashcard[]>([]);
  readonly index = signal(0);
  readonly flipped = signal(false);
  readonly card = () => this.deck()[this.index()];

  constructor() {
    effect(() => {
      const next = this.catalog.flashcardSet(this.id());
      this.set.set(next);
      this.deck.set(next ? [...next.cards] : []);
      this.index.set(0);
      this.flipped.set(false);
    });
  }

  step(delta: number): void {
    const length = this.deck().length;
    if (!length) {
      return;
    }
    this.index.update((current) => (current + delta + length) % length);
    this.flipped.set(false);
  }

  reshuffle(): void {
    this.deck.update((cards) => shuffle(cards));
    this.index.set(0);
    this.flipped.set(false);
  }

  onKey(event: KeyboardEvent): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    this.flipped.update((value) => !value);
  }
}
