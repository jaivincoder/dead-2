import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fieldClasses, FieldSize } from '@app/shared/ui/field-classes';

type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'datetime-local';

@Component({
  selector: 'ui-input',
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
})
export class TextInput implements ControlValueAccessor {
  readonly type = input<InputType>('text');
  readonly size = input<FieldSize>('default');
  readonly placeholder = input('');
  readonly inputId = input<string>();
  readonly name = input('');
  readonly extraClass = input('');
  readonly autocomplete = input<string>();
  readonly invalid = input(false);
  readonly describedBy = input<string>();
  readonly isDisable = input(false);
  readonly min = input<string | number | null>(null);
  readonly max = input<string | number | null>(null);
  readonly step = input<string | number | null>(null);
  readonly maxlength = input<number | null>(null);

  readonly value = signal('');
  private readonly disabledByControl = signal(false);
  readonly inactive = computed(() => this.disabledByControl() || this.isDisable());
  readonly fieldClass = computed(() => {
    const kind = this.type();
    const date =
      kind === 'date' || kind === 'time' || kind === 'datetime-local' ? 'ui-date-field' : '';
    return fieldClasses(this.size(), `${date} ${this.extraClass()}`.trim());
  });

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByControl.set(isDisabled);
  }

  onInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.clampNumber(element);
    this.value.set(element.value);
    this.onChange(element.value);
  }

  touch(): void {
    this.onTouched();
  }

  blockInvalidKeys(event: KeyboardEvent): void {
    if (this.type() !== 'number') {
      return;
    }
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  private clampNumber(element: HTMLInputElement): void {
    if (this.type() !== 'number') {
      return;
    }
    const raw = element.value;
    if (raw === '' || raw === '.' || raw.endsWith('.')) {
      return;
    }
    const amount = Number(raw);
    if (!Number.isFinite(amount)) {
      return;
    }
    const max = this.max();
    const min = this.min();
    if (max !== null && amount > Number(max)) {
      element.value = String(max);
    } else if (min !== null && amount < Number(min)) {
      element.value = String(min);
    }
  }
}
