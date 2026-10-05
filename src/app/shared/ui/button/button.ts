import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'solid' | 'outline' | 'text';
export type ButtonColor = 'blue' | 'green' | 'red';

@Component({
  selector: 'ui-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex' },
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<ButtonVariant>('solid');
  readonly color = input<ButtonColor>('blue');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly extraClass = input('');
  readonly pressed = output<void>();

  readonly classes = computed(() => {
    const look = looks[`${this.variant()}-${this.color()}`];
    const busy = this.disabled() || this.loading() ? 'cursor-not-allowed opacity-60' : '';
    return [
      'inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-deep',
      look,
      busy,
      this.extraClass(),
    ]
      .filter(Boolean)
      .join(' ');
  });

  onPress(): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    this.pressed.emit();
  }
}

const looks: Record<`${ButtonVariant}-${ButtonColor}`, string> = {
  'solid-blue': 'bg-primary-deep text-white hover:bg-primary-ink',
  'solid-green': 'bg-success text-white hover:brightness-95',
  'solid-red': 'bg-danger text-white hover:brightness-95',
  'outline-blue': 'border border-primary-deep bg-white text-primary-deep hover:bg-surface',
  'outline-green': 'border border-success bg-white text-success hover:bg-surface',
  'outline-red': 'border border-danger bg-white text-danger hover:bg-surface',
  'text-blue': 'bg-transparent text-primary-deep hover:underline',
  'text-green': 'bg-transparent text-success hover:underline',
  'text-red': 'bg-transparent text-danger hover:underline',
};
